const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const path = require('path');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Define your routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/wishes', require('./routes/wishes'));
app.use('/api/donations', require('./routes/donations'));

// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static(path.join(process.cwd(), 'client', 'build')));

  // For any routes not covered by the API, serve the frontend
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(process.cwd(), 'client', 'build', 'index.html'));
  });
}

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
