import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
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
  UserCheck,
  TrendingUp
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  const moduleCards = [
    {
      title: 'Leave Management',
      description: 'Apply for leave and track status',
      path: '/leave-management',
      icon: Calendar,
      color: 'bg-violet-600',
      stats: '3 Pending'
    },
    {
      title: 'Mission Entry',
      description: 'QR code based entry monitoring',
      path: '/mission-entry',
      icon: QrCode,
      color: 'bg-emerald-600',
      stats: 'Active'
    },
    {
      title: 'Complaint Tracker',
      description: 'Submit and track maintenance requests',
      path: '/complaint-tracker',
      icon: AlertTriangle,
      color: 'bg-amber-500',
      stats: '2 Open'
    },
    {
      title: 'Attendance Monitor',
      description: 'View attendance records and patterns',
      path: '/attendance-monitoring',
      icon: Users,
      color: 'bg-fuchsia-600',
      stats: '95% This Month'
    },
    {
      title: 'Mess Feedback',
      description: 'Rate meals and pre-book food',
      path: '/mess-feedback',
      icon: Utensils,
      color: 'bg-rose-500',
      stats: 'Today: Chicken Curry'
    },
    {
      title: 'Digital ID',
      description: 'Digital ID card and gate pass',
      path: '/digital-id',
      icon: CreditCard,
      color: 'bg-indigo-600',
      stats: 'Valid'
    },
    {
      title: 'Emergency Alert',
      description: 'Emergency contact and alerts',
      path: '/emergency-alert',
      icon: AlertCircle,
      color: 'bg-red-600',
      stats: 'Ready'
    },
    {
      title: 'Notice Board',
      description: 'Important announcements and notices',
      path: '/notice-board',
      icon: Clipboard,
      color: 'bg-teal-600',
      stats: '5 New'
    },
    {
      title: 'Task Checklist',
      description: 'Daily tasks for wardens',
      path: '/task-checklist',
      icon: CheckSquare,
      color: 'bg-pink-600',
      stats: user?.role === 'warden' ? '12/15 Done' : 'View Only'
    },
    {
      title: 'Peer Help',
      description: 'Ask for help or help others',
      path: '/peer-help',
      icon: HelpCircle,
      color: 'bg-sky-600',
      stats: '8 Active Requests'
    },
    {
      title: 'Lost & Found',
      description: 'Report lost items or found items',
      path: '/lost-found',
      icon: Search,
      color: 'bg-lime-600',
      stats: '12 Items Listed'
    }
  ];

  if (user?.role === 'student') {
    moduleCards.push({
      title: 'Mark Attendance',
      description: 'Mark your daily attendance',
      path: '/attendance-marking',
      icon: UserCheck,
      color: 'bg-emerald-600',
      stats: 'Today: Not Marked'
    });
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-violet-700 to-fuchsia-700 rounded-lg shadow-lg text-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              Welcome back, {user?.id}!
            </h1>
            <p className="text-violet-100 mt-2">
              {user?.role === 'student' && `Block ${user.block}, Room ${user.roomNumber}`}
              {user?.role === 'parent' && `Block ${user.block} Parent`}
              {user?.role === 'warden' && 'Hostel Warden Dashboard'}
            </p>
          </div>
          <div className="text-right">
            <p className="text-violet-200 text-sm">Role</p>
            <p className="text-xl font-semibold capitalize">{user?.role}</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-full">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Attendance</p>
              <p className="text-2xl font-semibold text-gray-900">95%</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-full">
              <AlertTriangle className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Tasks</p>
              <p className="text-2xl font-semibold text-gray-900">5</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-full">
              <Clipboard className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">New Notices</p>
              <p className="text-2xl font-semibold text-gray-900">3</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-full">
              <HelpCircle className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Help Requests</p>
              <p className="text-2xl font-semibold text-gray-900">8</p>
            </div>
          </div>
        </div>
      </div>

      {/* Module Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {moduleCards.map((module) => {
          const Icon = module.icon;
          return (
            <Link
              key={module.path}
              to={module.path}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 transform"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-full ${module.color}`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {module.stats}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {module.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {module.description}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;