const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// Import routes
const auth = require('./routes/authRoutes');
const ideas = require('./routes/ideaRoutes');
const interactions = require('./routes/interactionRoutes');
const analytics = require('./routes/analyticsRoutes');
const notifications = require('./routes/notificationRoutes');

// Import middleware
const errorHandler = require('./middleware/error');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.use('/api/auth', auth);
app.use('/api/ideas', ideas);
app.use('/api/interactions', interactions);
app.use('/api/analytics', analytics);
app.use('/api/notifications', notifications);

// Basic Route
app.get('/', (req, res) => {
  res.json({ message: 'Startup Idea Validation Platform API is running...' });
});

// Error handler middleware (must be after routes)
app.use(errorHandler);

// Port Configuration
const PORT = process.env.PORT || 5000;

// Note: MongoDB connection will be added in a later step once URI is provided.

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
console.log("hi");