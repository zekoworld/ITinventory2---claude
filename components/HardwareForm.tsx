/ components/HardwareForm.tsx
'use client';

import { useState, useEffect } from 'react';
import { Hardware, User, AssetStatus } from '@prisma/client';
import { STATUS_RULES, canTransitionStatus } from '@/lib/status-rules';

type HardwareWithUser = Hardware & {
  assignedTo: User | null;
};

interface HardwareFormProps {
  hardware?: HardwareWithUser;
  onSave?: () => void;
}

export default function HardwareForm({ hardware, onSave }: HardwareFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    manufacturer: '',
    category: '',
    assetTag: '',
    status: AssetStatus.Setup,
    assignedToUserId: '',
    purchaseDate: '',
    warrantyEndDate: '',
    deploymentSetupDate: '',
    underRepairDate: '',
    repairedDate: '',
    retiredDate: '',
  });
  const [users, setUsers] = useState<User[]>([]);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (hardware) {
      setFormData({
        name: hardware.name,
        manufacturer: hardware.manufacturer,
        category: hardware.category,
        assetTag: hardware.assetTag,
        status: hardware.status,
        assignedToUserId: hardware.assignedToUserId || '',
        purchaseDate: hardware.purchaseDate ? hardware.purchaseDate.toISOString().split('T')[0] : '',
        warrantyEndDate: hardware.warrantyEndDate ? hardware.warrantyEndDate.toISOString().split('T')[0] : '',
        deploymentSetupDate: hardware.deploymentSetupDate ? hardware.deploymentSetupDate.toISOString().split('T')[0] : '',
        underRepairDate: hardware.underRepairDate ? hardware.underRepairDate.toISOString().split('T')[0] : '',
        repairedDate: hardware.repairedDate ? hardware.repairedDate.toISOString().split('T')[0] : '',
        retiredDate: hardware.retiredDate ? hardware.retiredDate.toISOString().split('T')[0] : '',
      });
    }
    fetchUsers();
  }, [hardware]);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
      const data = await response.json();
      setUsers(data.filter((user: User) => user.jobStatus === 'Active'));
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = hardware ? `/api/hardware/${hardware.id}` : '/api/hardware';
      const method = hardware ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          note,
        }),
      });

      if (response.ok) {
        onSave?.();
        if (!hardware) {
          setFormData({
            name: '',
            manufacturer: '',
            category: '',
            assetTag: '',
            status: AssetStatus.Setup,
            assignedToUserId: '',
            purchaseDate: '',
            warrantyEndDate: '',
            deploymentSetupDate: '',
            underRepairDate: '',
            repairedDate: '',
            retiredDate: '',
          });
          setNote('');
        }
      } else {
        const error = await response.json();
        alert(error.message || 'Error saving hardware');
      }
    } catch (error) {
      console.error('Error saving hardware:', error);
      alert('Error saving hardware');
    } finally {
      setLoading(false);
    }
  };

  const isFieldDisabled = (field: string) => {
    if (formData.status === AssetStatus.Retired) {
      return field !== 'status' && field !== 'retiredDate';
    }
    return false;
  };

  const getAvailableStatuses = () => {
    if (!hardware) return [AssetStatus.Setup];
    
    return Object.values(AssetStatus).filter(status => 
      status === hardware.status || canTransitionStatus(hardware.status, status)
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            required
            disabled={isFieldDisabled('name')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:bg-gray-100"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Asset Tag</label>
          <input
            type="text"
            required
            disabled={isFieldDisabled('assetTag')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:bg-gray-100"
            value={formData.assetTag}
            onChange={(e) => setFormData({...formData, assetTag: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Manufacturer</label>
          <input
            type="text"
            required
            disabled={isFieldDisabled('manufacturer')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:bg-gray-100"
            value={formData.manufacturer}
            onChange={(e) => setFormData({...formData, manufacturer: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <select
            required
            disabled={isFieldDisabled('category')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:bg-gray-100"
            value={formData.category}
            onChange={(e) => setFormData({...formData, category: e.target.value})}
          >
            <option value="">Select category</option>
            <option value="Laptop">Laptop</option>
            <option value="Phone">Phone</option>
            <option value="Monitor">Monitor</option>
            <option value="Keyboard">Keyboard</option>
            <option value="Mouse">Mouse</option>
            <option value="Accessory">Accessory</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Status</label>
          <select
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={formData.status}
            onChange={(e) => setFormData({...formData, status: e.target.value as AssetStatus})}
          >
            {getAvailableStatuses().map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>

        {(formData.status === AssetStatus.InUse || formData.status === AssetStatus.ToBeDeployed) && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Assigned To</label>
            <select
              required={formData.status === AssetStatus.InUse}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={formData.assignedToUserId}
              onChange={(e) => setFormData({...formData, assignedToUserId: e.target.value})}
            >
              <option value="">Select user</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>{user.name}</option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">Purchase Date</label>
          <input
            type="date"
            disabled={isFieldDisabled('purchaseDate')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:bg-gray-100"
            value={formData.purchaseDate}
            onChange={(e) => setFormData({...formData, purchaseDate: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Warranty End Date</label>
          <input
            type="date"
            disabled={isFieldDisabled('warrantyEndDate')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:bg-gray-100"
            value={formData.warrantyEndDate}
            onChange={(e) => setFormData({...formData, warrantyEndDate: e.target.value})}
          />
        </div>

        {formData.status === AssetStatus.Setup && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Setup Date *</label>
            <input
              type="date"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={formData.deploymentSetupDate}
              onChange={(e) => setFormData({...formData, deploymentSetupDate: e.target.value})}
            />
          </div>
        )}

        {formData.status === AssetStatus.UnderRepair && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Under Repair Date *</label>
            <input
              type="date"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={formData.underRepairDate}
              onChange={(e) => setFormData({...formData, underRepairDate: e.target.value})}
            />
          </div>
        )}

        {formData.status === AssetStatus.Repaired && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Repaired Date *</label>
            <input
              type="date"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={formData.repairedDate}
              onChange={(e) => setFormData({...formData, repairedDate: e.target.value})}
            />
          </div>
        )}

        {formData.status === AssetStatus.Retired && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Retired Date *</label>
            <input
              type="date"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={formData.retiredDate}
              onChange={(e) => setFormData({...formData, retiredDate: e.target.value})}
            />
          </div>
        )}
      </div>

      {STATUS_RULES[formData.status]?.requiresNote && (
        <div>
          <label className="block text-sm font-medium text-gray-700">Note *</label>
          <textarea
            required
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Required note for this status change..."
          />
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {loading ? 'Saving...' : hardware ? 'Update Hardware' : 'Create Hardware'}
        </button>
      </div>
    </form>
  );
}
