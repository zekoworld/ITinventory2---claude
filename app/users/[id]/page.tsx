import { prisma } from '@/lib/prisma';
import UserForm from '@/components/UserForm';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function UserDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const user = await prisma.user.findUnique({
    where: { id: params.id },
    include: {
      assignedHardware: true,
    },
  });

  if (!user) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            href="/users"
            className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
          >
            ← Back to Users
          </Link>
          <div className="mt-4 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Edit User - {user.name}
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                {user.email} • {user.role} • {user.workStyle}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                user.jobStatus === 'Active' ? 'bg-green-100 text-green-800' :
                user.jobStatus === 'Departed' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {user.jobStatus}
              </span>
              <span className="text-sm text-gray-600">
                {user.assignedHardware.length} assets assigned
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">User Details</h2>
            <UserForm user={user} />
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Assigned Hardware ({user.assignedHardware.length})
            </h2>
            {user.assignedHardware.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No hardware assigned</p>
            ) : (
              <div className="space-y-3">
                {user.assignedHardware.map((hardware) => (
                  <div key={hardware.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">{hardware.name}</div>
                      <div className="text-sm text-gray-500">{hardware.assetTag} • {hardware.manufacturer}</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        hardware.status === 'InUse' ? 'bg-green-100 text-green-800' :
                        hardware.status === 'ToBeDeployed' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {hardware.status}
                      </span>
                      <Link
                        href={`/hardware/${hardware.id}`}
                        className="text-indigo-600 hover:text-indigo-900 text-sm"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
