import React, { useState } from 'react';
import { MapPin, DollarSign, Users, MessageSquare, X, Send } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { messagesAPI } from '../services/api';
import { formatPrice, formatDate } from '../utils';
import { PROPERTY_LABELS } from '../constants';

const ListingDetailPage = ({ listing, onBack }) => {
  const { user } = useAuth();
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi, I'm interested in your property",
      sender: 'other',
      time: '10:30 AM',
    },
    {
      id: 2,
      text: "Hello! I'd be happy to help. When would you like to view it?",
      sender: 'me',
      time: '10:32 AM',
    },
    {
      id: 3,
      text: 'How about this weekend?',
      sender: 'other',
      time: '10:35 AM',
    },
    {
      id: 4,
      text: 'Saturday at 2 PM works for me',
      sender: 'me',
      time: '10:40 AM',
    },
  ]);
  const [message, setMessage] = useState('');

  const handleStartChat = async () => {
    try {
      // Create conversation with landlord
      await messagesAPI.createConversation(listing.landlordId);
      setShowChat(true);
    } catch (error) {
      console.error('Failed to start chat:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    try {
      await messagesAPI.sendMessage(listing.landlordId, message);

      setMessages([
        ...messages,
        {
          id: messages.length + 1,
          text: message,
          sender: 'me',
          time: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
        },
      ]);

      setMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
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
          <div className="relative">
            <img
              src={listing.images?.[0] || 'https://via.placeholder.com/1200x400'}
              alt={listing.title}
              className="w-full h-96 object-cover"
            />

            {listing.images && listing.images.length > 1 && (
              <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded">
                1 / {listing.images.length}
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="p-8">
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-4xl font-bold mb-2">{listing.title}</h1>
                <div className="flex items-center text-gray-600 mb-2">
                  <MapPin className="w-5 h-5 mr-2" />
                  <span className="text-lg">{listing.location}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-indigo-600">
                  {formatPrice(listing.price)}
                </div>
                <div className="text-gray-600">per year</div>
              </div>
            </div>

            {/* Key Details */}
            <div className="grid md:grid-cols-3 gap-4 mb-8 pb-8 border-b">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Property Type</div>
                <div className="text-lg font-semibold">
                  {PROPERTY_LABELS[listing.propertyType]}
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Max Occupancy</div>
                <div className="text-lg font-semibold">
                  {listing.occupancyLimit} people
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Posted</div>
                <div className="text-lg font-semibold">
                  {listing.dateCreated &&
                    formatDate(listing.dateCreated)}
                </div>
              </div>
            </div>

            {/* Landlord Info */}
            {listing.landlordId && (
              <div className="mb-8 pb-8 border-b">
                <h2 className="text-2xl font-bold mb-4">Landlord Information</h2>
                <div className="bg-indigo-50 p-6 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-indigo-600 text-white rounded-full flex items-center justify-center text-2xl font-bold">
                      {(listing.landlordId?.name || 'L')[0].toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">
                        {listing.landlordId?.name || 'Landlord'}
                      </h3>
                      {listing.landlordId?.email && (
                        <p className="text-gray-600">{listing.landlordId.email}</p>
                      )}
                      {listing.landlordId?.phone && (
                        <p className="text-gray-600">{listing.landlordId.phone}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-3">Description</h2>
              <p className="text-gray-700 leading-relaxed">
                {listing.description}
              </p>
            </div>

            {/* Contact CTA */}
            {user && user.role === 'tenant' && (
              <button
                onClick={handleStartChat}
                className="w-full bg-indigo-600 text-white py-4 rounded-lg font-semibold hover:bg-indigo-700 transition flex items-center justify-center space-x-2"
              >
                <MessageSquare className="w-5 h-5" />
                <span>Message Landlord</span>
              </button>
            )}
          </div>
        </div>

        {/* Chat Modal */}
        {showChat && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg w-full max-w-2xl max-h-[80vh] flex flex-col">
              {/* Header */}
              <div className="p-4 border-b flex justify-between items-center">
                <h3 className="text-xl font-bold">
                  Chat with {listing.landlordId?.name || 'Landlord'}
                </h3>
                <button
                  onClick={() => setShowChat(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${
                        msg.sender === 'me' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div className="max-w-xs">
                        <div
                          className={`px-4 py-2 rounded-lg ${
                            msg.sender === 'me'
                              ? 'bg-indigo-600 text-white'
                              : 'bg-white text-gray-900 border border-gray-200'
                          }`}
                        >
                          {msg.text}
                        </div>
                        <p className="text-xs text-gray-500 mt-1 px-2">
                          {msg.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Input */}
              <div className="p-4 border-t bg-white">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === 'Enter' && handleSendMessage()
                    }
                  />
                  <button
                    onClick={handleSendMessage}
                    className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
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
