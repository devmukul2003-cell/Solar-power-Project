// ============================================
// API Service Layer - Frontend to Backend
// Connects dashboard to MongoDB backend
// ============================================

class EnergyDashboardAPI {
    constructor() {
        this.baseURL = 'http://localhost:5000/api';
        this.token = localStorage.getItem('authToken');
    }

    // Set auth token
    setToken(token) {
        this.token = token;
        localStorage.setItem('authToken', token);
    }

    // Clear auth token
    clearToken() {
        this.token = null;
        localStorage.removeItem('authToken');
    }

    // Get auth headers
    getHeaders() {
        const headers = {
            'Content-Type': 'application/json'
        };
        
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }
        
        return headers;
    }

    // Generic request handler
    async request(endpoint, options = {}) {
        try {
            console.log(`API: Requesting ${endpoint}...`);
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                ...options,
                headers: this.getHeaders()
            });

            console.log(`API: Response status ${response.status}`);
            const data = await response.json();

            if (!response.ok) {
                console.error(`API: Request failed - ${data.message}`);
                // Return error data instead of throwing
                return {
                    success: false,
                    message: data.message || 'API request failed',
                    status: response.status
                };
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            // Return error object instead of throwing
            return {
                success: false,
                message: error.message || 'Network error',
                error: error
            };
        }
    }

    // ============================================
    // AUTHENTICATION
    // ============================================

    async signup(email, password, name) {
        const data = await this.request('/auth/signup', {
            method: 'POST',
            body: JSON.stringify({ email, password, name })
        });
        return data;
    }

    async login(email, password) {
        console.log('API: Calling login endpoint...');
        const data = await this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
        
        console.log('API: Login response received:', data.success);
        
        if (data.success && data.token) {
            console.log('API: Setting token...');
            this.setToken(data.token);
            console.log('API: Token set successfully');
            
            // Verify it was saved
            const saved = localStorage.getItem('authToken');
            console.log('API: Token in localStorage:', saved ? 'YES' : 'NO');
        } else {
            console.log('API: No token in response');
        }
        
        return data;
    }

    async logout() {
        const data = await this.request('/auth/logout', {
            method: 'POST'
        });
        this.clearToken();
        return data;
    }

    async getCurrentUser() {
        console.log('API: Getting current user...');
        const response = await this.request('/auth/me');
        console.log('API: getCurrentUser response:', response);
        return response;
    }

    // ============================================
    // ENERGY DATA
    // ============================================

    async createEnergyData(solarProduced_kWh, householdConsumed_kWh, timestamp) {
        return await this.request('/energy-data', {
            method: 'POST',
            body: JSON.stringify({
                solarProduced_kWh,
                householdConsumed_kWh,
                timestamp: timestamp || new Date()
            })
        });
    }

    async getEnergyData(startDate, endDate, limit = 100) {
        const params = new URLSearchParams();
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);
        params.append('limit', limit);
        
        return await this.request(`/energy-data?${params}`);
    }

    async getEnergyStats(days = 30) {
        return await this.request(`/energy-data/stats?days=${days}`);
    }

    async getTodayEnergyData() {
        return await this.request('/energy-data/today');
    }

    // ============================================
    // APPLIANCES
    // ============================================

    async createAppliance(applianceData) {
        return await this.request('/appliances', {
            method: 'POST',
            body: JSON.stringify(applianceData)
        });
    }

    async getAppliances(status, isActive) {
        const params = new URLSearchParams();
        if (status) params.append('status', status);
        if (isActive !== undefined) params.append('isActive', isActive);
        
        return await this.request(`/appliances?${params}`);
    }

    async updateAppliance(applianceId, updates) {
        return await this.request(`/appliances/${applianceId}`, {
            method: 'PUT',
            body: JSON.stringify(updates)
        });
    }

    async bulkUpdateAppliances(appliances) {
        return await this.request('/appliances/bulk-update', {
            method: 'POST',
            body: JSON.stringify({ appliances })
        });
    }

    async getApplianceStats() {
        return await this.request('/appliances/stats/consumption');
    }

    // ============================================
    // PANEL HEALTH
    // ============================================

    async createPanel(panelNumber, expectedOutput_kW) {
        return await this.request('/panel-health', {
            method: 'POST',
            body: JSON.stringify({ panelNumber, expectedOutput_kW })
        });
    }

    async getPanels(status) {
        const params = status ? `?status=${status}` : '';
        return await this.request(`/panel-health${params}`);
    }

    async updatePanel(panelId, updates) {
        return await this.request(`/panel-health/${panelId}`, {
            method: 'PUT',
            body: JSON.stringify(updates)
        });
    }

    async bulkUpdatePanels(panels) {
        return await this.request('/panel-health/bulk-update', {
            method: 'POST',
            body: JSON.stringify({ panels })
        });
    }

    async getPanelStats() {
        return await this.request('/panel-health/stats/summary');
    }

    // ============================================
    // INCENTIVES
    // ============================================

    async createIncentiveRecord(energySaved_kWh, pointsEarned, totalPoints, rewardLevel) {
        return await this.request('/incentives', {
            method: 'POST',
            body: JSON.stringify({
                energySaved_kWh,
                pointsEarned,
                totalPoints,
                rewardLevel
            })
        });
    }

    async getIncentiveHistory(limit = 50) {
        return await this.request(`/incentives?limit=${limit}`);
    }

    async getCurrentPoints() {
        return await this.request('/incentives/current');
    }

    // ============================================
    // PREFERENCES
    // ============================================

    async getPreferences() {
        return await this.request('/preferences');
    }

    async updatePreferences(preferences) {
        return await this.request('/preferences', {
            method: 'PUT',
            body: JSON.stringify(preferences)
        });
    }

    // ============================================
    // NOTIFICATIONS
    // ============================================

    async createNotification(type, category, message) {
        return await this.request('/notifications', {
            method: 'POST',
            body: JSON.stringify({ type, category, message })
        });
    }

    async getNotifications(resolved, isRead, type, limit = 50) {
        const params = new URLSearchParams();
        if (resolved !== undefined) params.append('resolved', resolved);
        if (isRead !== undefined) params.append('isRead', isRead);
        if (type) params.append('type', type);
        params.append('limit', limit);
        
        return await this.request(`/notifications?${params}`);
    }

    async markNotificationRead(notificationId) {
        return await this.request(`/notifications/${notificationId}/read`, {
            method: 'PUT'
        });
    }

    async resolveNotification(notificationId) {
        return await this.request(`/notifications/${notificationId}/resolve`, {
            method: 'PUT'
        });
    }

    async getUnreadCount() {
        return await this.request('/notifications/unread/count');
    }
}

// Create global instance
const api = new EnergyDashboardAPI();
window.api = api;

console.log('✅ API Service initialized - Backend: http://localhost:5000/api');
