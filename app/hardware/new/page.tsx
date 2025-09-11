import HardwareForm from '@/components/HardwareForm';
import Link from 'next/link';

export default function NewHardwarePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            href="/"
            className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
          >
            ← Back to Inventory
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-4">Add New Hardware</h1>
          <p className="mt-2 text-sm text-gray-600">
            Create a new hardware asset with initial Setup status
          </p>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <HardwareForm />
        </div>
      </div>
    </div>
  );
}
