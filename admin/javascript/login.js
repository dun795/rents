    
        // Get form elements
        const loginForm = document.getElementById('loginForm');
        const loginButton = document.getElementById('loginButton');
        const errorMessage = document.getElementById('errorMessage');
        const successMessage = document.getElementById('successMessage');
        const usernameInput = document.getElementById('username');
        const passwordInput = document.getElementById('password');
        const userTypeRadios = document.querySelectorAll('input[name="userType"]');

        // Demo credentials (In production, this should be handled server-side)
        const credentials = {
            admin: {
                username: 'admin',
                password: 'admin123',
                dashboard: 'dashboard.html'
            },
            landlord: {
                username: 'landlord',
                password: 'landlord123',
                dashboard: 'dashboard.html'
            }
        };

        // Hide messages function
        function hideMessages() {
            errorMessage.style.display = 'none';
            successMessage.style.display = 'none';
        }

        // Show error message
        function showError(message) {
            hideMessages();
            document.getElementById('errorText').textContent = message;
            errorMessage.style.display = 'block';
        }

        // Show success message
        function showSuccess(message) {
            hideMessages();
            document.getElementById('successText').textContent = message;
            successMessage.style.display = 'block';
        }

        // Add loading state to button
        function setLoadingState(loading) {
            if (loading) {
                loginButton.classList.add('loading');
                loginButton.textContent = '';
            } else {
                loginButton.classList.remove('loading');
                loginButton.textContent = 'Sign In';
            }
        }

        // Handle form submission
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            hideMessages();

            const username = usernameInput.value.trim();
            const password = passwordInput.value.trim();
            const selectedUserType = document.querySelector('input[name="userType"]:checked').value;

            // Basic validation
            if (!username || !password) {
                showError('Please fill in all required fields');
                return;
            }

            // Set loading state
            setLoadingState(true);

            // Simulate API call delay
            setTimeout(() => {
                // Check credentials
                const userCreds = credentials[selectedUserType];
                
                if (username === userCreds.username && password === userCreds.password) {
                    // Success
                    showSuccess('Login successful! Redirecting to dashboard...');
                    
                    // Store user session data for the dashboard
                    sessionStorage.setItem('userSession', JSON.stringify({
                        username: username,
                        userType: selectedUserType,
                        loginTime: new Date().toISOString(),
                        isAuthenticated: true
                    }));
                    
                    // Redirect after short delay
                    setTimeout(() => {
                        window.location.href = userCreds.dashboard;
                    }, 1500);
                } else {
                    // Error
                    showError('Invalid username or password. Please try again.');
                    setLoadingState(false);
                }
            }, 1000);
        });

        // Handle forgot password
        document.getElementById('forgotPasswordLink').addEventListener('click', function(e) {
            e.preventDefault();
            alert('Password reset functionality would be implemented here.\n\nFor demo purposes:\nAdmin - username: admin, password: admin123\nLandlord - username: landlord, password: landlord123');
        });

        // Clear messages when user starts typing
        usernameInput.addEventListener('input', hideMessages);
        passwordInput.addEventListener('input', hideMessages);
        userTypeRadios.forEach(radio => {
            radio.addEventListener('change', hideMessages);
        });

        // Add enter key support
        document.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !loginButton.classList.contains('loading')) {
                loginForm.dispatchEvent(new Event('submit'));
            }
        });

        // Focus username field on page load
        window.addEventListener('load', function() {
            usernameInput.focus();
        });
    