# Backend Setup Checklist

## Prerequisites
- [ ] Node.js v14+ installed
- [ ] MongoDB account (local or Atlas)
- [ ] Cloudinary account
- [ ] Gmail account with app password enabled

## Installation

- [ ] Navigate to backend folder: `cd backend`
- [ ] Install dependencies: `npm install`
- [ ] Create `.env` file from `.env.example`

## Environment Configuration

### MongoDB
- [ ] Get connection string from MongoDB Atlas or local instance
- [ ] Add to `MONGODB_URI` in `.env`
- [ ] Test connection

### JWT
- [ ] Generate random secret: Use [randomkeygen.com](https://randomkeygen.com)
- [ ] Add to `JWT_SECRET` (min 32 characters)
- [ ] Keep this secret secure!

### Cloudinary
- [ ] Create free account at [cloudinary.com](https://cloudinary.com)
- [ ] Copy Cloud Name from dashboard
- [ ] Generate and copy API Key
- [ ] Generate and copy API Secret
- [ ] Add all three to `.env`

### Email (Gmail)
- [ ] Enable 2-Factor Authentication on Gmail account
- [ ] Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
- [ ] Select "Mail" and "Windows/Mac"
- [ ] Copy generated password
- [ ] Add Gmail to `EMAIL_USER`
- [ ] Add password to `EMAIL_PASS`

### Frontend URL
- [ ] Set `FRONTEND_URL=http://localhost:5173` for development
- [ ] Update for production deployment

## Testing

### Start Server
```bash
npm run dev
```

You should see:
```
✅ Backend server running on port 5000
🌐 Frontend URL: http://localhost:5173
💾 Environment: development
```

### Test Health Endpoint
```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "success": true,
  "message": "Backend server is running",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Test Authentication
```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "role": "tenant",
    "phone": "+234801234567",
    "location": "Lagos"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

## Verification

- [ ] Health endpoint responds
- [ ] User registration successful
- [ ] User login returns token
- [ ] JWT token is valid
- [ ] MongoDB connection works
- [ ] Email notifications sending
- [ ] Image uploads to Cloudinary
- [ ] Socket.io connection works

## Troubleshooting

| Issue | Solution |
|-------|----------|
| MongoDB connection failed | Check MONGODB_URI format and IP whitelist in Atlas |
| Cloudinary upload fails | Verify Cloud Name, API Key, and API Secret |
| Email not sending | Check Gmail app password and SMTP settings |
| JWT verification fails | Ensure JWT_SECRET matches between registration and login |
| CORS errors | Verify FRONTEND_URL matches frontend domain |
| Socket.io not connecting | Check FRONTEND_URL and Socket.io CORS settings |

## Next Steps

1. Start backend: `npm run dev`
2. Install frontend dependencies: `cd ../Frontend && npm install`
3. Create `.env.local` in Frontend folder
4. Configure frontend environment variables
5. Start frontend: `npm run dev`
6. Test full stack integration

## Support

For detailed documentation, see `README.md` in this directory.
