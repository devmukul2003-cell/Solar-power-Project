# Solar Panel Health Monitoring System - Complete Guide

## Overview
A comprehensive real-time monitoring and alert system that tracks the health of individual solar panels, detects defects, and notifies users of potential issues requiring maintenance.

## Features

### 1. Real-Time Panel Monitoring
- **12 Solar Panels** tracked individually
- **15-second update interval** for continuous monitoring
- **Live metrics** for each panel:
  - Current output (kW)
  - Expected output (kW)
  - Temperature (°C)
  - Voltage (V)
  - Status (healthy/warning/defective)

### 2. Defect Detection System

#### Error Codes
```javascript
ERR_001 - LOW_OUTPUT
  Severity: Warning
  Trigger: Output < 70% of expected
  Message: "Panel output below expected threshold"

ERR_002 - CONNECTIVITY_ISSUE
  Severity: Defective
  Trigger: Output = 0 when expected > 0
  Message: "Panel not responding or connection lost"

ERR_003 - OVERHEATING
  Severity: Warning
  Trigger: Temperature >= 75°C
  Message: "Panel temperature exceeds safe operating range"

ERR_004 - CRITICAL_OVERHEATING
  Severity: Defective
  Trigger: Temperature >= 85°C
  Message: "Critical temperature - immediate attention required"

ERR_005 - VOLTAGE_FLUCTUATION
  Severity: Warning
  Trigger: Voltage outside 48V ±3V
  Message: "Unstable voltage output detected"

ERR_006 - PHYSICAL_DAMAGE
  Severity: Defective
  Trigger: Output < 40% of expected
  Message: "Possible physical damage or obstruction detected"

ERR_007 - DEGRADATION
  Severity: Warning
  Trigger: Output 65-75% of expected
  Message: "Panel efficiency degradation detected"
```

### 3. Alert System

#### Alert Structure
```json
{
  "alertId": "ALERT-1709035200000-abc123",
  "panelId": "PANEL-001",
  "errorCode": "ERR_001",
  "errorType": "LOW_OUTPUT",
  "severity": "warning",
  "status": "warning",
  "message": "Panel output below expected threshold",
  "detailedMessage": "Panel PANEL-001 is producing 0.25kW instead of expected 0.42kW...",
  "timestamp": "2024-02-27T10:30:00Z",
  "resolved": false,
  "resolvedAt": null,
  "resolvedBy": null,
  "notes": ""
}
```

#### Alert Types
- **Pop-up Notifications**: Appear in top-right corner
- **Dashboard Alerts Panel**: Shows recent alerts
- **Sound Alerts**: Critical issues trigger audio notification
- **Visual Indicators**: Color-coded status badges

### 4. User Interface Components

#### Health Summary Widget
- Total panels count
- Healthy panels count (green)
- Warning panels count (orange)
- Defective panels count (red)
- System efficiency percentage
- Quick status overview

#### Alerts Panel
- Recent alerts list (last 5)
- Filter options:
  - All alerts
  - Unresolved only
  - Critical only
- Alert badge showing unresolved count
- Resolve button for each alert

#### Panel Details Modal
- Grid view of all 12 panels
- Individual panel metrics
- Status badges
- Error codes display
- Export health report button

### 5. Resolution Tracking

#### Marking Alerts as Resolved
```javascript
// User clicks "Mark as Resolved"
panelHealthMonitor.resolveAlert(alertId, userName, notes);

// Alert updated
{
  "resolved": true,
  "resolvedAt": "2024-02-27T11:00:00Z",
  "resolvedBy": "John Doe",
  "notes": "Cleaned panel, output restored"
}
```

#### Maintenance History
Each panel maintains a history of resolved issues:
```javascript
{
  "maintenanceHistory": [
    {
      "date": "2024-02-27T11:00:00Z",
      "issue": "LOW_OUTPUT",
      "resolvedBy": "John Doe",
      "notes": "Cleaned panel, output restored"
    }
  ]
}
```

### 6. Data Logging

#### Storage
- **Panel Data**: `localStorage` key `panelHealth_${userId}`
- **Alerts Log**: `localStorage` key `panelAlerts_${userId}`
- **Retention**: Last 100 alerts kept

#### Export Options
1. **CSV Export**: Panel health report
   - Panel ID, Status, Output, Temperature, Voltage, Errors
2. **JSON Export**: Complete health report
   - Summary, all panels, unresolved alerts, recent alerts

## API Reference

### SolarPanelHealthMonitor Class

#### Constructor
```javascript
const monitor = new SolarPanelHealthMonitor(userId, numberOfPanels);
// userId: User identifier
// numberOfPanels: Number of panels to monitor (default: 12)
```

#### Methods

**getPanels()**
Returns array of all panels with current status.

**getPanel(panelId)**
Returns specific panel data.
```javascript
const panel = monitor.getPanel('PANEL-001');
```

**getAlerts(filter)**
Returns alerts based on filter.
```javascript
const all = monitor.getAlerts('all');
const unresolved = monitor.getAlerts('unresolved');
const resolved = monitor.getAlerts('resolved');
const critical = monitor.getAlerts('critical');
```

**getHealthSummary()**
Returns system-wide health summary.
```javascript
{
  totalPanels: 12,
  healthy: 10,
  warning: 1,
  defective: 1,
  unresolvedAlerts: 2,
  totalOutput: 4.5,
  totalExpected: 5.04,
  efficiency: 89.3,
  status: 'warning'
}
```

**resolveAlert(alertId, resolvedBy, notes)**
Marks an alert as resolved.
```javascript
monitor.resolveAlert('ALERT-123', 'John Doe', 'Panel cleaned');
```

**exportHealthReport()**
Exports complete health report as JSON.

**exportCSV()**
Exports panel data as CSV string.

**startMonitoring()**
Begins real-time monitoring (auto-started on init).

**stopMonitoring()**
Stops monitoring interval.

### PanelHealthUI Class

#### Constructor
```javascript
const ui = new PanelHealthUI(monitor);
// monitor: SolarPanelHealthMonitor instance
```

#### Methods

**showDetailsModal()**
Opens detailed panel view modal.

**filterAlerts(filter)**
Filters alerts panel display.

**resolveAlertPrompt(alertId)**
Shows prompt to resolve alert with notes.

**exportHealthReport()**
Triggers CSV export download.

## Event System

### Custom Events

**panelAlert**
Fired when new alert is detected.
```javascript
window.addEventListener('panelAlert', (event) => {
  const alert = event.detail;
  console.log('New alert:', alert.panelId, alert.errorCode);
});
```

## Thresholds Configuration

```javascript
thresholds: {
  lowOutput: 0.7,        // 70% of expected
  highTemp: 75,          // 75°C warning
  criticalTemp: 85,      // 85°C critical
  connectivityTimeout: 300000  // 5 minutes
}
```

## Realistic Simulation

### Panel Behavior
- **Time-based output**: Follows solar curve (6 AM - 6 PM)
- **Peak at noon**: Maximum output at 12:00
- **Temperature correlation**: Higher output = higher temperature
- **Random variation**: ±10% normal fluctuation
- **Issue probability**: 5% chance per check cycle

### Issue Simulation
Issues are randomly introduced to simulate real-world scenarios:
- Low output (shading, dirt)
- Connectivity loss (wiring issues)
- Overheating (poor ventilation)
- Voltage fluctuations (inverter issues)
- Physical damage (cracks, obstructions)
- Degradation (aging panels)

## Usage Examples

### Initialize System
```javascript
// In enhanced-dashboard.js
const panelHealthMonitor = new SolarPanelHealthMonitor(userId, 12);
const panelHealthUI = new PanelHealthUI(panelHealthMonitor);
```

### Get Current Status
```javascript
const summary = panelHealthMonitor.getHealthSummary();
console.log(`System efficiency: ${summary.efficiency}%`);
console.log(`Unresolved alerts: ${summary.unresolvedAlerts}`);
```

### Handle Alerts
```javascript
window.addEventListener('panelAlert', (event) => {
  const alert = event.detail;
  
  if (alert.severity === 'defective') {
    // Send email notification
    // Log to external system
    // Trigger maintenance request
  }
});
```

### Resolve Issue
```javascript
// User marks alert as resolved
panelHealthMonitor.resolveAlert(
  'ALERT-123',
  'Maintenance Team',
  'Replaced faulty connector'
);
```

### Export Reports
```javascript
// CSV export
const csv = panelHealthMonitor.exportCSV();
downloadFile(csv, 'panel-health.csv');

// JSON export
const report = panelHealthMonitor.exportHealthReport();
console.log(report);
```

## Integration with Dashboard

### Automatic Integration
The system automatically integrates with the enhanced dashboard:
1. Health summary widget appears after session info
2. Alerts panel appears at bottom of dashboard
3. Real-time updates every 15 seconds
4. Notifications appear for new alerts

### Manual Integration
```html
<!-- Add scripts -->
<script src="solarPanelHealthMonitor.js"></script>
<script src="panel-health-ui.js"></script>

<!-- Add styles -->
<link rel="stylesheet" href="panel-health-styles.css">

<!-- Initialize -->
<script>
  const monitor = new SolarPanelHealthMonitor(userId, 12);
  const ui = new PanelHealthUI(monitor);
</script>
```

## Responsive Design

### Mobile Optimizations
- Stacked health stats (1 column)
- Simplified alert cards
- Touch-friendly buttons
- Optimized modal for small screens

### Tablet Optimizations
- 2-column health stats
- Compact alert layout
- Responsive panel grid

## Performance

### Optimization Strategies
1. **Efficient Updates**: Only changed data triggers UI updates
2. **Debounced Rendering**: Prevents excessive DOM manipulation
3. **LocalStorage**: Persistent data without server calls
4. **Event-Driven**: Reactive updates via custom events
5. **Lazy Loading**: Modal content loaded on demand

### Resource Usage
- **Memory**: ~2MB for 12 panels + 100 alerts
- **CPU**: Minimal (15-second intervals)
- **Storage**: ~500KB localStorage per user

## Troubleshooting

### Panels Not Updating
```javascript
// Check monitoring status
console.log(panelHealthMonitor.monitoringInterval);

// Manually trigger update
panelHealthMonitor.monitorPanels();
```

### Alerts Not Showing
```javascript
// Check alerts
console.log(panelHealthMonitor.getAlerts('all'));

// Check event listeners
window.dispatchEvent(new CustomEvent('panelAlert', { 
  detail: testAlert 
}));
```

### Data Not Persisting
```javascript
// Check localStorage
console.log(localStorage.getItem('panelHealth_userId'));
console.log(localStorage.getItem('panelAlerts_userId'));

// Manually save
panelHealthMonitor.savePanels();
panelHealthMonitor.saveAlerts();
```

## Future Enhancements

1. **Predictive Maintenance**: ML-based failure prediction
2. **Weather Integration**: Correlate issues with weather data
3. **Remote Diagnostics**: Real-time technician access
4. **Automated Ticketing**: Auto-create maintenance tickets
5. **Historical Analytics**: Long-term performance trends
6. **Mobile App**: Dedicated mobile monitoring app
7. **SMS/Email Alerts**: Multi-channel notifications
8. **Integration APIs**: Connect to external systems

## Security Considerations

1. **Data Privacy**: User data stored locally
2. **Access Control**: User-specific data isolation
3. **Audit Trail**: Complete maintenance history
4. **Data Validation**: Input sanitization
5. **XSS Prevention**: Safe HTML rendering

## Browser Compatibility
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Requires: localStorage, CustomEvent, Web Audio API (optional)

## Support
For issues or questions, check browser console logs or review the implementation in source files.
