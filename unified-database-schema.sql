-- ============================================
-- UNIFIED DATABASE SCHEMA
-- Enhanced Smart Energy Dashboard
-- SQL Version (MySQL/PostgreSQL)
-- Supports All Features (1-9)
-- ============================================

-- ============================================
-- 1. USERS TABLE
-- ============================================
CREATE TABLE Users (
    userId VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL, -- Hashed (bcrypt/argon2)
    signupDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    lastLogin TIMESTAMP NULL,
    sessionStatus ENUM('logged_in', 'logged_out') DEFAULT 'logged_out',
    isActive BOOLEAN DEFAULT TRUE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_email (email),
    INDEX idx_sessionStatus (sessionStatus)
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
    gridConsumed_kWh DECIMAL(10, 3) DEFAULT 0.000,
    moneySaved_inr DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    co2Reduced_kg DECIMAL(10, 3) NOT NULL DEFAULT 0.000,
    
    FOREIGN KEY (userId) REFERENCES Users(userId) ON DELETE CASCADE,
    INDEX idx_userId_timestamp (userId, timestamp),
    INDEX idx_timestamp (timestamp)
);

-- ============================================
-- 3. APPLIANCES TABLE
-- ============================================
CREATE TABLE Appliances (
    applianceId VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    userId VARCHAR(36) NOT NULL,
    applianceName VARCHAR(100) NOT NULL,
    category VARCHAR(50) NULL,
    powerConsumption_kWh DECIMAL(10, 3) NOT NULL DEFAULT 0.000,
    ratedPower_watts INT NOT NULL,
    threshold_kWh DECIMAL(10, 3) NOT NULL,
    thresholdStatus ENUM('normal', 'high', 'critical') DEFAULT 'normal',
    notificationMessage TEXT NULL,
    isActive BOOLEAN DEFAULT TRUE,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (userId) REFERENCES Users(userId) ON DELETE CASCADE,
    INDEX idx_userId (userId),
    INDEX idx_thresholdStatus (thresholdStatus)
);

-- ============================================
-- 4. INCENTIVE POINTS TABLE
-- ============================================
CREATE TABLE IncentivePoints (
    pointsId VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    userId VARCHAR(36) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    energySaved_kWh DECIMAL(10, 3) NOT NULL DEFAULT 0.000,
    pointsEarned INT NOT NULL DEFAULT 0,
    totalPoints INT NOT NULL DEFAULT 0,
    rewardLevel ENUM('bronze', 'silver', 'gold', 'platinum') DEFAULT 'bronze',
    
    FOREIGN KEY (userId) REFERENCES Users(userId) ON DELETE CASCADE,
    INDEX idx_userId (userId),
    INDEX idx_totalPoints (totalPoints DESC)
);

-- ============================================
-- 5. SYSTEM PREFERENCES TABLE
-- ============================================
CREATE TABLE SystemPreferences (
    preferenceId VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    userId VARCHAR(36) UNIQUE NOT NULL,
    languagePreference ENUM('English', 'Hindi') DEFAULT 'English',
    themePreference ENUM('Light', 'Dark') DEFAULT 'Light',
    dateRangeType ENUM('preset', 'custom') DEFAULT 'preset',
    dateRangePreset INT DEFAULT 30,
    customStartDate DATE NULL,
    customEndDate DATE NULL,
    notificationsEnabled BOOLEAN DEFAULT TRUE,
    soundAlertsEnabled BOOLEAN DEFAULT TRUE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (userId) REFERENCES Users(userId) ON DELETE CASCADE
);

-- ============================================
-- 6. PANEL HEALTH TABLE
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
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (userId) REFERENCES Users(userId) ON DELETE CASCADE,
    INDEX idx_userId_status (userId, status),
    UNIQUE KEY unique_user_panel (userId, panelNumber)
);

-- ============================================
-- 7. NOTIFICATIONS TABLE
-- ============================================
CREATE TABLE Notifications (
    notificationId VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    userId VARCHAR(36) NOT NULL,
    type ENUM('info', 'warning', 'critical') NOT NULL,
    category ENUM('appliance', 'panel', 'energy', 'system') NOT NULL,
    message TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved BOOLEAN DEFAULT FALSE,
    resolvedAt TIMESTAMP NULL,
    isRead BOOLEAN DEFAULT FALSE,
    
    FOREIGN KEY (userId) REFERENCES Users(userId) ON DELETE CASCADE,
    INDEX idx_userId_resolved (userId, resolved),
    INDEX idx_type (type),
    INDEX idx_timestamp (timestamp DESC)
);

-- ============================================
-- 8. ACCESSIBILITY SETTINGS TABLE
-- ============================================
CREATE TABLE AccessibilitySettings (
    accessibilityId VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    userId VARCHAR(36) UNIQUE NOT NULL,
    screenReaderEnabled BOOLEAN DEFAULT FALSE,
    highContrastMode BOOLEAN DEFAULT FALSE,
    fontSize ENUM('small', 'medium', 'large') DEFAULT 'medium',
    reducedMotion BOOLEAN DEFAULT FALSE,
    keyboardNavigation BOOLEAN DEFAULT TRUE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (userId) REFERENCES Users(userId) ON DELETE CASCADE
);

-- ============================================
-- 9. PANEL ALERTS TABLE (for logging)
-- ============================================
CREATE TABLE PanelAlerts (
    alertId VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    panelId VARCHAR(36) NOT NULL,
    userId VARCHAR(36) NOT NULL,
    errorCode VARCHAR(20) NOT NULL,
    errorType VARCHAR(50) NOT NULL,
    severity ENUM('warning', 'defective', 'critical') NOT NULL,
    message TEXT NOT NULL,
    detailedMessage TEXT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved BOOLEAN DEFAULT FALSE,
    resolvedAt TIMESTAMP NULL,
    resolvedBy VARCHAR(100) NULL,
    resolutionNotes TEXT NULL,
    
    FOREIGN KEY (panelId) REFERENCES PanelHealth(panelId) ON DELETE CASCADE,
    FOREIGN KEY (userId) REFERENCES Users(userId) ON DELETE CASCADE,
    INDEX idx_userId_resolved (userId, resolved),
    INDEX idx_timestamp (timestamp DESC)
);

-- ============================================
-- 10. APPLIANCE ALERTS TABLE
-- ============================================
CREATE TABLE ApplianceAlerts (
    alertId VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    applianceId VARCHAR(36) NOT NULL,
    userId VARCHAR(36) NOT NULL,
    alertType ENUM('overuse', 'power_shortage', 'maintenance') NOT NULL,
    severity ENUM('info', 'warning', 'critical') NOT NULL,
    message TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved BOOLEAN DEFAULT FALSE,
    
    FOREIGN KEY (applianceId) REFERENCES Appliances(applianceId) ON DELETE CASCADE,
    FOREIGN KEY (userId) REFERENCES Users(userId) ON DELETE CASCADE,
    INDEX idx_userId_resolved (userId, resolved)
);

-- ============================================
-- VIEWS FOR COMMON QUERIES
-- ============================================

-- User Dashboard Summary
CREATE VIEW UserDashboardSummary AS
SELECT 
    u.userId,
    u.name,
    u.email,
    u.sessionStatus,
    sp.languagePreference,
    sp.themePreference,
    COALESCE(ip.totalPoints, 0) as totalPoints,
    COALESCE(ip.rewardLevel, 'bronze') as rewardLevel,
    COUNT(DISTINCT ph.panelId) as totalPanels,
    SUM(CASE WHEN ph.status = 'healthy' THEN 1 ELSE 0 END) as healthyPanels,
    SUM(CASE WHEN ph.status = 'warning' THEN 1 ELSE 0 END) as warningPanels,
    SUM(CASE WHEN ph.status = 'defective' THEN 1 ELSE 0 END) as defectivePanels,
    (SELECT COUNT(*) FROM Notifications n WHERE n.userId = u.userId AND n.resolved = FALSE) as unresolvedNotifications
FROM Users u
LEFT JOIN SystemPreferences sp ON u.userId = sp.userId
LEFT JOIN (
    SELECT userId, totalPoints, rewardLevel 
    FROM IncentivePoints 
    WHERE (userId, timestamp) IN (
        SELECT userId, MAX(timestamp) 
        FROM IncentivePoints 
        GROUP BY userId
    )
) ip ON u.userId = ip.userId
LEFT JOIN PanelHealth ph ON u.userId = ph.userId
GROUP BY u.userId, u.name, u.email, u.sessionStatus, 
         sp.languagePreference, sp.themePreference, 
         ip.totalPoints, ip.rewardLevel;

-- Recent Energy Statistics
CREATE VIEW RecentEnergyStats AS
SELECT 
    userId,
    DATE(timestamp) as date,
    SUM(solarProduced_kWh) as dailySolar,
    SUM(householdConsumed_kWh) as dailyConsumption,
    SUM(moneySaved_inr) as dailySavings,
    SUM(co2Reduced_kg) as dailyCO2Reduced
FROM EnergyData
WHERE timestamp >= DATE_SUB(NOW(), INTERVAL 30 DAY)
GROUP BY userId, DATE(timestamp)
ORDER BY date DESC;

-- Unresolved Alerts Summary
CREATE VIEW UnresolvedAlertsSummary AS
SELECT 
    userId,
    'panel' as alertSource,
    COUNT(*) as alertCount,
    MAX(severity) as maxSeverity
FROM PanelAlerts
WHERE resolved = FALSE
GROUP BY userId
UNION ALL
SELECT 
    userId,
    'appliance' as alertSource,
    COUNT(*) as alertCount,
    MAX(severity) as maxSeverity
FROM ApplianceAlerts
WHERE resolved = FALSE
GROUP BY userId;

-- ============================================
-- STORED PROCEDURES
-- ============================================

-- Update User Session
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

-- Calculate Incentive Points
DELIMITER //
CREATE PROCEDURE CalculateIncentivePoints(
    IN p_userId VARCHAR(36),
    IN p_energySaved DECIMAL(10,3),
    IN p_solarPercentage DECIMAL(5,2)
)
BEGIN
    DECLARE v_pointsEarned INT DEFAULT 0;
    DECLARE v_currentTotal INT DEFAULT 0;
    DECLARE v_newTotal INT DEFAULT 0;
    DECLARE v_rewardLevel VARCHAR(20);
    
    -- Calculate base points
    SET v_pointsEarned = FLOOR(p_energySaved);
    
    -- Add bonus points based on solar percentage
    IF p_solarPercentage >= 80 THEN
        SET v_pointsEarned = v_pointsEarned + 100;
    ELSEIF p_solarPercentage >= 60 THEN
        SET v_pointsEarned = v_pointsEarned + 50;
    ELSEIF p_solarPercentage >= 40 THEN
        SET v_pointsEarned = v_pointsEarned + 25;
    END IF;
    
    -- Get current total
    SELECT COALESCE(totalPoints, 0) INTO v_currentTotal
    FROM IncentivePoints
    WHERE userId = p_userId
    ORDER BY timestamp DESC
    LIMIT 1;
    
    SET v_newTotal = v_currentTotal + v_pointsEarned;
    
    -- Determine reward level
    IF v_newTotal >= 2000 THEN
        SET v_rewardLevel = 'platinum';
    ELSEIF v_newTotal >= 1000 THEN
        SET v_rewardLevel = 'gold';
    ELSEIF v_newTotal >= 500 THEN
        SET v_rewardLevel = 'silver';
    ELSE
        SET v_rewardLevel = 'bronze';
    END IF;
    
    -- Insert new record
    INSERT INTO IncentivePoints (
        userId, energySaved_kWh, pointsEarned, totalPoints, rewardLevel
    ) VALUES (
        p_userId, p_energySaved, v_pointsEarned, v_newTotal, v_rewardLevel
    );
END //
DELIMITER ;

-- Create Notification
DELIMITER //
CREATE PROCEDURE CreateNotification(
    IN p_userId VARCHAR(36),
    IN p_type ENUM('info', 'warning', 'critical'),
    IN p_category ENUM('appliance', 'panel', 'energy', 'system'),
    IN p_message TEXT
)
BEGIN
    INSERT INTO Notifications (userId, type, category, message)
    VALUES (p_userId, p_type, p_category, p_message);
END //
DELIMITER ;

-- ============================================
-- TRIGGERS
-- ============================================

-- Auto-create preferences on user signup
DELIMITER //
CREATE TRIGGER CreateDefaultPreferences
AFTER INSERT ON Users
FOR EACH ROW
BEGIN
    INSERT INTO SystemPreferences (userId)
    VALUES (NEW.userId);
    
    INSERT INTO AccessibilitySettings (userId)
    VALUES (NEW.userId);
END //
DELIMITER ;

-- Create notification on critical appliance alert
DELIMITER //
CREATE TRIGGER NotifyOnCriticalAppliance
AFTER INSERT ON ApplianceAlerts
FOR EACH ROW
BEGIN
    IF NEW.severity = 'critical' THEN
        INSERT INTO Notifications (userId, type, category, message)
        VALUES (NEW.userId, 'critical', 'appliance', NEW.message);
    END IF;
END //
DELIMITER ;

-- Create notification on panel defect
DELIMITER //
CREATE TRIGGER NotifyOnPanelDefect
AFTER INSERT ON PanelAlerts
FOR EACH ROW
BEGIN
    IF NEW.severity IN ('defective', 'critical') THEN
        INSERT INTO Notifications (userId, type, category, message)
        VALUES (NEW.userId, 'critical', 'panel', NEW.message);
    END IF;
END //
DELIMITER ;

-- ============================================
-- SAMPLE DATA
-- ============================================

-- Insert demo user
INSERT INTO Users (userId, name, email, password, sessionStatus) 
VALUES ('user-demo-001', 'Demo User', 'demo@energy.com', 
        '$2a$10$hashedpassword', 'logged_out');

-- Insert sample panels
INSERT INTO PanelHealth (panelId, userId, panelNumber, status, expectedOutput_kW)
VALUES 
('PANEL-001', 'user-demo-001', 1, 'healthy', 0.42),
('PANEL-002', 'user-demo-001', 2, 'healthy', 0.42),
('PANEL-003', 'user-demo-001', 3, 'warning', 0.42);

-- Insert sample appliances
INSERT INTO Appliances (applianceId, userId, applianceName, category, 
                        ratedPower_watts, threshold_kWh, thresholdStatus)
VALUES 
('APP-001', 'user-demo-001', 'Air Conditioner', 'HVAC', 1500, 3.0, 'normal'),
('APP-002', 'user-demo-001', 'Refrigerator', 'Kitchen', 200, 1.0, 'normal'),
('APP-003', 'user-demo-001', 'Washing Machine', 'Laundry', 500, 0.5, 'normal');

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX idx_energy_user_date ON EnergyData(userId, DATE(timestamp));
CREATE INDEX idx_notifications_unread ON Notifications(userId, isRead, timestamp DESC);
CREATE INDEX idx_appliance_active ON Appliances(userId, isActive);

-- ============================================
-- END OF SCHEMA
-- ============================================
