const mongoose = require('mongoose');
const Message = require('./models/Message');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/chat-app';

const sampleMessages = [
  {
    content: "Welcome to the global chat!",
    senderId: "user1",
    timestamp: new Date(Date.now() - 10000),
  },
  {
    content: "Hi everyone, Bob here.",
    senderId: "user2",
    timestamp: new Date(Date.now() - 9000),
  },
  {
    content: "Did anyone see the latest news?",
    senderId: "user3",
    timestamp: new Date(Date.now() - 8000),
  },
  {
    content: "This is a pinned announcement!",
    senderId: "user1",
    timestamp: new Date(Date.now() - 7000),
    isPinned: true,
  },
  {
    content: "Secret message (deleted)",
    senderId: "user4",
    timestamp: new Date(Date.now() - 6000),
    isDeleted: true,
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB for seeding');

    await Message.deleteMany({});
    console.log('Cleared existing messages');

    await Message.insertMany(sampleMessages);
    console.log('Sample messages inserted');

    process.exit(0);
  } catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1);
  }
};

seedDB();
