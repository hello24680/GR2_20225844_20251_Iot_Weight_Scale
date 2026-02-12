const prisma = require('../config/prisma.client');
const bcrypt = require('bcrypt');

// Get user profile (single user - first record)
const getProfile = async () => {
  const user = await prisma.user.findFirst({
    orderBy: { id: 'asc' }
  });

  if (!user) {
    throw new Error('User not found');
  }

  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

// Update user profile
const updateProfile = async (updateData) => {
  const user = await prisma.user.findFirst({
    orderBy: { id: 'asc' }
  });

  if (!user) {
    throw new Error('User not found');
  }

  // Hash password if provided
  if (updateData.password) {
    updateData.password = await bcrypt.hash(updateData.password, 10);
  }

  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: updateData
  });

  const { password, ...userWithoutPassword } = updatedUser;
  return userWithoutPassword;
};

module.exports = {
  getProfile,
  updateProfile
};
