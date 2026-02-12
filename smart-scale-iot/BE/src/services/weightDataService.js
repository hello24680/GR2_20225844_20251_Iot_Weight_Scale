const prisma = require('../config/prisma.client');

// Create weight record
const createWeight = async ({ deviceId, weight, status }) => {
  return await prisma.weightData.create({
    data: {
      deviceId,
      weight: parseFloat(weight),
      status: status || 'stable',
      timestamp: new Date()
    }
  });
};

// Get weights history (all devices)
const getWeights = async (limit = 50) => {
  return await prisma.weightData.findMany({
    orderBy: {
      timestamp: 'desc',
    },
    take: limit,
  });
};

// Get latest weight (all devices)
const getLatestWeight = async () => {
  const latest = await prisma.weightData.findFirst({
    orderBy: {
      timestamp: 'desc',
    },
  });

  if (!latest) {
    throw new Error('No weight data found');
  }

  return latest;
};

// Delete weight record by ID
const deleteWeight = async (id) => {
  return await prisma.weightData.delete({
    where: {
      id: parseInt(id)
    }
  });
};

module.exports = {
  createWeight,
  getWeights,
  getLatestWeight,
  deleteWeight
};
