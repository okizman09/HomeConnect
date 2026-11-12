const jwt = require('jsonwebtoken');
const Chat = require('../models/Chat');
const { sendEmailNotification } = require('../utils/email');
const User = require('../models/User');

module.exports = (io) => {
  // userId -> Set of socket ids (one user may have several tabs/devices)
  const onlineUsers = new Map();

  const broadcastOnlineUsers = () => {
    io.emit('onlineUsers', [...onlineUsers.keys()]);
  };

  // Reject unauthenticated sockets: every connection must carry a valid JWT
  // (client sends it as the `auth.token` handshake field).
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth && socket.handshake.auth.token;
      if (!token) return next(new Error('Authentication failed: missing token'));
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('_id');
      if (!user) return next(new Error('Authentication failed: user not found'));
      socket.userId = user._id.toString();
      next();
    } catch (err) {
      next(new Error('Authentication failed: invalid token'));
    }
  });

  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    // Join the authenticated user's own room right away. The legacy 'join'
    // event is kept for compatibility but can only join your own room.
    socket.join(socket.userId);
    if (!onlineUsers.has(socket.userId)) onlineUsers.set(socket.userId, new Set());
    onlineUsers.get(socket.userId).add(socket.id);
    broadcastOnlineUsers();

    socket.on('join', (userId) => {
      if (!userId || userId !== socket.userId) return;
      socket.join(socket.userId);
      console.log(`User ${socket.userId} joined room`);
    });

    // Handle sending messages
    socket.on('sendMessage', async (data) => {
      try {
        const { receiverId, message, listingId } = data || {};
        // Sender always comes from the verified token, never the client.
        const senderId = socket.userId;

        if (!receiverId) {
          return socket.emit('messageError', { error: 'receiverId is required' });
        }
        if (!message || !String(message).trim()) {
          return socket.emit('messageError', { error: 'Message cannot be empty' });
        }

        // Save message to database
        const chat = await Chat.create({
          senderId,
          receiverId,
          message: String(message).trim(),
          listingId
        });

        // Populate sender info
        await chat.populate('senderId', 'name');

        // Emit to receiver
        io.to(receiverId).emit('receiveMessage', chat);

        // Send email notification
        const receiver = await User.findById(receiverId);
        const sender = await User.findById(senderId);
        
        if (receiver && sender) {
          await sendEmailNotification(receiver.email, sender.name);
        }

        // Acknowledge to sender
        socket.emit('messageSent', { success: true, chat });
      } catch (error) {
        console.error('Socket error:', error);
        socket.emit('messageError', { error: 'Failed to send message' });
      }
    });

    // Handle typing indicator
    socket.on('typing', (data) => {
      if (!data || !data.receiverId) return;
      socket.to(data.receiverId).emit('userTyping', {
        senderId: socket.userId,
        isTyping: data.isTyping
      });
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
      const userId = socket.userId;
      if (userId && onlineUsers.has(userId)) {
        const sockets = onlineUsers.get(userId);
        sockets.delete(socket.id);
        if (sockets.size === 0) onlineUsers.delete(userId);
        broadcastOnlineUsers();
      }
    });
  });
};
