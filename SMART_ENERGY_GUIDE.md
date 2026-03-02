# Smart Energy Dashboard - User Guide

## Overview
A complete authentication system with dynamic dataset management for a Smart Energy Dashboard.

## Features

### 1. User Authentication System
- **Login Flow**: Validates credentials, updates session status to `logged_in`, and records last login timestamp
- **Signup Flow**: Creates new user with `logged_out` status (user must login after signup)
- **Logout Flow**: Immediately sets session to `logged_out` and redirects to sign-in page

### 2. Dynamic Dataset Structure
```json
{
  "userId": "user@example.com",
  "password": "hashed_password",
  "sessionStatus": "logged_in" | "logged_out",
  "lastLogin": "2024-02-27T10:30:00Z",
  "signupDate": "2024-01-15T10:30:00Z",
  "energyData": {
    "currentUsage": 3.2,
    "monthlyUsage": 450,
    "cost": 67.50
  }
}
```

### 3. Three Core Flows

#### Login Flow
1. User enters email and password
2. System validates credentials
3. If valid: Set `sessionStatus` to `logged_in` and update `lastLogin` timestamp
4. Redirect to dashboard

#### Signup Flow
1. User enters email and password
2. System checks if user exists
3. If new: Create user with `sessionStatus` set to `logged_out`
4. User must login after signup (no auto-login)

#### Logout Flow
1. User clicks logout button
2. System immediately sets `sessionStatus` to `logged_out`
3. Direct redirect to sign-in page (index.html)

## Files

### Core Files
- `index.html` - Login/Signup page
- `auth.js` - Authentication logic
- `userData.js` - User data management class
- `smart-energy-dashboard.html` - Main dashboard
- `smart-energy-dashboard.js` - Dashboard logic
- `smart-energy-styles.css` - Dashboard styles

### Key Components

#### UserDataManager Class (userData.js)
- `login(userId, password)` - Handles login flow
- `signup(userId, password)` - Handles signup flow
- `logout()` - Handles logout flow
- `getCurrentUser()` - Gets current session
- `isUserLoggedIn()` - Checks login status
- `exportDataset()` - Exports all user data as JSON

## Usage

### Starting the Application
1. Open `index.html` in a browser
2. Use demo credentials: `demo@energy.com` / `demo123`
3. Or create a new account via signup

### Testing Flows

#### Test Login
```javascript
// In browser console
userDataManager.login('demo@energy.com', 'demo123');
```

#### Test Signup
```javascript
// In browser console
userDataManager.signup('newuser@example.com', 'password123');
```

#### Test Logout
```javascript
// In browser console
userDataManager.logout();
```

#### View Dataset
```javascript
// In browser console
console.log(userDataManager.exportDataset());
```

## Dashboard Features
- Real-time energy usage monitoring
- Session information display
- User ID, session status, last login, signup date
- Energy metrics (current usage, monthly usage, cost)
- Live dataset viewer (JSON format)
- Automatic energy simulation (updates every 5 seconds)

## Security Notes
- Passwords stored in localStorage (for demo purposes)
- In production, use proper backend authentication
- Implement password hashing
- Use secure session tokens
- Add HTTPS and CSRF protection

## Data Persistence
All data is stored in browser localStorage:
- `smartEnergyUsers` - User dataset
- `currentUser` - Active session data

## Browser Compatibility
- Chrome, Firefox, Safari, Edge (latest versions)
- Requires localStorage support
- JavaScript must be enabled
