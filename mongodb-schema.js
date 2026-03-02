// ============================================
// UNIFIED DATABASE SCHEMA - MongoDB Version
// Enhanced Smart Energy Dashboard
// Supports All Features (1-9)
// ============================================

// 1. USERS COLLECTION
db.users.insertOne({
  userId: "user-demo-001",
  name: "Demo User",
  email: "demo@energy.com",
  password: "$2a$10$hashedpassword",
  signupDate: new Date(),
  lastLogin: null,
  sessionStatus: "logged_out",
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
});

db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ userId: 1 }, { unique: true });
db.users.createIndex({ sessionStatus: 1 });

// 2. ENERGY DATA COLLECTION
db.energyData.insertOne({
  recordId: "record-001",
  userId: "user-demo-001",
  timestamp: new Date(),
  solarProduced_kWh: 4.5,
  householdConsumed_kWh: 3.2,
  gridConsumed_kWh: 0,
  moneySaved_inr: 36.00,
  co2Reduced_kg: 3.69,
  createdAt: new Date()
});

db.energyData.createIndex({ userId: 1, timestamp: -1 });
db.energyData.createIndex({ timestamp: -1 });

// 3. APPLIANCES COLLECTION
db.appliances.insertOne({
  applianceId: "APP-001",
  userId: "user-demo-001",
  applianceName: "Air Conditioner",
  category: "HVAC",
  powerConsumption_kWh: 2.5,
  ratedPower_watts: 1500,
  threshold_kWh: 3.0,
  thresholdStatus: "normal",
  notificationMessage: null,
  isActive: true,
  timestamp: new Date(),
  createdAt: new Date(),
  updatedAt: new Date()
});

db.appliances.createIndex({ userId: 1 });
db.appliances.createIndex({ userId: 1, thresholdStatus: 1 });

// 4. INCENTIVE POINTS COLLECTION
db.incentivePoints.insertOne({
  pointsId: "points-001",
  userId: "user-demo-001",
  timestamp: new Date(),
  energySaved_kWh: 4.5,
  pointsEarned: 150,
  totalPoints: 1250,
  rewardLevel: "gold",
  createdAt: new Date()
});

db.incentivePoints.createIndex({ userId: 1, timestamp: -1 });
db.incentivePoints.createIndex({ userId: 1, totalPoints: -1 });

// 5. SYSTEM PREFERENCES COLLECTION
db.systemPreferences.insertOne({
  preferenceId: "pref-001",
  userId: "user-demo-001",
  languagePreference: "English",
  themePreference: "Light",
  dateRangeType: "preset",
  dateRangePreset: 30,
  customStartDate: null,
  customEndDate: null,
  notificationsEnabled: true,
  soundAlertsEnabled: true,
  createdAt: new Date(),
  updatedAt: new Date()
});

db.systemPreferences.createIndex({ userId: 1 }, { unique: true });

// 6. PANEL HEALTH COLLECTION
db.panelHealth.insertOne({
  panelId: "PANEL-001",
  userId: "user-demo-001",
  panelNumber: 1,
  status: "healthy",
  currentOutput_kW: 0.42,
  expectedOutput_kW: 0.42,
  temperature_celsius: 45.5,
  voltage_volts: 48.2,
  errorCode: null,
  errorType: null,
  alertMessage: null,
  timestamp: new Date(),
  createdAt: new Date(),
  updatedAt: new Date()
});

db.panelHealth.createIndex({ panelId: 1 }, { unique: true });
db.panelHealth.createIndex({ userId: 1, status: 1 });
db.panelHealth.createIndex({ userId: 1, panelNumber: 1 }, { unique: true });

// 7. NOTIFICATIONS COLLECTION
db.notifications.insertOne({
  notificationId: "notif-001",
  userId: "user-demo-001",
  type: "warning",
  category: "panel",
  message: "Panel output below threshold",
  timestamp: new Date(),
  resolved: false,
  resolvedAt: null,
  isRead: false
});

db.notifications.createIndex({ userId: 1, resolved: 1, timestamp: -1 });
db.notifications.createIndex({ type: 1 });

// 8. ACCESSIBILITY SETTINGS COLLECTION
db.accessibilitySettings.insertOne({
  accessibilityId: "access-001",
  userId: "user-demo-001",
  screenReaderEnabled: false,
  highContrastMode: false,
  fontSize: "medium",
  reducedMotion: false,
  keyboardNavigation: true,
  createdAt: new Date(),
  updatedAt: new Date()
});

db.accessibilitySettings.createIndex({ userId: 1 }, { unique: true });

// 9. PANEL ALERTS COLLECTION
db.panelAlerts.insertOne({
  alertId: "alert-001",
  panelId: "PANEL-001",
  userId: "user-demo-001",
  errorCode: "ERR_001",
  errorType: "LOW_OUTPUT",
  severity: "warning",
  message: "Panel output below threshold",
  detailedMessage: "Panel PANEL-001 producing 0.25kW instead of 0.42kW",
  timestamp: new Date(),
  resolved: false,
  resolvedAt: null,
  resolvedBy: null,
  resolutionNotes: null
});

db.panelAlerts.createIndex({ userId: 1, resolved: 1, timestamp: -1 });
db.panelAlerts.createIndex({ panelId: 1, timestamp: -1 });

// 10. APPLIANCE ALERTS COLLECTION
db.applianceAlerts.insertOne({
  alertId: "app-alert-001",
  applianceId: "APP-001",
  userId: "user-demo-001",
  alertType: "overuse",
  severity: "warning",
  message: "AC consuming excessive power",
  timestamp: new Date(),
  resolved: false
});

db.applianceAlerts.createIndex({ userId: 1, resolved: 1 });
db.applianceAlerts.createIndex({ applianceId: 1, timestamp: -1 });
