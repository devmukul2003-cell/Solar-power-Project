// Enhanced Smart Energy Dashboard - Configuration File
// Central configuration for all system settings and parameters

const config = {
  // ============================================
  // APPLICATION SETTINGS
  // ============================================
  app: {
    name: "Enhanced Smart Energy Dashboard",
    version: "2.0.0",
    description: "Real-time solar energy monitoring with panel health tracking",
    author: "Smart Energy Team",
    defaultLanguage: "en",
    defaultTheme: "light",
    supportedLanguages: ["en", "hi"],
    supportedThemes: ["light", "dark"]
  },

  // ============================================
  // SOLAR PANEL CONFIGURATION
  // ============================================
  solar: {
    numberOfPanels: 12,
    capacityPerPanel: 0.42, // kW (420W per panel)
    totalSystemCapacity: 5.04, // kW (12 panels × 420W)
    monitoringInterval: 15000, // milliseconds (15 seconds)
    operatingHoursStart: 6, // 6 AM
    operatingHoursEnd: 18, // 6 PM
    peakHour: 12, // Noon
    expectedOutputThreshold: 0.7, // 70% of expected output
    normalVariation: 0.1 // ±10% normal fluctuation
  },

  // ============================================
  // PANEL HEALTH MONITORING
  // ============================================
  panelHealth: {
    enabled: true,
    checkInterval: 15000, // milliseconds (15 seconds)
    issueSimulationProbability: 0.05, // 5% chance of issue per check
    
    // Temperature Thresholds
    temperature: {
      normal: 25, // °C base temperature
      warning: 75, // °C warning threshold
      critical: 85, // °C critical threshold
      maxOperating: 95 // °C maximum safe operating temperature
    },
    
    // Voltage Thresholds
    voltage: {
      nominal: 48, // V nominal voltage
      min: 45, // V minimum acceptable
      max: 51, // V maximum acceptable
      fluctuationTolerance: 3 // ±3V tolerance
    },
    
    // Output Thresholds
    output: {
      lowOutputThreshold: 0.7, // 70% of expected
      degradationThreshold: 0.75, // 75% of expected
      physicalDamageThreshold: 0.4, // 40% of expected
      connectivityThreshold: 0 // 0% indicates no connection
    },
    
    // Error Codes Configuration
    errorCodes: {
      LOW_OUTPUT: {
        code: "ERR_001",
        severity: "warning",
        priority: 2,
        autoResolve: false
      },
      CONNECTIVITY_ISSUE: {
        code: "ERR_002",
        severity: "defective",
        priority: 1,
        autoResolve: false
      },
      OVERHEATING: {
        code: "ERR_003",
        severity: "warning",
        priority: 2,
        autoResolve: true
      },
      CRITICAL_OVERHEATING: {
        code: "ERR_004",
        severity: "defective",
        priority: 1,
        autoResolve: false
      },
      VOLTAGE_FLUCTUATION: {
        code: "ERR_005",
        severity: "warning",
        priority: 3,
        autoResolve: true
      },
      PHYSICAL_DAMAGE: {
        code: "ERR_006",
        severity: "defective",
        priority: 1,
        autoResolve: false
      },
      DEGRADATION: {
        code: "ERR_007",
        severity: "warning",
        priority: 3,
        autoResolve: false
      }
    }
  },

  // ============================================
  // ALERT SYSTEM CONFIGURATION
  // ============================================
  alerts: {
    enabled: true,
    maxRetention: 100, // Keep last 100 alerts
    displayRecentCount: 5, // Show 5 most recent in panel
    
    // Notification Settings
    notifications: {
      enabled: true,
      duration: 10000, // milliseconds (10 seconds)
      position: "top-right",
      soundEnabled: true,
      soundForCriticalOnly: true,
      autoClose: true
    },
    
    // Alert Filters
    filters: {
      default: "all",
      available: ["all", "unresolved", "resolved", "critical"]
    },
    
    // Auto-Resolution
    autoResolve: {
      enabled: false,
      timeoutMinutes: 60, // Auto-resolve after 60 minutes if issue cleared
      requiresConfirmation: true
    }
  },

  // ============================================
  // REAL-TIME DATA ENGINE
  // ============================================
  dataEngine: {
    updateInterval: 10000, // milliseconds (10 seconds)
    historicalDataDays: 100, // Keep 100 days of historical data
    minuteDataRetentionHours: 24, // Keep 24 hours of minute-level data
    hourlyDataRetentionDays: 30, // Keep 30 days of hourly data
    
    // Data Generation
    simulation: {
      enabled: true,
      realisticPatterns: true,
      seasonalVariation: true,
      weatherEffects: false // Future feature
    }
  },

  // ============================================
  // PRICING & CALCULATIONS
  // ============================================
  pricing: {
    currency: "₹",
    currencySymbol: "₹",
    pricePerKwh: 8, // ₹8 per kWh
    gridPricePerKwh: 8,
    solarPricePerKwh: 0, // Free solar energy
    
    // Environmental Impact
    co2PerKwh: 0.82, // kg CO₂ per kWh from grid
    treesPerKgCo2: 0.05, // 1 tree absorbs ~20kg CO₂ per year
    carKmPerKgCo2: 5.5 // 1kg CO₂ = 5.5km of car travel
  },

  // ============================================
  // INCENTIVE POINTS SYSTEM
  // ============================================
  incentives: {
    enabled: true,
    
    // Points Calculation
    basePointsPerKwh: 1, // 1 point per kWh of solar used
    
    // Bonus Points
    bonusPoints: {
      solarPercentage80Plus: 100,
      solarPercentage60Plus: 50,
      solarPercentage40Plus: 25,
      co2ReductionPer10Kg: 1
    },
    
    // Reward Levels
    rewardLevels: {
      bronze: { min: 0, max: 499, name: "Bronze", icon: "🥉" },
      silver: { min: 500, max: 999, name: "Silver", icon: "🥈" },
      gold: { min: 1000, max: 1999, name: "Gold", icon: "🥇" },
      platinum: { min: 2000, max: Infinity, name: "Platinum", icon: "💎" }
    },
    
    // Progress
    pointsPerLevel: 500
  },

  // ============================================
  // USER INTERFACE SETTINGS
  // ============================================
  ui: {
    // Dashboard Layout
    layout: {
      showSessionInfo: true,
      showIncentiveCard: true,
      showPanelHealth: true,
      showAlertsPanel: true,
      showCharts: true,
      showImpactSection: true
    },
    
    // Date Range Options
    dateRanges: {
      default: 30,
      options: [7, 30, 90, 100],
      customRangeEnabled: true
    },
    
    // View Types
    viewTypes: {
      default: "daily",
      options: ["daily", "weekly", "monthly"]
    },
    
    // Chart Settings
    charts: {
      animationDuration: 750, // milliseconds
      updateAnimation: false, // Disable for real-time updates
      responsive: true,
      maintainAspectRatio: true,
      colors: {
        solar: "#fbbf24",
        consumption: "#3b82f6",
        grid: "#ef4444",
        savings: "#10b981"
      }
    },
    
    // Notification Settings
    notifications: {
      position: "bottom-right",
      duration: 3000, // milliseconds
      maxVisible: 3
    }
  },

  // ============================================
  // AUTHENTICATION SETTINGS
  // ============================================
  auth: {
    sessionTimeout: 86400000, // 24 hours in milliseconds
    rememberMe: true,
    autoLogoutOnInactivity: false,
    inactivityTimeout: 1800000, // 30 minutes
    
    // Password Requirements
    password: {
      minLength: 6,
      requireUppercase: false,
      requireLowercase: false,
      requireNumbers: false,
      requireSpecialChars: false
    },
    
    // Demo Account
    demo: {
      enabled: true,
      email: "demo@energy.com",
      password: "demo123"
    }
  },

  // ============================================
  // DATA STORAGE SETTINGS
  // ============================================
  storage: {
    type: "localStorage", // localStorage, sessionStorage, or indexedDB
    prefix: "smartEnergy_", // Prefix for all storage keys
    
    // Storage Keys
    keys: {
      users: "smartEnergyUsers",
      currentUser: "currentUser",
      preferences: "preferences_",
      panelHealth: "panelHealth_",
      panelAlerts: "panelAlerts_",
      energyData: "energyData_",
      currentData: "currentData_"
    },
    
    // Data Retention
    retention: {
      clearOnLogout: false,
      autoCleanup: true,
      maxStorageSize: 10485760 // 10MB
    }
  },

  // ============================================
  // EXPORT SETTINGS
  // ============================================
  export: {
    formats: ["csv", "json", "pdf"],
    defaultFormat: "csv",
    
    // CSV Settings
    csv: {
      delimiter: ",",
      includeHeaders: true,
      dateFormat: "YYYY-MM-DD",
      encoding: "utf-8"
    },
    
    // File Naming
    fileNaming: {
      prefix: "energy-data",
      includeDate: true,
      includeUserId: false,
      dateFormat: "YYYY-MM-DD"
    }
  },

  // ============================================
  // PERFORMANCE SETTINGS
  // ============================================
  performance: {
    // Debouncing
    debounce: {
      search: 300, // milliseconds
      resize: 150,
      scroll: 100
    },
    
    // Throttling
    throttle: {
      chartUpdate: 1000, // milliseconds
      statsUpdate: 5000
    },
    
    // Lazy Loading
    lazyLoad: {
      enabled: true,
      threshold: 0.1 // Load when 10% visible
    },
    
    // Caching
    cache: {
      enabled: true,
      duration: 300000 // 5 minutes
    }
  },

  // ============================================
  // FEATURE FLAGS
  // ============================================
  features: {
    panelHealthMonitoring: true,
    incentivePoints: true,
    multiLanguage: true,
    darkMode: true,
    customDateRange: true,
    dataExport: true,
    realTimeUpdates: true,
    notifications: true,
    soundAlerts: true,
    chartAnimations: true,
    environmentalImpact: true,
    maintenanceHistory: true,
    
    // Future Features (Coming Soon)
    weatherIntegration: false,
    predictiveMaintenance: false,
    mobileApp: false,
    apiIntegration: false,
    cloudSync: false,
    multiUserSupport: false,
    advancedAnalytics: false
  },

  // ============================================
  // API CONFIGURATION (Future Use)
  // ============================================
  api: {
    enabled: false,
    baseUrl: "https://api.smartenergy.com",
    timeout: 30000, // milliseconds
    retries: 3,
    retryDelay: 1000, // milliseconds
    
    endpoints: {
      auth: "/auth",
      panels: "/panels",
      alerts: "/alerts",
      data: "/data",
      export: "/export"
    },
    
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    }
  },

  // ============================================
  // LOGGING & DEBUGGING
  // ============================================
  logging: {
    enabled: true,
    level: "info", // error, warn, info, debug
    console: true,
    storage: false,
    
    // Log Categories
    categories: {
      auth: true,
      dataEngine: true,
      panelHealth: true,
      alerts: true,
      ui: true,
      performance: true
    }
  },

  // ============================================
  // DEVELOPMENT SETTINGS
  // ============================================
  development: {
    mode: "production", // development, staging, production
    debugMode: false,
    mockData: true,
    showPerformanceMetrics: false,
    verboseLogging: false,
    
    // Testing
    testing: {
      enabled: false,
      autoGenerateIssues: true,
      issueFrequency: 30000 // milliseconds
    }
  },

  // ============================================
  // ACCESSIBILITY SETTINGS
  // ============================================
  accessibility: {
    highContrast: false,
    fontSize: "medium", // small, medium, large
    reducedMotion: false,
    screenReaderOptimized: true,
    keyboardNavigation: true,
    focusIndicators: true
  },

  // ============================================
  // LOCALIZATION SETTINGS
  // ============================================
  localization: {
    defaultLocale: "en-US",
    supportedLocales: ["en-US", "hi-IN"],
    dateFormat: "MM/DD/YYYY",
    timeFormat: "12h", // 12h or 24h
    numberFormat: "en-US",
    currencyFormat: "INR"
  },

  // ============================================
  // SECURITY SETTINGS
  // ============================================
  security: {
    encryptLocalStorage: false,
    sanitizeInputs: true,
    preventXSS: true,
    csrfProtection: false, // Enable when using backend
    
    // Rate Limiting
    rateLimit: {
      enabled: false,
      maxRequests: 100,
      windowMs: 60000 // 1 minute
    }
  },

  // ============================================
  // NOTIFICATION MESSAGES
  // ============================================
  messages: {
    success: {
      login: "Login successful! Redirecting...",
      signup: "Account created successfully! Please log in.",
      logout: "Logged out successfully",
      alertResolved: "Alert marked as resolved",
      dataExported: "Data exported successfully",
      themeChanged: "Theme updated",
      languageChanged: "Language updated"
    },
    
    error: {
      loginFailed: "Invalid email or password",
      signupFailed: "User already exists",
      networkError: "Network error. Please try again.",
      exportFailed: "Failed to export data",
      invalidInput: "Please check your input"
    },
    
    warning: {
      lowOutput: "Panel output below threshold",
      overheating: "Panel temperature high",
      connectivity: "Panel connection lost"
    }
  }
};

// ============================================
// CONFIGURATION VALIDATION
// ============================================
function validateConfig() {
  const errors = [];
  
  // Validate solar configuration
  if (config.solar.numberOfPanels <= 0) {
    errors.push("Number of panels must be greater than 0");
  }
  
  if (config.solar.capacityPerPanel <= 0) {
    errors.push("Panel capacity must be greater than 0");
  }
  
  // Validate thresholds
  if (config.panelHealth.temperature.warning >= config.panelHealth.temperature.critical) {
    errors.push("Warning temperature must be less than critical temperature");
  }
  
  // Validate intervals
  if (config.solar.monitoringInterval < 1000) {
    errors.push("Monitoring interval should be at least 1000ms");
  }
  
  if (errors.length > 0) {
    console.error("Configuration validation errors:", errors);
    return false;
  }
  
  return true;
}

// ============================================
// CONFIGURATION HELPERS
// ============================================
const configHelpers = {
  // Get configuration value by path
  get(path) {
    return path.split('.').reduce((obj, key) => obj?.[key], config);
  },
  
  // Check if feature is enabled
  isFeatureEnabled(feature) {
    return config.features[feature] === true;
  },
  
  // Get error code configuration
  getErrorCode(errorType) {
    return config.panelHealth.errorCodes[errorType];
  },
  
  // Get reward level by points
  getRewardLevel(points) {
    const levels = config.incentives.rewardLevels;
    for (const [key, level] of Object.entries(levels)) {
      if (points >= level.min && points <= level.max) {
        return { key, ...level };
      }
    }
    return levels.bronze;
  },
  
  // Get storage key
  getStorageKey(key, userId = '') {
    return config.storage.prefix + config.storage.keys[key] + userId;
  }
};

// Validate configuration on load
if (typeof window !== 'undefined') {
  validateConfig();
}

// Export configuration
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { config, configHelpers };
}

// Make available globally
if (typeof window !== 'undefined') {
  window.dashboardConfig = config;
  window.configHelpers = configHelpers;
}
