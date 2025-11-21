// API service layer for backend communication
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function for API calls
const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'API request failed');
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Auth endpoints
export const authAPI = {
  login: (email, password) =>
    apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: (userData) =>
    apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return Promise.resolve();
  },

  getCurrentUser: () => apiCall('/auth/me'),
};

// Listings endpoints
export const listingsAPI = {
  getAll: (filters = {}) => {
    const params = new URLSearchParams(filters);
    return apiCall(`/listings?${params}`);
  },

  getById: (id) => apiCall(`/listings/${id}`),

  create: (listingData) =>
    apiCall('/listings', {
      method: 'POST',
      body: JSON.stringify(listingData),
    }),

  update: (id, listingData) =>
    apiCall(`/listings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(listingData),
    }),

  delete: (id) =>
    apiCall(`/listings/${id}`, {
      method: 'DELETE',
    }),

  uploadImages: (id, formData) =>
    fetch(`${API_BASE_URL}/listings/${id}/images`, {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }).then((res) => {
      if (!res.ok) throw new Error('Upload failed');
      return res.json();
    }),
};

// Messages endpoints
export const messagesAPI = {
  getConversations: () => apiCall('/messages/conversations'),

  getMessages: (userId) =>
    apiCall(`/messages/${userId}`),

  sendMessage: (userId, message) =>
    apiCall('/messages', {
      method: 'POST',
      body: JSON.stringify({ receiverId: userId, message }),
    }),

  createConversation: (userId) =>
    apiCall('/messages', {
      method: 'POST',
      body: JSON.stringify({ receiverId: userId, message: 'Hi' }),
    }),
};

// Users endpoints
export const usersAPI = {
  getProfile: (userId) => apiCall(`/users/${userId}`),

  updateProfile: (userData) =>
    apiCall('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    }),

  getLandlordListings: (landlordId) =>
    apiCall(`/users/${landlordId}/listings`),
};
