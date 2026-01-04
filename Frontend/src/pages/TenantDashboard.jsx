import React, { useState, useEffect } from 'react';
import { MessageSquare, Heart, MapPin, DollarSign, LogOut, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { usersAPI } from '../services/api';
import { formatPrice } from '../utils';
import { PROPERTY_LABELS } from '../constants';

const TenantDashboard = ({ onNavigate }) => {
  const { user, logout, role } = useAuth();
  const [savedListings, setSavedListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedListings = async () => {
      try {
        const response = await usersAPI.getSavedListings();
        if (response.success) {
          setSavedListings(response.savedListings);
        }
      } catch (err) {
        console.error("Failed to fetch saved listings", err);
      } finally {
        setLoading(false);
      }
    };

    if (user && role === 'tenant') {
      fetchSavedListings();
    }
  }, [user, role]);

  const handleUnsave = async (e, listingId) => {
    e.stopPropagation();
    try {
      const response = await usersAPI.toggleSavedListing(listingId);
      if (response.success) {
        // remove from local state
        setSavedListings(prev => prev.filter(l => l._id !== listingId));
      }
    } catch (err) {
      console.error("Failed to unsave", err);
    }
  };


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
            <div className="text-3xl md:text-4xl font-bold text-indigo-600">{savedListings.length}</div>
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

        {/* Saved Listings */}
        <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">Saved Properties</h2>
        {savedListings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {savedListings.map((listing) => (
              <div
                key={listing._id}
                onClick={() => {/* Navigate to listing detail */ }}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition cursor-pointer flex flex-col relative"
              >
                {/* Unsave Button */}
                <button
                  onClick={(e) => handleUnsave(e, listing._id)}
                  className="absolute top-2 right-2 z-10 p-2 rounded-full shadow-md bg-red-500 text-white hover:bg-red-600 transition"
                  title="Unsave Property"
                >
                  <Heart className="w-5 h-5 fill-current" />
                </button>

                {/* Image Container */}
                <div className="relative w-full h-40 md:h-48 overflow-hidden bg-gray-200">
                  <img
                    src={listing.images?.[0] || 'https://via.placeholder.com/400x200'}
                    alt={listing.title}
                    className="w-full h-full object-cover hover:scale-105 transition duration-300"
                  />
                </div>

                {/* Content */}
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="text-lg md:text-xl font-bold mb-2 line-clamp-2">{listing.title}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2 flex-1">
                    {listing.description}
                  </p>

                  {/* Details */}
                  <div className="space-y-2 mb-4 text-sm">
                    <div className="flex items-center text-gray-700">
                      <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="truncate">{listing.location}</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <DollarSign className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="font-bold text-indigo-600">
                        {formatPrice(listing.price)}<span className="text-gray-600 font-normal">/year</span>
                      </span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <Users className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span>Max {listing.occupancyLimit}</span>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex justify-between items-center pt-3 border-t">
                    <span className="text-xs bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full font-medium">
                      {PROPERTY_LABELS[listing.propertyType] || listing.propertyType}
                    </span>
                    <button className="text-indigo-600 font-semibold hover:text-indigo-700 text-sm">
                      View →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center mt-2">
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
        )}
      </div>
    </div>
  );
};

export default TenantDashboard;
