// import { useState } from 'react';
// import { motion } from 'framer-motion';
// import { useAuthStore } from '@/store/auth';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { useToast } from '@/components/ui/toaster';
// import { UserPosts } from '@/components/profile/UserPosts';
// import api from '@/lib/api';
// import { CustomKanban } from '@/components/profile/Todo';
// import "../styles/"

// export function ProfilePage() {
//   const { user } = useAuthStore();
//   const { toast } = useToast();
//   const [name, setName] = useState(user?.name || '');
//   const [email, setEmail] = useState(user?.email || '');
//   const [isEditing, setIsEditing] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);

//   const handleSave = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!name.trim()) {
//       toast('Name cannot be empty', 'error');
//       return;
//     }
    
//     setIsLoading(true);
//     try {
//       await api.put('/api/user/profile', { name });
//       toast('Profile updated successfully', 'success');
//       setIsEditing(false);
//     } catch (error) {
//       toast('Failed to update profile', 'error');
//       console.error('Profile update failed:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <>
//     <div className="max-w-screen mx-auto bg-neutral-900"
//     // style={{
//     //   backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke-width='2' stroke='%23d4d4d4'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e")`,
//     // }}
//     >
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="bg-white rounded-lg shadow-sm p-6 mb-6"
//       >
//         <h1 className="text-2xl font-bold mb-6">Your Profile</h1>

//         <form onSubmit={handleSave} className="space-y-6">
//           <div className="space-y-2">
//             <label htmlFor="name" className="block text-sm font-medium text-gray-700">
//               Name
//             </label>
//             {isEditing ? (
//               <Input
//                 id="name"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//                 disabled={isLoading}
//               />
//             ) : (
//               <div className="text-lg">{user?.name}</div>
//             )}
//           </div>

//           <div className="space-y-2">
//             <label htmlFor="email" className="block text-sm font-medium text-gray-700">
//               Email
//             </label>
//             <div className="text-lg">{user?.email}</div>
//           </div>

//           <div className="space-y-2">
//             <label className="block text-sm font-medium text-gray-700">
//               Account Type
//             </label>
//             <div className="text-lg">
//               {user?.isPaid ? 'Premium Account' : 'Free Account'}
//             </div>
//           </div>

//           <div className="flex space-x-4">
//             {isEditing ? (
//               <>
//                 <Button type="submit" disabled={isLoading}>
//                   {isLoading ? 'Saving...' : 'Save Changes'}
//                 </Button>
//                 <Button
//                   type="button"
//                   variant="outline"
//                   onClick={() => {
//                     setIsEditing(false);
//                     setName(user?.name || '');
//                   }}
//                   disabled={isLoading}
//                 >
//                   Cancel
//                 </Button>
//               </>
//             ) : (
//               <Button type="button" onClick={() => setIsEditing(true)}>
//                 Edit Profile
//               </Button>
//             )}
//           </div>
//         </form>
//       </motion.div>
//       <CustomKanban/>

//       {user && (
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.1 }}
//           className="bg-white rounded-lg shadow-sm p-6"
//         >
//           <UserPosts userId={user.id} />
//         </motion.div>
//       )}

//       {!user?.isPaid && (
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.2 }}
//           className="bg-white rounded-lg shadow-sm p-6 mt-6"
//         >
//           <h2 className="text-xl font-semibold mb-4">Upgrade to Premium</h2>
//           <p className="text-gray-600 mb-4">
//             Get access to all videos and join the community discussions.
//           </p>
//           <Button asChild>
//             <a href="/pricing">View Pricing Plans</a>
//           </Button>
//         </motion.div>
//       )}
//     </div>
//     </>
//   );
  
// }
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/toaster';
import { UserPosts } from '@/components/profile/UserPosts';
import api from '@/lib/api';
import { CustomKanban } from '@/components/profile/Todo';
import "../styles/fonts.css"

export function ProfilePage() {
  const { user } = useAuthStore();
  const { toast } = useToast();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const spotlightColor = "rgba(255,255,255,0.1)";

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
    <div className="min-h-screen w-full bg-neutral-900 flex flex-col items-center justify-center font-santoshi pt-8 ">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onMouseMove={handleMouseMove}
        style={{
          background: `radial-gradient(circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 80%)`,
          transition: "background 0.2s ease",
        }}
        className="rounded-xl p-8 backdrop-blur-md border border-white/10 text-white w-full max-w-md shadow-2xl mb-6"
      >
        <h1 className="text-3xl font-bold mb-6 text-center">Your Profile</h1>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-300">
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
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
              Email
            </label>
            <div className="text-lg">{user?.email}</div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Account Type
            </label>
            <div className="text-lg">
              {user?.isPaid ? 'Premium Account' : 'Free Account'}
            </div>
          </div>

          <div className="flex justify-center gap-4">
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
      <div>
      <CustomKanban />
      </div>
      

      <div className="w-full px-4 md:px-12 xl:px-24 max-w-7xl">
       

        {user && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <UserPosts userId={user.id} />
          </motion.div>
        )}

        {!user?.isPaid && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow-sm p-6 mt-6"
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
    </div>
  );
}
