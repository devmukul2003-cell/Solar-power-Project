# 🚀 How to Start the Servers

## Quick Start (Every Time You Want to Use the Dashboard)

### Step 1: Start MongoDB
Open a **NEW** terminal/command prompt and run:
```bash
mongod --dbpath C:\data\db
```
**Keep this terminal open!** Don't close it.

### Step 2: Start Backend
Open **ANOTHER** terminal/command prompt and run:
```bash
cd backend
npm run dev
```
**Keep this terminal open too!** Don't close it.

You should see:
```
✅ MongoDB Connected Successfully
🚀 Server running on port 5000
```

### Step 3: Open Dashboard
Now open your browser and go to:
- Open `index.html` file
- Or visit `http://localhost:8000` if using a local server

### Step 4: Login
Use demo credentials:
- Email: `demo@energy.com`
- Password: `demo123`

---

## Alternative: Use the Startup Script

### Windows Users
Double-click `start.bat` file

This will:
1. Start MongoDB
2. Start Backend
3. Open browser automatically

---

## Troubleshooting "Failed to Fetch"

### Problem: "Failed to fetch" at login

**Cause:** Backend is not running

**Solution:**
1. Check if backend terminal is open
2. Look for "Server running on port 5000"
3. If not running, start it:
   ```bash
   cd backend
   npm run dev
   ```

### Problem: PowerShell execution policy error

**Error:**
```
npm.ps1 cannot be loaded because running scripts is disabled
```

**Solution 1:** Use CMD instead
```bash
# Open CMD (not PowerShell)
cd backend
npm run dev
```

**Solution 2:** Fix PowerShell policy (one-time)
```powershell
# Run PowerShell as Administrator
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Problem: MongoDB won't start

**Error:**
```
exception in initAndListen: NonExistentPath: Data directory C:\data\db not found
```

**Solution:** Create the directory
```bash
mkdir C:\data\db
```

### Problem: Port 5000 already in use

**Error:**
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solution:** Kill the process using port 5000
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID_NUMBER> /F

# Then restart backend
cd backend
npm run dev
```

---

## Verification Checklist

Before trying to login, verify:

- [ ] MongoDB terminal is open and running
- [ ] Backend terminal is open and shows:
  - ✅ MongoDB Connected Successfully
  - 🚀 Server running on port 5000
- [ ] No error messages in either terminal
- [ ] Browser is open to index.html

---

## What Each Terminal Does

### Terminal 1: MongoDB
```
MongoDB starting...
waiting for connections on port 27017
```
**Purpose:** Database server
**Keep open:** YES

### Terminal 2: Backend
```
✅ MongoDB Connected Successfully
🚀 Server running on port 5000
```
**Purpose:** API server
**Keep open:** YES

---

## Quick Test

To verify backend is working:

1. Open browser
2. Go to: `http://localhost:5000/api/health`
3. Should see:
```json
{
  "status": "OK",
  "message": "Smart Energy Dashboard API is running",
  "database": "Connected"
}
```

If you see this, backend is working! ✅

---

## Common Mistakes

❌ **Closing the terminal** - Servers stop running
✅ **Keep terminals open** - Servers keep running

❌ **Starting backend before MongoDB** - Connection fails
✅ **Start MongoDB first, then backend** - Works perfectly

❌ **Using PowerShell with execution policy issues** - npm fails
✅ **Use CMD or fix policy** - npm works

---

## Daily Workflow

### Morning (Start Work)
1. Open Terminal 1 → Start MongoDB
2. Open Terminal 2 → Start Backend
3. Open Browser → Open dashboard
4. Login and work

### Evening (End Work)
1. Close browser
2. Press Ctrl+C in Terminal 2 (Backend)
3. Press Ctrl+C in Terminal 1 (MongoDB)
4. Close terminals

---

## Pro Tips

### Tip 1: Keep Terminals Visible
Arrange your screen:
```
┌─────────────┬─────────────┐
│  Terminal 1 │  Terminal 2 │
│  (MongoDB)  │  (Backend)  │
├─────────────┴─────────────┤
│        Browser             │
│      (Dashboard)           │
└────────────────────────────┘
```

### Tip 2: Check Logs
If something goes wrong:
- Look at Terminal 1 for MongoDB errors
- Look at Terminal 2 for Backend errors
- Look at Browser Console (F12) for Frontend errors

### Tip 3: Restart if Stuck
If things aren't working:
1. Close both terminals (Ctrl+C)
2. Wait 5 seconds
3. Start MongoDB again
4. Start Backend again
5. Refresh browser

---

## Status Indicators

### MongoDB Running ✅
```
waiting for connections on port 27017
```

### Backend Running ✅
```
✅ MongoDB Connected Successfully
🚀 Server running on port 5000
```

### Dashboard Working ✅
- Login page loads
- No "Failed to fetch" error
- Can login successfully

---

## Need Help?

If you still get "Failed to fetch":

1. **Check backend terminal** - Is it running?
2. **Check MongoDB terminal** - Is it running?
3. **Test health endpoint** - Visit http://localhost:5000/api/health
4. **Check browser console** - Press F12, look for errors
5. **Restart everything** - Close all, start fresh

---

**Remember: You need BOTH MongoDB AND Backend running to use the dashboard!** 🚀
