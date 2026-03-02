// Smart Energy Dashboard - Enhanced with Real-Time Data

// Check authentication using new system
if (!userDataManager.isUserLoggedIn()) {
    window.location.href = 'index.html';
}

const currentUserSession = userDataManager.getCurrentUser();
const userData = userDataManager.findUser(currentUserSession.userId);

// Display user information
document.getElementById('userName').textContent = userData.userId.split('@')[0];
document.getElementById('userEmail').textContent = userData.userId;

// Display session information
document.getElementById('displayUserId').textContent = userData.userId;
const statusBadge = document.getElementById('displaySessionStatus');
statusBadge.textContent = userData.sessionStatus;
statusBadge.className = `status-badge ${userData.sessionStatus === 'logged_in' ? 'status-active' : 'status-inactive'}`;
document.getElementById('displayLastLogin').textContent = userData.lastLogin ? formatDateTime(userData.lastLogin) : 'Never';
document.getElementById('displaySignupDate').textContent = formatDateTime(userData.signupDate);

// Initialize Real-Time Data Engine
const dataEngine = new RealTimeDataEngine(userData.userId, 5);

// Get initial data
let historicalData = dataEngine.getHistoricalData(100);
let weeklyData = dataEngine.getWeeklyData();
let todayHourlyData = dataEngine.getTodayHourlyData();
let todayMinuteData = dataEngine.getTodayMinuteData();

// LOGOUT FLOW: Handle logout
function handleLogout() {
    dataEngine.stopRealTimeUpdates();
    const result = userDataManager.logout();
    if (result.success) {
        window.location.href = 'index.html';
    }
}

function exportData() {
    const csv = dataEngine.exportData('csv');
    downloadCSV(csv, `energy-data-${new Date().toISOString().split('T')[0]}.csv`);
    showNotification('Data exported successfully!', 'success');
}

function downloadCSV(csv, filename) {
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
}

function calculateStats(days) {
    const data = historicalData.slice(-days);
    const totalSolar = data.reduce((sum, d) => sum + d.solarGenerated, 0);
    const totalConsumption = data.reduce((sum, d) => sum + d.consumption, 0);
    const totalSavings = data.reduce((sum, d) => sum + d.moneySaved, 0);
    const totalCO2 = data.reduce((sum, d) => sum + d.co2Reduced, 0);
    
    return {
        solar: totalSolar / days,
        consumed: totalConsumption / days,
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
    createTodayChart();
    createWeeklyChart();
}

function createTodayChart() {
    const energyCtx = document.getElementById('energyChart').getContext('2d');
    
    if (energyChart) {
        energyChart.destroy();
    }
    
    energyChart = new Chart(energyCtx, {
        type: 'line',
        data: {
            labels: todayHourlyData.map(d => d.hour),
            datasets: [{
                label: 'Solar Generated (kWh)',
                data: todayHourlyData.map(d => d.solar),
                borderColor: '#fbbf24',
                backgroundColor: 'rgba(251, 191, 36, 0.1)',
                tension: 0.4,
                fill: true,
                pointRadius: 4,
                pointHoverRadius: 6
            }, {
                label: 'Energy Consumed (kWh)',
                data: todayHourlyData.map(d => d.consumption),
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.4,
                fill: true,
                pointRadius: 4,
                pointHoverRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            interaction: {
                mode: 'index',
                intersect: false
            },
            plugins: {
                legend: { 
                    position: 'bottom',
                    labels: {
                        usePointStyle: true,
                        padding: 15
                    }
                },
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
                },
                x: {
                    title: { display: true, text: 'Time (24-hour format)' }
                }
            },
            animation: {
                duration: 750
            }
        }
    });
}

function createWeeklyChart() {
    const days = parseInt(document.getElementById('dateRange').value);
    const viewType = document.getElementById('viewType').value;
    const data = historicalData.slice(-days);
    
    let labels, solarData, consumptionData, savingsData;
    
    if (viewType === 'daily') {
        labels = data.map(d => new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
        solarData = data.map(d => d.solarGenerated);
        consumptionData = data.map(d => d.consumption);
        savingsData = data.map(d => d.moneySaved);
    } else if (viewType === 'weekly') {
        const weeks = groupByWeek(data);
        labels = weeks.map((w, i) => `Week ${i + 1}`);
        solarData = weeks.map(w => w.solar);
        consumptionData = weeks.map(w => w.consumption);
        savingsData = weeks.map(w => w.savings);
    } else {
        const months = groupByMonth(data);
        labels = months.map(m => m.month);
        solarData = months.map(m => m.solar);
        consumptionData = months.map(m => m.consumption);
        savingsData = months.map(m => m.savings);
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
                label: 'Solar Generated (kWh)',
                data: solarData,
                backgroundColor: '#fbbf24',
                borderRadius: 6
            }, {
                label: 'Total Consumed (kWh)',
                data: consumptionData,
                backgroundColor: '#3b82f6',
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { 
                    position: 'bottom',
                    labels: {
                        usePointStyle: true,
                        padding: 15
                    }
                },
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
}

function groupByWeek(data) {
    const weeks = [];
    for (let i = 0; i < data.length; i += 7) {
        const week = data.slice(i, i + 7);
        weeks.push({
            solar: week.reduce((sum, d) => sum + d.solarGenerated, 0),
            consumption: week.reduce((sum, d) => sum + d.consumption, 0),
            savings: week.reduce((sum, d) => sum + d.moneySaved, 0)
        });
    }
    return weeks;
}

function groupByMonth(data) {
    const months = {};
    data.forEach(d => {
        const month = new Date(d.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        if (!months[month]) {
            months[month] = { month, solar: 0, consumption: 0, savings: 0 };
        }
        months[month].solar += d.solarGenerated;
        months[month].consumption += d.consumption;
        months[month].savings += d.moneySaved;
    });
    return Object.values(months);
}

function updateDashboard() {
    historicalData = dataEngine.getHistoricalData(100);
    updateStats();
    createWeeklyChart();
}

function formatDateTime(isoString) {
    const date = new Date(isoString);
    return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Initialize
updateStats();
createCharts();

// Listen for real-time data updates
window.addEventListener('energyDataUpdate', (event) => {
    const newData = event.detail;
    
    // Update real-time indicators
    document.getElementById('realtimeSolar').textContent = `${newData.solar.toFixed(2)} kW`;
    document.getElementById('realtimeConsumption').textContent = `${newData.consumption.toFixed(2)} kW`;
    
    // Update today's chart with new data
    todayHourlyData = dataEngine.getTodayHourlyData();
    
    if (energyChart) {
        energyChart.data.labels = todayHourlyData.map(d => d.hour);
        energyChart.data.datasets[0].data = todayHourlyData.map(d => d.solar);
        energyChart.data.datasets[1].data = todayHourlyData.map(d => d.consumption);
        energyChart.update('none'); // Update without animation for smooth real-time feel
    }
    
    // Show notification for significant events
    if (newData.excessSolar > 1) {
        console.log(`⚡ Generating ${newData.excessSolar.toFixed(2)} kW excess solar power!`);
    }
});

// Refresh stats every minute
setInterval(() => {
    updateStats();
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
    
    showNotification(`${greeting}, ${userData.userId.split('@')[0]}! Your dashboard is live with real-time updates. 🌟`, 'success');
}, 500);

// Show insights periodically
setInterval(() => {
    const stats = calculateStats(30);
    const currentData = dataEngine.getCurrentRealTimeData();
    const insights = [
        `💡 Tip: Run heavy appliances during peak solar hours (10 AM - 3 PM)`,
        `🌟 You've saved ₹${Math.round(stats.savings).toLocaleString()} this month`,
        `🌱 Consider cleaning your solar panels for better efficiency`,
        `🌳 You're offsetting ${Math.round(stats.co2 / 20)} trees worth of CO₂!`,
        `⚡ Currently generating ${currentData.solar.toFixed(1)} kW solar power`,
        `📊 Your clean energy usage is ${Math.round((stats.solar / stats.consumed) * 100)}%`,
        `☀️ Solar covering ${currentData.solarPercentage}% of current consumption`
    ];
    const randomInsight = insights[Math.floor(Math.random() * insights.length)];
    showNotification(randomInsight, 'info');
}, 45000);

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    dataEngine.stopRealTimeUpdates();
});
