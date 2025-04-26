import { useState, useEffect } from 'react';
import { Button } from './ui/Button';
import api from '../lib/api';

type Admin = {
  id: string;
  name: string;
  email: string;
};

export function DeleteAdmin() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [selectedAdmin, setSelectedAdmin] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/admin/admins', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
        },
      });
      setAdmins(response.data as Admin[]);
    } catch (err) {
      setError('Failed to fetch admins');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedAdmin) return;
    
    try {
      setLoading(true);
      await api.delete(`/api/admin/admins/${selectedAdmin}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
        },
      });
      setSuccess('Admin deleted successfully');
      setSelectedAdmin('');
      fetchAdmins(); // Refresh the list
      setShowConfirmation(false);
    } catch (err) {
      setError('Failed to delete admin');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const initiateDelete = () => {
    if (!selectedAdmin) {
      setError('Please select an admin to delete');
      return;
    }
    setShowConfirmation(true);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Delete Admin</h2>
      
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 text-green-600 p-3 rounded mb-4">
          {success}
        </div>
      )}

      <div className="mb-4">
        <label htmlFor="admin-select" className="block text-sm font-medium text-gray-700 mb-1">
          Select Admin to Delete
        </label>
        <select
          id="admin-select"
          value={selectedAdmin}
          onChange={(e) => setSelectedAdmin(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        >
          <option value="">Select an admin</option>
          {admins.map((admin) => (
            <option key={admin.id} value={admin.id}>
              {admin.name} ({admin.email})
            </option>
          ))}
        </select>
      </div>

      <Button
        onClick={initiateDelete} 
        disabled={!selectedAdmin || loading}
        className="mt-2"
      >
        {loading ? 'Processing...' : 'Delete Admin'}
      </Button>

      {/* Confirmation Dialog */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-lg font-medium mb-3">Confirm Deletion</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete this admin? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <Button 
                variant="secondary" 
                onClick={() => setShowConfirmation(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleDelete}
                disabled={loading}
              >
                {loading ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
