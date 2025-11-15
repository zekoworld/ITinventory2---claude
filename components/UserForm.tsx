'use client';

import { useState, useEffect } from 'react';
import { User, JobStatus, WorkStyle, UserRole } from '@prisma/client';

interface UserFormProps {
  user?: User;
  onSave?: () => void;
}

export default function UserForm({ user, onSave }: UserFormProps) {
  const [formData, setFormData] = useState<any>({
    name: '',
    email: '',
    role: UserRole.VIEWER,
    jobStatus: JobStatus.Active,
    workStyle: WorkStyle.Onsite,
    currentAddress: '',
    homeAddress: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
        jobStatus: user.jobStatus,
        workStyle: user.workStyle,
        currentAddress: user.currentAddress || '',
        homeAddress: user.homeAddress || '',
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = user ? `/api/users/${user.id}` : '/api/users';
      const method = user ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        onSave?.();
        if (!user) {
          // Reset form for new user
          setFormData({
            name: '',
            email: '',
            role: UserRole.VIEWER,
            jobStatus: JobStatus.Active,
            workStyle: WorkStyle.Onsite,
            currentAddress: '',
            homeAddress: '',
          });
        } else {
          // Redirect to users list after editing
          window.location.href = '/users';
        }
      } else {
        const error = await response.json();
        alert(error.message || 'Error saving user');
      }
    } catch (error) {
      console.error('Error saving user:', error);
      alert('Error saving user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name *</label>
          <input
            type="text"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email *</label>
          <input
            type="email"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Role</label>
          <select
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={formData.role}
            onChange={(e) => setFormData({...formData, role: e.target.value as UserRole})}
          >
            <option value={UserRole.VIEWER}>Viewer</option>
            <option value={UserRole.ADMIN}>Admin</option>
            <option value={UserRole.OWNER}>Owner</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Job Status</label>
          <select
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={formData.jobStatus}
            onChange={(e) => setFormData({...formData, jobStatus: e.target.value as JobStatus})}
          >
            <option value={JobStatus.Active}>Active</option>
            <option value={JobStatus.Departed}>Departed</option>
            <option value={JobStatus.Retired}>Retired</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Work Style</label>
          <select
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={formData.workStyle}
            onChange={(e) => setFormData({...formData, workStyle: e.target.value as WorkStyle})}
          >
            <option value={WorkStyle.Onsite}>Onsite</option>
            <option value={WorkStyle.Remote}>Remote</option>
            <option value={WorkStyle.Hybrid}>Hybrid</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Current Address {formData.jobStatus === JobStatus.Active && '*'}
          </label>
          <input
            type="text"
            required={formData.jobStatus === JobStatus.Active}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={formData.currentAddress}
            onChange={(e) => setFormData({...formData, currentAddress: e.target.value})}
            placeholder="Office or current work address"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Home Address</label>
          <input
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={formData.homeAddress}
            onChange={(e) => setFormData({...formData, homeAddress: e.target.value})}
            placeholder="Home address for remote work"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => window.location.href = '/users'}
          className="inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {loading ? 'Saving...' : user ? 'Update User' : 'Create User'}
        </button>
      </div>
    </form>
  );
}
