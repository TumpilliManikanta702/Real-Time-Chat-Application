const Message = require('../models/Message');

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Debug all events
    socket.onAny((eventName, ...args) => {
      console.log(`Received event: ${eventName}`, args);
    });

    socket.on('ping', () => {
      console.log('Received ping from client');
      socket.emit('pong');
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
};
