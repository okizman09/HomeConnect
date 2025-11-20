import React, { useState } from 'react';
import { Home, Search, MessageSquare, Plus, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ currentPage, onNavigate }) => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  if (!user) return null;

  const handleLogout = async () => {
    await logout();
    onNavigate('landing');
  };

  const isActive = (page) => currentPage === page ? 'text-white' : 'text-indigo-100 hover:text-white';

  return (
    <nav className="bg-indigo-600 text-white shadow-lg sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => onNavigate('listings')}
            className="flex items-center space-x-2 hover:opacity-80 transition"
          >
            <Home className="w-8 h-8" />
            <span className="text-2xl font-bold hidden sm:inline">HomeConnect</span>
          </button>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <button
              onClick={() => onNavigate('listings')}
              className={`flex items-center space-x-2 transition ${isActive('listings')}`}
            >
              <Search className="w-5 h-5" />
              <span>Explore</span>
            </button>

            {user.role === 'landlord' && (
              <button
                onClick={() => onNavigate('create')}
                className={`flex items-center space-x-2 transition ${isActive('create')}`}
              >
                <Plus className="w-5 h-5" />
                <span>Create Listing</span>
              </button>
            )}

            <button
              onClick={() => onNavigate('chats')}
              className={`flex items-center space-x-2 transition ${isActive('chats')}`}
            >
              <MessageSquare className="w-5 h-5" />
              <span>Messages</span>
            </button>
          </div>

          {/* User Menu */}
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
          </div>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden flex items-center justify-between mt-4 pt-4 border-t border-indigo-500">
          <button
            onClick={() => onNavigate('listings')}
            className={`flex-1 text-center text-sm transition ${isActive('listings')}`}
          >
            Explore
          </button>
          {user.role === 'landlord' && (
            <button
              onClick={() => onNavigate('create')}
              className={`flex-1 text-center text-sm transition ${isActive('create')}`}
            >
              Create
            </button>
          )}
          <button
            onClick={() => onNavigate('chats')}
            className={`flex-1 text-center text-sm transition ${isActive('chats')}`}
          >
            Messages
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
