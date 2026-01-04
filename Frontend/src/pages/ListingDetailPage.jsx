import React, { useState, useEffect, useRef } from 'react';
import { MapPin, DollarSign, Users, MessageSquare, X, Send, ChevronLeft, ChevronRight, Maximize2, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { messagesAPI, usersAPI } from '../services/api';
import { formatPrice, formatDate, formatTime } from '../utils';
import { PROPERTY_LABELS } from '../constants';

const ListingDetailPage = ({ listing, onBack }) => {
  const { user } = useAuth();
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showFullscreen, setShowFullscreen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const messagesEndRef = useRef(null);

  // Check if listing is saved
  useEffect(() => {
    const checkSavedStatus = async () => {
      if (user) {
        try {
          const response = await usersAPI.getSavedListings();
          if (response.success) {
            const savedIds = response.savedListings.map(l => l._id);
            setIsSaved(savedIds.includes(listing._id));
          }
        } catch (err) {
          console.error("Failed to check saved status", err);
        }
      }
    };
    checkSavedStatus();
  }, [user, listing._id]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle keyboard navigation for image gallery
  useEffect(() => {
    if (!showFullscreen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') goToPreviousImage();
      if (e.key === 'ArrowRight') goToNextImage();
      if (e.key === 'Escape') setShowFullscreen(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showFullscreen, currentImageIndex]);

  const images = listing.images || [];

  const goToNextImage = () => {
    if (images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }
  };

  const goToPreviousImage = () => {
    if (images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  const handleToggleSave = async () => {
    if (!user) return;
    try {
      const response = await usersAPI.toggleSavedListing(listing._id);
      if (response.success) {
        setIsSaved(!isSaved);
      }
    } catch (err) {
      console.error("Failed to toggle save", err);
    }
  };

  const handleStartChat = async () => {
    try {
      setLoading(true);
      setError('');

      // Get landlord ID
      const landlordId = listing.landlordId._id || listing.landlordId;

      // Fetch messages with landlord
      const fetchedMessages = await messagesAPI.getMessages(landlordId);
      setMessages(fetchedMessages?.messages || []);
      setShowChat(true);
    } catch (err) {
      setError('Failed to start chat');
      console.error('Failed to start chat:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    try {
      const landlordId = listing.landlordId._id || listing.landlordId;
      await messagesAPI.sendMessage(landlordId, message);

      setMessages([
        ...messages,
        {
          _id: Date.now().toString(),
          senderId: user.id,
          message: message.trim(),
          timestamp: new Date().toISOString(),
        },
      ]);

      setMessage('');
    } catch (err) {
      setError('Failed to send message');
      console.error('Failed to send message:', err);
    }
  };

  const currentImage = images[currentImageIndex] || 'https://via.placeholder.com/1200x400';

  return (
    <div className="min-h-screen bg-gray-50 py-4 md:py-8">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="mb-6 flex items-center text-indigo-600 hover:text-indigo-700 font-medium transition"
        >
          ← Back to Listings
        </button>


        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Image Gallery */}
          <div className="relative bg-black">
            <img
              src={currentImage}
              alt={`${listing.title} ${currentImageIndex + 1}`}
              className="w-full h-64 md:h-96 object-cover"
            />

            {/* Save Button Overlay */}
            {user && (
              <button
                onClick={handleToggleSave}
                className={`absolute top-4 right-4 z-20 p-3 rounded-full shadow-lg transition ${isSaved ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-white text-gray-400 hover:text-red-500 hover:bg-gray-50'}`}
                title={isSaved ? "Unsave Property" : "Save Property"}
              >
                <Heart className={`w-6 h-6 ${isSaved ? 'fill-current' : ''}`} />
              </button>
            )}

            {/* Image Navigation Controls */}
            {images.length > 1 && (
              <>
                {/* Previous Button */}
                <button
                  onClick={goToPreviousImage}
                  className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 md:p-3 rounded-full transition z-10"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
                </button>

                {/* Next Button */}
                <button
                  onClick={goToNextImage}
                  className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 md:p-3 rounded-full transition z-10"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
                </button>

                {/* Image Counter and Fullscreen Button */}
                <div className="absolute bottom-2 right-2 md:bottom-4 md:right-4 flex items-center space-x-2 z-10">
                  <button
                    onClick={() => setShowFullscreen(true)}
                    className="bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full transition"
                    aria-label="Fullscreen"
                  >
                    <Maximize2 className="w-5 h-5" />
                  </button>
                  <div className="bg-black bg-opacity-50 text-white px-3 py-1 rounded text-sm">
                    {currentImageIndex + 1} / {images.length}
                  </div>
                </div>

                {/* Image Thumbnail Indicators */}
                <div className="absolute bottom-16 md:bottom-20 left-0 right-0 flex justify-center gap-1 md:gap-2 px-4 overflow-x-auto pb-2">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`h-2 md:h-3 rounded-full transition flex-shrink-0 ${index === currentImageIndex
                        ? 'bg-white w-6 md:w-8'
                        : 'bg-white bg-opacity-50 w-2 md:w-3 hover:bg-opacity-75'
                        }`}
                      aria-label={`Go to image ${index + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Details Section */}
          <div className="p-4 md:p-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-6 gap-4">
              <div className="flex-1">
                <h1 className="text-2xl md:text-4xl font-bold mb-2">{listing.title}</h1>
                <div className="flex items-center text-gray-600 mb-2">
                  <MapPin className="w-5 h-5 mr-2" />
                  <span className="text-base md:text-lg">{listing.location}</span>
                </div>
              </div>
              <div className="text-left md:text-right">
                <div className="text-2xl md:text-4xl font-bold text-indigo-600">
                  {formatPrice(listing.price)}
                </div>
                <div className="text-gray-600 text-sm md:text-base">per year</div>
              </div>
            </div>

            {/* Key Details */}
            <div className="grid md:grid-cols-3 gap-4 mb-8 pb-8 border-b">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-xs md:text-sm text-gray-600 mb-1">Property Type</div>
                <div className="text-base md:text-lg font-semibold">
                  {PROPERTY_LABELS[listing.propertyType]}
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-xs md:text-sm text-gray-600 mb-1">Max Occupancy</div>
                <div className="text-base md:text-lg font-semibold">
                  {listing.occupancyLimit} people
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-xs md:text-sm text-gray-600 mb-1">Posted</div>
                <div className="text-base md:text-lg font-semibold">
                  {listing.dateCreated && formatDate(listing.dateCreated)}
                </div>
              </div>
            </div>

            {/* Landlord Info */}
            {listing.landlordId && (
              <div className="mb-8 pb-8 border-b">
                <h2 className="text-xl md:text-2xl font-bold mb-4">Landlord Information</h2>
                <div className="bg-indigo-50 p-4 md:p-6 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-indigo-600 text-white rounded-full flex items-center justify-center text-lg md:text-2xl font-bold flex-shrink-0">
                      {(listing.landlordId?.name || 'L')[0].toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-lg md:text-xl font-semibold">
                        {listing.landlordId?.name || 'Landlord'}
                      </h3>
                      {listing.landlordId?.email && (
                        <p className="text-sm md:text-base text-gray-600 truncate">{listing.landlordId.email}</p>
                      )}
                      {listing.landlordId?.phone && (
                        <p className="text-sm md:text-base text-gray-600">{listing.landlordId.phone}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-xl md:text-2xl font-bold mb-3">Description</h2>
              <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                {listing.description}
              </p>
            </div>

            {/* Contact CTA */}
            {user && (user.role?.toLowerCase() === 'tenant') && (
              <button
                onClick={handleStartChat}
                disabled={loading}
                className="w-full bg-indigo-600 text-white py-3 md:py-4 rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-gray-400 transition flex items-center justify-center space-x-2"
              >
                <MessageSquare className="w-5 h-5" />
                <span>{loading ? 'Opening chat...' : 'Message Landlord'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Fullscreen Image Modal */}
        {showFullscreen && (
          <div className="fixed inset-0 bg-black z-50 flex flex-col">
            {/* Close Button */}
            <button
              onClick={() => setShowFullscreen(false)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
              aria-label="Close fullscreen"
            >
              <X className="w-8 h-8" />
            </button>

            {/* Navigation */}
            {images.length > 1 && (
              <>
                <button
                  onClick={goToPreviousImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition z-10"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>

                <button
                  onClick={goToNextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition z-10"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-8 h-8" />
                </button>
              </>
            )}

            {/* Image */}
            <div className="flex-1 flex items-center justify-center overflow-hidden">
              <img
                src={currentImage}
                alt={`${listing.title} ${currentImageIndex + 1}`}
                className="max-w-full max-h-full object-contain"
              />
            </div>

            {/* Counter */}
            {images.length > 1 && (
              <div className="text-center text-white py-4">
                {currentImageIndex + 1} / {images.length}
              </div>
            )}
          </div>
        )}

        {/* Chat Modal */}
        {showChat && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-40 md:z-50">
            <div className="bg-white rounded-lg w-full max-w-2xl max-h-[85vh] md:max-h-[80vh] flex flex-col">
              {/* Header */}
              <div className="p-4 border-b flex justify-between items-center flex-shrink-0">
                <h3 className="text-lg md:text-xl font-bold">
                  Chat with {listing.landlordId?.name || 'Landlord'}
                </h3>
                <button
                  onClick={() => setShowChat(false)}
                  className="text-gray-500 hover:text-gray-700 transition"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Error Message */}
              {error && (
                <div className="px-4 py-2 bg-red-100 text-red-700 text-sm flex-shrink-0">
                  {error}
                </div>
              )}

              {/* Messages */}
              <div className="flex-1 p-4 overflow-y-auto bg-gray-50 min-h-0">
                {messages.length > 0 ? (
                  <div className="space-y-3">
                    {messages.map((msg) => (
                      <div
                        key={msg._id}
                        className={`flex ${msg.senderId === user.id ? 'justify-end' : 'justify-start'
                          }`}
                      >
                        <div className="max-w-xs md:max-w-md lg:max-w-lg">
                          <div
                            className={`px-4 py-2 rounded-lg text-sm md:text-base ${msg.senderId === user.id
                              ? 'bg-indigo-600 text-white rounded-br-none'
                              : 'bg-white text-gray-900 border border-gray-200 rounded-bl-none'
                              }`}
                          >
                            {msg.message}
                          </div>
                          <p className="text-xs text-gray-500 mt-1 px-2">
                            {formatTime(msg.timestamp)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    No messages yet. Start the conversation!
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t bg-white flex-shrink-0">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm md:text-base"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === 'Enter' && handleSendMessage()
                    }
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!message.trim()}
                    className="bg-indigo-600 text-white px-4 md:px-6 py-2 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 transition flex-shrink-0"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListingDetailPage;
