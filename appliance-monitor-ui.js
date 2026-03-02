// Appliance Monitor UI Components
// Visualization and user interface for appliance monitoring

class ApplianceMonitorUI {
    constructor(monitor) {
        this.monitor = monitor;
        this.pieChart = null;
        this.setupEventListeners();
        this.initializeUI();
    }

    setupEventListeners() {
        // Listen for power shortage alerts
        window.addEventListener('powerShortageAlert', (event) => {
            this.handlePowerShortageAlert(event.detail);
        });

        // Listen for overuse alerts
        window.addEventListener('applianceOveruseAlert', (event) => {
            this.handleOveruseAlert(event.detail);
        });
    }

    initializeUI() {
        this.createApplianceWidget();
        this.createPieChart();
        this.createAlertsPanel();
        
        // Update every 5 seconds
        setInterval(() => {
            this.updateApplianceWidget();
            this.updatePieChart();
            this.updateAlertsPanel();
        }, 5000);
    }

    createApplianceWidget() {
        const dashboard = document.querySelector('.dashboard .container');
        if (!dashboard) return;

        const widget = document.createElement('div');
        widget.className = 'appliance-widget';
        widget.id = 'applianceWidget';
        widget.innerHTML = `
            <div class="appliance-header">
                <h3>
                    <span class="appliance-icon">🔌</span>
                    <span data-i18n="appliance_monitoring">Appliance Monitoring</span>
                </h3>
                <div class="power-status" id="powerStatus">
                    <span class="status-indicator"></span>
                    <span class="status-text">Normal</span>
                </div>
            </div>
            <div class="appliance-summary">
                <div class="summary-stat">
                    <span class="stat-label" data-i18n="total_consumption">Total Consumption:</span>
                    <span class="stat-value" id="totalConsumption">0 kW</span>
                </div>
                <div class="summary-stat">
                    <span class="stat-label" data-i18n="active_appliances">Active Appliances:</span>
                    <span class="stat-value" id="activeCount">0</span>
                </div>
            </div>
            <div class="appliance-list" id="applianceList"></div>
            <button class="btn-view-details" onclick="applianceMonitorUI.showDetailsModal()">
                <span data-i18n="view_details">View Details</span>
            </button>
        `;

        // Insert after panel health widget
        const panelWidget = document.getElementById('panelHealthWidget');
        if (panelWidget) {
            panelWidget.after(widget);
        } else {
            const sessionCard = document.querySelector('.session-info-card');
            if (sessionCard) {
                sessionCard.after(widget);
            }
        }

        this.updateApplianceWidget();
    }

    updateApplianceWidget() {
        const appliances = this.monitor.getAppliances();
        const totalConsumption = this.monitor.getTotalConsumption();
        const activeCount = appliances.filter(a => a.isActive).length;
        const powerStatus = this.monitor.checkPowerShortage();

        // Update summary
        document.getElementById('totalConsumption').textContent = `${totalConsumption.toFixed(2)} kW`;
        document.getElementById('activeCount').textContent = activeCount;

        // Update power status
        const statusEl = document.getElementById('powerStatus');
        if (powerStatus.isPowerShortage) {
            statusEl.className = 'power-status shortage';
            statusEl.querySelector('.status-text').textContent = 'Power Shortage!';
        } else if (powerStatus.percentageUsed >= 80) {
            statusEl.className = 'power-status warning';
            statusEl.querySelector('.status-text').textContent = 'High Usage';
        } else {
            statusEl.className = 'power-status normal';
            statusEl.querySelector('.status-text').textContent = 'Normal';
        }

        // Update appliance list (top 5 consumers)
        const topAppliances = appliances
            .filter(a => a.isActive)
            .sort((a, b) => b.currentConsumption_kW - a.currentConsumption_kW)
            .slice(0, 5);

        const listEl = document.getElementById('applianceList');
        if (topAppliances.length === 0) {
            listEl.innerHTML = '<p class="no-appliances">No active appliances</p>';
        } else {
            listEl.innerHTML = topAppliances.map(app => `
                <div class="appliance-item ${app.thresholdStatus}">
                    <span class="app-icon">${app.icon}</span>
                    <span class="app-name">${app.applianceName}</span>
                    <span class="app-consumption">${app.currentConsumption_kW.toFixed(2)} kW</span>
                    <span class="app-status-badge ${app.thresholdStatus}">${app.thresholdStatus}</span>
                </div>
            `).join('');
        }
    }

    createPieChart() {
        const dashboard = document.querySelector('.dashboard .container');
        if (!dashboard) return;

        const chartContainer = document.createElement('div');
        chartContainer.className = 'chart-card appliance-chart-card';
        chartContainer.innerHTML = `
            <h3 data-i18n="consumption_distribution">Appliance Consumption Distribution</h3>
            <div class="chart-wrapper">
                <canvas id="appliancePieChart"></canvas>
            </div>
            <div class="chart-legend" id="pieChartLegend"></div>
        `;

        // Insert after charts container
        const chartsContainer = document.querySelector('.charts-container');
        if (chartsContainer) {
            chartsContainer.after(chartContainer);
        }

        this.updatePieChart();
    }

    updatePieChart() {
        const ctx = document.getElementById('appliancePieChart');
        if (!ctx) return;

        const percentages = this.monitor.getConsumptionPercentages();

        if (percentages.length === 0) {
            if (this.pieChart) {
                this.pieChart.destroy();
                this.pieChart = null;
            }
            ctx.getContext('2d').clearRect(0, 0, ctx.width, ctx.height);
            return;
        }

        const data = {
            labels: percentages.map(p => p.applianceName),
            datasets: [{
                data: percentages.map(p => p.consumption),
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#4BC0C0',
                    '#9966FF',
                    '#FF9F40',
                    '#FF6384',
                    '#C9CBCF'
                ],
                borderWidth: 2,
                borderColor: '#fff'
            }]
        };

        if (this.pieChart) {
            this.pieChart.data = data;
            this.pieChart.update();
        } else {
            this.pieChart = new Chart(ctx, {
                type: 'pie',
                data: data,
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    const label = context.label || '';
                                    const value = context.parsed || 0;
                                    const percentage = percentages[context.dataIndex].percentage;
                                    return `${label}: ${value.toFixed(2)} kW (${percentage}%)`;
                                }
                            }
                        }
                    }
                }
            });
        }

        // Update custom legend
        const legendEl = document.getElementById('pieChartLegend');
        if (legendEl) {
            legendEl.innerHTML = percentages.map((p, i) => `
                <div class="legend-item">
                    <span class="legend-color" style="background-color: ${data.datasets[0].backgroundColor[i]}"></span>
                    <span class="legend-label">${p.icon} ${p.applianceName}</span>
                    <span class="legend-value">${p.consumption.toFixed(2)} kW (${p.percentage}%)</span>
                </div>
            `).join('');
        }
    }

    createAlertsPanel() {
        const dashboard = document.querySelector('.dashboard .container');
        if (!dashboard) return;

        const panel = document.createElement('div');
        panel.className = 'appliance-alerts-panel';
        panel.id = 'applianceAlertsPanel';
        panel.innerHTML = `
            <div class="alerts-header">
                <h3>
                    <span class="alert-icon">⚠️</span>
                    <span data-i18n="appliance_alerts">Appliance Alerts</span>
                    <span class="alert-badge" id="applianceAlertBadge">0</span>
                </h3>
                <div class="alerts-filters">
                    <button class="filter-btn active" data-filter="all" onclick="applianceMonitorUI.filterAlerts('all')">
                        <span data-i18n="all">All</span>
                    </button>
                    <button class="filter-btn" data-filter="power_shortage" onclick="applianceMonitorUI.filterAlerts('power_shortage')">
                        <span data-i18n="power_shortage">Power Shortage</span>
                    </button>
                    <button class="filter-btn" data-filter="overuse" onclick="applianceMonitorUI.filterAlerts('overuse')">
                        <span data-i18n="overuse">Overuse</span>
                    </button>
                </div>
            </div>
            <div class="alerts-list" id="applianceAlertsList">
                <p class="no-alerts">No alerts at this time</p>
            </div>
        `;

        dashboard.appendChild(panel);
        this.updateAlertsPanel();
    }

    updateAlertsPanel(filter = 'all') {
        const alerts = this.monitor.getAlerts(filter);
        const alertsList = document.getElementById('applianceAlertsList');
        const alertBadge = document.getElementById('applianceAlertBadge');

        if (!alertsList) return;

        const unresolvedCount = this.monitor.getAlerts('unresolved').length;
        if (alertBadge) {
            alertBadge.textContent = unresolvedCount;
            alertBadge.style.display = unresolvedCount > 0 ? 'inline-block' : 'none';
        }

        if (alerts.length === 0) {
            alertsList.innerHTML = '<p class="no-alerts">No alerts at this time</p>';
            return;
        }

        alertsList.innerHTML = alerts.slice(0, 5).map(alert => {
            if (alert.type === 'power_shortage') {
                return `
                    <div class="alert-item ${alert.severity} ${alert.resolved ? 'resolved' : ''}">
                        <div class="alert-icon-container">🚨</div>
                        <div class="alert-content">
                            <div class="alert-header-row">
                                <span class="alert-type">POWER SHORTAGE</span>
                                <span class="alert-time">${this.formatTimeAgo(alert.timestamp)}</span>
                            </div>
                            <p class="alert-message">${alert.message}</p>
                            ${alert.suggestions && alert.suggestions.length > 0 ? `
                                <div class="suggestions-list">
                                    <strong>Suggested Actions:</strong>
                                    ${alert.suggestions.map((s, i) => `
                                        <div class="suggestion-item">
                                            ${i + 1}. ${s.message}
                                            ${i === alert.suggestions.length - 1 ? 
                                                `<span class="savings-note">(Total savings: ${s.cumulativeSavings.toFixed(2)}kW)</span>` : ''}
                                        </div>
                                    `).join('')}
                                </div>
                            ` : ''}
                            ${!alert.resolved ? `
                                <button class="btn-resolve" onclick="applianceMonitorUI.resolveAlert('${alert.alertId}')">
                                    Mark as Resolved
                                </button>
                            ` : `
                                <p class="resolved-info">✓ Resolved</p>
                            `}
                        </div>
                    </div>
                `;
            } else {
                return `
                    <div class="alert-item ${alert.severity} ${alert.resolved ? 'resolved' : ''}">
                        <div class="alert-icon-container">⚡</div>
                        <div class="alert-content">
                            <div class="alert-header-row">
                                <span class="alert-appliance">${alert.applianceName}</span>
                                <span class="alert-time">${this.formatTimeAgo(alert.timestamp)}</span>
                            </div>
                            <p class="alert-message">${alert.message}</p>
                            ${!alert.resolved ? `
                                <button class="btn-resolve" onclick="applianceMonitorUI.resolveAlert('${alert.alertId}')">
                                    Mark as Resolved
                                </button>
                            ` : `
                                <p class="resolved-info">✓ Resolved</p>
                            `}
                        </div>
                    </div>
                `;
            }
        }).join('');
    }

    handlePowerShortageAlert(alert) {
        // Show critical notification
        this.showCriticalNotification(alert);
        
        // Update UI
        this.updateApplianceWidget();
        this.updateAlertsPanel();
        
        // Play sound
        this.playAlertSound();
    }

    handleOveruseAlert(alert) {
        // Show notification
        this.showNotification(alert.message, alert.severity);
        
        // Update UI
        this.updateApplianceWidget();
        this.updateAlertsPanel();
    }

    showCriticalNotification(alert) {
        const notification = document.createElement('div');
        notification.className = 'critical-notification power-shortage';
        notification.innerHTML = `
            <div class="notification-header">
                <span class="notification-icon">🚨</span>
                <strong>POWER SHORTAGE ALERT</strong>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
            <p class="notification-message">${alert.message}</p>
            ${alert.suggestions && alert.suggestions.length > 0 ? `
                <div class="notification-suggestions">
                    <strong>Turn off these appliances:</strong>
                    <ul>
                        ${alert.suggestions.slice(0, 3).map(s => `
                            <li>${s.applianceName} (${s.currentConsumption.toFixed(2)}kW)</li>
                        `).join('')}
                    </ul>
                </div>
            ` : ''}
            <button class="btn-view-suggestions" onclick="applianceMonitorUI.showDetailsModal()">
                View All Suggestions
            </button>
        `;

        document.body.appendChild(notification);

        // Auto-remove after 30 seconds
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 300);
        }, 30000);
    }

    showNotification(message, type) {
        if (typeof showNotification === 'function') {
            showNotification(message, type);
        }
    }

    playAlertSound() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = 800;
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
        } catch (e) {
            console.log('Audio not supported');
        }
    }

    formatTimeAgo(timestamp) {
        const now = Date.now();
        const diff = now - new Date(timestamp).getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);

        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        return new Date(timestamp).toLocaleString();
    }

    filterAlerts(filter) {
        document.querySelectorAll('.appliance-alerts-panel .filter-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.filter === filter) {
                btn.classList.add('active');
            }
        });

        this.updateAlertsPanel(filter);
    }

    resolveAlert(alertId) {
        const result = this.monitor.resolveAlert(alertId);
        
        if (result.success) {
            showNotification('Alert resolved successfully', 'success');
            this.updateAlertsPanel();
            this.updateApplianceWidget();
        } else {
            showNotification(result.message, 'error');
        }
    }

    showDetailsModal() {
        const appliances = this.monitor.getAppliances();
        const powerStatus = this.monitor.checkPowerShortage();
        const alerts = this.monitor.getAlerts('unresolved');

        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content appliance-details-modal">
                <div class="modal-header">
                    <h2>Appliance Details</h2>
                    <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">×</button>
                </div>
                <div class="modal-body">
                    <div class="power-status-card ${powerStatus.isPowerShortage ? 'shortage' : ''}">
                        <h3>Power Status</h3>
                        <div class="status-details">
                            <div class="status-item">
                                <span>Total Consumption:</span>
                                <strong>${powerStatus.totalConsumption.toFixed(2)} kW</strong>
                            </div>
                            <div class="status-item">
                                <span>Threshold:</span>
                                <strong>${powerStatus.threshold} kW</strong>
                            </div>
                            <div class="status-item">
                                <span>Usage:</span>
                                <strong>${powerStatus.percentageUsed}%</strong>
                            </div>
                        </div>
                        ${powerStatus.isPowerShortage ? `
                            <div class="shortage-warning">
                                ⚠️ POWER SHORTAGE DETECTED!
                            </div>
                        ` : ''}
                    </div>
                    
                    <div class="appliances-grid">
                        ${appliances.map(app => `
                            <div class="appliance-detail-card ${app.thresholdStatus} ${app.isActive ? 'active' : 'inactive'}">
                                <div class="app-card-header">
                                    <span class="app-icon-large">${app.icon}</span>
                                    <div class="app-info">
                                        <h4>${app.applianceName}</h4>
                                        <span class="app-category">${app.category}</span>
                                    </div>
                                    <span class="app-status-indicator ${app.isActive ? 'on' : 'off'}">
                                        ${app.isActive ? 'ON' : 'OFF'}
                                    </span>
                                </div>
                                <div class="app-metrics">
                                    <div class="metric">
                                        <span>Current:</span>
                                        <strong>${app.currentConsumption_kW.toFixed(2)} kW</strong>
                                    </div>
                                    <div class="metric">
                                        <span>Daily:</span>
                                        <strong>${app.dailyConsumption_kWh.toFixed(2)} kWh</strong>
                                    </div>
                                    <div class="metric">
                                        <span>Threshold:</span>
                                        <strong>${app.threshold_kW} kW</strong>
                                    </div>
                                    <div class="metric">
                                        <span>Priority:</span>
                                        <strong>${app.priority === 1 ? 'Critical' : app.priority <= 3 ? 'High' : 'Low'}</strong>
                                    </div>
                                </div>
                                ${app.suggestionMessage ? `
                                    <div class="app-suggestion">
                                        ${app.suggestionMessage}
                                    </div>
                                ` : ''}
                            </div>
                        `).join('')}
                    </div>
                    
                    <div class="modal-actions">
                        <button class="btn-export" onclick="applianceMonitorUI.exportData()">
                            📊 Export Data
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    }

    exportData() {
        const csv = this.monitor.convertToCSV();
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `appliance-data-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
        
        showNotification('Appliance data exported successfully', 'success');
    }
}

// Export for use in other scripts
window.ApplianceMonitorUI = ApplianceMonitorUI;
