# Landlord-Tenant Connection Platform

A modern digital platform that efficiently connects Landlords posting vacant properties with Tenants searching for them, facilitated by in-app chat. Built with the MERN stack (MongoDB, Express.js, React, Node.js).

## 📋 Project Overview

**Project Name:** Landlord-Tenant Connection Platform (MVP V3)

**Status:** Minimum Viable Product (MVP) - Ready for Deployment

**Document Version:** 3.0 (Unverified Connection)

**Last Updated:** January 3, 2026

### 🎯 Product Goal

To launch a functional digital platform that increases market transparency and improves access to adequate and affordable housing by enabling seamless connections between property owners and seekers.

### 🌍 Sustainable Development Goal Alignment

**SDG 11 (Target 11.1):** Contributes to access to adequate and affordable housing by increasing market transparency and reducing information asymmetry in the housing market.

---

## 👥 Team

| Name | Role | Responsibilities |
|------|------|------------------|
| **Daud Abdulrahman Okikiola** | Lead Developer & Project Lead | Full-stack development, project leadership, backend architecture, frontend development, ideation |
| **Issa Rukayat Morayo** | Supervisor & Co-Developer | Full-stack development, project supervision, ideation, quality assurance |

**Team Contributions:** Both team members collaborated extensively on frontend and backend development, contributing to project ideation and architecture decisions. Rukayat supervised the project progress while Daud led day-to-day development activities.

---

## 🛠️ Technical Stack

### Frontend
- **Framework:** React 18
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **State Management:** Context API
- **Real-time Communication:** Socket.io Client
- **Icons:** Lucide React
- **HTTP Client:** Fetch API

### Backend
- **Runtime:** Node.js
- **Web Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** bcryptjs (12 salt rounds)
- **Real-time Communication:** Socket.io
- **File Storage:** Cloudinary (Image Hosting)
- **Email Service:** Nodemailer (Gmail SMTP)
- **File Upload:** Multer (Memory Storage, 10MB limit)
- **Input Validation:** express-validator

### DevOps & Deployment
- **Development Server:** Nodemon (Backend Auto-reload)
- **Version Control:** Git
- **Package Manager:** npm

---

## ✨ Core Features (MVP - Immediate Scope)

### 1. User Onboarding & Profiles

#### FUN-001: Basic Registration/Login
- Standard email/password authentication
- Role selection during signup (Landlord or Tenant)
- JWT-based session management
- 7-day token expiration for security

**Endpoint:** `POST /api/auth/register`, `POST /api/auth/login`

#### FUN-002: Basic Profile Setup
- Collect essential user information:
  - Full Name
  - Email (Unique identifier)
  - Phone Number
  - Location/Address
  - Role (Landlord/Tenant)
- Profile retrieval with `GET /api/auth/me`

---

### 2. Property Listing & Discovery

#### FUN-003: Landlord Listing Creation
- Exclusive feature for users with Landlord role
- Simple, intuitive form interface
- Real-time form validation
- Image upload capability (up to 10 images)

**Endpoint:** `POST /api/listings` (Protected - Landlord only)

#### FUN-004: Listing Mandatory Data
Each property listing includes:
- **Location:** Neighborhood/Area (for geographic filtering)
- **Rent Amount:** Monthly rent price
- **Property Type:** Self-contain, 1-Bedroom, 2-Bedroom, 3-Bedroom, 4-Bedroom, Duplex
- **Images:** Minimum 3, maximum 10 (stored on Cloudinary)
- **Occupancy Limit:** Maximum number of people allowed
- **Description:** Detailed property information
- **Landlord Information:** Auto-populated from authenticated user

**Database Model:**
```javascript
{
  landlordId: ObjectId,
  title: String,
  description: String,
  location: String,
  price: Number,
  propertyType: String,
  occupancyLimit: Number,
  images: [String], // Cloudinary URLs
  createdAt: Date
}
```

#### FUN-005: Tenant Search & Filtering
- Browse all available listings
- Advanced filtering by:
  - **Location:** Text search (case-insensitive)
  - **Price Range:** Min and max rent amount
  - **Property Type:** Dropdown selection
- Real-time search results
- Responsive grid/list view

**Endpoint:** `GET /api/listings?location=...&minPrice=...&maxPrice=...&propertyType=...`

---

### 3. Communication

#### FUN-006: In-App Chat
- **Persistent Chat Interface:** Conversations stored in database
- **Real-Time Features:**
  - **Instant Messaging:** Powered by Socket.io for immediate delivery
  - **Typing Indicators:** See when the other person is typing
  - **Live Status:** "Active now" indicators
  - **Message Acknowledgments:** Visual confirmation of sent messages
- **UI/UX:**
  - **Responsive Design:** Split-view on desktop, full-screen chat on mobile
  - **Unread Badges:** Notification counters in the Navbar and conversation list
  - **Rich Message Bubbles:** Clear distinction between sent and received messages
  - **Time Formatting:** "Just now", "5 min ago", "10:30 AM" timestamps
- **Integration:**
  - **Direct Access:** "Contact Landlord" button on Listing Details
  - **Context Aware:** Messages linked to specific users

**Endpoints:**
- `GET /api/messages/conversations` - List all conversations with unread counts
- `GET /api/messages/conversations/:userId` - Get full chat history
- `POST /api/messages` - Send a new message

**Socket.io Events:**
- `join` - specific room connection
- `sendMessage` - client-to-server message
- `receiveMessage` - server-to-client delivery
- `typing` - real-time status update
- `messageSent` - delivery confirmation
- `disconnect` - cleanup

#### FUN-007: Basic Notifications
- **Email Notifications:** Triggered on new chat messages
- **Service:** Nodemailer with Gmail SMTP
- **Content:** Message preview, sender name, action link to chat
- **Delivery:** Immediate upon message receipt

**Email Features:**
- HTML-formatted emails
- Call-to-action button to message
- Error handling and retry logic

---

## 🔐 Security Measures (MVP)

### Current Scope
1. **Password Security:**
   - Bcryptjs hashing with 12 salt rounds
   - Passwords never stored in plain text
   - Pre-save encryption in database layer

2. **Authentication:**
   - JWT tokens with 7-day expiration
   - Bearer token validation on protected routes
   - Secure token storage in localStorage

3. **Authorization:**
   - Role-based access control (Landlord/Tenant)
   - Protected routes via `protect` middleware
   - Role-specific operations (e.g., only Landlords can create listings)

4. **Input Validation:**
   - Email format validation (regex)
   - Phone number format validation
   - Password minimum length enforcement (6 characters)
   - Express-validator for all endpoints

5. **File Upload Security:**
   - File type validation (JPEG, PNG, WebP only)
   - File size limit (10MB maximum)
   - Server-side upload handling via Cloudinary
   - No local file storage

6. **CORS Configuration:**
   - Origin whitelist (Frontend URL only)
   - Credentials allowed for authenticated requests

### Important Security Note ⚠️
**This MVP does NOT include identity verification.** Users can register without proving their identity. This speeds up development but carries inherent risks:
- Unverified landlord claims
- Potential impersonation
- **Risk Mitigation:** Users are clearly warned about these limitations in the UI

---

## 🚀 API Reference

### Authentication Endpoints

```
POST /api/auth/register
  Body: { name, email, password, role, phone, location }
  Returns: { success, token, user }

POST /api/auth/login
  Body: { email, password }
  Returns: { success, token, user }

GET /api/auth/me
  Headers: Authorization: Bearer {token}
  Returns: { success, user }
```

### Listing Endpoints

```
POST /api/listings
  Headers: Authorization: Bearer {token}
  Body: { title, description, location, price, propertyType, occupancyLimit, images }
  Returns: { success, listing }

GET /api/listings
  Query: ?location=...&minPrice=...&maxPrice=...&propertyType=...
  Returns: { success, count, listings }

GET /api/listings/:id
  Returns: { success, listing }

PUT /api/listings/:id
  Headers: Authorization: Bearer {token}
  Body: { title, description, location, price, ... }
  Returns: { success, listing }

DELETE /api/listings/:id
  Headers: Authorization: Bearer {token}
  Returns: { success, message }
```

### Chat/Messages Endpoints

```
GET /api/messages/conversations
  Headers: Authorization: Bearer {token}
  Returns: { success, conversations }

GET /api/messages/conversations/:userId
  Headers: Authorization: Bearer {token}
  Returns: { success, messages }

POST /api/messages/conversations
  Headers: Authorization: Bearer {token}
  Body: { receiverId, message }
  Returns: { success, message }
```

### Upload Endpoints

```
POST /api/upload
  Headers: Authorization: Bearer {token}
  Body: FormData with 'images' (max 10 files)
  Returns: { success, urls }
```

---

## 📂 Project Structure

```
Housing App/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js     # Auth logic
│   │   ├── listingController.js  # Listing CRUD
│   │   ├── chatController.js     # Messaging logic
│   │   └── uploadController.js   # File upload handling
│   ├── middleware/
│   │   ├── auth.js               # JWT verification & authorization
│   │   └── upload.js             # Multer configuration
│   ├── models/
│   │   ├── User.js               # User schema
│   │   ├── Listing.js            # Property listing schema
│   │   └── Chat.js               # Message schema
│   ├── routes/
│   │   ├── auth.js               # Auth routes
│   │   ├── listings.js           # Listing routes
│   │   ├── chat.js               # Chat routes
│   │   └── upload.js             # Upload routes
│   ├── socket/
│   │   └── socketHandler.js      # Socket.io event handling
│   ├── utils/
│   │   ├── cloudinary.js         # Cloudinary SDK config
│   │   └── email.js              # Email service
│   ├── scripts/
│   │   ├── deleteUsers.js        # Utility script
│   │   └── rehashPasswords.js    # Utility script
│   ├── server.js                 # Main entry point
│   ├── package.json              # Dependencies
│   └── .env                       # Environment variables
│
├── Frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.jsx        # Navigation bar
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── ListingsPage.jsx
│   │   │   ├── ListingDetailPage.jsx
│   │   │   ├── CreateListingPage.jsx
│   │   │   ├── ChatsPage.jsx
│   │   │   ├── TenantDashboard.jsx
│   │   │   ├── LandlordDashboard.jsx
│   │   │   ├── ForgotPassword.jsx
│   │   │   └── ResetPassword.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx   # Auth state management
│   │   ├── hooks/
│   │   │   └── index.js          # Custom hooks
│   │   ├── services/
│   │   │   └── api.js            # API service layer
│   │   ├── assets/               # Images, icons, etc.
│   │   ├── app.jsx               # Main React component
│   │   ├── index.jsx             # React DOM render
│   │   └── index.css             # Global styles
│   ├── index.html                # Vite entry point
│   ├── vite.config.js            # Vite configuration
│   ├── tailwind.config.js        # Tailwind CSS config
│   ├── postcss.config.js         # PostCSS config
│   ├── package.json              # Dependencies
│   └── .env.local                # Environment variables
│
└── Documentation/
    ├── README.md                 # This file
    ├── API_REFERENCE.md
    ├── BACKEND_SETUP_GUIDE.md
    ├── QUICK_START.md
    └── PRD.md
```

---

## 🏗️ Installation & Setup

### Prerequisites
- Node.js v14+
- npm v6+
- MongoDB Atlas account
- Cloudinary account
- Gmail account (for email notifications)

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file:**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables:**
   ```
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?appName=name
   JWT_SECRET=your_64_character_random_secret
   JWT_EXPIRE=7d
   FRONTEND_URL=http://localhost:5173
   
   # Cloudinary Configuration
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   
   # Email Configuration
   EMAIL_USER=your_gmail@gmail.com
   EMAIL_PASS=your_app_password
   ```

5. **Start backend server:**
   ```bash
   npm run dev    # With Nodemon (development)
   # or
   npm start      # Direct node (production)
   ```

   Server runs on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd Frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env.local` file:**
   ```bash
   VITE_API_URL=http://localhost:5000/api
   VITE_SOCKET_URL=http://localhost:5000
   ```

4. **Start frontend dev server:**
   ```bash
   npm run dev
   ```

   Application runs on `http://localhost:5173` (or next available port)

---

## 🧪 Testing the Application

### 1. User Registration
- Navigate to `/register`
- Create account with:
  - Full Name
  - Email
  - Password (minimum 6 characters)
  - Phone Number
  - Location
  - Role (Landlord or Tenant)
- Verify account creation in database

### 2. User Login
- Navigate to `/login`
- Enter email and password
- Verify JWT token is stored
- Check user is redirected to dashboard

### 3. Create Listing (Landlord)
- Login as Landlord user
- Navigate to `/create-listing`
- Fill form with:
  - Title
  - Description
  - Location
  - Monthly Rent
  - Property Type
  - Occupancy Limit
  - Upload 3+ images
- Submit and verify listing appears in database

### 4. Browse Listings (Tenant)
- Login as Tenant user
- Navigate to `/listings`
- View all available properties
- Test filters:
  - Location search
  - Price range
  - Property type
- Click on listing to view details

### 5. In-App Chat
- Login as Tenant
- Find a listing
- Click "Contact Landlord" button
- Send message
- Verify message appears in database
- Check email notification sent
- Login as Landlord
- Navigate to Chat page
- Verify message received
- Send reply
- Check real-time update via Socket.io

### 6. Image Upload
- Create listing with images
- Verify images upload to Cloudinary
- Confirm URLs stored in listing document
- Check images display on listing detail page

---

## 🔄 Development Workflow

### Running Both Servers
Open two terminal windows:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd Frontend
npm run dev
```

### Hot Module Replacement (HMR)
- Frontend: Changes reflected instantly in browser
- Backend: Server restarts automatically via Nodemon

### Database Debugging
- Use MongoDB Atlas dashboard
- Or use a MongoDB GUI client (MongoDB Compass, etc.)

---

## 📊 Database Schema

### User Model
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (bcrypt hashed),
  role: String (enum: ['tenant', 'landlord']),
  phone: String,
  location: String,
  createdAt: Date
}
```

### Listing Model
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
  images: [String], // Cloudinary URLs
  createdAt: Date
}
```

### Chat Model
```javascript
{
  _id: ObjectId,
  senderId: ObjectId (ref: User),
  receiverId: ObjectId (ref: User),
  listingId: ObjectId (ref: Listing),
  message: String,
  timestamp: Date,
  read: Boolean
}
```

---

## 🚀 Deployment Guide

### Backend Deployment (Heroku Example)

1. **Create Heroku app:**
   ```bash
   heroku create your-app-name
   ```

2. **Set environment variables:**
   ```bash
   heroku config:set MONGODB_URI=your_mongodb_uri
   heroku config:set JWT_SECRET=your_secret
   # ... set all other env vars
   ```

3. **Deploy:**
   ```bash
   git push heroku main
   ```

### Frontend Deployment (Vercel Example)

1. **Push code to GitHub**

2. **Connect to Vercel:**
   - Import project from GitHub
   - Set environment variables in Vercel dashboard
   - Deploy

3. **Update backend URL:**
   - Set `VITE_API_URL` in production environment

---

## 🔮 Future Features (Phases 2 & 3)

### Phase 2: Security & Usability (High Priority)

| Feature | Description | Impact |
|---------|-------------|--------|
| **Identity Verification (NIN)** | Verify National ID numbers for both users | Reduces fraud, builds trust |
| **Proof of Ownership** | Landlords submit utility bills/property documents | Prevents impersonation |
| **Saved Searches** | Tenants save and get alerts on new listings | Improves retention |
| **Rating System** | Tenants rate Landlord responsiveness | Enables trust metrics |

### Phase 3: Transaction & Ecosystem (Strategic)

| Feature | Description | Potential Revenue |
|---------|-------------|-------------------|
| **Payment Gateway Integration** | Secure in-app rent payments | Transaction fees |
| **Payment Protection** | Rent held 24h after move-in confirmation | Tenant protection |
| **Service Marketplace** | Connect plumbers, cleaners, etc. | Marketplace commission |

---

## ⚠️ Known Limitations & Risks

### Current MVP Limitations
1. **No Identity Verification:** Users cannot prove identity
2. **No Landlord Verification:** Cannot confirm property ownership
3. **No Payment Integration:** No secure rental payment system
4. **No Dispute Resolution:** No mechanism for resolving disagreements
5. **No Image Moderation:** Images not screened for inappropriate content

### Risk Mitigation Strategy
- Clear user disclaimers on signup
- Community reporting mechanism for fraudulent listings
- Regular audit of flagged accounts
- Terms of service prohibiting illegal activity

---

## 🐛 Troubleshooting

### Backend won't start
- Check MongoDB connection string in `.env`
- Verify all environment variables are set
- Check port 5000 isn't already in use

### Frontend shows blank page
- Clear browser cache (Ctrl+Shift+Delete)
- Check browser console for errors
- Verify `VITE_API_URL` is correct
- Ensure backend is running

### Messages not sending
- Check Socket.io connection in browser DevTools
- Verify `VITE_SOCKET_URL` matches backend
- Check email credentials are correct
- Review Gmail app password setup

### Images not uploading
- Verify Cloudinary credentials
- Check file size (max 10MB)
- Confirm file format (JPEG, PNG, WebP)
- Check Cloudinary account has available quota

---

## 📝 License

This project is proprietary and intended for deployment as a commercial platform.

---

## 💬 Support & Contact

For issues, questions, or contributions:
- **Lead Developer:** Daud Abdulrahman Okikiola
- **Project Supervisor:** Issa Rukayat Morayo

---

## 🎓 Learning Resources

### MERN Stack
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Express.js Guide](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [Node.js Guide](https://nodejs.org/docs/)

### Tools & Services
- [Cloudinary API](https://cloudinary.com/documentation)
- [Socket.io Guide](https://socket.io/docs/)
- [JWT Documentation](https://jwt.io/)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

**Version:** 3.0 (MVP - Unverified Connection)  
**Last Updated:** January 3, 2026  
**Status:** Ready for Deployment
