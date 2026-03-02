// Check authentication
const authSystem = new UserAuthenticationSystem();
const session = authSystem.getCurrentSession();

if (!session) {
    window.location.href = 'login.html';
}

const currentUser = {
    id: session.userId,
    name: session.name,
    email: session.email,
    location: session.location,
    solarCapacity: session.solarCapacity
};

document.getElementById('userName').textContent = currentUser.name;
document.getElementById('userLocation').textContent = `${currentUser.location} • ${currentUser.solarCapacity}kW Solar`;

// Initialize dynamic data generator
const dataGenerator = new EnergyDataGenerator(
    currentUser.id,
    currentUser.solarCapacity || 5
);

// Load user-specific data
const userData = dataGenerator.loadUserData();
const energyData = userData.historicalData;
const hourlyData = userData.hourlyData;

// Real-time data update
let realTimeStats = dataGenerator.getRealTimeStats();

function logout() {
    authSystem.logout(currentUser.id);
    window.location.href = 'login.html';
}

function exportData() {
    const dateRange = parseInt(document.getElementById('dateRange').value);
    const data = energyData.slice(-dateRange);
    const csv = convertToCSV(data);
    downloadCSV(csv, 'energy-data.csv');
}

function convertToCSV(data) {
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row => Object.values(row).join(','));
    return headers + '\n' + rows.join('\n');
}

function downloadCSV(csv, filename) {
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
}

function calculateStats(days) {
    const data = energyData.slice(-days);
    const totalSolar = data.reduce((sum, d) => sum + d.solarGenerated, 0);
    const totalGrid = data.reduce((sum, d) => sum + d.gridConsumed, 0);
    const totalSavings = data.reduce((sum, d) => sum + d.moneySaved, 0);
    const totalCO2 = data.reduce((sum, d) => sum + d.co2Reduced, 0);
    
    return {
        solar: totalSolar / days,
        consumed: (totalSolar + totalGrid) / days,
        savings: totalSavings,
        co2: totalCO2
    };
}

function updateStats() {
    const days = parseInt(document.getElementById('dateRange').value);
    const stats = calculateStats(days);
    
    animateValue('solarProduced', 0, stats.solar, 1000, 1);
    animateValue('energyConsumed', 0, stats.consumed, 1000, 1);
    animateValue('moneySaved', 0, Math.round(stats.savings), 1000, 0, '₹');
    animateValue('co2Reduced', 0, Math.round(stats.co2), 1000, 0);
    
    const treesEquiv = Math.round(stats.co2 / 20);
    const carEquiv = Math.round(stats.co2 * 5.5);
    const cleanPercent = Math.round((stats.solar / stats.consumed) * 100);
    
    setTimeout(() => {
        animateValue('treesEquiv', 0, treesEquiv, 800, 0);
        animateValue('carEquiv', 0, carEquiv, 800, 0);
        document.getElementById('cleanPercent').textContent = cleanPercent + '%';
    }, 500);
}

function animateValue(id, start, end, duration, decimals = 0, prefix = '') {
    const element = document.getElementById(id);
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
            current = end;
            clearInterval(timer);
        }
        element.textContent = prefix + current.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }, 16);
}

let energyChart, weeklyChart;

function createCharts() {
    const energyCtx = document.getElementById('energyChart').getContext('2d');
    energyChart = new Chart(energyCtx, {
        type: 'line',
        data: {
            labels: hourlyData.map(d => d.hour),
            datasets: [{
                label: 'Solar Generated (kWh)',
                data: hourlyData.map(d => d.solar),
                borderColor: '#fbbf24',
                backgroundColor: 'rgba(251, 191, 36, 0.1)',
                tension: 0.4,
                fill: true
            }, {
                label: 'Energy Consumed (kWh)',
                data: hourlyData.map(d => d.consumption),
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            interaction: {
                mode: 'index',
                intersect: false
            },
            plugins: {
                legend: { position: 'bottom' },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + context.parsed.y.toFixed(2) + ' kWh';
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: { display: true, text: 'Energy (kWh)' }
                }
            }
        }
    });

    updateWeeklyChart();
}

function updateWeeklyChart() {
    const days = parseInt(document.getElementById('dateRange').value);
    const viewType = document.getElementById('viewType').value;
    const data = energyData.slice(-days);
    
    let labels, solarData, gridData;
    
    if (viewType === 'daily') {
        labels = data.map(d => new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
        solarData = data.map(d => d.solarGenerated);
        gridData = data.map(d => d.gridConsumed);
    } else if (viewType === 'weekly') {
        const weeks = groupByWeek(data);
        labels = weeks.map((w, i) => `Week ${i + 1}`);
        solarData = weeks.map(w => w.solar);
        gridData = weeks.map(w => w.grid);
    } else {
        const months = groupByMonth(data);
        labels = months.map(m => m.month);
        solarData = months.map(m => m.solar);
        gridData = months.map(m => m.grid);
    }
    
    if (weeklyChart) {
        weeklyChart.destroy();
    }
    
    const weeklyCtx = document.getElementById('weeklyChart').getContext('2d');
    weeklyChart = new Chart(weeklyCtx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Solar Generated',
                data: solarData,
                backgroundColor: '#fbbf24'
            }, {
                label: 'Grid Consumed',
                data: gridData,
                backgroundColor: '#3b82f6'
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'bottom' }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: { display: true, text: 'Energy (kWh)' }
                }
            }
        }
    });
}

function groupByWeek(data) {
    const weeks = [];
    for (let i = 0; i < data.length; i += 7) {
        const week = data.slice(i, i + 7);
        weeks.push({
            solar: week.reduce((sum, d) => sum + d.solarGenerated, 0),
            grid: week.reduce((sum, d) => sum + d.gridConsumed, 0)
        });
    }
    return weeks;
}

function groupByMonth(data) {
    const months = {};
    data.forEach(d => {
        const month = new Date(d.date).toLocaleDateString('en-US', { month: 'short' });
        if (!months[month]) {
            months[month] = { month, solar: 0, grid: 0 };
        }
        months[month].solar += d.solarGenerated;
        months[month].grid += d.gridConsumed;
    });
    return Object.values(months);
}

function updateDashboard() {
    updateStats();
    updateWeeklyChart();
}

// Initialize
updateStats();
createCharts();

// Real-time updates every 5 seconds
setInterval(() => {
    realTimeStats = dataGenerator.getRealTimeStats();
    
    // Update real-time indicator
    document.getElementById('realtimeSolar').textContent = `${realTimeStats.currentSolar.toFixed(2)} kWh`;
    document.getElementById('realtimeConsumption').textContent = `${realTimeStats.currentConsumption.toFixed(2)} kWh`;
    
    // Update hourly chart with current values
    const currentHour = new Date().getHours();
    if (energyChart && energyChart.data.datasets[0]) {
        energyChart.data.datasets[0].data[currentHour] = realTimeStats.currentSolar;
        energyChart.data.datasets[1].data[currentHour] = realTimeStats.currentConsumption;
        energyChart.update('none');
    }
    
    // Show notification about current status
    const solarPercent = realTimeStats.currentSolar > 0 
        ? Math.round((realTimeStats.currentSolar / realTimeStats.currentConsumption) * 100)
        : 0;
    
    if (solarPercent >= 100) {
        // Excess solar
        const excess = (realTimeStats.currentSolar - realTimeStats.currentConsumption).toFixed(2);
        console.log(`⚡ Generating ${excess} kWh excess solar power!`);
    } else if (solarPercent > 0) {
        console.log(`☀️ Solar covering ${solarPercent}% of current consumption`);
    }
}, 5000);

// Update hourly data every minute
setInterval(() => {
    const newHourlyData = dataGenerator.generateHourlyData();
    hourlyData.length = 0;
    hourlyData.push(...newHourlyData);
    
    if (energyChart) {
        energyChart.data.labels = hourlyData.map(d => d.hour);
        energyChart.data.datasets[0].data = hourlyData.map(d => d.solar);
        energyChart.data.datasets[1].data = hourlyData.map(d => d.consumption);
        energyChart.update();
    }
}, 60000);


// Notification system
function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification ${type} show`;
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Show welcome notification
setTimeout(() => {
    const hour = new Date().getHours();
    let greeting = 'Good morning';
    if (hour >= 12 && hour < 17) greeting = 'Good afternoon';
    else if (hour >= 17) greeting = 'Good evening';
    
    showNotification(`${greeting}, ${currentUser.name}! Your ${currentUser.solarCapacity}kW system is active. 🌟`, 'success');
}, 500);

// Show insights periodically
setInterval(() => {
    const stats = calculateStats(30);
    const insights = [
        `💡 Tip: Run heavy appliances during peak solar hours (10 AM - 3 PM)`,
        `🌟 Great job! You've saved ₹${Math.round(stats.savings).toLocaleString()} this month`,
        `🌱 Consider cleaning your solar panels for better efficiency`,
        `🌳 You're offsetting ${Math.round(stats.co2 / 20)} trees worth of CO₂ this month!`,
        `⚡ Your system is generating ${realTimeStats.currentSolar.toFixed(1)} kWh right now`,
        `📊 Your clean energy usage is ${Math.round((stats.solar / stats.consumed) * 100)}%`
    ];
    const randomInsight = insights[Math.floor(Math.random() * insights.length)];
    showNotification(randomInsight, 'info');
}, 45000);
