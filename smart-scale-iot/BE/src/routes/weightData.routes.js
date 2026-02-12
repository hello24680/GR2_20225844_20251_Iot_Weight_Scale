const express = require('express');
const { getWeights, getLatest, deleteWeight } = require('../controllers/weightDataController');

const router = express.Router();

// GET /api/weights - Get weight list (50 latest)
router.get('/', getWeights);

// GET /api/weights/latest - Get latest weight
router.get('/latest', getLatest);

// DELETE /api/weights/:id - Delete weight record
router.delete('/:id', deleteWeight);

module.exports = router;
