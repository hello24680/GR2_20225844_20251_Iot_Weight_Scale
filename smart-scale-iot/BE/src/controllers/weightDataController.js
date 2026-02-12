const weightDataService = require('../services/weightDataService');

// GET /api/weights - Get weight list (50 latest records)
const getWeights = async (req, res, next) => {
  try {
    const weightDataList = await weightDataService.getWeights(50);
    
    res.json({
      success: true,
      data: weightDataList,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/weights/latest - Get latest weight
const getLatest = async (req, res, next) => {
  try {
    const latest = await weightDataService.getLatestWeight();
    
    res.json({
      success: true,
      data: latest,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/weights/:id - Delete weight record
const deleteWeight = async (req, res, next) => {
  try {
    const { id } = req.params;
    await weightDataService.deleteWeight(id);
    
    res.json({
      success: true,
      message: 'Weight record deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getWeights,
  getLatest,
  deleteWeight,
};
