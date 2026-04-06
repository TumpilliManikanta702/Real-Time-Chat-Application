const express = require('express');
const router = express.Router();
const {
  getMessages,
  createMessage,
  deleteMessage,
  togglePin,
} = require('../controllers/messageController');

router.get('/', getMessages);
router.post('/', createMessage);
router.delete('/:id', deleteMessage);
router.patch('/:id/pin', togglePin);

module.exports = router;
