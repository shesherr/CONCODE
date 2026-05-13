const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { initDatabase } = require('./db');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'CONCODE API is running' });
});

// Start server
async function startServer() {
  console.log('');
  console.log('🚀 CONCODE Backend Server');
  console.log('========================');
  console.log('');

  // Initialize database
  await initDatabase();

  app.listen(PORT, () => {
    console.log('');
    console.log(`🌐 Server running at http://localhost:${PORT}`);
    console.log(`📡 API endpoint: http://localhost:${PORT}/api`);
    console.log('');
    console.log('Available routes:');
    console.log('  POST /api/auth/register');
    console.log('  POST /api/auth/login');
    console.log('  GET  /api/health');
    console.log('');
  });
}

startServer();
