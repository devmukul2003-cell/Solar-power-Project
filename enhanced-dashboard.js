// Enhanced Smart Energy Dashboard - Main Logic

// Global variables
let currentUser = null;
let userPreferences = {
    theme: 'light',
    language: 'en',
    incentivePoints: 0,
    rewardLevel: 'bronze'
};

async function loadCurrentUser() {
    // Check authentication first
    const token = localStorage.getItem('authToken');
    console.log('=== Dashboard Loading ===');
    console.log('Token exists:', token ? 'YES' : 'NO');
    console.log('Token value:', token ? token.substring(0, 30) + '...' : 'NONE');
    
    if (!token) {
        console.log('No auth token found, redirecting to login');
        window.location.href = 'index.html';
        return;
    }

    try {
        // Check if api is available
        if (typeof api === 'undefined') {
            console.error('API not loaded yet, retrying...');
            setTimeout(loadCurrentUser, 100); // Retry after 100ms
            return;
        }

        console.log('Calling api.getCurrentUser()...');
        const response = await api.getCurrentUser();
        console.log('getCurrentUser response:', response);
        
        if (response.success) {
            currentUser = response.user;
            console.log('✅ User loaded successfully:', currentUser.email);
            displayUserInfo();
            await loadPreferences();
            await loadIncentivePoints();
            initializeMonitors();
        } else {
            console.error('getCurrentUser failed:', response.message);
            // Don't redirect immediately, show error
            alert('Failed to load user data: ' + response.message + '\nPlease try logging in again.');
            localStorage.removeItem('authToken');
            localStorage.removeItem('currentUser');
            window.location.href = 'index.html';
        }
    } catch (error) {
        console.error('Error loading user:', error);
        console.error('Error details:', error.message, error.stack);
        
        // Check if it's a network error
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
            alert('Cannot connect to server. Please make sure the backend is running.\n\ncd backend && npm run dev');
            // Don't redirect on network error, let user see the message
            return;
        }
        
        // Only redirect on auth errors
        if (error.message.includes('token') || error.message.includes('auth')) {
            console.log('Auth error, clearing data and redirecting to login');
            localStorage.removeItem('authToken');
            localStorage.removeItem('currentUser');
            window.location.href = 'index.html';
        } else {
            // Unknown error, show message but don't redirect
            alert('Error loading dashboard: ' + error.message + '\n\nCheck console for details.');
        }
    }
}

function displayUserInfo() {
    if (!currentUser) {
        console.error('Cannot display user info - currentUser is null');
        return;
    }
    
    document.getElementById('userName').textContent = currentUser.name || currentUser.email.split('@')[0];
    document.getElementById('userEmail').textContent = currentUser.email;
    
    document.getElementById('displayUserId').textContent = currentUser.userId || currentUser.email;
    const statusBadge = document.getElementById('displaySessionStatus');
    statusBadge.textContent = currentUser.sessionStatus || 'logged_in';
    statusBadge.className = `status-badge ${(currentUser.sessionStatus === 'logged_in' || !currentUser.sessionStatus) ? 'status-active' : 'status-inactive'}`;
    document.getElementById('displayLastLogin').textContent = currentUser.lastLogin ? formatDateTime(currentUser.lastLogin) : 'Never';
    document.getElementById('displaySignupDate').textContent = formatDateTime(currentUser.signupDate || currentUser.createdAt);
}

async function loadPreferences() {
    try {
        const response = await api.getPreferences();
        if (response.success) {
            const prefs = response.preferences;
            userPreferences.theme = prefs.themePreference.toLowerCase();
            userPreferences.language = prefs.languagePreference === 'Hindi' ? 'hi' : 'en';
            
            applyTheme(userPreferences.theme);
            i18n.setLanguage(userPreferences.language);
        }
    } catch (error) {
        console.error('Error loading preferences:', error);
        // Use defaults
        applyTheme(userPreferences.theme);
        i18n.setLanguage(userPreferences.language);
    }
}

async function loadIncentivePoints() {
    try {
        const response = await api.getCurrentPoints();
        if (response.success && response.points) {
            userPreferences.incentivePoints = response.points.totalPoints;
            userPreferences.rewardLevel = response.points.rewardLevel;
            updateIncentiveDisplay(response.points.totalPoints);
        }
    } catch (error) {
        console.error('Error loading incentive points:', error);
    }
}

function initializeMonitors() {
    if (!currentUser) {
        console.error('Cannot initialize monitors - currentUser is null');
        return;
    }
    
    console.log('Initializing monitors for user:', currentUser.email);
    
    // Use userId or email as identifier
    const userIdentifier = currentUser.userId || currentUser.email;
    
    // Initialize Real-Time Data Engine
    window.dataEngine = new RealTimeDataEngine(userIdentifier, 10);

    // Initialize Solar Panel Health Monitor
    window.panelHealthMonitor = new SolarPanelHealthMonitor(userIdentifier, 12);
    window.panelHealthUI = new PanelHealthUI(panelHealthMonitor);

    // Initialize Appliance Monitor
    window.applianceMonitor = new ApplianceMonitor(userIdentifier);
    window.applianceMonitorUI = new ApplianceMonitorUI(applianceMonitor);

    // Get initial data after monitors are created
    historicalData = dataEngine.getHistoricalData(100);
    todayHourlyData = dataEngine.getTodayHourlyData();

    // Initialize dashboard
    updateStats();
    createCharts();
    
    console.log('✅ All monitors initialized successfully');
}

// Wait for DOM to be ready before loading user
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('DOM ready, waiting 100ms before checking auth...');
        initializeEventListeners();
        setTimeout(loadCurrentUser, 100);
    });
} else {
    // DOM is already ready
    console.log('DOM already ready, waiting 100ms before checking auth...');
    initializeEventListeners();
    setTimeout(loadCurrentUser, 100);
}

// Initialize all event listeners
function initializeEventListeners() {
    // Theme Toggle
    document.getElementById('themeToggle').addEventListener('click', function() {
        const newTheme = userPreferences.theme === 'light' ? 'dark' : 'light';
        userPreferences.theme = newTheme;
        savePreferences();
        applyTheme(newTheme);
        showNotification(`Theme switched to ${newTheme} mode`, 'success');
    });

    // Language Toggle
    document.getElementById('languageToggle').addEventListener('click', function() {
        const newLang = i18n.toggleLanguage();
        userPreferences.language = newLang;
        savePreferences();
        
        // Re-render charts with new language
        setTimeout(() => {
            if (window.energyChart && window.weeklyChart) {
                createCharts();
            }
        }, 100);
        
        showNotification(newLang === 'en' ? 'Language switched to English' : 'भाषा हिंदी में बदली गई', 'success');
    });

    // Custom Date Range
    document.getElementById('dateRange').addEventListener('change', function() {
        const value = this.value;
        const customInputs = document.getElementById('customDateInputs');
        
        if (value === 'custom') {
            customInputs.style.display = 'flex';
            
            // Set default dates
            const endDate = new Date();
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - 30);
            
            document.getElementById('startDate').value = startDate.toISOString().split('T')[0];
            document.getElementById('endDate').value = endDate.toISOString().split('T')[0];
            document.getElementById('startDate').max = endDate.toISOString().split('T')[0];
            document.getElementById('endDate').max = endDate.toISOString().split('T')[0];
        } else {
            customInputs.style.display = 'none';
            customDateRange = null;
            if (window.dataEngine) {
                updateDashboard();
            }
        }
    });

    // View type change
    document.getElementById('viewType').addEventListener('change', function() {
        if (window.dataEngine) {
            updateDashboard();
        }
    });
}

function applyTheme(theme) {
    document.body.setAttribute('data-theme', theme);
    const themeIcon = document.getElementById('themeIcon');
    if (themeIcon) {
        themeIcon.textContent = theme === 'light' ? '🌙' : '☀️';
    }
}

// Get initial data (will be set after monitors initialize)
let historicalData = [];
let todayHourlyData = [];
let customDateRange = null;

function applyCustomRange() {
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    
    if (startDate && endDate) {
        if (new Date(startDate) > new Date(endDate)) {
            showNotification('Start date must be before end date', 'error');
            return;
        }
        
        customDateRange = { startDate, endDate };
        updateDashboard();
        showNotification('Custom date range applied', 'success');
    }
}

function savePreferences() {
    // Save to API
    api.updatePreferences({
        languagePreference: userPreferences.language === 'en' ? 'English' : 'Hindi',
        themePreference: userPreferences.theme === 'light' ? 'Light' : 'Dark'
    }).catch(error => {
        console.error('Error saving preferences:', error);
    });
}

// LOGOUT FLOW
async function handleLogout() {
    try {
        if (window.dataEngine) window.dataEngine.stopRealTimeUpdates();
        if (window.panelHealthMonitor) window.panelHealthMonitor.stopMonitoring();
        if (window.applianceMonitor) window.applianceMonitor.stopMonitoring();
        
        await api.logout();
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Logout error:', error);
        // Force logout even if API fails
        api.clearToken();
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    }
}

function exportData() {
    const csv = dataEngine.exportData('csv');
    downloadCSV(csv, `energy-data-${new Date().toISOString().split('T')[0]}.csv`);
    showNotification(i18n.translate('export_data') + ' successful!', 'success');
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

function getFilteredData() {
    if (customDateRange) {
        return dataEngine.getCustomRangeData(customDateRange.startDate, customDateRange.endDate);
    } else {
        const days = parseInt(document.getElementById('dateRange').value);
        return historicalData.slice(-days);
    }
}

function calculateStats(data) {
    const totalSolar = data.reduce((sum, d) => sum + d.solarGenerated, 0);
    const totalConsumption = data.reduce((sum, d) => sum + d.consumption, 0);
    const totalSavings = data.reduce((sum, d) => sum + d.moneySaved, 0);
    const totalCO2 = data.reduce((sum, d) => sum + d.co2Reduced, 0);
    
    const days = data.length || 1;
    
    return {
        solar: totalSolar / days,
        consumed: totalConsumption / days,
        savings: totalSavings,
        co2: totalCO2
    };
}

function calculateIncentivePoints(stats) {
    // Award points based on solar usage vs grid usage
    const solarPercentage = (stats.solar / stats.consumed) * 100;
    
    // Base points: 1 point per kWh of solar energy used
    let points = Math.floor(stats.solar * stats.consumed / stats.solar);
    
    // Bonus points for high solar percentage
    if (solarPercentage >= 80) points += 100;
    else if (solarPercentage >= 60) points += 50;
    else if (solarPercentage >= 40) points += 25;
    
    // Bonus for CO2 reduction
    points += Math.floor(stats.co2 / 10);
    
    return points;
}

function updateIncentiveDisplay(points) {
    document.getElementById('totalPoints').textContent = points;
    
    // Determine reward level
    let level = 'bronze';
    let nextReward = 500;
    let progress = (points % 500) / 500 * 100;
    
    if (points >= 2000) {
        level = 'platinum';
        nextReward = 2500 - points;
        progress = ((points - 2000) / 500) * 100;
    } else if (points >= 1000) {
        level = 'gold';
        nextReward = 2000 - points;
        progress = ((points - 1000) / 1000) * 100;
    } else if (points >= 500) {
        level = 'silver';
        nextReward = 1000 - points;
        progress = ((points - 500) / 500) * 100;
    }
    
    userPreferences.rewardLevel = level;
    userPreferences.incentivePoints = points;
    savePreferences();
    
    document.getElementById('pointsToNext').textContent = nextReward;
    document.getElementById('progressFill').style.width = Math.min(progress, 100) + '%';
    
    // Highlight current badge
    const badges = document.querySelectorAll('.reward-badge');
    badges.forEach((badge, index) => {
        badge.classList.remove('active');
        const levels = ['bronze', 'silver', 'gold', 'platinum'];
        if (levels[index] === level) {
            badge.classList.add('active');
        }
    });
}

function updateStats() {
    const data = getFilteredData();
    const stats = calculateStats(data);
    
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
    
    // Calculate and update incentive points
    const incentivePoints = calculateIncentivePoints(stats);
    updateIncentiveDisplay(incentivePoints);
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
                label: i18n.translate('solar_produced'),
                data: todayHourlyData.map(d => d.solar),
                borderColor: '#fbbf24',
                backgroundColor: 'rgba(251, 191, 36, 0.1)',
                tension: 0.4,
                fill: true,
                pointRadius: 4,
                pointHoverRadius: 6
            }, {
                label: i18n.translate('energy_consumed'),
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
                        padding: 15,
                        color: getComputedStyle(document.body).getPropertyValue('--text-color')
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
                    title: { 
                        display: true, 
                        text: 'Energy (kWh)',
                        color: getComputedStyle(document.body).getPropertyValue('--text-color')
                    },
                    ticks: {
                        color: getComputedStyle(document.body).getPropertyValue('--text-color')
                    },
                    grid: {
                        color: getComputedStyle(document.body).getPropertyValue('--border-color')
                    }
                },
                x: {
                    title: { 
                        display: true, 
                        text: 'Time',
                        color: getComputedStyle(document.body).getPropertyValue('--text-color')
                    },
                    ticks: {
                        color: getComputedStyle(document.body).getPropertyValue('--text-color')
                    },
                    grid: {
                        color: getComputedStyle(document.body).getPropertyValue('--border-color')
                    }
                }
            },
            animation: {
                duration: 750
            }
        }
    });
}

function createWeeklyChart() {
    const data = getFilteredData();
    const viewType = document.getElementById('viewType').value;
    
    let labels, solarData, consumptionData;
    
    if (viewType === 'daily') {
        labels = data.map(d => new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
        solarData = data.map(d => d.solarGenerated);
        consumptionData = data.map(d => d.consumption);
    } else if (viewType === 'weekly') {
        const weeks = groupByWeek(data);
        labels = weeks.map((w, i) => `Week ${i + 1}`);
        solarData = weeks.map(w => w.solar);
        consumptionData = weeks.map(w => w.consumption);
    } else {
        const months = groupByMonth(data);
        labels = months.map(m => m.month);
        solarData = months.map(m => m.solar);
        consumptionData = months.map(m => m.consumption);
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
                label: i18n.translate('solar_produced'),
                data: solarData,
                backgroundColor: '#fbbf24',
                borderRadius: 6
            }, {
                label: i18n.translate('energy_consumed'),
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
                        padding: 15,
                        color: getComputedStyle(document.body).getPropertyValue('--text-color')
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: { 
                        display: true, 
                        text: 'Energy (kWh)',
                        color: getComputedStyle(document.body).getPropertyValue('--text-color')
                    },
                    ticks: {
                        color: getComputedStyle(document.body).getPropertyValue('--text-color')
                    },
                    grid: {
                        color: getComputedStyle(document.body).getPropertyValue('--border-color')
                    }
                },
                x: {
                    ticks: {
                        color: getComputedStyle(document.body).getPropertyValue('--text-color')
                    },
                    grid: {
                        color: getComputedStyle(document.body).getPropertyValue('--border-color')
                    }
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
            consumption: week.reduce((sum, d) => sum + d.consumption, 0)
        });
    }
    return weeks;
}

function groupByMonth(data) {
    const months = {};
    data.forEach(d => {
        const month = new Date(d.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        if (!months[month]) {
            months[month] = { month, solar: 0, consumption: 0 };
        }
        months[month].solar += d.solarGenerated;
        months[month].consumption += d.consumption;
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

// Note: Initialization now happens in initializeMonitors() after user is loaded

// Listen for real-time data updates
window.addEventListener('energyDataUpdate', (event) => {
    const newData = event.detail;
    
    document.getElementById('realtimeSolar').textContent = `${newData.solar.toFixed(2)} kW`;
    document.getElementById('realtimeConsumption').textContent = `${newData.consumption.toFixed(2)} kW`;
    
    todayHourlyData = dataEngine.getTodayHourlyData();
    
    if (energyChart) {
        energyChart.data.labels = todayHourlyData.map(d => d.hour);
        energyChart.data.datasets[0].data = todayHourlyData.map(d => d.solar);
        energyChart.data.datasets[1].data = todayHourlyData.map(d => d.consumption);
        energyChart.update('none');
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
    if (!currentUser) return; // Wait for user to load
    
    const hour = new Date().getHours();
    let greeting = i18n.currentLanguage === 'en' ? 'Good morning' : 'सुप्रभात';
    if (hour >= 12 && hour < 17) greeting = i18n.currentLanguage === 'en' ? 'Good afternoon' : 'शुभ दोपहर';
    else if (hour >= 17) greeting = i18n.currentLanguage === 'en' ? 'Good evening' : 'शुभ संध्या';
    
    const userName = currentUser.name || currentUser.email.split('@')[0];
    showNotification(`${greeting}, ${userName}! 🌟`, 'success');
}, 1500);

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (window.dataEngine) window.dataEngine.stopRealTimeUpdates();
    if (window.panelHealthMonitor) window.panelHealthMonitor.stopMonitoring();
    if (window.applianceMonitor) window.applianceMonitor.stopMonitoring();
});
