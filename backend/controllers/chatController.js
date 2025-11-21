const Chat = require('../models/Chat');
const User = require('../models/User');
const { sendEmailNotification } = require('../utils/email');

// @desc    Get chat history between two users
// @route   GET /api/chat/:userId
// @access  Private
exports.getChatHistory = async (req, res) => {
  try {
    const { userId } = req.params;

    const messages = await Chat.find({
      $or: [
        { senderId: req.user._id, receiverId: userId },
        { senderId: userId, receiverId: req.user._id }
      ]
    }).sort({ timestamp: 1 })
      .populate('senderId', 'name')
      .populate('receiverId', 'name');

    res.status(200).json({
      success: true,
      messages
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching chat history'
    });
  }
};

// @desc    Send a message
// @route   POST /api/chat
// @access  Private
exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, message, listingId } = req.body;

    const chat = await Chat.create({
      senderId: req.user._id,
      receiverId,
      message,
      listingId
    });

    // Send email notification to receiver
    const receiver = await User.findById(receiverId);
    if (receiver) {
      await sendEmailNotification(receiver.email, req.user.name);
    }

    res.status(201).json({
      success: true,
      chat
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error sending message'
    });
  }
};

// @desc    Get all conversations for a user
// @route   GET /api/chat/conversations
// @access  Private
exports.getConversations = async (req, res) => {
  try {
    const conversations = await Chat.aggregate([
      {
        $match: {
          $or: [
            { senderId: req.user._id },
            { receiverId: req.user._id }
          ]
        }
      },
      {
        $sort: { timestamp: -1 }
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ['$senderId', req.user._id] },
              '$receiverId',
              '$senderId'
            ]
          },
          lastMessage: { $first: '$message' },
          lastTimestamp: { $first: '$timestamp' },
          unread: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ['$receiverId', req.user._id] },
                    { $eq: ['$read', false] }
                  ]
                },
                1,
                0
              ]
            }
          }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
      },
      {
        $project: {
          userId: '$_id',
          userName: '$user.name',
          userEmail: '$user.email',
          lastMessage: 1,
          lastTimestamp: 1,
          unread: 1
        }
      },
      {
        $sort: { lastTimestamp: -1 }
      }
    ]);

    res.status(200).json({
      success: true,
      conversations
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error fetching conversations'
    });
  }
};
