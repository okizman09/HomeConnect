const Chat = require('../models/Chat');
const { sendEmailNotification } = require('../utils/email');
const User = require('../models/User');

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    // Join a room based on user ID
    socket.on('join', (userId) => {
      socket.join(userId);
      console.log(`User ${userId} joined room`);
    });

    // Handle sending messages
    socket.on('sendMessage', async (data) => {
      try {
        const { senderId, receiverId, message, listingId } = data;

        // Save message to database
        const chat = await Chat.create({
          senderId,
          receiverId,
          message,
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
      socket.to(data.receiverId).emit('userTyping', {
        senderId: data.senderId,
        isTyping: data.isTyping
      });
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
};
