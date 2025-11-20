# Backend API Reference

## Base URL
```
http://localhost:5000/api
```

## Authentication

All protected endpoints require Bearer token:

```
Authorization: Bearer {jwt_token}
```

Token obtained from login/register endpoints.

---

## 📋 Endpoints Reference

### AUTH ENDPOINTS

#### 1. Register User
```
POST /auth/register
Content-Type: application/json

Request Body:
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "tenant",
  "phone": "+234801234567",
  "location": "Lagos, Nigeria"
}

Response (201):
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

Errors:
- 400: Email already exists / Invalid input
- 500: Server error
```

#### 2. Login User
```
POST /auth/login
Content-Type: application/json

Request Body:
{
  "email": "john@example.com",
  "password": "password123"
}

Response (200):
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

Errors:
- 400: Missing email/password
- 401: Invalid credentials
- 500: Server error
```

#### 3. Get Current User
```
GET /auth/me
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "user": {
    "id": "64a1b2c3d4e5f6g7h8i9j0k1",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "tenant",
    "phone": "+234801234567",
    "location": "Lagos, Nigeria"
  }
}

Errors:
- 401: No token / Invalid token
- 404: User not found
- 500: Server error
```

---

### LISTING ENDPOINTS

#### 1. Get All Listings
```
GET /listings

Response (200):
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
      "images": [
        "https://res.cloudinary.com/...",
        "https://res.cloudinary.com/..."
      ],
      "landlordId": {
        "_id": "64a1b2c3d4e5f6g7h8i9j0k2",
        "name": "Jane Smith",
        "email": "jane@example.com",
        "phone": "+234802345678"
      },
      "dateCreated": "2024-01-15T10:30:00.000Z"
    }
  ]
}

Errors:
- 500: Server error
```

#### 2. Get Single Listing
```
GET /listings/{listing_id}

Response (200):
{
  "success": true,
  "listing": {
    "_id": "64a1b2c3d4e5f6g7h8i9j0k1",
    "title": "Beautiful 2-Bedroom Apartment",
    "description": "Modern apartment with all amenities",
    "location": "Ikoyi, Lagos",
    "price": 500000,
    "propertyType": "2-bedroom",
    "occupancyLimit": 4,
    "images": [...],
    "landlordId": {...},
    "dateCreated": "2024-01-15T10:30:00.000Z"
  }
}

Errors:
- 404: Listing not found
- 500: Server error
```

#### 3. Search Listings
```
GET /listings/search?location=Lagos&propertyType=2-bedroom&minPrice=400000&maxPrice=600000

Query Parameters:
- location: String (case-insensitive substring match)
- propertyType: String (exact match)
- minPrice: Number (inclusive)
- maxPrice: Number (inclusive)

Response (200):
{
  "success": true,
  "count": 2,
  "listings": [...]
}

Errors:
- 500: Server error
```

#### 4. Create Listing
```
POST /listings
Authorization: Bearer {token}
Content-Type: application/json

Requirements: User must be Landlord role

Request Body:
{
  "title": "Beautiful 2-Bedroom Apartment",
  "description": "Modern apartment with all amenities",
  "location": "Ikoyi, Lagos",
  "price": 500000,
  "propertyType": "2-bedroom",
  "occupancyLimit": 4,
  "images": [
    "https://res.cloudinary.com/image1.jpg",
    "https://res.cloudinary.com/image2.jpg"
  ]
}

Property Types:
- self contain
- 1-bedroom
- 2-bedroom
- 3-bedroom
- 4-bedroom
- duplex

Response (201):
{
  "success": true,
  "listing": {
    "_id": "64a1b2c3d4e5f6g7h8i9j0k1",
    "landlordId": "64a1b2c3d4e5f6g7h8i9j0k2",
    "title": "Beautiful 2-Bedroom Apartment",
    ...
  }
}

Errors:
- 400: Invalid input
- 401: No token / Invalid token
- 403: User is not landlord
- 500: Server error
```

#### 5. Update Listing
```
PUT /listings/{listing_id}
Authorization: Bearer {token}
Content-Type: application/json

Requirements: User must be Landlord AND listing owner

Request Body (any fields):
{
  "title": "Updated Title",
  "price": 550000,
  "description": "Updated description"
}

Response (200):
{
  "success": true,
  "listing": {...}
}

Errors:
- 400: Invalid input
- 401: No token / Not authorized
- 403: User is not listing owner
- 404: Listing not found
- 500: Server error
```

#### 6. Delete Listing
```
DELETE /listings/{listing_id}
Authorization: Bearer {token}

Requirements: User must be Landlord AND listing owner

Response (200):
{
  "success": true,
  "message": "Listing deleted successfully"
}

Errors:
- 401: No token / Not authorized
- 403: User is not listing owner
- 404: Listing not found
- 500: Server error
```

---

### CHAT ENDPOINTS

#### 1. Get All Conversations
```
GET /chat/conversations
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "conversations": [
    {
      "userId": "64a1b2c3d4e5f6g7h8i9j0k2",
      "userName": "Jane Smith",
      "userEmail": "jane@example.com",
      "lastMessage": "When can you visit?",
      "lastTimestamp": "2024-01-15T14:30:00.000Z",
      "unread": 2
    },
    ...
  ]
}

Errors:
- 401: No token / Invalid token
- 500: Server error
```

#### 2. Get Chat History
```
GET /chat/{user_id}
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "messages": [
    {
      "_id": "64a1b2c3d4e5f6g7h8i9j0k3",
      "senderId": {
        "_id": "64a1b2c3d4e5f6g7h8i9j0k1",
        "name": "John"
      },
      "receiverId": {
        "_id": "64a1b2c3d4e5f6g7h8i9j0k2",
        "name": "Jane"
      },
      "message": "Hi, I'm interested in your property",
      "listingId": "64a1b2c3d4e5f6g7h8i9j0k4",
      "timestamp": "2024-01-15T10:00:00.000Z",
      "read": true
    },
    ...
  ]
}

Errors:
- 401: No token / Invalid token
- 500: Server error
```

#### 3. Send Message
```
POST /chat
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
  "receiverId": "64a1b2c3d4e5f6g7h8i9j0k2",
  "message": "Hi, I'm interested in your property",
  "listingId": "64a1b2c3d4e5f6g7h8i9j0k4"
}

Response (201):
{
  "success": true,
  "chat": {
    "_id": "64a1b2c3d4e5f6g7h8i9j0k3",
    "senderId": "64a1b2c3d4e5f6g7h8i9j0k1",
    "receiverId": "64a1b2c3d4e5f6g7h8i9j0k2",
    "message": "Hi, I'm interested in your property",
    "listingId": "64a1b2c3d4e5f6g7h8i9j0k4",
    "timestamp": "2024-01-15T10:00:00.000Z",
    "read": false
  }
}

Side Effects:
- Email notification sent to receiver
- Socket.io event emitted for real-time delivery

Errors:
- 400: Missing receiver or message
- 401: No token / Invalid token
- 500: Server error
```

---

### UPLOAD ENDPOINTS

#### 1. Upload Images
```
POST /upload
Authorization: Bearer {token}
Content-Type: multipart/form-data

Requirements: User must be Landlord role

Form Data:
- images: File[] (max 10 files)

File Constraints:
- Size: Max 10MB per file
- Format: JPEG, PNG, or WebP only
- Multiple files supported (up to 10)

Response (200):
{
  "success": true,
  "urls": [
    "https://res.cloudinary.com/homeconnect/image/upload/...",
    "https://res.cloudinary.com/homeconnect/image/upload/..."
  ]
}

Errors:
- 400: No files / Invalid file type
- 401: No token / Invalid token
- 403: User is not landlord
- 500: Server error
```

---

## 🔌 Socket.io Events

### Client → Server Events

#### join
```javascript
socket.emit('join', userId);

Purpose: Join user's room for receiving messages
```

#### sendMessage
```javascript
socket.emit('sendMessage', {
  senderId: "64a1b2c3d4e5f6g7h8i9j0k1",
  receiverId: "64a1b2c3d4e5f6g7h8i9j0k2",
  message: "Hi, interested in your property",
  listingId: "64a1b2c3d4e5f6g7h8i9j0k4"
});

Purpose: Send message and save to database
```

#### typing
```javascript
socket.emit('typing', {
  senderId: "64a1b2c3d4e5f6g7h8i9j0k1",
  receiverId: "64a1b2c3d4e5f6g7h8i9j0k2",
  isTyping: true
});

Purpose: Send typing indicator to other user
```

### Server → Client Events

#### receiveMessage
```javascript
socket.on('receiveMessage', (message) => {
  console.log('New message:', message);
  // message = {
  //   _id: "...",
  //   senderId: { _id: "...", name: "..." },
  //   receiverId: "...",
  //   message: "...",
  //   timestamp: "...",
  //   read: false
  // }
});
```

#### messageSent
```javascript
socket.on('messageSent', (data) => {
  if (data.success) {
    console.log('Message delivered:', data.chat);
  }
});
```

#### userTyping
```javascript
socket.on('userTyping', (data) => {
  console.log(`User typing:`, data);
  // data = {
  //   senderId: "...",
  //   isTyping: true
  // }
});
```

#### messageError
```javascript
socket.on('messageError', (data) => {
  console.error('Error:', data.error);
});
```

---

## 🔒 Authentication & Authorization

### Roles

- **tenant**: Can browse listings, send messages, search properties
- **landlord**: Can create/edit/delete own listings, send messages, upload images

### Protected Routes

| Endpoint | Method | Required Role |
|----------|--------|-----------------|
| /auth/me | GET | Any authenticated |
| /listings | POST | landlord |
| /listings/:id | PUT | landlord (owner only) |
| /listings/:id | DELETE | landlord (owner only) |
| /chat/conversations | GET | Any authenticated |
| /chat/:userId | GET | Any authenticated |
| /chat | POST | Any authenticated |
| /upload | POST | landlord |

---

## 📊 Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Missing/invalid token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 500 | Server Error - Internal server error |

---

## 🔄 Request/Response Examples

### Full Workflow Example

```javascript
// 1. Register
POST /api/auth/register
→ Returns token & user

// 2. Login (if new session)
POST /api/auth/login
→ Returns token & user

// 3. Get current user
GET /api/auth/me
Headers: Authorization: Bearer {token}
→ Returns user data

// 4. Browse listings
GET /api/listings
→ Returns all listings

// 5. Search listings
GET /api/listings/search?location=Lagos&propertyType=2-bedroom
→ Returns filtered listings

// 6. Get listing details
GET /api/listings/{listing_id}
→ Returns listing with landlord info

// 7. Send message
POST /api/chat
Body: { receiverId, message, listingId }
Headers: Authorization: Bearer {token}
→ Message saved and delivered via Socket.io

// 8. Get conversations
GET /api/chat/conversations
Headers: Authorization: Bearer {token}
→ Returns all conversations with unread count

// 9. Upload images (landlord)
POST /api/upload
Body: FormData with images
Headers: Authorization: Bearer {token}
→ Returns Cloudinary URLs

// 10. Create listing (landlord)
POST /api/listings
Body: { title, description, location, price, propertyType, occupancyLimit, images }
Headers: Authorization: Bearer {token}
→ Returns created listing
```

---

## 📚 Quick Reference

### Common Queries

**Search all 2-bedroom apartments in Lagos under ₦600,000:**
```
GET /api/listings/search?location=Lagos&propertyType=2-bedroom&maxPrice=600000
```

**Get all conversations with unread messages:**
```
GET /api/chat/conversations
(Filter client-side where unread > 0)
```

**Get chat history with specific user:**
```
GET /api/chat/{user_id}
(Returns all messages sorted by timestamp)
```

**Create listing with images:**
```javascript
// Step 1: Upload images
POST /api/upload → Returns image URLs

// Step 2: Create listing with those URLs
POST /api/listings with images array
```

---

## 📞 Support

For issues:
1. Check response status code
2. Check response message
3. Verify authentication token
4. Check request body format
5. Review backend console logs
