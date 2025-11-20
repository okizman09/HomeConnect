# HomeConnect - Full Stack Integration Guide

## 📋 Project Overview

HomeConnect is a complete MERN (MongoDB, Express, React, Node.js) stack application that connects landlords with tenants for property rentals.

**Architecture:**
- **Frontend**: React 18 + Vite + Tailwind CSS (port 5173)
- **Backend**: Node.js + Express + MongoDB (port 5000)
- **Real-time**: Socket.io for instant messaging
- **Files**: Cloudinary for image hosting
- **Email**: Gmail SMTP for notifications

## 🚀 Quick Start (5 Minutes)

### Step 1: Backend Setup

```bash
cd backend
cp .env.example .env
# Edit .env with your credentials
npm install
npm run dev
```

You should see: `✅ Backend server running on port 5000`

### Step 2: Frontend Setup

```bash
cd Frontend
npm install socket.io-client
cp .env.example .env.local
# Edit .env.local:
# VITE_API_URL=http://localhost:5000/api
# VITE_SOCKET_URL=http://localhost:5000
npm run dev
```

You should see: `Local: http://localhost:5173/`

### Step 3: Test Connection

1. Open http://localhost:5173 in browser
2. Register a new account
3. You should receive a confirmation email
4. Login successfully

## 📚 Complete Setup Guide

### Backend Setup (Detailed)

#### 1. Environment Variables

Copy `.env.example` to `.env` and fill in:

```env
# MongoDB (Choose one)
# Local: mongodb://localhost:27017/homeconnect
# Or Atlas: mongodb+srv://username:password@cluster.mongodb.net/homeconnect
MONGODB_URI=

# Generate at https://randomkeygen.com (min 32 chars)
JWT_SECRET=

# From https://cloudinary.com dashboard
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Gmail with app password
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password_16_digits
```

#### 2. Install Dependencies

```bash
npm install

# Dependencies installed:
# express (web framework)
# mongoose (MongoDB ODM)
# jsonwebtoken (authentication)
# bcryptjs (password hashing)
# socket.io (real-time)
# cloudinary (image hosting)
# multer (file upload)
# nodemailer (email)
# cors (cross-origin)
```

#### 3. Start Backend

```bash
npm run dev
# or
npm start
```

#### 4. Verify Backend

```bash
# In another terminal:
curl http://localhost:5000/api/health
```

Expected: `{"success":true,"message":"Backend server is running"...}`

### Frontend Setup (Detailed)

#### 1. Install Dependencies

```bash
cd Frontend
npm install
npm install socket.io-client
```

#### 2. Environment Variables

Create `.env.local`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

#### 3. Start Frontend

```bash
npm run dev
```

Expected: `Local: http://localhost:5173/`

#### 4. Verify Frontend

Open browser to http://localhost:5173

You should see:
- Landing page with hero section
- Register/Login buttons
- Navigation bar

## 🔐 Testing Workflow

### 1. User Registration

```
1. Click "Register" on homepage
2. Fill in form:
   - Name: John Doe
   - Email: john@example.com
   - Password: password123
   - Role: Tenant
   - Phone: +234801234567
   - Location: Lagos, Nigeria
3. Submit
```

Expected:
- ✅ User created in MongoDB
- ✅ JWT token received
- ✅ Confirmation email sent
- ✅ Redirected to listings page

### 2. User Login

```
1. Go to homepage
2. Click "Login"
3. Enter credentials from registration
4. Submit
```

Expected:
- ✅ Logged in successfully
- ✅ JWT token stored in localStorage
- ✅ User profile loaded
- ✅ Navbar shows user info

### 3. Create Listing (Landlord)

```
Register as Landlord:
1. Click "Register"
2. Select "Landlord" role
3. Fill in details
4. Submit
```

As Landlord:
```
1. Click "Create Listing" in navbar
2. Fill form:
   - Title: Beautiful 2-Bedroom Apartment
   - Description: Modern apartment with amenities
   - Location: Ikoyi, Lagos
   - Price: 500000
   - Property Type: 2-bedroom
   - Occupancy Limit: 4
   - Images: Upload 2-3 images
3. Submit
```

Expected:
- ✅ Images uploaded to Cloudinary
- ✅ Listing created in MongoDB
- ✅ Redirected to listings page
- ✅ New listing visible in browse

### 4. Browse Listings

```
1. Click "Explore" in navbar
2. See all listings
3. Try filtering:
   - Location search
   - Property type filter
   - Price range slider
4. Click on a listing
```

Expected:
- ✅ See property details
- ✅ See landlord info
- ✅ "Message Landlord" button available

### 5. Real-time Messaging

```
As Tenant:
1. Browse listings
2. Click on a listing
3. Click "Message Landlord"
4. Type message: "Hi, I'm interested"
5. Send

As Landlord:
1. Go to "Messages" (Chats page)
2. See new conversation
3. Click to open chat
4. Reply to message in real-time
```

Expected:
- ✅ Messages send via Socket.io
- ✅ Real-time message delivery
- ✅ Typing indicators show
- ✅ Unread count updates

### 6. User Profile

```
1. Click username in navbar (top right)
2. See user details:
   - Name, Email, Phone
   - Location, Role
   - Account created date
3. View profile information
```

Expected:
- ✅ Current user data displays
- ✅ All fields show correctly

## 🔌 API Testing

### Using Postman

#### Setup

1. Create environment "HomeConnect"
2. Add variables:
   ```
   base_url: http://localhost:5000/api
   token: (auto-populated after login)
   ```

#### Test Endpoints

**1. Register**
```
POST {{base_url}}/auth/register
Body (JSON):
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "tenant",
  "phone": "+234801234567",
  "location": "Lagos"
}
```

**2. Login**
```
POST {{base_url}}/auth/login
Body (JSON):
{
  "email": "john@example.com",
  "password": "password123"
}
```

**3. Get Current User**
```
GET {{base_url}}/auth/me
Headers:
Authorization: Bearer {{token}}
```

**4. Get All Listings**
```
GET {{base_url}}/listings
```

**5. Create Listing (Landlord)**
```
POST {{base_url}}/listings
Headers:
Authorization: Bearer {{token}}
Body (JSON):
{
  "title": "2-Bedroom Apartment",
  "description": "Modern apartment",
  "location": "Ikoyi, Lagos",
  "price": 500000,
  "propertyType": "2-bedroom",
  "occupancyLimit": 4,
  "images": ["https://cloudinary.com/image1.jpg"]
}
```

**6. Search Listings**
```
GET {{base_url}}/listings/search?location=Lagos&propertyType=2-bedroom&minPrice=400000&maxPrice=600000
```

**7. Get Chat Conversations**
```
GET {{base_url}}/chat/conversations
Headers:
Authorization: Bearer {{token}}
```

**8. Send Message**
```
POST {{base_url}}/chat
Headers:
Authorization: Bearer {{token}}
Body (JSON):
{
  "receiverId": "user_id_here",
  "message": "Hi, interested in property",
  "listingId": "listing_id_here"
}
```

**9. Upload Images**
```
POST {{base_url}}/upload
Headers:
Authorization: Bearer {{token}}
Body: form-data
- images: [select multiple image files]
```

## 🗂️ Database Models

### User Schema
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (tenant/landlord),
  phone: String,
  location: String,
  createdAt: Date
}
```

### Listing Schema
```javascript
{
  _id: ObjectId,
  landlordId: ObjectId (ref: User),
  title: String,
  description: String,
  location: String,
  price: Number,
  propertyType: String,
  occupancyLimit: Number,
  images: [String] (Cloudinary URLs),
  dateCreated: Date
}
```

### Chat Schema
```javascript
{
  _id: ObjectId,
  senderId: ObjectId (ref: User),
  receiverId: ObjectId (ref: User),
  message: String,
  listingId: ObjectId (ref: Listing),
  timestamp: Date,
  read: Boolean
}
```

## 🔌 Socket.io Events

### Client-side (Frontend)

```javascript
// Join room
socket.emit('join', userId);

// Send message
socket.emit('sendMessage', {
  senderId: currentUser.id,
  receiverId: otherUser.id,
  message: 'Hello!',
  listingId: listing.id
});

// Typing indicator
socket.emit('typing', {
  senderId: currentUser.id,
  receiverId: otherUser.id,
  isTyping: true
});

// Listen for messages
socket.on('receiveMessage', (message) => {
  console.log('New message:', message);
});

// Listen for delivery confirmation
socket.on('messageSent', (data) => {
  console.log('Message delivered:', data.chat);
});

// Listen for typing
socket.on('userTyping', (data) => {
  console.log(`User ${data.senderId} is typing:`, data.isTyping);
});
```

## 📁 File Structure Summary

```
Housing App/
├── backend/
│   ├── config/db.js
│   ├── controllers/ (4 files)
│   ├── models/ (3 files)
│   ├── routes/ (4 files)
│   ├── middleware/ (2 files)
│   ├── utils/ (2 files)
│   ├── socket/socketHandler.js
│   ├── server.js
│   ├── package.json
│   ├── .env.example
│   ├── README.md
│   └── SETUP.md
│
└── Frontend/
    ├── src/
    │   ├── pages/ (7 files)
    │   ├── components/Navbar.jsx
    │   ├── context/AuthContext.jsx
    │   ├── hooks/index.js
    │   ├── services/api.js
    │   ├── app.jsx
    │   ├── index.jsx
    │   ├── constants.js
    │   ├── utils.js
    │   └── assets/
    ├── package.json
    ├── vite.config.ts
    ├── tailwind.config.js
    ├── .env.example
    ├── README.md
    └── SETUP.md
```

## 🚀 Deployment

### Backend Deployment (Railway/Render)

1. Push code to GitHub
2. Connect repo to hosting service
3. Set environment variables in dashboard
4. Deploy automatically on push

### Frontend Deployment (Vercel/Netlify)

1. Update API URL to production backend
2. Build: `npm run build`
3. Deploy to Vercel/Netlify
4. Update Socket URL in environment

## ✅ Checklist Before Production

- [ ] Change JWT_SECRET to strong random key
- [ ] Setup MongoDB production database
- [ ] Configure Cloudinary production account
- [ ] Setup Gmail app password
- [ ] Update FRONTEND_URL to production domain
- [ ] Enable HTTPS for all connections
- [ ] Setup CI/CD pipeline
- [ ] Add environment variable encryption
- [ ] Test all API endpoints
- [ ] Test Socket.io connections
- [ ] Load test the application
- [ ] Setup error monitoring (Sentry)
- [ ] Setup log aggregation
- [ ] Configure auto-backups

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| "Cannot connect to MongoDB" | Check MONGODB_URI and IP whitelist |
| "Invalid JWT token" | Verify JWT_SECRET and token format |
| "Images not uploading" | Verify Cloudinary credentials |
| "Emails not sending" | Check Gmail app password and SMTP |
| "Socket.io not connecting" | Verify SOCKET_URL matches backend URL |
| "CORS errors" | Ensure FRONTEND_URL in .env matches frontend domain |
| "User not found after login" | Clear localStorage and login again |

## 📞 Support

1. Check backend README.md for detailed API docs
2. Check frontend SETUP.md for component docs
3. Review error messages in browser console
4. Check Network tab for API responses
5. Check backend terminal for Socket.io logs

---

**Ready to go live!** 🎉

Your complete MERN stack application is ready for testing and deployment.
