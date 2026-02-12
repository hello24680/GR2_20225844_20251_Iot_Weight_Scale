const express = require('express');
const weightDataRoutes = require('./weightData.routes');
const deviceRoutes = require('./device.routes');
const userRoutes = require('./user.routes');

const router = express.Router();

// Mount routes
router.use('/weights', weightDataRoutes);
router.use('/device', deviceRoutes);
router.use('/users', userRoutes);

module.exports = router;
