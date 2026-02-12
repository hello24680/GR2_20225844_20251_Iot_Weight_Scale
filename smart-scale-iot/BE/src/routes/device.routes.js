const express = require('express');
const { getDeviceInfo } = require('../controllers/deviceController');

const router = express.Router();

// GET /api/device - Get device info
router.get('/', getDeviceInfo);

module.exports = router;
