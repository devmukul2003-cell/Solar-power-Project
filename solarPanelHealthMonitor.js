// Solar Panel Health Monitoring & Alert System

class SolarPanelHealthMonitor {
    constructor(userId, numberOfPanels = 12) {
        this.userId = userId;
        this.numberOfPanels = numberOfPanels;
        this.storageKey = `panelHealth_${userId}`;
        this.alertsKey = `panelAlerts_${userId}`;
        this.thresholds = {
            lowOutput: 0.7,        // 70% of expected output
            highTemp: 75,          // 75°C
            criticalTemp: 85,      // 85°C
            connectivityTimeout: 300000  // 5 minutes
        };
        
        this.errorCodes = {
            'LOW_OUTPUT': {
                code: 'ERR_001',
                severity: 'warning',
                message: 'Panel output below expected threshold'
            },
            'CONNECTIVITY_ISSUE': {
                code: 'ERR_002',
                severity: 'defective',
                message: 'Panel not responding or connection lost'
            },
            'OVERHEATING': {
                code: 'ERR_003',
                severity: 'warning',
                message: 'Panel temperature exceeds safe operating range'
            },
            'CRITICAL_OVERHEATING': {
                code: 'ERR_004',
                severity: 'defective',
                message: 'Critical temperature - immediate attention required'
            },
            'VOLTAGE_FLUCTUATION': {
                code: 'ERR_005',
                severity: 'warning',
                message: 'Unstable voltage output detected'
            },
            'PHYSICAL_DAMAGE': {
                code: 'ERR_006',
                severity: 'defective',
                message: 'Possible physical damage or obstruction detected'
            },
            'DEGRADATION': {
                code: 'ERR_007',
                severity: 'warning',
                message: 'Panel efficiency degradation detected'
            }
        };
        
        this.initializePanels();
        this.startMonitoring();
    }

    initializePanels() {
        const stored = localStorage.getItem(this.storageKey);
        
        if (!stored) {
            this.panels = [];
            for (let i = 1; i <= this.numberOfPanels; i++) {
                this.panels.push({
                    panelId: `PANEL-${String(i).padStart(3, '0')}`,
                    status: 'healthy',
                    currentOutput: 0,
                    expectedOutput: 0.42, // 420W per panel
                    temperature: 25,
                    voltage: 48,
                    lastCheck: Date.now(),
                    errorCodes: [],
                    installDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
                    totalUptime: 0,
                    maintenanceHistory: []
                });
            }
            this.savePanels();
        } else {
            this.panels = JSON.parse(stored);
        }

        // Initialize alerts log
        const alertsStored = localStorage.getItem(this.alertsKey);
        this.alerts = alertsStored ? JSON.parse(alertsStored) : [];
    }

    savePanels() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.panels));
    }

    saveAlerts() {
        localStorage.setItem(this.alertsKey, JSON.stringify(this.alerts));
    }

    calculateExpectedOutput(hour) {
        // Calculate expected output based on time of day
        if (hour < 6 || hour > 18) return 0;
        
        const hourFromNoon = Math.abs(hour - 12);
        const solarFactor = Math.max(0, 1 - (hourFromNoon / 6));
        return 0.42 * solarFactor; // 420W max per panel
    }

    simulatePanelData(panel) {
        const hour = new Date().getHours();
        const expectedOutput = this.calculateExpectedOutput(hour);
        
        // Simulate realistic panel behavior
        let currentOutput = expectedOutput * (0.95 + Math.random() * 0.1);
        let temperature = 25 + (expectedOutput / 0.42) * 30 + (Math.random() * 5);
        let voltage = 48 + (Math.random() * 2 - 1);
        
        // Randomly introduce issues (5% chance)
        if (Math.random() < 0.05) {
            const issueType = Math.floor(Math.random() * 7);
            
            switch(issueType) {
                case 0: // Low output
                    currentOutput = expectedOutput * (0.3 + Math.random() * 0.3);
                    break;
                case 1: // Connectivity issue
                    currentOutput = 0;
                    break;
                case 2: // Overheating
                    temperature = 76 + Math.random() * 8;
                    break;
                case 3: // Critical overheating
                    temperature = 86 + Math.random() * 10;
                    currentOutput *= 0.5;
                    break;
                case 4: // Voltage fluctuation
                    voltage = 48 + (Math.random() * 10 - 5);
                    break;
                case 5: // Physical damage
                    currentOutput = expectedOutput * (0.2 + Math.random() * 0.2);
                    break;
                case 6: // Degradation
                    currentOutput = expectedOutput * (0.65 + Math.random() * 0.1);
                    break;
            }
        }
        
        return {
            currentOutput: parseFloat(currentOutput.toFixed(3)),
            expectedOutput: parseFloat(expectedOutput.toFixed(3)),
            temperature: parseFloat(temperature.toFixed(1)),
            voltage: parseFloat(voltage.toFixed(2))
        };
    }

    detectDefects(panel, data) {
        const detectedErrors = [];
        const { currentOutput, expectedOutput, temperature, voltage } = data;
        
        // Check for low output
        if (expectedOutput > 0 && currentOutput < expectedOutput * this.thresholds.lowOutput) {
            if (currentOutput === 0) {
                detectedErrors.push('CONNECTIVITY_ISSUE');
            } else if (currentOutput < expectedOutput * 0.4) {
                detectedErrors.push('PHYSICAL_DAMAGE');
            } else if (currentOutput < expectedOutput * 0.75) {
                detectedErrors.push('DEGRADATION');
            } else {
                detectedErrors.push('LOW_OUTPUT');
            }
        }
        
        // Check for overheating
        if (temperature >= this.thresholds.criticalTemp) {
            detectedErrors.push('CRITICAL_OVERHEATING');
        } else if (temperature >= this.thresholds.highTemp) {
            detectedErrors.push('OVERHEATING');
        }
        
        // Check for voltage fluctuation
        if (Math.abs(voltage - 48) > 3) {
            detectedErrors.push('VOLTAGE_FLUCTUATION');
        }
        
        return detectedErrors;
    }

    determineStatus(errorCodes) {
        if (errorCodes.length === 0) return 'healthy';
        
        const hasCritical = errorCodes.some(code => 
            this.errorCodes[code].severity === 'defective'
        );
        
        return hasCritical ? 'defective' : 'warning';
    }

    createAlert(panel, errorCodes) {
        const timestamp = new Date().toISOString();
        
        errorCodes.forEach(errorType => {
            const errorInfo = this.errorCodes[errorType];
            
            const alert = {
                alertId: `ALERT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                panelId: panel.panelId,
                errorCode: errorInfo.code,
                errorType: errorType,
                severity: errorInfo.severity,
                status: panel.status,
                message: errorInfo.message,
                detailedMessage: this.generateDetailedMessage(panel, errorType),
                timestamp: timestamp,
                resolved: false,
                resolvedAt: null,
                resolvedBy: null,
                notes: ''
            };
            
            this.alerts.unshift(alert);
            
            // Trigger notification
            this.triggerNotification(alert);
        });
        
        // Keep only last 100 alerts
        if (this.alerts.length > 100) {
            this.alerts = this.alerts.slice(0, 100);
        }
        
        this.saveAlerts();
    }

    generateDetailedMessage(panel, errorType) {
        const messages = {
            'LOW_OUTPUT': `Panel ${panel.panelId} is producing ${panel.currentOutput.toFixed(2)}kW instead of expected ${panel.expectedOutput.toFixed(2)}kW. Check for shading or dirt accumulation.`,
            'CONNECTIVITY_ISSUE': `Panel ${panel.panelId} is not responding. Check wiring and connections. Last successful communication: ${new Date(panel.lastCheck).toLocaleString()}.`,
            'OVERHEATING': `Panel ${panel.panelId} temperature is ${panel.temperature}°C (safe limit: ${this.thresholds.highTemp}°C). Ensure proper ventilation.`,
            'CRITICAL_OVERHEATING': `URGENT: Panel ${panel.panelId} temperature is ${panel.temperature}°C! Immediate shutdown recommended. Contact maintenance immediately.`,
            'VOLTAGE_FLUCTUATION': `Panel ${panel.panelId} voltage is ${panel.voltage}V (expected: 48V ±2V). Check inverter and electrical connections.`,
            'PHYSICAL_DAMAGE': `Panel ${panel.panelId} output severely reduced to ${panel.currentOutput.toFixed(2)}kW. Possible physical damage, cracks, or major obstruction detected.`,
            'DEGRADATION': `Panel ${panel.panelId} showing signs of efficiency degradation. Output at ${((panel.currentOutput / panel.expectedOutput) * 100).toFixed(1)}% of expected. Schedule inspection.`
        };
        
        return messages[errorType] || `Issue detected with panel ${panel.panelId}.`;
    }

    triggerNotification(alert) {
        // Dispatch custom event for UI to handle
        window.dispatchEvent(new CustomEvent('panelAlert', { 
            detail: alert 
        }));
    }

    monitorPanels() {
        this.panels.forEach(panel => {
            // Simulate panel data
            const data = this.simulatePanelData(panel);
            
            // Update panel data
            panel.currentOutput = data.currentOutput;
            panel.expectedOutput = data.expectedOutput;
            panel.temperature = data.temperature;
            panel.voltage = data.voltage;
            panel.lastCheck = Date.now();
            
            // Detect defects
            const newErrors = this.detectDefects(panel, data);
            
            // Check if errors have changed
            const errorsChanged = JSON.stringify(newErrors.sort()) !== JSON.stringify(panel.errorCodes.sort());
            
            if (errorsChanged && newErrors.length > 0) {
                // New errors detected
                const newErrorsOnly = newErrors.filter(e => !panel.errorCodes.includes(e));
                if (newErrorsOnly.length > 0) {
                    this.createAlert(panel, newErrorsOnly);
                }
            }
            
            // Update panel status
            panel.errorCodes = newErrors;
            panel.status = this.determineStatus(newErrors);
        });
        
        this.savePanels();
        
        // 🔥 SYNC TO MONGODB every 3 updates (45 seconds)
        if (!this.monitorCount) this.monitorCount = 0;
        if (this.monitorCount % 3 === 0 && typeof api !== 'undefined') {
            this.syncToMongoDB();
        }
        this.monitorCount++;
    }

    async syncToMongoDB() {
        try {
            const updates = this.panels.map(panel => ({
                panelId: panel.panelId,
                status: panel.status,
                currentOutput_kW: panel.currentOutput,
                temperature_celsius: panel.temperature,
                voltage_volts: panel.voltage,
                errorCode: panel.errorCodes.length > 0 ? panel.errorCodes[0] : null,
                errorType: panel.errorCodes.length > 0 ? this.getErrorType(panel.errorCodes[0]) : null,
                alertMessage: panel.errorCodes.length > 0 ? this.getErrorMessage(panel.errorCodes[0]) : null
            }));

            await api.bulkUpdatePanels(updates);
            
            const healthyCount = updates.filter(p => p.status === 'healthy').length;
            const warningCount = updates.filter(p => p.status === 'warning').length;
            const defectiveCount = updates.filter(p => p.status === 'defective').length;
            
            console.log('✅ Solar panels synced to MongoDB:', {
                total: updates.length,
                healthy: healthyCount,
                warning: warningCount,
                defective: defectiveCount
            });
        } catch (error) {
            console.error('❌ Failed to sync panels:', error.message);
        }
    }

    getErrorType(errorCode) {
        const errorTypes = {
            'ERR_001': 'LOW_OUTPUT',
            'ERR_002': 'CONNECTIVITY',
            'ERR_003': 'OVERHEATING',
            'ERR_004': 'VOLTAGE_DROP',
            'ERR_005': 'SHADING',
            'ERR_006': 'DIRT_ACCUMULATION',
            'ERR_007': 'DEGRADATION'
        };
        return errorTypes[errorCode] || 'UNKNOWN';
    }

    getErrorMessage(errorCode) {
        const messages = {
            'ERR_001': 'Panel output below expected threshold',
            'ERR_002': 'Connection issue detected',
            'ERR_003': 'Panel temperature too high',
            'ERR_004': 'Voltage drop detected',
            'ERR_005': 'Shading affecting performance',
            'ERR_006': 'Dirt accumulation reducing efficiency',
            'ERR_007': 'Panel degradation detected'
        };
        return messages[errorCode] || 'Unknown error';
    }

    startMonitoring() {
        // Monitor every 15 seconds
        this.monitoringInterval = setInterval(() => {
            this.monitorPanels();
        }, 15000);
        
        // Initial check
        this.monitorPanels();
    }

    stopMonitoring() {
        if (this.monitoringInterval) {
            clearInterval(this.monitoringInterval);
        }
    }

    getPanels() {
        return this.panels;
    }

    getPanel(panelId) {
        return this.panels.find(p => p.panelId === panelId);
    }

    getAlerts(filter = 'all') {
        switch(filter) {
            case 'unresolved':
                return this.alerts.filter(a => !a.resolved);
            case 'resolved':
                return this.alerts.filter(a => a.resolved);
            case 'critical':
                return this.alerts.filter(a => a.severity === 'defective' && !a.resolved);
            default:
                return this.alerts;
        }
    }

    getHealthSummary() {
        const healthy = this.panels.filter(p => p.status === 'healthy').length;
        const warning = this.panels.filter(p => p.status === 'warning').length;
        const defective = this.panels.filter(p => p.status === 'defective').length;
        const unresolvedAlerts = this.alerts.filter(a => !a.resolved).length;
        
        const totalOutput = this.panels.reduce((sum, p) => sum + p.currentOutput, 0);
        const totalExpected = this.panels.reduce((sum, p) => sum + p.expectedOutput, 0);
        const efficiency = totalExpected > 0 ? (totalOutput / totalExpected * 100) : 0;
        
        return {
            totalPanels: this.numberOfPanels,
            healthy,
            warning,
            defective,
            unresolvedAlerts,
            totalOutput: parseFloat(totalOutput.toFixed(2)),
            totalExpected: parseFloat(totalExpected.toFixed(2)),
            efficiency: parseFloat(efficiency.toFixed(1)),
            status: defective > 0 ? 'critical' : warning > 0 ? 'warning' : 'healthy'
        };
    }

    resolveAlert(alertId, resolvedBy, notes = '') {
        const alert = this.alerts.find(a => a.alertId === alertId);
        
        if (alert) {
            alert.resolved = true;
            alert.resolvedAt = new Date().toISOString();
            alert.resolvedBy = resolvedBy;
            alert.notes = notes;
            
            // Add to maintenance history
            const panel = this.getPanel(alert.panelId);
            if (panel) {
                panel.maintenanceHistory.push({
                    date: alert.resolvedAt,
                    issue: alert.errorType,
                    resolvedBy: resolvedBy,
                    notes: notes
                });
            }
            
            this.saveAlerts();
            this.savePanels();
            
            return { success: true, message: 'Alert resolved successfully' };
        }
        
        return { success: false, message: 'Alert not found' };
    }

    exportHealthReport() {
        const summary = this.getHealthSummary();
        const unresolvedAlerts = this.getAlerts('unresolved');
        
        return {
            reportDate: new Date().toISOString(),
            userId: this.userId,
            summary,
            panels: this.panels,
            unresolvedAlerts,
            recentAlerts: this.alerts.slice(0, 20)
        };
    }

    exportCSV() {
        const headers = ['Panel ID', 'Status', 'Current Output (kW)', 'Expected Output (kW)', 'Temperature (°C)', 'Voltage (V)', 'Error Codes', 'Last Check'];
        const rows = this.panels.map(p => [
            p.panelId,
            p.status,
            p.currentOutput,
            p.expectedOutput,
            p.temperature,
            p.voltage,
            p.errorCodes.join('; '),
            new Date(p.lastCheck).toLocaleString()
        ]);
        
        return [headers, ...rows].map(row => row.join(',')).join('\n');
    }
}

// Export for use in other scripts
window.SolarPanelHealthMonitor = SolarPanelHealthMonitor;
