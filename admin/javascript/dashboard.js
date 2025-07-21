
        // Check authentication and load dashboard
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(initializeDashboard, 1000); // Simulate loading delay
        });

        function initializeDashboard() {
            const userSession = JSON.parse(sessionStorage.getItem('userSession'));
            
            if (!userSession || !userSession.isAuthenticated) {
                showError();
                return;
            }

            loadUserInfo(userSession);
            loadDashboardData(userSession.userType);
        }

        function loadUserInfo(session) {
            document.getElementById('userName').textContent = session.username;
            document.getElementById('userType').textContent = session.userType;
            document.getElementById('userAvatar').textContent = session.username.charAt(0).toUpperCase();
        }

        function loadDashboardData(userType) {
            const dashboardTitle = document.getElementById('dashboardTitle');
            const dashboardSubtitle = document.getElementById('dashboardSubtitle');
            
            if (userType === 'admin') {
                loadAdminDashboard();
                dashboardTitle.textContent = 'Admin Dashboard';
                dashboardSubtitle.textContent = 'Manage the entire platform and monitor all activities';
            } else if (userType === 'landlord') {
                loadLandlordDashboard();
                dashboardTitle.textContent = 'Landlord Dashboard';
                dashboardSubtitle.textContent = 'Manage your properties and track tenant information';
            }

            hideLoading();
        }

        function loadAdminDashboard() {
            // Admin Stats
            const statsHtml = `
                <div class="stat-card">
                    <div class="stat-header">
                        <div class="stat-icon blue"><i class="fas fa-users"></i></div>
                    </div>
                    <div class="stat-value">1,247</div>
                    <div class="stat-label">Total Users</div>
                </div>
                <div class="stat-card">
                    <div class="stat-header">
                        <div class="stat-icon green"><i class="fas fa-building"></i></div>
                    </div>
                    <div class="stat-value">342</div>
                    <div class="stat-label">Properties Listed</div>
                </div>
                <div class="stat-card">
                    <div class="stat-header">
                        <div class="stat-icon purple"><i class="fas fa-handshake"></i></div>
                    </div>
                    <div class="stat-value">89</div>
                    <div class="stat-label">Active Bookings</div>
                </div>
                <div class="stat-card">
                    <div class="stat-header">
                        <div class="stat-icon orange"><i class="fas fa-chart-line"></i></div>
                    </div>
                    <div class="stat-value">R45,230</div>
                    <div class="stat-label">Monthly Revenue</div>
                </div>
            `;

            // Admin Actions
            const actionsHtml = `
                <a href="#" class="action-btn">
                    <i class="fas fa-user-plus"></i>
                    Add New User
                </a>
                <a href="#" class="action-btn">
                    <i class="fas fa-building"></i>
                    Manage Properties
                </a>
                <a href="#" class="action-btn secondary">
                    <i class="fas fa-chart-bar"></i>
                    View Reports
                </a>
                <a href="#" class="action-btn secondary">
                    <i class="fas fa-cog"></i>
                    System Settings
                </a>
            `;

            // Admin Activity
            const activityHtml = `
                <tr>
                    <td>2 hours ago</td>
                    <td>New property listed by John Doe</td>
                    <td><span class="status-badge status-active">Active</span></td>
                </tr>
                <tr>
                    <td>4 hours ago</td>
                    <td>User registration: jane.smith@email.com</td>
                    <td><span class="status-badge status-pending">Pending</span></td>
                </tr>
                <tr>
                    <td>6 hours ago</td>
                    <td>Payment processed for Booking #1234</td>
                    <td><span class="status-badge status-active">Completed</span></td>
                </tr>
                <tr>
                    <td>1 day ago</td>
                    <td>Property review submitted</td>
                    <td><span class="status-badge status-active">Active</span></td>
                </tr>
            `;

            document.getElementById('statsGrid').innerHTML = statsHtml;
            document.getElementById('quickActions').innerHTML = actionsHtml;
            document.getElementById('activityTableBody').innerHTML = activityHtml;
        }

        function loadLandlordDashboard() {
            // Landlord Stats
            const statsHtml = `
                <div class="stat-card">
                    <div class="stat-header">
                        <div class="stat-icon blue"><i class="fas fa-home"></i></div>
                    </div>
                    <div class="stat-value">8</div>
                    <div class="stat-label">My Properties</div>
                </div>
                <div class="stat-card">
                    <div class="stat-header">
                        <div class="stat-icon green"><i class="fas fa-users"></i></div>
                    </div>
                    <div class="stat-value">15</div>
                    <div class="stat-label">Active Tenants</div>
                </div>
                <div class="stat-card">
                    <div class="stat-header">
                        <div class="stat-icon purple"><i class="fas fa-calendar-check"></i></div>
                    </div>
                    <div class="stat-value">3</div>
                    <div class="stat-label">Pending Bookings</div>
                </div>
                <div class="stat-card">
                    <div class="stat-header">
                        <div class="stat-icon orange"><i class="fas fa-money-bill-wave"></i></div>
                    </div>
                    <div class="stat-value">R12,450</div>
                    <div class="stat-label">Monthly Income</div>
                </div>
            `;

            // Landlord Actions
            const actionsHtml = `
                <a href="#" class="action-btn">
                    <i class="fas fa-plus"></i>
                    Add New Property
                </a>
                <a href="#" class="action-btn">
                    <i class="fas fa-edit"></i>
                    Manage Listings
                </a>
                <a href="#" class="action-btn secondary">
                    <i class="fas fa-users"></i>
                    View Tenants
                </a>
                <a href="#" class="action-btn secondary">
                    <i class="fas fa-chart-pie"></i>
                    Financial Reports
                </a>
            `;

            // Landlord Activity
            const activityHtml = `
                <tr>
                    <td>1 hour ago</td>
                    <td>New booking request for Apartment 2B</td>
                    <td><span class="status-badge status-pending">Pending</span></td>
                </tr>
                <tr>
                    <td>3 hours ago</td>
                    <td>Rent payment received from tenant</td>
                    <td><span class="status-badge status-active">Completed</span></td>
                </tr>
                <tr>
                    <td>1 day ago</td>
                    <td>Property maintenance request</td>
                    <td><span class="status-badge status-pending">In Progress</span></td>
                </tr>
                <tr>
                    <td>2 days ago</td>
                    <td>New property photos uploaded</td>
                    <td><span class="status-badge status-active">Active</span></td>
                </tr>
            `;

            document.getElementById('statsGrid').innerHTML = statsHtml;
            document.getElementById('quickActions').innerHTML = actionsHtml;
            document.getElementById('activityTableBody').innerHTML = activityHtml;
        }

        function hideLoading() {
            document.getElementById('loadingState').style.display = 'none';
            document.getElementById('dashboardContent').style.display = 'block';
        }

        function showError() {
            document.getElementById('loadingState').style.display = 'none';
            document.getElementById('errorState').style.display = 'block';
        }

        // Enhanced Logout Functions
        function showLogoutModal() {
            document.getElementById('logoutModal').classList.add('show');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        }

        function hideLogoutModal() {
            document.getElementById('logoutModal').classList.remove('show');
            document.body.style.overflow = 'auto'; // Restore scrolling
        }

        function confirmLogout() {
            // Clear user session
            sessionStorage.removeItem('userSession');
            
            // Show a brief loading state on the confirm button
            const confirmBtn = document.querySelector('.modal-btn-confirm');
            const originalHTML = confirmBtn.innerHTML;
            confirmBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing Out...';
            confirmBtn.disabled = true;
            
            // Redirect after a short delay
            setTimeout(() => {
                window.location.href = '../index.html';
            }, 1000);
        }

        // Close modal when clicking outside
        document.getElementById('logoutModal').addEventListener('click', function(e) {
            if (e.target === this) {
                hideLogoutModal();
            }
        });

        // Close modal with Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && document.getElementById('logoutModal').classList.contains('show')) {
                hideLogoutModal();
            }
        });

        // Add some interactive functionality
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('action-btn')) {
                e.preventDefault();
                const action = e.target.textContent.trim();
                alert(`${action} functionality would be implemented here.`);
            }
        });
