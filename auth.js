// auth.js - Authentication logic for Smart Energy Dashboard

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const showSignup = document.getElementById('showSignup');
    const showLogin = document.getElementById('showLogin');
    const loginSection = document.getElementById('loginSection');
    const signupSection = document.getElementById('signupSection');

    // Toggle between login and signup
    if (showSignup) {
        showSignup.addEventListener('click', function(e) {
            e.preventDefault();
            loginSection.classList.add('hidden');
            signupSection.classList.remove('hidden');
        });
    }

    if (showLogin) {
        showLogin.addEventListener('click', function(e) {
            e.preventDefault();
            signupSection.classList.add('hidden');
            loginSection.classList.remove('hidden');
        });
    }

    // Handle login
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = document.getElementById('loginEmail').value.trim();
            const password = document.getElementById('loginPassword').value;

            if (!email || !password) {
                showMessage('Please enter both email and password', 'error', loginSection);
                return;
            }

            // Check if API is loaded
            if (typeof api === 'undefined') {
                showMessage('API not loaded. Please refresh the page.', 'error', loginSection);
                console.error('API (api.js) is not loaded!');
                return;
            }

            try {
                showMessage('Logging in...', 'info', loginSection);
                
                // LOGIN FLOW: Call backend API
                const response = await api.login(email, password);
                
                console.log('Login response:', response);

                if (response.success) {
                    console.log('Token received:', response.token ? 'YES' : 'NO');
                    console.log('Token in localStorage:', localStorage.getItem('authToken') ? 'YES' : 'NO');
                    
                    // Store user info
                    localStorage.setItem('currentUser', JSON.stringify(response.user));
                    
                    // Verify token was saved
                    const savedToken = localStorage.getItem('authToken');
                    if (!savedToken) {
                        console.error('Token was not saved to localStorage!');
                        showMessage('Login error: Token not saved', 'error', loginSection);
                        return;
                    }
                    
                    console.log('Token verified in localStorage');
                    showMessage('Login successful! Redirecting...', 'success', loginSection);
                    
                    // Redirect after ensuring token is saved
                    setTimeout(() => {
                        console.log('Redirecting to dashboard...');
                        window.location.href = 'enhanced-smart-dashboard.html';
                    }, 800);
                } else {
                    showMessage(response.message || 'Login failed', 'error', loginSection);
                }
            } catch (error) {
                console.error('Login error:', error);
                showMessage(error.message || 'Cannot connect to server. Make sure backend is running.', 'error', loginSection);
            }
        });
    }

    // Handle signup
    if (signupForm) {
        signupForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = document.getElementById('signupEmail').value.trim();
            const password = document.getElementById('signupPassword').value;
            const confirmPassword = document.getElementById('signupConfirmPassword').value;
            const name = email.split('@')[0]; // Use email prefix as name

            if (!email || !password || !confirmPassword) {
                showMessage('Please fill in all fields', 'error', signupSection);
                return;
            }

            if (password !== confirmPassword) {
                showMessage('Passwords do not match', 'error', signupSection);
                return;
            }

            if (password.length < 6) {
                showMessage('Password must be at least 6 characters', 'error', signupSection);
                return;
            }

            try {
                // SIGNUP FLOW: Call backend API
                const response = await api.signup(email, password, name);

                if (response.success) {
                    showMessage('Signup successful! Please log in.', 'success', signupSection);
                    setTimeout(() => {
                        signupSection.classList.add('hidden');
                        loginSection.classList.remove('hidden');
                        signupForm.reset();
                    }, 1500);
                } else {
                    showMessage(response.message || 'Signup failed', 'error', signupSection);
                }
            } catch (error) {
                console.error('Signup error:', error);
                showMessage(error.message || 'Signup failed. Please try again.', 'error', signupSection);
            }
        });
    }

    function showMessage(message, type, section) {
        const existingMsg = section.querySelector('.auth-message');
        if (existingMsg) existingMsg.remove();

        const msgDiv = document.createElement('div');
        msgDiv.className = `auth-message ${type}`;
        msgDiv.textContent = message;
        
        const form = section.querySelector('.auth-form');
        if (form) {
            form.insertBefore(msgDiv, form.firstChild);
            setTimeout(() => msgDiv.remove(), 5000);
        }
    }
});
