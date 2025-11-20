# 🚀 Quick Start Reference Card

## 5-Minute Setup

### Terminal 1: Backend
```bash
cd backend
cp .env.example .env
# Fill in: MONGODB_URI, JWT_SECRET, Cloudinary, Gmail
npm install
npm run dev
```

### Terminal 2: Frontend
```bash
cd Frontend
npm install socket.io-client
cp .env.example .env.local
# Fill in: VITE_API_URL, VITE_SOCKET_URL
npm run dev
```

### Browser
Open: http://localhost:5173

---

## 🔑 Essential Credentials Needed

| Service | Where to Get | What to Add |
|---------|-------------|-----------|
| MongoDB | mongodb.com/atlas | MONGODB_URI |
| JWT Secret | randomkeygen.com | JWT_SECRET (32+ chars) |
| Cloudinary | cloudinary.com | CLOUD_NAME, API_KEY, API_SECRET |
| Gmail | Gmail account | EMAIL_USER, EMAIL_PASS (app password) |

---

## 📁 Key Files to Know

### Backend
- **server.js** - Main server
- **config/db.js** - Database connection
- **models/** - Data schemas
- **controllers/** - Business logic
- **routes/** - API endpoints
- **socket/socketHandler.js** - Real-time events

### Frontend
- **src/app.jsx** - Router
- **src/context/AuthContext.jsx** - Auth state
- **src/services/api.js** - API calls
- **src/pages/** - Page components
- **src/hooks/index.js** - Custom hooks

---

## 🔌 API Quick Hits

```bash
# Health check
curl http://localhost:5000/api/health

# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@test.com","password":"pass123","role":"tenant","phone":"+234801234567","location":"Lagos"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@test.com","password":"pass123"}'

# Get listings
curl http://localhost:5000/api/listings

# Search listings
curl "http://localhost:5000/api/listings/search?location=Lagos&propertyType=2-bedroom"
```

---

## 🧪 Test Workflow

### 1. Register as Tenant
```
http://localhost:5173 → Register
Fill form → Submit → Receive email
```

### 2. Register as Landlord
```
Same as above, but select "Landlord" role
```

### 3. Create Listing (as Landlord)
```
Click "Create Listing" → Fill form → Upload images → Submit
```

### 4. Browse Listings (as Tenant)
```
Click "Explore" → View listings → Click to see details
```

### 5. Send Message
```
Click on listing → "Message Landlord" → Type message → Send
```

### 6. Chat Real-time
```
Click "Messages" → See conversations → Click to reply
Messages appear instantly (Socket.io)
```

---

## 📊 Database Models

### User
```javascript
{
  name, email, password (hashed), role, phone, location, createdAt
}
```

### Listing
```javascript
{
  title, description, location, price, propertyType, 
  occupancyLimit, images (Cloudinary URLs), landlordId, dateCreated
}
```

### Chat
```javascript
{
  senderId, receiverId, message, listingId, timestamp, read
}
```

---

## 🔒 Auth Token

After login, token is stored in localStorage:
```javascript
// Frontend
const token = localStorage.getItem('token');

// Use in requests
fetch(url, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

---

## 📍 Port Reference

| Service | Port | URL |
|---------|------|-----|
| Backend | 5000 | http://localhost:5000 |
| Frontend | 5173 | http://localhost:5173 |
| API | 5000 | http://localhost:5000/api |
| Socket.io | 5000 | http://localhost:5000 |

---

## 🛠️ Useful Commands

### Backend
```bash
npm run dev        # Start development server
npm start          # Start production server
npm install        # Install dependencies
```

### Frontend
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm install        # Install dependencies
```

---

## 📖 Documentation Map

```
1. START HERE → BACKEND_SETUP_GUIDE.md
                      ↓
2. Configure    → backend/.env with credentials
                      ↓
3. Understand   → API_REFERENCE.md (all endpoints)
                      ↓
4. Test         → INTEGRATION_CHECKLIST.md
                      ↓
5. Deploy       → Follow deployment sections
```

---

## ⚡ Common Tasks

### Reset Everything
```bash
# Backend
rm -rf backend/node_modules
npm install

# Frontend
rm -rf Frontend/node_modules
npm install
```

### Check Backend Health
```bash
curl http://localhost:5000/api/health
# Should return: {"success":true, "message":"Backend server is running"...}
```

### Clear Frontend Cache
```bash
# Clear localStorage
localStorage.clear()

# Reload page
location.reload()
```

### View Backend Logs
```bash
# Terminal running backend will show:
# - MongoDB connection
# - Server startup
# - API requests
# - Socket.io connections
```

---

## 🚨 Troubleshooting Quick Fixes

| Problem | Solution |
|---------|----------|
| Port already in use | Change PORT in .env or kill process |
| MongoDB connection failed | Check MONGODB_URI and IP whitelist |
| JWT invalid | Verify JWT_SECRET is 32+ characters |
| Emails not sending | Check Gmail app password (2FA required) |
| Socket.io not connecting | Verify SOCKET_URL matches backend |
| Images not uploading | Check Cloudinary credentials |
| CORS errors | Ensure FRONTEND_URL in backend .env |

---

## 📞 Quick Links

- **Backend Setup**: `backend/SETUP.md`
- **Backend Checklist**: `backend/CHECKLIST.md`
- **API Reference**: `API_REFERENCE.md`
- **Integration Testing**: `INTEGRATION_CHECKLIST.md`
- **Full Documentation**: `BACKEND_SETUP_GUIDE.md`

---

## ✅ Pre-Launch Checklist

- [ ] Backend running on port 5000
- [ ] Frontend running on port 5173
- [ ] Can register new user
- [ ] Can login successfully
- [ ] Can create listing (as landlord)
- [ ] Can browse listings (as tenant)
- [ ] Can send/receive messages real-time
- [ ] Can upload images
- [ ] Receive confirmation emails
- [ ] All API endpoints respond

---

## 🎯 You're Ready!

Everything is set up and ready to go. Start with:

1. **Backend Setup**: `cd backend && cp .env.example .env` (edit .env)
2. **Install & Run**: `npm install && npm run dev`
3. **Frontend Setup**: `cd Frontend && npm install socket.io-client`
4. **Run Frontend**: `npm run dev`
5. **Test**: Open http://localhost:5173

**Enjoy building! 🚀**
