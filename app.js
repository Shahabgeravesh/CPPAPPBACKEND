require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // In production, restrict this to your app's domain
    methods: ["GET", "POST"]
  }
});

app.use(express.json());

// Store connected clients
let connectedClients = new Set();

// Socket.IO connection handler
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  connectedClients.add(socket.id);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    connectedClients.delete(socket.id);
  });
});

// Verify Apple's JWT signature
const verifyAppleJWT = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    // In production, verify the JWT with Apple's public key
    // For now, we'll just decode it
    const decoded = jwt.decode(token);
    if (!decoded) {
      throw new Error('Invalid token');
    }
    req.applePayload = decoded;
    next();
  } catch (error) {
    console.error('JWT verification failed:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Apple webhook endpoint
app.post('/apple-webhook', verifyAppleJWT, (req, res) => {
  try {
    const notification = req.body;
    console.log('Received App Store notification:', notification);

    // Emit to all connected clients
    io.emit('purchase_received', {
      type: notification.notificationType,
      subtype: notification.subtype,
      data: notification.data,
      timestamp: new Date().toISOString()
    });

    res.status(200).json({ status: 'success' });
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
