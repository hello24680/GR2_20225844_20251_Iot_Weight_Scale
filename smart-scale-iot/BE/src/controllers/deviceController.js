const deviceService = require('../services/deviceService');

// GET /api/device - Get device info
const getDeviceInfo = async (req, res, next) => {
  try {
    const device = await deviceService.getDeviceInfo();
    
    res.json({
      success: true,
      data: device,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDeviceInfo,
};
