const { PrismaClient } = require('@prisma/client');

// Tạo Prisma Client singleton
const prisma = new PrismaClient();

// Xử lý khi tắt ứng dụng  
process.on('beforeExit', async () => {
    await prisma.$disconnect();
});

module.exports = prisma;
