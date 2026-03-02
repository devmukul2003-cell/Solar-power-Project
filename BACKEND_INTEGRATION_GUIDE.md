# Backend Integration Guide
## Connecting Smart Energy Dashboard Frontend to MongoDB Backend

This guide explains how to migrate from localStorage to the MongoDB backend API.

---

## 🎯 Overview

**Current State:** Frontend uses localStorage for all data persistence  
**Target State:** Frontend calls REST API endpoints, data stored in MongoDB  
**Benefits:** Multi-user support, real persistence, scalability, hackathon-ready

---

## 📋 Prerequisites

1. Backend server running on `http://localhost:5000`
2. MongoDB connected and seeded with demo data
3. Frontend files ready for modification

---

## 🔧 Step 1: Create API Service Layer

Create `frontend/api.js` to handle all API calls:

```javascript
// api.js - API Service Layer
class EnergyDashboardAPI {
    constructor() {
        this.baseURL = 'http://localhost:5000/api';
        this.token = localStorage.getItem('authToken');
    }

    // Set auth token
    setToken(token) {
        this.token = token;
        localStorage.setItem('authToken', token);
    }

    // Clear auth token
    clearToken() {
        this.token = null;
        localStorage.removeItem('authToken');
    }

    // Get auth headers
    getHeaders() {
        const headers = {
            'Content-Type': 'application/json'
        };
        
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }
        
        return headers;
    }

    // Generic request handler
    async request(endpoint, options = {}) {
        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                ...options,
                headers: this.getHeaders()
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'API request failed');
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // ============================================
    // AUTHENTICATION
    // ============================================

    async signup(email, password, name) {
        const data = await this.request('/auth/signup', {
            method: 'POST',
            body: JSON.stringify({ email, password, name })
        });
        return data;
    }

    async login(email, password) {
        const data = await this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
        
        if (data.success && data.token) {
            this.setToken(data.token);
        }
        
        return data;
    }

    async logout() {
        const data = await this.request('/auth/logout', {
            method: 'POST'
        });
        this.clearToken();
        return data;
    }

    async getCurrentUser() {
        return await this.request('/auth/me');
    }

    // ============================================
    // ENERGY DATA
    // ============================================

    async createEnergyData(solarProduced_kWh, householdConsumed_kWh, timestamp) {
        return await this.request('/energy-data', {
            method: 'POST',
            body: JSON.stringify({
                solarProduced_kWh,
                householdConsumed_kWh,
                timestamp
            })
        });
    }

    async getEnergyData(startDate, endDate, limit = 100) {
        const params = new URLSearchParams();
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);
        params.append('limit', limit);
        
        return await this.request(`/energy-data?${params}`);
    }

    async getEnergyStats(days = 30) {
        return await this.request(`/energy-data/stats?days=${days}`);
    }

    async getTodayEnergyData() {
        return await this.request('/energy-data/today');
    }

    // ============================================
    // APPLIANCES
    // ============================================

    async createAppliance(applianceData) {
        return await this.request('/appliances', {
            method: 'POST',
            body: JSON.stringify(applianceData)
        });
    }

    async getAppliances(status, isActive) {
        const params = new URLSearchParams();
        if (status) params.append('status', status);
        if (isActive !== undefined) params.append('isActive', isActive);
        
        return await this.request(`/appliances?${params}`);
    }

    async updateAppliance(applianceId, updates) {
        return await this.request(`/appliances/${applianceId}`, {
            method: 'PUT',
            body: JSON.stringify(updates)
        });
    }

    async bulkUpdateAppliances(appliances) {
        return await this.request('/appliances/bulk-update', {
            method: 'POST',
            body: JSON.stringify({ appliances })
        });
    }

    async getApplianceStats() {
        return await this.request('/appliances/stats/consumption');
    }

    // ============================================
    // PANEL HEALTH
    // ============================================

    async createPanel(panelNumber, expectedOutput_kW) {
        return await this.request('/panel-health', {
            method: 'POST',
            body: JSON.stringify({ panelNumber, expectedOutput_kW })
        });
    }

    async getPanels(status) {
        const params = status ? `?status=${status}` : '';
        return await this.request(`/panel-health${params}`);
    }

    async updatePanel(panelId, updates) {
        return await this.request(`/panel-health/${panelId}`, {
            method: 'PUT',
            body: JSON.stringify(updates)
        });
    }

    async bulkUpdatePanels(panels) {
        return await this.request('/panel-health/bulk-update', {
            method: 'POST',
            body: JSON.stringify({ panels })
        });
    }

    async getPanelStats() {
        return await this.request('/panel-health/stats/summary');
    }

    // ============================================
    // INCENTIVES
    // ============================================

    async createIncentiveRecord(energySaved_kWh, pointsEarned, totalPoints, rewardLevel) {
        return await this.request('/incentives', {
            method: 'POST',
            body: JSON.stringify({
                energySaved_kWh,
                pointsEarned,
                totalPoints,
                rewardLevel
            })
        });
    }

    async getIncentiveHistory(limit = 50) {
        return await this.request(`/incentives?limit=${limit}`);
    }

    async getCurrentPoints() {
        return await this.request('/incentives/current');
    }

    // ============================================
    // PREFERENCES
    // ============================================

    async getPreferences() {
        return await this.request('/preferences');
    }

    async updatePreferences(preferences) {
        return await this.request('/preferences', {
            method: 'PUT',
            body: JSON.stringify(preferences)
        });
    }

    // ============================================
    // NOTIFICATIONS
    // ============================================

    async createNotification(type, category, message) {
        return await this.request('/notifications', {
            method: 'POST',
            body: JSON.stringify({ type, category, message })
        });
    }

    async getNotifications(resolved, isRead, type, limit = 50) {
        const params = new URLSearchParams();
        if (resolved !== undefined) params.append('resolved', resolved);
        if (isRead !== undefined) params.append('isRead', isRead);
        if (type) params.append('type', type);
        params.append('limit', limit);
        
        return await this.request(`/notifications?${params}`);
    }

    async markNotificationRead(notificationId) {
        return await this.request(`/notifications/${notificationId}/read`, {
            method: 'PUT'
        });
    }

    async resolveNotification(notificationId) {
        return await this.request(`/notifications/${notificationId}/resolve`, {
            method: 'PUT'
        });
    }

    async getUnreadCount() {
        return await this.request('/notifications/unread/count');
    }
}

// Create global instance
const api = new EnergyDashboardAPI();
window.api = api;
```

---

## 🔄 Step 2: Update Authentication (auth.js)

Replace localStorage-based auth with API calls:

```javascript
// auth.js - Updated Authentication

// Signup Handler
async function handleSignup(event) {
    event.preventDefault();
    
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const name = document.getElementById('signupName').value;

    try {
        const response = await api.signup(email, password, name);
        
        if (response.success) {
            showNotification('Signup successful! Please login.', 'success');
            switchToLogin();
        }
    } catch (error) {
        showNotification(error.message || 'Signup failed', 'error');
    }
}

// Login Handler
async function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await api.login(email, password);
        
        if (response.success) {
            // Store user info
            localStorage.setItem('currentUser', JSON.stringify(response.user));
            
            // Redirect to dashboard
            window.location.href = 'enhanced-smart-dashboard.html';
        }
    } catch (error) {
        showNotification(error.message || 'Login failed', 'error');
    }
}

// Logout Handler
async function handleLogout() {
    try {
        await api.logout();
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Logout error:', error);
        // Force logout even if API fails
        api.clearToken();
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    }
}
```

---

## 📊 Step 3: Update Energy Data Engine

Modify `realTimeDataEngine.js` to sync with backend:

```javascript
// realTimeDataEngine.js - Updated with API Integration

class RealTimeDataEngine {
    constructor(userId, updateIntervalSeconds = 10) {
        this.userId = userId;
        this.updateInterval = updateIntervalSeconds * 1000;
        this.isRunning = false;
        
        // Load initial data from API
        this.loadHistoricalData();
        
        // Start real-time updates
        this.startRealTimeUpdates();
    }

    async loadHistoricalData() {
        try {
            const response = await api.getEnergyData(null, null, 100);
            
            if (response.success) {
                this.historicalData = response.data.map(record => ({
                    date: new Date(record.timestamp).toISOString().split('T')[0],
                    solarGenerated: record.solarProduced_kWh,
                    consumption: record.householdConsumed_kWh,
                    moneySaved: record.moneySaved_inr,
                    co2Reduced: record.co2Reduced_kg
                }));
            }
        } catch (error) {
            console.error('Error loading historical data:', error);
            this.historicalData = [];
        }
    }

    async saveEnergyData(solar, consumption) {
        try {
            await api.createEnergyData(solar, consumption, new Date());
        } catch (error) {
            console.error('Error saving energy data:', error);
        }
    }

    startRealTimeUpdates() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        
        this.intervalId = setInterval(async () => {
            const newData = this.generateRealtimeData();
            
            // Save to backend every 10 updates (every 100 seconds)
            if (this.updateCount % 10 === 0) {
                await this.saveEnergyData(newData.solar, newData.consumption);
            }
            
            // Dispatch event for UI update
            window.dispatchEvent(new CustomEvent('energyDataUpdate', {
                detail: newData
            }));
            
            this.updateCount++;
        }, this.updateInterval);
    }

    // ... rest of the methods remain the same
}
```

---

## 🔌 Step 4: Update Appliance Monitor

Modify `applianceMonitor.js` to sync with backend:

```javascript
// applianceMonitor.js - Updated with API Integration

class ApplianceMonitor {
    constructor(userId) {
        this.userId = userId;
        this.powerShortageThreshold = 5.0;
        this.isPowerShortage = false;
        
        // Load appliances from API
        this.initializeAppliances();
    }

    async initializeAppliances() {
        try {
            const response = await api.getAppliances();
            
            if (response.success && response.appliances.length > 0) {
                this.appliances = response.appliances;
            } else {
                // Create default appliances if none exist
                await this.createDefaultAppliances();
            }
            
            this.startMonitoring();
        } catch (error) {
            console.error('Error loading appliances:', error);
            this.appliances = [];
        }
    }

    async createDefaultAppliances() {
        const defaultAppliances = [
            {
                applianceName: 'Air Conditioner',
                category: 'HVAC',
                icon: '❄️',
                ratedPower_watts: 1500,
                threshold_kW: 2.0,
                priority: 3
            },
            // ... other default appliances
        ];

        for (const appData of defaultAppliances) {
            try {
                const response = await api.createAppliance(appData);
                if (response.success) {
                    this.appliances.push(response.appliance);
                }
            } catch (error) {
                console.error('Error creating appliance:', error);
            }
        }
    }

    async syncAppliances() {
        try {
            // Bulk update all appliances
            const updates = this.appliances.map(app => ({
                applianceId: app.applianceId,
                currentConsumption_kW: app.currentConsumption_kW,
                dailyConsumption_kWh: app.dailyConsumption_kWh,
                thresholdStatus: app.thresholdStatus,
                isActive: app.isActive,
                suggestionMessage: app.suggestionMessage
            }));

            await api.bulkUpdateAppliances(updates);
        } catch (error) {
            console.error('Error syncing appliances:', error);
        }
    }

    monitorAppliances() {
        // Simulate usage for each appliance
        this.appliances.forEach(appliance => {
            this.simulateApplianceUsage(appliance);
            this.detectOveruse(appliance);
        });

        // Check for power shortage
        this.checkPowerShortage();

        // Sync with backend every 5 updates (25 seconds)
        if (this.monitorCount % 5 === 0) {
            this.syncAppliances();
        }

        this.monitorCount++;
    }

    // ... rest of the methods remain the same
}
```

---

## ☀️ Step 5: Update Panel Health Monitor

Similar pattern for `solarPanelHealthMonitor.js`:

```javascript
// solarPanelHealthMonitor.js - Updated with API Integration

class SolarPanelHealthMonitor {
    constructor(userId, panelCount = 12) {
        this.userId = userId;
        this.panelCount = panelCount;
        
        // Load panels from API
        this.initializePanels();
    }

    async initializePanels() {
        try {
            const response = await api.getPanels();
            
            if (response.success && response.panels.length > 0) {
                this.panels = response.panels;
            } else {
                // Create default panels
                await this.createDefaultPanels();
            }
            
            this.startMonitoring();
        } catch (error) {
            console.error('Error loading panels:', error);
            this.panels = [];
        }
    }

    async createDefaultPanels() {
        for (let i = 1; i <= this.panelCount; i++) {
            try {
                const response = await api.createPanel(i, 0.42);
                if (response.success) {
                    this.panels.push(response.panel);
                }
            } catch (error) {
                console.error(`Error creating panel ${i}:`, error);
            }
        }
    }

    async syncPanels() {
        try {
            const updates = this.panels.map(panel => ({
                panelId: panel.panelId,
                status: panel.status,
                currentOutput_kW: panel.currentOutput_kW,
                temperature_celsius: panel.temperature_celsius,
                voltage_volts: panel.voltage_volts,
                errorCode: panel.errorCode,
                errorType: panel.errorType,
                alertMessage: panel.alertMessage
            }));

            await api.bulkUpdatePanels(updates);
        } catch (error) {
            console.error('Error syncing panels:', error);
        }
    }

    // ... rest of the methods
}
```

---

## 🎨 Step 6: Update Dashboard Main File

Modify `enhanced-dashboard.js`:

```javascript
// enhanced-dashboard.js - Updated with API Integration

// Check authentication
const token = localStorage.getItem('authToken');
if (!token) {
    window.location.href = 'index.html';
}

// Load current user
let currentUser = null;

async function loadCurrentUser() {
    try {
        const response = await api.getCurrentUser();
        if (response.success) {
            currentUser = response.user;
            displayUserInfo();
        }
    } catch (error) {
        console.error('Error loading user:', error);
        window.location.href = 'index.html';
    }
}

// Load preferences from API
async function loadPreferences() {
    try {
        const response = await api.getPreferences();
        if (response.success) {
            userPreferences = response.preferences;
            applyTheme(userPreferences.themePreference.toLowerCase());
            i18n.setLanguage(userPreferences.languagePreference === 'Hindi' ? 'hi' : 'en');
        }
    } catch (error) {
        console.error('Error loading preferences:', error);
    }
}

// Save preferences to API
async function savePreferences() {
    try {
        await api.updatePreferences({
            languagePreference: userPreferences.language === 'en' ? 'English' : 'Hindi',
            themePreference: userPreferences.theme === 'light' ? 'Light' : 'Dark'
        });
    } catch (error) {
        console.error('Error saving preferences:', error);
    }
}

// Load incentive points
async function loadIncentivePoints() {
    try {
        const response = await api.getCurrentPoints();
        if (response.success) {
            updateIncentiveDisplay(response.points.totalPoints);
        }
    } catch (error) {
        console.error('Error loading incentive points:', error);
    }
}

// Initialize
async function initializeDashboard() {
    await loadCurrentUser();
    await loadPreferences();
    await loadIncentivePoints();
    
    // Initialize monitors (they will load from API)
    dataEngine = new RealTimeDataEngine(currentUser.userId, 10);
    panelHealthMonitor = new SolarPanelHealthMonitor(currentUser.userId, 12);
    applianceMonitor = new ApplianceMonitor(currentUser.userId);
    
    // Initialize UI
    panelHealthUI = new PanelHealthUI(panelHealthMonitor);
    applianceMonitorUI = new ApplianceMonitorUI(applianceMonitor);
    
    updateStats();
    createCharts();
}

// Start initialization
initializeDashboard();
```

---

## 📝 Step 7: Update HTML Files

Add API script before other scripts in `enhanced-smart-dashboard.html`:

```html
<!-- Add this BEFORE other scripts -->
<script src="api.js"></script>

<!-- Then existing scripts -->
<script src="userData.js"></script>
<script src="realTimeDataEngine.js"></script>
<!-- ... rest of scripts -->
```

---

## ✅ Step 8: Testing Checklist

### Backend Testing
- [ ] Start MongoDB
- [ ] Run `npm run seed` to populate demo data
- [ ] Start backend with `npm run dev`
- [ ] Test health endpoint: `curl http://localhost:5000/api/health`

### Frontend Testing
- [ ] Open `index.html` in browser
- [ ] Test signup with new user
- [ ] Test login with demo credentials (demo@energy.com / demo123)
- [ ] Verify dashboard loads with data from MongoDB
- [ ] Check browser console for API calls
- [ ] Verify real-time updates sync to backend
- [ ] Test logout and re-login

### Data Verification
- [ ] Check MongoDB Compass to see data being created
- [ ] Verify appliances update in database
- [ ] Verify energy data records created
- [ ] Check panel health updates

---

## 🐛 Common Issues & Solutions

### Issue: CORS Error
**Error:** `Access to fetch blocked by CORS policy`

**Solution:**
```javascript
// In backend/.env
CORS_ORIGIN=http://localhost:3000

// Or allow all origins for development
CORS_ORIGIN=*
```

### Issue: 401 Unauthorized
**Error:** `No authentication token, access denied`

**Solution:**
- Check token is stored: `localStorage.getItem('authToken')`
- Verify token is sent in headers
- Re-login to get fresh token

### Issue: MongoDB Connection Failed
**Error:** `MongoNetworkError: connect ECONNREFUSED`

**Solution:**
```bash
# Start MongoDB
mongod

# Or check if running
ps aux | grep mongod
```

### Issue: API calls return 404
**Error:** `Route not found`

**Solution:**
- Verify backend is running on correct port
- Check `baseURL` in `api.js` matches backend port
- Verify endpoint paths match backend routes

---

## 🚀 Deployment Considerations

### Frontend Deployment
Update `api.js` baseURL for production:

```javascript
constructor() {
    this.baseURL = process.env.NODE_ENV === 'production' 
        ? 'https://your-backend-api.herokuapp.com/api'
        : 'http://localhost:5000/api';
    // ...
}
```

### Backend Deployment
See `backend/README.md` for Heroku/Docker deployment instructions.

---

## 📊 Migration Summary

| Component | Before (localStorage) | After (MongoDB API) |
|-----------|----------------------|---------------------|
| Authentication | Local JSON | JWT + bcrypt |
| User Data | Browser only | MongoDB users collection |
| Energy Data | Local array | MongoDB energydata collection |
| Appliances | Local array | MongoDB appliances collection |
| Panels | Local array | MongoDB panelhealths collection |
| Preferences | Local object | MongoDB preferences collection |
| Persistence | Browser only | Database (multi-device) |
| Multi-user | No | Yes |
| Scalability | Limited | High |

---

## 🎉 Success Criteria

Your integration is complete when:

✅ Users can signup/login with real authentication  
✅ Dashboard loads data from MongoDB  
✅ Real-time updates sync to database  
✅ Multiple users can have separate data  
✅ Data persists across browser sessions  
✅ Data accessible from different devices  
✅ No localStorage dependencies (except auth token)  

---

**Ready for your hackathon demo! 🏆**
