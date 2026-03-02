# Backend Quick Reference Card

## 🚀 Server Status

✅ **MongoDB:** Running (Terminal ID: 2)  
✅ **Backend Server:** Running on port 5000 (Terminal ID: 3)  
✅ **API Base URL:** http://localhost:5000/api

---

## 🔐 Demo Login

```
Email: demo@energy.com
Password: demo123
```

---

## 🧪 Quick Tests

### Health Check
```bash
curl http://localhost:5000/api/health
```

### Test in Browser
Open: `test-api.html`

---

## 📡 Most Used Endpoints

### Login
```javascript
POST /api/auth/login
Body: { "email": "demo@energy.com", "password": "demo123" }
Returns: { "success": true, "token": "...", "user": {...} }
```

### Get Energy Data
```javascript
GET /api/energy-data?limit=100
Headers: { "Authorization": "Bearer YOUR_TOKEN" }
```

### Get Appliances
```javascript
GET /api/appliances
Headers: { "Authorization": "Bearer YOUR_TOKEN" }
```

### Get Panels
```javascript
GET /api/panel-health
Headers: { "Authorization": "Bearer YOUR_TOKEN" }
```

---

## 🛠️ Server Commands

### Start
```bash
cd backend
npm run dev
```

### Stop
Press `Ctrl+C` in server terminal

### Re-seed
```bash
node backend/seed.js
```

---

## 📊 Database Info

**Name:** smart-energy-dashboard  
**Collections:** 7  
**Demo User:** demo@energy.com  
**Energy Records:** 31 days  
**Appliances:** 4  
**Solar Panels:** 12  

---

## 🔄 Frontend Integration Snippet

```javascript
// api.js
class EnergyDashboardAPI {
    constructor() {
        this.baseURL = 'http://localhost:5000/api';
        this.token = localStorage.getItem('authToken');
    }

    async login(email, password) {
        const res = await fetch(`${this.baseURL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (data.token) {
            this.token = data.token;
            localStorage.setItem('authToken', data.token);
        }
        return data;
    }

    async get(endpoint) {
        const res = await fetch(`${this.baseURL}${endpoint}`, {
            headers: { 'Authorization': `Bearer ${this.token}` }
        });
        return await res.json();
    }
}

const api = new EnergyDashboardAPI();
```

---

## 🐛 Common Issues

### Port 5000 in use
```bash
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### MongoDB not connecting
```bash
mongosh  # Test connection
```

### CORS error
Set in `backend/.env`:
```
CORS_ORIGIN=*
```

---

## 📚 Full Documentation

- `backend/README.md` - Complete API docs
- `BACKEND_INTEGRATION_GUIDE.md` - Integration steps
- `SETUP_SUMMARY.md` - Setup overview

---

**Backend is LIVE! Ready to integrate! 🎉**
