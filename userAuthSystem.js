/**
 * Smart Energy Dashboard - User Authentication System
 * Dynamic user dataset with complete authentication flows
 */

class UserAuthenticationSystem {
    constructor() {
        this.storageKey = 'smartEnergy_users';
        this.sessionKey = 'smartEnergy_session';
        this.maxLoginAttempts = 5;
        this.lockoutDuration = 15 * 60 * 1000; // 15 minutes
        this.sessionTimeout = 24 * 60 * 60 * 1000; // 24 hours
        
        this.initializeSystem();
    }

    /**
     * Initialize the authentication system
     */
    initializeSystem() {
        // Create demo users if database is empty
        const users = this.getAllUsers();
        if (users.length === 0) {
            this.createDemoUsers();
        }
        
        // Check for expired sessions
        this.cleanupExpiredSessions();
        
        console.log('🔐 User Authentication System initialized');
    }

    /**
     * Create demo users for testing
     */
    createDemoUsers() {
        const demoUsers = [
            {
                email: 'demo@energy.com',
                password: 'demo123',
                name: 'Demo User',
                location: 'Mumbai',
                solarCapacity: 5
            },
            {
                email: 'admin@energy.com',
                password: 'admin123',
                name: 'Admin User',
                location: 'Delhi',
                solarCapacity: 10
            },
            {
                email: 'test@energy.com',
                password: 'test123',
                name: 'Test User',
                location: 'Bangalore',
                solarCapacity: 3
            }
        ];

        demoUsers.forEach(user => {
            this.createUser(user);
        });

        console.log('✅ Demo users created');
    }

    /**
     * Generate unique user ID
     */
    generateUserId() {
        return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Hash password (simple hash for demo - use bcrypt in production)
     */
    hashPassword(password) {
        // Simple hash for demo purposes
        // In production, use bcrypt or similar
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return 'hash_' + Math.abs(hash).toString(36);
    }

    /**
     * Verify password
     */
    verifyPassword(password, hashedPassword) {
        return this.hashPassword(password) === hashedPassword;
    }

    /**
     * Create new user (Signup)
     */
    createUser(userData) {
        const users = this.getAllUsers();
        
        // Check if user already exists
        const existingUser = users.find(u => u.email === userData.email);
        if (existingUser) {
            return {
                success: false,
                message: 'User already exists',
                code: 'USER_EXISTS'
            };
        }

        // Validate required fields
        if (!userData.email || !userData.password) {
            return {
                success: false,
                message: 'Email and password are required',
                code: 'MISSING_FIELDS'
            };
        }

        // Validate email format
        if (!this.isValidEmail(userData.email)) {
            return {
                success: false,
                message: 'Invalid email format',
                code: 'INVALID_EMAIL'
            };
        }

        // Validate password strength
        if (userData.password.length < 6) {
            return {
                success: false,
                message: 'Password must be at least 6 characters',
                code: 'WEAK_PASSWORD'
            };
        }

        // Create new user object
        const newUser = {
            userId: this.generateUserId(),
            email: userData.email.toLowerCase().trim(),
            password: this.hashPassword(userData.password),
            name: userData.name || 'User',
            location: userData.location || 'Unknown',
            solarCapacity: userData.solarCapacity || 5,
            
            // Account status
            accountStatus: 'active',
            accountType: 'standard',
            
            // Authentication tracking
            loginAttempts: 0,
            lastLoginAttempt: null,
            lockedUntil: null,
            
            // Timestamps
            signupDate: new Date().toISOString(),
            lastLogin: null,
            lastPasswordChange: new Date().toISOString(),
            
            // Activity tracking
            totalLogins: 0,
            failedLoginAttempts: 0,
            
            // Profile
            profileComplete: false,
            emailVerified: false,
            phoneVerified: false,
            
            // Preferences
            preferences: {
                notifications: true,
                darkMode: false,
                language: 'en'
            },
            
            // Metadata
            createdBy: 'system',
            lastModified: new Date().toISOString(),
            version: 1
        };

        // Add to users array
        users.push(newUser);
        this.saveUsers(users);

        // Log activity
        this.logActivity(newUser.userId, 'USER_CREATED', {
            email: newUser.email,
            signupDate: newUser.signupDate
        });

        return {
            success: true,
            message: 'User created successfully',
            code: 'USER_CREATED',
            user: this.sanitizeUser(newUser)
        };
    }

    /**
     * Authenticate user (Login)
     */
    login(email, password) {
        const users = this.getAllUsers();
        const user = users.find(u => u.email === email.toLowerCase().trim());

        // User not found
        if (!user) {
            this.logActivity(null, 'LOGIN_FAILED', {
                email: email,
                reason: 'User not found'
            });
            
            return {
                success: false,
                message: 'Invalid email or password',
                code: 'INVALID_CREDENTIALS'
            };
        }

        // Check if account is locked
        if (user.lockedUntil && new Date(user.lockedUntil) > new Date()) {
            const remainingTime = Math.ceil((new Date(user.lockedUntil) - new Date()) / 60000);
            
            this.logActivity(user.userId, 'LOGIN_BLOCKED', {
                reason: 'Account locked',
                remainingTime: remainingTime
            });
            
            return {
                success: false,
                message: `Account locked. Try again in ${remainingTime} minutes`,
                code: 'ACCOUNT_LOCKED',
                remainingTime: remainingTime
            };
        }

        // Check account status
        if (user.accountStatus === 'inactive') {
            this.logActivity(user.userId, 'LOGIN_FAILED', {
                reason: 'Account inactive'
            });
            
            return {
                success: false,
                message: 'Account is inactive. Please contact support',
                code: 'ACCOUNT_INACTIVE'
            };
        }

        if (user.accountStatus === 'suspended') {
            this.logActivity(user.userId, 'LOGIN_FAILED', {
                reason: 'Account suspended'
            });
            
            return {
                success: false,
                message: 'Account is suspended. Please contact support',
                code: 'ACCOUNT_SUSPENDED'
            };
        }

        // Verify password
        if (!this.verifyPassword(password, user.password)) {
            // Increment failed attempts
            user.loginAttempts++;
            user.failedLoginAttempts++;
            user.lastLoginAttempt = new Date().toISOString();

            // Lock account if too many attempts
            if (user.loginAttempts >= this.maxLoginAttempts) {
                user.lockedUntil = new Date(Date.now() + this.lockoutDuration).toISOString();
                user.accountStatus = 'locked';
                
                this.saveUsers(users);
                
                this.logActivity(user.userId, 'ACCOUNT_LOCKED', {
                    reason: 'Too many failed login attempts',
                    attempts: user.loginAttempts
                });
                
                return {
                    success: false,
                    message: 'Account locked due to too many failed attempts',
                    code: 'ACCOUNT_LOCKED',
                    remainingTime: 15
                };
            }

            this.saveUsers(users);
            
            this.logActivity(user.userId, 'LOGIN_FAILED', {
                reason: 'Invalid password',
                attempts: user.loginAttempts
            });
            
            return {
                success: false,
                message: `Invalid email or password. ${this.maxLoginAttempts - user.loginAttempts} attempts remaining`,
                code: 'INVALID_CREDENTIALS',
                attemptsRemaining: this.maxLoginAttempts - user.loginAttempts
            };
        }

        // Successful login
        user.loginAttempts = 0;
        user.lastLogin = new Date().toISOString();
        user.totalLogins++;
        user.accountStatus = 'active';
        user.lockedUntil = null;

        this.saveUsers(users);

        // Create session
        const session = this.createSession(user);

        this.logActivity(user.userId, 'LOGIN_SUCCESS', {
            email: user.email,
            loginTime: user.lastLogin
        });

        return {
            success: true,
            message: 'Login successful',
            code: 'LOGIN_SUCCESS',
            user: this.sanitizeUser(user),
            session: session
        };
    }

    /**
     * Logout user
     */
    logout(userId) {
        this.destroySession();
        
        this.logActivity(userId, 'LOGOUT', {
            logoutTime: new Date().toISOString()
        });

        return {
            success: true,
            message: 'Logged out successfully',
            code: 'LOGOUT_SUCCESS'
        };
    }

    /**
     * Create user session
     */
    createSession(user) {
        const session = {
            sessionId: this.generateUserId(),
            userId: user.userId,
            email: user.email,
            name: user.name,
            location: user.location,
            solarCapacity: user.solarCapacity,
            accountStatus: user.accountStatus,
            createdAt: new Date().toISOString(),
            expiresAt: new Date(Date.now() + this.sessionTimeout).toISOString(),
            lastActivity: new Date().toISOString()
        };

        localStorage.setItem(this.sessionKey, JSON.stringify(session));
        return session;
    }

    /**
     * Get current session
     */
    getCurrentSession() {
        const sessionData = localStorage.getItem(this.sessionKey);
        if (!sessionData) return null;

        const session = JSON.parse(sessionData);

        // Check if session expired
        if (new Date(session.expiresAt) < new Date()) {
            this.destroySession();
            return null;
        }

        // Update last activity
        session.lastActivity = new Date().toISOString();
        localStorage.setItem(this.sessionKey, JSON.stringify(session));

        return session;
    }

    /**
     * Destroy session
     */
    destroySession() {
        localStorage.removeItem(this.sessionKey);
    }

    /**
     * Update user profile
     */
    updateUser(userId, updates) {
        const users = this.getAllUsers();
        const userIndex = users.findIndex(u => u.userId === userId);

        if (userIndex === -1) {
            return {
                success: false,
                message: 'User not found',
                code: 'USER_NOT_FOUND'
            };
        }

        // Don't allow updating sensitive fields
        const allowedFields = ['name', 'location', 'solarCapacity', 'preferences'];
        const filteredUpdates = {};
        
        Object.keys(updates).forEach(key => {
            if (allowedFields.includes(key)) {
                filteredUpdates[key] = updates[key];
            }
        });

        // Update user
        users[userIndex] = {
            ...users[userIndex],
            ...filteredUpdates,
            lastModified: new Date().toISOString(),
            version: users[userIndex].version + 1
        };

        this.saveUsers(users);

        this.logActivity(userId, 'PROFILE_UPDATED', {
            updatedFields: Object.keys(filteredUpdates)
        });

        return {
            success: true,
            message: 'Profile updated successfully',
            code: 'PROFILE_UPDATED',
            user: this.sanitizeUser(users[userIndex])
        };
    }

    /**
     * Change password
     */
    changePassword(userId, oldPassword, newPassword) {
        const users = this.getAllUsers();
        const user = users.find(u => u.userId === userId);

        if (!user) {
            return {
                success: false,
                message: 'User not found',
                code: 'USER_NOT_FOUND'
            };
        }

        // Verify old password
        if (!this.verifyPassword(oldPassword, user.password)) {
            this.logActivity(userId, 'PASSWORD_CHANGE_FAILED', {
                reason: 'Invalid old password'
            });
            
            return {
                success: false,
                message: 'Current password is incorrect',
                code: 'INVALID_PASSWORD'
            };
        }

        // Validate new password
        if (newPassword.length < 6) {
            return {
                success: false,
                message: 'New password must be at least 6 characters',
                code: 'WEAK_PASSWORD'
            };
        }

        // Update password
        user.password = this.hashPassword(newPassword);
        user.lastPasswordChange = new Date().toISOString();
        user.lastModified = new Date().toISOString();

        this.saveUsers(users);

        this.logActivity(userId, 'PASSWORD_CHANGED', {
            changeTime: user.lastPasswordChange
        });

        return {
            success: true,
            message: 'Password changed successfully',
            code: 'PASSWORD_CHANGED'
        };
    }

    /**
     * Delete user account
     */
    deleteUser(userId) {
        const users = this.getAllUsers();
        const userIndex = users.findIndex(u => u.userId === userId);

        if (userIndex === -1) {
            return {
                success: false,
                message: 'User not found',
                code: 'USER_NOT_FOUND'
            };
        }

        const user = users[userIndex];
        
        this.logActivity(userId, 'ACCOUNT_DELETED', {
            email: user.email,
            deleteTime: new Date().toISOString()
        });

        users.splice(userIndex, 1);
        this.saveUsers(users);

        return {
            success: true,
            message: 'Account deleted successfully',
            code: 'ACCOUNT_DELETED'
        };
    }

    /**
     * Get all users (admin only)
     */
    getAllUsers() {
        const usersData = localStorage.getItem(this.storageKey);
        return usersData ? JSON.parse(usersData) : [];
    }

    /**
     * Save users to storage
     */
    saveUsers(users) {
        localStorage.setItem(this.storageKey, JSON.stringify(users));
    }

    /**
     * Get user by ID
     */
    getUserById(userId) {
        const users = this.getAllUsers();
        const user = users.find(u => u.userId === userId);
        return user ? this.sanitizeUser(user) : null;
    }

    /**
     * Get user by email
     */
    getUserByEmail(email) {
        const users = this.getAllUsers();
        const user = users.find(u => u.email === email.toLowerCase().trim());
        return user ? this.sanitizeUser(user) : null;
    }

    /**
     * Remove sensitive data from user object
     */
    sanitizeUser(user) {
        const { password, ...sanitized } = user;
        return sanitized;
    }

    /**
     * Validate email format
     */
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Log user activity
     */
    logActivity(userId, action, details = {}) {
        const activityLog = {
            logId: this.generateUserId(),
            userId: userId,
            action: action,
            details: details,
            timestamp: new Date().toISOString(),
            ipAddress: 'demo', // In production, get real IP
            userAgent: navigator.userAgent
        };

        // Store in activity log
        const logs = this.getActivityLogs();
        logs.push(activityLog);
        
        // Keep only last 1000 logs
        if (logs.length > 1000) {
            logs.shift();
        }
        
        localStorage.setItem('smartEnergy_activityLogs', JSON.stringify(logs));

        console.log(`📝 Activity: ${action}`, details);
    }

    /**
     * Get activity logs
     */
    getActivityLogs(userId = null, limit = 100) {
        const logsData = localStorage.getItem('smartEnergy_activityLogs');
        let logs = logsData ? JSON.parse(logsData) : [];

        if (userId) {
            logs = logs.filter(log => log.userId === userId);
        }

        return logs.slice(-limit);
    }

    /**
     * Cleanup expired sessions
     */
    cleanupExpiredSessions() {
        const session = this.getCurrentSession();
        if (!session) {
            this.destroySession();
        }
    }

    /**
     * Get user statistics
     */
    getUserStats(userId) {
        const user = this.getAllUsers().find(u => u.userId === userId);
        if (!user) return null;

        const logs = this.getActivityLogs(userId);

        return {
            userId: user.userId,
            email: user.email,
            accountAge: this.getAccountAge(user.signupDate),
            totalLogins: user.totalLogins,
            failedLoginAttempts: user.failedLoginAttempts,
            lastLogin: user.lastLogin,
            accountStatus: user.accountStatus,
            activityCount: logs.length,
            recentActivity: logs.slice(-10)
        };
    }

    /**
     * Calculate account age
     */
    getAccountAge(signupDate) {
        const now = new Date();
        const signup = new Date(signupDate);
        const diffTime = Math.abs(now - signup);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return `${diffDays} days`;
    }

    /**
     * Export user data (GDPR compliance)
     */
    exportUserData(userId) {
        const user = this.getAllUsers().find(u => u.userId === userId);
        if (!user) return null;

        const logs = this.getActivityLogs(userId);
        const stats = this.getUserStats(userId);

        return {
            user: this.sanitizeUser(user),
            activityLogs: logs,
            statistics: stats,
            exportDate: new Date().toISOString()
        };
    }

    /**
     * Reset all data (for testing)
     */
    resetSystem() {
        localStorage.removeItem(this.storageKey);
        localStorage.removeItem(this.sessionKey);
        localStorage.removeItem('smartEnergy_activityLogs');
        this.initializeSystem();
        console.log('🔄 System reset complete');
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UserAuthenticationSystem;
}
