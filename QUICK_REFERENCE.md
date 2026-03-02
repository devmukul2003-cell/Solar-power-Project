# Quick Reference Card

## 🚀 Getting Started (30 seconds)

1. Open `index.html`
2. Click "Get Started"
3. Login: `demo@energy.com` / `demo123`
4. Explore dashboard!

## 🔐 User Accounts

### Demo Account
```
Email: demo@energy.com
Password: demo123
Solar: 5 kW
Location: Mumbai
```

### Create New Account
```
Signup → Fill form → Set solar capacity → Create!
```

### Multiple Users
```
Each user = Separate data
Switch: Logout → Login with different account
```

## 📊 Dashboard Features

### Real-Time Indicator
```
🟢 Live: X.XX kWh solar • X.XX kWh usage
Updates every 5 seconds
```

### Stats Cards (4)
```
1. Solar Produced (kWh/day avg)
2. Energy Consumed (kWh/day avg)
3. Money Saved (₹/month)
4. CO₂ Reduced (kg/month)
```

### Charts (2)
```
1. Hourly: Today's generation vs consumption
2. Historical: Filtered by date range & view type
```

### Filters
```
Date Range: 7 / 30 / 90 / 100 days
View Type: Daily / Weekly / Monthly
Export: Download CSV
```

## 🎯 Dynamic Data

### Solar Generation
```
Time: Peak at noon (12 PM)
Season: More in summer
Weather: Random cloud cover
Capacity: Your panel size
Efficiency: 85-95%
```

### Consumption
```
Morning (6-9 AM): High
Day (9-5 PM): Moderate
Evening (5-11 PM): Peak
Night (11 PM-6 AM): Low
Weekend: +20%
```

### Updates
```
Real-time: Every 5 seconds
Hourly data: Every minute
Historical: Every hour
Charts: On filter change
```

## 💡 Key Calculations

### Money Saved
```
Solar kWh × ₹8 = Savings
Example: 12 kWh × ₹8 = ₹96/day
```

### CO₂ Reduced
```
Solar kWh × 0.82 kg = CO₂ saved
Example: 12 kWh × 0.82 = 9.84 kg/day
```

### Trees Equivalent
```
CO₂ kg ÷ 20 = Trees
Example: 200 kg ÷ 20 = 10 trees/month
```

### Car Offset
```
CO₂ kg × 5.5 = km offset
Example: 200 kg × 5.5 = 1,100 km/month
```

## 🎨 UI Elements

### User Profile
```
Top right: Name, Location, Solar capacity
Click Logout to switch accounts
```

### Notifications
```
Welcome message (on login)
Periodic tips (every 45s)
Auto-dismiss (after 3s)
```

### Animations
```
Stats: Count up on load
Cards: Fade in & hover effects
Charts: Smooth transitions
Pulse: Real-time indicator
```

## 📱 Pages

### 1. Home (index.html)
```
Problem → Solution → Get Started
```

### 2. Login (login.html)
```
Email + Password → Login
Demo credentials shown
```

### 3. Signup (signup.html)
```
Name, Email, Password, Location, Solar → Create
```

### 4. Dashboard (dashboard.html)
```
Stats + Charts + Filters + Impact
Real-time updates
```

### 5. Tips (tips.html)
```
9 categorized tips
Savings amounts
Personalized insights
```

## 🔧 Troubleshooting

### Login Issues
```
✓ Check email/password
✓ Use demo account
✓ Create new account
```

### Data Not Showing
```
✓ Refresh page (F5)
✓ Clear cache
✓ Check console (F12)
```

### Charts Not Loading
```
✓ Check internet (Chart.js CDN)
✓ Wait 2 seconds
✓ Refresh page
```

## 📁 File Structure

### Core Files (11)
```
HTML: index, login, signup, dashboard, tips
CSS: styles, auth, animations
JS: dashboard, auth, data, dynamicData
```

### Documentation (8)
```
README.md - Overview
QUICKSTART.md - 3-min guide
USER_GUIDE.md - Complete guide
FEATURES.md - Feature list
PROJECT_STRUCTURE.md - Architecture
PRESENTATION_GUIDE.md - Demo tips
TESTING_CHECKLIST.md - QA
UPDATES.md - Changelog
QUICK_REFERENCE.md - This file
```

## 🎯 Demo Flow (3 min)

```
1. Home page (30s)
   → Show problem & solution

2. Signup/Login (30s)
   → Create account or use demo

3. Dashboard tour (90s)
   → Real-time indicator
   → Stats cards
   → Charts
   → Filters
   → Export

4. Tips page (30s)
   → Show recommendations
```

## 💾 Data Storage

### LocalStorage Keys
```
allUsers - All registered users
currentUser - Current session
energyData_${userId} - User's energy data
```

### Data Refresh
```
Historical: Every hour
Hourly: Every minute
Real-time: Every 5 seconds
```

## 🌟 Best Practices

### For Users
```
✓ Set accurate solar capacity
✓ Check different time periods
✓ Export data regularly
✓ Follow energy tips
✓ Monitor real-time
```

### For Demo
```
✓ Test all features
✓ Clear cache before
✓ Use demo account
✓ Show real-time updates
✓ Explain calculations
```

## 📊 Sample Data

### Demo User (5 kW)
```
Daily Solar: 10-14 kWh
Daily Consumption: 15-20 kWh
Monthly Savings: ₹2,000-3,000
Monthly CO₂: 150-200 kg
```

### Custom User (10 kW)
```
Daily Solar: 20-28 kWh
Daily Consumption: 15-20 kWh
Monthly Savings: ₹4,000-6,000
Monthly CO₂: 300-400 kg
```

## 🎓 Key Concepts

### Solar Capacity
```
Small: 3 kW (₹1,500/month savings)
Medium: 5 kW (₹2,500/month savings)
Large: 10 kW (₹5,000/month savings)
```

### Peak Hours
```
Solar: 10 AM - 3 PM
Consumption: 5 PM - 11 PM
Best usage: During solar peak
```

### Efficiency
```
System: 85-95%
Seasonal: ±30%
Weather: ±40%
```

## 🏆 Hackathon Tips

### Strengths to Highlight
```
✓ Multi-user support
✓ Dynamic real-time data
✓ Personalized experience
✓ Professional UI/UX
✓ Complete documentation
✓ Production-ready
```

### Demo Points
```
✓ Create new account
✓ Show real-time updates
✓ Change filters
✓ Export data
✓ Show different users
```

## 📞 Quick Commands

### Open Project
```
Open index.html in browser
```

### Test Login
```
demo@energy.com / demo123
```

### Create User
```
Signup → Fill form → Create
```

### Export Data
```
Dashboard → Export button → CSV
```

### Switch User
```
Logout → Login with different account
```

## ⚡ Keyboard Shortcuts

```
F5 - Refresh page
F12 - Open console
Ctrl+Shift+Delete - Clear cache
Ctrl+F5 - Hard refresh
```

## 🎉 Success Checklist

```
✅ Multi-user working
✅ Dynamic data generating
✅ Real-time updating
✅ Charts displaying
✅ Filters working
✅ Export functioning
✅ Notifications showing
✅ Mobile responsive
```

## 📈 Impact Numbers

### Per Household
```
Savings: ₹30,000-42,000/year
CO₂: 180 kg/year
Trees: 9 equivalent
```

### 10,000 Households
```
Savings: ₹30-42 crores/year
CO₂: 1,800 tons/year
Trees: 90,000 equivalent
```

---

**Print this card for quick reference during demo! 📄**
