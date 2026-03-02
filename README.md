# ⚡ Smart Energy Dashboard

> A full-stack web application for monitoring solar energy production, tracking electricity consumption, and promoting clean energy usage. Built for **UN SDG 7: Affordable and Clean Energy**.

![Status](https://img.shields.io/badge/status-active-success.svg)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?logo=mongodb&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-43853D?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-404D59?logo=express)
![JWT](https://img.shields.io/badge/JWT-black?logo=JSON%20web%20tokens)

---

## 🌟 Features

### 🔐 Full Authentication System
- JWT-based authentication with bcrypt password hashing
- Secure signup/login/logout flows
- Session management with token expiration
- **Demo Account:** `demo@energy.com` / `demo123`

### 📊 Real-Time Energy Monitoring
- Live solar energy production tracking
- Household consumption monitoring
- 100 days of historical data
- Real-time data synchronization to MongoDB
- Updates every 10 seconds

### 🎯 Interactive Dashboard
- Animated statistics with smooth transitions
- Interactive charts powered by Chart.js
- Multiple view types (Daily, Weekly, Monthly)
- Date range filters (7, 30, 90, 100 days, Custom)
- CSV data export functionality

### 🔋 Solar Panel Health Monitoring
- Track 12 individual solar panels
- Real-time efficiency monitoring
- Health status indicators (Healthy, Warning, Defective)
- Alert system for panel issues
- Performance analytics

### 🏠 Appliance Monitoring
- Track 4 major appliances (AC, Refrigerator, Water Heater, Washing Machine)
- Real-time power consumption
- Status tracking (On/Off/Standby)
- Consumption distribution charts
- Power shortage alerts

### 🏆 Gamification & Incentives
- Earn points for solar energy usage
- Reward levels (Bronze, Silver, Gold, Platinum)
- Progress tracking
- Motivation through achievements

### 🌍 Environmental Impact
- CO₂ emissions reduced (kg)
- Trees equivalent calculation
- Car travel offset (km)
- Clean energy percentage
- Money saved (₹)

### 🌐 Multi-Language Support
- English and Hindi (हिंदी)
- Seamless language switching
- Localized content

### 🎨 Modern UI/UX
- Light and Dark theme toggle
- Responsive design (Desktop, Tablet, Mobile)
- Smooth animations and transitions
- Intuitive navigation
- Clean, modern interface

---

## 🏗️ Tech Stack

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Grid, Flexbox, Animations
- **JavaScript (ES6+)** - Vanilla JS, no frameworks
- **Chart.js** - Data visualization
- **LocalStorage** - Client-side caching

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing

### Security & Middleware
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing
- **express-validator** - Input validation
- **Morgan** - HTTP request logging

---

## 📁 Project Structure

```
smart-energy-dashboard/
├── backend/
│   ├── models/              # Mongoose schemas
│   │   ├── User.js
│   │   ├── EnergyData.js
│   │   ├── Appliance.js
│   │   ├── PanelHealth.js
│   │   ├── IncentivePoints.js
│   │   ├── Preferences.js
│   │   └── Notification.js
│   ├── routes/              # API endpoints
│   │   ├── auth.js          # Authentication
│   │   ├── energyData.js    # Energy data
│   │   ├── appliances.js    # Appliances
│   │   ├── panelHealth.js   # Solar panels
│   │   ├── incentives.js    # Points system
│   │   ├── preferences.js   # User settings
│   │   └── notifications.js # Alerts
│   ├── middleware/
│   │   └── auth.js          # JWT verification
│   ├── server.js            # Express server
│   ├── seed.js              # Database seeding
│   └── package.json
├── index.html               # Login page
├── enhanced-smart-dashboard.html  # Main dashboard
├── tips.html                # Energy tips
├── auth.js                  # Authentication logic
├── enhanced-dashboard.js    # Dashboard logic
├── api.js                   # API service layer
├── realTimeDataEngine.js    # Data generation
├── solarPanelHealthMonitor.js  # Panel monitoring
├── applianceMonitor.js      # Appliance tracking
├── i18n.js                  # Internationalization
└── styles/                  # CSS files
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd smart-energy-dashboard
```

2. **Install backend dependencies**
```bash
cd backend
npm install
```

3. **Configure environment**
```bash
# Copy .env.example to .env
cp .env.example .env

# Edit .env with your settings (default values work for local development)
```

4. **Start MongoDB**
```bash
# Windows
mongod --dbpath C:\data\db

# Mac/Linux
mongod --dbpath /data/db
```

5. **Seed the database**
```bash
cd backend
node seed.js
```

6. **Start the backend server**
```bash
npm run dev
```

7. **Open the application**
```bash
# Open index.html in your browser
# Or use a local server:
python -m http.server 8000
# Then visit: http://localhost:8000
```

### Demo Account
- **Email:** demo@energy.com
- **Password:** demo123

---

## 📊 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Energy Data
- `GET /api/energy-data` - Get energy data
- `POST /api/energy-data` - Create energy record
- `GET /api/energy-data/stats` - Get statistics
- `GET /api/energy-data/today` - Get today's data

### Appliances
- `GET /api/appliances` - Get all appliances
- `POST /api/appliances` - Create appliance
- `PUT /api/appliances/:id` - Update appliance
- `POST /api/appliances/bulk-update` - Bulk update

### Panel Health
- `GET /api/panel-health` - Get all panels
- `POST /api/panel-health` - Create panel
- `PUT /api/panel-health/:id` - Update panel
- `POST /api/panel-health/bulk-update` - Bulk update
- `GET /api/panel-health/stats/summary` - Get stats

### Incentives
- `GET /api/incentives` - Get incentive history
- `POST /api/incentives` - Create incentive record
- `GET /api/incentives/current` - Get current points

### Preferences
- `GET /api/preferences` - Get user preferences
- `PUT /api/preferences` - Update preferences

### Notifications
- `GET /api/notifications` - Get notifications
- `POST /api/notifications` - Create notification
- `PUT /api/notifications/:id/read` - Mark as read
- `GET /api/notifications/unread/count` - Get unread count

---

## 🎯 Key Metrics

### Performance
- Real-time updates every 10 seconds
- Data sync to MongoDB every 100 seconds
- 42 REST API endpoints
- 7 MongoDB collections
- 100 days of historical data

### Impact
- Track up to ₹3,000/month in savings
- Monitor CO₂ reduction in real-time
- Calculate environmental impact
- Gamify energy conservation

---

## 🎨 Screenshots

### Dashboard
![Dashboard](screenshots/dashboard.png)

### Panel Health Monitoring
![Panel Health](screenshots/panel-health.png)

### Appliance Monitoring
![Appliances](screenshots/appliances.png)

### Multi-Language Support
![Languages](screenshots/languages.png)

---

## 🧪 Testing

### Test Tools Included
- `test-connection.html` - Backend connection test
- `login-test-simple.html` - Login flow test
- `test-dashboard-load.html` - Dashboard load test
- `check-auth-status.html` - Auth status checker

### Manual Testing
1. Test authentication flow
2. Test real-time data updates
3. Test chart interactions
4. Test language switching
5. Test theme toggle
6. Test data export
7. Test mobile responsiveness

---

## 🌍 UN SDG 7 Alignment

This project directly supports **UN Sustainable Development Goal 7: Affordable and Clean Energy** by:

1. **Increasing renewable energy adoption** - Makes solar energy monitoring accessible
2. **Improving energy efficiency** - Helps users optimize consumption
3. **Reducing carbon footprint** - Tracks and visualizes environmental impact
4. **Promoting awareness** - Educates users about clean energy benefits
5. **Enabling data-driven decisions** - Provides actionable insights

---

## 🚀 Future Enhancements

- [ ] Real IoT device integration (ESP32/Arduino)
- [ ] Weather API integration for solar predictions
- [ ] Mobile app (React Native)
- [ ] Email/SMS notifications
- [ ] Community features and leaderboards
- [ ] Energy trading marketplace
- [ ] AI-powered consumption predictions
- [ ] Integration with smart home devices
- [ ] PDF report generation
- [ ] Social media sharing

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👥 Team

Built with ❤️ for hackathons and clean energy advocacy.

---

## 📞 Support

For issues or questions:
- Open an issue on GitHub
- Check the troubleshooting guides in `/docs`
- Review the API documentation

---

## 🙏 Acknowledgments

- Chart.js for beautiful visualizations
- MongoDB for robust data storage
- Express.js community for excellent documentation
- UN SDG 7 for inspiration

---

**⚡ Empowering households to make smarter energy choices, one dashboard at a time.**
