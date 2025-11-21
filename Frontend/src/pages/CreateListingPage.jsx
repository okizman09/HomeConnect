import React, { useState } from 'react';
import { Upload, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { listingsAPI } from '../services/api';
import { PROPERTY_TYPES, PROPERTY_LABELS } from '../constants';
import { useForm } from '../hooks';

const CreateListingPage = ({ onNavigate }) => {
  const { user } = useAuth();
  const [images, setImages] = useState([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const {
    values,
    errors,
    handleChange,
    loading,
    handleSubmit: formHandleSubmit,
  } = useForm(
    {
      title: '',
      description: '',
      location: '',
      price: '',
      propertyType: PROPERTY_TYPES.ONE_BEDROOM,
      occupancyLimit: '',
    },
    async (formValues) => {
      if (images.length === 0) {
        setUploadError('Please upload at least one image');
        return;
      }

      try {
        setUploadingImages(true);

        // Upload images to Cloudinary via backend
        const formData = new FormData();
        images.forEach((img) => {
          formData.append('images', img);
        });

        const uploadResponse = await fetch(
          `${import.meta.env.VITE_API_URL}/upload`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: formData,
          }
        );

        if (!uploadResponse.ok) {
          throw new Error('Image upload failed');
        }

        const uploadedData = await uploadResponse.json();
        const imageUrls = uploadedData.urls || [];

        // Create listing with uploaded image URLs
        await listingsAPI.create({
          ...formValues,
          price: parseInt(formValues.price),
          occupancyLimit: parseInt(formValues.occupancyLimit),
          images: imageUrls,
        });

        onNavigate('listings');
      } catch (err) {
        setUploadError(err.message || 'Failed to create listing');
      } finally {
        setUploadingImages(false);
      }
    }
  );

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter((file) => {
      const isImage = file.type.startsWith('image/');
      const isSmallEnough = file.size <= 10 * 1024 * 1024; // 10MB
      return isImage && isSmallEnough;
    });

    if (validFiles.length !== files.length) {
      setUploadError('Some files were invalid (must be images, max 10MB each)');
    }

    setImages(validFiles);

    // Generate preview URLs
    const previews = validFiles.map((file) => URL.createObjectURL(file));
    setImagePreviewUrls(previews);
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = imagePreviewUrls.filter((_, i) => i !== index);

    setImages(newImages);
    setImagePreviewUrls(newPreviews);
    URL.revokeObjectURL(imagePreviewUrls[index]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    formHandleSubmit(e);
  };

  if (user?.role !== 'landlord') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Access Restricted
          </h2>
          <p className="text-gray-600">
            Only landlords can create listings. Please switch to landlord role.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 md:py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">Create New Listing</h1>

        <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property Title
              </label>
              <input
                type="text"
                name="title"
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm md:text-base"
                placeholder="e.g., Modern 2-Bedroom Apartment in Ikeja"
                value={values.title}
                onChange={handleChange}
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                required
                rows={4}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm md:text-base"
                placeholder="Describe the property, amenities, and neighborhood..."
                value={values.description}
                onChange={handleChange}
              />
            </div>

            {/* Location & Price */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm md:text-base"
                  placeholder="e.g., Ikeja, Lagos"
                  value={values.location}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Annual Rent (₦)
                </label>
                <input
                  type="number"
                  name="price"
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm md:text-base"
                  placeholder="500000"
                  value={values.price}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Property Type & Occupancy */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Type
                </label>
                <select
                  name="propertyType"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm md:text-base"
                  value={values.propertyType}
                  onChange={handleChange}
                >
                  {Object.entries(PROPERTY_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Occupancy
                </label>
                <input
                  type="number"
                  name="occupancyLimit"
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm md:text-base"
                  placeholder="e.g., 4"
                  value={values.occupancyLimit}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property Images (at least 1)
              </label>

              {uploadError && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
                  {uploadError}
                </div>
              )}

              {/* Drop Zone */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 md:p-8 text-center hover:border-indigo-500 transition cursor-pointer bg-gray-50">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  id="image-input"
                  onChange={handleFileSelect}
                />
                <label htmlFor="image-input" className="cursor-pointer block">
                  <Upload className="w-10 h-10 md:w-12 md:h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm md:text-base text-gray-600 mb-1">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs md:text-sm text-gray-500">PNG, JPG up to 10MB each</p>
                </label>
              </div>

              {/* Image Previews */}
              {imagePreviewUrls.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    {images.length} image(s) selected
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
                    {imagePreviewUrls.map((url, index) => (
                      <div
                        key={index}
                        className="relative group"
                      >
                        <img
                          src={url}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-20 md:h-24 object-cover rounded border hover:border-indigo-500 transition"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-600 text-white p-1 md:p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition shadow-lg hover:bg-red-700"
                        >
                          <X className="w-3 h-3 md:w-4 md:h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || uploadingImages}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition text-sm md:text-base"
            >
              {loading || uploadingImages ? 'Creating Listing...' : 'Create Listing'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateListingPage;
