import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { UserRole, JobStatus, WorkStyle, AssetStatus } from '@prisma/client';

export const dynamic = 'force-dynamic';

export async function GET() {
  return POST();
}

export async function POST() {
  try {
    const existingUsers = await prisma.user.count();
    if (existingUsers > 0) {
      return NextResponse.json({ 
        message: 'Database already seeded',
        existingUsers 
      });
    }

    // Create 2 simple users
    const admin = await prisma.user.create({
      data: {
        name: 'Admin User',
        email: 'admin@company.com',
        role: UserRole.ADMIN,
        jobStatus: JobStatus.Active,
        workStyle: WorkStyle.Onsite,
        currentAddress: 'Main Office',
      },
    });

    const user1 = await prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'john@company.com',
        role: UserRole.VIEWER,
        jobStatus: JobStatus.Active,
        workStyle: WorkStyle.Hybrid,
        currentAddress: 'Main Office',
      },
    });

    // Create 3 simple hardware items
    const hw1 = await prisma.hardware.create({
      data: {
        name: 'MacBook Pro 16"',
        manufacturer: 'Apple',
        category: 'Laptop',
        assetTag: 'LAP-001',
        status: AssetStatus.InUse,
        assignedToUserId: user1.id,
        purchaseDate: new Date('2024-01-15'),
      },
    });

    const hw2 = await prisma.hardware.create({
      data: {
        name: 'ThinkPad X1',
        manufacturer: 'Lenovo',
        category: 'Laptop',
        assetTag: 'LAP-002',
        status: AssetStatus.ToBeDeployed,
      },
    });

    const hw3 = await prisma.hardware.create({
      data: {
        name: 'Dell Monitor',
        manufacturer: 'Dell',
        category: 'Monitor',
        assetTag: 'MON-001',
        status: AssetStatus.Setup,
        deploymentSetupDate: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Database seeded!',
      data: { users: 2, hardware: 3 },
    });

  } catch (error: any) {
    console.error('Seed error:', error);
    return NextResponse.json(
      { error: 'Failed to seed database', details: error.message },
      { status: 500 }
    );
  }
}
