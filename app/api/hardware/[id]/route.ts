import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { STATUS_RULES, canTransitionStatus } from '@/lib/status-rules';
import { AssetStatus, LocationType } from '@prisma/client';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const hardware = await prisma.hardware.findUnique({
      where: { id: params.id },
      include: {
        assignedTo: true,
        history: {
          orderBy: {
            date: 'desc',
          },
        },
      },
    });

    if (!hardware) {
      return NextResponse.json({ error: 'Hardware not found' }, { status: 404 });
    }

    return NextResponse.json(hardware);
  } catch (error) {
    console.error('Error fetching hardware:', error);
    return NextResponse.json({ error: 'Failed to fetch hardware' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    const { note, ...updateData } = data;

    const currentHardware = await prisma.hardware.findUnique({
      where: { id: params.id },
    });

    if (!currentHardware) {
      return NextResponse.json({ error: 'Hardware not found' }, { status: 404 });
    }

    const newStatus = updateData.status as AssetStatus;
    if (newStatus !== currentHardware.status && !canTransitionStatus(currentHardware.status, newStatus)) {
      return NextResponse.json(
        { error: `Cannot transition from ${currentHardware.status} to ${newStatus}` },
        { status: 400 }
      );
    }

    if (newStatus !== currentHardware.status) {
      const rule = STATUS_RULES[newStatus];
      
      updateData.location = rule.location;
      
      Object.entries(rule.autoFields).forEach(([key, value]) => {
        updateData[key] = value;
      });

      if (rule.unassignsUser) {
        updateData.assignedToUserId = null;
      }

      if (newStatus === AssetStatus.InUse && updateData.assignedToUserId) {
        const user = await prisma.user.findUnique({
          where: { id: updateData.assignedToUserId },
        });
        
        if (user) {
          if (user.workStyle === 'Remote' && user.homeAddress) {
            updateData.location = LocationType.Storage;
          } else if (user.currentAddress) {
            updateData.location = LocationType.Storage;
          }
        }
      }
    }

    const dateFields = [
      'purchaseDate', 'warrantyEndDate', 'deploymentSetupDate',
      'underRepairDate', 'repairedDate', 'retiredDate'
    ];
    dateFields.forEach(field => {
      if (updateData[field]) {
        updateData[field] = new Date(updateData[field]);
      }
    });

    const hardware = await prisma.hardware.update({
      where: { id: params.id },
      data: updateData,
      include: {
        assignedTo: true,
      },
    });

    if (newStatus !== currentHardware.status) {
      await prisma.history.create({
        data: {
          hardwareId: hardware.id,
          status: hardware.status,
          location: hardware.location,
          changedBy: 'Admin',
          note: note || `Status changed to ${newStatus}`,
          userId: hardware.assignedToUserId,
        },
      });
    }

    return NextResponse.json(hardware);
  } catch (error) {
    console.error('Error updating hardware:', error);
    return NextResponse.json({ error: 'Failed to update hardware' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const hardware = await prisma.hardware.findUnique({
      where: { id: params.id },
    });

    if (!hardware) {
      return NextResponse.json({ error: 'Hardware not found' }, { status: 404 });
    }

    if (hardware.status !== AssetStatus.Retired) {
      return NextResponse.json(
        { error: 'Can only delete hardware with Retired status' },
        { status: 400 }
      );
    }

    await prisma.hardware.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting hardware:', error);
    return NextResponse.json({ error: 'Failed to delete hardware' }, { status: 500 });
  }
}
