import React from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Megaphone, 
  Star, 
  Wallet, 
  Settings, 
  Users, 
  FileCheck
} from 'lucide-react';

import { Header } from './Header';
import { Footer } from './Footer';
import { PageContainer } from './PageContainer';
import { useAuthStore } from '../../store/authStore';

export const DashboardLayout: React.FC = () => {
  const { user } = useAuthStore();
  const location = useLocation();
  
  const isActivePath = (path: string) => {
    return location.pathname.startsWith(path);
  };
  
  const renderNavLinks = () => {
    if (!user) return null;
    
    // Common links for all users
    const commonLinks = [
      {
        name: 'Dashboard',
        to: '/dashboard',
        icon: <LayoutDashboard className="h-5 w-5" />,
      },
      {
        name: 'Settings',
        to: '/settings',
        icon: <Settings className="h-5 w-5" />,
      }
    ];
    
    // Role-specific links
    type NavLink = { name: string; to: string; icon: React.ReactNode };
    let roleLinks: NavLink[] = [];
    
    if (user.role === 'admin') {
      roleLinks = [
        {
          name: 'Campaigns',
          to: '/campaigns',
          icon: <Megaphone className="h-5 w-5" />,
        },
        {
          name: 'Reviews',
          to: '/admin/reviews',
          icon: <Star className="h-5 w-5" />,
        },
        {
          name: 'Users',
          to: '/admin/users',
          icon: <Users className="h-5 w-5" />,
        },
        {
          name: 'Verifications',
          to: '/admin/verifications',
          icon: <FileCheck className="h-5 w-5" />,
        },
        {
          name: 'Analytics',
          to: '/admin/analytics',
          icon: <LayoutDashboard className="h-5 w-5" />,
        },
      ];
    } else if (user.role === 'business') {
      roleLinks = [
        {
          name: 'Campaigns',
          to: '/campaigns',
          icon: <Megaphone className="h-5 w-5" />,
        },
        {
          name: 'Reviews',
          to: '/reviews',
          icon: <Star className="h-5 w-5" />,
        },
        {
          name: 'Wallet',
          to: '/wallet',
          icon: <Wallet className="h-5 w-5" />,
        },
      ];
    } else if (user.role === 'reviewer') {
      roleLinks = [
        {
          name: 'Campaigns',
          to: '/campaigns',
          icon: <Megaphone className="h-5 w-5" />,
        },
        {
          name: 'My Reviews',
          to: '/reviews',
          icon: <Star className="h-5 w-5" />,
        },
        {
          name: 'Wallet',
          to: '/wallet',
          icon: <Wallet className="h-5 w-5" />,
        },
      ];
    }
    
    // Combine and render all links
    const allLinks = [...roleLinks, ...commonLinks];
    
    return allLinks.map((link) => (
      <Link
        key={link.to}
        to={link.to}
        className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 ${
          user?.role === 'admin'
            ? isActivePath(link.to)
              ? 'bg-primary text-black shadow-lg'
              : 'text-gray-300 hover:bg-gray-800 hover:text-primary border border-transparent hover:border-gray-700'
            : isActivePath(link.to)
              ? 'bg-primary-50 text-primary-700'
              : 'text-on-light hover:bg-accent-100 hover:text-primary'
        }`}
      >
        <span className="mr-3">{link.icon}</span>
        {link.name}
      </Link>
    ));
  };
  
  return (
    <div className={`min-h-screen flex flex-col ${user?.role === 'admin' ? 'bg-black' : 'bg-app'}`}>
      <Header />

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className="hidden md:flex md:flex-shrink-0">
          <div className={`flex flex-col w-64 border-r ${
            user?.role === 'admin'
              ? 'border-gray-700 bg-gradient-to-b from-gray-900 to-black'
              : 'border-accent-300 bg-card'
          }`}>
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <nav className="mt-5 flex-1 px-2 space-y-1">
                {renderNavLinks()}
              </nav>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div className={`flex-1 overflow-auto ${user?.role === 'admin' ? 'bg-black' : ''}`}>
          <PageContainer>
            <Outlet />
          </PageContainer>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};
