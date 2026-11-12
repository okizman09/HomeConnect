import React, { useState } from 'react';
import { Search, MessageSquare, Plus, LogOut, User, LayoutDashboard, Menu, X, Settings, Wrench } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';

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

  const isActive = (page) => currentPage === page
    ? 'bg-primary text-white shadow-md'
    : 'text-gray-600 hover:bg-primary/10 hover:text-primary';

  return (
    <nav className="glass sticky top-0 z-40 text-gray-800 border-b border-white/20">
      <div className="container mx-auto px-4">
        {/* Main Navigation */}
        <div className="flex items-center justify-between py-3">
          {/* Logo */}
          <button
            onClick={() => handleNavigate(user.role === 'landlord' ? 'dashboard' : 'listings')}
            className="flex items-center space-x-2 hover:opacity-80 transition flex-shrink-0"
          >
            <img src={logo} alt="HomeConnect Logo" className="h-12 w-auto object-contain" />
          </button>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-2">
            {user.role === 'landlord' ? (
              <>
                <button
                  onClick={() => handleNavigate('dashboard')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full transition font-medium ${isActive('dashboard')}`}
                >
                  <LayoutDashboard className="w-5 h-5" />
                  <span>Dashboard</span>
                </button>
                <button
                  onClick={() => handleNavigate('create')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full transition font-medium ${isActive('create')}`}
                >
                  <Plus className="w-5 h-5" />
                  <span>Create Listing</span>
                </button>
                <button
                  onClick={() => handleNavigate('listings')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full transition font-medium ${isActive('listings')}`}
                >
                  <Search className="w-5 h-5" />
                  <span>Explore</span>
                </button>
                <button
                  onClick={() => handleNavigate('maintenance')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full transition font-medium ${isActive('maintenance')}`}
                >
                  <Wrench className="w-5 h-5" />
                  <span>Maintenance</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => handleNavigate('dashboard')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full transition font-medium ${isActive('dashboard')}`}
                >
                  <LayoutDashboard className="w-5 h-5" />
                  <span>Dashboard</span>
                </button>
                <button
                  onClick={() => handleNavigate('listings')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full transition font-medium ${isActive('listings')}`}
                >
                  <Search className="w-5 h-5" />
                  <span>Explore</span>
                </button>
                <button
                  onClick={() => handleNavigate('maintenance')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full transition font-medium ${isActive('maintenance')}`}
                >
                  <Wrench className="w-5 h-5" />
                  <span>Maintenance</span>
                </button>
              </>
            )}

            <button
              onClick={() => handleNavigate('chats')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full transition font-medium ${isActive('chats')}`}
            >
              <MessageSquare className="w-5 h-5" />
              <span>Messages</span>
            </button>
          </div>

          {/* User Menu and Mobile Toggle */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-2">
              {user.profilePic ? (
                <img src={user.profilePic} alt="Profile" className="w-8 h-8 rounded-full object-cover border border-indigo-200" />
              ) : (
                <User className="w-5 h-5" />
              )}
              <span className="text-sm font-medium pr-1">{user.name || user.email}</span>
              <span className="text-xs bg-indigo-500 text-white px-2 py-1 rounded-full">
                {user.role}
              </span>
            </div>

            <div className="hidden sm:flex items-center border-l border-indigo-500 pl-4 space-x-2">
              <button
                onClick={() => handleNavigate('profile-settings')}
                className="flex items-center space-x-1 hover:text-indigo-600 transition"
                title="Settings"
              >
                <Settings className="w-5 h-5" />
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 hover:text-indigo-600 transition"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-gray-800 hover:text-indigo-600 transition"
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
                <button
                  onClick={() => handleNavigate('listings')}
                  className={`w-full text-left px-4 py-2 rounded-lg transition flex items-center space-x-2 ${isActive('listings')}`}
                >
                  <Search className="w-5 h-5" />
                  <span>Explore</span>
                </button>
                <button
                  onClick={() => handleNavigate('maintenance')}
                  className={`w-full text-left px-4 py-2 rounded-lg transition flex items-center space-x-2 ${isActive('maintenance')}`}
                >
                  <Wrench className="w-5 h-5" />
                  <span>Maintenance</span>
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
                <button
                  onClick={() => handleNavigate('maintenance')}
                  className={`w-full text-left px-4 py-2 rounded-lg transition flex items-center space-x-2 ${isActive('maintenance')}`}
                >
                  <Wrench className="w-5 h-5" />
                  <span>Maintenance</span>
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

            <div className="border-t border-indigo-500 my-2 pt-2">
              <button
                onClick={() => handleNavigate('profile-settings')}
                className={`w-full text-left px-4 py-2 rounded-lg transition flex items-center space-x-2 ${isActive('profile-settings')}`}
              >
                <Settings className="w-5 h-5" />
                <span>Settings</span>
              </button>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 rounded-lg transition flex items-center space-x-2 text-gray-600 hover:bg-primary/10 hover:text-primary"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
