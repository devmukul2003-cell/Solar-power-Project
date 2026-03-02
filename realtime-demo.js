// Initialize simulator
let simulator = null;
let realtimeChart = null;

// Initialize on page load
window.addEventListener('load', () => {
    // Create simulator instance (5 kW solar capacity)
    simulator = new RealTimeEnergySimulator(5, 15);
    
    // Initialize chart
    initializeChart();
    
    // Listen for data updates
    window.addEventListener('energyDataUpdate', handleDataUpdate);
    
    console.log('Real-time demo initialized');
});

// Initialize Chart.js
function initializeChart() {
    const ctx = document.getElementById('realtimeChart').getContext('2d');
    
    realtimeChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [
                {
                    label: 'Solar Produced (kWh/min)',
                    data: [],
                    borderColor: '#fbbf24',
                    backgroundColor: 'rgba(251, 191, 36, 0.1)',
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'Consumed (kWh/min)',
                    data: [],
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'Grid Used (kWh/min)',
                    data: [],
                    borderColor: '#ef4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    tension: 0.4,
                    fill: true
                }
            ]
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
                    position: 'bottom'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + context.parsed.y.toFixed(4) + ' kWh';
                        }
                    }
                }
            },
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Time'
                    },
                    ticks: {
                        maxRotation: 45,
                        minRotation: 45
                    }
                },
                y: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Energy (kWh per minute)'
                    },
                    beginAtZero: true
                }
            }
        }
    });
}

// Start simulator
function startSimulator() {
    if (simulator.isRunning) {
        alert('Simulator is already running!');
        return;
    }
    
    simulator.start();
    updateStatus(true);
    
    // Update display immediately
    updateDisplay();
}

// Stop simulator
function stopSimulator() {
    if (!simulator.isRunning) {
        alert('Simulator is not running!');
        return;
    }
    
    simulator.stop();
    updateStatus(false);
}

// Reset simulator
function resetSimulator() {
    if (confirm('Are you sure you want to reset all data?')) {
        simulator.reset();
        updateStatus(false);
        
        // Clear chart
        realtimeChart.data.labels = [];
        realtimeChart.data.datasets.forEach(dataset => {
            dataset.data = [];
        });
        realtimeChart.update();
        
        // Clear display
        updateDisplay();
        
        // Clear table
        document.getElementById('dataTableBody').innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; color: #6b7280;">
                    No data yet. Start the simulator to begin collecting data.
                </td>
            </tr>
        `;
    }
}

// Update status indicator
function updateStatus(isRunning) {
    const indicator = document.getElementById('statusIndicator');
    const statusText = document.getElementById('statusText');
    
    if (isRunning) {
        indicator.classList.add('active');
        statusText.textContent = 'Simulator running - Updates every minute';
        statusText.style.color = '#10b981';
    } else {
        indicator.classList.remove('active');
        statusText.textContent = 'Simulator stopped';
        statusText.style.color = '#6b7280';
    }
}

// Handle data update event
function handleDataUpdate(event) {
    const dataPoint = event.detail;
    updateDisplay();
    updateChart();
    updateTable();
}

// Update display with latest data
function updateDisplay() {
    const summary = simulator.getSummary();
    const latest = simulator.getLatest();
    
    if (!summary || !latest) {
        return;
    }
    
    // Update summary cards
    document.getElementById('totalSolar').textContent = summary.totalSolarProduced.toFixed(2) + ' kWh';
    document.getElementById('totalConsumed').textContent = summary.totalConsumed.toFixed(2) + ' kWh';
    document.getElementById('totalSavings').textContent = '₹' + summary.cumulativeSavings.toFixed(2);
    document.getElementById('totalCO2').textContent = summary.cumulativeCO2.toFixed(2) + ' kg';
    
    // Update live stats
    document.getElementById('currentSolar').textContent = latest.solarProduced.toFixed(4);
    document.getElementById('currentConsumption').textContent = latest.consumed.toFixed(4);
    document.getElementById('currentGrid').textContent = latest.gridUsed.toFixed(4);
    document.getElementById('solarCoverage').textContent = latest.solarCoverage + '%';
    document.getElementById('efficiency').textContent = latest.efficiency + '%';
    document.getElementById('dataPoints').textContent = summary.dataPoints;
    
    // Update last update time
    document.getElementById('lastUpdate').textContent = 'Last update: ' + latest.dateTime;
}

// Update chart with latest data
function updateChart() {
    const allData = simulator.getAllData();
    
    // Show last 60 data points (1 hour)
    const recentData = allData.slice(-60);
    
    // Update chart data
    realtimeChart.data.labels = recentData.map(d => {
        const time = new Date(d.timestamp);
        return time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    });
    
    realtimeChart.data.datasets[0].data = recentData.map(d => d.solarProduced);
    realtimeChart.data.datasets[1].data = recentData.map(d => d.consumed);
    realtimeChart.data.datasets[2].data = recentData.map(d => d.gridUsed);
    
    realtimeChart.update('none'); // Update without animation for smooth real-time feel
}

// Update data table
function updateTable() {
    const allData = simulator.getAllData();
    const recentData = allData.slice(-10).reverse(); // Last 10 entries, newest first
    
    const tbody = document.getElementById('dataTableBody');
    
    if (recentData.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; color: #6b7280;">
                    No data yet. Start the simulator to begin collecting data.
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = recentData.map(d => `
        <tr>
            <td>${new Date(d.timestamp).toLocaleTimeString()}</td>
            <td>${d.solarProduced.toFixed(4)}</td>
            <td>${d.consumed.toFixed(4)}</td>
            <td>${d.gridUsed.toFixed(4)}</td>
            <td>₹${d.moneySavedNow.toFixed(2)}</td>
            <td>${d.co2ReducedNow.toFixed(4)}</td>
            <td>${d.solarCoverage}%</td>
        </tr>
    `).join('');
}

// Export as JSON
function exportJSON() {
    const json = simulator.exportJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `energy-data-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    alert('JSON data exported successfully!');
}

// Export as CSV
function exportCSV() {
    const csv = simulator.exportCSV();
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `energy-data-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    
    alert('CSV data exported successfully!');
}

// Auto-update display every 5 seconds (even when not generating new data)
setInterval(() => {
    if (simulator && simulator.dataPoints.length > 0) {
        updateDisplay();
    }
}, 5000);
