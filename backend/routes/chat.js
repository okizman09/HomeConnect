const express = require('express');
const {
  getChatHistory,
  sendMessage,
  getConversations
} = require('../controllers/chatController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/conversations', getConversations);
router.get('/:userId', getChatHistory);
router.post('/', sendMessage);
router.put('/read/:senderId', require('../controllers/chatController').markMessagesRead);

module.exports = router;
