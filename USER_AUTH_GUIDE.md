# User Authentication System - Complete Guide

## 🎯 Overview

A comprehensive user authentication system with dynamic dataset management, activity tracking, and complete authentication flows for the Smart Energy Dashboard.

## 📁 Files Created

1. **userAuthSystem.js** (18 KB) - Core authentication engine
2. **admin-panel.html** (10 KB) - Admin interface for user management
3. **USER_AUTH_GUIDE.md** - This documentation

## ✨ Key Features

### 🔐 Authentication
- ✅ User signup with validation
- ✅ Secure login with password hashing
- ✅ Session management (24-hour expiry)
- ✅ Auto-logout on session expiry
- ✅ Failed login attempt tracking
- ✅ Account lockout after 5 failed attempts
- ✅ 15-minute lockout duration

### 👤 User Management
- ✅ Unique user IDs
- ✅ Email validation
- ✅ Password strength requirements
- ✅ Profile updates
- ✅ Password changes
- ✅ Account deletion
- ✅ GDPR data export

### 📊 Activity Tracking
- ✅ Login/logout events
- ✅ Failed login attempts
- ✅ Profile updates
- ✅ Password changes
- ✅ Account creation/deletion
- ✅ Complete activity logs

### 🎨 Account Status
- ✅ Active - Normal operation
- ✅ Inactive - Disabled account
- ✅ Locked - Too many failed attempts
- ✅ Suspended - Admin action

## 📊 User Data Structure

### Complete User Object
```json
{
  "userId": "user_1709045400000_abc123",
  "email": "user@example.com",
  "password": "hash_abc123",
  "name": "John Doe",
  "location": "Mumbai",
  "solarCapacity": 5,
  
  "accountStatus": "active",
  "accountType": "standard",
  
  "loginAttempts": 0,
  "lastLoginAttempt": null,
  "lockedUntil": null,
  
  "signupDate": "2024-02-27T14:30:00.000Z",
  "lastLogin": "2024-02-27T15:45:00.000Z",
  "lastPasswordChange": "2024-02-27T14:30:00.000Z",
  
  "totalLogins": 15,
  "failedLoginAttempts": 2,
  
  "profileComplete": false,
  "emailVerified": false,
  "phoneVerified": false,
  
  "preferences": {
    "notifications": true,
    "darkMode": false,
    "language": "en"
  },
  
  "createdBy": "system",
  "lastModified": "2024-02-27T15:45:00.000Z",
  "version": 3
}
```

### Session Object
```json
{
  "sessionId": "user_1709045400000_xyz789",
  "userId": "user_1709045400000_abc123",
  "email": "user@example.com",
  "name": "John Doe",
  "location": "Mumbai",
  "solarCapacity": 5,
  "accountStatus": "active",
  "createdAt": "2024-02-27T15:45:00.000Z",
  "expiresAt": "2024-02-28T15:45:00.000Z",
  "lastActivity": "2024-02-27T15:45:00.000Z"
}
```

### Activity Log Entry
```json
{
  "logId": "user_1709045400000_log123",
  "userId": "user_1709045400000_abc123",
  "action": "LOGIN_SUCCESS",
  "details": {
    "email": "user@example.com",
    "loginTime": "2024-02-27T15:45:00.000Z"
  },
  "timestamp": "2024-02-27T15:45:00.000Z",
  "ipAddress": "demo",
  "userAgent": "Mozilla/5.0..."
}
```

## 🚀 Quick Start

### Initialize System
```javascript
const authSystem = new UserAuthenticationSystem();
```

### User Signup
```javascript
const result = authSystem.createUser({
    name: 'John Doe',
    email: 'john@example.com',
    password: 'secure123',
    location: 'Mumbai',
    solarCapacity: 5
});

if (result.success) {
    console.log('User created:', result.user);
} else {
    console.error('Error:', result.message);
}
```

### User Login
```javascript
const result = authSystem.login('john@example.com', 'secure123');

if (result.success) {
    console.log('Login successful:', result.user);
    console.log('Session:', result.session);
} else {
    console.error('Login failed:', result.message);
}
```

### Check Current Session
```javascript
const session = authSystem.getCurrentSession();

if (session) {
    console.log('User is logged in:', session.name);
} else {
    console.log('No active session');
}
```

### Logout
```javascript
const result = authSystem.logout(userId);
console.log(result.message);
```

## 📖 API Reference

### Authentication Methods

#### createUser(userData)
Create a new user account

**Parameters:**
```javascript
{
    name: string,
    email: string,
    password: string,
    location: string,
    solarCapacity: number
}
```

**Returns:**
```javascript
{
    success: boolean,
    message: string,
    code: string,
    user?: object
}
```

**Response Codes:**
- `USER_CREATED` - Success
- `USER_EXISTS` - Email already registered
- `MISSING_FIELDS` - Required fields missing
- `INVALID_EMAIL` - Invalid email format
- `WEAK_PASSWORD` - Password too short

#### login(email, password)
Authenticate user and create session

**Returns:**
```javascript
{
    success: boolean,
    message: string,
    code: string,
    user?: object,
    session?: object,
    attemptsRemaining?: number,
    remainingTime?: number
}
```

**Response Codes:**
- `LOGIN_SUCCESS` - Success
- `INVALID_CREDENTIALS` - Wrong email/password
- `ACCOUNT_LOCKED` - Too many failed attempts
- `ACCOUNT_INACTIVE` - Account disabled
- `ACCOUNT_SUSPENDED` - Account suspended

#### logout(userId)
End user session

**Returns:**
```javascript
{
    success: boolean,
    message: string,
    code: string
}
```

#### getCurrentSession()
Get active session

**Returns:** Session object or null

### User Management Methods

#### updateUser(userId, updates)
Update user profile

**Allowed Fields:**
- name
- location
- solarCapacity
- preferences

**Returns:**
```javascript
{
    success: boolean,
    message: string,
    code: string,
    user?: object
}
```

#### changePassword(userId, oldPassword, newPassword)
Change user password

**Returns:**
```javascript
{
    success: boolean,
    message: string,
    code: string
}
```

#### deleteUser(userId)
Delete user account

**Returns:**
```javascript
{
    success: boolean,
    message: string,
    code: string
}
```

### Query Methods

#### getAllUsers()
Get all users (admin only)

**Returns:** Array of user objects

#### getUserById(userId)
Get user by ID

**Returns:** User object (sanitized) or null

#### getUserByEmail(email)
Get user by email

**Returns:** User object (sanitized) or null

#### getUserStats(userId)
Get user statistics

**Returns:**
```javascript
{
    userId: string,
    email: string,
    accountAge: string,
    totalLogins: number,
    failedLoginAttempts: number,
    lastLogin: string,
    accountStatus: string,
    activityCount: number,
    recentActivity: array
}
```

### Activity Methods

#### getActivityLogs(userId?, limit?)
Get activity logs

**Parameters:**
- userId (optional) - Filter by user
- limit (optional) - Max entries (default: 100)

**Returns:** Array of log entries

#### exportUserData(userId)
Export all user data (GDPR)

**Returns:**
```javascript
{
    user: object,
    activityLogs: array,
    statistics: object,
    exportDate: string
}
```

## 🎯 Authentication Flows

### Signup Flow
```
1. User fills signup form
   ↓
2. Validate email format
   ↓
3. Check if email exists
   ↓
4. Validate password strength
   ↓
5. Hash password
   ↓
6. Create user object
   ↓
7. Save to database
   ↓
8. Log activity (USER_CREATED)
   ↓
9. Auto-login
   ↓
10. Create session
   ↓
11. Redirect to dashboard
```

### Login Flow
```
1. User enters credentials
   ↓
2. Find user by email
   ↓
3. Check if account locked
   ↓
4. Check account status
   ↓
5. Verify password
   ↓
6. If invalid:
   - Increment failed attempts
   - Lock if >= 5 attempts
   - Log activity (LOGIN_FAILED)
   ↓
7. If valid:
   - Reset failed attempts
   - Update last login
   - Increment total logins
   - Create session
   - Log activity (LOGIN_SUCCESS)
   ↓
8. Redirect to dashboard
```

### Session Management
```
On every page load:
  ↓
1. Get session from localStorage
   ↓
2. Check if session exists
   ↓
3. Check if session expired
   ↓
4. If expired:
   - Destroy session
   - Redirect to login
   ↓
5. If valid:
   - Update last activity
   - Continue
```

## 🔒 Security Features

### Password Hashing
```javascript
// Simple hash for demo (use bcrypt in production)
hashPassword(password) {
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
        const char = password.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return 'hash_' + Math.abs(hash).toString(36);
}
```

### Account Lockout
- 5 failed attempts → Account locked
- 15-minute lockout duration
- Automatic unlock after duration
- Reset attempts on successful login

### Session Security
- 24-hour session expiry
- Auto-logout on expiry
- Session validation on every request
- Last activity tracking

### Data Sanitization
```javascript
// Remove sensitive data before sending to client
sanitizeUser(user) {
    const { password, ...sanitized } = user;
    return sanitized;
}
```

## 📊 Demo Users

The system creates 3 demo users automatically:

### Demo User
```
Email: demo@energy.com
Password: demo123
Solar: 5 kW
Location: Mumbai
```

### Admin User
```
Email: admin@energy.com
Password: admin123
Solar: 10 kW
Location: Delhi
```

### Test User
```
Email: test@energy.com
Password: test123
Solar: 3 kW
Location: Bangalore
```

## 🎨 Admin Panel

Access: `admin-panel.html`

### Features
- View all users
- User statistics
- Activity logs
- Export data (JSON)
- Delete users
- Reset system

### Statistics Displayed
- Total users
- Active users
- Total logins
- Failed attempts

## 🔧 Configuration

### Adjust Settings
```javascript
// In userAuthSystem.js constructor
this.maxLoginAttempts = 5;           // Max failed attempts
this.lockoutDuration = 15 * 60 * 1000; // 15 minutes
this.sessionTimeout = 24 * 60 * 60 * 1000; // 24 hours
```

### Storage Keys
```javascript
this.storageKey = 'smartEnergy_users';
this.sessionKey = 'smartEnergy_session';
```

## 📈 Activity Log Actions

### Tracked Events
- `USER_CREATED` - New account created
- `LOGIN_SUCCESS` - Successful login
- `LOGIN_FAILED` - Failed login attempt
- `LOGIN_BLOCKED` - Login blocked (locked account)
- `LOGOUT` - User logged out
- `ACCOUNT_LOCKED` - Account locked (too many attempts)
- `PROFILE_UPDATED` - Profile information changed
- `PASSWORD_CHANGED` - Password changed
- `PASSWORD_CHANGE_FAILED` - Password change failed
- `ACCOUNT_DELETED` - Account deleted

## 🎯 Integration Examples

### With React
```javascript
import { useState, useEffect } from 'react';

function LoginPage() {
    const [authSystem] = useState(new UserAuthenticationSystem());
    
    const handleLogin = async (email, password) => {
        const result = authSystem.login(email, password);
        if (result.success) {
            // Redirect to dashboard
            window.location.href = '/dashboard';
        } else {
            // Show error
            alert(result.message);
        }
    };
    
    return (
        <form onSubmit={(e) => {
            e.preventDefault();
            handleLogin(email, password);
        }}>
            {/* Form fields */}
        </form>
    );
}
```

### With Express.js Backend
```javascript
// Server-side (Node.js)
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    
    // Verify credentials in database
    const user = db.findUser(email);
    
    if (user && verifyPassword(password, user.password)) {
        const session = createSession(user);
        res.json({ success: true, session });
    } else {
        res.json({ success: false, message: 'Invalid credentials' });
    }
});
```

## 🐛 Troubleshooting

### Issue: Login not working
```javascript
// Check if user exists
const user = authSystem.getUserByEmail('user@example.com');
console.log(user);

// Check session
const session = authSystem.getCurrentSession();
console.log(session);
```

### Issue: Account locked
```javascript
// Check user status
const user = authSystem.getUserByEmail('user@example.com');
console.log('Status:', user.accountStatus);
console.log('Locked until:', user.lockedUntil);
console.log('Failed attempts:', user.loginAttempts);
```

### Issue: Session expired
```javascript
// Check session expiry
const session = authSystem.getCurrentSession();
if (session) {
    console.log('Expires at:', session.expiresAt);
    console.log('Time remaining:', 
        new Date(session.expiresAt) - new Date()
    );
}
```

## 🎉 Summary

You now have a complete authentication system with:

✅ User signup with validation
✅ Secure login with password hashing
✅ Session management (24-hour expiry)
✅ Failed attempt tracking
✅ Account lockout (5 attempts, 15 min)
✅ Activity logging
✅ Profile management
✅ Password changes
✅ Account deletion
✅ GDPR data export
✅ Admin panel
✅ Demo users
✅ Complete documentation

**Open `admin-panel.html` to see all user data!** 🚀
