'use client';

import { useState, useEffect } from 'react';
import { Hardware, User, AssetStatus } from '@prisma/client';

type HardwareWithUser = Hardware & {
  assignedTo: User | null;
};

export default function HardwareTable() {
  const [hardware, setHardware] = useState<HardwareWithUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHardware();
  }, []);

  const fetchHardware = async () => {
    try {
      const response = await fetch('/api/hardware');
      const data = await response.json();
      setHardware(data);
    } catch (error) {
      console.error('Error fetching hardware:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: AssetStatus) => {
    const colors = {
      Setup: 'bg-blue-100 text-blue-800',
      ToBeDeployed: 'bg-yellow-100 text-yellow-800',
      InUse: 'bg-green-100 text-green-800',
      ToBeRepaired: 'bg-orange-100 text-orange-800',
      UnderRepair: 'bg-red-100 text-red-800',
      Repaired: 'bg-purple-100 text-purple-800',
      Retired: 'bg-gray-100 text-gray-800',
    };
    return colors[status];
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Hardware Inventory</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Asset
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Assigned To
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {hardware.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {item.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {item.assetTag} • {item.manufacturer}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.location}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.assignedTo?.name || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => window.location.href = `/hardware/${item.id}`}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
