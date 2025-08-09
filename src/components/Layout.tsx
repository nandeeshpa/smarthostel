import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Menu, 
  X, 
  Home, 
  Calendar, 
  QrCode, 
  AlertTriangle, 
  Users, 
  Utensils, 
  CreditCard, 
  AlertCircle, 
  Clipboard, 
  CheckSquare, 
  HelpCircle, 
  Search,
  LogOut,
  User,
  UserCheck
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: Home },
    { name: 'Leave Management', path: '/leave-management', icon: Calendar },
    { name: 'Mission Entry', path: '/mission-entry', icon: QrCode },
    { name: 'Complaint Tracker', path: '/complaint-tracker', icon: AlertTriangle },
    { name: 'Attendance Monitor', path: '/attendance-monitoring', icon: Users },
    { name: 'Mess Feedback', path: '/mess-feedback', icon: Utensils },
    { name: 'Digital ID', path: '/digital-id', icon: CreditCard },
    { name: 'Emergency Alert', path: '/emergency-alert', icon: AlertCircle },
    { name: 'Notice Board', path: '/notice-board', icon: Clipboard },
    { name: 'Task Checklist', path: '/task-checklist', icon: CheckSquare },
    { name: 'Peer Help', path: '/peer-help', icon: HelpCircle },
    { name: 'Lost & Found', path: '/lost-found', icon: Search },
    ...(user?.role === 'student' ? [{ name: 'Mark Attendance', path: '/attendance-marking', icon: UserCheck }] : [])
  ];

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between h-16 px-4 bg-violet-900 text-white">
            <h1 className="font-bold text-lg">Smart Hostel</h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <nav className="mt-5 px-2 flex-1 overflow-y-auto">
            <div className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`${isActive 
                      ? 'bg-violet-100 text-violet-900 border-r-2 border-violet-900' 
                      : 'text-gray-700 hover:bg-gray-100'
                    } group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-200`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Icon
                      className={`${isActive ? 'text-violet-900' : 'text-gray-400 group-hover:text-gray-500'} mr-3 h-5 w-5`}
                    />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Bottom Logout Button */}
          <div className="p-3 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center space-x-2 py-2 border-2 border-red-600 rounded-lg text-red-700 hover:bg-red-50 transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span className="font-semibold">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        {/* Top bar */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden"
            >
              <Menu className="h-6 w-6 text-gray-500" />
            </button>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">
                  {user?.id} ({user?.role})
                </span>
              </div>
              {/* Kept top logout minimal; primary logout at sidebar bottom */}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;