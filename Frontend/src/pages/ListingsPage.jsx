import React, { useState, useEffect } from 'react';
import { MapPin, DollarSign, Users, Filter, Search } from 'lucide-react';
import { listingsAPI } from '../services/api';
import { PROPERTY_TYPES, PROPERTY_LABELS } from '../constants';
import { formatPrice } from '../utils';
import { useFetch } from '../hooks';

const ListingsPage = ({ onSelectListing }) => {
  const [filters, setFilters] = useState({
    location: '',
    propertyType: '',
    minPrice: '',
    maxPrice: '',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const { data: listingsResponse, loading, error, execute: fetchListings } = useFetch(
    () => listingsAPI.getAll(),
    [true] // Non-empty dependency array to trigger initial fetch
  );

  const listings = listingsResponse?.listings || [];

  useEffect(() => {
    console.log('Listings Response:', listingsResponse);
    console.log('Listings:', listings);
  }, [listingsResponse, listings]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = async () => {
    await fetchListings(filters);
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Available Properties</h1>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow hover:bg-gray-50 transition"
          >
            <Filter className="w-5 h-5" />
            <span>Filters</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-6 flex gap-2">
          <input
            type="text"
            placeholder="Search listings by name or description..."
            className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition flex items-center space-x-2">
            <Search className="w-5 h-5" />
            <span>Search</span>
          </button>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <div className="grid md:grid-cols-5 gap-4">
              <input
                type="text"
                name="location"
                placeholder="Location"
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                value={filters.location}
                onChange={handleFilterChange}
              />
              <select
                name="propertyType"
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                value={filters.propertyType}
                onChange={handleFilterChange}
              >
                <option value="">Property Type</option>
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
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                value={filters.minPrice}
                onChange={handleFilterChange}
              />
              <input
                type="number"
                name="maxPrice"
                placeholder="Max Price"
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                value={filters.maxPrice}
                onChange={handleFilterChange}
              />
              <button
                onClick={handleSearch}
                className="bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-semibold"
              >
                Apply
              </button>
            </div>
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
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Listings Grid */}
        {!loading && filteredListings.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-6">
            {filteredListings.map((listing) => (
              <div
                key={listing._id}
                onClick={() => onSelectListing(listing)}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition cursor-pointer"
              >
                {/* Image */}
                <img
                  src={listing.images?.[0] || 'https://via.placeholder.com/400x200'}
                  alt={listing.title}
                  className="w-full h-48 object-cover"
                />

                {/* Content */}
                <div className="p-4">
                  <h3 className="text-xl font-bold mb-2">{listing.title}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {listing.description}
                  </p>

                  {/* Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-gray-700">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span className="text-sm">{listing.location}</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <DollarSign className="w-4 h-4 mr-2" />
                      <span className="text-lg font-bold">
                        {formatPrice(listing.price)}/year
                      </span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <Users className="w-4 h-4 mr-2" />
                      <span className="text-sm">
                        Max {listing.occupancyLimit} occupants
                      </span>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex justify-between items-center pt-3 border-t">
                    <span className="text-sm bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full">
                      {PROPERTY_LABELS[listing.propertyType]}
                    </span>
                    <button className="text-indigo-600 font-semibold hover:text-indigo-700">
                      View Details →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          !loading && (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No properties found</p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default ListingsPage;
