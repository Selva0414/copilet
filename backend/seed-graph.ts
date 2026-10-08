import { prisma } from './src/prisma.js';

async function seed() {
  const user = await prisma.user.findFirst();
  if (!user) {
    console.log("No user found");
    return;
  }

  // Generate data for the past 6 days
  for (let i = 6; i >= 1; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);

    await prisma.sleepRecord.create({
      data: {
        userId: user.id,
        duration: Math.floor(Math.random() * (9 - 5 + 1) + 5), // 5 to 9 hours
        quality: 'Good',
        date: d
      }
    });

    await prisma.dailyActivity.create({
      data: {
        userId: user.id,
        steps: Math.floor(Math.random() * (12000 - 4000 + 1) + 4000), // 4k to 12k
        date: d
      }
    });
  }

  console.log("Seeded past 6 days of data");
}

seed().catch(e => console.error(e)).finally(() => prisma.$disconnect());
