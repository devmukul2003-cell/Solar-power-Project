// ============================================
// Enhanced Smart Energy Dashboard
// MongoDB/NoSQL Database Schema
// ============================================

// ============================================
// 1. USERS COLLECTION
// ============================================
db.createCollection("users", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "email", "password", "signupDate", "sessionStatus"],
      properties: {
        _id: {
          bsonType: "objectId",
          description: "Unique user identifier"
        },
        userId: {
          bsonType: "string",
          description: "Custom user ID"
        },
        name: {
          bsonType: "string",
          minLength: 1,
          maxLength: 100,
          description: "User's full name"
        },
        email: {
          bsonType: "string",
          pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
          description: "User's email address (unique)"
        },
        password: {
          bsonType: "string",
          description: "Hashed password (bcrypt/argon2)"
        },
        signupDate: {
          bsonType: "date",
          description: "Account creation date"
        },
        lastLogin: {
          bsonType: ["date", "null"],
          description: "Last login timestamp"
        },
        sessionStatus: {
          enum: ["logged_in", "logged_out"],
          description: "Current session status"
        },
        isActive: {
          bsonType: "bool",
          description: "Account active status"
        },
        emailVerified: {
          bsonType: "bool",
          description: "Email verification status"
        },
        profile: {
          bsonType: "object",
          properties: {
            image: { bsonType: "string" },
            phoneNumber: { bsonType: "string" },
            address: { bsonType: "string" }
          }
        },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" }
      }
    }
  }
});

// Create indexes for users collection
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ userId: 1 }, { unique: true });
db.users.createIndex({ sessionStatus: 1 });
db.users.createIndex({ lastLogin: -1 });

// Sample user document
const sampleUser = {
  userId: "user-001",
  name: "Demo User",
  email: "demo@energy.com",
  password: "$2a$10$hashedpassword",
  signupDate: new Date(),
  lastLogin: null,
  sessionStatus: "logged_out",
  isActive: true,
  emailVerified: false,
  profile: {
    image: null,
    phoneNumber: null,
    address: null
  },
  createdAt: new Date(),
  updatedAt: new Date()
};

// ============================================
// 2. ENERGY DATA COLLECTION
// ============================================
db.createCollection("energyData", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["userId", "timestamp", "solarProduced_kWh", "householdConsumed_kWh"],
      properties: {
        _id: { bsonType: "objectId" },
        recordId: { bsonType: "string" },
        userId: { bsonType: "string" },
        timestamp: { bsonType: "date" },
        solarProduced_kWh: { bsonType: "double", minimum: 0 },
        householdConsumed_kWh: { bsonType: "double", minimum: 0 },
        gridConsumed_kWh: { bsonType: "double", minimum: 0 },
        excessSolar_kWh: { bsonType: "double", minimum: 0 },
        moneySaved_inr: { bsonType: "double", minimum: 0 },
        co2Reduced_kg: { bsonType: "double", minimum: 0 },
        efficiency_percent: { bsonType: "double" },
        temperature_celsius: { bsonType: "double" },
        weatherCondition: { bsonType: "string" },
        dataType: { enum: ["minute", "hourly", "daily", "monthly"] }
      }
    }
  }
});

// Create indexes for energyData collection
db.energyData.createIndex({ userId: 1, timestamp: -1 });
db.energyData.createIndex({ timestamp: -1 });
db.energyData.createIndex({ dataType: 1 });
db.energyData.createIndex({ userId: 1, dataType: 1, timestamp: -1 });

// Sample energy data document
const sampleEnergyData = {
  recordId: "record-001",
  userId: "user-001",
  timestamp: new Date(),
  solarProduced_kWh: 4.5,
  householdConsumed_kWh: 3.2,
  gridConsumed_kWh: 0,
  excessSolar_kWh: 1.3,
  moneySaved_inr: 36.00,
  co2Reduced_kg: 3.69,
  efficiency_percent: 95.5,
  temperature_celsius: 28.5,
  weatherCondition: "sunny",
  dataType: "hourly",
  createdAt: new Date()
};

// ============================================
// 3. APPLIANCES COLLECTION
// ============================================
db.createCollection("appliances", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["userId", "applianceName", "powerConsumption_kWh", "threshold_kWh"],
      properties: {
        _id: { bsonType: "objectId" },
        applianceId: { bsonType: "string" },
        userId: { bsonType: "string" },
        applianceName: { bsonType: "string" },
        category: { bsonType: "string" },
        powerConsumption_kWh: { bsonType: "double", minimum: 0 },
        ratedPower_watts: { bsonType: "int", minimum: 0 },
        usageHours_daily: { bsonType: "double", minimum: 0 },
        threshold_kWh: { bsonType: "double", minimum: 0 },
        thresholdStatus: { enum: ["normal", "high", "critical"] },
        notificationMessage: { bsonType: "string" },
        lastNotificationSent: { bsonType: "date" },
        isActive: { bsonType: "bool" },
        installDate: { bsonType: "date" },
        lastMaintenanceDate: { bsonType: "date" },
        usageHistory: {
          bsonType: "array",
          items: {
            bsonType: "object",
            properties: {
              timestamp: { bsonType: "date" },
              powerConsumed_kWh: { bsonType: "double" },
              duration_minutes: { bsonType: "int" },
              cost_inr: { bsonType: "double" }
            }
          }
        }
      }
    }
  }
});

// Create indexes for appliances collection
db.appliances.createIndex({ userId: 1 });
db.appliances.createIndex({ userId: 1, thresholdStatus: 1 });
db.appliances.createIndex({ applianceId: 1 }, { unique: true });

// Sample appliance document
const sampleAppliance = {
  applianceId: "appliance-001",
  userId: "user-001",
  applianceName: "Air Conditioner",
  category: "HVAC",
  powerConsumption_kWh: 2.5,
  ratedPower_watts: 1500,
  usageHours_daily: 8,
  threshold_kWh: 3.0,
  thresholdStatus: "normal",
  notificationMessage: null,
  lastNotificationSent: null,
  isActive: true,
  installDate: new Date("2023-01-15"),
  lastMaintenanceDate: new Date("2024-01-15"),
  usageHistory: [
    {
      timestamp: new Date(),
      powerConsumed_kWh: 2.5,
      duration_minutes: 480,
      cost_inr: 20.00,
      peakHourUsage: false
    }
  ],
  createdAt: new Date(),
  updatedAt: new Date()
};

// ============================================
// 4. INCENTIVE POINTS COLLECTION
// ============================================
db.createCollection("incentivePoints", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["userId", "energySaved_kWh", "pointsEarned", "totalPoints"],
      properties: {
        _id: { bsonType: "objectId" },
        pointsId: { bsonType: "string" },
        userId: { bsonType: "string" },
        timestamp: { bsonType: "date" },
        energySaved_kWh: { bsonType: "double", minimum: 0 },
        solarPercentage: { bsonType: "double" },
        pointsEarned: { bsonType: "int" },
        pointsType: { enum: ["base", "bonus", "penalty", "reward"] },
        description: { bsonType: "string" },
        totalPoints: { bsonType: "int", minimum: 0 },
        rewardLevel: { enum: ["bronze", "silver", "gold", "platinum"] }
      }
    }
  }
});

// Create indexes for incentivePoints collection
db.incentivePoints.createIndex({ userId: 1, timestamp: -1 });
db.incentivePoints.createIndex({ userId: 1, totalPoints: -1 });
db.incentivePoints.createIndex({ rewardLevel: 1 });

// Sample incentive points document
const sampleIncentivePoints = {
  pointsId: "points-001",
  userId: "user-001",
  timestamp: new Date(),
  energySaved_kWh: 4.5,
  solarPercentage: 85.5,
  pointsEarned: 150,
  pointsType: "bonus",
  description: "High solar usage bonus",
  totalPoints: 1250,
  rewardLevel: "gold",
  createdAt: new Date()
};

// ============================================
// 5. SYSTEM PREFERENCES COLLECTION
// ============================================
db.createCollection("systemPreferences", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["userId"],
      properties: {
        _id: { bsonType: "objectId" },
        preferenceId: { bsonType: "string" },
        userId: { bsonType: "string" },
        languagePreference: { enum: ["English", "Hindi"] },
        themePreference: { enum: ["Light", "Dark"] },
        dateRange: {
          bsonType: "object",
          properties: {
            type: { enum: ["preset", "custom"] },
            preset: { bsonType: "int" },
            customStartDate: { bsonType: "date" },
            customEndDate: { bsonType: "date" }
          }
        },
        notifications: {
          bsonType: "object",
          properties: {
            enabled: { bsonType: "bool" },
            soundAlerts: { bsonType: "bool" },
            email: { bsonType: "bool" },
            sms: { bsonType: "bool" }
          }
        },
        display: {
          bsonType: "object",
          properties: {
            currency: { bsonType: "string" },
            timezone: { bsonType: "string" },
            dateFormat: { bsonType: "string" },
            timeFormat: { enum: ["12h", "24h"] }
          }
        }
      }
    }
  }
});

// Create indexes for systemPreferences collection
db.systemPreferences.createIndex({ userId: 1 }, { unique: true });

// Sample system preferences document
const samplePreferences = {
  preferenceId: "pref-001",
  userId: "user-001",
  languagePreference: "English",
  themePreference: "Light",
  dateRange: {
    type: "preset",
    preset: 30,
    customStartDate: null,
    customEndDate: null
  },
  notifications: {
    enabled: true,
    soundAlerts: true,
    email: false,
    sms: false
  },
  display: {
    currency: "INR",
    timezone: "Asia/Kolkata",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "12h"
  },
  createdAt: new Date(),
  updatedAt: new Date()
};

// ============================================
// 6. PANEL HEALTH COLLECTION
// ============================================
db.createCollection("panelHealth", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["panelId", "userId", "panelNumber", "status"],
      properties: {
        _id: { bsonType: "objectId" },
        panelId: { bsonType: "string" },
        userId: { bsonType: "string" },
        panelNumber: { bsonType: "int", minimum: 1 },
        status: { enum: ["healthy", "warning", "defective"] },
        currentOutput_kW: { bsonType: "double", minimum: 0 },
        expectedOutput_kW: { bsonType: "double", minimum: 0 },
        temperature_celsius: { bsonType: "double" },
        voltage_volts: { bsonType: "double" },
        errorCodes: {
          bsonType: "array",
          items: { bsonType: "string" }
        },
        alerts: {
          bsonType: "array",
          items: {
            bsonType: "object",
            properties: {
              errorCode: { bsonType: "string" },
              errorType: { bsonType: "string" },
              message: { bsonType: "string" },
              timestamp: { bsonType: "date" }
            }
          }
        },
        lastCheckTimestamp: { bsonType: "date" },
        installDate: { bsonType: "date" },
        lastMaintenanceDate: { bsonType: "date" },
        totalUptime_hours: { bsonType: "int", minimum: 0 },
        efficiency_percent: { bsonType: "double" },
        maintenanceHistory: {
          bsonType: "array",
          items: {
            bsonType: "object",
            properties: {
              date: { bsonType: "date" },
              issue: { bsonType: "string" },
              resolvedBy: { bsonType: "string" },
              notes: { bsonType: "string" }
            }
          }
        }
      }
    }
  }
});

// Create indexes for panelHealth collection
db.panelHealth.createIndex({ panelId: 1 }, { unique: true });
db.panelHealth.createIndex({ userId: 1, status: 1 });
db.panelHealth.createIndex({ userId: 1, panelNumber: 1 }, { unique: true });
db.panelHealth.createIndex({ lastCheckTimestamp: -1 });

// Sample panel health document
const samplePanelHealth = {
  panelId: "PANEL-001",
  userId: "user-001",
  panelNumber: 1,
  status: "healthy",
  currentOutput_kW: 0.42,
  expectedOutput_kW: 0.42,
  temperature_celsius: 45.5,
  voltage_volts: 48.2,
  errorCodes: [],
  alerts: [],
  lastCheckTimestamp: new Date(),
  installDate: new Date("2023-01-01"),
  lastMaintenanceDate: new Date("2024-01-01"),
  totalUptime_hours: 8760,
  efficiency_percent: 98.5,
  maintenanceHistory: [
    {
      date: new Date("2024-01-01"),
      issue: "Routine cleaning",
      resolvedBy: "Maintenance Team",
      notes: "Panel cleaned and inspected"
    }
  ],
  createdAt: new Date(),
  updatedAt: new Date()
};

// ============================================
// 7. PANEL ALERTS COLLECTION
// ============================================
db.createCollection("panelAlerts", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["panelId", "userId", "errorCode", "severity", "message"],
      properties: {
        _id: { bsonType: "objectId" },
        alertId: { bsonType: "string" },
        panelId: { bsonType: "string" },
        userId: { bsonType: "string" },
        errorCode: { bsonType: "string" },
        errorType: { bsonType: "string" },
        severity: { enum: ["warning", "defective", "critical"] },
        status: { enum: ["healthy", "warning", "defective"] },
        message: { bsonType: "string" },
        detailedMessage: { bsonType: "string" },
        timestamp: { bsonType: "date" },
        resolved: { bsonType: "bool" },
        resolvedAt: { bsonType: "date" },
        resolvedBy: { bsonType: "string" },
        resolutionNotes: { bsonType: "string" },
        notificationSent: { bsonType: "bool" }
      }
    }
  }
});

// Create indexes for panelAlerts collection
db.panelAlerts.createIndex({ alertId: 1 }, { unique: true });
db.panelAlerts.createIndex({ userId: 1, resolved: 1, timestamp: -1 });
db.panelAlerts.createIndex({ panelId: 1, timestamp: -1 });
db.panelAlerts.createIndex({ severity: 1 });

// Sample panel alert document
const samplePanelAlert = {
  alertId: "ALERT-001",
  panelId: "PANEL-001",
  userId: "user-001",
  errorCode: "ERR_001",
  errorType: "LOW_OUTPUT",
  severity: "warning",
  status: "warning",
  message: "Panel output below expected threshold",
  detailedMessage: "Panel PANEL-001 is producing 0.25kW instead of expected 0.42kW",
  timestamp: new Date(),
  resolved: false,
  resolvedAt: null,
  resolvedBy: null,
  resolutionNotes: null,
  notificationSent: true,
  createdAt: new Date()
};

// ============================================
// 8. NOTIFICATIONS COLLECTION
// ============================================
db.createCollection("notifications", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["userId", "type", "category", "title", "message"],
      properties: {
        _id: { bsonType: "objectId" },
        notificationId: { bsonType: "string" },
        userId: { bsonType: "string" },
        type: { enum: ["alert", "info", "warning", "success"] },
        category: { enum: ["panel", "appliance", "energy", "system", "incentive"] },
        title: { bsonType: "string" },
        message: { bsonType: "string" },
        isRead: { bsonType: "bool" },
        readAt: { bsonType: "date" },
        priority: { enum: ["low", "medium", "high", "critical"] },
        actionUrl: { bsonType: "string" },
        timestamp: { bsonType: "date" },
        expiresAt: { bsonType: "date" }
      }
    }
  }
});

// Create indexes for notifications collection
db.notifications.createIndex({ userId: 1, isRead: 1, timestamp: -1 });
db.notifications.createIndex({ timestamp: -1 });
db.notifications.createIndex({ priority: 1 });
db.notifications.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// ============================================
// 9. AUDIT LOG COLLECTION
// ============================================
db.createCollection("auditLog", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["action", "timestamp"],
      properties: {
        _id: { bsonType: "objectId" },
        logId: { bsonType: "string" },
        userId: { bsonType: "string" },
        action: { bsonType: "string" },
        entityType: { bsonType: "string" },
        entityId: { bsonType: "string" },
        oldValue: { bsonType: "object" },
        newValue: { bsonType: "object" },
        ipAddress: { bsonType: "string" },
        userAgent: { bsonType: "string" },
        timestamp: { bsonType: "date" }
      }
    }
  }
});

// Create indexes for auditLog collection
db.auditLog.createIndex({ userId: 1, timestamp: -1 });
db.auditLog.createIndex({ action: 1 });
db.auditLog.createIndex({ timestamp: -1 });

// ============================================
// AGGREGATION PIPELINES
// ============================================

// Get user dashboard summary
const getUserDashboardSummary = (userId) => {
  return db.users.aggregate([
    { $match: { userId: userId } },
    {
      $lookup: {
        from: "systemPreferences",
        localField: "userId",
        foreignField: "userId",
        as: "preferences"
      }
    },
    {
      $lookup: {
        from: "incentivePoints",
        localField: "userId",
        foreignField: "userId",
        as: "points"
      }
    },
    {
      $lookup: {
        from: "panelHealth",
        localField: "userId",
        foreignField: "userId",
        as: "panels"
      }
    },
    {
      $project: {
        name: 1,
        email: 1,
        sessionStatus: 1,
        preferences: { $arrayElemAt: ["$preferences", 0] },
        totalPoints: { $sum: "$points.totalPoints" },
        rewardLevel: { $arrayElemAt: ["$points.rewardLevel", -1] },
        totalPanels: { $size: "$panels" },
        healthyPanels: {
          $size: {
            $filter: {
              input: "$panels",
              cond: { $eq: ["$$this.status", "healthy"] }
            }
          }
        },
        warningPanels: {
          $size: {
            $filter: {
              input: "$panels",
              cond: { $eq: ["$$this.status", "warning"] }
            }
          }
        },
        defectivePanels: {
          $size: {
            $filter: {
              input: "$panels",
              cond: { $eq: ["$$this.status", "defective"] }
            }
          }
        }
      }
    }
  ]);
};

// Get energy statistics for date range
const getEnergyStatistics = (userId, startDate, endDate) => {
  return db.energyData.aggregate([
    {
      $match: {
        userId: userId,
        timestamp: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: null,
        totalSolarProduced: { $sum: "$solarProduced_kWh" },
        totalConsumed: { $sum: "$householdConsumed_kWh" },
        totalGridUsed: { $sum: "$gridConsumed_kWh" },
        totalMoneySaved: { $sum: "$moneySaved_inr" },
        totalCO2Reduced: { $sum: "$co2Reduced_kg" },
        avgEfficiency: { $avg: "$efficiency_percent" }
      }
    }
  ]);
};

// ============================================
// EXPORT SCHEMA
// ============================================
module.exports = {
  collections: {
    users: sampleUser,
    energyData: sampleEnergyData,
    appliances: sampleAppliance,
    incentivePoints: sampleIncentivePoints,
    systemPreferences: samplePreferences,
    panelHealth: samplePanelHealth,
    panelAlerts: samplePanelAlert
  },
  aggregations: {
    getUserDashboardSummary,
    getEnergyStatistics
  }
};
