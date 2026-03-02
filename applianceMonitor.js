// Appliance Monitoring System
// Real-time tracking, overuse detection, and power shortage management

class ApplianceMonitor {
    constructor(userId) {
        this.userId = userId;
        this.storageKey = `appliances_${userId}`;
        this.alertsKey = `applianceAlerts_${userId}`;
        this.usageHistoryKey = `applianceUsageHistory_${userId}`;
        
        // Power shortage threshold (total consumption limit)
        this.powerShortageThreshold = 5.0; // kW
        this.isPowerShortage = false;
        
        this.initializeAppliances();
        this.startMonitoring();
    }

    initializeAppliances() {
        const stored = localStorage.getItem(this.storageKey);
        
        if (!stored) {
            // Default appliances with realistic power consumption
            this.appliances = [
                {
                    applianceId: "APP-001",
                    applianceName: "Air Conditioner",
                    category: "HVAC",
                    ratedPower_watts: 1500,
                    currentConsumption_kW: 0,
                    dailyConsumption_kWh: 0,
                    threshold_kW: 2.0,
                    thresholdStatus: "normal",
                    priority: 3, // 1=critical, 5=low priority
                    isActive: false,
                    suggestionMessage: "",
                    lastUpdated: Date.now(),
                    icon: "❄️"
                },
                {
                    applianceId: "APP-002",
                    applianceName: "Refrigerator",
                    category: "Kitchen",
                    ratedPower_watts: 200,
                    currentConsumption_kW: 0,
                    dailyConsumption_kWh: 0,
                    threshold_kW: 0.3,
                    thresholdStatus: "normal",
                    priority: 1, // Critical - don't turn off
                    isActive: true,
                    suggestionMessage: "",
                    lastUpdated: Date.now(),
                    icon: "🧊"
                },
                {
                    applianceId: "APP-003",
                    applianceName: "Washing Machine",
                    category: "Laundry",
                    ratedPower_watts: 500,
                    currentConsumption_kW: 0,
                    dailyConsumption_kWh: 0,
                    threshold_kW: 0.6,
                    thresholdStatus: "normal",
                    priority: 4,
                    isActive: false,
                    suggestionMessage: "",
                    lastUpdated: Date.now(),
                    icon: "🧺"
                },
                {
                    applianceId: "APP-004",
                    applianceName: "Television",
                    category: "Entertainment",
                    ratedPower_watts: 150,
                    currentConsumption_kW: 0,
                    dailyConsumption_kWh: 0,
                    threshold_kW: 0.2,
                    thresholdStatus: "normal",
                    priority: 5,
                    isActive: false,
                    suggestionMessage: "",
                    lastUpdated: Date.now(),
                    icon: "📺"
                },
                {
                    applianceId: "APP-005",
                    applianceName: "Water Heater",
                    category: "Bathroom",
                    ratedPower_watts: 2000,
                    currentConsumption_kW: 0,
                    dailyConsumption_kWh: 0,
                    threshold_kW: 2.5,
                    thresholdStatus: "normal",
                    priority: 4,
                    isActive: false,
                    suggestionMessage: "",
                    lastUpdated: Date.now(),
                    icon: "🚿"
                },
                {
                    applianceId: "APP-006",
                    applianceName: "Microwave",
                    category: "Kitchen",
                    ratedPower_watts: 1000,
                    currentConsumption_kW: 0,
                    dailyConsumption_kWh: 0,
                    threshold_kW: 1.2,
                    thresholdStatus: "normal",
                    priority: 4,
                    isActive: false,
                    suggestionMessage: "",
                    lastUpdated: Date.now(),
                    icon: "🍽️"
                },
                {
                    applianceId: "APP-007",
                    applianceName: "Lights",
                    category: "Lighting",
                    ratedPower_watts: 100,
                    currentConsumption_kW: 0,
                    dailyConsumption_kWh: 0,
                    threshold_kW: 0.15,
                    thresholdStatus: "normal",
                    priority: 2,
                    isActive: true,
                    suggestionMessage: "",
                    lastUpdated: Date.now(),
                    icon: "💡"
                },
                {
                    applianceId: "APP-008",
                    applianceName: "Computer",
                    category: "Electronics",
                    ratedPower_watts: 300,
                    currentConsumption_kW: 0,
                    dailyConsumption_kWh: 0,
                    threshold_kW: 0.4,
                    thresholdStatus: "normal",
                    priority: 3,
                    isActive: false,
                    suggestionMessage: "",
                    lastUpdated: Date.now(),
                    icon: "💻"
                }
            ];
            this.saveAppliances();
        } else {
            this.appliances = JSON.parse(stored);
        }

        // Initialize alerts and usage history
        const alertsStored = localStorage.getItem(this.alertsKey);
        this.alerts = alertsStored ? JSON.parse(alertsStored) : [];

        const historyStored = localStorage.getItem(this.usageHistoryKey);
        this.usageHistory = historyStored ? JSON.parse(historyStored) : [];
    }

    saveAppliances() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.appliances));
    }

    saveAlerts() {
        localStorage.setItem(this.alertsKey, JSON.stringify(this.alerts));
    }

    saveUsageHistory() {
        localStorage.setItem(this.usageHistoryKey, JSON.stringify(this.usageHistory));
    }

    simulateApplianceUsage(appliance) {
        const hour = new Date().getHours();
        
        // Simulate realistic usage patterns based on time of day
        let usageProbability = 0;
        
        switch(appliance.category) {
            case "HVAC": // AC usage peaks in afternoon
                usageProbability = (hour >= 12 && hour <= 18) ? 0.8 : 0.3;
                break;
            case "Kitchen":
                if (appliance.applianceName === "Refrigerator") {
                    usageProbability = 1.0; // Always on
                } else {
                    usageProbability = (hour >= 6 && hour <= 9) || (hour >= 18 && hour <= 21) ? 0.6 : 0.2;
                }
                break;
            case "Laundry":
                usageProbability = (hour >= 9 && hour <= 17) ? 0.3 : 0.1;
                break;
            case "Entertainment":
                usageProbability = (hour >= 18 && hour <= 23) ? 0.7 : 0.2;
                break;
            case "Bathroom":
                usageProbability = (hour >= 6 && hour <= 9) || (hour >= 18 && hour <= 22) ? 0.5 : 0.1;
                break;
            case "Lighting":
                usageProbability = (hour >= 18 || hour <= 6) ? 0.9 : 0.3;
                break;
            case "Electronics":
                usageProbability = (hour >= 9 && hour <= 23) ? 0.6 : 0.1;
                break;
        }

        // Determine if appliance is active
        appliance.isActive = Math.random() < usageProbability;

        // Calculate current consumption
        if (appliance.isActive) {
            const variationFactor = 0.7 + (Math.random() * 0.6); // 70-130% of rated power
            appliance.currentConsumption_kW = (appliance.ratedPower_watts / 1000) * variationFactor;
            
            // Add to daily consumption (assuming 5-second intervals)
            appliance.dailyConsumption_kWh += (appliance.currentConsumption_kW * 5) / 3600;
        } else {
            appliance.currentConsumption_kW = 0;
        }

        appliance.currentConsumption_kW = parseFloat(appliance.currentConsumption_kW.toFixed(3));
        appliance.dailyConsumption_kWh = parseFloat(appliance.dailyConsumption_kWh.toFixed(3));
        appliance.lastUpdated = Date.now();
    }

    detectOveruse(appliance) {
        if (appliance.currentConsumption_kW >= appliance.threshold_kW * 1.2) {
            appliance.thresholdStatus = "critical";
            appliance.suggestionMessage = `⚠️ CRITICAL: ${appliance.applianceName} consuming ${appliance.currentConsumption_kW.toFixed(2)}kW (limit: ${appliance.threshold_kW}kW). Consider turning off immediately.`;
            return true;
        } else if (appliance.currentConsumption_kW >= appliance.threshold_kW) {
            appliance.thresholdStatus = "high";
            appliance.suggestionMessage = `⚡ HIGH: ${appliance.applianceName} consuming ${appliance.currentConsumption_kW.toFixed(2)}kW. Monitor usage closely.`;
            return true;
        } else {
            appliance.thresholdStatus = "normal";
            appliance.suggestionMessage = "";
            return false;
        }
    }

    checkPowerShortage() {
        const totalConsumption = this.appliances.reduce((sum, app) => 
            sum + app.currentConsumption_kW, 0
        );

        const wasShortage = this.isPowerShortage;
        this.isPowerShortage = totalConsumption >= this.powerShortageThreshold;

        // If power shortage just started, generate suggestions
        if (this.isPowerShortage && !wasShortage) {
            this.generatePowerShortageSuggestions();
        }

        return {
            isPowerShortage: this.isPowerShortage,
            totalConsumption: parseFloat(totalConsumption.toFixed(3)),
            threshold: this.powerShortageThreshold,
            percentageUsed: parseFloat(((totalConsumption / this.powerShortageThreshold) * 100).toFixed(1))
        };
    }

    generatePowerShortageSuggestions() {
        // Sort appliances by priority (higher priority = turn off first)
        const activeAppliances = this.appliances
            .filter(app => app.isActive && app.currentConsumption_kW > 0)
            .sort((a, b) => b.priority - a.priority);

        const suggestions = [];
        let cumulativeSavings = 0;

        for (const appliance of activeAppliances) {
            if (appliance.priority === 1) continue; // Don't suggest turning off critical appliances

            cumulativeSavings += appliance.currentConsumption_kW;
            
            const suggestion = {
                applianceId: appliance.applianceId,
                applianceName: appliance.applianceName,
                currentConsumption: appliance.currentConsumption_kW,
                priority: appliance.priority,
                message: `Turn off ${appliance.applianceName} to save ${appliance.currentConsumption_kW.toFixed(2)}kW`,
                cumulativeSavings: parseFloat(cumulativeSavings.toFixed(3))
            };

            suggestions.push(suggestion);

            // Stop when we've suggested enough to get below threshold
            if (cumulativeSavings >= (this.getTotalConsumption() - this.powerShortageThreshold)) {
                break;
            }
        }

        // Create alert
        this.createPowerShortageAlert(suggestions);

        return suggestions;
    }

    createPowerShortageAlert(suggestions) {
        const alert = {
            alertId: `SHORTAGE-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            type: "power_shortage",
            severity: "critical",
            message: `⚠️ POWER SHORTAGE DETECTED! Total consumption: ${this.getTotalConsumption().toFixed(2)}kW (limit: ${this.powerShortageThreshold}kW)`,
            suggestions: suggestions,
            timestamp: new Date().toISOString(),
            resolved: false
        };

        this.alerts.unshift(alert);
        
        // Keep only last 50 alerts
        if (this.alerts.length > 50) {
            this.alerts = this.alerts.slice(0, 50);
        }

        this.saveAlerts();

        // Trigger notification
        window.dispatchEvent(new CustomEvent('powerShortageAlert', { 
            detail: alert 
        }));
    }

    createOveruseAlert(appliance) {
        const alert = {
            alertId: `OVERUSE-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            applianceId: appliance.applianceId,
            applianceName: appliance.applianceName,
            type: "overuse",
            severity: appliance.thresholdStatus,
            message: appliance.suggestionMessage,
            currentConsumption: appliance.currentConsumption_kW,
            threshold: appliance.threshold_kW,
            timestamp: new Date().toISOString(),
            resolved: false
        };

        this.alerts.unshift(alert);
        
        if (this.alerts.length > 50) {
            this.alerts = this.alerts.slice(0, 50);
        }

        this.saveAlerts();

        // Trigger notification
        window.dispatchEvent(new CustomEvent('applianceOveruseAlert', { 
            detail: alert 
        }));
    }

    logUsage() {
        const usageSnapshot = {
            timestamp: new Date().toISOString(),
            totalConsumption: this.getTotalConsumption(),
            isPowerShortage: this.isPowerShortage,
            appliances: this.appliances.map(app => ({
                applianceId: app.applianceId,
                applianceName: app.applianceName,
                currentConsumption_kW: app.currentConsumption_kW,
                dailyConsumption_kWh: app.dailyConsumption_kWh,
                isActive: app.isActive,
                thresholdStatus: app.thresholdStatus
            }))
        };

        this.usageHistory.unshift(usageSnapshot);

        // Keep only last 100 snapshots
        if (this.usageHistory.length > 100) {
            this.usageHistory = this.usageHistory.slice(0, 100);
        }

        this.saveUsageHistory();
    }

    monitorAppliances() {
        // Simulate usage for each appliance
        this.appliances.forEach(appliance => {
            this.simulateApplianceUsage(appliance);
            
            // Check for overuse
            const isOveruse = this.detectOveruse(appliance);
            
            // Create alert if overuse detected and not already alerted recently
            if (isOveruse && appliance.thresholdStatus === "critical") {
                const recentAlert = this.alerts.find(a => 
                    a.applianceId === appliance.applianceId && 
                    a.type === "overuse" &&
                    !a.resolved &&
                    (Date.now() - new Date(a.timestamp).getTime()) < 60000 // Within last minute
                );

                if (!recentAlert) {
                    this.createOveruseAlert(appliance);
                }
            }
        });

        // Check for power shortage
        this.checkPowerShortage();

        // Log usage
        this.logUsage();

        // Save state
        this.saveAppliances();
        
        // 🔥 SYNC TO MONGODB every 5 updates (25 seconds)
        if (!this.monitorCount) this.monitorCount = 0;
        if (this.monitorCount % 5 === 0 && typeof api !== 'undefined') {
            this.syncToMongoDB();
        }
        this.monitorCount++;
    }

    async syncToMongoDB() {
        try {
            const updates = this.appliances.map(app => ({
                applianceId: app.applianceId,
                currentConsumption_kW: app.currentConsumption_kW,
                dailyConsumption_kWh: app.dailyConsumption_kWh,
                thresholdStatus: app.thresholdStatus,
                isActive: app.isActive,
                suggestionMessage: app.suggestionMessage
            }));

            await api.bulkUpdateAppliances(updates);
            console.log('✅ Appliances synced to MongoDB:', {
                total: updates.length,
                active: updates.filter(a => a.isActive).length,
                totalConsumption: this.getTotalConsumption().toFixed(2) + ' kW'
            });
        } catch (error) {
            console.error('❌ Failed to sync appliances:', error.message);
        }
    }

    startMonitoring() {
        // Monitor every 5 seconds
        this.monitoringInterval = setInterval(() => {
            this.monitorAppliances();
        }, 5000);

        // Initial check
        this.monitorAppliances();
    }

    stopMonitoring() {
        if (this.monitoringInterval) {
            clearInterval(this.monitoringInterval);
        }
    }

    getTotalConsumption() {
        return this.appliances.reduce((sum, app) => sum + app.currentConsumption_kW, 0);
    }

    getAppliances() {
        return this.appliances;
    }

    getApplianceById(applianceId) {
        return this.appliances.find(app => app.applianceId === applianceId);
    }

    getAlerts(filter = 'all') {
        switch(filter) {
            case 'unresolved':
                return this.alerts.filter(a => !a.resolved);
            case 'resolved':
                return this.alerts.filter(a => a.resolved);
            case 'critical':
                return this.alerts.filter(a => a.severity === 'critical' && !a.resolved);
            case 'power_shortage':
                return this.alerts.filter(a => a.type === 'power_shortage');
            case 'overuse':
                return this.alerts.filter(a => a.type === 'overuse');
            default:
                return this.alerts;
        }
    }

    getConsumptionByCategory() {
        const categoryData = {};
        
        this.appliances.forEach(app => {
            if (!categoryData[app.category]) {
                categoryData[app.category] = {
                    category: app.category,
                    totalConsumption: 0,
                    appliances: []
                };
            }
            
            categoryData[app.category].totalConsumption += app.currentConsumption_kW;
            categoryData[app.category].appliances.push({
                name: app.applianceName,
                consumption: app.currentConsumption_kW
            });
        });

        return Object.values(categoryData);
    }

    getConsumptionPercentages() {
        const total = this.getTotalConsumption();
        
        if (total === 0) return [];

        return this.appliances.map(app => ({
            applianceId: app.applianceId,
            applianceName: app.applianceName,
            icon: app.icon,
            consumption: app.currentConsumption_kW,
            percentage: parseFloat(((app.currentConsumption_kW / total) * 100).toFixed(1)),
            isActive: app.isActive
        })).filter(app => app.consumption > 0);
    }

    resolveAlert(alertId) {
        const alert = this.alerts.find(a => a.alertId === alertId);
        
        if (alert) {
            alert.resolved = true;
            alert.resolvedAt = new Date().toISOString();
            this.saveAlerts();
            return { success: true, message: 'Alert resolved' };
        }
        
        return { success: false, message: 'Alert not found' };
    }

    exportData(format = 'json') {
        const data = {
            exportDate: new Date().toISOString(),
            userId: this.userId,
            appliances: this.appliances,
            alerts: this.alerts,
            usageHistory: this.usageHistory.slice(0, 20),
            summary: {
                totalConsumption: this.getTotalConsumption(),
                isPowerShortage: this.isPowerShortage,
                activeAppliances: this.appliances.filter(a => a.isActive).length,
                unresolvedAlerts: this.alerts.filter(a => !a.resolved).length
            }
        };

        if (format === 'json') {
            return JSON.stringify(data, null, 2);
        } else if (format === 'csv') {
            return this.convertToCSV();
        }
    }

    convertToCSV() {
        const headers = ['Appliance Name', 'Category', 'Current Consumption (kW)', 'Daily Consumption (kWh)', 'Status', 'Is Active', 'Last Updated'];
        const rows = this.appliances.map(app => [
            app.applianceName,
            app.category,
            app.currentConsumption_kW,
            app.dailyConsumption_kWh,
            app.thresholdStatus,
            app.isActive ? 'Yes' : 'No',
            new Date(app.lastUpdated).toLocaleString()
        ]);

        return [headers, ...rows].map(row => row.join(',')).join('\n');
    }
}

// Export for use in other scripts
window.ApplianceMonitor = ApplianceMonitor;
