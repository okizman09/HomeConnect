import React, { useState } from 'react';
import { Home, Search, MessageSquare, Plus, LogOut, User, LayoutDashboard, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ currentPage, onNavigate }) => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!user) return null;

  const handleLogout = async () => {
    await logout();
    onNavigate('landing');
  };

  const handleNavigate = (page) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  const isActive = (page) => currentPage === page ? 'text-white bg-indigo-700' : 'text-indigo-100 hover:text-white hover:bg-indigo-700';

  const isDashboardActive = currentPage === 'dashboard' || (user.role === 'landlord' && currentPage === 'listings' && !mobileMenuOpen);

  return (
    <nav className="bg-indigo-600 text-white shadow-lg sticky top-0 z-40">
      <div className="container mx-auto px-4">
        {/* Main Navigation */}
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <button
            onClick={() => handleNavigate(user.role === 'landlord' ? 'dashboard' : 'listings')}
            className="flex items-center space-x-2 hover:opacity-80 transition flex-shrink-0"
          >
            <Home className="w-8 h-8" />
            <span className="text-2xl font-bold hidden sm:inline">HomeConnect</span>
          </button>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            {user.role === 'landlord' ? (
              <>
                <button
                  onClick={() => handleNavigate('dashboard')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition ${isActive('dashboard')}`}
                >
                  <LayoutDashboard className="w-5 h-5" />
                  <span>Dashboard</span>
                </button>
                <button
                  onClick={() => handleNavigate('create')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition ${isActive('create')}`}
                >
                  <Plus className="w-5 h-5" />
                  <span>Create Listing</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => handleNavigate('dashboard')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition ${isActive('dashboard')}`}
                >
                  <LayoutDashboard className="w-5 h-5" />
                  <span>Dashboard</span>
                </button>
                <button
                  onClick={() => handleNavigate('listings')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition ${isActive('listings')}`}
                >
                  <Search className="w-5 h-5" />
                  <span>Explore</span>
                </button>
              </>
            )}

            <button
              onClick={() => handleNavigate('chats')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition ${isActive('chats')}`}
            >
              <MessageSquare className="w-5 h-5" />
              <span>Messages</span>
            </button>
          </div>

          {/* User Menu and Mobile Toggle */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-2">
              <User className="w-5 h-5" />
              <span className="text-sm font-medium">{user.name || user.email}</span>
              <span className="text-xs bg-indigo-500 px-2 py-1 rounded-full">
                {user.role}
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 hover:text-indigo-200 transition"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-white hover:text-indigo-200 transition"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-indigo-500 space-y-1">
            {user.role === 'landlord' ? (
              <>
                <button
                  onClick={() => handleNavigate('dashboard')}
                  className={`w-full text-left px-4 py-2 rounded-lg transition flex items-center space-x-2 ${isActive('dashboard')}`}
                >
                  <LayoutDashboard className="w-5 h-5" />
                  <span>Dashboard</span>
                </button>
                <button
                  onClick={() => handleNavigate('create')}
                  className={`w-full text-left px-4 py-2 rounded-lg transition flex items-center space-x-2 ${isActive('create')}`}
                >
                  <Plus className="w-5 h-5" />
                  <span>Create Listing</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => handleNavigate('dashboard')}
                  className={`w-full text-left px-4 py-2 rounded-lg transition flex items-center space-x-2 ${isActive('dashboard')}`}
                >
                  <LayoutDashboard className="w-5 h-5" />
                  <span>Dashboard</span>
                </button>
                <button
                  onClick={() => handleNavigate('listings')}
                  className={`w-full text-left px-4 py-2 rounded-lg transition flex items-center space-x-2 ${isActive('listings')}`}
                >
                  <Search className="w-5 h-5" />
                  <span>Explore</span>
                </button>
              </>
            )}

            <button
              onClick={() => handleNavigate('chats')}
              className={`w-full text-left px-4 py-2 rounded-lg transition flex items-center space-x-2 ${isActive('chats')}`}
            >
              <MessageSquare className="w-5 h-5" />
              <span>Messages</span>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
