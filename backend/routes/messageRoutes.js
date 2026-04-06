const express = require('express');
const router = express.Router();
const {
  getMessages,
  createMessage,
  deleteMessage,
  togglePin,
} = require('../controllers/messageController');

router.get('/messages', getMessages);
router.post('/messages', createMessage);
router.delete('/messages/:id', deleteMessage);
router.patch('/messages/:id/pin', togglePin);

module.exports = router;
