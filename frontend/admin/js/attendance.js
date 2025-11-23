// Attendance Reports JavaScript

// Check authentication
const user = window.api.getUser();
if (!window.api.isAuthenticated() || !user || user.role !== 'admin') {
    window.location.href = 'index.html';
}

// Display user info
document.getElementById('user-name').textContent = user.name;
document.getElementById('user-avatar').textContent = user.name.charAt(0).toUpperCase();

// Logout
document.getElementById('logout-btn').addEventListener('click', () => {
    if (confirm('Are you sure you want to logout?')) {
        window.api.removeToken();
        window.location.href = 'index.html';
    }
});

let allAttendanceRecords = [];
let filteredRecords = [];

// Alert function
function showAlert(message, type = 'success') {
    const alertContainer = document.getElementById('alert-container');
    const alertClass = type === 'success' ? 'alert-success' : 'alert-error';
    alertContainer.innerHTML = `<div class="alert ${alertClass}">${message}</div>`;
    setTimeout(() => {
        alertContainer.innerHTML = '';
    }, 5000);
}

// Load centers and assistants for filter dropdowns
async function loadFilters() {
    try {
        const [centersResponse, assistantsResponse] = await Promise.all([
            window.api.makeRequest('GET', '/centers'),
            window.api.makeRequest('GET', '/admin/users')
        ]);

        if (centersResponse.success) {
            const centerSelect = document.getElementById('filter-center');
            centerSelect.innerHTML = '<option value="">All Centers</option>' +
                centersResponse.data.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
        }

        if (assistantsResponse.success) {
            const assistantSelect = document.getElementById('filter-assistant');
            const assistants = assistantsResponse.data.filter(u => u.role === 'assistant');
            assistantSelect.innerHTML = '<option value="">All Assistants</option>' +
                assistants.map(a => `<option value="${a.id}">${a.name}</option>`).join('');
        }
    } catch (error) {
        console.error('Error loading filters:', error);
    }
}

// Load all attendance records
async function loadAttendance() {
    try {
        const response = await window.api.makeRequest('GET', '/admin/attendance');

        if (response.success) {
            allAttendanceRecords = response.data;
            filteredRecords = [...allAttendanceRecords];
            displayAttendance(filteredRecords);
        }
    } catch (error) {
        console.error('Error loading attendance:', error);
        showAlert('Failed to load attendance records', 'error');
    }
}

// Display attendance in table
function displayAttendance(records) {
    const tbody = document.getElementById('attendance-table');

    if (!records || records.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center">No attendance records found.</td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = records.map(record => {
        const attendanceDate = new Date(record.time_recorded).toLocaleDateString();
        const attendanceTime = new Date(record.time_recorded).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        const delayMinutes = record.delay_minutes || 0;
        const delayBadge = delayMinutes > 0
            ? `<span class="badge badge-warning">+${delayMinutes} min</span>`
            : '<span class="badge badge-success">On Time</span>';

        const statusBadge = delayMinutes === 0
            ? '<span class="badge badge-success">On Time</span>'
            : '<span class="badge badge-warning">Late</span>';

        return `
            <tr>
                <td><strong>${record.assistant_name || 'Unknown'}</strong></td>
                <td>${record.subject || 'N/A'}</td>
                <td>${record.center_name || 'Unknown'}</td>
                <td>${attendanceDate}</td>
                <td>${attendanceTime}</td>
                <td>${statusBadge}</td>
                <td>${delayBadge}</td>
            </tr>
        `;
    }).join('');
}

// Apply filters
function applyFilters() {
    const dateFrom = document.getElementById('filter-date-from').value;
    const dateTo = document.getElementById('filter-date-to').value;
    const centerId = document.getElementById('filter-center').value;
    const assistantId = document.getElementById('filter-assistant').value;

    filteredRecords = allAttendanceRecords.filter(record => {
        const recordDate = new Date(record.time_recorded).toISOString().split('T')[0];

        if (dateFrom && recordDate < dateFrom) return false;
        if (dateTo && recordDate > dateTo) return false;
        if (centerId && record.center_id != centerId) return false;
        if (assistantId && record.assistant_id != assistantId) return false;

        return true;
    });

    displayAttendance(filteredRecords);
    showAlert(`Filtered to ${filteredRecords.length} records`);
}

// Reset filters
function resetFilters() {
    document.getElementById('filter-date-from').value = '';
    document.getElementById('filter-date-to').value = '';
    document.getElementById('filter-center').value = '';
    document.getElementById('filter-assistant').value = '';

    filteredRecords = [...allAttendanceRecords];
    displayAttendance(filteredRecords);
    showAlert('Filters reset');
}

// Export to CSV
function exportToCSV() {
    if (filteredRecords.length === 0) {
        showAlert('No records to export', 'error');
        return;
    }

    const headers = ['Assistant', 'Session', 'Center', 'Date', 'Time', 'Status', 'Delay (minutes)'];
    const rows = filteredRecords.map(record => {
        const attendanceDate = new Date(record.time_recorded).toLocaleDateString();
        const attendanceTime = new Date(record.time_recorded).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        return [
            record.assistant_name || 'Unknown',
            record.subject || 'N/A',
            record.center_name || 'Unknown',
            attendanceDate,
            attendanceTime,
            record.delay_minutes === 0 ? 'On Time' : 'Late',
            record.delay_minutes || 0
        ];
    });

    let csvContent = headers.join(',') + '\n';
    rows.forEach(row => {
        csvContent += row.map(cell => `"${cell}"`).join(',') + '\n';
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `attendance_report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showAlert('Attendance report exported successfully');
}

// Event listeners
document.getElementById('apply-filters-btn').addEventListener('click', applyFilters);
document.getElementById('reset-filters-btn').addEventListener('click', resetFilters);
document.getElementById('export-btn').addEventListener('click', exportToCSV);

// Initialize
loadFilters();
loadAttendance();
