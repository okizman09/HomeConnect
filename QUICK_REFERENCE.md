# ⚡ Quick Reference Guide - HomeConnect

## 🚀 Start Here

### 1. Backend Setup (5 minutes)
```bash
cd Backend
npm install
# Edit .env with your MongoDB, Cloudinary, email credentials
npm start
# Backend running on http://localhost:5000
```

### 2. Frontend Setup (5 minutes)
```bash
cd Frontend
npm install
npm install socket.io-client
# Create .env.local:
cat > .env.local << 'EOF'
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
EOF
npm run dev
# Frontend running on http://localhost:5173
```

### 3. Test Everything
- Open http://localhost:5173
- Register as Tenant
- Register as Landlord
- Create a listing (as landlord)
- Message landlord (as tenant)
- ✅ Done!

---

## 📍 File Locations

### Key Backend Files
```
Backend/
├── server.js              ← Start here
├── .env                   ← Your credentials
├── models/User.js         ← User schema
├── models/Listing.js      ← Property schema
├── models/Chat.js         ← Message schema
├── controllers/
│   ├── authController.js  ← Auth logic
│   ├── listingController.js
│   ├── chatController.js
│   └── uploadController.js
└── routes/                ← All API routes
```

### Key Frontend Files
```
Frontend/src/
├── app.jsx                ← Main component
├── context/AuthContext.jsx ← Auth state
├── pages/
│   ├── ListingsPage.jsx
│   ├── LoginPage.jsx
│   ├── RegisterPage.jsx
│   ├── ChatsPage.jsx
│   └── CreateListingPage.jsx
├── services/api.js        ← API calls
├── hooks/index.js         ← Custom hooks
└── constants.js           ← App constants
```

---

## 🔌 API Quick Reference

### Authentication
```javascript
// Register
POST /api/auth/register
{ name, email, password, phone, location, role }

// Login
POST /api/auth/login
{ email, password }

// Get current user
GET /api/auth/me
// Requires: Authorization header with token
```

### Listings
```javascript
// Get all listings
GET /api/listings

// Get one listing
GET /api/listings/:id

// Search listings
GET /api/listings/search?location=X&propertyType=Y&minPrice=A&maxPrice=B

// Create listing (Landlord only)
POST /api/listings
{ title, description, location, price, propertyType, occupancyLimit, images }

// Update listing (Owner only)
PUT /api/listings/:id

// Delete listing (Owner only)
DELETE /api/listings/:id
```

### Messages
```javascript
// Get conversations
GET /api/messages/conversations

// Get chat history
GET /api/messages/conversations/:userId

// Send message
POST /api/messages/conversations/:userId
{ message }

// Start conversation
POST /api/messages/conversations
{ participantId }
```

---

## 🎮 Common Tasks

### Create a Test Listing
```javascript
// In frontend, as landlord:
await listingsAPI.create({
  title: "Beautiful 2BR Apartment",
  description: "Modern amenities, quiet neighborhood",
  location: "Ikeja, Lagos",
  price: 500000,
  propertyType: "2-bedroom",
  occupancyLimit: 4,
  images: ["url1", "url2"]  // Cloudinary URLs
});
```

### Send a Message
```javascript
// Via Socket.io (real-time):
socket.emit('sendMessage', {
  senderId: user.id,
  receiverId: landlordId,
  message: "Hello, I'm interested!"
});

// Or via API:
await messagesAPI.sendMessage(landlordId, "Hello!");
```

### Upload Images
```javascript
// Create FormData
const formData = new FormData();
files.forEach(file => formData.append('images', file));

// Upload
fetch(`${VITE_API_URL}/upload`, {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` },
  body: formData
});
```

---

## 🔑 Environment Variables

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/homeconnect
JWT_SECRET=your_long_secret_key_here
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=noreply@homeconnect.com
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env.local)
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
VITE_APP_NAME=HomeConnect
```

---

## 🧪 Testing Users

### Test Account 1 (Tenant)
```
Email: tenant@test.com
Password: password123
Role: Tenant
```

### Test Account 2 (Landlord)
```
Email: landlord@test.com
Password: password123
Role: Landlord
```

---

## 🐛 Common Issues & Fixes

| Problem | Solution |
|---------|----------|
| "Cannot POST /api/auth/login" | Backend not running on 5000 |
| CORS error | Check CORS config in server.js |
| Socket connection refused | Wrong VITE_SOCKET_URL |
| Images won't upload | Cloudinary keys missing in .env |
| Authentication not persisting | Clear localStorage and retry |
| "User not found" on login | Database not populated |
| Chat messages not real-time | Socket.io not connected |

---

## 📦 Dependencies Summary

### Backend
```json
{
  "express": "Web server",
  "mongoose": "MongoDB ORM",
  "jsonwebtoken": "JWT auth",
  "bcryptjs": "Password hashing",
  "socket.io": "Real-time chat",
  "multer": "File upload",
  "cloudinary": "Image storage",
  "nodemailer": "Email service"
}
```

### Frontend
```json
{
  "react": "UI library",
  "vite": "Build tool",
  "tailwindcss": "Styling",
  "lucide-react": "Icons",
  "socket.io-client": "WebSocket client"
}
```

---

## 🎯 User Flows

### Tenant Flow
1. Land on homepage → Click "Get Started"
2. Register as Tenant
3. Auto-login after registration
4. Browse listings
5. Click on property
6. Click "Message Landlord"
7. Chat with landlord
8. Schedule viewing

### Landlord Flow
1. Land on homepage → Click "Get Started"
2. Register as Landlord
3. Auto-login after registration
4. Click "Create Listing"
5. Fill form + upload images
6. Submit listing
7. Receive messages from tenants
8. Respond via real-time chat

---

## 🔍 Debug Mode

### Check Backend Logs
```bash
# In Backend directory
npm start
# Look for "MongoDB Connected" and "Server running"
```

### Check Frontend Console
```javascript
// Open browser DevTools (F12)
// Check Console tab for errors
// Check Network tab for API requests
// Check Application → Local Storage for token
```

### Check Socket Connection
```javascript
// In browser console:
io.on('connect', () => console.log('Socket connected'));
io.on('disconnect', () => console.log('Socket disconnected'));
```

### Test API Manually
```bash
# Test login endpoint:
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password123"}'
```

---

## 📊 Database Schemas

### User
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  role: "tenant" | "landlord",
  phone: String,
  location: String,
  createdAt: Date
}
```

### Listing
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
  images: [String],
  dateCreated: Date
}
```

### Chat
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

---

## 🚀 Deployment Checklist

- [ ] Backend: Update MONGODB_URI to Atlas
- [ ] Backend: Set production JWT_SECRET
- [ ] Backend: Configure Cloudinary production
- [ ] Backend: Deploy to Heroku/Railway/AWS
- [ ] Frontend: Update VITE_API_URL to production domain
- [ ] Frontend: Build: `npm run build`
- [ ] Frontend: Deploy to Vercel/Netlify
- [ ] Test all features on production
- [ ] Set up monitoring and logs
- [ ] Configure email service
- [ ] Enable HTTPS
- [ ] Set up backups

---

## 📞 Need Help?

1. Check **SETUP.md** for detailed configuration
2. Check **INTEGRATION_CHECKLIST.md** for testing
3. Check **README.md** for features overview
4. Review code comments in relevant files
5. Check browser console for errors
6. Check backend logs for API errors

---

**You're all set! Happy coding! 🎉**
