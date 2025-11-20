# HomeConnect Backend Documentation

## 🚀 Quick Start

### Prerequisites
- Node.js (v14+)
- MongoDB (Local or Atlas)
- Cloudinary Account
- Gmail App Password for email

### Installation Steps

```bash
# 1. Navigate to backend folder
cd backend

# 2. Install dependencies
npm install

# 3. Create .env file
# Copy content from .env.example and update with your credentials
cp .env.example .env

# 4. Start development server
npm run dev
```

## 📝 Environment Variables (.env)

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/homeconnect
# OR MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/homeconnect

# JWT
JWT_SECRET=your_super_secret_jwt_key_min_32_characters_long
JWT_EXPIRE=7d

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email (Gmail SMTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=noreply@homeconnect.com

# Frontend
FRONTEND_URL=http://localhost:5173
```

### Getting Credentials

#### MongoDB Atlas
1. Visit [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account
3. Create a cluster
4. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/dbname`

#### Cloudinary
1. Visit [cloudinary.com](https://cloudinary.com)
2. Sign up for free account
3. Get Cloud Name, API Key, and API Secret from dashboard

#### Gmail App Password
1. Enable 2-Factor Authentication on Gmail
2. Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
3. Select Mail and Windows/Mac
4. Copy the generated password to `EMAIL_PASS`

## 📂 Project Structure

```
backend/
├── config/
│   └── db.js                  # MongoDB connection
├── controllers/
│   ├── authController.js      # Authentication logic
│   ├── listingController.js   # Property listings CRUD
│   ├── chatController.js      # Messaging logic
│   └── uploadController.js    # Image uploads
├── models/
│   ├── User.js                # User schema
│   ├── Listing.js             # Listing schema
│   └── Chat.js                # Chat schema
├── routes/
│   ├── auth.js                # Auth endpoints
│   ├── listings.js            # Listing endpoints
│   ├── chat.js                # Chat endpoints
│   └── upload.js              # Upload endpoints
├── middleware/
│   ├── auth.js                # JWT authentication
│   └── upload.js              # Multer configuration
├── utils/
│   ├── cloudinary.js          # Cloudinary config
│   └── email.js               # Email sending
├── socket/
│   └── socketHandler.js       # Socket.io events
├── server.js                  # Main server file
└── package.json
```

## 🔌 API Endpoints

### Authentication

#### Register
```
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "tenant",
  "phone": "+234801234567",
  "location": "Lagos, Nigeria"
}

Response:
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64a1b2c3d4e5f6g7h8i9j0k1",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "tenant",
    "phone": "+234801234567",
    "location": "Lagos, Nigeria"
  }
}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { ... }
}
```

#### Get Current User
```
GET /api/auth/me
Authorization: Bearer {token}

Response:
{
  "success": true,
  "user": { ... }
}
```

### Listings

#### Get All Listings
```
GET /api/listings

Response:
{
  "success": true,
  "count": 5,
  "listings": [
    {
      "_id": "64a1b2c3d4e5f6g7h8i9j0k1",
      "title": "Beautiful 2-Bedroom Apartment",
      "description": "Modern apartment with all amenities",
      "location": "Ikoyi, Lagos",
      "price": 500000,
      "propertyType": "2-bedroom",
      "occupancyLimit": 4,
      "images": ["url1", "url2", ...],
      "landlordId": {
        "_id": "64a1b2c3d4e5f6g7h8i9j0k2",
        "name": "Jane Smith",
        "email": "jane@example.com",
        "phone": "+234802345678"
      },
      "dateCreated": "2024-01-15T10:30:00Z"
    },
    ...
  ]
}
```

#### Get Single Listing
```
GET /api/listings/{id}

Response:
{
  "success": true,
  "listing": { ... }
}
```

#### Search Listings
```
GET /api/listings/search?location=Lagos&propertyType=2-bedroom&minPrice=400000&maxPrice=600000

Response:
{
  "success": true,
  "count": 2,
  "listings": [ ... ]
}
```

#### Create Listing (Landlord Only)
```
POST /api/listings
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Beautiful 2-Bedroom Apartment",
  "description": "Modern apartment with all amenities",
  "location": "Ikoyi, Lagos",
  "price": 500000,
  "propertyType": "2-bedroom",
  "occupancyLimit": 4,
  "images": ["cloudinary_url1", "cloudinary_url2"]
}

Response:
{
  "success": true,
  "listing": { ... }
}
```

#### Update Listing
```
PUT /api/listings/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "price": 550000,
  "description": "Updated description"
}
```

#### Delete Listing
```
DELETE /api/listings/{id}
Authorization: Bearer {token}
```

### Chat

#### Get Conversations
```
GET /api/chat/conversations
Authorization: Bearer {token}

Response:
{
  "success": true,
  "conversations": [
    {
      "userId": "64a1b2c3d4e5f6g7h8i9j0k2",
      "userName": "Jane Smith",
      "userEmail": "jane@example.com",
      "lastMessage": "When can you visit?",
      "lastTimestamp": "2024-01-15T14:30:00Z",
      "unread": 2
    },
    ...
  ]
}
```

#### Get Chat History
```
GET /api/chat/{userId}
Authorization: Bearer {token}

Response:
{
  "success": true,
  "messages": [
    {
      "_id": "64a1b2c3d4e5f6g7h8i9j0k3",
      "senderId": { "_id": "...", "name": "John" },
      "receiverId": { "_id": "...", "name": "Jane" },
      "message": "Hi, I'm interested in your property",
      "timestamp": "2024-01-15T10:00:00Z",
      "read": true
    },
    ...
  ]
}
```

#### Send Message
```
POST /api/chat
Authorization: Bearer {token}
Content-Type: application/json

{
  "receiverId": "64a1b2c3d4e5f6g7h8i9j0k2",
  "message": "Hi, I'm interested in your property",
  "listingId": "64a1b2c3d4e5f6g7h8i9j0k1"
}

Response:
{
  "success": true,
  "chat": { ... }
}
```

### Upload

#### Upload Images
```
POST /api/upload
Authorization: Bearer {token}
Content-Type: multipart/form-data

Form Data:
- images: [file1, file2, file3, ...]

Response:
{
  "success": true,
  "urls": [
    "https://cloudinary.com/image1.jpg",
    "https://cloudinary.com/image2.jpg"
  ]
}
```

## 🔐 Authentication

All protected endpoints require JWT token in Authorization header:

```
Authorization: Bearer {token}
```

Token is valid for 7 days (configurable via `JWT_EXPIRE`).

## 🔌 Socket.io Events

### Client → Server

**join** - Join user's room for real-time updates
```javascript
socket.emit('join', userId);
```

**sendMessage** - Send a message
```javascript
socket.emit('sendMessage', {
  senderId: "...",
  receiverId: "...",
  message: "Hello!",
  listingId: "..." // optional
});
```

**typing** - Send typing indicator
```javascript
socket.emit('typing', {
  senderId: "...",
  receiverId: "...",
  isTyping: true
});
```

### Server → Client

**receiveMessage** - Receive new message
```javascript
socket.on('receiveMessage', (message) => {
  console.log('New message:', message);
});
```

**messageSent** - Message delivery confirmation
```javascript
socket.on('messageSent', (data) => {
  if (data.success) {
    console.log('Message sent:', data.chat);
  }
});
```

**userTyping** - User typing indicator
```javascript
socket.on('userTyping', (data) => {
  console.log(`User ${data.senderId} is typing:`, data.isTyping);
});
```

**messageError** - Error sending message
```javascript
socket.on('messageError', (data) => {
  console.error('Error:', data.error);
});
```

## 🧪 Testing with Postman

### Setup Postman Environment

1. Create new environment "HomeConnect"
2. Add variables:
   - `base_url`: `http://localhost:5000/api`
   - `token`: (leave empty, will be set after login)

3. In Postman scripts tab, add:
```javascript
// Tests tab
if (pm.response.code === 201 || pm.response.code === 200) {
  if (pm.response.json().token) {
    pm.environment.set("token", pm.response.json().token);
  }
}
```

### Test Endpoints
1. Register → Copy token from response
2. Login → Token auto-sets in environment
3. Use `{{token}}` in Authorization header for protected routes

## 🚀 Deployment

### Environment Variables for Production
```env
NODE_ENV=production
MONGODB_URI=your_atlas_uri
JWT_SECRET=very_long_random_secret_key_here
PORT=5000
FRONTEND_URL=https://yourdomain.com
```

### Deployment Platforms
- **Heroku**: `heroku create` → `git push heroku main`
- **Railway**: Connect GitHub repo → Auto-deploy
- **Render**: Create Web Service → Connect repo
- **AWS**: Use EC2 or Elastic Beanstalk

## 🐛 Common Issues

### MongoDB Connection Error
- Check MONGODB_URI format
- Ensure IP whitelist includes your IP in MongoDB Atlas
- Verify username/password special characters are URL-encoded

### JWT Token Invalid
- Ensure `JWT_SECRET` is at least 32 characters
- Check token isn't expired
- Verify Bearer format: `Authorization: Bearer {token}`

### Email Not Sending
- Enable "Less secure app access" for Gmail (deprecated)
- Use Gmail App Password instead
- Check EMAIL_USER and EMAIL_PASS are correct
- Verify SMTP credentials in Nodemailer config

### Image Upload Fails
- Verify Cloudinary credentials are correct
- Check image file size < 10MB
- Ensure image format is JPEG, PNG, or WebP

## 📚 Dependencies

- **express**: Web framework
- **mongoose**: MongoDB ODM
- **bcryptjs**: Password hashing
- **jsonwebtoken**: JWT authentication
- **socket.io**: Real-time communication
- **cloudinary**: Image hosting
- **multer**: File upload handling
- **nodemailer**: Email sending
- **express-validator**: Input validation

## 📞 Support

For issues or questions:
1. Check this documentation
2. Review error messages in console
3. Check browser Network tab for API responses
4. Verify all environment variables are set
