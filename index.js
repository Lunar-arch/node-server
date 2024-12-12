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

// Use CORS middleware before defining routes
app.use(cors());

// Set up a simple route
app.get('/', (req, res) => {
  res.send('Server is running');
});

// Handle socket connections
io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);

  // Listen for ping from the client and respond with pong
  socket.on('ping_server', () => {
    console.log(`Ping received from: ${socket.id}`);
    socket.emit('pong_client');
  });

  // Listen for a message and send it back
  socket.on('send_message', (message) => {
    console.log(`Message received: ${message}`);
    socket.emit('receive_message', message);
  });

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
