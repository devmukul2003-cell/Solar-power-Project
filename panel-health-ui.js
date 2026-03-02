// Solar Panel Health Monitoring UI Components

class PanelHealthUI {
    constructor(monitor) {
        this.monitor = monitor;
        this.setupEventListeners();
        this.initializeUI();
    }

    setupEventListeners() {
        // Listen for panel alerts
        window.addEventListener('panelAlert', (event) => {
            this.handleAlert(event.detail);
        });
    }

    initializeUI() {
        // Create health summary widget
        this.createHealthSummaryWidget();
        
        // Create alerts panel
        this.createAlertsPanel();
        
        // Update every 15 seconds
        setInterval(() => {
            this.updateHealthSummary();
            this.updateAlertsPanel();
        }, 15000);
    }

    createHealthSummaryWidget() {
        const dashboard = document.querySelector('.dashboard .container');
        if (!dashboard) return;

        const widget = document.createElement('div');
        widget.className = 'panel-health-widget';
        widget.id = 'panelHealthWidget';
        widget.innerHTML = `
            <div class="health-header">
                <h3>
                    <span class="health-icon">🔆</span>
                    <span data-i18n="panel_health">Solar Panel Health</span>
                </h3>
                <button class="btn-view-details" onclick="panelHealthUI.showDetailsModal()">
                    <span data-i18n="view_details">View Details</span>
                </button>
            </div>
            <div class="health-summary">
                <div class="health-stat">
                    <div class="stat-icon healthy-icon">✓</div>
                    <div class="stat-info">
                        <span class="stat-value" id="healthyCount">0</span>
                        <span class="stat-label" data-i18n="healthy">Healthy</span>
                    </div>
                </div>
                <div class="health-stat">
                    <div class="stat-icon warning-icon">⚠</div>
                    <div class="stat-info">
                        <span class="stat-value" id="warningCount">0</span>
                        <span class="stat-label" data-i18n="warning">Warning</span>
                    </div>
                </div>
                <div class="health-stat">
                    <div class="stat-icon defective-icon">✕</div>
                    <div class="stat-info">
                        <span class="stat-value" id="defectiveCount">0</span>
                        <span class="stat-label" data-i18n="defective">Defective</span>
                    </div>
                </div>
                <div class="health-stat">
                    <div class="stat-icon efficiency-icon">📊</div>
                    <div class="stat-info">
                        <span class="stat-value" id="efficiencyValue">0%</span>
                        <span class="stat-label" data-i18n="efficiency">Efficiency</span>
                    </div>
                </div>
            </div>
        `;

        // Insert after session info card
        const sessionCard = document.querySelector('.session-info-card');
        if (sessionCard) {
            sessionCard.after(widget);
        } else {
            dashboard.insertBefore(widget, dashboard.firstChild);
        }

        this.updateHealthSummary();
    }

    createAlertsPanel() {
        const dashboard = document.querySelector('.dashboard .container');
        if (!dashboard) return;

        const panel = document.createElement('div');
        panel.className = 'alerts-panel';
        panel.id = 'alertsPanel';
        panel.innerHTML = `
            <div class="alerts-header">
                <h3>
                    <span class="alert-icon">🔔</span>
                    <span data-i18n="recent_alerts">Recent Alerts</span>
                    <span class="alert-badge" id="alertBadge">0</span>
                </h3>
                <div class="alerts-filters">
                    <button class="filter-btn active" data-filter="all" onclick="panelHealthUI.filterAlerts('all')">
                        <span data-i18n="all">All</span>
                    </button>
                    <button class="filter-btn" data-filter="unresolved" onclick="panelHealthUI.filterAlerts('unresolved')">
                        <span data-i18n="unresolved">Unresolved</span>
                    </button>
                    <button class="filter-btn" data-filter="critical" onclick="panelHealthUI.filterAlerts('critical')">
                        <span data-i18n="critical">Critical</span>
                    </button>
                </div>
            </div>
            <div class="alerts-list" id="alertsList">
                <p class="no-alerts" data-i18n="no_alerts">No alerts at this time</p>
            </div>
        `;

        dashboard.appendChild(panel);
        this.updateAlertsPanel();
    }

    updateHealthSummary() {
        const summary = this.monitor.getHealthSummary();
        
        document.getElementById('healthyCount').textContent = summary.healthy;
        document.getElementById('warningCount').textContent = summary.warning;
        document.getElementById('defectiveCount').textContent = summary.defective;
        document.getElementById('efficiencyValue').textContent = summary.efficiency + '%';

        // Update widget status color
        const widget = document.getElementById('panelHealthWidget');
        if (widget) {
            widget.className = 'panel-health-widget ' + summary.status;
        }
    }

    updateAlertsPanel(filter = 'all') {
        const alerts = this.monitor.getAlerts(filter);
        const alertsList = document.getElementById('alertsList');
        const alertBadge = document.getElementById('alertBadge');
        
        if (!alertsList) return;

        const unresolvedCount = this.monitor.getAlerts('unresolved').length;
        if (alertBadge) {
            alertBadge.textContent = unresolvedCount;
            alertBadge.style.display = unresolvedCount > 0 ? 'inline-block' : 'none';
        }

        if (alerts.length === 0) {
            alertsList.innerHTML = '<p class="no-alerts" data-i18n="no_alerts">No alerts at this time</p>';
            return;
        }

        alertsList.innerHTML = alerts.slice(0, 5).map(alert => `
            <div class="alert-item ${alert.severity} ${alert.resolved ? 'resolved' : ''}">
                <div class="alert-icon-container">
                    ${this.getAlertIcon(alert.severity)}
                </div>
                <div class="alert-content">
                    <div class="alert-header-row">
                        <span class="alert-panel-id">${alert.panelId}</span>
                        <span class="alert-code">${alert.errorCode}</span>
                        <span class="alert-time">${this.formatTimeAgo(alert.timestamp)}</span>
                    </div>
                    <p class="alert-message">${alert.message}</p>
                    <p class="alert-detailed">${alert.detailedMessage}</p>
                    ${!alert.resolved ? `
                        <button class="btn-resolve" onclick="panelHealthUI.resolveAlertPrompt('${alert.alertId}')">
                            <span data-i18n="mark_resolved">Mark as Resolved</span>
                        </button>
                    ` : `
                        <p class="resolved-info">
                            ✓ <span data-i18n="resolved_by">Resolved by</span> ${alert.resolvedBy} 
                            <span data-i18n="on">on</span> ${new Date(alert.resolvedAt).toLocaleString()}
                        </p>
                    `}
                </div>
            </div>
        `).join('');
    }

    getAlertIcon(severity) {
        const icons = {
            'warning': '⚠️',
            'defective': '🚨',
            'healthy': '✅'
        };
        return icons[severity] || '⚠️';
    }

    formatTimeAgo(timestamp) {
        const now = Date.now();
        const diff = now - new Date(timestamp).getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        return `${days}d ago`;
    }

    handleAlert(alert) {
        // Show notification
        this.showAlertNotification(alert);
        
        // Update UI
        this.updateHealthSummary();
        this.updateAlertsPanel();
        
        // Play sound for critical alerts
        if (alert.severity === 'defective') {
            this.playAlertSound();
        }
    }

    showAlertNotification(alert) {
        const notification = document.createElement('div');
        notification.className = `alert-notification ${alert.severity}`;
        notification.innerHTML = `
            <div class="notification-header">
                <span class="notification-icon">${this.getAlertIcon(alert.severity)}</span>
                <strong>${alert.panelId} - ${alert.errorCode}</strong>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
            <p>${alert.message}</p>
            <p class="notification-detail">${alert.detailedMessage}</p>
        `;

        document.body.appendChild(notification);

        // Auto-remove after 10 seconds
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 300);
        }, 10000);
    }

    playAlertSound() {
        // Create a simple beep sound using Web Audio API
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

    filterAlerts(filter) {
        // Update active filter button
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.filter === filter) {
                btn.classList.add('active');
            }
        });

        this.updateAlertsPanel(filter);
    }

    resolveAlertPrompt(alertId) {
        const userName = document.getElementById('userName').textContent;
        const notes = prompt('Enter resolution notes (optional):');
        
        if (notes !== null) {
            const result = this.monitor.resolveAlert(alertId, userName, notes);
            
            if (result.success) {
                showNotification('Alert marked as resolved', 'success');
                this.updateAlertsPanel();
                this.updateHealthSummary();
            } else {
                showNotification(result.message, 'error');
            }
        }
    }

    showDetailsModal() {
        const panels = this.monitor.getPanels();
        const summary = this.monitor.getHealthSummary();
        
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content panel-details-modal">
                <div class="modal-header">
                    <h2 data-i18n="panel_details">Solar Panel Details</h2>
                    <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">×</button>
                </div>
                <div class="modal-body">
                    <div class="summary-cards">
                        <div class="summary-card">
                            <h4 data-i18n="total_output">Total Output</h4>
                            <p class="summary-value">${summary.totalOutput} kW</p>
                            <p class="summary-sub">Expected: ${summary.totalExpected} kW</p>
                        </div>
                        <div class="summary-card">
                            <h4 data-i18n="system_efficiency">System Efficiency</h4>
                            <p class="summary-value">${summary.efficiency}%</p>
                        </div>
                        <div class="summary-card">
                            <h4 data-i18n="active_issues">Active Issues</h4>
                            <p class="summary-value">${summary.unresolvedAlerts}</p>
                        </div>
                    </div>
                    <div class="panels-grid">
                        ${panels.map(panel => `
                            <div class="panel-card ${panel.status}">
                                <div class="panel-card-header">
                                    <span class="panel-id">${panel.panelId}</span>
                                    <span class="panel-status-badge ${panel.status}">${panel.status}</span>
                                </div>
                                <div class="panel-metrics">
                                    <div class="metric">
                                        <span class="metric-label">Output:</span>
                                        <span class="metric-value">${panel.currentOutput.toFixed(2)} kW</span>
                                    </div>
                                    <div class="metric">
                                        <span class="metric-label">Temp:</span>
                                        <span class="metric-value">${panel.temperature}°C</span>
                                    </div>
                                    <div class="metric">
                                        <span class="metric-label">Voltage:</span>
                                        <span class="metric-value">${panel.voltage}V</span>
                                    </div>
                                </div>
                                ${panel.errorCodes.length > 0 ? `
                                    <div class="panel-errors">
                                        ${panel.errorCodes.map(code => `
                                            <span class="error-badge">${code}</span>
                                        `).join('')}
                                    </div>
                                ` : ''}
                            </div>
                        `).join('')}
                    </div>
                    <div class="modal-actions">
                        <button class="btn-export" onclick="panelHealthUI.exportHealthReport()">
                            📊 <span data-i18n="export_report">Export Health Report</span>
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    }

    exportHealthReport() {
        const csv = this.monitor.exportCSV();
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `panel-health-report-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
        
        showNotification('Health report exported successfully', 'success');
    }
}

// Export for use in other scripts
window.PanelHealthUI = PanelHealthUI;
