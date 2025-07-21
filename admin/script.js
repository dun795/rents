// Admin credentials (in production, these should be stored securely)
const demoAccounts = {
    "admin1": "admin123",
    "admin2": "pass456",
    "admin3": "test789",
    "admin4": "secure101",
    "admin5": "access202",
    "admin6": "login303",
    "admin7": "portal404",
    "admin8": "system505",
    "admin9": "verify606",
    "admin10": "check707"
};

// Auth State
let currentAdmin = null;

// Initialize Firebase and auth state handling
auth.onAuthStateChanged((user) => {
    const loginSection = document.getElementById('loginSection');
    const dashboardSection = document.getElementById('dashboardSection');

    if (currentAdmin || user) {
        loginSection?.classList.add('hidden');
        dashboardSection?.classList.remove('hidden');
        initializeDashboard();
    } else {
        loginSection?.classList.remove('hidden');
        dashboardSection?.classList.add('hidden');
    }
});

// Sidebar Toggle
document.getElementById('sidebarToggle')?.addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('active');
});

// Initialize Dashboard
function initializeDashboard() {
    initializeCharts();
    loadRecentActivity();
    setupEventListeners();
    loadRooms(); // Call loadRooms here after successful authentication
}

// Initialize Charts
function initializeCharts() {
    // Occupancy Chart
    const occupancyCtx = document.getElementById('occupancyChart')?.getContext('2d');
    if (occupancyCtx) {
        new Chart(occupancyCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Occupancy Rate (%)',
                    data: [85, 88, 87, 90, 92, 91],
                    borderColor: '#1e90ff',
                    tension: 0.4,
                    fill: true,
                    backgroundColor: 'rgba(30, 144, 255, 0.1)'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100
                    }
                }
            }
        });
    }

    // Revenue Chart
    const revenueCtx = document.getElementById('revenueChart')?.getContext('2d');
    if (revenueCtx) {
        new Chart(revenueCtx, {
            type: 'bar',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Revenue (R)',
                    data: [350000, 380000, 420000, 390000, 458920, 470000],
                    backgroundColor: '#43a047'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }
}

// Load Recent Activity
async function loadRecentActivity() {
    try {
        const snapshot = await db.collection('activity').orderBy('timestamp', 'desc').limit(5).get();
        const activityList = document.querySelector('.activity-list');

        if (activityList) {
            activityList.innerHTML = '';
            snapshot.forEach(doc => {
                const activity = doc.data();
                const timeAgo = getTimeAgo(activity.timestamp.toDate());

                const activityItem = document.createElement('div');
                activityItem.className = 'activity-item';
                activityItem.innerHTML = `
                    <div class="activity-icon">
                        <i class="fas ${getActivityIcon(activity.type)}"></i>
                    </div>
                    <div class="activity-details">
                        <p>${activity.description}</p>
                        <span>${timeAgo}</span>
                    </div>
                `;
                activityList.appendChild(activityItem);
            });
        }
    } catch (error) {
        console.error('Error loading activity:', error);
    }
}

// Utility Functions
function getActivityIcon(type) {
    const icons = {
        'payment': 'fa-money-bill',
        'maintenance': 'fa-tools',
        'tenant': 'fa-user',
        'booking': 'fa-calendar-check',
        'default': 'fa-info-circle'
    };
    return icons[type] || icons.default;
}

function getTimeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    const intervals = {
        year: 31536000,
        month: 2592000,
        week: 604800,
        day: 86400,
        hour: 3600,
        minute: 60
    };

    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
        const interval = Math.floor(seconds / secondsInUnit);
        if (interval >= 1) {
            return `${interval} ${unit}${interval === 1 ? '' : 's'} ago`;
        }
    }
    return 'Just now';
}

// Setup Event Listeners
function setupEventListeners() {
    // Task Checkboxes
    document.querySelectorAll('.task-item input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', async (e) => {
            const taskId = e.target.id;
            const isCompleted = e.target.checked;
            try {
                await db.collection('tasks').doc(taskId).update({
                    completed: isCompleted
                });
            } catch (error) {
                console.error('Error updating task:', error);
                e.target.checked = !isCompleted;
            }
        });
    });

    // Notifications
    document.querySelector('.notifications')?.addEventListener('click', () => {
        // Implement notifications panel
        console.log('Notifications clicked');
    });

    // User Profile
    document.querySelector('.user-profile')?.addEventListener('click', () => {
        // Implement profile menu
        console.log('Profile clicked');
    });
}


// Login handler with enhanced security
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('adminUsername').value;
    const password = document.getElementById('adminPassword').value;

    try {
        if (demoAccounts[username] && demoAccounts[username] === password) {
            currentAdmin = username;
            sessionStorage.setItem('adminUser', username); // Use sessionStorage instead of localStorage

            // Show dashboard and hide login
            const loginSection = document.getElementById('loginSection');
            const dashboardSection = document.getElementById('dashboardSection');

            if (loginSection && dashboardSection) {
                loginSection.style.display = 'none';
                dashboardSection.style.display = 'block';
                //loadRooms(); // Load the rooms data - moved to initializeDashboard
            } else {
                throw new Error('Dashboard elements not found');
            }
        } else {
            throw new Error('Invalid credentials');
        }
    } catch (error) {
        alert('Login failed: ' + error.message);
    }
});

// Logout with proper cleanup
document.getElementById('logoutBtn').addEventListener('click', async () => {
    try {
        await auth.signOut();
        currentAdmin = null;
        sessionStorage.removeItem('adminUser');

        // Redirect to home page
        window.location.href = '../index.html';
    } catch (error) {
        console.error('Error signing out:', error);
    }
});

// Page Navigation
document.querySelectorAll('.dashboard-nav a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetPage = e.target.dataset.page;

        // Update active state
        document.querySelectorAll('.dashboard-nav a').forEach(a => a.classList.remove('active'));
        e.target.classList.add('active');

        // Show target page, hide others
        document.querySelectorAll('.dashboard-page').forEach(page => {
            page.classList.add('hidden');
        });
        document.getElementById(targetPage).classList.remove('hidden');
    });
});

// Loading indicator functions
function showLoading() {
    document.querySelector('.loading-overlay').style.display = 'flex';
}

function hideLoading() {
    document.querySelector('.loading-overlay').style.display = 'none';
}

// Add Room
document.getElementById('addRoomForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!currentAdmin) {
        alert('Please login first');
        window.location.href = 'index.html';
        return;
    }

    showLoading();

    const form = e.target;

    // Get form values
    const title = form.roomTitle.value;
    const location = form.location.value;
    const price = Number(form.price.value);
    const size = Number(form.size.value);
    const availableDate = form.availableDate.value;
    const imageFile = form.roomImage.files[0];

    // Get selected amenities
    const amenities = Array.from(form.querySelectorAll('input[type="checkbox"]:checked'))
        .map(checkbox => checkbox.value);

    try {
        // Upload image
        const imageRef = storage.ref(`rooms/${Date.now()}_${imageFile.name}`);
        const snapshot = await imageRef.put(imageFile);
        const imageUrl = await snapshot.ref.getDownloadURL();

        // Add room to Firestore
        await db.collection('rooms').add({
            title,
            location,
            price,
            size,
            availableDate,
            amenities,
            imageUrl,
            status: 'available',
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        form.reset();
        alert('Room added successfully!');
        loadRooms();
    } catch (error) {
        alert('Error adding room: ' + error.message);
    } finally {
        hideLoading();
    }
});

// Password change handler with proper validation
document.getElementById('passwordChangeForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!currentAdmin) {
        alert('Please login first');
        return;
    }

    const verificationEmail = document.getElementById('verificationEmail').value;
    const targetUsername = document.getElementById('targetUsername').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Verify admin email
    if (verificationEmail !== 'dnchats.vip@gmail.com') {
        alert('Unauthorized: Invalid admin email');
        return;
    }

    // Verify password match
    if (newPassword !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }

    // Verify username exists
    if (!demoAccounts[targetUsername]) {
        alert('Username not found');
        return;
    }

    try {
        // Update password
        demoAccounts[targetUsername] = newPassword;
        alert('Password updated successfully');
        e.target.reset();
    } catch (error) {
        alert('Error updating password: ' + error.message);
    }
});

// Check for admin session on page load
window.addEventListener('DOMContentLoaded', () => {
    const storedAdmin = sessionStorage.getItem('adminUser');
    if (!storedAdmin || !demoAccounts[storedAdmin]) {
        // No valid session, redirect to login
        const loginSection = document.getElementById('loginSection');
        const dashboardSection = document.getElementById('dashboardSection');
        if (loginSection && dashboardSection) {
            loginSection.style.display = 'block';
            dashboardSection.style.display = 'none';
        }
        return;
    }

    currentAdmin = storedAdmin;
    document.getElementById('loginSection').style.display = 'none';
    document.getElementById('dashboardSection').style.display = 'block';
    //loadRooms(); //moved to initializeDashboard
    initializeDashboard();
});

// Load Rooms
async function loadRooms() {
    if (!currentAdmin) {
        alert('Please login first');
        return;
    }

    const tableBody = document.getElementById('roomsTableBody');
    tableBody.innerHTML = '';

    try {
        const snapshot = await db.collection('rooms').orderBy('createdAt', 'desc').get();

        snapshot.forEach(doc => {
            const room = doc.data();
            const row = document.createElement('tr');

            row.innerHTML = `
                <td><img src="${room.imageUrl}" alt="${room.title}" width="50"></td>
                <td>${room.title}</td>
                <td>${room.location}</td>
                <td>R${room.price}</td>
                <td>${room.status}</td>
                <td>
                    <button onclick="editRoom('${doc.id}')">Edit</button>
                    <button onclick="deleteRoom('${doc.id}')">Delete</button>
                    <button onclick="toggleStatus('${doc.id}', '${room.status}')">
                        ${room.status === 'available' ? 'Mark Unavailable' : 'Mark Available'}
                    </button>
                </td>
            `;

            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading rooms:', error);
    }
}

// Room Management Functions
async function deleteRoom(roomId) {
    if (confirm('Are you sure you want to delete this room?')) {
        try {
            await db.collection('rooms').doc(roomId).delete();
            loadRooms();
        } catch (error) {
            alert('Error deleting room: ' + error.message);
        }
    }
}

async function toggleStatus(roomId, currentStatus) {
    const newStatus = currentStatus === 'available' ? 'unavailable' : 'available';
    try {
        await db.collection('rooms').doc(roomId).update({
            status: newStatus
        });
        loadRooms();
    } catch (error) {
        alert('Error updating status: ' + error.message);
    }
}

// Search and Filter
document.getElementById('searchRooms').addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const rows = document.querySelectorAll('#roomsTableBody tr');

    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
});