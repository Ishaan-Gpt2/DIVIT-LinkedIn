import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  LayoutDashboard,
  FileText,
  Users,
  MessageSquare,
  Link2,
  BarChart3,
  CreditCard,
  Settings,
  LogOut,
  Crown,
  Zap,
  TestTube,
  Rocket,
  Bot
} from 'lucide-react';
import { SplashCursor } from '@/components/ui/splash-cursor';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Post Generator', href: '/post-generator', icon: FileText },
  { name: 'Clone Builder', href: '/clone-builder', icon: Users },
  { name: 'Auto Commenter', href: '/auto-commenter', icon: MessageSquare },
  { name: 'Connect Engine', href: '/connect-engine', icon: Link2 },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Roadmap', href: '/roadmap', icon: Rocket },
  { name: 'Testing Environment', href: '/testing-environment', icon: TestTube },
  { name: 'Pricing', href: '/pricing', icon: CreditCard },
  { name: 'Settings', href: '/settings', icon: Settings },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getPlanBadge = () => {
    const planColors = {
      free: 'bg-gray-600',
      creator: 'bg-purple-600',
      ghostwriter: 'bg-purple-700',
      agency: 'bg-purple-800'
    };
    
    const planIcons = {
      free: null,
      creator: Zap,
      ghostwriter: Crown,
      agency: Crown
    };

    const Icon = planIcons[user?.plan || 'free'];
    
    return (
      <Badge className={`${planColors[user?.plan || 'free']} text-white`}>
        {Icon && <Icon className="w-3 h-3 mr-1" />}
        {user?.plan?.toUpperCase()}
      </Badge>
    );
  };

  return (
    <div className="flex h-screen bg-black w-full">
      {/* Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:flex-shrink-0">
        <div className="flex flex-col flex-grow pt-5 overflow-y-auto glass-purple border-r border-purple-800/30 neuro">
          <div className="flex items-center flex-shrink-0 px-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-purple-800 rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/25">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <span className="ml-2 text-xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
                DIVIT.AI
              </span>
            </div>
          </div>
          
          <div className="mt-8 flex flex-col flex-grow">
            <nav className="flex-1 px-2 space-y-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`${
                      isActive
                        ? 'bg-purple-600/20 text-purple-400 border-r-2 border-purple-500 shadow-lg shadow-purple-500/25'
                        : 'text-gray-300 hover:bg-purple-900/20 hover:text-white'
                    } group flex items-center px-2 py-2 text-sm font-medium rounded-l-md transition-all duration-300`}
                  >
                    <item.icon
                      className={`${
                        isActive ? 'text-purple-400' : 'text-gray-400 group-hover:text-gray-300'
                      } mr-3 flex-shrink-0 h-5 w-5`}
                    />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden w-full">
        {/* Top bar */}
        <header className="glass-purple border-b border-purple-800/30 flex-shrink-0 w-full">
          <div className="flex items-center justify-between h-16 px-4 w-full">
            <div className="flex items-center">
              <h1 className="text-lg font-semibold text-white">
                {navigation.find(item => item.href === location.pathname)?.name || 'Dashboard'}
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Credits */}
              <div className="hidden sm:flex items-center space-x-2 px-3 py-1 glass-purple rounded-full neuro-inset">
                <Zap className="w-4 h-4 text-purple-400" />
                <span className="text-sm font-medium text-white">{user?.credits}</span>
                <span className="text-xs text-gray-400">credits</span>
              </div>

              {/* Plan Badge */}
              {getPlanBadge()}

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.avatar_url || undefined} alt={user?.name} />
                      <AvatarFallback className="bg-purple-600 text-white">
                        {user?.name?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 glass-purple border-purple-800/30" align="end">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium text-white">{user?.name}</p>
                    <p className="text-xs text-gray-400">{user?.email}</p>
                  </div>
                  <DropdownMenuSeparator className="bg-purple-800/30" />
                  <DropdownMenuItem className="text-gray-300 hover:bg-purple-900/20" asChild>
                    <Link to="/settings">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-gray-300 hover:bg-purple-900/20" asChild>
                    <Link to="/testing-environment">
                      <TestTube className="mr-2 h-4 w-4" />
                      API Testing
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-gray-300 hover:bg-purple-900/20" asChild>
                    <Link to="/pricing">
                      <CreditCard className="mr-2 h-4 w-4" />
                      Upgrade Plan
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-purple-800/30" />
                  <DropdownMenuItem 
                    className="text-red-400 hover:bg-red-600/20"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto bg-black w-full">
          <div className="h-full w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}