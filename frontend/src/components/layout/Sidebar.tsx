import { NavLink } from 'react-router-dom';
import { useAuthStore } from '@/store/auth';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  PlayCircle,
  Users,
  User,
  CreditCard,
  FileSpreadsheet,
  Upload,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Videos', href: '/videos', icon: PlayCircle },
  { name: 'Community', href: '/community', icon: Users },
  { name: 'Profile', href: '/profile', icon: User },
  { name: 'Pricing', href: '/pricing', icon: CreditCard },
];

// Admin-only navigation items
const adminNavigation = [
  { name: 'Upload Data', href: '/admin/upload', icon: Upload },
];

export function Sidebar() {
  const { user } = useAuthStore();
  
  // Determine which navigation items to show
  const navItems = [...navigation];
  if (user?.userType === 'SCHOOL') {
    navItems.push(...adminNavigation);
  }

  return (
    <div className="w-64 bg-white shadow-sm h-[calc(100vh-4rem)]">
      <nav className="mt-5 px-2">
        <div className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  'group flex items-center px-2 py-2 text-sm font-medium rounded-md',
                  isActive
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                )
              }
            >
              <item.icon
                className="mr-3 h-6 w-6 flex-shrink-0"
                aria-hidden="true"
              />
              {item.name}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}