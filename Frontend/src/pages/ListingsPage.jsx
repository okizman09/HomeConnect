
import React, { useState, useEffect } from 'react';
import { MapPin, DollarSign, Users, Filter, Search, X, Heart } from 'lucide-react';
import { listingsAPI, usersAPI } from '../services/api';
import { PROPERTY_TYPES, PROPERTY_LABELS } from '../constants';
import { formatPrice } from '../utils';
import { useFetch } from '../hooks';
import { useAuth } from '../context/AuthContext';

const ListingsPage = ({ onSelectListing }) => {
  const { user } = useAuth();
  const [filters, setFilters] = useState({
    location: '',
    propertyType: '',
    minPrice: '',
    maxPrice: '',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [savedListingIds, setSavedListingIds] = useState([]);

  const { data: listingsResponse, loading, error, execute: fetchListings } = useFetch(
    () => listingsAPI.getAll(),
    [true]
  );

  const listings = listingsResponse?.listings || [];

  useEffect(() => {
    const fetchSavedListings = async () => {
      if (user) {
        try {
          const response = await usersAPI.getSavedListings();
          if (response.success) {
            setSavedListingIds(response.savedListings.map(l => l._id));
          }
        } catch (err) {
          console.error("Failed to fetch saved listings", err);
        }
      }
    };
    fetchSavedListings();
  }, [user]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = async () => {
    await fetchListings(filters);
  };

  const clearFilters = () => {
    setFilters({
      location: '',
      propertyType: '',
      minPrice: '',
      maxPrice: '',
    });
    setSearchTerm('');
  };

  const filteredListings = listings.filter((listing) => {
    const matchesSearch =
      listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesLocation =
      !filters.location ||
      listing.location.toLowerCase().includes(filters.location.toLowerCase());

    const matchesType =
      !filters.propertyType || listing.propertyType === filters.propertyType;

    const matchesPrice =
      (!filters.minPrice || listing.price >= parseInt(filters.minPrice)) &&
      (!filters.maxPrice || listing.price <= parseInt(filters.maxPrice));

    return matchesSearch && matchesLocation && matchesType && matchesPrice;
  });

  const isFiltered = Object.values(filters).some(f => f) || searchTerm;

  return (
    <div className="min-h-screen bg-gray-50 py-4 md:py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Available Properties</h1>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-center space-x-2 bg-white px-4 py-2 rounded-lg shadow hover:bg-gray-50 transition w-full md:w-auto"
          >
            <Filter className="w-5 h-5" />
            <span>{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-6 flex flex-col md:flex-row gap-2">
          <input
            type="text"
            placeholder="Search by name or description..."
            className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm md:text-base"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="bg-indigo-600 text-white px-4 md:px-6 py-2 rounded-lg hover:bg-indigo-700 transition flex items-center justify-center space-x-2 font-medium">
            <Search className="w-5 h-5" />
            <span className="hidden md:inline">Search</span>
          </button>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="bg-white p-4 md:p-6 rounded-lg shadow-md mb-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 md:gap-4 mb-4">
              <input
                type="text"
                name="location"
                placeholder="Location"
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                value={filters.location}
                onChange={handleFilterChange}
              />
              <select
                name="propertyType"
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                value={filters.propertyType}
                onChange={handleFilterChange}
              >
                <option value="">All Types</option>
                {Object.entries(PROPERTY_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
              <input
                type="number"
                name="minPrice"
                placeholder="Min Price"
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                value={filters.minPrice}
                onChange={handleFilterChange}
              />
              <input
                type="number"
                name="maxPrice"
                placeholder="Max Price"
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                value={filters.maxPrice}
                onChange={handleFilterChange}
              />
              <button
                onClick={handleSearch}
                className="bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-semibold text-sm"
              >
                Apply
              </button>
            </div>

            {isFiltered && (
              <button
                onClick={clearFilters}
                className="flex items-center space-x-1 text-indigo-600 hover:text-indigo-700 text-sm font-medium"
              >
                <X className="w-4 h-4" />
                <span>Clear Filters</span>
              </button>
            )}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading properties...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 text-sm md:text-base">
            {error}
          </div>
        )}

        {/* Listings Grid */}
        {!loading && filteredListings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {filteredListings.map((listing) => (
              <div
                key={listing._id}
                onClick={() => onSelectListing(listing)}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition cursor-pointer flex flex-col"
              >
                {/* Image Container */}
                <div className="relative w-full h-40 md:h-48 overflow-hidden bg-gray-200">
                  <img
                    src={listing.images?.[0] || 'https://via.placeholder.com/400x200'}
                    alt={listing.title}
                    className="w-full h-full object-cover hover:scale-105 transition duration-300"
                  />
                  {listing.images && listing.images.length > 1 && (
                    <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                      {listing.images.length} photos
                    </div>
                  )}
                  {user && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle toggle save
                        const isSaved = savedListingIds.includes(listing._id);
                        usersAPI.toggleSavedListing(listing._id)
                          .then(response => {
                            if (response.success) {
                              setSavedListingIds(prev =>
                                isSaved
                                  ? prev.filter(id => id !== listing._id)
                                  : [...prev, listing._id]
                              );
                            }
                          })
                          .catch(console.error);
                      }}
                      className={`absolute top-2 left-2 z-20 p-2 rounded-full shadow-md transition ${savedListingIds.includes(listing._id) ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-white text-gray-400 hover:text-red-500 hover:bg-gray-50'}`}
                      title={savedListingIds.includes(listing._id) ? "Unsave Property" : "Save Property"}
                    >
                      <Heart className={`w-4 h-4 ${savedListingIds.includes(listing._id) ? 'fill-current' : ''}`} />
                    </button>
                  )}
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
                      <span>Max {listing.occupancyLimit} {listing.occupancyLimit === 1 ? 'person' : 'people'}</span>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex justify-between items-center pt-3 border-t">
                    <span className="text-xs bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full font-medium">
                      {PROPERTY_LABELS[listing.propertyType]}
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
          !loading && (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg mb-4">No properties found</p>
              {isFiltered && (
                <button
                  onClick={clearFilters}
                  className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
                >
                  Clear Filters
                </button>
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default ListingsPage;
