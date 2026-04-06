const express = require('express');
const app = express();

const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const messageRoutes = require('./routes/messageRoutes');
const socketHandler = require('./sockets/socket');

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  },
  allowEIO3: true // Support older clients if any
});

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use('/', messageRoutes);

// Socket.io logic
socketHandler(io);

// Make io accessible to routes
app.set('socketio', io);

// MongoDB connection
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/chat-app';

console.log('Attempting to connect to MongoDB...');
mongoose.connect(MONGODB_URI)
.then(() => {
  console.log('Successfully connected to MongoDB');
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is listening on http://0.0.0.0:${PORT}`);
  });
})
.catch((err) => {
  console.error('Error connecting to MongoDB:', err.message);
});
