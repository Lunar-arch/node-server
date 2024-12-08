const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

// Create the app and server
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Use CORS middleware before defining routes
app.use(cors());

// Set up a simple route
app.get('/', (req, res) => {
  res.send('Server is running');
});

// Handle socket connections
io.on('connection', (socket) => {
  console.log('A user connected');
  
  // Listen for messages from the client
  socket.on('send_message', (message) => {
    console.log('Received message: ', message);
    
    // Simply emit the message back to the client
    socket.emit('receive_message', message);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
