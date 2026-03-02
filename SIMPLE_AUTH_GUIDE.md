# Simple Authentication System - Complete Guide

## 🎯 Overview

A streamlined authentication system with Login, Signup, and Logout functionality. Features dynamic JSON dataset that updates in real-time to reflect user actions.

## 📁 Files Created

1. **simpleAuthSystem.js** (6 KB) - Core authentication engine
2. **auth-demo.html** (10 KB) - Interactive demo page
3. **SIMPLE_AUTH_GUIDE.md** - This documentation

## ✨ Key Features

### Three Core Flows

**1. SIGNUP** - Create new account
- Check if User ID exists
- Validate password (min 6 chars)
- Create user with `active` status
- Set `sessionStatus` to `logged_out`
- Record `signupDate`

**2. LOGIN** - Authenticate user
- Verify User ID and Password
- Check account status
- Update `lastLogin` timestamp
- Set `sessionStatus` to `logged_in`
- Create session

**3. LOGOUT** - End session
- Set `sessionStatus` to `logged_out`
- Clear session data
- Redirect to login page

## 📊 Data Structure

### User Object (JSON)
```json
{
  "userId": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "location": "Mumbai",
  "solarCapacity": 5,
  "accountStatus": "active",
  "signupDate": "2024-02-27T14:30:00.000Z",
  "lastLogin": "2024-02-27T15:45:00.000Z",
  "sessionStatus": "logged_in"
}
```

### Field Descriptions

| Field | Type | Description |
|-------|------|-------------|
| `userId` | string | Unique identifier (email/username) |
| `password` | string | User password (plain text for demo) |
| `name` | string | User's full name |
| `location` | string | User's location |
| `solarCapacity` | number | Solar panel capacity in kW |
| `accountStatus` | string | `active`, `inactive`, or `new` |
| `signupDate` | string | ISO timestamp when account created |
| `lastLogin` | string | ISO timestamp of last login |
| `sessionStatus` | string | `logged_in` or `logged_out` |

### Session Object (JSON)
```json
{
  "userId": "user@example.com",
  "name": "John Doe",
  "location": "Mumbai",
  "solarCapacity": 5,
  "sessionStatus": "logged_in",
  "loginTime": "2024-02-27T15:45:00.000Z"
}
```

## 🚀 Quick Start

### Open Demo Page
```
1. Open auth-demo.html in browser
2. See live authentication system
3. Test all three flows
```

### Use Programmatically
```javascript
// Initialize system
const authSystem = new SimpleAuthSystem();

// Signup
const signupResult = authSystem.signup(
    'user@example.com',
    'password123',
    'John Doe',
    'Mumbai',
    5
);

// Login
const loginResult = authSystem.login(
    'user@example.com',
    'password123'
);

// Check session
const session = authSystem.getSession();
console.log(session);

// Logout
const logoutResult = authSystem.logout();
```

## 📖 API Reference

### signup(userId, password, name, location, solarCapacity)

Create new user account.

**Parameters:**
- `userId` (string) - Unique email/username
- `password` (string) - User password (min 6 chars)
- `name` (string) - User's name (default: 'User')
- `location` (string) - User's location (default: 'Unknown')
- `solarCapacity` (number) - Solar capacity in kW (default: 5)

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
- `SIGNUP_SUCCESS` - Account created
- `USER_EXISTS` - User ID already exists
- `MISSING_FIELDS` - Required fields missing
- `WEAK_PASSWORD` - Password too short

**Example:**
```javascript
const result = authSystem.signup(
    'john@example.com',
    'secure123',
    'John Doe',
    'Delhi',
    10
);

if (result.success) {
    console.log('User created:', result.user);
} else {
    console.error('Error:', result.message);
}
```

### login(userId, password)

Authenticate user and create session.

**Parameters:**
- `userId` (string) - User's email/username
- `password` (string) - User's password

**Returns:**
```javascript
{
    success: boolean,
    message: string,
    code: string,
    user?: object,
    session?: object
}
```

**Response Codes:**
- `LOGIN_SUCCESS` - Login successful
- `INVALID_CREDENTIALS` - Wrong userId or password
- `ACCOUNT_NOT_ACTIVE` - Account is inactive

**Example:**
```javascript
const result = authSystem.login('john@example.com', 'secure123');

if (result.success) {
    console.log('Logged in:', result.user);
    console.log('Session:', result.session);
} else {
    console.error('Login failed:', result.message);
}
```

### logout()

End current session.

**Returns:**
```javascript
{
    success: boolean,
    message: string,
    code: string
}
```

**Response Codes:**
- `LOGOUT_SUCCESS` - Logged out successfully
- `NO_SESSION` - No active session

**Example:**
```javascript
const result = authSystem.logout();
console.log(result.message);
// Redirect to login page
window.location.href = 'login.html';
```

### getSession()

Get current active session.

**Returns:** Session object or `null`

**Example:**
```javascript
const session = authSystem.getSession();

if (session) {
    console.log('User:', session.name);
    console.log('Status:', session.sessionStatus);
} else {
    console.log('No active session');
}
```

### isLoggedIn()

Check if user is currently logged in.

**Returns:** `boolean`

**Example:**
```javascript
if (authSystem.isLoggedIn()) {
    console.log('User is logged in');
} else {
    console.log('User is logged out');
}
```

### getCurrentUser()

Get current user data (without password).

**Returns:** User object (sanitized) or `null`

**Example:**
```javascript
const user = authSystem.getCurrentUser();

if (user) {
    console.log('Current user:', user.name);
    console.log('Last login:', user.lastLogin);
}
```

### getAllUsers()

Get all users (for admin/demo purposes).

**Returns:** Array of user objects (sanitized)

**Example:**
```javascript
const users = authSystem.getAllUsers();
console.log(`Total users: ${users.length}`);
users.forEach(user => {
    console.log(`${user.name} - ${user.sessionStatus}`);
});
```

### exportJSON()

Export complete dataset as JSON string.

**Returns:** JSON string

**Example:**
```javascript
const json = authSystem.exportJSON();
console.log(json);

// Download as file
const blob = new Blob([json], { type: 'application/json' });
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'auth-data.json';
a.click();
```

### reset()

Reset system (delete all data).

**Example:**
```javascript
authSystem.reset();
console.log('System reset complete');
```

## 🔄 Authentication Flows

### SIGNUP Flow
```
1. User fills signup form
   ↓
2. Check if userId exists
   ↓
3. Validate password (min 6 chars)
   ↓
4. Create user object:
   - accountStatus: 'active'
   - signupDate: current timestamp
   - lastLogin: null
   - sessionStatus: 'logged_out'
   ↓
5. Save to localStorage
   ↓
6. Return success
```

### LOGIN Flow
```
1. User enters credentials
   ↓
2. Find user by userId
   ↓
3. Check if user exists
   ↓
4. Check accountStatus is 'active'
   ↓
5. Verify password matches
   ↓
6. Update user:
   - lastLogin: current timestamp
   - sessionStatus: 'logged_in'
   ↓
7. Create session object
   ↓
8. Save session to localStorage
   ↓
9. Return success with user & session
```

### LOGOUT Flow
```
1. Get current session
   ↓
2. Find user by userId
   ↓
3. Update user:
   - sessionStatus: 'logged_out'
   ↓
4. Clear session from localStorage
   ↓
5. Return success
   ↓
6. Redirect to login page
```

## 🎯 Demo Users

The system creates 2 demo users automatically:

### Demo User
```
User ID: demo@energy.com
Password: demo123
Name: Demo User
Location: Mumbai
Solar: 5 kW
```

### Admin User
```
User ID: admin@energy.com
Password: admin123
Name: Admin User
Location: Delhi
Solar: 10 kW
```

## 💾 Data Storage

### localStorage Keys

**auth_users** - All user accounts
```json
[
  {
    "userId": "demo@energy.com",
    "password": "demo123",
    "name": "Demo User",
    "accountStatus": "active",
    "signupDate": "2024-02-27T14:30:00.000Z",
    "lastLogin": "2024-02-27T15:45:00.000Z",
    "sessionStatus": "logged_in"
  }
]
```

**auth_session** - Current session
```json
{
  "userId": "demo@energy.com",
  "name": "Demo User",
  "sessionStatus": "logged_in",
  "loginTime": "2024-02-27T15:45:00.000Z"
}
```

## 🎨 Integration Examples

### With HTML Forms

**Login Form:**
```html
<form id="loginForm">
    <input type="text" id="userId" placeholder="User ID">
    <input type="password" id="password" placeholder="Password">
    <button type="submit">Login</button>
</form>

<script>
document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const userId = document.getElementById('userId').value;
    const password = document.getElementById('password').value;
    
    const result = authSystem.login(userId, password);
    
    if (result.success) {
        window.location.href = 'dashboard.html';
    } else {
        alert(result.message);
    }
});
</script>
```

**Signup Form:**
```html
<form id="signupForm">
    <input type="email" id="userId" placeholder="Email">
    <input type="password" id="password" placeholder="Password">
    <input type="text" id="name" placeholder="Name">
    <button type="submit">Sign Up</button>
</form>

<script>
document.getElementById('signupForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const userId = document.getElementById('userId').value;
    const password = document.getElementById('password').value;
    const name = document.getElementById('name').value;
    
    const result = authSystem.signup(userId, password, name);
    
    if (result.success) {
        // Auto-login
        authSystem.login(userId, password);
        window.location.href = 'dashboard.html';
    } else {
        alert(result.message);
    }
});
</script>
```

**Logout Button:**
```html
<button onclick="handleLogout()">Logout</button>

<script>
function handleLogout() {
    authSystem.logout();
    window.location.href = 'login.html';
}
</script>
```

### Protected Pages

**Check authentication on page load:**
```javascript
// At the top of dashboard.js
const session = authSystem.getSession();

if (!session || session.sessionStatus !== 'logged_in') {
    window.location.href = 'login.html';
}

// Use session data
document.getElementById('userName').textContent = session.name;
```

### Session Status Display

```javascript
function updateSessionStatus() {
    const session = authSystem.getSession();
    const statusElement = document.getElementById('sessionStatus');
    
    if (session && session.sessionStatus === 'logged_in') {
        statusElement.innerHTML = `
            <span class="badge-success">Logged In</span>
            <p>Welcome, ${session.name}!</p>
        `;
    } else {
        statusElement.innerHTML = `
            <span class="badge-danger">Logged Out</span>
            <p>Please login</p>
        `;
    }
}

// Update every 5 seconds
setInterval(updateSessionStatus, 5000);
```

## 🔍 Testing

### Test Signup
```javascript
// Test valid signup
const result1 = authSystem.signup(
    'test@example.com',
    'test123',
    'Test User'
);
console.log(result1); // success: true

// Test duplicate user
const result2 = authSystem.signup(
    'test@example.com',
    'test123',
    'Test User'
);
console.log(result2); // success: false, code: 'USER_EXISTS'

// Test weak password
const result3 = authSystem.signup(
    'test2@example.com',
    '123',
    'Test User'
);
console.log(result3); // success: false, code: 'WEAK_PASSWORD'
```

### Test Login
```javascript
// Test valid login
const result1 = authSystem.login('demo@energy.com', 'demo123');
console.log(result1); // success: true

// Test invalid credentials
const result2 = authSystem.login('demo@energy.com', 'wrong');
console.log(result2); // success: false, code: 'INVALID_CREDENTIALS'

// Test non-existent user
const result3 = authSystem.login('fake@example.com', 'password');
console.log(result3); // success: false, code: 'INVALID_CREDENTIALS'
```

### Test Logout
```javascript
// Login first
authSystem.login('demo@energy.com', 'demo123');

// Check session
console.log(authSystem.isLoggedIn()); // true

// Logout
authSystem.logout();

// Check session again
console.log(authSystem.isLoggedIn()); // false
```

## 📊 Sample Dataset Export

```json
{
  "users": [
    {
      "userId": "demo@energy.com",
      "name": "Demo User",
      "location": "Mumbai",
      "solarCapacity": 5,
      "accountStatus": "active",
      "signupDate": "2024-02-27T14:30:00.000Z",
      "lastLogin": "2024-02-27T15:45:00.000Z",
      "sessionStatus": "logged_in"
    },
    {
      "userId": "admin@energy.com",
      "name": "Admin User",
      "location": "Delhi",
      "solarCapacity": 10,
      "accountStatus": "active",
      "signupDate": "2024-02-27T14:30:00.000Z",
      "lastLogin": null,
      "sessionStatus": "logged_out"
    }
  ],
  "currentSession": {
    "userId": "demo@energy.com",
    "name": "Demo User",
    "location": "Mumbai",
    "solarCapacity": 5,
    "sessionStatus": "logged_in",
    "loginTime": "2024-02-27T15:45:00.000Z"
  },
  "exportDate": "2024-02-27T16:00:00.000Z"
}
```

## 🎉 Summary

You now have a complete authentication system with:

✅ **SIGNUP** - Create new accounts with validation
✅ **LOGIN** - Authenticate users and create sessions
✅ **LOGOUT** - End sessions and redirect
✅ **Session Management** - Track logged_in/logged_out status
✅ **Dynamic Dataset** - Updates in real-time (JSON format)
✅ **Demo Users** - Pre-configured for testing
✅ **Interactive Demo** - Full-featured test page
✅ **Export Functionality** - Download dataset as JSON
✅ **Clean API** - Simple, easy-to-use methods

**Open `auth-demo.html` to see it in action!** 🚀
