# Authentication Flows - Complete Documentation

## 🎯 Three Core Flows

This document details the exact behavior of Login, Signup, and Logout flows with session status management.

---

## 1️⃣ SIGNUP Flow

### User Action
User fills signup form and clicks "Create Account"

### System Process
```
1. Validate User ID (email) format
   ↓
2. Check if User ID already exists
   ↓
3. Validate password (minimum 6 characters)
   ↓
4. Create new user record:
   {
     "userId": "user@example.com",
     "password": "password123",
     "name": "John Doe",
     "location": "Mumbai",
     "solarCapacity": 5,
     "accountStatus": "active",
     "signupDate": "2024-02-27T14:30:00.000Z",
     "lastLogin": null,
     "sessionStatus": "logged_out"
   }
   ↓
5. Save to localStorage
   ↓
6. Show success message
   ↓
7. Redirect to login page
```

### Key Points
- ✅ `accountStatus` is set to `"active"`
- ✅ `signupDate` is recorded with current timestamp
- ✅ `lastLogin` is `null` (no login yet)
- ✅ `sessionStatus` is `"logged_out"`
- ✅ **NO auto-login** - user must login separately
- ✅ Redirect to login page after signup

### Code Example
```javascript
const result = authSystem.signup(
    'user@example.com',
    'password123',
    'John Doe',
    'Mumbai',
    5
);

if (result.success) {
    // User created but NOT logged in
    console.log('Session Status:', result.user.sessionStatus); // "logged_out"
    console.log('Last Login:', result.user.lastLogin); // null
    
    // Redirect to login page
    window.location.href = 'login.html';
}
```

### Response
```json
{
  "success": true,
  "message": "Account created successfully. Please login.",
  "code": "SIGNUP_SUCCESS",
  "user": {
    "userId": "user@example.com",
    "name": "John Doe",
    "accountStatus": "active",
    "signupDate": "2024-02-27T14:30:00.000Z",
    "lastLogin": null,
    "sessionStatus": "logged_out"
  },
  "redirectTo": "login"
}
```

---

## 2️⃣ LOGIN Flow

### User Action
User enters credentials and clicks "Login"

### System Process
```
1. Find user by User ID
   ↓
2. Check if user exists
   ↓
3. Verify accountStatus is "active"
   ↓
4. Verify password matches
   ↓
5. Update user record:
   - lastLogin: current timestamp
   - sessionStatus: "logged_in"
   ↓
6. Create session object
   ↓
7. Save session to localStorage
   ↓
8. Redirect to dashboard
```

### Key Points
- ✅ `lastLogin` is **ONLY** updated on successful login
- ✅ `sessionStatus` changes from `"logged_out"` to `"logged_in"`
- ✅ Session object is created and stored
- ✅ User data is updated in dataset
- ✅ Redirect to dashboard after login

### Code Example
```javascript
const result = authSystem.login('user@example.com', 'password123');

if (result.success) {
    console.log('Session Status:', result.user.sessionStatus); // "logged_in"
    console.log('Last Login:', result.user.lastLogin); // "2024-02-27T15:45:00.000Z"
    console.log('Session:', result.session);
    
    // Redirect to dashboard
    window.location.href = 'dashboard.html';
}
```

### Response
```json
{
  "success": true,
  "message": "Login successful",
  "code": "LOGIN_SUCCESS",
  "user": {
    "userId": "user@example.com",
    "name": "John Doe",
    "accountStatus": "active",
    "signupDate": "2024-02-27T14:30:00.000Z",
    "lastLogin": "2024-02-27T15:45:00.000Z",
    "sessionStatus": "logged_in"
  },
  "session": {
    "userId": "user@example.com",
    "name": "John Doe",
    "sessionStatus": "logged_in",
    "loginTime": "2024-02-27T15:45:00.000Z"
  }
}
```

### Dataset Changes
**Before Login:**
```json
{
  "userId": "user@example.com",
  "lastLogin": null,
  "sessionStatus": "logged_out"
}
```

**After Login:**
```json
{
  "userId": "user@example.com",
  "lastLogin": "2024-02-27T15:45:00.000Z",
  "sessionStatus": "logged_in"
}
```

---

## 3️⃣ LOGOUT Flow

### User Action
User clicks "Logout" button

### System Process
```
1. Get current session
   ↓
2. Find user by User ID
   ↓
3. Update user record:
   - sessionStatus: "logged_out"
   ↓
4. Clear session from localStorage
   ↓
5. Show logout message
   ↓
6. Redirect to login page
```

### Key Points
- ✅ `sessionStatus` changes from `"logged_in"` to `"logged_out"`
- ✅ `lastLogin` timestamp is **NOT** changed (preserves last login time)
- ✅ Session is cleared from localStorage
- ✅ User data is updated in dataset
- ✅ Redirect to login page after logout

### Code Example
```javascript
const result = authSystem.logout();

if (result.success) {
    console.log('Logged out successfully');
    
    // Redirect to login page
    window.location.href = 'login.html';
}
```

### Response
```json
{
  "success": true,
  "message": "Logged out successfully",
  "code": "LOGOUT_SUCCESS"
}
```

### Dataset Changes
**Before Logout:**
```json
{
  "userId": "user@example.com",
  "lastLogin": "2024-02-27T15:45:00.000Z",
  "sessionStatus": "logged_in"
}
```

**After Logout:**
```json
{
  "userId": "user@example.com",
  "lastLogin": "2024-02-27T15:45:00.000Z",
  "sessionStatus": "logged_out"
}
```

---

## 📊 Complete User Lifecycle

### New User Journey
```
1. SIGNUP
   ↓
   User created with:
   - accountStatus: "active"
   - signupDate: timestamp
   - lastLogin: null
   - sessionStatus: "logged_out"
   ↓
   Redirect to login page
   ↓
2. LOGIN
   ↓
   User updated with:
   - lastLogin: timestamp (FIRST TIME)
   - sessionStatus: "logged_in"
   ↓
   Session created
   ↓
   Redirect to dashboard
   ↓
3. LOGOUT
   ↓
   User updated with:
   - sessionStatus: "logged_out"
   - lastLogin: unchanged
   ↓
   Session cleared
   ↓
   Redirect to login page
```

### Returning User Journey
```
1. LOGIN
   ↓
   User updated with:
   - lastLogin: new timestamp
   - sessionStatus: "logged_in"
   ↓
   Session created
   ↓
   Redirect to dashboard
   ↓
2. LOGOUT
   ↓
   User updated with:
   - sessionStatus: "logged_out"
   - lastLogin: unchanged
   ↓
   Session cleared
   ↓
   Redirect to login page
```

---

## 🔍 Field Update Matrix

| Field | Signup | Login | Logout |
|-------|--------|-------|--------|
| `userId` | ✅ Set | ❌ No change | ❌ No change |
| `password` | ✅ Set | ❌ No change | ❌ No change |
| `name` | ✅ Set | ❌ No change | ❌ No change |
| `location` | ✅ Set | ❌ No change | ❌ No change |
| `solarCapacity` | ✅ Set | ❌ No change | ❌ No change |
| `accountStatus` | ✅ Set to "active" | ❌ No change | ❌ No change |
| `signupDate` | ✅ Set timestamp | ❌ No change | ❌ No change |
| `lastLogin` | ✅ Set to null | ✅ Update timestamp | ❌ No change |
| `sessionStatus` | ✅ Set to "logged_out" | ✅ Set to "logged_in" | ✅ Set to "logged_out" |

---

## 📝 Session Status States

### "logged_out"
- User has not logged in yet (after signup)
- User has logged out
- No active session exists
- Cannot access protected pages

### "logged_in"
- User has successfully authenticated
- Active session exists
- Can access protected pages
- Session data available

---

## 🎯 Important Rules

### Rule 1: No Auto-Login After Signup
```javascript
// ❌ WRONG - Do not auto-login after signup
authSystem.signup(userId, password);
authSystem.login(userId, password); // NO!

// ✅ CORRECT - User must login separately
authSystem.signup(userId, password);
// Redirect to login page
window.location.href = 'login.html';
```

### Rule 2: lastLogin Only Updates on Login
```javascript
// ✅ lastLogin is updated
authSystem.login(userId, password);

// ❌ lastLogin is NOT updated
authSystem.signup(userId, password);
authSystem.logout();
```

### Rule 3: Session Status Reflects Current State
```javascript
// After signup
user.sessionStatus === "logged_out" // true

// After login
user.sessionStatus === "logged_in" // true

// After logout
user.sessionStatus === "logged_out" // true
```

---

## 🔄 Complete Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        START                                 │
└────────────────────────┬────────────────────────────────────┘
                         │
                    ┌────▼────┐
                    │  User   │
                    │ Action? │
                    └────┬────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
   ┌────▼────┐      ┌────▼────┐     ┌────▼────┐
   │ SIGNUP  │      │  LOGIN  │     │ LOGOUT  │
   └────┬────┘      └────┬────┘     └────┬────┘
        │                │                │
        │                │                │
   ┌────▼────────────────────────────┐   │
   │ Create User:                    │   │
   │ - accountStatus: "active"       │   │
   │ - signupDate: timestamp         │   │
   │ - lastLogin: null               │   │
   │ - sessionStatus: "logged_out"   │   │
   └────┬────────────────────────────┘   │
        │                │                │
        │           ┌────▼────────────────────────────┐
        │           │ Update User:                    │
        │           │ - lastLogin: timestamp          │
        │           │ - sessionStatus: "logged_in"    │
        │           │ Create Session                  │
        │           └────┬────────────────────────────┘
        │                │                │
        │                │           ┌────▼────────────────────────────┐
        │                │           │ Update User:                    │
        │                │           │ - sessionStatus: "logged_out"   │
        │                │           │ Clear Session                   │
        │                │           └────┬────────────────────────────┘
        │                │                │
   ┌────▼────┐      ┌────▼────┐     ┌────▼────┐
   │ Redirect│      │ Redirect│     │ Redirect│
   │  Login  │      │Dashboard│     │  Login  │
   └─────────┘      └─────────┘     └─────────┘
```

---

## 📊 Sample Dataset Evolution

### After Signup
```json
{
  "users": [
    {
      "userId": "john@example.com",
      "password": "secure123",
      "name": "John Doe",
      "location": "Mumbai",
      "solarCapacity": 5,
      "accountStatus": "active",
      "signupDate": "2024-02-27T14:30:00.000Z",
      "lastLogin": null,
      "sessionStatus": "logged_out"
    }
  ],
  "currentSession": null
}
```

### After Login
```json
{
  "users": [
    {
      "userId": "john@example.com",
      "password": "secure123",
      "name": "John Doe",
      "location": "Mumbai",
      "solarCapacity": 5,
      "accountStatus": "active",
      "signupDate": "2024-02-27T14:30:00.000Z",
      "lastLogin": "2024-02-27T15:45:00.000Z",
      "sessionStatus": "logged_in"
    }
  ],
  "currentSession": {
    "userId": "john@example.com",
    "name": "John Doe",
    "sessionStatus": "logged_in",
    "loginTime": "2024-02-27T15:45:00.000Z"
  }
}
```

### After Logout
```json
{
  "users": [
    {
      "userId": "john@example.com",
      "password": "secure123",
      "name": "John Doe",
      "location": "Mumbai",
      "solarCapacity": 5,
      "accountStatus": "active",
      "signupDate": "2024-02-27T14:30:00.000Z",
      "lastLogin": "2024-02-27T15:45:00.000Z",
      "sessionStatus": "logged_out"
    }
  ],
  "currentSession": null
}
```

---

## ✅ Summary

### SIGNUP
- ✅ Creates user with `accountStatus: "active"`
- ✅ Sets `signupDate` to current timestamp
- ✅ Sets `lastLogin` to `null`
- ✅ Sets `sessionStatus` to `"logged_out"`
- ✅ **NO auto-login**
- ✅ Redirects to login page

### LOGIN
- ✅ Updates `lastLogin` to current timestamp
- ✅ Changes `sessionStatus` to `"logged_in"`
- ✅ Creates session object
- ✅ Redirects to dashboard

### LOGOUT
- ✅ Changes `sessionStatus` to `"logged_out"`
- ✅ Preserves `lastLogin` (no change)
- ✅ Clears session
- ✅ Redirects to login page

**This ensures proper authentication flow with clear session management!** 🔐
