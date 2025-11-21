import React, { useState, useEffect } from 'react';
import { MessageSquare, Heart, MapPin, DollarSign, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const TenantDashboard = ({ onNavigate }) => {
  const { user, logout, role } = useAuth();
  const [favoriteListings, setFavoriteListings] = useState([]);

  if (role !== 'tenant') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Restricted</h2>
          <p className="text-gray-600">Only tenants can access this dashboard.</p>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    await logout();
    onNavigate('landing');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 md:py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Tenant Dashboard</h1>
            <p className="text-gray-600 mt-2">Welcome, {user?.name || 'Tenant'}!</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg font-semibold hover:bg-red-700 transition flex items-center justify-center space-x-2 w-full md:w-auto"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6">Your Profile</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Avatar */}
            <div className="flex flex-col items-center justify-center">
              <div className="w-24 h-24 bg-indigo-600 text-white rounded-full flex items-center justify-center text-4xl font-bold mb-4">
                {(user?.name || 'T')[0].toUpperCase()}
              </div>
              <h3 className="text-xl font-bold text-center">{user?.name || 'Tenant'}</h3>
              <p className="text-gray-600 text-center mt-1">Tenant Account</p>
            </div>

            {/* Details */}
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-600 font-medium">Email</label>
                <p className="text-lg text-gray-900">{user?.email || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600 font-medium">Phone</label>
                <p className="text-lg text-gray-900">{user?.phone || 'Not provided'}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600 font-medium">Location</label>
                <p className="text-lg text-gray-900">{user?.location || 'Not provided'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Explore Listings */}
          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition"
            onClick={() => onNavigate('listings')}
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-indigo-600 text-white rounded-lg flex items-center justify-center">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">Explore Listings</h3>
            </div>
            <p className="text-gray-600 mb-4">Browse available properties and find your perfect home</p>
            <button className="text-indigo-600 font-semibold hover:text-indigo-700">
              View Properties →
            </button>
          </div>

          {/* Messages */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition"
            onClick={() => onNavigate('chats')}
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-green-600 text-white rounded-lg flex items-center justify-center">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">Messages</h3>
            </div>
            <p className="text-gray-600 mb-4">Chat with landlords about properties you're interested in</p>
            <button className="text-green-600 font-semibold hover:text-green-700">
              View Messages →
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <div className="bg-white p-4 md:p-6 rounded-lg shadow">
            <div className="text-sm text-gray-600 mb-1">Properties Saved</div>
            <div className="text-3xl md:text-4xl font-bold text-indigo-600">0</div>
          </div>
          <div className="bg-white p-4 md:p-6 rounded-lg shadow">
            <div className="text-sm text-gray-600 mb-1">Active Conversations</div>
            <div className="text-3xl md:text-4xl font-bold text-green-600">0</div>
          </div>
          <div className="bg-white p-4 md:p-6 rounded-lg shadow">
            <div className="text-sm text-gray-600 mb-1">Member Since</div>
            <div className="text-lg md:text-xl font-bold text-blue-600">Today</div>
          </div>
        </div>

        {/* Empty Favorites */}
        <div className="bg-white rounded-lg shadow-md p-8 text-center mt-8">
          <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Saved Properties Yet</h3>
          <p className="text-gray-600 mb-6">Start exploring listings and save your favorite properties</p>
          <button
            onClick={() => onNavigate('listings')}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition inline-flex items-center space-x-2"
          >
            <MapPin className="w-5 h-5" />
            <span>Explore Properties</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TenantDashboard;
