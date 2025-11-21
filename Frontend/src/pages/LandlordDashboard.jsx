import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, Plus, MapPin, DollarSign, Users, X, Save, Image as ImageIcon, Upload, Trash } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { listingsAPI } from '../services/api';
import { formatPrice, formatDate } from '../utils';
import { PROPERTY_LABELS, PROPERTY_TYPES } from '../constants';

const LandlordDashboard = ({ onNavigate }) => {
  const { user } = useAuth();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingListing, setEditingListing] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [editingImages, setEditingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);

  // Fetch landlord's listings
  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await listingsAPI.getAll();
        // Filter listings for current landlord
        const landlordListings = data.listings?.filter(
          (listing) => listing.landlordId._id === user.id || listing.landlordId === user.id
        ) || [];
        setListings(landlordListings);
      } catch (err) {
        setError('Failed to load listings');
        console.error('Error fetching listings:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchListings();
    }
  }, [user?.id]);

  const handleEdit = (listing) => {
    setEditingListing(listing);
    setEditFormData({
      title: listing.title,
      description: listing.description,
      location: listing.location,
      price: listing.price,
      propertyType: listing.propertyType,
      occupancyLimit: listing.occupancyLimit,
    });
    setEditingImages(listing.images || []);
    setNewImages([]);
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    try {
      setLoading(true);
      setError('');
      
      // First update the listing data
      await listingsAPI.update(editingListing._id, editFormData);
      
      // Then upload new images if any
      if (newImages.length > 0) {
        const formData = new FormData();
        newImages.forEach(({ file }) => {
          formData.append('images', file);
        });
        await listingsAPI.uploadImages(editingListing._id, formData);
      }
      
      // Update local state with new images
      const updatedListing = {
        ...editingListing,
        ...editFormData,
        images: [...editingImages, ...newImages.map(img => img.preview)]
      };
      
      setListings(
        listings.map((listing) =>
          listing._id === editingListing._id
            ? updatedListing
            : listing
        )
      );
      
      setShowEditModal(false);
      setEditingListing(null);
      setEditingImages([]);
      setNewImages([]);
    } catch (err) {
      setError('Failed to update listing');
      console.error('Error updating listing:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (listingId) => {
    try {
      setLoading(true);
      setError('');
      
      await listingsAPI.delete(listingId);
      
      // Update local state
      setListings(listings.filter((listing) => listing._id !== listingId));
      setDeleteConfirm(null);
    } catch (err) {
      setError('Failed to delete listing');
      console.error('Error deleting listing:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImages(prev => [...prev, { file, preview: reader.result }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeNewImage = (index) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index) => {
    setEditingImages(prev => prev.filter((_, i) => i !== index));
  };

  if (user?.role !== 'landlord') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Restricted</h2>
          <p className="text-gray-600">Only landlords can access this dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 md:py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-2">Welcome back, {user?.name || 'Landlord'}!</p>
          </div>
          <button
            onClick={() => onNavigate('create')}
            className="bg-indigo-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg font-semibold hover:bg-indigo-700 transition flex items-center justify-center space-x-2 w-full md:w-auto"
          >
            <Plus className="w-5 h-5" />
            <span>Create Listing</span>
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-4 md:p-6 rounded-lg shadow">
            <div className="text-sm text-gray-600 mb-1">Total Listings</div>
            <div className="text-3xl md:text-4xl font-bold text-indigo-600">{listings.length}</div>
          </div>
          <div className="bg-white p-4 md:p-6 rounded-lg shadow">
            <div className="text-sm text-gray-600 mb-1">Active Properties</div>
            <div className="text-3xl md:text-4xl font-bold text-green-600">{listings.length}</div>
          </div>
          <div className="bg-white p-4 md:p-6 rounded-lg shadow">
            <div className="text-sm text-gray-600 mb-1">Total Value</div>
            <div className="text-3xl md:text-4xl font-bold text-blue-600">
              {formatPrice(listings.reduce((sum, listing) => sum + listing.price, 0))}
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading your listings...</p>
          </div>
        )}

        {/* Listings List */}
        {!loading && listings.length > 0 ? (
          <div className="space-y-4">
            {listings.map((listing) => (
              <div key={listing._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                <div className="flex flex-col md:flex-row md:items-center gap-4 p-4 md:p-6">
                  {/* Image */}
                  <div className="w-full md:w-24 h-24 md:h-24 flex-shrink-0">
                    <img
                      src={listing.images?.[0] || 'https://via.placeholder.com/100'}
                      alt={listing.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg md:text-xl font-bold mb-2">{listing.title}</h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-1">{listing.description}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                      <div className="flex items-center text-gray-600">
                        <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                        <span className="truncate">{listing.location}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <DollarSign className="w-4 h-4 mr-1 flex-shrink-0" />
                        <span>{formatPrice(listing.price)}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Users className="w-4 h-4 mr-1 flex-shrink-0" />
                        <span>{listing.occupancyLimit} people</span>
                      </div>
                      <div className="text-gray-600">
                        <span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full">
                          {PROPERTY_LABELS[listing.propertyType]}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-gray-500 mt-2">
                      Posted on {formatDate(listing.dateCreated)}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleEdit(listing)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition flex items-center space-x-1 text-sm"
                    >
                      <Edit2 className="w-4 h-4" />
                      <span className="hidden sm:inline">Edit</span>
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(listing._id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg transition flex items-center space-x-1 text-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="hidden sm:inline">Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          !loading && (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <p className="text-gray-600 mb-4">You haven't created any listings yet.</p>
              <button
                onClick={() => onNavigate('create')}
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition inline-flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Create Your First Listing</span>
              </button>
            </div>
          )
        )}

        {/* Edit Modal */}
        {showEditModal && editingListing && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="sticky top-0 p-4 md:p-6 border-b bg-white flex justify-between items-center">
                <h2 className="text-xl md:text-2xl font-bold">Edit Listing</h2>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Form */}
              <div className="p-4 md:p-6 space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={editFormData.title}
                    onChange={handleEditChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={editFormData.description}
                    onChange={handleEditChange}
                    rows={4}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                {/* Location & Price */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={editFormData.location}
                      onChange={handleEditChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Annual Rent (₦)
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={editFormData.price}
                      onChange={handleEditChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Property Type & Occupancy */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Property Type
                    </label>
                    <select
                      name="propertyType"
                      value={editFormData.propertyType}
                      onChange={handleEditChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      {Object.entries(PROPERTY_LABELS).map(([key, label]) => (
                        <option key={key} value={key}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Max Occupancy
                    </label>
                    <input
                      type="number"
                      name="occupancyLimit"
                      value={editFormData.occupancyLimit}
                      onChange={handleEditChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Images Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Listing Images
                  </label>

                  {/* Existing Images */}
                  {editingImages.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs text-gray-600 mb-2">Current Images</p>
                      <div className="grid grid-cols-3 gap-3">
                        {editingImages.map((image, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={image}
                              alt={`listing ${index}`}
                              className="w-full h-24 object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => removeExistingImage(index)}
                              className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition rounded-lg"
                            >
                              <Trash className="w-5 h-5 text-white" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* New Images Preview */}
                  {newImages.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs text-gray-600 mb-2">New Images to Upload</p>
                      <div className="grid grid-cols-3 gap-3">
                        {newImages.map((image, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={image.preview}
                              alt={`new ${index}`}
                              className="w-full h-24 object-cover rounded-lg border-2 border-indigo-300"
                            />
                            <button
                              type="button"
                              onClick={() => removeNewImage(index)}
                              className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition rounded-lg"
                            >
                              <Trash className="w-5 h-5 text-white" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Upload Area */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-500 transition">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center">
                      <Upload className="w-8 h-8 text-gray-400 mb-2" />
                      <span className="text-sm font-medium text-gray-700">Click to upload or drag images</span>
                      <span className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="sticky bottom-0 p-4 md:p-6 border-t bg-gray-50 flex gap-3 justify-end">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-6 py-2 border rounded-lg font-medium hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  disabled={loading}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:bg-gray-400 transition flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-sm">
              <h3 className="text-lg md:text-xl font-bold mb-2">Delete Listing?</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this listing? This action cannot be undone.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="px-6 py-2 border rounded-lg font-medium hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  disabled={loading}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:bg-gray-400 transition"
                >
                  {loading ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LandlordDashboard;
