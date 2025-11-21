# Housing App - Testing Guide

## Issue Fixed: Message Delivery Not Working

### Problem
Messages sent by tenants to landlords were not being stored or retrieved properly, causing conversations to not appear in either user's message list.

### Root Cause
Inconsistency in how user IDs were handled in the backend:
- `sendMessage` endpoint was using `req.user.id` (string representation)
- `getConversations` endpoint was using `req.user._id` (ObjectId)
- `getChatHistory` endpoint was using `req.user.id` (string representation)

When MongoDB stored the message with `senderId: "string-id"` but queried with `senderId: ObjectId`, no matches were found.

### Solution Applied
Updated `backend/controllers/chatController.js` to consistently use `req.user._id` across all three functions:
- `getChatHistory` - Changed from `req.user.id` to `req.user._id`
- `sendMessage` - Changed from `req.user.id` to `req.user._id`
- `getConversations` - Already using `req.user._id`

## How to Test

### 1. Prerequisites
- Backend running on `http://localhost:5000`
- Frontend running on `http://localhost:5174`
- MongoDB Atlas connection active
- Two test accounts: one Landlord, one Tenant

### 2. Test Message Flow

#### Step 1: Create Test Accounts (if needed)
1. Register a landlord account with:
   - Name: "Test Landlord"
   - Email: "landlord@test.com"
   - Role: "landlord"
   - Password: "password123"

2. Register a tenant account with:
   - Name: "Test Tenant"
   - Email: "tenant@test.com"
   - Role: "tenant"
   - Password: "password123"

#### Step 2: Landlord Creates a Listing
1. Log in as landlord
2. Click "Create Listing" in navbar
3. Fill in property details:
   - Title: "Test Property"
   - Description: "A test property"
   - Location: "Test City"
   - Price: "1000"
   - Property Type: "Apartment"
   - Occupancy: "1"
4. Click "Create Listing"
5. Verify listing appears in dashboard

#### Step 3: Tenant Messages Landlord from Listing Detail
1. Log out (clear localStorage)
2. Log in as tenant
3. Go to "Explore Listings" page
4. Click on the test property
5. Scroll down to "Message Landlord" section
6. Type a test message: "Is this property still available?"
7. Click "Send"
8. **Verify:**
   - Message appears in the tenant's local UI
   - No console errors appear
   - API call to `/api/messages` returns status 201

#### Step 4: Verify Message in Tenant's Messages Tab
1. Click "Messages" in navbar (or "Your Messages" on mobile)
2. **Verify:**
   - Conversation appears in the conversation list
   - Shows landlord name
   - Shows the message you sent
   - Timestamp is recent

#### Step 5: Verify Message in Landlord's Messages Tab
1. Log out
2. Log in as landlord
3. Click "Messages" in navbar
4. **Verify:**
   - Conversation appears with tenant's name
   - Shows the message you sent
   - Timestamp matches

#### Step 6: Landlord Replies to Message
1. Click on the tenant's conversation
2. Type a reply: "Yes, it's available!"
3. Click "Send"
4. **Verify:**
   - Message appears in landlord's chat window
   - Conversation list updates with new timestamp

#### Step 7: Verify Reply in Tenant's Messages
1. Log out
2. Log in as tenant
3. Go to Messages
4. Click on landlord's conversation
5. **Verify:**
   - Landlord's reply appears below tenant's message
   - Messages are in correct order by timestamp
   - No duplicate messages

### 3. Backend Verification (MongoDB Atlas)

To verify messages are being saved correctly in the database:

1. Go to MongoDB Atlas: https://cloud.mongodb.com
2. Navigate to your Housing App cluster
3. Go to Collections
4. Find the "chats" collection
5. **Verify:**
   - Documents have been created for each message
   - Each document has:
     - `senderId`: ObjectId (NOT string)
     - `receiverId`: ObjectId (NOT string)
     - `message`: String content
     - `timestamp`: Date
     - `read`: Boolean (default false)

Example document structure:
```json
{
  "_id": ObjectId("..."),
  "senderId": ObjectId("507f1f77bcf86cd799439011"),
  "receiverId": ObjectId("507f1f77bcf86cd799439012"),
  "message": "Is this property still available?",
  "timestamp": ISODate("2024-01-15T10:30:00.000Z"),
  "read": false
}
```

### 4. API Endpoint Testing (using curl or Postman)

#### Get Conversations
```bash
curl -X GET http://localhost:5000/api/messages/conversations \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

Expected response:
```json
{
  "success": true,
  "conversations": [
    {
      "userId": ObjectId("..."),
      "userName": "Test Landlord",
      "userEmail": "landlord@test.com",
      "lastMessage": "Is this property still available?",
      "lastTimestamp": "2024-01-15T10:30:00.000Z",
      "unread": 0
    }
  ]
}
```

#### Get Messages with Specific User
```bash
curl -X GET http://localhost:5000/api/messages/USER_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

Expected response:
```json
{
  "success": true,
  "messages": [
    {
      "_id": ObjectId("..."),
      "senderId": { "_id": ObjectId("..."), "name": "Test Tenant" },
      "receiverId": { "_id": ObjectId("..."), "name": "Test Landlord" },
      "message": "Is this property still available?",
      "timestamp": "2024-01-15T10:30:00.000Z",
      "read": false
    }
  ]
}
```

### 5. Real-time Testing (Socket.io)

The app uses Socket.io for real-time message updates. To verify:

1. Open browser DevTools (F12)
2. Go to Network tab
3. Filter by "WS" (WebSocket)
4. You should see a socket connection to `localhost:5000`
5. Send a message
6. In the Console, you should see Socket.io emit/receive events

### 6. Troubleshooting

#### Messages not appearing in conversation list
- Check browser console for errors
- Verify MongoDB connection is active (check server logs)
- Verify JWT token in localStorage is valid
- Make sure both users are using same environment (localhost or production)

#### Messages appear for sender but not receiver
- Check backend logs for errors in getConversations endpoint
- Verify receiverId matches the recipient's MongoDB _id exactly
- Check if messages are actually in the database

#### 404 errors on message endpoints
- Verify server.js has both `/api/messages` and `/api/chat` routes
- Clear browser cache and rebuild frontend
- Check that auth middleware is properly applied

#### ObjectId mismatch errors
- This should be fixed by the code changes
- If still occurring, verify all senderId and receiverId fields are ObjectIds in database
- Check that mongoose is properly installed and Chat model has proper field types

## Files Modified

1. **backend/controllers/chatController.js**
   - Fixed `getChatHistory`: `req.user.id` → `req.user._id`
   - Fixed `sendMessage`: `req.user.id` → `req.user._id`
   - `getConversations`: Already correct

## Verification Checklist

- [ ] Backend build has no errors
- [ ] Frontend build has no errors
- [ ] Can log in as landlord
- [ ] Can log in as tenant
- [ ] Landlord can create listing
- [ ] Tenant can see listing in Explore Listings
- [ ] Tenant can message landlord from listing detail
- [ ] Message appears in tenant's Messages tab
- [ ] Message appears in landlord's Messages tab
- [ ] Landlord can reply
- [ ] Reply appears in tenant's conversation
- [ ] No duplicate messages
- [ ] Messages are sorted by timestamp
- [ ] Unread badge appears on new messages
- [ ] Messages are stored in MongoDB
- [ ] No ObjectId/string mismatch errors

## Next Steps

If message delivery is still not working:

1. Check backend logs:
   ```bash
   cd backend
   npm start
   ```

2. Look for any error messages in the console

3. Check MongoDB Atlas logs for connection issues

4. Verify environment variables are set:
   - `MONGODB_URI`: Connection string to MongoDB Atlas
   - `JWT_SECRET`: Secret key for JWT signing
   - `PORT`: 5000 (or your backend port)

5. Clear all caches:
   ```bash
   # Frontend
   cd Frontend
   rm -r node_modules dist
   npm install
   npm run build
   ```

6. Restart both frontend and backend servers

## References

- MongoDB ObjectId vs String: https://docs.mongodb.com/manual/reference/method/ObjectId/
- Mongoose populate: https://mongoosejs.com/docs/populate.html
- Socket.io real-time: https://socket.io/docs/
