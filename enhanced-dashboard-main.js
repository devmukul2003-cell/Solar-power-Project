// Enhanced Dashboard Main Script

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

// Initialize Enhanced Dashboard
const enhancedDashboard = new EnhancedDashboard(currentUser.id, currentUser.solarCapacity);

// Initialize data generator
const dataGenerator = new EnergyDataGenerator(currentUser.id, currentUser.solarCapacity);
const userData = dataGenerator.loadUserData();
const energyData = userData.historicalData;
const hourlyData = userData.hourlyData;

// Update user info
document.getElementById('userName').textContent = currentUser.name;
document.getElementById('userLocation').textContent = `${currentUser.location} • ${currentUser.solarCapacity}kW Solar`;

// Language Toggle
document.getElementById('languageToggle').addEventListener('click', () => {
    enhancedDashboard.toggleLanguage();
    updateLanguageUI();
});

function updateLanguageUI() {
    const lang = enhancedDashboard.getLanguage();
    const langText = document.getElementById('langText');
    langText.textContent = lang === 'english' ? 'EN' : 'हिं';
    
    // Update all translatable elements
    enhancedDashboard.applyLanguage();
    
    // Update chart labels
    if (energyChart) {
        updateChartLabels();
    }
    
    showNotification(
        lang === 'english' ? 'Language changed to English' : 'भाषा हिंदी में बदली गई',
        'success'
    );
}

// Theme Toggle
document.getElementById('themeToggle').addEventListener('click', () => {
    enhancedDashboard.toggleTheme();
    updateThemeUI();
});

function updateThemeUI() {
    const theme = enhancedDashboard.getTheme();
    const themeIcon = document.getElementById('themeIcon');
    themeIcon.textContent = theme === 'light' ? '🌙' : '☀️';
    
    showNotification(
        theme === 'light' ? 'Switched to Light Mode' : 'Switched to Dark Mode',
        'success'
    );
}

// Date Range Handling
function handleDateRangeChange() {
    const select = document.getElementById('dateRange');
    const customRange = document.getElementById('customDateRange');
    
    if (select.value === 'custom') {
        customRange.style.display = 'flex';
        
        // Set default dates
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 30);
        
        document.getElementById('startDate').value = startDate.toISOString().split('T')[0];
        document.getElementById('endDate').value = endDate.toISOString().split('T')[0];
    } else {
        customRange.style.display = 'none';
        enhancedDashboard.setDateRange(select.value);
        updateDashboard();
    }
}

function applyCustomRange() {
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    
    if (!startDate || !endDate) {
        showNotification('Please select both start and end dates', 'warning');
        return;
    }
    
    if (new Date(startDate) > new Date(endDate)) {
        showNotification('Start date must be before end date', 'warning');
        return;
    }
    
    enhancedDashboard.setDateRange('custom', startDate, endDate);
    updateDashboard();
    showNotification('Custom date range applied', 'success');
}

// Incentive Points Functions
function updateIncentivePoints() {
    const points = enhancedDashboard.incentiveSystem.getPoints();
    
    animateValue('totalPoints', 0, points.totalPoints, 1000, 0);
    animateValue('pointsEarned', 0, points.pointsEarned, 1000, 0);
    animateValue('pointsRedeemed', 0, points.pointsRedeemed, 1000, 0);
}

function calculateAndAwardPoints() {
    const days = enhancedDashboard.getDateRangeDays();
    const filteredData = enhancedDashboard.getFilteredData(energyData);
    
    filteredData.forEach(day => {
        const solarUsed = Math.min(day.solarGenerated, day.totalConsumed);
        enhancedDashboard.incentiveSystem.awardPoints(
            day.solarGenerated,
            day.totalConsumed,
            day.date
        );
    });
    
    updateIncentivePoints();
}

function resetPoints() {
    if (confirm('Are you sure you want to reset all points? This action cannot be undone.')) {
        enhancedDashboard.incentiveSystem.resetPoints();
        updateIncentivePoints();
        
        // Add animation
        document.querySelector('.incentive-card').classList.add('points-awarded');
        setTimeout(() => {
            document.querySelector('.incentive-card').classList.remove('points-awarded');
        }, 500);
        
        showNotification('Points reset successfully', 'success');
    }
}

// Logout
function logout() {
    authSystem.logout(currentUser.id);
    window.location.href = 'login.html';
}

// Export Data
function exportData() {
    const dateRange = parseInt(document.getElementById('dateRange').value);
    const filteredData = enhancedDashboard.getFilteredData(energyData);
    const csv = convertToCSV(filteredData);
    downloadCSV(csv, `energy-data-${new Date().toISOString().split('T')[0]}.csv`);
    showNotification('Data exported successfully', 'success');
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

// Calculate Stats
function calculateStats(days) {
    const filteredData = enhancedDashboard.getFilteredData(energyData);
    const totalSolar = filteredData.reduce((sum, d) => sum + d.solarGenerated, 0);
    const totalGrid = filteredData.reduce((sum, d) => sum + d.gridConsumed, 0);
    const totalSavings = filteredData.reduce((sum, d) => sum + d.moneySaved, 0);
    const totalCO2 = filteredData.reduce((sum, d) => sum + d.co2Reduced, 0);
    
    return {
        solar: totalSolar / filteredData.length,
        consumed: (totalSolar + totalGrid) / filteredData.length,
        savings: totalSavings,
        co2: totalCO2
    };
}

function updateStats() {
    const stats = calculateStats();
    
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

// Charts
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

    updateWeeklyChart();
}

function updateWeeklyChart() {
    const filteredData = enhancedDashboard.getFilteredData(energyData);
    
    const labels = filteredData.map(d => new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
    const solarData = filteredData.map(d => d.solarGenerated);
    const gridData = filteredData.map(d => d.gridConsumed);
    
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

function updateChartLabels() {
    // Update chart labels based on language
    if (energyChart) {
        energyChart.update();
    }
    if (weeklyChart) {
        weeklyChart.update();
    }
}

function updateDashboard() {
    updateStats();
    updateWeeklyChart();
    calculateAndAwardPoints();
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification ${type} show`;
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Real-time Updates
let realTimeStats = dataGenerator.getRealTimeStats();

setInterval(() => {
    realTimeStats = dataGenerator.getRealTimeStats();
    
    document.getElementById('realtimeSolar').textContent = `${realTimeStats.currentSolar.toFixed(2)} kWh`;
    document.getElementById('realtimeConsumption').textContent = `${realTimeStats.currentConsumption.toFixed(2)} kWh`;
    
    if (energyChart && energyChart.data.datasets[0]) {
        const currentHour = new Date().getHours();
        energyChart.data.datasets[0].data[currentHour] = realTimeStats.currentSolar;
        energyChart.data.datasets[1].data[currentHour] = realTimeStats.currentConsumption;
        energyChart.update('none');
    }
}, 5000);

// Initialize Dashboard
updateStats();
createCharts();
calculateAndAwardPoints();
updateIncentivePoints();

// Apply saved preferences
updateLanguageUI();
updateThemeUI();

// Welcome notification
setTimeout(() => {
    const hour = new Date().getHours();
    let greeting = 'Good morning';
    if (hour >= 12 && hour < 17) greeting = 'Good afternoon';
    else if (hour >= 17) greeting = 'Good evening';
    
    showNotification(`${greeting}, ${currentUser.name}! Your enhanced dashboard is ready. 🌟`, 'success');
}, 500);

// Event Listeners
window.addEventListener('languageChanged', (e) => {
    console.log('Language changed to:', e.detail.language);
});

window.addEventListener('themeChanged', (e) => {
    console.log('Theme changed to:', e.detail.theme);
});

window.addEventListener('dateRangeChanged', (e) => {
    console.log('Date range changed:', e.detail);
    updateDashboard();
});
