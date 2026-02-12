const userService = require('../services/userService');

// GET /api/users/profile
const getProfile = async (req, res, next) => {
  try {
    const user = await userService.getProfile();
    
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/users/profile
const updateProfile = async (req, res, next) => {
  try {
    const updatedUser = await userService.updateProfile(req.body);
    
    res.json({
      success: true,
      data: updatedUser
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile
};
