
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/toaster';
import { UserPosts } from '@/components/profile/UserPosts';
import api from '@/lib/api';
import { CustomKanban } from '@/components/profile/Todo';
import "../styles/fonts.css";

export function ProfilePage() {
  const { user } = useAuthStore();
  const { toast } = useToast();
  const [name, setName] = useState(user?.name || '');
  const [email] = useState(user?.email || '');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

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
    <div className="min-h-screen w-full bg-white font-santoshi relative"
    style={{
      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke-width='2' stroke='%23d4d4d4'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e")`,
    }}>
      {/* Checkerboard Pattern Background */}
    

     

      <div className="container mx-auto px-4 py-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          {...{className: "text-center mb-12"}}
        >
          <h1 className="text-5xl font-black bg-gradient-to-r from-purple-600 via-indigo-500 to-purple-800 bg-clip-text text-transparent font-Satoshi ">
            Your Profile
          </h1>
          
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Profile Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            onMouseMove={handleMouseMove}
            className="lg:col-span-1"
          >
            <div className="rounded-2xl bg-white border-2 border-indigo-100 shadow-xl overflow-hidden">
              <div className="h-24 bg-gradient-to-r from-purple-600 via-indigo-500 to-purple-700 relative">
                <div 
                  className="absolute inset-0 opacity-30"
                  style={{
                    backgroundImage: `radial-gradient(circle at ${position.x}px ${position.y}px, rgba(255,255,255,0.8), transparent 70%)`,
                  }}
                ></div>
              </div>
              
              <div className="relative px-6 pb-6">
                <div className="flex justify-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 border-4 border-white flex items-center justify-center text-white text-2xl font-bold -mt-10">
                    {name.charAt(0).toUpperCase()}
                  </div>
                </div>

                <form onSubmit={handleSave} className="space-y-6 mt-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    {isEditing ? (
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={isLoading}
                        className="border-indigo-200 focus:ring-2 focus:ring-purple-500 focus:border-indigo-300"
                      />
                    ) : (
                      <div className="text-lg font-medium text-gray-900">{user?.name}</div>
                    )}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <div className="text-gray-700">{email}</div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Account Type
                    </label>
                    <div className="flex items-center">
                      {user?.isPaid ? (
                        <>
                          <span className="inline-block w-3 h-3 bg-purple-500 rounded-full mr-2"></span>
                          <span className="text-purple-700 font-medium">Premium Account</span>
                        </>
                      ) : (
                        <>
                          <span className="inline-block w-3 h-3 bg-gray-400 rounded-full mr-2"></span>
                          <span className="text-gray-700">Free Account</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* <div className="flex justify-center gap-4 mt-6">
                    {isEditing ? (
                      <>
                        <Button type="submit" disabled={isLoading} className="bg-indigo-600 hover:bg-indigo-700 transition text-white">
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
                          className="border-indigo-300 text-indigo-700 hover:bg-indigo-50"
                        >
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <Button
                        type="button"
                        onClick={() => setIsEditing(true)}
                        className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 transition text-white"
                      >
                        Edit Profile
                      </Button>
                    )}
                  </div> */}
                </form>
              </div>
            </div>

            {/* Premium Upgrade Card */}
            {!user?.isPaid && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                {...{className:"rounded-2xl bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 shadow-lg p-6 mt-6"}}
              >
                <div className="flex items-center justify-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <h2 className="text-2xl font-semibold text-center text-gray-900 mb-3">Upgrade to Premium</h2>
                <p className="text-gray-600 text-center mb-4">
                  Get access to all premium videos and join exclusive community discussions.
                </p>
                <Button asChild className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 transition shadow-md">
                  <a href="/pricing">View Pricing Plans</a>
                </Button>
              </motion.div>
            )}
          </motion.div>

          {/* Right Column: Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Kanban Board */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              {...{className:"bg-white rounded-2xl border-2 justify-center border-indigo-100 shadow-xl p-6"}}
            >
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Your Tasks</h2>
              </div>
              <CustomKanban />
            </motion.div>

            {/* User Posts */}
            {user && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                {...{className:"bg-white rounded-2xl border-2 border-indigo-100 shadow-xl p-6"}}
              >
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">Your Posts</h2>
                </div>
                <UserPosts userId={user.id} />
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}