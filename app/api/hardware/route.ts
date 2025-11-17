import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    console.log('Starting hardware fetch...');
    console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
    console.log('DIRECT_URL exists:', !!process.env.DIRECT_URL);
    
    const hardware = await prisma.hardware.findMany({
      include: {
        assignedTo: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });
    
    console.log('Hardware fetched successfully, count:', hardware.length);
    return NextResponse.json(hardware);
  } catch (error) {
    console.error('Detailed error fetching hardware:', error);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    
    return NextResponse.json({ 
      error: 'Failed to fetch hardware',
      details: error.message,
      type: error.name
    }, { status: 500 });
  }
}
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { note, ...hardwareData } = data;
    
    const dateFields = ['purchaseDate', 'warrantyEndDate', 'deploymentSetupDate', 'underRepairDate', 'repairedDate', 'retiredDate'];
    dateFields.forEach(field => {
      if (hardwareData[field]) {
        hardwareData[field] = new Date(hardwareData[field]);
      }
    });

    if (hardwareData.status === 'InUse' && !hardwareData.firstInUseAssetDate) {
      hardwareData.firstInUseAssetDate = new Date();
    }

    const hardware = await prisma.hardware.create({
      data: hardwareData,
      include: {
        assignedTo: true,
      },
    });

    await prisma.history.create({
      data: {
        hardwareId: hardware.id,
        status: hardware.status,
        location: hardware.location,
        changedBy: 'Admin',
        note: note || 'Asset created',
        userId: hardware.assignedToUserId,
      },
    });

    return NextResponse.json(hardware);
  } catch (error) {
    console.error('Error creating hardware:', error);
    return NextResponse.json({ error: 'Failed to create hardware' }, { status: 500 });
  }
}
