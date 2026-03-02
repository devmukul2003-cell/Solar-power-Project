# Configuration File Guide

## Overview
The `config.js` file is the central configuration hub for the Enhanced Smart Energy Dashboard. It contains all settings, parameters, and options that control how the system behaves.

## File Location
```
/config.js
```

## How to Use

### 1. Include in HTML
```html
<script src="config.js"></script>
```

### 2. Access Configuration
```javascript
// Access directly
const panelCount = dashboardConfig.solar.numberOfPanels;
const updateInterval = dashboardConfig.dataEngine.updateInterval;

// Using helper
const value = configHelpers.get('solar.numberOfPanels');
```

### 3. Check Features
```javascript
// Check if feature is enabled
if (configHelpers.isFeatureEnabled('panelHealthMonitoring')) {
  // Initialize panel health monitoring
}
```

## Configuration Sections

### 1. Application Settings
```javascript
config.app = {
  name: "Enhanced Smart Energy Dashboard",
  version: "2.0.0",
  defaultLanguage: "en",
  defaultTheme: "light"
}
```

**Usage:**
```javascript
document.title = dashboardConfig.app.name;
i18n.setLanguage(dashboardConfig.app.defaultLanguage);
```

### 2. Solar Panel Configuration
```javascript
config.solar = {
  numberOfPanels: 12,
  capacityPerPanel: 0.42, // kW
  monitoringInterval: 15000 // ms
}
```

**Usage:**
```javascript
const monitor = new SolarPanelHealthMonitor(
  userId, 
  dashboardConfig.solar.numberOfPanels
);

setInterval(() => {
  monitor.checkPanels();
}, dashboardConfig.solar.monitoringInterval);
```

### 3. Panel Health Monitoring
```javascript
config.panelHealth = {
  temperature: {
    warning: 75,
    critical: 85
  },
  voltage: {
    nominal: 48,
    min: 45,
    max: 51
  }
}
```

**Usage:**
```javascript
if (panel.temperature >= dashboardConfig.panelHealth.temperature.critical) {
  createAlert('CRITICAL_OVERHEATING');
}
```

### 4. Alert System
```javascript
config.alerts = {
  maxRetention: 100,
  notifications: {
    duration: 10000,
    soundEnabled: true
  }
}
```

**Usage:**
```javascript
setTimeout(() => {
  notification.remove();
}, dashboardConfig.alerts.notifications.duration);
```

### 5. Pricing & Calculations
```javascript
config.pricing = {
  currency: "₹",
  pricePerKwh: 8,
  co2PerKwh: 0.82
}
```

**Usage:**
```javascript
const savings = solarKwh * dashboardConfig.pricing.pricePerKwh;
const co2Reduced = solarKwh * dashboardConfig.pricing.co2PerKwh;
```

### 6. Incentive Points
```javascript
config.incentives = {
  basePointsPerKwh: 1,
  bonusPoints: {
    solarPercentage80Plus: 100
  }
}
```

**Usage:**
```javascript
let points = solarUsed * dashboardConfig.incentives.basePointsPerKwh;
if (solarPercentage >= 80) {
  points += dashboardConfig.incentives.bonusPoints.solarPercentage80Plus;
}
```

### 7. Feature Flags
```javascript
config.features = {
  panelHealthMonitoring: true,
  incentivePoints: true,
  darkMode: true
}
```

**Usage:**
```javascript
if (configHelpers.isFeatureEnabled('darkMode')) {
  showThemeToggle();
}
```

## Configuration Helpers

### configHelpers.get(path)
Get configuration value by dot notation path.

```javascript
const value = configHelpers.get('solar.numberOfPanels');
// Returns: 12

const temp = configHelpers.get('panelHealth.temperature.warning');
// Returns: 75
```

### configHelpers.isFeatureEnabled(feature)
Check if a feature is enabled.

```javascript
if (configHelpers.isFeatureEnabled('panelHealthMonitoring')) {
  initializePanelMonitoring();
}
```

### configHelpers.getErrorCode(errorType)
Get error code configuration.

```javascript
const errorConfig = configHelpers.getErrorCode('LOW_OUTPUT');
// Returns: { code: "ERR_001", severity: "warning", priority: 2 }
```

### configHelpers.getRewardLevel(points)
Get reward level based on points.

```javascript
const level = configHelpers.getRewardLevel(1250);
// Returns: { key: "gold", min: 1000, max: 1999, name: "Gold", icon: "🥇" }
```

### configHelpers.getStorageKey(key, userId)
Get localStorage key with prefix.

```javascript
const key = configHelpers.getStorageKey('panelHealth', 'user123');
// Returns: "smartEnergy_panelHealth_user123"
```

## Customization Examples

### Change Number of Panels
```javascript
// In config.js
config.solar.numberOfPanels = 24; // Change from 12 to 24
```

### Adjust Temperature Thresholds
```javascript
// In config.js
config.panelHealth.temperature.warning = 80; // Increase from 75°C
config.panelHealth.temperature.critical = 90; // Increase from 85°C
```

### Change Update Intervals
```javascript
// In config.js
config.solar.monitoringInterval = 30000; // 30 seconds instead of 15
config.dataEngine.updateInterval = 5000; // 5 seconds instead of 10
```

### Modify Pricing
```javascript
// In config.js
config.pricing.pricePerKwh = 10; // ₹10 per kWh instead of ₹8
config.pricing.currency = "$"; // Change to dollars
```

### Enable/Disable Features
```javascript
// In config.js
config.features.soundAlerts = false; // Disable sound alerts
config.features.darkMode = false; // Disable dark mode
```

### Change Incentive Points
```javascript
// In config.js
config.incentives.basePointsPerKwh = 2; // 2 points per kWh
config.incentives.bonusPoints.solarPercentage80Plus = 200; // 200 bonus points
```

## Environment-Specific Configuration

### Development
```javascript
config.development.mode = "development";
config.development.debugMode = true;
config.logging.level = "debug";
```

### Production
```javascript
config.development.mode = "production";
config.development.debugMode = false;
config.logging.level = "error";
```

## Validation

The configuration file includes automatic validation:

```javascript
function validateConfig() {
  // Checks for:
  // - Valid panel count
  // - Valid capacity values
  // - Logical threshold values
  // - Reasonable intervals
}
```

Validation runs automatically when the file loads. Check console for errors.

## Best Practices

### 1. Don't Modify During Runtime
```javascript
// ❌ Bad - Don't modify config at runtime
dashboardConfig.solar.numberOfPanels = 24;

// ✅ Good - Use config values as-is
const panels = dashboardConfig.solar.numberOfPanels;
```

### 2. Use Helper Functions
```javascript
// ❌ Bad - Direct access with long paths
const temp = dashboardConfig.panelHealth.temperature.warning;

// ✅ Good - Use helper
const temp = configHelpers.get('panelHealth.temperature.warning');
```

### 3. Check Feature Flags
```javascript
// ❌ Bad - Assume feature is enabled
initializePanelMonitoring();

// ✅ Good - Check first
if (configHelpers.isFeatureEnabled('panelHealthMonitoring')) {
  initializePanelMonitoring();
}
```

### 4. Use Constants
```javascript
// ✅ Good - Store frequently used values
const PANEL_COUNT = dashboardConfig.solar.numberOfPanels;
const UPDATE_INTERVAL = dashboardConfig.dataEngine.updateInterval;
```

## Common Customizations

### For Different Regions

**India (Default)**
```javascript
config.pricing.currency = "₹";
config.pricing.pricePerKwh = 8;
config.localization.defaultLocale = "hi-IN";
```

**USA**
```javascript
config.pricing.currency = "$";
config.pricing.pricePerKwh = 0.12;
config.localization.defaultLocale = "en-US";
```

**Europe**
```javascript
config.pricing.currency = "€";
config.pricing.pricePerKwh = 0.30;
config.localization.defaultLocale = "en-GB";
```

### For Different System Sizes

**Small System (6 panels)**
```javascript
config.solar.numberOfPanels = 6;
config.solar.totalSystemCapacity = 2.52; // 6 × 420W
```

**Large System (24 panels)**
```javascript
config.solar.numberOfPanels = 24;
config.solar.totalSystemCapacity = 10.08; // 24 × 420W
```

### For Different Update Frequencies

**Fast Updates (Real-time)**
```javascript
config.solar.monitoringInterval = 5000; // 5 seconds
config.dataEngine.updateInterval = 5000;
```

**Slow Updates (Battery Saving)**
```javascript
config.solar.monitoringInterval = 60000; // 1 minute
config.dataEngine.updateInterval = 30000; // 30 seconds
```

## Troubleshooting

### Configuration Not Loading
```javascript
// Check if config is available
if (typeof dashboardConfig === 'undefined') {
  console.error('Configuration not loaded!');
  // Make sure config.js is included before other scripts
}
```

### Invalid Values
```javascript
// Check validation errors in console
// Look for: "Configuration validation errors: [...]"
```

### Feature Not Working
```javascript
// Check if feature is enabled
console.log(configHelpers.isFeatureEnabled('featureName'));
```

## Integration with Existing Code

### Update Panel Health Monitor
```javascript
// In solarPanelHealthMonitor.js
this.thresholds = {
  lowOutput: dashboardConfig.panelHealth.output.lowOutputThreshold,
  highTemp: dashboardConfig.panelHealth.temperature.warning,
  criticalTemp: dashboardConfig.panelHealth.temperature.critical
};
```

### Update Data Engine
```javascript
// In realTimeDataEngine.js
this.updateInterval = setInterval(() => {
  this.monitorPanels();
}, dashboardConfig.dataEngine.updateInterval);
```

### Update UI Components
```javascript
// In enhanced-dashboard.js
const currency = dashboardConfig.pricing.currency;
document.getElementById('moneySaved').textContent = 
  `${currency}${savings.toFixed(2)}`;
```

## Future Enhancements

The configuration file is designed to support future features:

```javascript
config.features = {
  // Current features
  panelHealthMonitoring: true,
  
  // Future features (disabled)
  weatherIntegration: false,
  predictiveMaintenance: false,
  mobileApp: false,
  apiIntegration: false
}
```

When implementing new features, simply enable them in the config:

```javascript
config.features.weatherIntegration = true;
config.api.enabled = true;
```

## Summary

The configuration file provides:
- ✅ Centralized settings management
- ✅ Easy customization without code changes
- ✅ Feature flags for enabling/disabling functionality
- ✅ Environment-specific configurations
- ✅ Validation and error checking
- ✅ Helper functions for easy access
- ✅ Documentation and examples

For questions or issues, refer to this guide or check the inline comments in `config.js`.
