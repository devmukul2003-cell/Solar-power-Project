# ⚠️ "Failed to Fetch" - Quick Fix

## The Problem
You're seeing "Failed to fetch" at login because the **backend server is not running**.

---

## ✅ The Solution (2 Steps)

### Step 1: Start MongoDB
Open a **NEW** Command Prompt (CMD) and run:
```bash
mongod --dbpath C:\data\db
```
**Leave this window open!**

You should see:
```
waiting for connections on port 27017
```

---

### Step 2: Start Backend
Open **ANOTHER** Command Prompt (CMD) and run:
```bash
cd C:\Users\Mukul\Desktop\HACKATHON\backend
npm run dev
```
**Leave this window open too!**

You should see:
```
✅ MongoDB Connected Successfully
🚀 Server running on port 5000
```

---

### Step 3: Try Login Again
Now go back to your browser and try logging in:
- Email: `demo@energy.com`
- Password: `demo123`

**It should work now!** ✅

---

## Visual Guide

```
┌─────────────────────────────────────────────┐
│  Terminal 1 (MongoDB)                       │
│  > mongod --dbpath C:\data\db              │
│  waiting for connections on port 27017     │
│  ✅ KEEP THIS OPEN                          │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  Terminal 2 (Backend)                       │
│  > cd backend                               │
│  > npm run dev                              │
│  ✅ MongoDB Connected Successfully          │
│  🚀 Server running on port 5000            │
│  ✅ KEEP THIS OPEN                          │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  Browser (Dashboard)                        │
│  Open index.html                            │
│  Login: demo@energy.com / demo123          │
│  ✅ Should work now!                        │
└─────────────────────────────────────────────┘
```

---

## Why This Happens

The dashboard needs:
1. **MongoDB** - Database to store data
2. **Backend** - API server to handle requests
3. **Frontend** - Your browser showing the dashboard

If MongoDB or Backend is not running → "Failed to fetch" error

---

## Quick Test

Before logging in, test if backend is working:

1. Open browser
2. Go to: `http://localhost:5000/api/health`
3. Should see:
```json
{
  "status": "OK",
  "database": "Connected"
}
```

If you see this → Backend is working! ✅
If you see error → Backend is not running ❌

---

## Important Notes

⚠️ **Don't close the terminals!**
- Closing Terminal 1 → MongoDB stops
- Closing Terminal 2 → Backend stops
- Both stop → Dashboard won't work

✅ **Keep both terminals open while using the dashboard**

---

## If You Get PowerShell Error

If you see:
```
npm.ps1 cannot be loaded because running scripts is disabled
```

**Solution:** Use CMD instead of PowerShell
1. Open **Command Prompt** (not PowerShell)
2. Run the commands there

---

## Summary

**Problem:** "Failed to fetch" at login
**Cause:** Backend not running
**Solution:** Start MongoDB + Backend
**Result:** Login works! ✅

---

**Now try logging in again - it should work!** 🚀
