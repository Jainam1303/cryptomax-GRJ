require('dotenv').config(); // 👈 Load .env first

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const routes = require('./routes');
const authRoutes = require('./routes/api/auth'); 
const { startCryptoTicker } = require('./services/cryptoTicker');

// Initialize Express
const app = express();

// Connect to MongoDB
connectDB(); // 👈 uses process.env.MONGO_URI

// Middleware
app.use(express.json({ extended: false }));
const corsOptions = {
  origin: [
    'http://localhost:8080',
    'http://localhost:5173',
    'https://cryptomax-4d3ejeovp-johns-projects-617e0ae6.vercel.app',
    'https://cryptomax-veqf-fm6z15t91-johns-projects-617e0ae6.vercel.app/'
  ],
  credentials: true
};
app.use(cors(corsOptions));

// Routes
app.use('/', routes);

// Error handler middleware (must be after routes)
app.use(errorHandler);

// Serve uploads directory for QR code images
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Define port
const PORT = process.env.PORT || 5000;

// --- SOCKET.IO SETUP ---
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server, {
  cors: {
    origin: [
      'http://localhost:8080',
      'http://localhost:5173'
    ],
    methods: ['GET', 'POST']
  }
});

// Make io available globally (for ticker and controllers)
app.set('io', io);
module.exports.io = io;

// --- SOCKET.IO CONNECTION HANDLER ---
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Start server
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
startCryptoTicker(io);

