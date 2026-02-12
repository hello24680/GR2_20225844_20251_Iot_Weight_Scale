const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

const seedUser = async () => {
  const hashedPassword = await bcrypt.hash('demo123', 10);
  
  const user = await prisma.user.upsert({
    where: { email: 'alex.johnson@smartscale.iot' },
    update: {},
    create: {
      name: 'Alex Johnson',
      email: 'alex.johnson@smartscale.iot',
      phone: '+1 (555) 123-4567',
      location: 'San Francisco, CA',
      bio: 'Fitness enthusiast tracking my progress daily. Love cycling and swimming.',
      password: hashedPassword,
      avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBXKPLYnrBjhuakf0rkrK7I87OON1_Bi7VBb5OY1VeKQPxIJZj_BwMBG9ENLP5Uw3AK6I9QhRFpKAGyUALKJn-AjRPcCtzRf_dDVqahRUmfNb9Oof5ulci_xlNyw2lGeVSVK91dMEr-dsTKQ6_5EdliHEapxSxGZ5DKfzXfgg7soEEIoG8qUJX7SV_D1YQqG01aJrUs_H-mml1mQXqFlJ7_ev1xVWohNZuhCnH01EPex6ybPLJMqdShB9sXIXHaGkoGAnrPG0MuZXAw',
      coverUrl: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      joinDate: 'August 2023'
    }
  });

  console.log('✅ Seeded user:', user.email);
};

const main = async () => {
  console.log('🌱 Seeding database...');
  await seedUser();
  console.log('✅ Seeding complete!');
};

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
