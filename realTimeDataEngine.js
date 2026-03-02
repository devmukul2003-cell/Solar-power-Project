// Real-Time Data Engine for Smart Energy Dashboard
// Simulates IoT sensor data with realistic patterns

class RealTimeDataEngine {
    constructor(userId, solarCapacity = 5) {
        this.userId = userId;
        this.solarCapacity = solarCapacity;
        this.storageKey = `energyData_${userId}`;
        this.currentDataKey = `currentData_${userId}`;
        
        // Initialize data structures
        this.initializeDataStructures();
        
        // Start real-time data generation
        this.startRealTimeUpdates();
    }

    initializeDataStructures() {
        // Get or create historical data
        const stored = localStorage.getItem(this.storageKey);
        if (!stored) {
            this.historicalData = this.generateInitialHistoricalData();
            this.saveHistoricalData();
        } else {
            this.historicalData = JSON.parse(stored);
        }

        // Initialize today's minute-by-minute data
        this.todayMinuteData = this.generateTodayMinuteData();
        
        // Initialize hourly aggregates
        this.todayHourlyData = this.aggregateToHourly(this.todayMinuteData);
    }

    generateInitialHistoricalData() {
        const data = [];
        const today = new Date();
        
        // Generate last 100 days of data
        for (let i = 99; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            
            const dayOfWeek = date.getDay();
            const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
            
            // Seasonal variation (higher solar in summer months)
            const month = date.getMonth();
            const seasonalFactor = 0.7 + 0.3 * Math.sin((month - 2) * Math.PI / 6);
            
            const solarGenerated = (this.solarCapacity * 4.5 * seasonalFactor * (0.9 + Math.random() * 0.2)).toFixed(2);
            const baseConsumption = isWeekend ? 18 : 15;
            const consumption = (baseConsumption + Math.random() * 5).toFixed(2);
            const gridConsumed = Math.max(0, consumption - solarGenerated).toFixed(2);
            
            const moneySaved = (solarGenerated * 8).toFixed(2); // ₹8 per kWh
            const co2Reduced = (solarGenerated * 0.82).toFixed(2); // 0.82 kg CO2 per kWh
            
            data.push({
                date: date.toISOString().split('T')[0],
                timestamp: date.getTime(),
                solarGenerated: parseFloat(solarGenerated),
                consumption: parseFloat(consumption),
                gridConsumed: parseFloat(gridConsumed),
                moneySaved: parseFloat(moneySaved),
                co2Reduced: parseFloat(co2Reduced)
            });
        }
        
        return data;
    }

    generateTodayMinuteData() {
        const data = [];
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
        
        // Generate data for every minute from start of day to current time
        const currentMinute = now.getHours() * 60 + now.getMinutes();
        
        for (let minute = 0; minute <= currentMinute; minute++) {
            const timestamp = new Date(startOfDay.getTime() + minute * 60000);
            const hour = Math.floor(minute / 60);
            const minuteOfHour = minute % 60;
            
            // Solar generation pattern (bell curve, peak at noon)
            let solar = 0;
            if (hour >= 6 && hour <= 18) {
                const hourFromNoon = Math.abs(hour - 12);
                const solarFactor = Math.max(0, 1 - (hourFromNoon / 6));
                solar = this.solarCapacity * solarFactor * (0.9 + Math.random() * 0.2);
            }
            
            // Consumption pattern (varies by time of day)
            let consumption = 0.5; // Base load
            if (hour >= 6 && hour <= 9) consumption += 2 + Math.random(); // Morning peak
            else if (hour >= 12 && hour <= 14) consumption += 1.5 + Math.random(); // Lunch
            else if (hour >= 18 && hour <= 23) consumption += 3 + Math.random() * 2; // Evening peak
            else consumption += Math.random() * 0.5; // Night
            
            data.push({
                timestamp: timestamp.getTime(),
                time: timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
                hour: hour,
                minute: minuteOfHour,
                solar: parseFloat(solar.toFixed(3)),
                consumption: parseFloat(consumption.toFixed(3))
            });
        }
        
        return data;
    }

    aggregateToHourly(minuteData) {
        const hourlyData = [];
        
        for (let hour = 0; hour < 24; hour++) {
            const hourMinutes = minuteData.filter(d => d.hour === hour);
            
            if (hourMinutes.length > 0) {
                const avgSolar = hourMinutes.reduce((sum, d) => sum + d.solar, 0) / hourMinutes.length;
                const avgConsumption = hourMinutes.reduce((sum, d) => sum + d.consumption, 0) / hourMinutes.length;
                
                hourlyData.push({
                    hour: `${hour}:00`,
                    hourNum: hour,
                    solar: parseFloat(avgSolar.toFixed(2)),
                    consumption: parseFloat(avgConsumption.toFixed(2)),
                    dataPoints: hourMinutes.length
                });
            } else {
                // Future hours - show zero
                hourlyData.push({
                    hour: `${hour}:00`,
                    hourNum: hour,
                    solar: 0,
                    consumption: 0,
                    dataPoints: 0
                });
            }
        }
        
        return hourlyData;
    }

    getCurrentRealTimeData() {
        const now = new Date();
        const hour = now.getHours();
        const minute = now.getMinutes();
        
        // Solar generation (realistic pattern)
        let solar = 0;
        if (hour >= 6 && hour <= 18) {
            const hourFromNoon = Math.abs(hour - 12);
            const minuteFactor = minute / 60;
            const solarFactor = Math.max(0, 1 - (hourFromNoon / 6));
            solar = this.solarCapacity * solarFactor * (0.9 + Math.random() * 0.2);
        }
        
        // Consumption (realistic pattern)
        let consumption = 0.5; // Base load
        if (hour >= 6 && hour <= 9) consumption += 2 + Math.random();
        else if (hour >= 12 && hour <= 14) consumption += 1.5 + Math.random();
        else if (hour >= 18 && hour <= 23) consumption += 3 + Math.random() * 2;
        else consumption += Math.random() * 0.5;
        
        const gridUsage = Math.max(0, consumption - solar);
        const solarUsage = Math.min(solar, consumption);
        const excessSolar = Math.max(0, solar - consumption);
        
        return {
            timestamp: now.getTime(),
            time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            solar: parseFloat(solar.toFixed(3)),
            consumption: parseFloat(consumption.toFixed(3)),
            gridUsage: parseFloat(gridUsage.toFixed(3)),
            solarUsage: parseFloat(solarUsage.toFixed(3)),
            excessSolar: parseFloat(excessSolar.toFixed(3)),
            solarPercentage: solar > 0 ? Math.min(100, (solarUsage / consumption * 100).toFixed(1)) : 0
        };
    }

    addMinuteDataPoint(data) {
        this.todayMinuteData.push(data);
        
        // Keep only last 24 hours of minute data
        const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
        this.todayMinuteData = this.todayMinuteData.filter(d => d.timestamp > oneDayAgo);
        
        // Update hourly aggregates
        this.todayHourlyData = this.aggregateToHourly(this.todayMinuteData);
    }

    startRealTimeUpdates() {
        this.updateCount = 0;
        
        // Update every 10 seconds (simulating real-time sensor data)
        this.updateInterval = setInterval(async () => {
            const newData = this.getCurrentRealTimeData();
            
            // Add to minute data
            this.addMinuteDataPoint({
                timestamp: newData.timestamp,
                time: newData.time,
                hour: new Date().getHours(),
                minute: new Date().getMinutes(),
                solar: newData.solar,
                consumption: newData.consumption
            });
            
            // Store current data
            localStorage.setItem(this.currentDataKey, JSON.stringify(newData));
            
            // 🔥 SYNC TO MONGODB every 10 updates (100 seconds)
            if (this.updateCount % 10 === 0 && typeof api !== 'undefined') {
                try {
                    await api.createEnergyData(
                        newData.solar,
                        newData.consumption,
                        new Date()
                    );
                    console.log('✅ Energy data synced to MongoDB:', {
                        solar: newData.solar.toFixed(2) + ' kW',
                        consumption: newData.consumption.toFixed(2) + ' kW'
                    });
                } catch (error) {
                    console.error('❌ Failed to sync energy data:', error.message);
                }
            }
            
            this.updateCount++;
            
            // Trigger custom event for listeners
            window.dispatchEvent(new CustomEvent('energyDataUpdate', { detail: newData }));
        }, 10000); // Update every 10 seconds
    }

    stopRealTimeUpdates() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
    }

    getHistoricalData(days = 30) {
        return this.historicalData.slice(-days);
    }

    getWeeklyData() {
        const last7Days = this.historicalData.slice(-7);
        return last7Days.map(day => ({
            date: new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            solar: day.solarGenerated,
            consumption: day.consumption,
            grid: day.gridConsumed,
            savings: day.moneySaved,
            co2: day.co2Reduced
        }));
    }

    getCustomRangeData(startDate, endDate) {
        const start = new Date(startDate).getTime();
        const end = new Date(endDate).getTime();
        
        return this.historicalData.filter(day => {
            const dayTime = new Date(day.date).getTime();
            return dayTime >= start && dayTime <= end;
        });
    }

    getTodayHourlyData() {
        return this.todayHourlyData;
    }

    getTodayMinuteData() {
        return this.todayMinuteData;
    }

    getTodayStats() {
        const today = new Date().toISOString().split('T')[0];
        const todayData = this.historicalData.find(d => d.date === today);
        
        if (todayData) {
            return todayData;
        }
        
        // Calculate from minute data
        const totalSolar = this.todayMinuteData.reduce((sum, d) => sum + d.solar, 0) / 60; // Convert to kWh
        const totalConsumption = this.todayMinuteData.reduce((sum, d) => sum + d.consumption, 0) / 60;
        
        return {
            date: today,
            solarGenerated: parseFloat(totalSolar.toFixed(2)),
            consumption: parseFloat(totalConsumption.toFixed(2)),
            gridConsumed: Math.max(0, totalConsumption - totalSolar).toFixed(2),
            moneySaved: (totalSolar * 8).toFixed(2),
            co2Reduced: (totalSolar * 0.82).toFixed(2)
        };
    }

    saveHistoricalData() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.historicalData));
    }

    exportData(format = 'json') {
        const data = {
            userId: this.userId,
            exportDate: new Date().toISOString(),
            historicalData: this.historicalData,
            todayMinuteData: this.todayMinuteData,
            todayHourlyData: this.todayHourlyData
        };
        
        if (format === 'json') {
            return JSON.stringify(data, null, 2);
        } else if (format === 'csv') {
            return this.convertToCSV(this.historicalData);
        }
    }

    convertToCSV(data) {
        const headers = ['Date', 'Solar Generated (kWh)', 'Consumption (kWh)', 'Grid Consumed (kWh)', 'Money Saved (₹)', 'CO2 Reduced (kg)'];
        const rows = data.map(d => [
            d.date,
            d.solarGenerated,
            d.consumption,
            d.gridConsumed,
            d.moneySaved,
            d.co2Reduced
        ]);
        
        return [headers, ...rows].map(row => row.join(',')).join('\n');
    }
}

// Export for use in other scripts
window.RealTimeDataEngine = RealTimeDataEngine;
