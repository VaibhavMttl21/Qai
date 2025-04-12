import { useState, useRef, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/auth';
import {
  LayoutDashboard,
  PlayCircle,
  Users,
  User,
  CreditCard,
  Upload,
  ChevronRight,
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
const adminItems = [{ name: 'Upload Data', href: '/admin/upload', icon: Upload }];

export function Sidebar() {
  const { user, logout } = useAuthStore();
  const [open, setOpen] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const isAdmin = user?.userType === 'ADMIN';
  const links = isAdmin ? [...navItems, ...adminItems] : navItems;

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

  // Use inline styles for predictable content positioning
  const getIconContainerStyle = () => {
    // During animation, keep everything centered to prevent spreading
    if (isAnimating) {
      return { 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%'
      };
    }
    
    return {
      display: 'flex',
      alignItems: 'center',
      justifyContent: open ? 'flex-start' : 'center',
      width: '100%',
      paddingLeft: open ? '12px' : '0',
      paddingRight: open ? '12px' : '0'
    };
  };

  return (
    <motion.nav
      ref={animationRef}
      className="sticky top-0 h-screen border-r border-gray-200 bg-white p-3 shadow-sm z-10 flex flex-col overflow-hidden"
      style={{ width: open ? '220px' : '64px' }}
      animate={{ width: open ? '220px' : '64px' }}
      transition={transition}
    >
      {/* User Info and Dropdown */}
      <div className="mb-4 border-b border-gray-200 pb-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="w-full rounded-md hover:bg-gray-100 transition p-2"
            >
              <div style={getIconContainerStyle()}>
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarFallback>{user?.name?.[0]}</AvatarFallback>
                </Avatar>
                {open && !isAnimating && (
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
          <DropdownMenuContent align="start" side="right" className="w-48">
            <DropdownMenuItem asChild>
              <Link to="/profile" className="w-full">
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Nav Links */}
      <div className="space-y-1 flex-grow">
        {links.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) => {
              const baseClasses = "block rounded-md text-sm font-medium transition-all py-2 w-full";
              const activeClasses = isActive
                ? "bg-indigo-100 text-indigo-800"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900";
              
              return `${baseClasses} ${activeClasses}`;
            }}
          >
            <div style={getIconContainerStyle()}>
              <div className="inline-flex items-center justify-center flex-shrink-0">
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

      {/* Collapse Button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="border-t border-gray-200 hover:bg-gray-100 transition-colors mt-auto py-2 w-full"
      >
        <div style={getIconContainerStyle()}>
          <div className="inline-flex items-center justify-center flex-shrink-0">
            <ChevronRight
              size={18}
              className={`transition-transform ${open ? 'rotate-180' : ''}`}
            />
          </div>
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
      </button>
    </motion.nav>
  );
}