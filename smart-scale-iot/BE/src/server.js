require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { prisma } = require('./config');
const { initMQTT } = require('./config/mqtt');
const { setupMQTTHandlers } = require('./libs/mqttHandler');
const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');

const PORT = process.env.PORT || 3000;

// Create Express app
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Welcome route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Smart Scale IoT Backend API - Demo Version',
    version: '1.0.0',
    endpoints: {
      weights: '/api/weights',
      latestWeight: '/api/weights/latest',
      device: '/api/device',
    },
  });
});

// API routes
app.use('/api', routes);

// Error handler (must be last)
app.use(errorHandler);

// Test kết nối database
const testDatabaseConnection = async () => {
  try {
    await prisma.$connect();
    console.log('Database connection successful');
  } catch (error) {
    console.error('Database connection failed:', error.message);
    process.exit(1);
  }
};

// Start server
const startServer = async () => {
  try {
    // Test database
    await testDatabaseConnection();

    // Initialize MQTT
    console.log('[Server] Initializing MQTT...');
    const mqttClient = initMQTT();
    setupMQTTHandlers(mqttClient);

    // Start HTTP server
    app.listen(PORT, () => {
      console.log('');
      console.log('═══════════════════════════════════════════');
      console.log('Smart Scale Backend');
      console.log('═══════════════════════════════════════════');
      console.log(`Port: ${PORT}`);
      console.log(`API: http://localhost:${PORT}/api`);
      console.log(`Env: ${process.env.NODE_ENV || 'development'}`);
      console.log('═══════════════════════════════════════════');
      console.log('');
    });

  } catch (error) {
    console.error('[Server] Failed to start:', error);
    process.exit(1);
  }
};

startServer();
