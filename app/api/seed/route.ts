// app/api/seed/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient, UserRole, JobStatus, WorkStyle, AssetStatus } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST() {
  try {
    console.log('🌱 Starting API seed...');

    const existingUsers = await prisma.user.count();
    if (existingUsers > 0) {
      return NextResponse.json({ 
        message: 'Database already seeded',
        existingUsers 
      });
    }

    const adminUser = await prisma.user.create({
      data: {
        name: 'Admin User',
        email: 'admin@company.com',
        role: UserRole.ADMIN,
        jobStatus: JobStatus.Active,
        workStyle: WorkStyle.Onsite,
        currentAddress: 'Main Office, 123 Business St',
        homeAddress: '456 Home Ave',
      },
    });

    const sampleUser = await prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'john.doe@company.com',
        role: UserRole.VIEWER,
        jobStatus: JobStatus.Active,
        workStyle: WorkStyle.Hybrid,
        currentAddress: 'Main Office, 123 Business St',
        homeAddress: '789 Remote St',
      },
    });

    const laptop1 = await prisma.hardware.create({
      data: {
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

    const laptop2 = await prisma.hardware.create({
      data: {
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

    await prisma.history.createMany({
      data: [
        {
          hardwareId: laptop1.id,
          status: AssetStatus.Setup,
          location: 'SetupShelf',
          changedBy: 'System',
          note: 'Initial asset creation',
        },
        {
          hardwareId: laptop2.id,
          status: AssetStatus.InUse,
          location: 'Storage',
          changedBy: 'Admin',
          userId: sampleUser.id,
          note: 'Deployed to John Doe',
        },
      ],
    });

    return NextResponse.json({
      message: '✅ Database seeded successfully!',
      data: {
        users: [adminUser.name, sampleUser.name],
        hardware: [laptop1.assetTag, laptop2.assetTag],
      },
    });

  } catch (error) {
    console.error('❌ Seed failed:', error);
    return NextResponse.json(
      { error: 'Failed to seed database', details: error },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
