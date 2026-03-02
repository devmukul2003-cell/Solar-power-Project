# Smart Energy Dashboard - User Guide

## 🎯 New Features

### 1. Multi-User Support
Each user now has their own independent account with personalized data!

### 2. Dynamic Real-Time Data
Data is generated dynamically based on:
- Current time of day
- Your solar panel capacity
- Seasonal variations
- Weather patterns
- Realistic consumption patterns

## 🔐 User Accounts

### Creating an Account

1. Go to the **Signup Page**
2. Fill in your details:
   - **Name**: Your full name
   - **Email**: Your email (must be unique)
   - **Password**: At least 6 characters
   - **Location**: Your city/state
   - **Solar Capacity**: Your solar panel capacity in kW (e.g., 3, 5, 10)

3. Click "Create Account"
4. You'll be automatically logged in!

### Login

1. Go to the **Login Page**
2. Enter your email and password
3. Click "Login"

**Demo Account:**
- Email: `demo@energy.com`
- Password: `demo123`
- Solar Capacity: 5 kW
- Location: Mumbai

### Multiple Users

You can create multiple accounts:
- Each account has its own data
- Data is stored separately per user
- Switch between accounts by logging out and logging in

## 📊 Dynamic Data Generation

### How It Works

Your dashboard data is generated dynamically based on:

#### Solar Generation
- **Time of Day**: Peak generation at noon (12 PM)
- **Solar Capacity**: Your panel size (kW)
- **Season**: More sun in summer, less in winter
- **Weather**: Random cloud cover simulation
- **Efficiency**: 85% average system efficiency

#### Energy Consumption
- **Morning (6-9 AM)**: High usage (breakfast, getting ready)
- **Day (9-5 PM)**: Moderate usage
- **Evening (5-11 PM)**: Peak usage (cooking, entertainment)
- **Night (11 PM-6 AM)**: Minimal usage
- **Weekends**: 20% higher consumption

#### Real-Time Updates
- Updates every 5 seconds
- Shows current solar generation
- Shows current consumption
- Updates charts automatically

### Historical Data

Each user gets 100 days of historical data:
- Realistic seasonal patterns
- Weather variations
- Weekend vs weekday differences
- Your specific solar capacity

### Hourly Data

24-hour breakdown for today:
- Hour-by-hour solar generation
- Hour-by-hour consumption
- Real-time current hour updates
- Future hour projections

## 🎨 Dashboard Features

### Real-Time Indicator
At the top of the dashboard, you'll see:
- 🟢 **Live indicator** (pulsing green dot)
- **Current solar generation** (updates every 5s)
- **Current consumption** (updates every 5s)

### User Profile
Top right corner shows:
- Your name
- Your location
- Your solar capacity
- Logout button

### Statistics Cards
Four animated cards showing:
1. **Solar Energy Produced** (daily average)
2. **Energy Consumed** (total consumption)
3. **Money Saved** (₹8 per kWh)
4. **CO₂ Reduced** (0.82 kg per kWh)

### Interactive Charts
1. **Hourly Energy Flow**
   - Line chart
   - Solar generation (yellow)
   - Consumption (blue)
   - Updates in real-time

2. **Historical Overview**
   - Bar chart
   - Changes with filters
   - Solar vs Grid comparison

### Filters
- **Date Range**: 7, 30, 90, or 100 days
- **View Type**: Daily, Weekly, or Monthly
- **Export**: Download your data as CSV

### Environmental Impact
- Trees equivalent
- Car travel offset
- Clean energy percentage

## 💡 Smart Notifications

You'll receive periodic notifications:
- Welcome message (personalized greeting)
- Energy-saving tips
- Current status updates
- Achievement notifications

## 📈 Understanding Your Data

### Solar Generation
- **Peak Hours**: 10 AM - 3 PM
- **Best Season**: Summer (June-August)
- **Efficiency**: 85-95% typical

### Consumption Patterns
- **Base Load**: 0.5 kWh (always-on devices)
- **Morning Peak**: 6-9 AM
- **Evening Peak**: 5-11 PM
- **Weekend**: Higher usage

### Savings Calculation
- **Grid Rate**: ₹8 per kWh
- **Solar Savings**: Every kWh from solar saves ₹8
- **Monthly Savings**: Varies by usage and generation

### CO₂ Reduction
- **Factor**: 0.82 kg CO₂ per kWh
- **Trees**: 1 tree = ~20 kg CO₂/year
- **Car Travel**: 1 kg CO₂ = ~5.5 km

## 🔄 Data Refresh

Your data automatically refreshes:
- **Real-time stats**: Every 5 seconds
- **Hourly data**: Every minute
- **Historical data**: Every hour
- **Charts**: With every filter change

## 💾 Data Storage

Your data is stored locally in your browser:
- **User accounts**: All users in one database
- **Energy data**: Separate per user
- **Session**: Current logged-in user
- **Privacy**: Data never leaves your device

## 🎯 Tips for Best Experience

### 1. Set Accurate Solar Capacity
Enter your actual solar panel capacity for realistic data:
- Small system: 3 kW
- Medium system: 5 kW
- Large system: 10+ kW

### 2. Check Different Time Periods
Use filters to see:
- Weekly trends
- Monthly patterns
- Seasonal variations

### 3. Export Your Data
Download CSV for:
- Excel analysis
- Long-term tracking
- Sharing with others

### 4. Monitor Real-Time
Watch the live indicator to:
- See current generation
- Track consumption
- Optimize usage

### 5. Follow Tips
Check the Energy Tips page for:
- High-impact savings
- Personalized recommendations
- Potential savings amounts

## 🐛 Troubleshooting

### Login Issues
- **Wrong credentials**: Check email and password
- **Account not found**: Create a new account
- **Demo account**: Use `demo@energy.com` / `demo123`

### Data Not Showing
- **Refresh page**: Press F5
- **Clear cache**: Ctrl+Shift+Delete
- **Check browser**: Use modern browser (Chrome, Firefox, Edge)

### Charts Not Loading
- **Internet connection**: Chart.js loads from CDN
- **Wait a moment**: Charts take 1-2 seconds to load
- **Refresh page**: Try reloading

### Data Not Persisting
- **Enable cookies**: Check browser settings
- **LocalStorage**: Must be enabled
- **Incognito mode**: Data won't persist

## 🔒 Privacy & Security

### Your Data
- Stored locally in your browser
- Never sent to any server
- Completely private
- Delete by clearing browser data

### Passwords
- Stored in plain text (demo only!)
- In production: Would be encrypted
- Never share your password
- Use unique passwords

### Demo Account
- Shared demo account available
- Anyone can access
- Don't store sensitive info
- Create your own account for privacy

## 🚀 Advanced Features

### Custom Solar Capacity
Set your exact panel size:
- Affects generation calculations
- Realistic for your system
- Updates all metrics

### Multiple Accounts
Create accounts for:
- Different locations
- Different systems
- Comparison purposes
- Family members

### Data Export
CSV includes:
- Date
- Solar generated
- Grid consumed
- Total consumed
- Money saved
- CO₂ reduced
- Peak solar hour
- System efficiency

## 📱 Mobile Usage

The dashboard works great on mobile:
- Responsive design
- Touch-friendly
- Swipe charts
- Tap to interact

## 🎓 Learning Resources

### Understanding Solar
- Peak hours: 10 AM - 3 PM
- Seasonal variation: ±30%
- Weather impact: ±40%
- System efficiency: 85-95%

### Energy Consumption
- Base load: Always-on devices
- Peak times: Morning & evening
- Weekend: Higher usage
- Seasonal: AC in summer, heater in winter

### Financial Impact
- Grid rate: ₹8/kWh average
- Solar ROI: 5-7 years typical
- Monthly savings: ₹2,000-5,000
- Annual savings: ₹24,000-60,000

## 🌟 Best Practices

1. **Check daily**: Monitor your generation and consumption
2. **Use filters**: Analyze different time periods
3. **Follow tips**: Implement energy-saving recommendations
4. **Export data**: Keep records for analysis
5. **Share insights**: Help others save energy

## 📞 Support

For issues or questions:
- Check this guide first
- Review QUICKSTART.md
- Check TESTING_CHECKLIST.md
- Review browser console for errors

## 🎉 Enjoy Your Dashboard!

You now have a powerful tool to:
- Monitor your solar energy
- Track your consumption
- Save money on electricity
- Reduce your carbon footprint
- Make data-driven decisions

Happy energy monitoring! ⚡🌞
