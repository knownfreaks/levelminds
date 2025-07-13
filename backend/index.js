const express = require('express');
const cors = require('cors');
require('dotenv').config();
const path = require('path');
const { sequelize } = require('./models'); // Import from models/index.js

// --- Express App Setup ---
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test DB Connection
sequelize
  .authenticate()
  .then(() => console.log('Database connected...'))
  .catch((err) => console.log('Error: ' + err));

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.get('/', (req, res) => res.send('LevelMinds API is running...'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/schools', require('./routes/schoolRoutes'));
app.use('/api/students', require('./routes/studentRoutes'));
app.use('/api/jobs', require('./routes/jobRoutes'));
// Add other routes as needed, e.g., for file uploads
app.use('/api/upload', require('./routes/uploadRoutes'));


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));