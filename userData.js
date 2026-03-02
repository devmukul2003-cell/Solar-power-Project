// Smart Energy Dashboard - User Data Management
// Dynamic dataset with proper session handling

class UserDataManager {
    constructor() {
        this.storageKey = 'smartEnergyUsers';
        this.currentUserKey = 'currentUser';
        this.initializeStorage();
    }

    initializeStorage() {
        if (!localStorage.getItem(this.storageKey)) {
            const initialUsers = [
                {
                    userId: "demo@energy.com",
                    password: "demo123",
                    sessionStatus: "logged_out",
                    lastLogin: null,
                    signupDate: "2024-01-15T10:30:00Z",
                    energyData: {
                        currentUsage: 3.2,
                        monthlyUsage: 450,
                        cost: 67.50
                    }
                }
            ];
            localStorage.setItem(this.storageKey, JSON.stringify(initialUsers));
        }
    }

    getAllUsers() {
        return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
    }

    saveUsers(users) {
        localStorage.setItem(this.storageKey, JSON.stringify(users));
    }

    findUser(userId) {
        const users = this.getAllUsers();
        return users.find(user => user.userId === userId);
    }

    // LOGIN FLOW
    login(userId, password) {
        const users = this.getAllUsers();
        const userIndex = users.findIndex(u => u.userId === userId);

        if (userIndex === -1) {
            return { success: false, message: "User not found" };
        }

        const user = users[userIndex];
        
        if (user.password !== password) {
            return { success: false, message: "Invalid password" };
        }

        // Update session status and last login timestamp
        users[userIndex].sessionStatus = "logged_in";
        users[userIndex].lastLogin = new Date().toISOString();
        
        this.saveUsers(users);
        
        // Set current user session
        const userSession = {
            userId: user.userId,
            sessionStatus: "logged_in",
            lastLogin: users[userIndex].lastLogin
        };
        localStorage.setItem(this.currentUserKey, JSON.stringify(userSession));

        return { 
            success: true, 
            message: "Login successful",
            user: users[userIndex]
        };
    }

    // SIGNUP FLOW
    signup(userId, password) {
        const users = this.getAllUsers();
        
        // Check if user already exists
        if (users.some(u => u.userId === userId)) {
            return { success: false, message: "User already exists" };
        }

        // Create new user with logged_out status
        const newUser = {
            userId: userId,
            password: password,
            sessionStatus: "logged_out",
            lastLogin: null,
            signupDate: new Date().toISOString(),
            energyData: {
                currentUsage: 0,
                monthlyUsage: 0,
                cost: 0
            }
        };

        users.push(newUser);
        this.saveUsers(users);

        return { 
            success: true, 
            message: "Signup successful. Please log in.",
            user: newUser
        };
    }

    // LOGOUT FLOW
    logout() {
        const currentUser = this.getCurrentUser();
        
        if (!currentUser) {
            return { success: false, message: "No active session" };
        }

        const users = this.getAllUsers();
        const userIndex = users.findIndex(u => u.userId === currentUser.userId);

        if (userIndex !== -1) {
            // Set session status to logged_out
            users[userIndex].sessionStatus = "logged_out";
            this.saveUsers(users);
        }

        // Clear current user session
        localStorage.removeItem(this.currentUserKey);

        return { 
            success: true, 
            message: "Logged out successfully"
        };
    }

    getCurrentUser() {
        const session = localStorage.getItem(this.currentUserKey);
        return session ? JSON.parse(session) : null;
    }

    isUserLoggedIn() {
        const currentUser = this.getCurrentUser();
        return currentUser && currentUser.sessionStatus === "logged_in";
    }

    getUserEnergyData(userId) {
        const user = this.findUser(userId);
        return user ? user.energyData : null;
    }

    updateEnergyData(userId, energyData) {
        const users = this.getAllUsers();
        const userIndex = users.findIndex(u => u.userId === userId);

        if (userIndex !== -1) {
            users[userIndex].energyData = { ...users[userIndex].energyData, ...energyData };
            this.saveUsers(users);
            return { success: true };
        }

        return { success: false, message: "User not found" };
    }

    // Export dataset as JSON
    exportDataset() {
        return {
            users: this.getAllUsers(),
            exportDate: new Date().toISOString()
        };
    }
}

// Initialize global instance
const userDataManager = new UserDataManager();
