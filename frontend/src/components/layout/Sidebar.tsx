// import { useState, useRef, useEffect } from 'react';
// import { NavLink, Link, useNavigate } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import { useAuthStore } from '@/store/auth';
// import {
//   LayoutDashboard,
//   PlayCircle,
//   Users,
//   User,
//   CreditCard,
//   Upload,
//   ChevronRight,
// } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import {
//   DropdownMenu,
//   DropdownMenuTrigger,
//   DropdownMenuContent,
//   DropdownMenuItem,
// } from '@/components/ui/dropdown-menu';
// import { Avatar, AvatarFallback } from '@/components/ui/avatar';

// // Sidebar nav items
// const navItems = [
//   { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
//   { name: 'Videos', href: '/videos', icon: PlayCircle },
//   { name: 'Community', href: '/community', icon: Users },
//   { name: 'Profile', href: '/profile', icon: User },
//   { name: 'Pricing', href: '/pricing', icon: CreditCard },
// ];
// // const adminItems = [{ name: 'Upload Data', href: '/admin/upload', icon: Upload }];

// export function Sidebar() {
//   const { user, logout } = useAuthStore();
//   const [open, setOpen] = useState(true);
//   const navigate = useNavigate();
//   const [isAnimating, setIsAnimating] = useState(false);
//   // const isAdmin = user?.userType === 'ADMIN';
//   const links = navItems;

//   // Reference for transition control
//   const animationRef = useRef(null);

//   // Handle animation start and end
//   const handleAnimationStart = () => setIsAnimating(true);
//   const handleAnimationComplete = () => setIsAnimating(false);

//   // Set fixed positions during animation
//   useEffect(() => {
//     const cleanup = () => setIsAnimating(false);
//     return cleanup;
//   }, []);

//   // Consistent transition settings
//   const transition = { 
//     type: "tween", 
//     duration: 0.3, 
//     ease: "easeInOut",
//     onStart: handleAnimationStart,
//     onComplete: handleAnimationComplete
//   };

//   const handleLogout = () => {
//     console.log('Logging out...');
//     logout();
//     navigate('/login'); // Navigate to signin page after logout
//   };

//   // Use inline styles for predictable content positioning
//   const getIconContainerStyle = () => {
//     // During animation, keep everything centered to prevent spreading
//     if (isAnimating) {
//       return { 
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//         width: '100%'
//       };
//     }
    
//     return {
//       display: 'flex',
//       alignItems: 'center',
//       justifyContent: open ? 'flex-start' : 'center',
//       width: '100%',
//       paddingLeft: open ? '12px' : '0',
//       paddingRight: open ? '12px' : '0'
//     };
//   };

//   return (
//     <motion.nav
//       ref={animationRef}
//       className="sticky top-0 h-screen border-r border-gray-200 bg-[#e3e3e3] p-3 shadow-sm z-10 flex flex-col overflow-hidden"
//       style={{ width: open ? '220px' : '64px' }}
//       animate={{ width: open ? '220px' : '64px' }}
//       transition={transition}
//     >
//       {/* User Info and Dropdown */}
//       <div className="mb-4 border-b border-gray-200 pb-3">
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button
//               variant="ghost"
//               className="w-full rounded-md hover:bg-gray-100 transition p-2"
//             >
//               <div style={getIconContainerStyle()}>
//                 <Avatar className="h-8 w-8 flex-shrink-0">
//                   <AvatarFallback>{user?.name?.[0]}</AvatarFallback>
//                 </Avatar>
//                 {open && !isAnimating && (
//                   <motion.div
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     className="ml-3 text-left overflow-hidden"
//                   >
//                     <p className="text-sm font-semibold leading-none truncate">
//                       {user?.name}
//                     </p>
//                     <p className="text-xs text-gray-500 truncate">
//                       {user?.isPaid ? 'Premium' : 'Free Plan'}
//                     </p>
//                   </motion.div>
//                 )}
//               </div>
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent align="start" side="right" className="w-48">
//             {/* <DropdownMenuItem asChild>
//               <Link to="/profile" className="w-full">
//                 Profile
//               </Link>
//             </DropdownMenuItem> */}
//             <DropdownMenuItem >
//               <button onClick={handleLogout} className="w-full text-left px-2 py-1">
//                   Logout
//               </button>
//             </DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>
//       </div>

//       {/* Nav Links */}
//       <div className="space-y-1 flex-grow">
//         {links.map((item) => (
//           <NavLink
//             key={item.name}
//             to={item.href}
//             className={({ isActive }) => {
//               const baseClasses = "block rounded-md text-sm font-medium transition-all py-2 w-full";
//               const activeClasses = isActive
//                 ? "bg-gradient-to-br from-purple-400 from-40% to-indigo-400 text-white"
//                 : "text-gray-600 hover:bg-gray-100 hover:text-white-900";
              
//               return `${baseClasses} ${activeClasses}`;
//             }}
//           >
//             <div style={getIconContainerStyle()}>
//               <div className="inline-flex items-center justify-center flex-shrink-0">
//                 <item.icon size={18} />
//               </div>
//               {open && !isAnimating && (
//                 <motion.span
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   className="ml-3 truncate"
//                 >
//                   {item.name}
//                 </motion.span>
//               )}
//             </div>
//           </NavLink>
//         ))}
//       </div>

//       {/* Collapse Button */}
//       <button
//         onClick={() => setOpen((prev) => !prev)}
//         className="border-t border-gray-200 hover:bg-gray-100 transition-colors mt-auto py-2 w-full"
//       >
//         <div style={getIconContainerStyle()}>
//           <div className="inline-flex items-center justify-center flex-shrink-0">
//             <ChevronRight
//               size={18}
//               className={`transition-transform ${open ? 'rotate-180' : ''}`}
//             />
//           </div>
//           {open && !isAnimating && (
//             <motion.span
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               className="ml-2 text-xs"
//             >
//               Collapse
//             </motion.span>
//           )}
//         </div>
//       </button>
//     </motion.nav>
//   );
// }




// import { useState, useRef, useEffect } from 'react';
// import { NavLink, Link, useNavigate } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import { useAuthStore } from '@/store/auth';
// import {
//   LayoutDashboard,
//   PlayCircle,
//   Users,
//   User,
//   CreditCard,
//   Upload,
//   Menu,
// } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import {
//   DropdownMenu,
//   DropdownMenuTrigger,
//   DropdownMenuContent,
//   DropdownMenuItem,
// } from '@/components/ui/dropdown-menu';
// import { Avatar, AvatarFallback } from '@/components/ui/avatar';

// // Sidebar nav items
// const navItems = [
//   { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
//   { name: 'Videos', href: '/videos', icon: PlayCircle },
//   { name: 'Community', href: '/community', icon: Users },
//   { name: 'Profile', href: '/profile', icon: User },
//   { name: 'Pricing', href: '/pricing', icon: CreditCard },
// ];

// export function Sidebar() {
//   const { user, logout } = useAuthStore();
//   const [open, setOpen] = useState(true);
//   const [isHovering, setIsHovering] = useState(false);
//   const navigate = useNavigate();
//   const [isAnimating, setIsAnimating] = useState(false);
//   const links = navItems;

//   // Reference for transition control
//   const animationRef = useRef(null);

//   // Handle animation start and end
//   const handleAnimationStart = () => setIsAnimating(true);
//   const handleAnimationComplete = () => setIsAnimating(false);

//   // Set fixed positions during animation
//   useEffect(() => {
//     const cleanup = () => setIsAnimating(false);
//     return cleanup;
//   }, []);

//   // Consistent transition settings
//   const transition = { 
//     type: "tween", 
//     duration: 0.3, 
//     ease: "easeInOut",
//     onStart: handleAnimationStart,
//     onComplete: handleAnimationComplete
//   };

//   const handleLogout = () => {
//     console.log('Logging out...');
//     logout();
//     navigate('/login'); // Navigate to signin page after logout
//   };

//   return (
//     <motion.nav
//       ref={animationRef}
//       className="sticky top-0 h-screen border-r border-gray-200 bg-[#e3e3e3] p-3 shadow-sm z-10 flex flex-col overflow-hidden"
//       style={{ width: open ? '220px' : '64px' }}
//       animate={{ width: open ? '220px' : '64px' }}
//       transition={transition}
//     >
//       {/* User Info and Dropdown */}
//       <div className="mb-4 border-b border-gray-200 pb-3">
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button
//               variant="ghost"
//               className="w-full rounded-md hover:bg-gray-100 transition p-0"
//             >
//               <div className={`flex items-center w-full ${open ? 'justify-start px-2' : 'justify-center'}`}>
//               <Avatar className="h-8 w-8 flex-shrink-0 -ml-4"> {/* Added ml-2 for margin-left */}
//                 <AvatarFallback>{user?.name?.[0]}</AvatarFallback>
//               </Avatar>
              
//               {open && !isAnimating && (
//                 <motion.div
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   className="ml-3 text-left overflow-hidden"
//                 >
//                   <p className="text-sm font-semibold leading-none truncate">
//                     {user?.name}
//                   </p>
//                   <p className="text-xs text-gray-500 truncate">
//                     {user?.isPaid ? 'Premium' : 'Free Plan'}
//                   </p>
//                 </motion.div>
//               )}
//             </div>

//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent 
//             align="end"
//             side={open ? "right" : "right"}
//             sideOffset={5}
//             className="w-8"
//           >
//             <DropdownMenuItem>
//               <button onClick={handleLogout} className="w-full text-left py-1">
//                 Logout
//               </button>
//             </DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>
//       </div>

//       {/* Nav Links */}
//       <div className="space-y-1 flex-grow">
//         {links.map((item) => (
//           <NavLink
//             key={item.name}
//             to={item.href}
//             className={({ isActive }) => {
//               const baseClasses = "block rounded-md text-sm font-medium transition-all py-2 w-full";
//               const activeClasses = isActive
//                 ? "bg-gradient-to-br from-purple-400 from-40% to-indigo-400 text-white"
//                 : "text-gray-600 hover:bg-gray-100 hover:text-white-900";
              
//               return `${baseClasses} ${activeClasses}`;
//             }}
//           >
//             <div className={`flex items-center ${open ? 'justify-start pl-3' : 'justify-center'}`}>
//               <div className="inline-flex items-center justify-center">
//                 <item.icon size={18} />
//               </div>
//               {open && !isAnimating && (
//                 <motion.span
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   className="ml-3 truncate"
//                 >
//                   {item.name}
//                 </motion.span>
//               )}
//             </div>
//           </NavLink>
//         ))}
//       </div>

//       {/* Hamburger Button with Animation */}
//       <motion.button
//         onClick={() => setOpen((prev) => !prev)}
//         onMouseEnter={() => setIsHovering(true)}
//         onMouseLeave={() => setIsHovering(false)}
//         className="border-t border-gray-200 hover:bg-gray-100 transition-colors mt-auto py-2 w-full"
//       >
//         <div className={`flex items-center ${open ? 'justify-start pl-3' : 'justify-center'}`}>
//           <motion.div 
//             className="inline-flex items-center justify-center"
//             animate={{ 
//               rotate: isHovering ? 180 : 0,
//               scale: isHovering ? 1.2 : 1
//             }}
//             transition={{ duration: 0.3 }}
//           >
//             <Menu size={18} />
//           </motion.div>
//           {open && !isAnimating && (
//             <motion.span
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               className="ml-2 text-xs"
//             >
//               Collapse
//             </motion.span>
//           )}
//         </div>
//       </motion.button>
//     </motion.nav>
//   );
// }


import { useState, useRef, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/auth';
import {
  LayoutDashboard,
  PlayCircle,
  Users,
  User,
  CreditCard,
  Upload,
  Menu,
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

// Sidebar nav items
const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Videos', href: '/videos', icon: PlayCircle },
  { name: 'Community', href: '/community', icon: Users },
  { name: 'Profile', href: '/profile', icon: User },
  { name: 'Pricing', href: '/pricing', icon: CreditCard },
];

export function Sidebar() {
  const { user, logout } = useAuthStore();
  const [open, setOpen] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  const navigate = useNavigate();
  const [isAnimating, setIsAnimating] = useState(false);
  const links = navItems;

  // Reference for transition control
  const animationRef = useRef(null);

  // Handle animation start and end
  const handleAnimationStart = () => setIsAnimating(true);
  const handleAnimationComplete = () => setIsAnimating(false);

  // Set fixed positions during animation
  useEffect(() => {
    const cleanup = () => setIsAnimating(false);
    return cleanup;
  }, []);

  // Consistent transition settings
  const transition = { 
    type: "tween", 
    duration: 0.3, 
    ease: "easeInOut",
    onStart: handleAnimationStart,
    onComplete: handleAnimationComplete
  };

  const handleLogout = () => {
    console.log('Logging out...');
    logout();
    navigate('/login'); // Navigate to signin page after logout
  };

  return (
    <motion.nav
      ref={animationRef}
      className="sticky top-0 h-screen border-r border-gray-200 bg-[#e3e3e3] p-3 shadow-sm z-10 flex flex-col overflow-hidden"
      style={{ width: open ? '220px' : '64px' }}
      animate={{ width: open ? '220px' : '64px' }}
      transition={transition}
    >
      {/* User Info and Dropdown - Only shown when sidebar is expanded */}
      {open ? (
        <div className="mb-4 border-b border-gray-200 pb-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="w-full rounded-md hover:bg-gray-100 transition p-0"
              >
                <div className="flex items-center w-full justify-start px-2">
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarFallback>{user?.name?.[0]}</AvatarFallback>
                  </Avatar>
                  
                  {!isAnimating && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="ml-3 text-left overflow-hidden"
                    >
                      <p className="text-sm font-semibold leading-none truncate">
                        {user?.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {user?.isPaid ? 'Premium' : 'Free Plan'}
                      </p>
                    </motion.div>
                  )}
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end"
              side="right"
              sideOffset={5}
              className="w-8"
            >
              <DropdownMenuItem>
                <button onClick={handleLogout} className="w-full text-left py-1">
                  Logout
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : (
        // Collapsed state - Show Avatar and Logout button separately
        <div className="mb-4 border-b border-gray-200 pb-3 flex flex-col items-center">
          <Avatar className="h-8 w-8 mb-2">
            <AvatarFallback>{user?.name?.[0]}</AvatarFallback>
          </Avatar>
          
          <Button 
            variant="ghost" 
            size="md" 
            onClick={handleLogout} 
            className="mt-1 p-0 h-6 w-6 rounded-full bg-purple-400 hover:bg-purple-600"
            title="Logout"
          >
            <LogOut size={18} className="text-white" />
            
          </Button>
        </div>
      )}

      {/* Nav Links */}
      <div className="space-y-1 flex-grow">
        {links.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) => {
              const baseClasses = "block rounded-md text-sm font-medium transition-all py-2 w-full";
              const activeClasses = isActive
                ? "bg-gradient-to-br from-purple-400 from-40% to-indigo-400 text-white"
                : "text-gray-600 hover:bg-gray-100 hover:text-white-900";
              
              return `${baseClasses} ${activeClasses}`;
            }}
          >
            <div className={`flex items-center ${open ? 'justify-start pl-3' : 'justify-center'}`}>
              <div className="inline-flex items-center justify-center">
                <item.icon size={18} />
              </div>
              {open && !isAnimating && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="ml-3 truncate"
                >
                  {item.name}
                </motion.span>
              )}
            </div>
          </NavLink>
        ))}
      </div>

      {/* Hamburger Button with Animation */}
      <motion.button
        onClick={() => setOpen((prev) => !prev)}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        className="border-t border-gray-200 hover:bg-gray-100 transition-colors mt-auto py-2 w-full"
      >
        <div className={`flex items-center ${open ? 'justify-start pl-3' : 'justify-center'}`}>
          <motion.div 
            className="inline-flex items-center justify-center"
            animate={{ 
              rotate: isHovering ? 180 : 0,
              scale: isHovering ? 1.2 : 1
            }}
            transition={{ duration: 0.3 }}
          >
            <Menu size={18} />
          </motion.div>
          {open && !isAnimating && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="ml-2 text-xs"
            >
              Collapse
            </motion.span>
          )}
        </div>
      </motion.button>
    </motion.nav>
  );
}