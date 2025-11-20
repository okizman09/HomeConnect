# 🏠 HomeConnect Frontend - Complete Integration Guide

This is a fully modular React + Vite frontend that integrates seamlessly with the HomeConnect MERN backend.

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ installed
- Backend running on `http://localhost:5000`
- npm or yarn package manager

### Installation

```bash
# 1. Navigate to Frontend directory
cd Frontend

# 2. Install dependencies (including socket.io-client)
npm install
npm install socket.io-client

# 3. Create .env.local file
cat > .env.local << EOF
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
VITE_APP_NAME=HomeConnect
EOF

# 4. Start development server
npm run dev
```

The app will be available at `http://localhost:5173` (or the port Vite shows).

## 📁 Project Structure

```
Frontend/
├── src/
│   ├── app.jsx                      # Main app component with routing
│   ├── context/
│   │   └── AuthContext.jsx          # Auth state management
│   ├── components/
│   │   └── Navbar.jsx               # Navigation component
│   ├── pages/
│   │   ├── LandingPage.jsx          # Home/welcome page
│   │   ├── LoginPage.jsx            # Login form
│   │   ├── RegisterPage.jsx         # Sign up form
│   │   ├── ListingsPage.jsx         # Browse properties
│   │   ├── ListingDetailPage.jsx    # Property details & messaging
│   │   ├── ChatsPage.jsx            # Chat interface
│   │   └── CreateListingPage.jsx    # Create listing (landlords)
│   ├── services/
│   │   └── api.js                   # API client with all endpoints
│   ├── hooks/
│   │   └── index.js                 # Custom React hooks
│   ├── constants.js                 # App constants & enums
│   ├── utils.js                     # Utility functions
│   ├── index.jsx                    # React DOM render
│   └── index.css                    # Global styles
├── .env.example                     # Environment template
├── SETUP.md                         # Detailed setup guide
├── tailwind.config.js               # Tailwind CSS config
├── package.json                     # Dependencies
└── vite.config.ts                   # Vite configuration
```

## 🔑 Key Features

### ✅ Authentication
- User registration with validation
- Secure login with JWT tokens
- Automatic session persistence
- Password validation (min 8 characters)
- Role selection (Tenant/Landlord)

### ✅ Property Listings
- Browse all properties
- Advanced filtering (location, type, price)
- Full-text search
- Detailed property pages
- Image gallery support
- Property creator info

### ✅ Real-time Messaging
- Socket.io powered instant chat
- Conversation management
- Unread message indicators
- Typing indicators
- Message timestamps
- Email notifications (optional)

### ✅ Landlord Features
- Create new property listings
- Upload multiple images (to Cloudinary)
- Edit property details
- Manage listings
- Respond to tenant inquiries

### ✅ Tenant Features
- Search and filter properties
- View property details
- Message landlords directly
- Manage conversations
- Save favorite properties (future)

## 🔌 API Integration

### Base Configuration
All API calls are made through `services/api.js` which handles:
- **Base URL**: Configured via `VITE_API_URL` env variable
- **Authentication**: Automatic JWT token injection
- **Error Handling**: Centralized error management
- **Response Format**: JSON with success/error fields

### Available API Endpoints

#### Authentication
```javascript
authAPI.register(userData)      // POST /auth/register
authAPI.login(email, password)  // POST /auth/login
authAPI.getCurrentUser()        // GET /auth/me
```

#### Listings
```javascript
listingsAPI.getAll(filters)     // GET /listings
listingsAPI.getById(id)         // GET /listings/:id
listingsAPI.create(data)        // POST /listings
listingsAPI.update(id, data)    // PUT /listings/:id
listingsAPI.delete(id)          // DELETE /listings/:id
listingsAPI.uploadImages(id, formData) // POST /listings/:id/images
```

#### Messages
```javascript
messagesAPI.getConversations()           // GET /messages/conversations
messagesAPI.getMessages(conversationId)  // GET /messages/conversations/:id
messagesAPI.sendMessage(conversationId, message) // POST /messages/conversations/:id
messagesAPI.createConversation(userId)   // POST /messages/conversations
```

#### Users
```javascript
usersAPI.getProfile(userId)              // GET /users/:userId
usersAPI.updateProfile(data)             // PUT /users/profile
usersAPI.getLandlordListings(landlordId) // GET /users/:landlordId/listings
```

## 🎣 Custom Hooks

### useAuth()
Access authentication state and methods:
```javascript
const { user, loading, error, login, register, logout, updateProfile, isAuthenticated } = useAuth();
```

### useFetch(fetchFunction, dependencies)
Data fetching with loading and error states:
```javascript
const { data, loading, error, execute } = useFetch(
  () => listingsAPI.getAll(),
  []
);
```

### useForm(initialValues, onSubmit)
Form handling with validation:
```javascript
const { values, errors, touched, handleChange, handleSubmit, loading } = useForm(
  { email: '', password: '' },
  async (values) => { /* submit logic */ }
);
```

### useModal(initialState)
Modal/dialog state management:
```javascript
const { isOpen, open, close, toggle } = useModal();
```

### usePagination(initialPage, pageSize)
Pagination logic:
```javascript
const { page, totalPages, goToPage, nextPage, prevPage } = usePagination();
```

### useLocalStorage(key, initialValue)
Persistent local storage:
```javascript
const [saved, setSaved] = useLocalStorage('key', defaultValue);
```

## 🔐 Authentication Flow

1. **Registration**
   - User submits name, email, password, phone, location, role
   - Validation on frontend + backend
   - Server returns JWT token
   - Token + user data stored in localStorage
   - Auto-redirect to listings page

2. **Login**
   - User submits email + password
   - Server validates credentials
   - JWT token returned and stored
   - User state synced across app

3. **Protected Routes**
   - All authenticated pages check `useAuth()`
   - Redirect to login if not authenticated
   - Landlord-only routes check user.role

4. **Session Persistence**
   - Token auto-loaded from localStorage on app start
   - User data synced from backend on load
   - No need to login again on page refresh

## 📱 Responsive Design

Built with Tailwind CSS for full responsiveness:
- ✅ Mobile-first approach
- ✅ Tablet optimized
- ✅ Desktop ready
- ✅ Touch-friendly buttons and forms

## ⚙️ Configuration

### Environment Variables (.env.local)

```env
# Backend API URL (with /api path)
VITE_API_URL=http://localhost:5000/api

# Socket.io server URL
VITE_SOCKET_URL=http://localhost:5000

# App name (optional)
VITE_APP_NAME=HomeConnect
```

### Update for Production
Before deploying, update `.env.local` with production backend URL:
```env
VITE_API_URL=https://your-backend-domain.com/api
VITE_SOCKET_URL=https://your-backend-domain.com
```

## 🧪 Development Tools

### Available Scripts
```bash
npm run dev      # Start dev server with hot reload
npm run build    # Build for production
npm run preview  # Preview production build locally
npm run lint     # Run ESLint (if configured)
```

### Browser DevTools
- React DevTools - For component inspection
- Redux DevTools - For state management (if added)
- Network Tab - To debug API calls
- Local Storage - Check auth token persistence

## 🐛 Common Issues & Solutions

### API Connection Failed
**Problem**: "Cannot POST /api/auth/login"
**Solution**: 
- Verify backend is running on port 5000
- Check `.env.local` has correct `VITE_API_URL`
- Check CORS is enabled on backend

### Authentication Not Persisting
**Problem**: User logged in but disappears on refresh
**Solution**:
- Clear browser cache
- Check localStorage in DevTools (F12 → Application → Local Storage)
- Restart dev server

### Chat Messages Not Sending
**Problem**: Socket.io errors in console
**Solution**:
- Verify backend Socket.io is configured
- Check `VITE_SOCKET_URL` in .env.local
- Restart both frontend and backend

### Images Not Uploading
**Problem**: 413 Payload Too Large or Cloudinary errors
**Solution**:
- Check file size (max 10MB each)
- Verify image format (PNG, JPG, WebP)
- Check Cloudinary credentials on backend

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

This creates an optimized `dist/` folder ready for deployment.

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

### Deploy to Netlify
```bash
npm run build
# Drag dist folder to Netlify
```

### Deploy to Other Platforms
- Set `VITE_API_URL` to your production backend
- Build and upload `dist/` folder

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Lucide Icons](https://lucide.dev)
- [Socket.io Client](https://socket.io/docs/v4/client-api/)

## 🤝 Contributing

This frontend integrates with the HomeConnect MERN backend. When making changes:

1. Keep API calls centralized in `services/api.js`
2. Use custom hooks for reusable logic
3. Follow Tailwind CSS conventions
4. Test with both roles (tenant/landlord)
5. Test responsiveness on mobile

## 📝 License

Part of the HomeConnect housing platform project.

---

**Questions?** Check `SETUP.md` for detailed configuration guide.
