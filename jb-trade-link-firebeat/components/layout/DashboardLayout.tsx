
import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingBag,
  Truck,
  FileText,
  LogOut,
  Menu,
  Bell,
  Map as MapIcon,
  Building2,
  PlusCircle,
  RotateCcw,
  AlertTriangle,
  ShoppingCart,
  Activity,
  DollarSign,
  Boxes
} from 'lucide-react';
import { useAuth } from '../../services/auth';
import { UserRole } from '../../types';
import { WorkspaceSwitcher } from './WorkspaceSwitcher';

const navItems: Record<UserRole, { label: string; path: string; icon: any }[]> = {
  admin: [
    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Reports', path: '/admin/reports', icon: FileText },
    { label: 'Inventory', path: '/admin/inventory', icon: Boxes },
    { label: 'Unknown Cleanup', path: '/admin/unknown-product-cleanup', icon: AlertTriangle },
    { label: 'System Health', path: '/admin/health', icon: Activity }, // Moved up for visibility
    { label: 'New Order', path: '/admin/create-order', icon: PlusCircle },
    { label: 'Users', path: '/admin/users', icon: Users },
    { label: 'Companies', path: '/admin/companies', icon: Building2 },
    { label: 'Products', path: '/admin/products', icon: Package },
    { label: 'Customers', path: '/admin/customers', icon: Users },
    { label: 'All Credits (AR)', path: '/admin/credits', icon: DollarSign },
    { label: 'Sales Orders', path: '/admin/orders', icon: ShoppingBag },
    { label: 'Purchases', path: '/admin/purchases', icon: ShoppingCart },
    { label: 'Vehicles', path: '/admin/vehicles', icon: Truck },
    { label: 'Dispatch', path: '/admin/dispatch', icon: Truck },
    { label: 'HR & Commissions', path: '/admin/hr', icon: DollarSign },
    { label: 'Returns', path: '/admin/returns', icon: RotateCcw },
    { label: 'Damaged Goods', path: '/admin/damaged-goods', icon: AlertTriangle },
  ],
  sales: [
    { label: 'Dashboard', path: '/sales/dashboard', icon: LayoutDashboard },
    { label: 'Create Order', path: '/sales/create-order', icon: ShoppingBag },
    { label: 'My Orders', path: '/sales/orders', icon: FileText },
    { label: 'Performance', path: '/sales/performance', icon: Users },
  ],
  delivery: [
    { label: 'Dashboard', path: '/delivery/dashboard', icon: LayoutDashboard },
    { label: 'Route Map', path: '/delivery/route-map', icon: MapIcon },
  ]
};

export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  if (!user) return null;

  // Determine current workspace from URL path
  // This allows admins to see the correct sidebar when switching workspaces
  const currentPath = location.pathname;
  let currentWorkspace: UserRole = user.role;

  if (user.role === 'admin') {
    // For admins, detect workspace from URL
    if (currentPath.startsWith('/sales')) {
      currentWorkspace = 'sales';
    } else if (currentPath.startsWith('/delivery')) {
      currentWorkspace = 'delivery';
    } else {
      currentWorkspace = 'admin';
    }
  }

  const roleNav = navItems[currentWorkspace] || [];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-slate-900 bg-opacity-40 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-30 w-64 transform bg-white border-r border-slate-200 shadow-xl transition-transform duration-300 lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Logo Section */}
        <div className="flex h-16 items-center px-6 border-b border-slate-200 bg-gradient-to-r from-blue-600 to-blue-700">
          <h1 className="text-2xl font-bold text-white tracking-tight">FIREBEAT</h1>
        </div>

        {/* Navigation */}
        <nav className="mt-8 px-4 space-y-1 overflow-y-auto h-[calc(100vh-9rem)] scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
          {roleNav.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 group ${isActive
                  ? 'bg-blue-50 text-blue-700 shadow-sm border-l-4 border-blue-600'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                }`
              }
            >
              <item.icon className="mr-3 h-5 w-5 transition-transform duration-200 group-hover:scale-110" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Bottom Section */}
        <div className="absolute bottom-0 w-full border-t border-slate-200 p-4 bg-gradient-to-t from-slate-50 to-white">
          <div className="mb-3 text-xs text-center text-slate-500">
            {user.role === 'admin' && currentWorkspace !== 'admin' ? (
              <span>Viewing as <span className="font-semibold capitalize text-slate-700">{currentWorkspace}</span></span>
            ) : (
              <span>Logged in as <span className="font-semibold capitalize text-slate-700">{user.role}</span></span>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 border border-red-200 hover:border-red-300"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-16 items-center justify-between bg-white border-b border-slate-200 px-6 shadow-sm z-10">
          <button className="lg:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors duration-200" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-6 w-6 text-slate-600" />
          </button>

          {/* Workspace Switcher - Only visible for admins */}
          <WorkspaceSwitcher className="hidden lg:flex ml-4" />

          <div className="flex items-center gap-6 ml-auto">
            {/* Mobile workspace switcher */}
            <WorkspaceSwitcher className="flex lg:hidden" />

            <button className="relative p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors duration-200 group">
              <Bell className="h-6 w-6" />
              <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-red-500 group-hover:animate-pulse"></span>
            </button>

            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-slate-900">{user.name}</p>
                <p className="text-xs text-slate-500 capitalize">{user.role}</p>
              </div>
              <img
                className="h-9 w-9 rounded-full object-cover border-2 border-blue-200 shadow-sm"
                src={user.avatarUrl}
                alt={user.name}
              />
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-8 bg-gradient-to-br from-slate-50 via-white to-slate-50">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
