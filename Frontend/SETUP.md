# HomeConnect Frontend - Environment Setup Guide

## 📋 Setup Instructions

### 1. Install Dependencies

```bash
cd Frontend
npm install
# Also install socket.io-client for real-time chat
npm install socket.io-client
```

### 2. Create `.env.local` File

In the `Frontend` directory root, create a `.env.local` file:

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
VITE_APP_NAME=HomeConnect
```

### 3. Backend Requirements

Make sure your backend is running on `http://localhost:5000` with these endpoints:

#### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user (requires token)

#### Listings
- `GET /api/listings` - Get all listings
- `GET /api/listings/:id` - Get single listing
- `GET /api/listings/search?location=X&propertyType=Y&minPrice=A&maxPrice=B` - Search listings
- `POST /api/listings` - Create listing (landlord only)
- `PUT /api/listings/:id` - Update listing (landlord only)
- `DELETE /api/listings/:id` - Delete listing (landlord only)

#### Messages/Chat
- `GET /api/messages/conversations` - Get user conversations
- `GET /api/messages/conversations/:userId` - Get chat history with user
- `POST /api/messages/conversations` - Create/start conversation
- `POST /api/messages/conversations/:conversationId` - Send message

#### Upload
- `POST /api/upload` - Upload images (multipart/form-data)

#### Socket.io Events
- `join` - Join user room
- `sendMessage` - Send message via socket
- `receiveMessage` - Listen for incoming messages
- `typing` - Send typing indicator

### 4. Authentication Flow

The app uses JWT tokens stored in localStorage:
- **Token Key:** `token`
- **User Data Key:** `authUser`
- **Token Header:** `Authorization: Bearer <token>`

The AuthContext automatically:
- Persists user data to localStorage
- Includes token in all API requests
- Handles login/logout/registration
- Syncs auth state on app load

### 5. Component Structure

```
src/
├── app.jsx                    # Main app router/dispatcher
├── context/
│   └── AuthContext.jsx       # Authentication state & logic
├── components/
│   └── Navbar.jsx            # Navigation bar
├── pages/
│   ├── LandingPage.jsx       # Home page
│   ├── LoginPage.jsx         # Login form
│   ├── RegisterPage.jsx      # Registration form
│   ├── ListingsPage.jsx      # Browse properties
│   ├── ListingDetailPage.jsx # Property details & chat
│   ├── ChatsPage.jsx         # Messaging interface
│   └── CreateListingPage.jsx # Create property (landlords)
├── services/
│   └── api.js                # API service layer
├── hooks/
│   └── index.js              # Custom React hooks
├── constants.js              # App constants
├── utils.js                  # Utility functions
└── assets/                   # Images, icons, etc.
```

### 6. Key Features Implemented

✅ **User Authentication**
- Register with name, email, password, phone, location, role
- Login with email/password
- Session persistence via localStorage
- Protected routes based on authentication

✅ **Property Listings**
- Browse all properties with filters
- Filter by location, property type, price range
- Search by title/description
- View property details
- Landlord-only listing creation

✅ **Image Uploads**
- Upload multiple images to Cloudinary
- Image preview before upload
- Remove images before submission
- Automatic image storage with listings

✅ **Real-time Chat**
- Socket.io integration for instant messaging
- Conversation history
- Unread message indicators
- Typing indicators
- Email notifications for new messages

✅ **Role-Based Access**
- Tenant role: Browse, message, view details
- Landlord role: Create, edit, delete listings + browse

### 7. Running the Application

```bash
# Development mode with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### 8. Troubleshooting

**API Connection Issues:**
- Ensure backend is running on port 5000
- Check `.env.local` has correct VITE_API_URL
- Verify CORS is enabled on backend

**Authentication Not Persisting:**
- Check browser localStorage is enabled
- Clear localStorage if needed: Open DevTools → Application → Local Storage → Clear All

**Chat Not Working:**
- Verify backend Socket.io is configured
- Check VITE_SOCKET_URL in .env.local
- Look for socket connection errors in browser console

**Image Upload Failures:**
- Verify Cloudinary credentials are set on backend
- Check file size limit (10MB)
- Ensure image files are in valid format (PNG, JPG, WebP)

### 9. API Response Format

All API responses follow this structure:

```json
{
  "success": true/false,
  "data": { /* response data */ },
  "message": "error message if failed"
}
```

### 10. Token Management

Tokens are automatically managed:
- Stored on successful login/register
- Attached to all authenticated requests
- Removed on logout
- Expired tokens trigger re-authentication

For manual token inspection:
```javascript
const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('authUser'));
```

---

**Ready to run!** Start your backend and run `npm run dev` to begin.
