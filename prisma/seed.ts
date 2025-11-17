import { PrismaClient, UserRole, JobStatus, WorkStyle, AssetStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting comprehensive seed...');

  // ===== USERS =====
  
  // Active users with different work styles
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@company.com' },
    update: {},
    create: {
      id: 'user_admin_001',
      name: 'Admin User',
      email: 'admin@company.com',
      role: UserRole.ADMIN,
      jobStatus: JobStatus.Active,
      workStyle: WorkStyle.Onsite,
      currentAddress: 'Main Office, 123 Business Street, New York, NY 10001',
      homeAddress: '456 Home Avenue, Brooklyn, NY 11201',
    },
  });

  const onsiteUser = await prisma.user.upsert({
    where: { email: 'john.onsite@company.com' },
    update: {},
    create: {
      id: 'user_onsite_001',
      name: 'John Onsite',
      email: 'john.onsite@company.com',
      role: UserRole.VIEWER,
      jobStatus: JobStatus.Active,
      workStyle: WorkStyle.Onsite,
      currentAddress: 'Main Office, 123 Business Street, New York, NY 10001',
    },
  });

  const remoteUser = await prisma.user.upsert({
    where: { email: 'sarah.remote@company.com' },
    update: {},
    create: {
      id: 'user_remote_001',
      name: 'Sarah Remote',
      email: 'sarah.remote@company.com',
      role: UserRole.VIEWER,
      jobStatus: JobStatus.Active,
      workStyle: WorkStyle.Remote,
      currentAddress: 'Remote - California Office',
      homeAddress: '789 Beach Road, Los Angeles, CA 90001',
    },
  });

  const hybridUser = await prisma.user.upsert({
    where: { email: 'mike.hybrid@company.com' },
    update: {},
    create: {
      id: 'user_hybrid_001',
      name: 'Mike Hybrid',
      email: 'mike.hybrid@company.com',
      role: UserRole.VIEWER,
      jobStatus: JobStatus.Active,
      workStyle: WorkStyle.Hybrid,
      currentAddress: 'Main Office, 123 Business Street, New York, NY 10001',
      homeAddress: '321 Suburb Lane, Queens, NY 11101',
    },
  });

  // Departed user
  const departedUser = await prisma.user.upsert({
    where: { email: 'former.employee@company.com' },
    update: {},
    create: {
      id: 'user_departed_001',
      name: 'Former Employee',
      email: 'former.employee@company.com',
      role: UserRole.VIEWER,
      jobStatus: JobStatus.Departed,
      workStyle: WorkStyle.Onsite,
      currentAddress: 'N/A',
    },
  });

  // Retired user
  const retiredUser = await prisma.user.upsert({
    where: { email: 'retired.person@company.com' },
    update: {},
    create: {
      id: 'user_retired_001',
      name: 'Retired Person',
      email: 'retired.person@company.com',
      role: UserRole.VIEWER,
      jobStatus: JobStatus.Retired,
      workStyle: WorkStyle.Onsite,
      currentAddress: 'N/A',
    },
  });

  console.log('✅ Created 6 users (Active, Departed, Retired)');

  // ===== HARDWARE - SETUP STATUS =====
  
  const setupLaptop = await prisma.hardware.upsert({
    where: { assetTag: 'LAP-SETUP-001' },
    update: {},
    create: {
      id: 'hw_setup_001',
      name: 'Dell XPS 15 - New Arrival',
      manufacturer: 'Dell',
      category: 'Laptop',
      assetTag: 'LAP-SETUP-001',
      status: AssetStatus.Setup,
      purchaseDate: new Date('2024-11-01'),
      warrantyEndDate: new Date('2027-11-01'),
      deploymentSetupDate: new Date('2024-11-15'),
    },
  });

  // ===== HARDWARE - TO BE DEPLOYED =====
  
  const toBeDeployedLaptop = await prisma.hardware.upsert({
    where: { assetTag: 'LAP-DEPLOY-001' },
    update: {},
    create: {
      id: 'hw_deploy_001',
      name: 'MacBook Pro 16" - Ready for Deploy',
      manufacturer: 'Apple',
      category: 'Laptop',
      assetTag: 'LAP-DEPLOY-001',
      status: AssetStatus.ToBeDeployed,
      purchaseDate: new Date('2024-10-15'),
      warrantyEndDate: new Date('2027-10-15'),
      toBeDeployedDate: new Date(),
      assignedToUserId: hybridUser.id, // Pre-assigned
    },
  });

  const toBeDeployedPhone = await prisma.hardware.upsert({
    where: { assetTag: 'PHN-DEPLOY-001' },
    update: {},
    create: {
      id: 'hw_deploy_002',
      name: 'iPhone 15 Pro - Unassigned',
      manufacturer: 'Apple',
      category: 'Phone',
      assetTag: 'PHN-DEPLOY-001',
      status: AssetStatus.ToBeDeployed,
      purchaseDate: new Date('2024-11-10'),
      warrantyEndDate: new Date('2025-11-10'),
      toBeDeployedDate: new Date(),
    },
  });

  // ===== HARDWARE - IN USE =====
  
  const inUseLaptop1 = await prisma.hardware.upsert({
    where: { assetTag: 'LAP-USE-001' },
    update: {},
    create: {
      id: 'hw_use_001',
      name: 'ThinkPad X1 Carbon - Onsite User',
      manufacturer: 'Lenovo',
      category: 'Laptop',
      assetTag: 'LAP-USE-001',
      status: AssetStatus.InUse,
      assignedToUserId: onsiteUser.id,
      purchaseDate: new Date('2024-06-01'),
      warrantyEndDate: new Date('2026-06-01'),
      firstInUseAssetDate: new Date('2024-06-15'),
      userInUseDate: new Date('2024-06-15'),
    },
  });

  const inUseLaptop2 = await prisma.hardware.upsert({
    where: { assetTag: 'LAP-USE-002' },
    update: {},
    create: {
      id: 'hw_use_002',
      name: 'MacBook Air M2 - Remote User',
      manufacturer: 'Apple',
      category: 'Laptop',
      assetTag: 'LAP-USE-002',
      status: AssetStatus.InUse,
      assignedToUserId: remoteUser.id,
      purchaseDate: new Date('2024-07-01'),
      warrantyEndDate: new Date('2027-07-01'),
      firstInUseAssetDate: new Date('2024-07-10'),
      userInUseDate: new Date('2024-07-10'),
    },
  });

  const inUseMonitor = await prisma.hardware.upsert({
    where: { assetTag: 'MON-USE-001' },
    update: {},
    create: {
      id: 'hw_use_003',
      name: 'Dell UltraSharp 27" Monitor',
      manufacturer: 'Dell',
      category: 'Monitor',
      assetTag: 'MON-USE-001',
      status: AssetStatus.InUse,
      assignedToUserId: adminUser.id,
      purchaseDate: new Date('2024-05-01'),
      warrantyEndDate: new Date('2027-05-01'),
      firstInUseAssetDate: new Date('2024-05-05'),
      userInUseDate: new Date('2024-05-05'),
    },
  });

  // ===== HARDWARE - TO BE REPAIRED =====
  
  const toBeRepairedLaptop = await prisma.hardware.upsert({
    where: { assetTag: 'LAP-REPAIR-001' },
    update: {},
    create: {
      id: 'hw_repair_001',
      name: 'HP EliteBook - Screen Damage',
      manufacturer: 'HP',
      category: 'Laptop',
      assetTag: 'LAP-REPAIR-001',
      status: AssetStatus.ToBeRepaired,
      purchaseDate: new Date('2024-03-01'),
      warrantyEndDate: new Date('2027-03-01'),
      reportedToRepairDate: new Date(),
    },
  });

  // ===== HARDWARE - UNDER REPAIR =====
  
  const underRepairPhone = await prisma.hardware.upsert({
    where: { assetTag: 'PHN-REPAIR-001' },
    update: {},
    create: {
      id: 'hw_repair_002',
      name: 'Samsung Galaxy S23 - Battery Issue',
      manufacturer: 'Samsung',
      category: 'Phone',
      assetTag: 'PHN-REPAIR-001',
      status: AssetStatus.UnderRepair,
      purchaseDate: new Date('2024-04-01'),
      warrantyEndDate: new Date('2025-04-01'),
      reportedToRepairDate: new Date('2024-11-01'),
      underRepairDate: new Date('2024-11-05'),
    },
  });

  // ===== HARDWARE - REPAIRED =====
  
  const repairedKeyboard = await prisma.hardware.upsert({
    where: { assetTag: 'KEY-REPAIR-001' },
    update: {},
    create: {
      id: 'hw_repair_003',
      name: 'Mechanical Keyboard - Fixed',
      manufacturer: 'Logitech',
      category: 'Keyboard',
      assetTag: 'KEY-REPAIR-001',
      status: AssetStatus.Repaired,
      purchaseDate: new Date('2024-02-01'),
      reportedToRepairDate: new Date('2024-10-15'),
      underRepairDate: new Date('2024-10-18'),
      repairedDate: new Date('2024-10-25'),
    },
  });

  // ===== HARDWARE - RETIRED =====
  
  const retiredLaptop = await prisma.hardware.upsert({
    where: { assetTag: 'LAP-RETIRED-001' },
    update: {},
    create: {
      id: 'hw_retired_001',
      name: 'Old MacBook Pro 2018 - End of Life',
      manufacturer: 'Apple',
      category: 'Laptop',
      assetTag: 'LAP-RETIRED-001',
      status: AssetStatus.Retired,
      purchaseDate: new Date('2018-05-01'),
      warrantyEndDate: new Date('2021-05-01'),
      retiredDate: new Date('2024-10-01'),
    },
  });

  const retiredMouse = await prisma.hardware.upsert({
    where: { assetTag: 'MOU-RETIRED-001' },
    update: {},
    create: {
      id: 'hw_retired_002',
      name: 'Wireless Mouse - Broken',
      manufacturer: 'Logitech',
      category: 'Mouse',
      assetTag: 'MOU-RETIRED-001',
      status: AssetStatus.Retired,
      purchaseDate: new Date('2023-01-01'),
      retiredDate: new Date('2024-11-01'),
    },
  });

  console.log('✅ Created 12 hardware assets covering all statuses');

  // ===== HISTORY ENTRIES =====
  
  // Setup laptop history
  await prisma.history.create({
    data: {
      hardwareId: setupLaptop.id,
      status: AssetStatus.Setup,
      location: 'SetupShelf',
      changedBy: 'System',
      note: 'New asset received and initialized',
    },
  });

  // To Be Deployed history
  await prisma.history.createMany({
    data: [
      {
        hardwareId: toBeDeployedLaptop.id,
        status: AssetStatus.Setup,
        location: 'SetupShelf',
        changedBy: 'Admin User',
        note: 'Asset configured',
        date: new Date('2024-10-16'),
      },
      {
        hardwareId: toBeDeployedLaptop.id,
        status: AssetStatus.ToBeDeployed,
        location: 'DeploymentShelf',
        changedBy: 'Admin User',
        note: 'Ready for deployment to Mike Hybrid',
        date: new Date(),
      },
    ],
  });

  // In Use laptop history (multiple transitions)
  await prisma.history.createMany({
    data: [
      {
        hardwareId: inUseLaptop1.id,
        status: AssetStatus.Setup,
        location: 'SetupShelf',
        changedBy: 'Admin User',
        note: 'Initial setup completed',
        date: new Date('2024-06-02'),
      },
      {
        hardwareId: inUseLaptop1.id,
        status: AssetStatus.ToBeDeployed,
        location: 'DeploymentShelf',
        changedBy: 'Admin User',
        note: 'Ready for John Onsite',
        date: new Date('2024-06-14'),
      },
      {
        hardwareId: inUseLaptop1.id,
        status: AssetStatus.InUse,
        location: 'Storage',
        changedBy: 'Admin User',
        userId: onsiteUser.id,
        note: 'Deployed to John Onsite',
        date: new Date('2024-06-15'),
      },
    ],
  });

  // Repair flow history (complete cycle)
  await prisma.history.createMany({
    data: [
      {
        hardwareId: underRepairPhone.id,
        status: AssetStatus.InUse,
        location: 'Storage',
        changedBy: 'Admin User',
        note: 'Initially deployed to user',
        date: new Date('2024-04-05'),
      },
      {
        hardwareId: underRepairPhone.id,
        status: AssetStatus.ToBeRepaired,
        location: 'DamagedShelf',
        changedBy: 'Admin User',
        note: 'Battery draining quickly - reported by user',
        date: new Date('2024-11-01'),
      },
      {
        hardwareId: underRepairPhone.id,
        status: AssetStatus.UnderRepair,
        location: 'UnderRepairShelf',
        changedBy: 'Admin User',
        note: 'Sent to Samsung authorized service center',
        date: new Date('2024-11-05'),
      },
    ],
  });

  // Repaired keyboard history
  await prisma.history.createMany({
    data: [
      {
        hardwareId: repairedKeyboard.id,
        status: AssetStatus.ToBeRepaired,
        location: 'DamagedShelf',
        changedBy: 'Admin User',
        note: 'Keys not responding',
        date: new Date('2024-10-15'),
      },
      {
        hardwareId: repairedKeyboard.id,
        status: AssetStatus.UnderRepair,
        location: 'UnderRepairShelf',
        changedBy: 'Admin User',
        note: 'Cleaning and key replacement',
        date: new Date('2024-10-18'),
      },
      {
        hardwareId: repairedKeyboard.id,
        status: AssetStatus.Repaired,
        location: 'RepairedShelf',
        changedBy: 'Admin User',
        note: 'All keys working properly - ready for redeployment',
        date: new Date('2024-10-25'),
      },
    ],
  });

  // Retired laptop history
  await prisma.history.createMany({
    data: [
      {
        hardwareId: retiredLaptop.id,
        status: AssetStatus.InUse,
        location: 'Storage',
        changedBy: 'Admin User',
        note: 'Used by various employees over the years',
        date: new Date('2018-06-01'),
      },
      {
        hardwareId: retiredLaptop.id,
        status: AssetStatus.Retired,
        location: 'RetiredShelf',
        changedBy: 'Admin User',
        note: 'Hardware obsolete - battery failing - scheduled for disposal',
        date: new Date('2024-10-01'),
      },
    ],
  });

  console.log('✅ Created comprehensive history entries showing asset lifecycles');

  console.log('\n🎉 Seed completed successfully!');
  console.log('\n📊 Summary:');
  console.log('- 6 Users (Active: 4, Departed: 1, Retired: 1)');
  console.log('- 12 Hardware Assets:');
  console.log('  • Setup: 1');
  console.log('  • ToBeDeployed: 2');
  console.log('  • InUse: 3');
  console.log('  • ToBeRepaired: 1');
  console.log('  • UnderRepair: 1');
  console.log('  • Repaired: 1');
  console.log('  • Retired: 2');
  console.log('- Complete audit trail with history entries');
  console.log('\n✨ Your app now has realistic test data!');
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
