-- ============================================
-- Enhanced Smart Energy Dashboard
-- SQL Database Schema (MySQL/PostgreSQL)
-- ============================================

-- ============================================
-- 1. USERS TABLE
-- ============================================
CREATE TABLE Users (
    userId VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL, -- Hashed password (bcrypt/argon2)
    signupDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    lastLogin TIMESTAMP NULL,
    sessionStatus ENUM('logged_in', 'logged_out') DEFAULT 'logged_out',
    isActive BOOLEAN DEFAULT TRUE,
    emailVerified BOOLEAN DEFAULT FALSE,
    profileImage VARCHAR(500) NULL,
    phoneNumber VARCHAR(20) NULL,
    address TEXT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_email (email),
    INDEX idx_sessionStatus (sessionStatus),
    INDEX idx_lastLogin (lastLogin)
);

-- ============================================
-- 2. ENERGY DATA TABLE
-- ============================================
CREATE TABLE EnergyData (
    recordId VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    userId VARCHAR(36) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    solarProduced_kWh DECIMAL(10, 3) NOT NULL DEFAULT 0.000,
    householdConsumed_kWh DECIMAL(10, 3) NOT NULL DEFAULT 0.000,
    gridConsumed_kWh DECIMAL(10, 3) NOT NULL DEFAULT 0.000,
    excessSolar_kWh DECIMAL(10, 3) NOT NULL DEFAULT 0.000,
    moneySaved_inr DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    co2Reduced_kg DECIMAL(10, 3) NOT NULL DEFAULT 0.000,
    efficiency_percent DECIMAL(5, 2) NULL,
    temperature_celsius DECIMAL(5, 2) NULL,
    weatherCondition VARCHAR(50) NULL,
    dataType ENUM('minute', 'hourly', 'daily', 'monthly') DEFAULT 'hourly',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (userId) REFERENCES Users(userId) ON DELETE CASCADE,
    INDEX idx_userId_timestamp (userId, timestamp),
    INDEX idx_timestamp (timestamp),
    INDEX idx_dataType (dataType)
);

-- ============================================
-- 3. APPLIANCES TABLE
-- ============================================
CREATE TABLE Appliances (
    applianceId VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    userId VARCHAR(36) NOT NULL,
    applianceName VARCHAR(100) NOT NULL,
    category VARCHAR(50) NULL, -- AC, Refrigerator, Washing Machine, etc.
    powerConsumption_kWh DECIMAL(10, 3) NOT NULL DEFAULT 0.000,
    ratedPower_watts INT NOT NULL,
    usageHours_daily DECIMAL(5, 2) DEFAULT 0.00,
    threshold_kWh DECIMAL(10, 3) NOT NULL,
    thresholdStatus ENUM('normal', 'high', 'critical') DEFAULT 'normal',
    notificationMessage TEXT NULL,
    lastNotificationSent TIMESTAMP NULL,
    isActive BOOLEAN DEFAULT TRUE,
    installDate DATE NULL,
    lastMaintenanceDate DATE NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (userId) REFERENCES Users(userId) ON DELETE CASCADE,
    INDEX idx_userId (userId),
    INDEX idx_thresholdStatus (thresholdStatus),
    INDEX idx_timestamp (timestamp)
);

-- ============================================
-- 4. APPLIANCE USAGE HISTORY TABLE
-- ============================================
CREATE TABLE ApplianceUsageHistory (
    usageId VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    applianceId VARCHAR(36) NOT NULL,
    userId VARCHAR(36) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    powerConsumed_kWh DECIMAL(10, 3) NOT NULL,
    duration_minutes INT NOT NULL,
    cost_inr DECIMAL(10, 2) NOT NULL,
    peakHourUsage BOOLEAN DEFAULT FALSE,
    
    FOREIGN KEY (applianceId) REFERENCES Appliances(applianceId) ON DELETE CASCADE,
    FOREIGN KEY (userId) REFERENCES Users(userId) ON DELETE CASCADE,
    INDEX idx_applianceId_timestamp (applianceId, timestamp),
    INDEX idx_userId_timestamp (userId, timestamp)
);

-- ============================================
-- 5. INCENTIVE POINTS TABLE
-- ============================================
CREATE TABLE IncentivePoints (
    pointsId VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    userId VARCHAR(36) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    energySaved_kWh DECIMAL(10, 3) NOT NULL DEFAULT 0.000,
    solarPercentage DECIMAL(5, 2) NULL,
    pointsEarned INT NOT NULL DEFAULT 0,
    pointsType ENUM('base', 'bonus', 'penalty', 'reward') DEFAULT 'base',
    description TEXT NULL,
    totalPoints INT NOT NULL DEFAULT 0,
    rewardLevel ENUM('bronze', 'silver', 'gold', 'platinum') DEFAULT 'bronze',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (userId) REFERENCES Users(userId) ON DELETE CASCADE,
    INDEX idx_userId_timestamp (userId, timestamp),
    INDEX idx_rewardLevel (rewardLevel)
);

-- ============================================
-- 6. SYSTEM PREFERENCES TABLE
-- ============================================
CREATE TABLE SystemPreferences (
    preferenceId VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    userId VARCHAR(36) UNIQUE NOT NULL,
    languagePreference ENUM('English', 'Hindi') DEFAULT 'English',
    themePreference ENUM('Light', 'Dark') DEFAULT 'Light',
    dateRangeType ENUM('preset', 'custom') DEFAULT 'preset',
    dateRangePreset INT DEFAULT 30, -- 7, 30, 90, 100 days
    customStartDate DATE NULL,
    customEndDate DATE NULL,
    notificationsEnabled BOOLEAN DEFAULT TRUE,
    soundAlertsEnabled BOOLEAN DEFAULT TRUE,
    emailNotifications BOOLEAN DEFAULT FALSE,
    smsNotifications BOOLEAN DEFAULT FALSE,
    currency VARCHAR(10) DEFAULT 'INR',
    timezone VARCHAR(50) DEFAULT 'Asia/Kolkata',
    dateFormat VARCHAR(20) DEFAULT 'DD/MM/YYYY',
    timeFormat ENUM('12h', '24h') DEFAULT '12h',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (userId) REFERENCES Users(userId) ON DELETE CASCADE,
    INDEX idx_userId (userId)
);

-- ============================================
-- 7. PANEL HEALTH TABLE
-- ============================================
CREATE TABLE PanelHealth (
    panelId VARCHAR(36) PRIMARY KEY,
    userId VARCHAR(36) NOT NULL,
    panelNumber INT NOT NULL,
    status ENUM('healthy', 'warning', 'defective') DEFAULT 'healthy',
    currentOutput_kW DECIMAL(10, 3) DEFAULT 0.000,
    expectedOutput_kW DECIMAL(10, 3) DEFAULT 0.000,
    temperature_celsius DECIMAL(5, 2) NULL,
    voltage_volts DECIMAL(5, 2) NULL,
    errorCode VARCHAR(20) NULL,
    errorType VARCHAR(50) NULL,
    alertMessage TEXT NULL,
    detailedMessage TEXT NULL,
    lastCheckTimestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    installDate DATE NULL,
    lastMaintenanceDate DATE NULL,
    totalUptime_hours INT DEFAULT 0,
    efficiency_percent DECIMAL(5, 2) NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (userId) REFERENCES Users(userId) ON DELETE CASCADE,
    INDEX idx_userId_status (userId, status),
    INDEX idx_status (status),
    INDEX idx_lastCheckTimestamp (lastCheckTimestamp),
    UNIQUE KEY unique_user_panel (userId, panelNumber)
);

-- ============================================
-- 8. PANEL ALERTS TABLE
-- ============================================
CREATE TABLE PanelAlerts (
    alertId VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    panelId VARCHAR(36) NOT NULL,
    userId VARCHAR(36) NOT NULL,
    errorCode VARCHAR(20) NOT NULL,
    errorType VARCHAR(50) NOT NULL,
    severity ENUM('warning', 'defective', 'critical') NOT NULL,
    status ENUM('healthy', 'warning', 'defective') NOT NULL,
    message TEXT NOT NULL,
    detailedMessage TEXT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved BOOLEAN DEFAULT FALSE,
    resolvedAt TIMESTAMP NULL,
    resolvedBy VARCHAR(100) NULL,
    resolutionNotes TEXT NULL,
    notificationSent BOOLEAN DEFAULT FALSE,
    
    FOREIGN KEY (panelId) REFERENCES PanelHealth(panelId) ON DELETE CASCADE,
    FOREIGN KEY (userId) REFERENCES Users(userId) ON DELETE CASCADE,
    INDEX idx_userId_resolved (userId, resolved),
    INDEX idx_panelId_timestamp (panelId, timestamp),
    INDEX idx_severity (severity),
    INDEX idx_timestamp (timestamp)
);

-- ============================================
-- 9. MAINTENANCE HISTORY TABLE
-- ============================================
CREATE TABLE MaintenanceHistory (
    maintenanceId VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    panelId VARCHAR(36) NULL,
    applianceId VARCHAR(36) NULL,
    userId VARCHAR(36) NOT NULL,
    maintenanceType ENUM('panel', 'appliance', 'system') NOT NULL,
    issueType VARCHAR(100) NOT NULL,
    description TEXT NULL,
    performedBy VARCHAR(100) NOT NULL,
    maintenanceDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    cost_inr DECIMAL(10, 2) NULL,
    notes TEXT NULL,
    nextMaintenanceDate DATE NULL,
    
    FOREIGN KEY (panelId) REFERENCES PanelHealth(panelId) ON DELETE SET NULL,
    FOREIGN KEY (applianceId) REFERENCES Appliances(applianceId) ON DELETE SET NULL,
    FOREIGN KEY (userId) REFERENCES Users(userId) ON DELETE CASCADE,
    INDEX idx_userId_date (userId, maintenanceDate),
    INDEX idx_maintenanceType (maintenanceType)
);

-- ============================================
-- 10. NOTIFICATIONS TABLE
-- ============================================
CREATE TABLE Notifications (
    notificationId VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    userId VARCHAR(36) NOT NULL,
    type ENUM('alert', 'info', 'warning', 'success') NOT NULL,
    category ENUM('panel', 'appliance', 'energy', 'system', 'incentive') NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    isRead BOOLEAN DEFAULT FALSE,
    readAt TIMESTAMP NULL,
    priority ENUM('low', 'medium', 'high', 'critical') DEFAULT 'medium',
    actionUrl VARCHAR(500) NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expiresAt TIMESTAMP NULL,
    
    FOREIGN KEY (userId) REFERENCES Users(userId) ON DELETE CASCADE,
    INDEX idx_userId_isRead (userId, isRead),
    INDEX idx_timestamp (timestamp),
    INDEX idx_priority (priority)
);

-- ============================================
-- 11. AUDIT LOG TABLE
-- ============================================
CREATE TABLE AuditLog (
    logId VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    userId VARCHAR(36) NULL,
    action VARCHAR(100) NOT NULL,
    entityType VARCHAR(50) NULL, -- user, panel, appliance, etc.
    entityId VARCHAR(36) NULL,
    oldValue TEXT NULL,
    newValue TEXT NULL,
    ipAddress VARCHAR(45) NULL,
    userAgent TEXT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (userId) REFERENCES Users(userId) ON DELETE SET NULL,
    INDEX idx_userId_timestamp (userId, timestamp),
    INDEX idx_action (action),
    INDEX idx_timestamp (timestamp)
);

-- ============================================
-- 12. SYSTEM STATISTICS TABLE
-- ============================================
CREATE TABLE SystemStatistics (
    statId VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    userId VARCHAR(36) NOT NULL,
    date DATE NOT NULL,
    totalSolarProduced_kWh DECIMAL(10, 3) DEFAULT 0.000,
    totalConsumed_kWh DECIMAL(10, 3) DEFAULT 0.000,
    totalGridUsed_kWh DECIMAL(10, 3) DEFAULT 0.000,
    totalMoneySaved_inr DECIMAL(10, 2) DEFAULT 0.00,
    totalCO2Reduced_kg DECIMAL(10, 3) DEFAULT 0.000,
    averageEfficiency_percent DECIMAL(5, 2) NULL,
    peakSolarOutput_kW DECIMAL(10, 3) NULL,
    peakConsumption_kW DECIMAL(10, 3) NULL,
    healthyPanels INT DEFAULT 0,
    warningPanels INT DEFAULT 0,
    defectivePanels INT DEFAULT 0,
    totalIncentivePoints INT DEFAULT 0,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (userId) REFERENCES Users(userId) ON DELETE CASCADE,
    INDEX idx_userId_date (userId, date),
    UNIQUE KEY unique_user_date (userId, date)
);

-- ============================================
-- VIEWS FOR COMMON QUERIES
-- ============================================

-- User Dashboard Summary View
CREATE VIEW UserDashboardSummary AS
SELECT 
    u.userId,
    u.name,
    u.email,
    u.sessionStatus,
    sp.languagePreference,
    sp.themePreference,
    ip.totalPoints,
    ip.rewardLevel,
    COUNT(DISTINCT ph.panelId) as totalPanels,
    SUM(CASE WHEN ph.status = 'healthy' THEN 1 ELSE 0 END) as healthyPanels,
    SUM(CASE WHEN ph.status = 'warning' THEN 1 ELSE 0 END) as warningPanels,
    SUM(CASE WHEN ph.status = 'defective' THEN 1 ELSE 0 END) as defectivePanels
FROM Users u
LEFT JOIN SystemPreferences sp ON u.userId = sp.userId
LEFT JOIN IncentivePoints ip ON u.userId = ip.userId
LEFT JOIN PanelHealth ph ON u.userId = ph.userId
GROUP BY u.userId, u.name, u.email, u.sessionStatus, 
         sp.languagePreference, sp.themePreference, 
         ip.totalPoints, ip.rewardLevel;

-- Recent Energy Data View
CREATE VIEW RecentEnergyData AS
SELECT 
    ed.recordId,
    ed.userId,
    ed.timestamp,
    ed.solarProduced_kWh,
    ed.householdConsumed_kWh,
    ed.gridConsumed_kWh,
    ed.moneySaved_inr,
    ed.co2Reduced_kg,
    ed.efficiency_percent,
    u.name as userName
FROM EnergyData ed
JOIN Users u ON ed.userId = u.userId
WHERE ed.timestamp >= DATE_SUB(NOW(), INTERVAL 7 DAY)
ORDER BY ed.timestamp DESC;

-- Unresolved Panel Alerts View
CREATE VIEW UnresolvedPanelAlerts AS
SELECT 
    pa.alertId,
    pa.panelId,
    pa.userId,
    ph.panelNumber,
    pa.errorCode,
    pa.errorType,
    pa.severity,
    pa.message,
    pa.timestamp,
    u.name as userName,
    u.email as userEmail
FROM PanelAlerts pa
JOIN PanelHealth ph ON pa.panelId = ph.panelId
JOIN Users u ON pa.userId = u.userId
WHERE pa.resolved = FALSE
ORDER BY pa.severity DESC, pa.timestamp DESC;

-- ============================================
-- STORED PROCEDURES
-- ============================================

-- Procedure to update user session
DELIMITER //
CREATE PROCEDURE UpdateUserSession(
    IN p_userId VARCHAR(36),
    IN p_sessionStatus ENUM('logged_in', 'logged_out')
)
BEGIN
    UPDATE Users 
    SET sessionStatus = p_sessionStatus,
        lastLogin = IF(p_sessionStatus = 'logged_in', NOW(), lastLogin),
        updatedAt = NOW()
    WHERE userId = p_userId;
END //
DELIMITER ;

-- Procedure to calculate daily statistics
DELIMITER //
CREATE PROCEDURE CalculateDailyStatistics(
    IN p_userId VARCHAR(36),
    IN p_date DATE
)
BEGIN
    INSERT INTO SystemStatistics (
        userId, date, 
        totalSolarProduced_kWh, totalConsumed_kWh, 
        totalGridUsed_kWh, totalMoneySaved_inr, 
        totalCO2Reduced_kg, averageEfficiency_percent
    )
    SELECT 
        userId,
        DATE(timestamp) as date,
        SUM(solarProduced_kWh) as totalSolarProduced_kWh,
        SUM(householdConsumed_kWh) as totalConsumed_kWh,
        SUM(gridConsumed_kWh) as totalGridUsed_kWh,
        SUM(moneySaved_inr) as totalMoneySaved_inr,
        SUM(co2Reduced_kg) as totalCO2Reduced_kg,
        AVG(efficiency_percent) as averageEfficiency_percent
    FROM EnergyData
    WHERE userId = p_userId 
      AND DATE(timestamp) = p_date
    GROUP BY userId, DATE(timestamp)
    ON DUPLICATE KEY UPDATE
        totalSolarProduced_kWh = VALUES(totalSolarProduced_kWh),
        totalConsumed_kWh = VALUES(totalConsumed_kWh),
        totalGridUsed_kWh = VALUES(totalGridUsed_kWh),
        totalMoneySaved_inr = VALUES(totalMoneySaved_inr),
        totalCO2Reduced_kg = VALUES(totalCO2Reduced_kg),
        averageEfficiency_percent = VALUES(averageEfficiency_percent);
END //
DELIMITER ;

-- ============================================
-- TRIGGERS
-- ============================================

-- Trigger to update panel health status based on alerts
DELIMITER //
CREATE TRIGGER UpdatePanelStatusOnAlert
AFTER INSERT ON PanelAlerts
FOR EACH ROW
BEGIN
    UPDATE PanelHealth
    SET status = NEW.status,
        errorCode = NEW.errorCode,
        errorType = NEW.errorType,
        alertMessage = NEW.message,
        updatedAt = NOW()
    WHERE panelId = NEW.panelId;
END //
DELIMITER ;

-- Trigger to create notification on critical alert
DELIMITER //
CREATE TRIGGER CreateNotificationOnCriticalAlert
AFTER INSERT ON PanelAlerts
FOR EACH ROW
BEGIN
    IF NEW.severity = 'critical' THEN
        INSERT INTO Notifications (
            userId, type, category, title, message, priority
        ) VALUES (
            NEW.userId, 
            'alert', 
            'panel', 
            CONCAT('Critical Alert: ', NEW.errorCode),
            NEW.message,
            'critical'
        );
    END IF;
END //
DELIMITER ;

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

-- Additional composite indexes for common queries
CREATE INDEX idx_energy_user_date ON EnergyData(userId, DATE(timestamp));
CREATE INDEX idx_appliance_user_status ON Appliances(userId, thresholdStatus);
CREATE INDEX idx_points_user_total ON IncentivePoints(userId, totalPoints DESC);
CREATE INDEX idx_alerts_user_unresolved ON PanelAlerts(userId, resolved, timestamp DESC);

-- ============================================
-- SAMPLE DATA INSERTION
-- ============================================

-- Insert sample user
INSERT INTO Users (userId, name, email, password, sessionStatus) 
VALUES 
('user-001', 'Demo User', 'demo@energy.com', '$2a$10$hashedpassword', 'logged_out');

-- Insert system preferences for sample user
INSERT INTO SystemPreferences (userId, languagePreference, themePreference)
VALUES ('user-001', 'English', 'Light');

-- Insert sample panels
INSERT INTO PanelHealth (panelId, userId, panelNumber, status)
VALUES 
('panel-001', 'user-001', 1, 'healthy'),
('panel-002', 'user-001', 2, 'healthy'),
('panel-003', 'user-001', 3, 'warning');

-- ============================================
-- END OF SCHEMA
-- ============================================
