// Dynamic data generation based on user and real-time factors

class EnergyDataGenerator {
    constructor(userId, solarCapacity = 5) {
        this.userId = userId;
        this.solarCapacity = solarCapacity;
        this.baselineConsumption = 15; // kWh per day
        this.currentDate = new Date();
    }

    // Get current hour solar generation (0-24)
    getCurrentSolarGeneration() {
        const hour = new Date().getHours();
        const minute = new Date().getMinutes();
        const timeDecimal = hour + minute / 60;
        
        // Solar generation curve (6 AM to 6 PM)
        if (timeDecimal < 6 || timeDecimal > 18) {
            return 0;
        }
        
        // Peak at noon (12 PM)
        const peakHour = 12;
        const hoursFromPeak = Math.abs(timeDecimal - peakHour);
        const maxGeneration = this.solarCapacity * 0.85; // 85% efficiency
        
        // Bell curve for solar generation
        const generation = maxGeneration * Math.exp(-Math.pow(hoursFromPeak / 4, 2));
        
        // Add some randomness (weather variations)
        const randomFactor = 0.85 + Math.random() * 0.3; // 85% to 115%
        
        return Math.max(0, generation * randomFactor);
    }

    // Get current consumption based on time of day
    getCurrentConsumption() {
        const hour = new Date().getHours();
        
        // Consumption patterns throughout the day
        let baseLoad = 0.5; // Always-on devices
        let variableLoad = 0;
        
        if (hour >= 0 && hour < 6) {
            // Night: minimal usage
            variableLoad = 0.2;
        } else if (hour >= 6 && hour < 9) {
            // Morning: high usage (breakfast, getting ready)
            variableLoad = 1.5;
        } else if (hour >= 9 && hour < 17) {
            // Day: moderate usage
            variableLoad = 0.8;
        } else if (hour >= 17 && hour < 23) {
            // Evening: peak usage (cooking, entertainment)
            variableLoad = 2.0;
        } else {
            // Late night
            variableLoad = 0.5;
        }
        
        // Add randomness
        const randomFactor = 0.8 + Math.random() * 0.4;
        
        return (baseLoad + variableLoad) * randomFactor;
    }

    // Generate historical data for past N days
    generateHistoricalData(days = 100) {
        const data = [];
        const today = new Date();
        
        for (let i = days - 1; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            
            // Seasonal factor (more sun in summer)
            const dayOfYear = this.getDayOfYear(date);
            const seasonFactor = 0.7 + 0.6 * Math.sin((dayOfYear - 80) / 365 * Math.PI * 2);
            
            // Weather randomness (cloudy days)
            const weatherFactor = 0.6 + Math.random() * 0.7;
            
            // Daily solar generation
            const dailySolar = this.solarCapacity * 5 * seasonFactor * weatherFactor;
            
            // Daily consumption (varies by day of week)
            const isWeekend = date.getDay() === 0 || date.getDay() === 6;
            const consumptionFactor = isWeekend ? 1.2 : 1.0;
            const dailyConsumption = this.baselineConsumption * consumptionFactor * (0.9 + Math.random() * 0.2);
            
            // Grid consumption (what's not covered by solar)
            const gridConsumption = Math.max(0, dailyConsumption - dailySolar);
            
            // Calculate savings (₹8 per kWh from grid)
            const moneySaved = dailySolar * 8;
            
            // CO2 reduction (0.82 kg per kWh)
            const co2Reduced = dailySolar * 0.82;
            
            data.push({
                date: date.toISOString().split('T')[0],
                solarGenerated: parseFloat(dailySolar.toFixed(2)),
                gridConsumed: parseFloat(gridConsumption.toFixed(2)),
                totalConsumed: parseFloat(dailyConsumption.toFixed(2)),
                moneySaved: parseFloat(moneySaved.toFixed(2)),
                co2Reduced: parseFloat(co2Reduced.toFixed(2)),
                peakSolarHour: 11 + Math.floor(Math.random() * 3),
                efficiency: parseFloat((85 + Math.random() * 10).toFixed(1)),
                seasonFactor: parseFloat(seasonFactor.toFixed(2)),
                weatherFactor: parseFloat(weatherFactor.toFixed(2))
            });
        }
        
        return data;
    }

    // Generate hourly data for today
    generateHourlyData() {
        const hourlyData = [];
        const currentHour = new Date().getHours();
        
        for (let hour = 0; hour < 24; hour++) {
            const timeStr = `${hour.toString().padStart(2, '0')}:00`;
            
            // Calculate solar for this hour
            let solar = 0;
            if (hour >= 6 && hour <= 18) {
                const hoursFromPeak = Math.abs(hour - 12);
                const maxGeneration = this.solarCapacity * 0.85;
                solar = maxGeneration * Math.exp(-Math.pow(hoursFromPeak / 4, 2));
                solar *= (0.85 + Math.random() * 0.3);
            }
            
            // Calculate consumption for this hour
            let consumption = 0.5; // Base load
            if (hour >= 6 && hour < 9) {
                consumption += 1.5;
            } else if (hour >= 9 && hour < 17) {
                consumption += 0.8;
            } else if (hour >= 17 && hour < 23) {
                consumption += 2.0;
            } else {
                consumption += 0.3;
            }
            consumption *= (0.8 + Math.random() * 0.4);
            
            // If it's a future hour, use projected values
            if (hour > currentHour) {
                solar *= 0.95; // Slightly reduce for forecast
                consumption *= 0.95;
            }
            
            hourlyData.push({
                hour: timeStr,
                solar: parseFloat(solar.toFixed(2)),
                consumption: parseFloat(consumption.toFixed(2))
            });
        }
        
        return hourlyData;
    }

    // Get day of year (1-365)
    getDayOfYear(date) {
        const start = new Date(date.getFullYear(), 0, 0);
        const diff = date - start;
        const oneDay = 1000 * 60 * 60 * 24;
        return Math.floor(diff / oneDay);
    }

    // Get real-time stats for dashboard
    getRealTimeStats() {
        const currentSolar = this.getCurrentSolarGeneration();
        const currentConsumption = this.getCurrentConsumption();
        const gridUsage = Math.max(0, currentConsumption - currentSolar);
        
        return {
            currentSolar: parseFloat(currentSolar.toFixed(2)),
            currentConsumption: parseFloat(currentConsumption.toFixed(2)),
            currentGrid: parseFloat(gridUsage.toFixed(2)),
            timestamp: new Date().toISOString()
        };
    }

    // Save user's data to localStorage
    saveUserData() {
        const userData = {
            userId: this.userId,
            historicalData: this.generateHistoricalData(100),
            hourlyData: this.generateHourlyData(),
            lastUpdated: new Date().toISOString()
        };
        
        localStorage.setItem(`energyData_${this.userId}`, JSON.stringify(userData));
        return userData;
    }

    // Load user's data from localStorage
    loadUserData() {
        const stored = localStorage.getItem(`energyData_${this.userId}`);
        if (stored) {
            const data = JSON.parse(stored);
            const lastUpdate = new Date(data.lastUpdated);
            const now = new Date();
            
            // Regenerate if data is older than 1 hour
            if (now - lastUpdate > 3600000) {
                return this.saveUserData();
            }
            
            return data;
        }
        
        return this.saveUserData();
    }
}

// Initialize data for current user
function initializeUserData() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return null;
    
    const generator = new EnergyDataGenerator(
        currentUser.id,
        currentUser.solarCapacity || 5
    );
    
    return generator.loadUserData();
}

// Export for use in dashboard
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { EnergyDataGenerator, initializeUserData };
}
