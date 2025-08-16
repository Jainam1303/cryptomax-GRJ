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
connectDB(); // uses process.env.MONGO_URI

// Middleware
app.use(express.json({ extended: false }));
// Derive allowed origins from env for prod cleanliness
// ALLOW_ORIGINS should be a comma-separated list of origins
// Example: https://client.vercel.app,https://admin.vercel.app
const allowedOrigins = (process.env.ALLOW_ORIGINS || 'http://localhost:8080,http://localhost:5173')
  .split(',')
  .map(o => o.trim())
  .filter(Boolean);
const isWildcard = allowedOrigins.length === 1 && allowedOrigins[0] === '*';
// If wildcard, echo the request origin so credentials work ("*" with credentials is invalid in browsers)
const corsOptions = {
  origin: isWildcard
    ? function (origin, callback) { callback(null, true); }
    : allowedOrigins,
  credentials: true
};
app.use(cors(corsOptions));

// Ensure uploads directory exists (for QR uploads) via centralized resolver
const { getUploadsDir } = require('./config/uploads');
const uploadsDir = getUploadsDir();
console.log('📂 Uploads directory resolved to:', uploadsDir);
// Serve uploads directory for QR code images EARLY (before routes/error handlers)
app.use('/uploads', express.static(uploadsDir));

// Routes
app.use('/', routes);

// Error handler middleware (must be after routes)
app.use(errorHandler);

// Define port
const PORT = process.env.PORT || 5000;

// --- SOCKET.IO SETUP ---
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server, {
  cors: {
    origin: isWildcard ? '*' : allowedOrigins,
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
