// app/hardware/[id]/page.tsx
import { prisma } from '@/lib/prisma';
import HardwareForm from '@/components/HardwareForm';
import HistoryTable from '@/components/HistoryTable';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function HardwareDetailPage({
  params,
}: {
  params: { id: string };
}) {
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
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            href="/"
            className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
          >
            ← Back to Inventory
          </Link>
          <div className="mt-4 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {hardware.name}
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                Asset Tag: {hardware.assetTag} • {hardware.manufacturer} • {hardware.category}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                hardware.status === 'InUse' ? 'bg-green-100 text-green-800' :
                hardware.status === 'Setup' ? 'bg-blue-100 text-blue-800' :
                hardware.status === 'ToBeDeployed' ? 'bg-yellow-100 text-yellow-800' :
                hardware.status === 'ToBeRepaired' ? 'bg-orange-100 text-orange-800' :
                hardware.status === 'UnderRepair' ? 'bg-red-100 text-red-800' :
                hardware.status === 'Repaired' ? 'bg-purple-100 text-purple-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {hardware.status}
              </span>
              {hardware.assignedTo && (
                <span className="text-sm text-gray-600">
                  Assigned to: <span className="font-medium">{hardware.assignedTo.name}</span>
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Hardware Details</h2>
            <HardwareForm hardware={hardware} />
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Audit History ({hardware.history.length} entries)
            </h2>
            <HistoryTable history={hardware.history} />
          </div>
        </div>
      </div>
    </div>
  );
}
