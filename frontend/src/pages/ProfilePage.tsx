import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/toaster';
import api from '@/lib/api';

export function ProfilePage() {
  const { user } = useAuthStore();
  const { toast } = useToast();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast('Name cannot be empty', 'error');
      return;
    }
    
    setIsLoading(true);
    try {
      await api.put('/api/user/profile', { name });
      toast('Profile updated successfully', 'success');
      setIsEditing(false);
    } catch (error) {
      toast('Failed to update profile', 'error');
      console.error('Profile update failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        {...{ className: "bg-white rounded-lg shadow-sm p-6 mb-6" }}
      >
        <h1 className="text-2xl font-bold mb-6">Your Profile</h1>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            {isEditing ? (
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
              />
            ) : (
              <div className="text-lg">{user?.name}</div>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <div className="text-lg">{user?.email}</div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Account Type
            </label>
            <div className="text-lg">
              {user?.isPaid ? 'Premium Account' : 'Free Account'}
            </div>
          </div>

          <div className="flex space-x-4">
            {isEditing ? (
              <>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    setName(user?.name || '');
                  }}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <Button type="button" onClick={() => setIsEditing(true)}>
                Edit Profile
              </Button>
            )}
          </div>
        </form>
      </motion.div>

      {!user?.isPaid && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{ background: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', padding: '1.5rem' }}
        >
          <h2 className="text-xl font-semibold mb-4">Upgrade to Premium</h2>
          <p className="text-gray-600 mb-4">
            Get access to all videos and join the community discussions.
          </p>
          <Button asChild>
            <a href="/pricing">View Pricing Plans</a>
          </Button>
        </motion.div>
      )}
    </div>
  );
}
