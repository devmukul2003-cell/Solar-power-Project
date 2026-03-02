/**
 * Enhanced Smart Energy Dashboard
 * Features: Incentive Points, Language Toggle, Theme Toggle, Custom Date Range
 */

class EnhancedDashboard {
    constructor(userId, solarCapacity = 5) {
        this.userId = userId;
        this.solarCapacity = solarCapacity;
        this.storageKey = `dashboard_${userId}`;
        
        // Load or initialize user preferences
        this.preferences = this.loadPreferences();
        
        // Initialize incentive system
        this.incentiveSystem = new IncentivePointsSystem(userId);
        
        // Apply saved preferences
        this.applyTheme();
        this.applyLanguage();
        
        console.log('✅ Enhanced Dashboard initialized');
    }

    /**
     * Load user preferences from storage
     */
    loadPreferences() {
        const stored = localStorage.getItem(this.storageKey);
        if (stored) {
            return JSON.parse(stored);
        }
        
        // Default preferences
        return {
            language: 'english', // 'english' or 'hindi'
            theme: 'light', // 'light' or 'dark'
            dateRange: {
                preset: '30', // '7', '30', '90', '100', 'custom'
                customStart: null,
                customEnd: null
            },
            lastUpdated: new Date().toISOString()
        };
    }

    /**
     * Save preferences to storage
     */
    savePreferences() {
        this.preferences.lastUpdated = new Date().toISOString();
        localStorage.setItem(this.storageKey, JSON.stringify(this.preferences));
    }

    /**
     * Toggle language between English and Hindi
     */
    toggleLanguage() {
        this.preferences.language = this.preferences.language === 'english' ? 'hindi' : 'english';
        this.savePreferences();
        this.applyLanguage();
        
        // Trigger event for UI update
        window.dispatchEvent(new CustomEvent('languageChanged', {
            detail: { language: this.preferences.language }
        }));
        
        console.log('🌐 Language changed to:', this.preferences.language);
    }

    /**
     * Apply language to UI
     */
    applyLanguage() {
        const lang = this.preferences.language;
        document.documentElement.setAttribute('data-language', lang);
        
        // Update all translatable elements
        document.querySelectorAll('[data-translate]').forEach(element => {
            const key = element.getAttribute('data-translate');
            if (translations[lang] && translations[lang][key]) {
                element.textContent = translations[lang][key];
            }
        });
    }

    /**
     * Toggle theme between Light and Dark
     */
    toggleTheme() {
        this.preferences.theme = this.preferences.theme === 'light' ? 'dark' : 'light';
        this.savePreferences();
        this.applyTheme();
        
        // Trigger event for UI update
        window.dispatchEvent(new CustomEvent('themeChanged', {
            detail: { theme: this.preferences.theme }
        }));
        
        console.log('🎨 Theme changed to:', this.preferences.theme);
    }

    /**
     * Apply theme to UI
     */
    applyTheme() {
        const theme = this.preferences.theme;
        document.documentElement.setAttribute('data-theme', theme);
        
        if (theme === 'dark') {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    }

    /**
     * Set date range
     */
    setDateRange(preset, customStart = null, customEnd = null) {
        this.preferences.dateRange = {
            preset: preset,
            customStart: customStart,
            customEnd: customEnd
        };
        this.savePreferences();
        
        // Trigger event for data refresh
        window.dispatchEvent(new CustomEvent('dateRangeChanged', {
            detail: this.preferences.dateRange
        }));
        
        console.log('📅 Date range changed:', this.preferences.dateRange);
    }

    /**
     * Get current date range in days
     */
    getDateRangeDays() {
        const range = this.preferences.dateRange;
        
        if (range.preset === 'custom' && range.customStart && range.customEnd) {
            const start = new Date(range.customStart);
            const end = new Date(range.customEnd);
            const diffTime = Math.abs(end - start);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return diffDays;
        }
        
        return parseInt(range.preset);
    }

    /**
     * Get filtered data based on date range
     */
    getFilteredData(allData) {
        const range = this.preferences.dateRange;
        
        if (range.preset === 'custom' && range.customStart && range.customEnd) {
            const start = new Date(range.customStart);
            const end = new Date(range.customEnd);
            
            return allData.filter(item => {
                const itemDate = new Date(item.date);
                return itemDate >= start && itemDate <= end;
            });
        }
        
        // Use preset range
        const days = parseInt(range.preset);
        return allData.slice(-days);
    }

    /**
     * Export preferences as JSON
     */
    exportPreferences() {
        return JSON.stringify({
            userId: this.userId,
            preferences: this.preferences,
            incentivePoints: this.incentiveSystem.getPoints(),
            exportDate: new Date().toISOString()
        }, null, 2);
    }

    /**
     * Get current language
     */
    getLanguage() {
        return this.preferences.language;
    }

    /**
     * Get current theme
     */
    getTheme() {
        return this.preferences.theme;
    }

    /**
     * Get translated text
     */
    translate(key) {
        const lang = this.preferences.language;
        return translations[lang]?.[key] || key;
    }
}

/**
 * Incentive Points System
 */
class IncentivePointsSystem {
    constructor(userId) {
        this.userId = userId;
        this.storageKey = `incentive_${userId}`;
        this.pointsData = this.loadPoints();
    }

    /**
     * Load points from storage
     */
    loadPoints() {
        const stored = localStorage.getItem(this.storageKey);
        if (stored) {
            return JSON.parse(stored);
        }
        
        return {
            totalPoints: 0,
            pointsEarned: 0,
            pointsRedeemed: 0,
            pointsHistory: [],
            lastCalculated: null
        };
    }

    /**
     * Save points to storage
     */
    savePoints() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.pointsData));
    }

    /**
     * Calculate points based on energy savings
     * Formula: 1 point per kWh saved from grid
     */
    calculatePoints(solarUsed, gridUsed) {
        // Points = Solar energy used instead of grid
        const pointsEarned = Math.floor(solarUsed * 10); // 10 points per kWh
        
        return pointsEarned;
    }

    /**
     * Award points for energy savings
     */
    awardPoints(solarGenerated, consumed, date = new Date().toISOString()) {
        const solarUsed = Math.min(solarGenerated, consumed);
        const gridUsed = Math.max(0, consumed - solarGenerated);
        
        const pointsEarned = this.calculatePoints(solarUsed, gridUsed);
        
        if (pointsEarned > 0) {
            this.pointsData.totalPoints += pointsEarned;
            this.pointsData.pointsEarned += pointsEarned;
            
            // Add to history
            this.pointsData.pointsHistory.push({
                date: date,
                pointsEarned: pointsEarned,
                solarUsed: solarUsed,
                gridUsed: gridUsed,
                reason: 'Energy Savings'
            });
            
            // Keep only last 100 entries
            if (this.pointsData.pointsHistory.length > 100) {
                this.pointsData.pointsHistory.shift();
            }
            
            this.pointsData.lastCalculated = date;
            this.savePoints();
            
            console.log(`⭐ Awarded ${pointsEarned} points`);
        }
        
        return pointsEarned;
    }

    /**
     * Redeem points
     */
    redeemPoints(points, reason = 'Redeemed') {
        if (points > this.pointsData.totalPoints) {
            return {
                success: false,
                message: 'Insufficient points'
            };
        }
        
        this.pointsData.totalPoints -= points;
        this.pointsData.pointsRedeemed += points;
        
        this.pointsData.pointsHistory.push({
            date: new Date().toISOString(),
            pointsRedeemed: points,
            reason: reason
        });
        
        this.savePoints();
        
        return {
            success: true,
            message: `Redeemed ${points} points`,
            remainingPoints: this.pointsData.totalPoints
        };
    }

    /**
     * Reset points (user choice)
     */
    resetPoints() {
        this.pointsData = {
            totalPoints: 0,
            pointsEarned: 0,
            pointsRedeemed: 0,
            pointsHistory: [],
            lastCalculated: null
        };
        this.savePoints();
        
        console.log('🔄 Points reset');
    }

    /**
     * Get current points
     */
    getPoints() {
        return this.pointsData;
    }

    /**
     * Get points summary
     */
    getSummary() {
        return {
            totalPoints: this.pointsData.totalPoints,
            pointsEarned: this.pointsData.pointsEarned,
            pointsRedeemed: this.pointsData.pointsRedeemed,
            historyCount: this.pointsData.pointsHistory.length,
            lastCalculated: this.pointsData.lastCalculated
        };
    }

    /**
     * Export points data as JSON
     */
    exportJSON() {
        return JSON.stringify(this.pointsData, null, 2);
    }
}

/**
 * Translations
 */
const translations = {
    english: {
        // Navigation
        'nav.home': 'Home',
        'nav.dashboard': 'Dashboard',
        'nav.tips': 'Energy Tips',
        'nav.logout': 'Logout',
        
        // Dashboard
        'dashboard.title': 'Energy Dashboard',
        'dashboard.subtitle': 'Real-time monitoring of your energy production and consumption',
        
        // Stats
        'stats.solar': 'Solar Energy Produced',
        'stats.consumed': 'Energy Consumed',
        'stats.saved': 'Money Saved',
        'stats.co2': 'CO₂ Reduced',
        'stats.points': 'Incentive Points',
        
        // Units
        'unit.kwh': 'kWh',
        'unit.today': 'today',
        'unit.month': 'this month',
        'unit.kg': 'kg',
        
        // Filters
        'filter.dateRange': 'Date Range',
        'filter.7days': 'Last 7 Days',
        'filter.30days': 'Last 30 Days',
        'filter.90days': 'Last 90 Days',
        'filter.100days': 'All Time (100 Days)',
        'filter.custom': 'Custom Range',
        'filter.startDate': 'Start Date',
        'filter.endDate': 'End Date',
        'filter.apply': 'Apply',
        
        // Buttons
        'btn.export': 'Export Data',
        'btn.reset': 'Reset Points',
        'btn.redeem': 'Redeem Points',
        
        // Incentive Points
        'incentive.title': 'Incentive Points',
        'incentive.total': 'Total Points',
        'incentive.earned': 'Points Earned',
        'incentive.redeemed': 'Points Redeemed',
        'incentive.history': 'Points History',
        
        // Settings
        'settings.language': 'Language',
        'settings.theme': 'Theme',
        'settings.light': 'Light Mode',
        'settings.dark': 'Dark Mode',
        
        // Messages
        'msg.pointsAwarded': 'Points Awarded!',
        'msg.pointsReset': 'Points Reset Successfully',
        'msg.dataExported': 'Data Exported Successfully'
    },
    
    hindi: {
        // Navigation
        'nav.home': 'होम',
        'nav.dashboard': 'डैशबोर्ड',
        'nav.tips': 'ऊर्जा टिप्स',
        'nav.logout': 'लॉगआउट',
        
        // Dashboard
        'dashboard.title': 'ऊर्जा डैशबोर्ड',
        'dashboard.subtitle': 'आपकी ऊर्जा उत्पादन और खपत की वास्तविक समय निगरानी',
        
        // Stats
        'stats.solar': 'सौर ऊर्जा उत्पादन',
        'stats.consumed': 'ऊर्जा खपत',
        'stats.saved': 'बचत की गई राशि',
        'stats.co2': 'CO₂ में कमी',
        'stats.points': 'प्रोत्साहन अंक',
        
        // Units
        'unit.kwh': 'kWh',
        'unit.today': 'आज',
        'unit.month': 'इस महीने',
        'unit.kg': 'kg',
        
        // Filters
        'filter.dateRange': 'तिथि सीमा',
        'filter.7days': 'पिछले 7 दिन',
        'filter.30days': 'पिछले 30 दिन',
        'filter.90days': 'पिछले 90 दिन',
        'filter.100days': 'सभी समय (100 दिन)',
        'filter.custom': 'कस्टम रेंज',
        'filter.startDate': 'प्रारंभ तिथि',
        'filter.endDate': 'समाप्ति तिथि',
        'filter.apply': 'लागू करें',
        
        // Buttons
        'btn.export': 'डेटा निर्यात करें',
        'btn.reset': 'अंक रीसेट करें',
        'btn.redeem': 'अंक भुनाएं',
        
        // Incentive Points
        'incentive.title': 'प्रोत्साहन अंक',
        'incentive.total': 'कुल अंक',
        'incentive.earned': 'अर्जित अंक',
        'incentive.redeemed': 'भुनाए गए अंक',
        'incentive.history': 'अंक इतिहास',
        
        // Settings
        'settings.language': 'भाषा',
        'settings.theme': 'थीम',
        'settings.light': 'लाइट मोड',
        'settings.dark': 'डार्क मोड',
        
        // Messages
        'msg.pointsAwarded': 'अंक प्रदान किए गए!',
        'msg.pointsReset': 'अंक सफलतापूर्वक रीसेट किए गए',
        'msg.dataExported': 'डेटा सफलतापूर्वक निर्यात किया गया'
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { EnhancedDashboard, IncentivePointsSystem, translations };
}
