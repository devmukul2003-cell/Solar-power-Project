# Login Issue - Complete Troubleshooting Guide

## Issues Fixed

### 1. Authentication Check Timing
- **Problem**: Dashboard was checking for auth token at script load time (before DOM ready)
- **Fix**: Moved authentication check inside `loadCurrentUser()` function

### 2. User Data Reference Error
- **Problem**: Code referenced `userData.userId` which doesn't exist
- **Fix**: Changed to `currentUser.email` or `currentUser.name`

### 3. Monitor Initialization
- **Problem**: Monitors were being initialized with undefined user data
- **Fix**: Added null checks and use `currentUser.userId || currentUser.email`

### 4. Welcome Notification Timing
- **Problem**: Notification tried to access user before it was loaded
- **Fix**: Added null check and increased delay to 1500ms

## Testing Steps

### Step 1: Verify Backend is Running

```bash
# Terminal 1 - MongoDB
mongod --dbpath C:\data\db

# Terminal 2 - Backend Server
cd backend
npm run dev
```

You should see:
```
✅ MongoDB Connected Successfully
🚀 Server running on port 5000
```

### Step 2: Test Connection

Open `test-connection.html` in your browser and click through the tests:

1. **Test Backend** - Should show "Backend OK"
2. **Test Login** - Should show token and user data
3. **Get Current User** - Should show full user object

### Step 3: Test Login Flow

1. Open `index.html`
2. Enter credentials:
   - Email: `demo@energy.com`
   - Password: `demo123`
3. Click "Sign In"
4. Watch browser console for logs:
   ```
   Login response: {success: true, token: "...", user: {...}}
   Login successful! Redirecting...
   ```
5. Should redirect to `enhanced-smart-dashboard.html`

### Step 4: Verify Dashboard Loads

After redirect, check console for:
```
User loaded: demo@energy.com
Initializing monitors for user: demo@energy.com
✅ All monitors initialized successfully
```

## Common Issues & Solutions

### Issue 1: "Cannot connect to server"
**Cause**: Backend not running
**Solution**: 
```bash
cd backend
npm run dev
```

### Issue 2: "Invalid credentials"
**Cause**: Wrong email/password or user doesn't exist
**Solution**: 
- Use demo account: `demo@energy.com` / `demo123`
- Or run seed script: `cd backend && node seed.js`

### Issue 3: "No auth token"
**Cause**: Token not saved to localStorage
**Solution**: 
- Check browser console for errors
- Clear localStorage: `localStorage.clear()`
- Try login again

### Issue 4: Dashboard shows blank page
**Cause**: JavaScript error during initialization
**Solution**:
- Open browser DevTools (F12)
- Check Console tab for errors
- Check Network tab for failed API calls

### Issue 5: "API not loaded"
**Cause**: `api.js` script not loaded before `auth.js`
**Solution**: Verify script order in HTML:
```html
<script src="api.js"></script>
<script src="userData.js"></script>
<script src="auth.js"></script>
```

## Debug Tools

### 1. Browser Console
Press F12 and check Console tab for:
- Login response
- User loaded message
- Monitor initialization
- Any error messages

### 2. Network Tab
Check Network tab for:
- POST `/api/auth/login` - Should return 200 with token
- GET `/api/auth/me` - Should return 200 with user data

### 3. Application Tab
Check Application > Local Storage:
- `authToken` - Should contain JWT token
- `currentUser` - Should contain user object

### 4. Test Tools
Use provided test files:
- `test-connection.html` - Complete connection test
- `login-debug.html` - Step-by-step login debug

## Files Modified

1. `enhanced-dashboard.js`
   - Moved auth check into `loadCurrentUser()`
   - Added null checks for `currentUser`
   - Fixed user data references
   - Added better error logging

2. `auth.js`
   - Already had proper error handling
   - No changes needed

3. `api.js`
   - Already working correctly
   - No changes needed

## Expected Flow

1. User opens `index.html`
2. User enters credentials and clicks "Sign In"
3. `auth.js` calls `api.login(email, password)`
4. Backend validates credentials and returns JWT token
5. Token saved to `localStorage.authToken`
6. User data saved to `localStorage.currentUser`
7. Redirect to `enhanced-smart-dashboard.html` after 500ms
8. Dashboard loads and checks for token
9. If token exists, calls `api.getCurrentUser()`
10. Backend validates token and returns user data
11. Dashboard initializes monitors with user data
12. Dashboard displays user info and starts real-time updates

## Next Steps

1. Open `test-connection.html` and run all tests
2. If all tests pass, try logging in via `index.html`
3. If login works but dashboard doesn't load, check browser console
4. If you see any errors, share them for further debugging

## Quick Fix Commands

```bash
# Restart everything
cd backend
npm run dev

# In another terminal
# Open test-connection.html in browser
# Run all tests
# Then try login flow
```

## Success Indicators

✅ Backend health check passes
✅ Login returns token and user data
✅ Token saved to localStorage
✅ Dashboard loads without errors
✅ User info displays correctly
✅ Real-time data starts updating
✅ Charts render properly

If all indicators are ✅, the system is working correctly!
