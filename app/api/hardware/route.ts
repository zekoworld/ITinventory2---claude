import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const hardware = await prisma.asset.findMany({
      include: {
        assignedTo: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });
    return NextResponse.json(hardware);
  } catch (error) {
    console.error('Error fetching hardware:', error);
    return NextResponse.json({ error: 'Failed to fetch hardware' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { note, ...hardwareData } = data;
    
    // Convert date strings to Date objects
    const dateFields = ['purchaseDate', 'warrantyEndDate', 'deploymentSetupDate', 'underRepairDate', 'repairedDate', 'retiredDate'];
    dateFields.forEach(field => {
      if (hardwareData[field]) {
        hardwareData[field] = new Date(hardwareData[field]);
      }
    });

    // Set first in use date if status is InUse
    if (hardwareData.status === 'InUse' && !hardwareData.firstInUseAssetDate) {
      hardwareData.firstInUseAssetDate = new Date();
    }

    // Create the asset (changed from hardware to asset)
    const hardware = await prisma.asset.create({
      data: hardwareData,
      include: {
        assignedTo: true,
      },
    });

    // Create history record (check your schema for correct field name)
    await prisma.checkoutRecord.create({
      data: {
        assetId: hardware.id,
        userId: hardware.assignedToUserId,
        status: 'PENDING', // or whatever status you use
        requestedAt: new Date(),
        notes: note || 'Asset created',
      },
    });

    return NextResponse.json(hardware);
  } catch (error) {
    console.error('Error creating hardware:', error);
    return NextResponse.json({ error: 'Failed to create hardware' }, { status: 500 });
  }
}
