# Debug Login Redirect Issue

## Problem
Login appears to work but immediately redirects back to login page.

## Possible Causes

1. **Token not being saved** - localStorage.setItem() fails
2. **Token saved but cleared immediately** - Something clears it
3. **Dashboard checks token before it's saved** - Timing issue
4. **Token saved but not found on dashboard** - Different domain/path
5. **API error on dashboard** - getCurrentUser() fails

## Debug Steps

### Step 1: Use Simple Login Test

Open `login-test-simple.html` in your browser:

1. Click "Login & Redirect"
2. Watch the console log carefully
3. Look for these messages:
   - ✅ "Token in localStorage: YES"
   - ✅ "User in localStorage: YES"
   - ✅ "Redirecting NOW"

**If token shows NO:**
- Problem is in api.js setToken() method
- Check browser console for errors
- Try manually: `localStorage.setItem('test', 'value')` in console

**If token shows YES but redirect fails:**
- Problem is in the redirect or dashboard
- Continue to Step 2

### Step 2: Check Browser Console

Open browser DevTools (F12) and watch Console tab during login:

**Expected flow:**
```
API: Calling login endpoint...
API: Login response received: true
API: Setting token...
API: Token set successfully
API: Token in localStorage: YES
Login response: {success: true, ...}
Token received: YES
Token in localStorage: YES
Token verified in localStorage
Login successful! Redirecting...
Redirecting to dashboard...
```

**If you see:**
- "Token in localStorage: NO" → Token not being saved
- "API Error" → Backend connection issue
- "Invalid credentials" → Wrong email/password

### Step 3: Check Dashboard Console

After redirect, immediately open Console (F12):

**Expected flow:**
```
=== Dashboard Loading ===
Token exists: YES
Token value: eyJ...
DOM already ready, waiting 100ms before checking auth...
Calling api.getCurrentUser()...
getCurrentUser response: {success: true, ...}
✅ User loaded successfully: demo@energy.com
```

**If you see:**
- "Token exists: NO" → Token was cleared or not saved
- "Error loading user" → API call failed
- "No auth token found, redirecting to login" → Token missing

### Step 4: Check localStorage Manually

In browser console, type:
```javascript
localStorage.getItem('authToken')
```

**Should return:** A long JWT token string starting with "eyJ"
**If returns:** null → Token not saved

Also check:
```javascript
localStorage.getItem('currentUser')
```

**Should return:** JSON string with user data

### Step 5: Check Network Tab

Open DevTools → Network tab:

1. Login and watch for:
   - `POST /api/auth/login` → Should return 200 with token
   
2. After redirect, watch for:
   - `GET /api/auth/me` → Should return 200 with user data
   
**If /api/auth/me returns 401:**
- Token is invalid or not being sent
- Check request headers for "Authorization: Bearer ..."

## Common Issues & Fixes

### Issue 1: Token Not Saved
**Symptoms:** Console shows "Token in localStorage: NO"

**Fix:**
```javascript
// In browser console, test localStorage:
localStorage.setItem('test', 'value');
localStorage.getItem('test'); // Should return 'value'
```

If this fails, localStorage might be disabled or in private mode.

### Issue 2: Token Cleared Immediately
**Symptoms:** Token saved but gone after redirect

**Possible causes:**
- Different domain (file:// vs http://)
- Browser privacy settings
- Another script clearing storage

**Fix:** Make sure you're accessing via http://localhost or http://127.0.0.1

### Issue 3: Dashboard Checks Too Early
**Symptoms:** Dashboard redirects before token check completes

**Fix:** Already applied - added 100ms delay before checking

### Issue 4: API Call Fails
**Symptoms:** "Error loading user" in dashboard console

**Fix:**
- Check backend is running: `cd backend && npm run dev`
- Check MongoDB is running
- Check network tab for failed requests

### Issue 5: CORS Error
**Symptoms:** "CORS policy" error in console

**Fix:** Backend .env should have:
```
CORS_ORIGIN=*
```

## Testing Procedure

1. **Clear everything:**
   ```javascript
   localStorage.clear();
   ```

2. **Open login-test-simple.html**

3. **Click "Login & Redirect"**

4. **Watch console log carefully**

5. **Note where it fails:**
   - Before "Token in localStorage: YES" → Token save issue
   - After "Redirecting NOW" → Dashboard issue
   - On dashboard load → Auth check issue

6. **Share the console output** from both pages

## Quick Fixes to Try

### Fix 1: Manual Token Test
```javascript
// In browser console on index.html:
localStorage.setItem('authToken', 'test-token');
localStorage.getItem('authToken'); // Should return 'test-token'
```

### Fix 2: Disable Browser Extensions
Some extensions block localStorage. Try in Incognito mode.

### Fix 3: Use Different Browser
Test in Chrome, Firefox, or Edge to rule out browser issues.

### Fix 4: Check File Protocol
If URL shows `file:///`, you need to use a local server:
```bash
# Use Python
python -m http.server 8000

# Or Node.js
npx http-server
```

Then access via `http://localhost:8000`

## Files with Debug Logging

All files now have extensive console.log() statements:

- `auth.js` - Login flow logging
- `api.js` - API call logging  
- `enhanced-dashboard.js` - Dashboard loading logging
- `login-test-simple.html` - Step-by-step test

## Next Steps

1. Open `login-test-simple.html`
2. Click login button
3. Copy ALL console output
4. Share the output to identify exact failure point

The detailed logging will show exactly where the process breaks!
