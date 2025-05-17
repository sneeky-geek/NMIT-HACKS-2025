import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import authRoutes from './routes/authRoutes.js';
import ngoRoutes from './routes/ngoRoutes.js';
import reelRoutes from './routes/reels.js';
import tokenRoutes from './routes/tokenRoutes.js';

// Load environment variables first
dotenv.config();

// Debug environment variables
console.log('Environment variables:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('TWILIO_ACCOUNT_SID exists:', !!process.env.TWILIO_ACCOUNT_SID);
console.log('TWILIO_AUTH_TOKEN exists:', !!process.env.TWILIO_AUTH_TOKEN);
console.log('TWILIO_VERIFY_SERVICE_SID exists:', !!process.env.TWILIO_VERIFY_SERVICE_SID);

// Get directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize express app
const app = express();
const PORT = process.env.PORT || 3000;
console.log("MONGODB_URI:", process.env.MONGODB_URI);

// CORS must be the very first middleware after express is initialized
app.use(cors({
  origin: function(origin, callback) {
    // For development, allow these origins and null (direct browser requests)
    const allowedOrigins = [
      'http://localhost:8080', // Primary frontend port
      'http://172.17.31.82:8080', // Network address
      'http://localhost:5173', // Fallback ports
      'http://localhost:8081',
      'http://localhost:8082',
      'http://localhost:8083'
    ];
    
    // In development, accept any origin
    if (process.env.NODE_ENV !== 'production') {
      callback(null, true);
      return;
    }
    
    // In production, be more strict
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true // Only if you need cookies/auth
}));

// THEN add body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log all requests
app.use((req, res, next) => {
  console.log(`Request: ${req.method} ${req.url}`);
  next();
});

// Debug middleware to log all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  console.log('Request headers:', req.headers);
  next();
});

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '..', process.env.UPLOAD_DIR || 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve static files from uploads directory
app.use('/uploads', express.static(uploadsDir));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/ngo', ngoRoutes);
app.use('/api/reels', reelRoutes);
app.use('/api/tokens', tokenRoutes);

// Basic route for testing
app.get('/api/test', (req, res) => {
  console.log('GET /api/test accessed');
  try {
    return res.status(200).json({ success: true, message: 'API is accessible' });
  } catch (error) {
    console.error('Error in /api/test:', error);
    return res.status(500).send('Server error in test endpoint');
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Server error',
    error: process.env.NODE_ENV === 'production' ? null : err.message
  });
});

// Start server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Start listening
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
