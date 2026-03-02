/**
 * Real-Time Energy Data Generator
 * Simulates live household energy usage and solar production
 * Updates every minute with realistic patterns
 */

class RealTimeEnergySimulator {
    constructor(solarCapacity = 5, baseConsumption = 15) {
        this.solarCapacity = solarCapacity; // kW
        this.baseConsumption = baseConsumption; // kWh per day
        this.gridRate = 8; // ₹ per kWh
        this.co2Factor = 0.82; // kg CO₂ per kWh
        this.cumulativeCO2 = 0;
        this.cumulativeSavings = 0;
        this.dataPoints = [];
        this.maxDataPoints = 1440; // 24 hours of minute data
        this.isRunning = false;
        this.updateInterval = null;
        
        // Initialize with current time
        this.startTime = new Date();
        this.lastUpdate = new Date();
    }

    /**
     * Calculate solar production based on time of day
     * Peak production at solar noon (12 PM)
     */
    calculateSolarProduction(timestamp) {
        const hour = timestamp.getHours();
        const minute = timestamp.getMinutes();
        const timeDecimal = hour + minute / 60;
        
        // Solar production only between 6 AM and 6 PM
        if (timeDecimal < 6 || timeDecimal > 18) {
            return 0;
        }
        
        // Calculate position in solar day (0 to 1)
        const solarDayPosition = (timeDecimal - 6) / 12;
        
        // Bell curve for solar production (peaks at noon)
        const peakHour = 12;
        const hoursFromPeak = Math.abs(timeDecimal - peakHour);
        
        // Maximum instantaneous production (kW to kWh per minute)
        const maxProduction = this.solarCapacity * 0.85; // 85% efficiency
        
        // Bell curve formula
        const production = maxProduction * Math.exp(-Math.pow(hoursFromPeak / 4, 2));
        
        // Convert to kWh per minute
        const productionPerMinute = production / 60;
        
        // Add weather variability (clouds, etc.)
        const weatherFactor = 0.85 + Math.random() * 0.3; // 85% to 115%
        
        // Add seasonal variation
        const dayOfYear = this.getDayOfYear(timestamp);
        const seasonFactor = 0.7 + 0.6 * Math.sin((dayOfYear - 80) / 365 * Math.PI * 2);
        
        return Math.max(0, productionPerMinute * weatherFactor * seasonFactor);
    }

    /**
     * Calculate household consumption based on time of day
     * Realistic usage patterns throughout the day
     */
    calculateConsumption(timestamp) {
        const hour = timestamp.getHours();
        const minute = timestamp.getMinutes();
        const dayOfWeek = timestamp.getDay();
        
        // Base load (always-on devices: fridge, router, etc.)
        let baseLoad = 0.5 / 60; // 0.5 kW converted to kWh per minute
        
        // Variable load based on time of day
        let variableLoad = 0;
        
        // Night (12 AM - 5 AM): Minimal usage
        if (hour >= 0 && hour < 5) {
            variableLoad = 0.2 / 60;
        }
        // Early morning (5 AM - 7 AM): Gradual increase
        else if (hour >= 5 && hour < 7) {
            variableLoad = (0.5 + (hour - 5) * 0.5) / 60;
        }
        // Morning peak (7 AM - 9 AM): High usage (breakfast, getting ready)
        else if (hour >= 7 && hour < 9) {
            variableLoad = 2.5 / 60;
        }
        // Late morning (9 AM - 12 PM): Moderate usage
        else if (hour >= 9 && hour < 12) {
            variableLoad = 1.2 / 60;
        }
        // Afternoon (12 PM - 5 PM): Moderate usage
        else if (hour >= 12 && hour < 17) {
            variableLoad = 1.5 / 60;
        }
        // Evening start (5 PM - 7 PM): Increasing usage
        else if (hour >= 17 && hour < 19) {
            variableLoad = 2.0 / 60;
        }
        // Evening peak (7 PM - 10 PM): Highest usage (cooking, entertainment)
        else if (hour >= 19 && hour < 22) {
            variableLoad = 3.5 / 60;
        }
        // Late evening (10 PM - 12 AM): Decreasing usage
        else if (hour >= 22) {
            variableLoad = 1.5 / 60;
        }
        
        // Weekend factor (20% higher usage)
        const weekendFactor = (dayOfWeek === 0 || dayOfWeek === 6) ? 1.2 : 1.0;
        
        // Random variation (±15%)
        const randomFactor = 0.85 + Math.random() * 0.3;
        
        // Occasional appliance spikes (washing machine, AC, etc.)
        const spikeProbability = 0.05; // 5% chance per minute
        const spike = Math.random() < spikeProbability ? (1.5 / 60) : 0;
        
        return (baseLoad + variableLoad) * weekendFactor * randomFactor + spike;
    }

    /**
     * Generate a single data point for current timestamp
     */
    generateDataPoint(timestamp = new Date()) {
        // Calculate solar production and consumption
        const solarProduced = this.calculateSolarProduction(timestamp);
        const consumed = this.calculateConsumption(timestamp);
        
        // Calculate grid usage (what's not covered by solar)
        const gridUsed = Math.max(0, consumed - solarProduced);
        
        // Calculate excess solar (if producing more than consuming)
        const excessSolar = Math.max(0, solarProduced - consumed);
        
        // Calculate money saved (solar used instead of grid)
        const solarUsed = Math.min(solarProduced, consumed);
        const moneySaved = solarUsed * this.gridRate;
        this.cumulativeSavings += moneySaved;
        
        // Calculate CO₂ reduced
        const co2Reduced = solarProduced * this.co2Factor;
        this.cumulativeCO2 += co2Reduced;
        
        // Calculate efficiency
        const efficiency = solarProduced > 0 ? 
            Math.min(100, (solarProduced / (this.solarCapacity / 60)) * 100) : 0;
        
        // Create data point
        const dataPoint = {
            timestamp: timestamp.toISOString(),
            timestampMs: timestamp.getTime(),
            dateTime: timestamp.toLocaleString(),
            
            // Energy values (kWh per minute)
            solarProduced: parseFloat(solarProduced.toFixed(4)),
            consumed: parseFloat(consumed.toFixed(4)),
            gridUsed: parseFloat(gridUsed.toFixed(4)),
            excessSolar: parseFloat(excessSolar.toFixed(4)),
            
            // Financial
            moneySavedNow: parseFloat(moneySaved.toFixed(2)),
            cumulativeSavings: parseFloat(this.cumulativeSavings.toFixed(2)),
            
            // Environmental
            co2ReducedNow: parseFloat(co2Reduced.toFixed(4)),
            cumulativeCO2: parseFloat(this.cumulativeCO2.toFixed(2)),
            
            // Metrics
            efficiency: parseFloat(efficiency.toFixed(1)),
            solarCoverage: consumed > 0 ? 
                parseFloat(((solarUsed / consumed) * 100).toFixed(1)) : 0,
            
            // Context
            hour: timestamp.getHours(),
            minute: timestamp.getMinutes(),
            dayOfWeek: timestamp.getDay(),
            isWeekend: timestamp.getDay() === 0 || timestamp.getDay() === 6
        };
        
        return dataPoint;
    }

    /**
     * Start real-time data generation
     */
    start() {
        if (this.isRunning) {
            console.log('Simulator already running');
            return;
        }
        
        this.isRunning = true;
        console.log('🚀 Real-time energy simulator started');
        
        // Generate initial data point
        const initialPoint = this.generateDataPoint();
        this.dataPoints.push(initialPoint);
        this.lastUpdate = new Date();
        
        // Update every minute (60000 ms)
        this.updateInterval = setInterval(() => {
            this.update();
        }, 60000);
        
        // Also update every second for demo purposes (optional)
        // Uncomment for faster updates during testing
        // this.updateInterval = setInterval(() => {
        //     this.update();
        // }, 1000);
    }

    /**
     * Update with new data point
     */
    update() {
        const now = new Date();
        const newPoint = this.generateDataPoint(now);
        
        // Add to data points
        this.dataPoints.push(newPoint);
        
        // Keep only last 24 hours of data
        if (this.dataPoints.length > this.maxDataPoints) {
            this.dataPoints.shift();
        }
        
        this.lastUpdate = now;
        
        // Trigger custom event for listeners
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('energyDataUpdate', {
                detail: newPoint
            }));
        }
        
        console.log(`📊 Updated: ${newPoint.dateTime} | Solar: ${newPoint.solarProduced.toFixed(4)} kWh | Consumed: ${newPoint.consumed.toFixed(4)} kWh`);
        
        return newPoint;
    }

    /**
     * Stop real-time generation
     */
    stop() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
        this.isRunning = false;
        console.log('⏹️ Real-time energy simulator stopped');
    }

    /**
     * Get all data points
     */
    getAllData() {
        return this.dataPoints;
    }

    /**
     * Get latest data point
     */
    getLatest() {
        return this.dataPoints[this.dataPoints.length - 1];
    }

    /**
     * Get data for specific time range
     */
    getDataRange(startTime, endTime) {
        return this.dataPoints.filter(point => {
            const time = new Date(point.timestamp).getTime();
            return time >= startTime && time <= endTime;
        });
    }

    /**
     * Get aggregated data by hour
     */
    getHourlyData() {
        const hourlyData = {};
        
        this.dataPoints.forEach(point => {
            const hour = point.hour;
            if (!hourlyData[hour]) {
                hourlyData[hour] = {
                    hour: hour,
                    solarProduced: 0,
                    consumed: 0,
                    gridUsed: 0,
                    count: 0
                };
            }
            
            hourlyData[hour].solarProduced += point.solarProduced;
            hourlyData[hour].consumed += point.consumed;
            hourlyData[hour].gridUsed += point.gridUsed;
            hourlyData[hour].count++;
        });
        
        // Convert to array and calculate averages
        return Object.values(hourlyData).map(data => ({
            hour: data.hour,
            solarProduced: parseFloat((data.solarProduced).toFixed(2)),
            consumed: parseFloat((data.consumed).toFixed(2)),
            gridUsed: parseFloat((data.gridUsed).toFixed(2))
        })).sort((a, b) => a.hour - b.hour);
    }

    /**
     * Get summary statistics
     */
    getSummary() {
        if (this.dataPoints.length === 0) return null;
        
        const latest = this.getLatest();
        const totalSolar = this.dataPoints.reduce((sum, p) => sum + p.solarProduced, 0);
        const totalConsumed = this.dataPoints.reduce((sum, p) => sum + p.consumed, 0);
        const totalGrid = this.dataPoints.reduce((sum, p) => sum + p.gridUsed, 0);
        
        return {
            dataPoints: this.dataPoints.length,
            duration: `${Math.floor(this.dataPoints.length / 60)} hours ${this.dataPoints.length % 60} minutes`,
            totalSolarProduced: parseFloat(totalSolar.toFixed(2)),
            totalConsumed: parseFloat(totalConsumed.toFixed(2)),
            totalGridUsed: parseFloat(totalGrid.toFixed(2)),
            cumulativeSavings: parseFloat(this.cumulativeSavings.toFixed(2)),
            cumulativeCO2: parseFloat(this.cumulativeCO2.toFixed(2)),
            averageSolarCoverage: parseFloat(((totalSolar / totalConsumed) * 100).toFixed(1)),
            currentSolarProduction: latest.solarProduced,
            currentConsumption: latest.consumed,
            lastUpdate: latest.dateTime
        };
    }

    /**
     * Export data as JSON
     */
    exportJSON() {
        return JSON.stringify({
            metadata: {
                solarCapacity: this.solarCapacity,
                baseConsumption: this.baseConsumption,
                gridRate: this.gridRate,
                co2Factor: this.co2Factor,
                startTime: this.startTime.toISOString(),
                lastUpdate: this.lastUpdate.toISOString(),
                dataPoints: this.dataPoints.length
            },
            summary: this.getSummary(),
            data: this.dataPoints
        }, null, 2);
    }

    /**
     * Export data as CSV
     */
    exportCSV() {
        if (this.dataPoints.length === 0) return '';
        
        const headers = Object.keys(this.dataPoints[0]).join(',');
        const rows = this.dataPoints.map(point => 
            Object.values(point).join(',')
        );
        
        return headers + '\n' + rows.join('\n');
    }

    /**
     * Helper: Get day of year
     */
    getDayOfYear(date) {
        const start = new Date(date.getFullYear(), 0, 0);
        const diff = date - start;
        const oneDay = 1000 * 60 * 60 * 24;
        return Math.floor(diff / oneDay);
    }

    /**
     * Reset simulator
     */
    reset() {
        this.stop();
        this.dataPoints = [];
        this.cumulativeCO2 = 0;
        this.cumulativeSavings = 0;
        this.startTime = new Date();
        this.lastUpdate = new Date();
        console.log('🔄 Simulator reset');
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RealTimeEnergySimulator;
}
