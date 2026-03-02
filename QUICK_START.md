# Smart Energy Dashboard - Quick Start Guide

## 🚀 Start the System

### 1. Start MongoDB (Terminal 1)
```bash
mongod --dbpath C:\data\db
```
Wait for: `waiting for connections on port 27017`

### 2. Start Backend (Terminal 2)
```bash
cd backend
npm run dev
```
Wait for:
```
✅ MongoDB Connected Successfully
🚀 Server running on port 5000
```

### 3. Open Dashboard
Open `index.html` in your browser

## 🔐 Login

**Demo Account:**
- Email: `demo@energy.com`
- Password: `demo123`

## ✅ Verify Everything Works

### Option 1: Quick Test
1. Open `test-connection.html`
2. Click all test buttons
3. All should show ✅

### Option 2: Full Test
1. Login via `index.html`
2. Should redirect to dashboard
3. Should see your user info
4. Should see real-time data updating

## 🐛 If Something Goes Wrong

### Backend Not Starting?
```bash
# Check if MongoDB is running
# Check if port 5000 is available
netstat -ano | findstr :5000
```

### Login Not Working?
1. Open browser DevTools (F12)
2. Check Console for errors
3. Check Network tab for failed requests
4. Use `test-connection.html` to diagnose

### Dashboard Not Loading?
1. Check browser console (F12)
2. Look for error messages
3. Verify token in Application > Local Storage
4. Try clearing storage: `localStorage.clear()`

## 📁 Key Files

### Frontend
- `index.html` - Login page
- `enhanced-smart-dashboard.html` - Main dashboard
- `auth.js` - Authentication logic
- `enhanced-dashboard.js` - Dashboard logic
- `api.js` - API service layer

### Backend
- `backend/server.js` - Express server
- `backend/routes/auth.js` - Authentication routes
- `backend/models/User.js` - User model

### Testing
- `test-connection.html` - Connection tester
- `login-debug.html` - Login debugger

### Documentation
- `LOGIN_FIX_SUMMARY.md` - What was fixed
- `LOGIN_TROUBLESHOOTING.md` - Detailed troubleshooting
- `QUICK_START.md` - This file

## 🎯 What's Working

✅ MongoDB backend with 7 models
✅ JWT authentication
✅ 42 API endpoints
✅ Real-time data synchronization
✅ User preferences
✅ Incentive points system
✅ Appliance monitoring
✅ Solar panel health tracking
✅ Multi-language support (English/Hindi)
✅ Theme switching (Light/Dark)

## 📊 System Architecture

```
Frontend (Browser)
    ↓
API Service (api.js)
    ↓
Backend (Express on :5000)
    ↓
MongoDB (on :27017)
```

## 🔄 Data Flow

1. User logs in → JWT token generated
2. Token stored in localStorage
3. Dashboard loads → Fetches user data
4. Real-time monitors start
5. Data syncs to MongoDB periodically:
   - Energy data: every 100 seconds
   - Appliances: every 25 seconds
   - Solar panels: every 45 seconds

## 💡 Tips

- Keep both terminals running (MongoDB + Backend)
- Use demo account for testing
- Check browser console for debugging
- Backend logs show all API requests
- Use test tools for quick diagnostics

## 🆘 Need Help?

1. Check `LOGIN_TROUBLESHOOTING.md` for detailed help
2. Run `test-connection.html` to diagnose issues
3. Check backend terminal for error messages
4. Check browser console (F12) for frontend errors

---

**Everything is set up and working! Just start the servers and login.** 🎉
