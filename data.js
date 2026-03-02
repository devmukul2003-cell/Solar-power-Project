// Generate 100 days of fake energy data
const energyData = [];
const startDate = new Date('2024-01-01');

for (let i = 0; i < 100; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    
    // Simulate seasonal variations
    const seasonFactor = Math.sin((i / 365) * Math.PI * 2) * 0.3 + 1;
    
    // Base values with random variations
    const solarGenerated = (8 + Math.random() * 6) * seasonFactor;
    const gridConsumed = 5 + Math.random() * 4;
    const totalConsumed = solarGenerated + gridConsumed;
    
    // Calculate savings (₹8 per kWh from grid)
    const moneySaved = solarGenerated * 8;
    
    // CO2 reduction (0.82 kg per kWh)
    const co2Reduced = solarGenerated * 0.82;
    
    energyData.push({
        date: date.toISOString().split('T')[0],
        solarGenerated: parseFloat(solarGenerated.toFixed(2)),
        gridConsumed: parseFloat(gridConsumed.toFixed(2)),
        totalConsumed: parseFloat(totalConsumed.toFixed(2)),
        moneySaved: parseFloat(moneySaved.toFixed(2)),
        co2Reduced: parseFloat(co2Reduced.toFixed(2)),
        peakSolarHour: Math.floor(11 + Math.random() * 3),
        efficiency: parseFloat((85 + Math.random() * 10).toFixed(1))
    });
}

// Hourly data for today
const hourlyData = [
    { hour: '00:00', solar: 0, consumption: 0.3 },
    { hour: '01:00', solar: 0, consumption: 0.2 },
    { hour: '02:00', solar: 0, consumption: 0.2 },
    { hour: '03:00', solar: 0, consumption: 0.2 },
    { hour: '04:00', solar: 0, consumption: 0.3 },
    { hour: '05:00', solar: 0, consumption: 0.4 },
    { hour: '06:00', solar: 0.2, consumption: 0.6 },
    { hour: '07:00', solar: 0.8, consumption: 0.9 },
    { hour: '08:00', solar: 1.5, consumption: 1.2 },
    { hour: '09:00', solar: 2.3, consumption: 1.4 },
    { hour: '10:00', solar: 3.2, consumption: 1.6 },
    { hour: '11:00', solar: 3.8, consumption: 1.8 },
    { hour: '12:00', solar: 4.2, consumption: 2.0 },
    { hour: '13:00', solar: 4.0, consumption: 2.2 },
    { hour: '14:00', solar: 3.5, consumption: 2.0 },
    { hour: '15:00', solar: 2.8, consumption: 1.8 },
    { hour: '16:00', solar: 2.0, consumption: 1.6 },
    { hour: '17:00', solar: 1.2, consumption: 1.8 },
    { hour: '18:00', solar: 0.5, consumption: 2.2 },
    { hour: '19:00', solar: 0.1, consumption: 2.5 },
    { hour: '20:00', solar: 0, consumption: 2.8 },
    { hour: '21:00', solar: 0, consumption: 2.3 },
    { hour: '22:00', solar: 0, consumption: 1.5 },
    { hour: '23:00', solar: 0, consumption: 0.8 }
];

// Sample users database (in real app, this would be server-side)
const users = [
    {
        id: 1,
        name: 'Demo User',
        email: 'demo@energy.com',
        password: 'demo123',
        location: 'Mumbai',
        solarCapacity: 5,
        joinDate: '2024-01-01'
    }
];
