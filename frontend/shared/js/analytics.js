// Vercel Analytics Integration
// This file provides a centralized way to initialize Vercel Analytics across all pages

/**
 * Initialize Vercel Analytics
 */
function initVercelAnalytics() {
    // Load the analytics script dynamically
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@vercel/analytics@1.6.1/dist/index.min.js';
    script.async = true;

    script.onload = function() {
        try {
            // Use the inject function from the loaded script
            if (window.VercelAnalytics && window.VercelAnalytics.inject) {
                window.VercelAnalytics.inject();

                // Track initial page view
                if (window.VercelAnalytics.track) {
                    window.VercelAnalytics.track('page_view', {
                        page: window.location.pathname,
                        timestamp: new Date().toISOString()
                    });
                }

                console.log('Vercel Analytics initialized');
            }
        } catch (error) {
            console.warn('Failed to initialize Vercel Analytics:', error);
        }
    };

    script.onerror = function() {
        console.warn('Failed to load Vercel Analytics script');
    };

    document.head.appendChild(script);
}

/**
 * Track custom events
 * @param {string} eventName - Name of the event
 * @param {object} properties - Additional properties to track
 */
function trackEvent(eventName, properties = {}) {
    if (window.VercelAnalytics && window.VercelAnalytics.track) {
        try {
            window.VercelAnalytics.track(eventName, {
                ...properties,
                timestamp: new Date().toISOString(),
                page: window.location.pathname
            });
        } catch (error) {
            console.warn('Failed to track event:', error);
        }
    }
}

/**
 * Track user interactions (login, logout, etc.)
 * @param {string} action - User action
 * @param {object} details - Additional details
 */
function trackUserAction(action, details = {}) {
    trackEvent('user_action', {
        action,
        ...details
    });
}

/**
 * Track API calls for performance monitoring
 * @param {string} endpoint - API endpoint
 * @param {string} method - HTTP method
 * @param {number} duration - Request duration in ms
 * @param {boolean} success - Whether the request was successful
 */
function trackApiCall(endpoint, method, duration, success) {
    trackEvent('api_call', {
        endpoint,
        method,
        duration,
        success
    });
}

// Auto-initialize analytics when this script loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initVercelAnalytics);
} else {
    initVercelAnalytics();
}

// Make functions globally available
window.Analytics = {
    trackEvent,
    trackUserAction,
    trackApiCall
};
