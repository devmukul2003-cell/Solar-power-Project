/**
 * Simple Authentication System with Session Management
 * Handles Login, Signup, and Logout with dynamic JSON dataset
 */

class SimpleAuthSystem {
    constructor() {
        this.usersKey = 'auth_users';
        this.sessionKey = 'auth_session';
        this.initializeSystem();
    }

    /**
     * Initialize system with demo data
     */
    initializeSystem() {
        const users = this.getUsers();
        if (users.length === 0) {
            // Create demo users
            this.createDemoUsers();
        }
        console.log('✅ Authentication System Ready');
    }

    /**
     * Create demo users
     */
    createDemoUsers() {
        const demoUsers = [
            {
                userId: 'demo@energy.com',
                password: 'demo123',
                name: 'Demo User',
                location: 'Mumbai',
                solarCapacity: 5
            },
            {
                userId: 'admin@energy.com',
                password: 'admin123',
                name: 'Admin User',
                location: 'Delhi',
                solarCapacity: 10
            }
        ];

        demoUsers.forEach(user => {
            this.signup(user.userId, user.password, user.name, user.location, user.solarCapacity);
        });
    }

    /**
     * Get all users from storage
     */
    getUsers() {
        const data = localStorage.getItem(this.usersKey);
        return data ? JSON.parse(data) : [];
    }

    /**
     * Save users to storage
     */
    saveUsers(users) {
        localStorage.setItem(this.usersKey, JSON.stringify(users));
    }

    /**
     * Find user by userId (email/username)
     */
    findUser(userId) {
        const users = this.getUsers();
        return users.find(u => u.userId === userId);
    }

    /**
     * SIGNUP: Create new user account
     * Note: After signup, user remains logged_out and must login separately
     */
    signup(userId, password, name = 'User', location = 'Unknown', solarCapacity = 5) {
        const users = this.getUsers();

        // Check if user already exists
        if (this.findUser(userId)) {
            return {
                success: false,
                message: 'User ID already exists',
                code: 'USER_EXISTS'
            };
        }

        // Validate inputs
        if (!userId || !password) {
            return {
                success: false,
                message: 'User ID and password are required',
                code: 'MISSING_FIELDS'
            };
        }

        if (password.length < 6) {
            return {
                success: false,
                message: 'Password must be at least 6 characters',
                code: 'WEAK_PASSWORD'
            };
        }

        // Create new user
        const newUser = {
            userId: userId,
            password: password, // Plain text for demo (use hashing in production)
            name: name,
            location: location,
            solarCapacity: solarCapacity,
            accountStatus: 'active',
            signupDate: new Date().toISOString(),
            lastLogin: null, // No login yet
            sessionStatus: 'logged_out' // User must login after signup
        };

        // Add to users array
        users.push(newUser);
        this.saveUsers(users);

        console.log('✅ User created:', userId, '- Status: logged_out');

        return {
            success: true,
            message: 'Account created successfully. Please login.',
            code: 'SIGNUP_SUCCESS',
            user: this.sanitizeUser(newUser),
            redirectTo: 'login' // Indicate redirect to login page
        };
    }

    /**
     * LOGIN: Authenticate user and create session
     */
    login(userId, password) {
        const users = this.getUsers();
        const user = this.findUser(userId);

        // Check if user exists
        if (!user) {
            return {
                success: false,
                message: 'Invalid User ID or Password',
                code: 'INVALID_CREDENTIALS'
            };
        }

        // Check if account is active
        if (user.accountStatus !== 'active') {
            return {
                success: false,
                message: `Account is ${user.accountStatus}`,
                code: 'ACCOUNT_NOT_ACTIVE'
            };
        }

        // Verify password
        if (user.password !== password) {
            return {
                success: false,
                message: 'Invalid User ID or Password',
                code: 'INVALID_CREDENTIALS'
            };
        }

        // Update user data
        user.lastLogin = new Date().toISOString();
        user.sessionStatus = 'logged_in';

        // Save updated users
        this.saveUsers(users);

        // Create session
        const session = {
            userId: user.userId,
            name: user.name,
            location: user.location,
            solarCapacity: user.solarCapacity,
            sessionStatus: 'logged_in',
            loginTime: user.lastLogin
        };

        localStorage.setItem(this.sessionKey, JSON.stringify(session));

        console.log('✅ Login successful:', userId);

        return {
            success: true,
            message: 'Login successful',
            code: 'LOGIN_SUCCESS',
            user: this.sanitizeUser(user),
            session: session
        };
    }

    /**
     * LOGOUT: End user session
     */
    logout() {
        const session = this.getSession();

        if (session) {
            const users = this.getUsers();
            const user = this.findUser(session.userId);

            if (user) {
                // Update user session status
                user.sessionStatus = 'logged_out';
                this.saveUsers(users);
            }

            // Clear session
            localStorage.removeItem(this.sessionKey);

            console.log('✅ Logout successful:', session.userId);

            return {
                success: true,
                message: 'Logged out successfully',
                code: 'LOGOUT_SUCCESS'
            };
        }

        return {
            success: false,
            message: 'No active session',
            code: 'NO_SESSION'
        };
    }

    /**
     * Get current session
     */
    getSession() {
        const data = localStorage.getItem(this.sessionKey);
        return data ? JSON.parse(data) : null;
    }

    /**
     * Check if user is logged in
     */
    isLoggedIn() {
        const session = this.getSession();
        return session && session.sessionStatus === 'logged_in';
    }

    /**
     * Get current user data
     */
    getCurrentUser() {
        const session = this.getSession();
        if (!session) return null;

        const user = this.findUser(session.userId);
        return user ? this.sanitizeUser(user) : null;
    }

    /**
     * Remove password from user object
     */
    sanitizeUser(user) {
        const { password, ...sanitized } = user;
        return sanitized;
    }

    /**
     * Get all users (for admin/demo purposes)
     */
    getAllUsers() {
        return this.getUsers().map(u => this.sanitizeUser(u));
    }

    /**
     * Export dataset as JSON
     */
    exportJSON() {
        const users = this.getUsers();
        const session = this.getSession();

        return JSON.stringify({
            users: users,
            currentSession: session,
            exportDate: new Date().toISOString()
        }, null, 2);
    }

    /**
     * Reset system (for testing)
     */
    reset() {
        localStorage.removeItem(this.usersKey);
        localStorage.removeItem(this.sessionKey);
        this.initializeSystem();
        console.log('🔄 System reset');
    }
}

// Create global instance
const authSystem = new SimpleAuthSystem();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SimpleAuthSystem;
}
