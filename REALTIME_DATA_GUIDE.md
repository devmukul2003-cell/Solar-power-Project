# Real-Time Data Engine - Technical Documentation

## Overview
The Smart Energy Dashboard now features a comprehensive real-time data engine that simulates IoT sensor data with realistic patterns and provides live chart updates.

## Key Features

### 1. Real-Time Data Generation
- **Update Frequency**: Every 10 seconds
- **Data Points**: Minute-by-minute tracking throughout the day
- **Realistic Patterns**: 
  - Solar generation follows bell curve (peak at noon)
  - Consumption varies by time of day (morning/evening peaks)
  - Seasonal variations for historical data

### 2. Dynamic Visualizations

#### Energy Generation vs Usage (Today)
- **Type**: Line chart with live updates
- **Data Points**: Hourly aggregates from minute-level data
- **Updates**: Automatically refreshes every 10 seconds without page reload
- **Features**:
  - Smooth animations
  - Hover tooltips with precise values
  - Real-time indicators showing current kW generation/consumption

#### Weekly Energy Overview
- **Type**: Bar chart
- **Views**: Daily, Weekly, Monthly aggregates
- **Date Ranges**: 7, 30, 90, or 100 days
- **Metrics**: Solar generated, total consumed, money saved, CO₂ reduced

### 3. Data Structure

#### Minute-Level Data
```javascript
{
  timestamp: 1709035200000,
  time: "10:30 AM",
  hour: 10,
  minute: 30,
  solar: 4.523,        // kW
  consumption: 2.145   // kW
}
```

#### Hourly Aggregates
```javascript
{
  hour: "10:00",
  hourNum: 10,
  solar: 4.2,          // Average kWh for the hour
  consumption: 2.3,
  dataPoints: 60       // Number of minute samples
}
```

#### Historical Daily Data
```javascript
{
  date: "2024-02-27",
  timestamp: 1709020800000,
  solarGenerated: 22.5,    // kWh
  consumption: 18.3,
  gridConsumed: 0,
  moneySaved: 180.00,      // ₹
  co2Reduced: 18.45        // kg
}
```

## Real-Time Data Engine API

### Class: RealTimeDataEngine

#### Constructor
```javascript
const dataEngine = new RealTimeDataEngine(userId, solarCapacity);
```

#### Methods

**getCurrentRealTimeData()**
Returns current second-by-second data:
```javascript
{
  timestamp: 1709035200000,
  time: "10:30:45 AM",
  solar: 4.523,
  consumption: 2.145,
  gridUsage: 0,
  solarUsage: 2.145,
  excessSolar: 2.378,
  solarPercentage: 100
}
```

**getHistoricalData(days)**
Returns array of daily historical data for specified number of days.

**getWeeklyData()**
Returns last 7 days formatted for charts.

**getTodayHourlyData()**
Returns today's data aggregated by hour (24 data points).

**getTodayMinuteData()**
Returns today's minute-by-minute data.

**getCustomRangeData(startDate, endDate)**
Returns data for custom date range.

**exportData(format)**
Exports data in 'json' or 'csv' format.

**startRealTimeUpdates()**
Begins 10-second interval updates (auto-started on init).

**stopRealTimeUpdates()**
Stops real-time updates (call on page unload).

## Event System

### Custom Event: 'energyDataUpdate'
Fired every 10 seconds with new real-time data.

```javascript
window.addEventListener('energyDataUpdate', (event) => {
  const newData = event.detail;
  console.log('Solar:', newData.solar, 'kW');
  console.log('Consumption:', newData.consumption, 'kW');
  console.log('Solar Coverage:', newData.solarPercentage, '%');
});
```

## Data Patterns

### Solar Generation Pattern
- **6 AM - 6 PM**: Active generation
- **Peak**: 12 PM (100% of capacity)
- **Morning/Evening**: Gradual ramp up/down
- **Night**: Zero generation
- **Variation**: ±20% random fluctuation

### Consumption Pattern
- **Base Load**: 0.5 kW (always on)
- **Morning Peak** (6-9 AM): +2-3 kW
- **Lunch** (12-2 PM): +1.5-2.5 kW
- **Evening Peak** (6-11 PM): +3-5 kW
- **Night** (11 PM-6 AM): Base load only

### Historical Data
- **100 days** of historical data generated
- **Seasonal variation**: Higher solar in summer months
- **Weekend pattern**: Higher consumption on weekends
- **Realistic calculations**: Money saved (₹8/kWh), CO₂ reduced (0.82 kg/kWh)

## Chart Update Strategy

### Today's Chart (Energy Generation vs Usage)
- Updates every 10 seconds
- Uses `chart.update('none')` for smooth updates without animation
- Maintains 24-hour view with hourly data points
- Current hour updates in real-time

### Weekly Chart
- Updates on user interaction (date range/view type change)
- Full animation on update
- Supports daily, weekly, monthly aggregation

## Performance Optimization

1. **Efficient Data Storage**
   - Minute data limited to last 24 hours
   - Historical data capped at 100 days
   - LocalStorage for persistence

2. **Smart Updates**
   - Charts update only when data changes
   - No animation for real-time updates (smoother)
   - Debounced stat calculations

3. **Memory Management**
   - Old data automatically pruned
   - Intervals cleared on page unload
   - Event listeners properly cleaned up

## Usage Example

```javascript
// Initialize
const dataEngine = new RealTimeDataEngine('user@example.com', 5);

// Get current data
const current = dataEngine.getCurrentRealTimeData();
console.log(`Generating ${current.solar} kW`);

// Get historical data
const last30Days = dataEngine.getHistoricalData(30);

// Export data
const csv = dataEngine.exportData('csv');

// Listen for updates
window.addEventListener('energyDataUpdate', (event) => {
  updateUI(event.detail);
});

// Cleanup
window.addEventListener('beforeunload', () => {
  dataEngine.stopRealTimeUpdates();
});
```

## Future Enhancements

1. **WebSocket Integration**: Connect to real IoT sensors
2. **API Integration**: Fetch weather data for solar predictions
3. **Machine Learning**: Predict consumption patterns
4. **Alerts**: Notify users of unusual patterns
5. **Battery Storage**: Track battery charge/discharge cycles
6. **Grid Export**: Monitor energy sold back to grid

## Browser Compatibility
- Chrome, Firefox, Safari, Edge (latest versions)
- Requires localStorage and CustomEvent support
- Chart.js 3.x for visualizations
