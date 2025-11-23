// Admin Dashboard JavaScript

// Check authentication
const user = window.api.getUser();
if (!window.api.isAuthenticated() || !user || user.role !== 'admin') {
    window.location.href = 'index.html';
}

// Display user info
document.getElementById('user-name').textContent = user.name;
document.getElementById('user-avatar').textContent = user.name.charAt(0).toUpperCase();

// Display current date
const currentDateEl = document.getElementById('current-date');
const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
currentDateEl.textContent = new Date().toLocaleDateString('en-US', options);

// Logout functionality
document.getElementById('logout-btn').addEventListener('click', () => {
    if (confirm('Are you sure you want to logout?')) {
        window.api.removeToken();
        window.location.href = 'index.html';
    }
});

// Alert function
function showAlert(message, type = 'error') {
    const alertContainer = document.getElementById('alert-container');
    const alertClass = type === 'success' ? 'alert-success' : 'alert-error';
    alertContainer.innerHTML = `<div class="alert ${alertClass}">${message}</div>`;
    setTimeout(() => {
        alertContainer.innerHTML = '';
    }, 5000);
}

// Load dashboard stats
async function loadDashboardStats() {
    try {
        const response = await window.api.makeRequest('GET', '/admin/dashboard');

        if (response.success) {
            const stats = response.data;

            // Update statistics cards
            document.getElementById('total-attendance').textContent = stats.totalAttendanceToday || 0;
            document.getElementById('late-arrivals').textContent = stats.lateArrivals || 0;
            document.getElementById('active-sessions').textContent = stats.activeSessions || 0;
            document.getElementById('total-centers').textContent = stats.totalCenters || 0;

            // Load recent attendance
            loadRecentAttendance(stats.recentAttendance || []);
        }
    } catch (error) {
        console.error('Error loading dashboard:', error);
        showAlert('Failed to load dashboard data');
    }
}

// Load recent attendance
function loadRecentAttendance(attendanceRecords) {
    const tbody = document.getElementById('recent-attendance');

    if (!attendanceRecords || attendanceRecords.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center">No attendance records for today</td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = attendanceRecords.map(record => {
        const isLate = record.delay_minutes > 0;
        const statusClass = isLate ? 'late' : 'on-time';
        const statusText = isLate ? `Late ${record.delay_minutes} min` : 'On Time';

        // Format time
        const time = new Date(record.time_recorded).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });

        return `
            <tr>
                <td>${record.assistant_name || 'N/A'}</td>
                <td>${record.subject || 'N/A'}</td>
                <td>${record.center_name || 'N/A'}</td>
                <td>${time}</td>
                <td>
                    <span class="status-badge ${statusClass}">
                        <span class="status-dot"></span>
                        ${statusText}
                    </span>
                </td>
            </tr>
        `;
    }).join('');
}

// Initialize dashboard
loadDashboardStats();

// Refresh dashboard every 30 seconds
setInterval(loadDashboardStats, 30000);
