# Testing Checklist

## 🔐 Demo Credentials

### Pre-configured User
- **Email**: demo@energy.com
- **Password**: demo123
- **Name**: Demo User
- **Location**: Mumbai
- **Solar Capacity**: 5 kW

## ✅ Testing Checklist

### 1. Home Page (index.html)
- [ ] Page loads correctly
- [ ] Navigation links work
- [ ] "Get Started" button redirects to login
- [ ] Problem cards display properly
- [ ] Solution features visible
- [ ] Footer displays
- [ ] Responsive on mobile
- [ ] Animations play smoothly

### 2. Signup Page (signup.html)
- [ ] Form displays correctly
- [ ] All input fields work
- [ ] Email validation works
- [ ] Password minimum length (6 chars)
- [ ] Terms checkbox required
- [ ] "Create Account" button works
- [ ] Redirects to dashboard after signup
- [ ] "Login" link works
- [ ] Responsive layout

### 3. Login Page (login.html)
- [ ] Form displays correctly
- [ ] Demo credentials work
- [ ] Invalid credentials show error
- [ ] "Remember me" checkbox visible
- [ ] "Forgot password" link present
- [ ] Demo credentials box visible
- [ ] Redirects to dashboard on success
- [ ] "Sign up" link works
- [ ] Split-screen layout on desktop
- [ ] Mobile responsive

### 4. Dashboard Page (dashboard.html)

#### Header & Navigation
- [ ] User name displays correctly
- [ ] Logout button works
- [ ] Redirects to login after logout
- [ ] Navigation links functional

#### Statistics Cards
- [ ] Solar Produced displays
- [ ] Energy Consumed displays
- [ ] Money Saved displays (with ₹)
- [ ] CO₂ Reduced displays
- [ ] Numbers animate on load
- [ ] Hover effects work
- [ ] Icons display correctly

#### Filters Section
- [ ] Date range selector works
- [ ] View type selector works
- [ ] Export button downloads CSV
- [ ] Filters update dashboard
- [ ] All options selectable

#### Charts
- [ ] Hourly chart loads
- [ ] Weekly/overview chart loads
- [ ] Charts are interactive
- [ ] Tooltips show on hover
- [ ] Legend displays
- [ ] Charts update with filters
- [ ] Real-time updates work (5s interval)
- [ ] Responsive sizing

#### Environmental Impact
- [ ] Trees equivalent calculates
- [ ] Car offset calculates
- [ ] Clean energy % displays
- [ ] Cards animate on load
- [ ] Values update with filters

#### Notifications
- [ ] Welcome notification appears
- [ ] Periodic tips show (30s)
- [ ] Notifications auto-dismiss (3s)
- [ ] Different notification types work

### 5. Tips Page (tips.html)
- [ ] Page loads correctly
- [ ] All tip categories display
- [ ] Tip cards show properly
- [ ] Badges display (High/Medium/Low)
- [ ] Savings amounts visible
- [ ] Personalized insights section
- [ ] Hover effects work
- [ ] Responsive layout

### 6. Cross-Browser Testing
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari
- [ ] Mobile Chrome
- [ ] Mobile Safari

### 7. Responsive Testing
- [ ] Desktop (1920x1080)
- [ ] Laptop (1366x768)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667)
- [ ] Mobile landscape

### 8. Data Functionality
- [ ] 100 days of data loads
- [ ] Hourly data displays
- [ ] Calculations are correct
- [ ] Date filtering works
- [ ] View aggregation works
- [ ] CSV export includes all data
- [ ] CSV format is correct

### 9. LocalStorage
- [ ] User data persists
- [ ] Login state maintained
- [ ] Logout clears data
- [ ] Works in normal mode
- [ ] Doesn't work in incognito (expected)

### 10. Performance
- [ ] Page loads under 2 seconds
- [ ] Animations are smooth (60fps)
- [ ] No console errors
- [ ] Charts render quickly
- [ ] Filter changes are instant
- [ ] No memory leaks

### 11. Accessibility
- [ ] All images have alt text
- [ ] Forms have labels
- [ ] Buttons are keyboard accessible
- [ ] Color contrast is sufficient
- [ ] Text is readable
- [ ] Focus indicators visible

### 12. Visual Design
- [ ] Colors match theme
- [ ] Fonts are consistent
- [ ] Spacing is uniform
- [ ] Alignment is correct
- [ ] Icons display properly
- [ ] No layout breaks
- [ ] Shadows and effects work

## 🐛 Common Issues & Fixes

### Issue: Charts not displaying
**Fix**: Check internet connection (Chart.js loads from CDN)

### Issue: Login not working
**Fix**: Use exact credentials: demo@energy.com / demo123

### Issue: Data not persisting
**Fix**: Enable cookies/localStorage, don't use incognito

### Issue: Animations not smooth
**Fix**: Close other tabs, check CPU usage

### Issue: CSV download not working
**Fix**: Check browser download settings

### Issue: Mobile layout broken
**Fix**: Clear cache, check viewport meta tag

## 📊 Test Data Validation

### Expected Values (30-day range):
- Solar Produced: ~10-14 kWh/day
- Energy Consumed: ~15-20 kWh/day
- Money Saved: ~₹2,000-3,000/month
- CO₂ Reduced: ~150-200 kg/month
- Trees Equivalent: ~8-10
- Car Offset: ~800-1,100 km
- Clean Energy %: ~60-70%

### CSV Export Should Include:
- date
- solarGenerated
- gridConsumed
- totalConsumed
- moneySaved
- co2Reduced
- peakSolarHour
- efficiency

## 🎯 Pre-Demo Checklist

### 1 Hour Before:
- [ ] Test all pages
- [ ] Clear browser cache
- [ ] Close unnecessary tabs
- [ ] Check internet connection
- [ ] Prepare backup (screenshots)
- [ ] Charge laptop fully
- [ ] Test on presentation screen

### 30 Minutes Before:
- [ ] Open all pages in tabs
- [ ] Login with demo account
- [ ] Verify charts load
- [ ] Test one CSV export
- [ ] Check audio (if any)
- [ ] Have water ready

### 5 Minutes Before:
- [ ] Refresh all pages
- [ ] Close distracting apps
- [ ] Set browser to full screen
- [ ] Disable notifications
- [ ] Take a deep breath!

## 🔄 Quick Reset

If something goes wrong during demo:

1. **Clear LocalStorage**:
   - Open DevTools (F12)
   - Application tab
   - LocalStorage
   - Clear all

2. **Refresh Page**: Ctrl+F5 (hard refresh)

3. **Restart Browser**: Close and reopen

4. **Use Backup**: Switch to screenshots/video

## 📱 Mobile Demo Tips

If demoing on mobile:
- Use landscape mode for dashboard
- Zoom out if needed
- Tap slowly and deliberately
- Show responsive design as feature
- Mention "mobile-first" approach

## 🎬 Demo Flow

1. Start at index.html
2. Click "Get Started"
3. Show login page
4. Enter demo credentials
5. Tour dashboard (2 minutes)
6. Change filters
7. Export CSV
8. Navigate to tips
9. Return to dashboard
10. Logout

**Total Demo Time: 3-4 minutes**

## ✨ Pro Tips

- Keep DevTools closed during demo
- Use Ctrl+Scroll to zoom if needed
- Have a second device as backup
- Practice the demo 5+ times
- Know every click before you make it
- Smile and maintain eye contact
- Explain what you're clicking
- Don't rush!

## 📞 Emergency Contacts

If technical issues:
- Have GitHub repo link ready
- Have video recording ready
- Have screenshots printed
- Know how to explain without demo

## 🏆 Success Criteria

Demo is successful if you show:
- ✅ Problem understanding
- ✅ Clean UI/UX
- ✅ Working authentication
- ✅ Interactive dashboard
- ✅ Data visualization
- ✅ Real-time updates
- ✅ Export functionality
- ✅ Mobile responsiveness

You've got this! 🚀
