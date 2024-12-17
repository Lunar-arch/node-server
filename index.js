const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

// Create the app and server
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*', // Allow all origins (use specific origin(s) in production for security)
    methods: ['GET', 'POST'],
  },
});

// Use CORS middleware
app.use(cors());

// In-memory message store (consider using a database in production)
const messageHistory = [];
const users = {}; // Object to store userId -> socketId mapping

// Set up a simple route
app.get('/', (req, res) => {
  res.send('Server is running');
});

// Handle socket connections
io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);

  // Send message history to the newly connected client
  socket.emit('message_history', messageHistory);

  // Listen for user registration
  socket.on('register_user', (userId) => {
    users[userId] = socket.id; // Map userId to socketId
    console.log(`User registered: ${userId} -> ${socket.id}`);
  });

  // Listen for incoming messages
  socket.on('send_message', (message) => {
    console.log(`Message received from ${message.id}: ${message.message}`);

    // Add message to history
    messageHistory.push(message);

    // Broadcast the message to all clients, including the sender
    io.emit('receive_message', message);
  });

  // Handle client disconnection
  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);

    // Find and remove the disconnected user from the mapping
    for (const [userId, socketId] of Object.entries(users)) {
      if (socketId === socket.id) {
        delete users[userId];
        console.log(`User removed: ${userId}`);
        break;
      }
    }
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
