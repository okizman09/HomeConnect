# 🔗 Frontend-Backend Integration Checklist

## ✅ Pre-Integration Setup

### Frontend Setup
- [ ] Navigate to `Frontend` directory
- [ ] Run `npm install` to install base dependencies
- [ ] Run `npm install socket.io-client` for real-time chat
- [ ] Create `.env.local` file with backend URLs
- [ ] Verify Vite dev server starts: `npm run dev`

### Backend Setup
- [ ] Install all backend dependencies: `npm install`
- [ ] Create `.env` file with all required variables
- [ ] Ensure MongoDB connection is working
- [ ] Configure Cloudinary credentials
- [ ] Set up email service (Gmail app password)
- [ ] Verify backend starts: `npm start`

## 📡 API Integration Verification

### Authentication Endpoints
- [ ] `POST /api/auth/register` - Test user creation
  - [ ] Validates all required fields
  - [ ] Returns JWT token
  - [ ] Returns user object with id, name, email, role
  
- [ ] `POST /api/auth/login` - Test login
  - [ ] Validates email/password
  - [ ] Returns correct JWT token
  - [ ] Returns user object

- [ ] `GET /api/auth/me` - Test token validation
  - [ ] Requires bearer token header
  - [ ] Returns current user info
  - [ ] Returns 401 if token invalid/expired

### Listings Endpoints
- [ ] `GET /api/listings` - Get all listings
  - [ ] Returns array of listings
  - [ ] Includes landlord info (populated)
  - [ ] All properties have required fields

- [ ] `GET /api/listings/:id` - Get single listing
  - [ ] Returns correct listing
  - [ ] Includes landlord info
  - [ ] Returns 404 if not found

- [ ] `GET /api/listings/search?location=X&propertyType=Y` - Search/filter
  - [ ] Filters work correctly
  - [ ] Returns matching listings
  - [ ] Works with partial queries

- [ ] `POST /api/listings` - Create listing (Protected)
  - [ ] Requires authenticated user
  - [ ] Requires landlord role
  - [ ] Creates listing with all fields
  - [ ] Sets landlordId to current user

- [ ] `PUT /api/listings/:id` - Update listing (Protected)
  - [ ] Only landlord who created it can update
  - [ ] Updates fields correctly
  - [ ] Returns updated listing

- [ ] `DELETE /api/listings/:id` - Delete listing (Protected)
  - [ ] Only landlord who created it can delete
  - [ ] Removes listing from database
  - [ ] Returns success message

### Messaging Endpoints
- [ ] `GET /api/messages/conversations` - Get conversations (Protected)
  - [ ] Returns list of conversations for user
  - [ ] Shows unread count
  - [ ] Shows last message

- [ ] `GET /api/messages/conversations/:userId` - Get chat history (Protected)
  - [ ] Returns messages between two users
  - [ ] Ordered by timestamp
  - [ ] Includes sender/receiver info

- [ ] `POST /api/messages/conversations/:userId` - Send message (Protected)
  - [ ] Creates message in database
  - [ ] Emits via Socket.io if receiver online
  - [ ] Sends email notification (optional)

- [ ] `POST /api/messages/conversations` - Create conversation (Protected)
  - [ ] Creates new conversation
  - [ ] Returns conversation ID
  - [ ] Prevents duplicate conversations

### Upload Endpoint
- [ ] `POST /api/upload` - Upload images (Protected, Landlord only)
  - [ ] Accepts multipart/form-data
  - [ ] Uploads to Cloudinary
  - [ ] Returns secure URLs
  - [ ] Validates file type (images only)
  - [ ] Validates file size (max 10MB)

## 🔌 Socket.io Integration

### Socket Events
- [ ] Server emits on connection
  - [ ] Client can join user room: `socket.emit('join', userId)`
  - [ ] User ID sent with message for identification

- [ ] Real-time messaging
  - [ ] Client: `socket.emit('sendMessage', { senderId, receiverId, message })`
  - [ ] Server: Saves to DB and broadcasts
  - [ ] Client: Listens to `socket.on('receiveMessage', message)`

- [ ] Typing indicators
  - [ ] Client: `socket.emit('typing', { senderId, receiverId, isTyping })`
  - [ ] Server: Broadcasts to specific user
  - [ ] Client: Listens to `socket.on('userTyping', data)`

- [ ] Message delivery
  - [ ] Server confirms: `socket.emit('messageSent', { success, chat })`
  - [ ] Handles errors: `socket.emit('messageError', { error })`

## 🧪 Frontend Testing

### Authentication Flow
- [ ] Register as Tenant
  - [ ] User created in database
  - [ ] Token stored in localStorage
  - [ ] Redirected to listings page
  - [ ] User info displayed in navbar

- [ ] Register as Landlord
  - [ ] Same as tenant, but role = 'landlord'
  - [ ] Can see "Create Listing" button

- [ ] Login
  - [ ] Can login with registered email
  - [ ] Token persists on page reload
  - [ ] Invalid credentials show error

- [ ] Logout
  - [ ] Token removed from localStorage
  - [ ] Redirected to landing page
  - [ ] Cannot access protected pages

### Listings Page
- [ ] All listings display
  - [ ] Images load correctly
  - [ ] Information is accurate
  - [ ] Landlord info shown

- [ ] Filtering works
  - [ ] Filter by location
  - [ ] Filter by property type
  - [ ] Filter by price range
  - [ ] Combine multiple filters

- [ ] Search works
  - [ ] Search by title
  - [ ] Search by description
  - [ ] Real-time filtering

- [ ] Click listing
  - [ ] Shows detail page
  - [ ] All information displays
  - [ ] Landlord contact info shown

### Create Listing (Landlord)
- [ ] Form validates
  - [ ] Required fields enforced
  - [ ] Price is a number
  - [ ] At least one image required

- [ ] Image upload works
  - [ ] Preview displays
  - [ ] Multiple images supported
  - [ ] Can remove images before submit
  - [ ] Files successfully upload to Cloudinary

- [ ] Listing created
  - [ ] Shows in listings page
  - [ ] Data is correct
  - [ ] Images display

- [ ] Edit listing
  - [ ] Can update details
  - [ ] Can add/remove images
  - [ ] Only owner can edit

- [ ] Delete listing
  - [ ] Only owner can delete
  - [ ] Removed from listings

### Chat Interface
- [ ] Send message
  - [ ] Message appears in chat
  - [ ] Message saved to database
  - [ ] Timestamp displays

- [ ] Receive message
  - [ ] Real-time message appears (via Socket.io)
  - [ ] Shows sender name/avatar
  - [ ] Unread count updates

- [ ] Multiple conversations
  - [ ] Can switch between conversations
  - [ ] Chat history persists
  - [ ] Correct messages display

- [ ] Messaging from listing
  - [ ] Click "Message Landlord" on listing
  - [ ] Chat modal opens
  - [ ] Can send initial message
  - [ ] Conversation created in backend

### Responsiveness
- [ ] Mobile devices (320px)
  - [ ] Navigation collapses
  - [ ] Forms stack vertically
  - [ ] Images responsive

- [ ] Tablets (768px)
  - [ ] Grid layout adjusts
  - [ ] Chat sidebar visible or collapsible
  - [ ] All buttons accessible

- [ ] Desktop (1024px+)
  - [ ] Full layout displays
  - [ ] Side-by-side chat and conversation list
  - [ ] Hover effects work

## 🔐 Security Verification

- [ ] JWT tokens
  - [ ] Included in all protected requests
  - [ ] Stored securely in localStorage
  - [ ] Removed on logout
  - [ ] Invalid tokens rejected by backend

- [ ] Protected routes
  - [ ] Cannot access listing creation as tenant
  - [ ] Cannot delete others' listings
  - [ ] Cannot see other users' private data

- [ ] Password validation
  - [ ] Frontend: min 8 characters
  - [ ] Backend: same validation
  - [ ] Not stored in localStorage

- [ ] Email validation
  - [ ] Prevents invalid emails
  - [ ] Checked on both frontend and backend

## 📊 Error Handling

- [ ] Network errors
  - [ ] Shows user-friendly error message
  - [ ] Retry option provided
  - [ ] No data loss on error

- [ ] API errors
  - [ ] Displays backend error message
  - [ ] Handles 404 (not found)
  - [ ] Handles 401 (unauthorized)
  - [ ] Handles 500 (server error)

- [ ] Validation errors
  - [ ] Shows specific field errors
  - [ ] Prevents form submission
  - [ ] Clears on successful submission

- [ ] Socket errors
  - [ ] Handles disconnect gracefully
  - [ ] Auto-reconnect attempt
  - [ ] Falls back to HTTP requests

## 📈 Performance

- [ ] API calls optimized
  - [ ] Listings paginated if many items
  - [ ] Images lazy-loaded
  - [ ] No unnecessary API calls

- [ ] Bundle size
  - [ ] Build completes in reasonable time
  - [ ] No console errors/warnings
  - [ ] Assets load quickly

- [ ] Socket connections
  - [ ] Single persistent connection
  - [ ] Reconnects on disconnect
  - [ ] No message loss

## ✨ Final Verification

- [ ] All CRUD operations work (Create, Read, Update, Delete)
- [ ] Authentication persists across page reloads
- [ ] Real-time chat works with multiple users
- [ ] Images upload and display correctly
- [ ] No console errors or warnings
- [ ] Responsive on mobile, tablet, desktop
- [ ] Error handling graceful and informative
- [ ] All buttons and links functional
- [ ] User experience smooth and intuitive

## 🚀 Production Readiness

- [ ] `.env.local` removed from version control
- [ ] `.env.example` has all necessary variables documented
- [ ] Backend API URL set to production domain
- [ ] Cloudinary, email, and database set to production
- [ ] CORS properly configured for production domain
- [ ] SSL/HTTPS enforced in production
- [ ] Error logging set up
- [ ] Analytics configured (optional)
- [ ] Database backups configured
- [ ] Monitoring alerts set up

## 🐛 Known Issues & Resolutions

| Issue | Cause | Solution |
|-------|-------|----------|
| 404 on API calls | Backend not running | Start backend: `npm start` |
| CORS errors | Missing CORS config | Add frontend URL to backend CORS |
| Socket connection fails | Wrong Socket URL | Update `VITE_SOCKET_URL` in .env.local |
| Images don't upload | Cloudinary config missing | Set Cloudinary keys on backend |
| Chat doesn't work in real-time | Socket events not fired | Check Socket.io implementation |
| Auth not persisting | localStorage disabled | Enable localStorage in browser |
| Validation errors | Data mismatch | Check format matches backend schema |

---

**Status**: When all checkboxes are complete, frontend-backend integration is complete! ✅
