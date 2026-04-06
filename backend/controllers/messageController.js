const Message = require('../models/Message');

const getMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort({ timestamp: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createMessage = async (req, res) => {
  const { content, senderId } = req.body;
  if (!content || !content.trim() || !senderId) {
    return res.status(400).json({ message: 'Content and senderId are required' });
  }
  try {
    const newMessage = new Message({ content, senderId });
    const savedMessage = await newMessage.save();
    
    // Emit socket event
    const io = req.app.get('socketio');
    io.emit('receiveMessage', savedMessage);
    
    res.status(201).json(savedMessage);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteMessage = async (req, res) => {
  const { id } = req.params;
  const { type, userId } = req.body; // type: 'me' or 'everyone'

  try {
    const message = await Message.findById(id);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    if (message.isDeleted) {
      return res.status(400).json({ message: 'Message already deleted' });
    }

    if (type === 'me') {
      if (!message.deletedFor.includes(userId)) {
        message.deletedFor.push(userId);
      }
    } else if (type === 'everyone') {
      message.isDeleted = true;
      message.content = 'This message was deleted';
    } else {
      return res.status(400).json({ message: 'Invalid delete type' });
    }

    const updatedMessage = await message.save();
    
    // Emit socket event
    const io = req.app.get('socketio');
    io.emit('messageDeleted', updatedMessage);
    
    res.json(updatedMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const togglePin = async (req, res) => {
  const { id } = req.params;
  try {
    const message = await Message.findById(id);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    if (message.isDeleted) {
      return res.status(400).json({ message: 'Cannot pin deleted message' });
    }

    // Strict logic: if pinning, unpin all others
    if (!message.isPinned) {
      await Message.updateMany({ isPinned: true }, { isPinned: false });
    }

    // Toggle pin
    message.isPinned = !message.isPinned;
    const updatedMessage = await message.save();
    
    // Emit socket event
    const io = req.app.get('socketio');
    io.emit('pinToggled', updatedMessage);
    
    res.json(updatedMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getMessages,
  createMessage,
  deleteMessage,
  togglePin,
};
