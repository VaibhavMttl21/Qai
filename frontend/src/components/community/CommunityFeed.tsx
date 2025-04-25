
// import { useEffect, useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { useCommunityStore } from '@/store/community';
// import { useAuthStore } from '@/store/auth';
// import { Button } from '@/components/ui/button';
// import { Switch } from '@/components/ui/switch';
// import { Label } from '@/components/ui/label';
// import { CreatePostDialog } from './CreatePostDialog';
// import { Post } from './Post';
// import { connectSocket, disconnectSocket } from '@/lib/socket';
// import { useToast } from '@/components/ui/toaster';
// import { Sun, Moon } from 'lucide-react';

// export function CommunityFeed() {
//   const { posts, fetchPosts } = useCommunityStore();
//   const { user } = useAuthStore();
//   const { toast } = useToast();
//   const [viewMode, setViewMode] = useState('prioritized');
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [isDarkMode, setIsDarkMode] = useState(true); // Default to dark mode

//   useEffect(() => {
//     async function loadPosts() {
//       setIsLoading(true);
//       setError(null);
//       try {
//         await fetchPosts();
//       } catch (err) {
//         setError('Failed to load community posts. Please try again later.');
//         toast('Failed to load posts', 'error');
//       } finally {
//         setIsLoading(false);
//       }
//     }
    
//     loadPosts();
    
//     // Connect to socket when component mounts
//     connectSocket();
    
//     // Set up toast notifications for real-time updates
//     const handleNewPost = () => {
//       toast('New post has been added!', 'info');
//     };
    
//     const handleNewReply = () => {
//       toast('New reply has been added!', 'info');
//     };
    
//     // Add event listeners to global window object
//     window.addEventListener('newPost', handleNewPost);
//     window.addEventListener('newReply', handleNewReply);
    
//     // Clean up socket connection and event listeners when component unmounts
//     return () => {
//       disconnectSocket();
//       window.removeEventListener('newPost', handleNewPost);
//       window.removeEventListener('newReply', handleNewReply);
//     };
//   }, [fetchPosts, toast]);

//   // Apply sorting based on view mode
//   const sortedPosts = [...posts].sort((a, b) => {
//     if (viewMode === 'prioritized') {
//       // First sort by admin status (admin posts first)
//       if (a.isAdmin && !b.isAdmin) return -1;
//       if (!a.isAdmin && b.isAdmin) return 1;
//     }
//     // Then sort by date (newest first) - always applies
//     return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
//   });

//   // Theme styles
//   const themeStyles = {
//     background: isDarkMode 
//       ? 'bg-gradient-to-br from-neutral-900 via-neutral-900 to-neutral-900' 
//       : 'bg-gradient-to-br from-indigo-100 via-purple-100 to-violet-200',
//     header: isDarkMode 
//       ? 'text-white' 
//       : 'text-indigo-900',
//     card: isDarkMode 
//       ? 'bg-gray-800 border-gray-700' 
//       : 'bg-white border-gray-200',
//     text: isDarkMode 
//       ? 'text-white' 
//       : 'text-gray-800',
//     subText: isDarkMode 
//       ? 'text-gray-300' 
//       : 'text-gray-600',
//     button: isDarkMode 
//       ? 'bg-indigo-600 hover:bg-indigo-700 text-white' 
//       : 'bg-indigo-500 hover:bg-indigo-600 text-white',
//     outlineButton: isDarkMode 
//       ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
//       : 'border-gray-300 text-gray-700 hover:bg-gray-100',
//     switchBg: isDarkMode 
//       ? 'bg-gray-700' 
//       : 'bg-gray-300',
//     errorCard: isDarkMode 
//       ? 'bg-red-900 border-red-800 text-red-100' 
//       : 'bg-red-50 border-red-200 text-red-700',
//     emptyCard: isDarkMode 
//       ? 'bg-gray-800 text-gray-300' 
//       : 'bg-gray-50 text-gray-500',
//     upgradeCard: isDarkMode 
//       ? 'bg-indigo-800 border-indigo-700 text-indigo-100' 
//       : 'bg-indigo-50 border-indigo-200 text-indigo-800',
//   };

//   return (
//     <div className={`min-h-screen ${themeStyles.background} transition-colors duration-300`}>
//       <div className="container mx-auto px-4 py-8">
//         <div className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:items-center mb-8">
//           <h2 className={`text-2xl font-bold ${themeStyles.header}`}>Community Discussion</h2>
          
//           <div className="flex flex-col sm:flex-row sm:items-center gap-4">
//             {/* Theme Toggle Button */}
//             <div className="flex items-center space-x-2">
//               <Switch 
//                 id="theme-mode" 
//                 className={themeStyles.switchBg}
//                 checked={isDarkMode}
//                 onCheckedChange={(checked) => setIsDarkMode(checked)}
//               />
//               <Label htmlFor="theme-mode" className={`text-sm font-medium flex items-center ${themeStyles.text}`}>
//                 {isDarkMode ? (
//                   <>
//                     <Moon size={16} className="mr-1" />
//                     <span>Dark Mode</span>
//                   </>
//                 ) : (
//                   <>
//                     <Sun size={16} className="mr-1" />
//                     <span>Light Mode</span>
//                   </>
//                 )}
//               </Label>
//             </div>
            
//             {/* View Mode Toggle */}
//             <div className="flex items-center space-x-2">
//               <Switch 
//                 id="view-mode" 
//                 className={themeStyles.switchBg}
//                 checked={viewMode === 'prioritized'}
//                 onCheckedChange={(checked) => 
//                   setViewMode(checked ? 'prioritized' : 'chronological')
//                 }
//               />
//               <Label htmlFor="view-mode" className={`text-sm font-medium ${themeStyles.text}`}>
//                 {viewMode === 'prioritized' ? 'Admin Posts Prioritized' : 'Chronological View'}
//               </Label>
//             </div>
            
//             {user?.isPaid && <CreatePostDialog />}
//           </div>
//         </div>

//         {/* Loading State */}
//         {isLoading && (
//           <div className="flex justify-center items-center py-20">
//             <div className={`animate-spin rounded-full h-12 w-12 border-b-2 ${isDarkMode ? 'border-purple-400' : 'border-indigo-600'}`}></div>
//           </div>
//         )}

//         {/* Error State */}
//         {error && !isLoading && (
//           <div className={`${themeStyles.errorCard} px-4 py-3 rounded-md mb-6 shadow-md`}>
//             <p>{error}</p>
//             <Button 
//               onClick={() => fetchPosts()} 
//               variant="outline" 
//               size="sm" 
//               className={`mt-2 ${isDarkMode ? 'border-red-700 text-red-200' : ''}`}
//             >
//               Try Again
//             </Button>
//           </div>
//         )}

//         {/* Empty State */}
//         {!isLoading && !error && sortedPosts.length === 0 && (
//           <div className={`text-center py-16 ${themeStyles.emptyCard} rounded-lg shadow-md`}>
//             <h3 className={`text-lg font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>No posts yet</h3>
//             <p className={`${themeStyles.subText} mb-6`}>Be the first to start a discussion!</p>
//             {user?.isPaid ? (
//               <CreatePostDialog />
//             ) : (
//               <Button variant="outline" className={themeStyles.outlineButton} asChild>
//                 <a href="/pricing">Upgrade to Join Discussions</a>
//               </Button>
//             )}
//           </div>
//         )}

//         {/* Posts List */}
//         {!isLoading && !error && sortedPosts.length > 0 && (
//           <AnimatePresence>
//             <div className="space-y-6">
//               {sortedPosts.map((post) => (
//                 <motion.div
//                   key={post.id}
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: -20 }}
//                   transition={{ duration: 0.3 }}
//                   className={`${themeStyles.card} rounded-lg shadow-md border overflow-hidden`}
//                 >
//                   <Post post={post} viewMode={viewMode} isDarkMode={isDarkMode} />
//                 </motion.div>
//               ))}
//             </div>
//           </AnimatePresence>
//         )}

//         {/* Load More Button (if needed for pagination) */}
//         {!isLoading && !error && sortedPosts.length >= 10 && (
//           <div className="mt-8 text-center">
//             <Button variant="outline" className={`mx-auto ${themeStyles.outlineButton}`}>
//               Load More Posts
//             </Button>
//           </div>
//         )}

//         {!user?.isPaid && (
//           <div className={`mt-8 p-4 ${themeStyles.upgradeCard} rounded-lg shadow-md`}>
//             <p className={isDarkMode ? 'text-indigo-200' : 'text-indigo-800'}>
//               Upgrade to premium to participate in discussions!
//             </p>
//             <Button className={`mt-2 ${themeStyles.button}`} asChild>
//               <a href="/pricing">Upgrade Now</a>
//             </Button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCommunityStore } from '@/store/community';
import { useAuthStore } from '@/store/auth';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { CreatePostDialog } from './CreatePostDialog';
import { Post } from './Post';
import { connectSocket, disconnectSocket } from '@/lib/socket';
import { useToast } from '@/components/ui/toaster';
import { Sun, Moon } from 'lucide-react';

export function CommunityFeed() {
  const { posts, fetchPosts } = useCommunityStore();
  const { user } = useAuthStore();
  const { toast } = useToast();

  const [viewMode, setViewMode] = useState('prioritized');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(true); // Default to dark mode

  useEffect(() => {
    async function loadPosts() {
      setIsLoading(true);
      setError(null);
      try {
        await fetchPosts();
      } catch (err) {
        setError('Failed to load community posts. Please try again later.');
        toast('Failed to load posts', 'error');
      } finally {
        setIsLoading(false);
      }
    }

    loadPosts();
    connectSocket();

    const handleNewPost = () => toast('New post has been added!', 'info');
    const handleNewReply = () => toast('New reply has been added!', 'info');

    window.addEventListener('newPost', handleNewPost);
    window.addEventListener('newReply', handleNewReply);

    return () => {
      disconnectSocket();
      window.removeEventListener('newPost', handleNewPost);
      window.removeEventListener('newReply', handleNewReply);
    };
  }, [fetchPosts, toast]);

  const sortedPosts = [...posts].sort((a, b) => {
    if (viewMode === 'prioritized') {
      if (a.isAdmin && !b.isAdmin) return -1;
      if (!a.isAdmin && b.isAdmin) return 1;
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const themeStyles = {
    background: isDarkMode
      ? 'bg-gradient-to-br from-neutral-900 via-neutral-900 to-neutral-900'
      : 'bg-gradient-to-br from-indigo-100 via-purple-100 to-violet-200',
    header: isDarkMode ? 'text-white' : 'text-indigo-900',
    card: isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200',
    text: isDarkMode ? 'text-white' : 'text-gray-800',
    subText: isDarkMode ? 'text-gray-300' : 'text-gray-600',
    button: isDarkMode
      ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
      : 'bg-indigo-500 hover:bg-indigo-600 text-white',
    outlineButton: isDarkMode
      ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
      : 'border-gray-300 text-gray-700 hover:bg-gray-100',
    switchBg: isDarkMode ? 'bg-gray-700' : 'bg-gray-300',
    errorCard: isDarkMode
      ? 'bg-red-900 border-red-800 text-red-100'
      : 'bg-red-50 border-red-200 text-red-700',
    emptyCard: isDarkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-50 text-gray-500',
    upgradeCard: isDarkMode
      ? 'bg-indigo-800 border-indigo-700 text-indigo-100'
      : 'bg-indigo-50 border-indigo-200 text-indigo-800',
  };

  return (
    <div className={`min-h-screen ${themeStyles.background} transition-colors duration-300`}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:items-center mb-8">
          <h2 className={`text-2xl font-bold ${themeStyles.header}`}>
            Community Discussion
          </h2>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            {/* Theme Toggle Switch */}
            <div className="flex items-center space-x-2">
              <Switch
                id="theme-mode"
                checked={isDarkMode}
                onCheckedChange={(checked) => setIsDarkMode(checked)}
                className="data-[state=checked]:bg-purple-600 data-[state=unchecked]:bg-[#e3e3e3]"
              />
              <Label
                htmlFor="theme-mode"
                className={`text-sm font-medium flex items-center ${themeStyles.text}`}
              >
                {isDarkMode ? (
                  <>
                    <Moon size={16} className="mr-1" />
                    <span>Dark Mode</span>
                  </>
                ) : (
                  <>
                    <Sun size={16} className="mr-1" />
                    <span>Light Mode</span>
                  </>
                )}
              </Label>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center space-x-2">
              <Switch
                id="view-mode"
                checked={viewMode === 'prioritized'}
                onCheckedChange={(checked) =>
                  setViewMode(checked ? 'prioritized' : 'chronological')
                }
                className="data-[state=checked]:bg-purple-600 data-[state=unchecked]:bg-[#e3e3e3]"
              />
              <Label
                htmlFor="view-mode"
                className={`text-sm font-medium ${themeStyles.text}`}
              >
                {viewMode === 'prioritized'
                  ? 'Admin Posts Prioritized'
                  : 'Chronological View'}
              </Label>
            </div>

            {/* Create Post Gradient Button */}
            {user?.isPaid && (
              <div className="bg-gradient-to-r from-purple-400 to-indigo-400 rounded-md shadow-md text-white font-medium">
                <CreatePostDialog>
                  <div className="px-4 py-2">Create Post</div>
                </CreatePostDialog>
              </div>
            )}
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <div
              className={`animate-spin rounded-full h-12 w-12 border-b-2 ${
                isDarkMode ? 'border-purple-400' : 'border-indigo-600'
              }`}
            ></div>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div
            className={`${themeStyles.errorCard} px-4 py-3 rounded-md mb-6 shadow-md`}
          >
            <p>{error}</p>
            <Button
              onClick={() => fetchPosts()}
              variant="outline"
              size="sm"
              className={`mt-2 ${isDarkMode ? 'border-red-700 text-red-200' : ''}`}
            >
              Try Again
            </Button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && sortedPosts.length === 0 && (
          <div
            className={`text-center py-16 ${themeStyles.emptyCard} rounded-lg shadow-md`}
          >
            <h3
              className={`text-lg font-medium ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              } mb-2`}
            >
              No posts yet
            </h3>
            <p className={`${themeStyles.subText} mb-6`}>
              Be the first to start a discussion!
            </p>
            {user?.isPaid ? (
              <div className="bg-gradient-to-r from-purple-400 to-indigo-400 rounded-md shadow-md text-white font-medium inline-block">
                <CreatePostDialog>
                  <div className="px-4 py-2">Create Post</div>
                </CreatePostDialog>
              </div>
            ) : (
              <Button variant="outline" className={themeStyles.outlineButton} asChild>
                <a href="/pricing">Upgrade to Join Discussions</a>
              </Button>
            )}
          </div>
        )}

        {/* Posts List */}
        {!isLoading && !error && sortedPosts.length > 0 && (
          <AnimatePresence>
            <div className="space-y-6">
              {sortedPosts.map((post) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className={`${themeStyles.card} rounded-lg shadow-md border overflow-hidden`}
                >
                  <Post
                    post={post}
                    viewMode={viewMode}
                    isDarkMode={isDarkMode}
                  />
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        )}

        {/* Load More Button */}
        {!isLoading && !error && sortedPosts.length >= 10 && (
          <div className="mt-8 text-center">
            <Button
              variant="outline"
              className={`mx-auto ${themeStyles.outlineButton}`}
            >
              Load More Posts
            </Button>
          </div>
        )}

        {/* Upgrade Prompt */}
        {!user?.isPaid && (
          <div className={`mt-8 p-4 ${themeStyles.upgradeCard} rounded-lg shadow-md`}>
            <p className={isDarkMode ? 'text-indigo-200' : 'text-indigo-800'}>
              Upgrade to premium to participate in discussions!
            </p>
            <Button className={`mt-2 ${themeStyles.button}`} asChild>
              <a href="/pricing">Upgrade Now</a>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}



