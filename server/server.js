/**
 * Main Server Application File
 * 
 * This is the entry point for the Alumni Interactive Website backend server.
 * It sets up the Express application, middleware, database connection, and routes.
 * 
 * Features:
 * - Express server configuration
 * - MongoDB database connection
 * - CORS middleware setup
 * - Static file serving
 * - Route registration
 * - Error handling middleware
 * 
 * Environment Variables Required:
 * - MONGODB_URI: MongoDB connection string
 * - PORT: Server port (defaults to 5000)
 * 
 * API Routes:
 * - /api/auth: Authentication routes
 * - /api/users: User management
 * - /api/sessions: Session management
 * - /api/statistics: Statistics and analytics
 * - /api/notifications: Notification system
 * 
 * Middleware:
 * - CORS: Cross-Origin Resource Sharing
 * - express.json(): JSON body parsing
 * - express.urlencoded(): URL-encoded body parsing
 * - Error handling middleware
 * 
 * @type {dynamic} - Server with real-time capabilities
 */

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  family: 4
})
.then(() => console.log('Connected to MongoDB Atlas'))
.catch((err) => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// Handle MongoDB connection errors
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

mongoose.connection.on('reconnected', () => {
  console.log('MongoDB reconnected');
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/otp', require('./routes/otp'));
app.use('/api/users', require('./routes/users'));
app.use('/api/sessions', require('./routes/sessions'));
app.use('/api/statistics', require('./routes/statistics'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/placements', require('./routes/placements'));
app.use('/api/gemini', require('./routes/gemini'));
app.use('/api/placementdrives', require('./routes/placementDrives'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 