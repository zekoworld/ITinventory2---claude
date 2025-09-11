import { PrismaClient, UserRole, JobStatus, WorkStyle, AssetStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@company.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@company.com',
      role: UserRole.ADMIN,
      jobStatus: JobStatus.Active,
      workStyle: WorkStyle.Onsite,
      currentAddress: 'Main Office, 123 Business St',
      homeAddress: '456 Home Ave',
    },
  });

  const sampleUser = await prisma.user.upsert({
    where: { email: 'john.doe@company.com' },
    update: {},
    create: {
      name: 'John Doe',
      email: 'john.doe@company.com',
      role: UserRole.VIEWER,
      jobStatus: JobStatus.Active,
      workStyle: WorkStyle.Hybrid,
      currentAddress: 'Main Office, 123 Business St',
      homeAddress: '789 Remote St',
    },
  });

  const laptop1 = await prisma.hardware.upsert({
    where: { assetTag: 'LAP-001' },
    update: {},
    create: {
      name: 'MacBook Pro 16"',
      manufacturer: 'Apple',
      category: 'Laptop',
      assetTag: 'LAP-001',
      status: AssetStatus.Setup,
      purchaseDate: new Date('2024-01-15'),
      warrantyEndDate: new Date('2026-01-15'),
      deploymentSetupDate: new Date(),
    },
  });

  const laptop2 = await prisma.hardware.upsert({
    where: { assetTag: 'LAP-002' },
    update: {},
    create: {
      name: 'ThinkPad X1 Carbon',
      manufacturer: 'Lenovo',
      category: 'Laptop',
      assetTag: 'LAP-002',
      status: AssetStatus.InUse,
      assignedToUserId: sampleUser.id,
      purchaseDate: new Date('2024-02-01'),
      warrantyEndDate: new Date('2026-02-01'),
      firstInUseAssetDate: new Date('2024-02-15'),
      userInUseDate: new Date('2024-02-15'),
    },
  });

  await prisma.history.create({
    data: {
      hardwareId: laptop1.id,
      status: AssetStatus.Setup,
      location: 'SetupShelf',
      changedBy: 'System',
      note: 'Initial asset creation',
    },
  });

  await prisma.history.create({
    data: {
      hardwareId: laptop2.id,
      status: AssetStatus.InUse,
      location: 'Storage',
      changedBy: 'Admin',
      userId: sampleUser.id,
      note: 'Deployed to John Doe',
    },
  });

  console.log('✅ Seed completed successfully!');
  console.log(`👤 Created users: ${adminUser.name}, ${sampleUser.name}`);
  console.log(`💻 Created hardware: ${laptop1.assetTag}, ${laptop2.assetTag}`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:');
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
