const prisma = require('../config/prisma.client');

// Upsert device (create or update)
const upsertDevice = async ({ deviceId, name, status, caliFactor, offset }) => {
  return await prisma.device.upsert({
    where: { deviceId },
    update: {
      name,
      status,
      caliFactor,
      offset,
      lastSeen: new Date()
    },
    create: {
      deviceId,
      name,
      status: status || 'online',
      caliFactor: caliFactor || -20498.12,
      offset: offset || 0,
      lastSeen: new Date()
    }
  });
};

// Get device info (first device or latest)
const getDeviceInfo = async () => {
  const device = await prisma.device.findFirst({
    orderBy: {
      lastSeen: 'desc'
    }
  });

  if (!device) {
    throw new Error('No device found');
  }

  // Check online/offline (last_seen within 5 minutes)
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
  const isOnline = device.lastSeen > fiveMinutesAgo;

  return {
    id: device.id,
    deviceId: device.deviceId,
    name: device.name,
    status: isOnline ? 'online' : 'offline',
    caliFactor: device.caliFactor,
    offset: Number(device.offset), // Convert BigInt to Number
    lastSeen: device.lastSeen,
    createdAt: device.createdAt
  };
};

// Update device last seen (deprecated - now handled by upsertDevice)
const updateLastSeen = async (deviceId) => {
  const updated = await prisma.device.update({
    where: { deviceId },
    data: {
      lastSeen: new Date(),
      status: 'online',
    },
  });

  if (!updated) {
    throw new Error('Device not found');
  }

  return updated;
};

module.exports = {
  upsertDevice,
  getDeviceInfo,
  updateLastSeen,
};
