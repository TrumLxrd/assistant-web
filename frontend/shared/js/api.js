// API Base URL
const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Get authentication token from localStorage
 */
function getToken() {
    return localStorage.getItem('authToken');
}

/**
 * Save authentication token to localStorage
 */
function saveToken(token) {
    localStorage.setItem('authToken', token);
}

/**
 * Remove authentication token from localStorage
 */
function removeToken() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
}

/**
 * Get user data from localStorage
 */
function getUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
}

/**
 * Save user data to localStorage
 */
function saveUser(user) {
    localStorage.setItem('user', JSON.stringify(user));
}

/**
 * Make API request with authentication
 * @param {string} method - HTTP method (GET, POST, PUT, DELETE)
 * @param {string} endpoint - API endpoint (e.g., '/sessions/today')
 * @param {object} data - Request body data (optional)
 * @returns {Promise} Response data
 */
async function makeRequest(method, endpoint, data = null) {
    const token = getToken();

    const config = {
        method,
        headers: {
            'Content-Type': 'application/json'
        }
    };

    // Add authorization header if token exists
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }

    // Add body for POST, PUT, PATCH requests
    if (data && ['POST', 'PUT', 'PATCH'].includes(method)) {
        config.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
        const result = await response.json();

        if (!response.ok) {
            // Handle unauthorized (expired token)
            if (response.status === 401 || response.status === 403) {
                removeToken();
                window.location.href = '/frontend/assistant/index.html';
            }

            throw new Error(result.message || 'Request failed');
        }

        return result;
    } catch (error) {
        console.error('API Request Error:', error);
        throw error;
    }
}

/**
 * Check if user is authenticated
 */
function isAuthenticated() {
    return getToken() !== null;
}

/**
 * Logout user
 */
function logout() {
    removeToken();
    window.location.href = '/frontend/assistant/index.html';
}

// Make functions globally available
window.api = {
    makeRequest,
    getToken,
    saveToken,
    removeToken,
    getUser,
    saveUser,
    isAuthenticated,
    logout
};
