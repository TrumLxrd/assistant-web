const moment = require('moment-timezone');

/**
 * Egypt timezone utilities
 * All operations use Africa/Cairo timezone (UTC+2)
 */
const EGYPT_TIMEZONE = 'Africa/Cairo';

/**
 * Get current time in Egypt timezone
 * @returns {Date} Current Date object in Egypt time
 */
const getCurrentEgyptTime = () => {
    return moment.tz(EGYPT_TIMEZONE).toDate();
};

/**
 * Parse a date/time string as Egypt time
 * @param {string|Date} dateTime - Date/time to parse
 * @returns {Date} Date object representing the input in Egypt timezone
 */
const parseAsEgyptTime = (dateTime) => {
    if (dateTime instanceof Date) {
        // If it's already a Date, assume it's meant to be Egypt time
        return moment.tz(dateTime, EGYPT_TIMEZONE).toDate();
    }

    // Parse string as Egypt time
    return moment.tz(dateTime, EGYPT_TIMEZONE).toDate();
};

/**
 * Convert a UTC Date to Egypt time
 * @param {Date} utcDate - UTC Date object
 * @returns {Date} Date object in Egypt timezone
 */
const utcToEgyptTime = (utcDate) => {
    return moment.tz(utcDate, EGYPT_TIMEZONE).toDate();
};

/**
 * Format a date for display in Egypt time
 * @param {Date} date - Date to format
 * @param {string} format - Moment format string (default: 'YYYY-MM-DD HH:mm:ss')
 * @returns {string} Formatted date string
 */
const formatEgyptTime = (date, format = 'YYYY-MM-DD HH:mm:ss') => {
    return moment.tz(date, EGYPT_TIMEZONE).format(format);
};

/**
 * Get time difference in minutes between two dates in Egypt timezone
 * @param {Date} laterDate - Later date
 * @param {Date} earlierDate - Earlier date
 * @returns {number} Difference in minutes
 */
const getEgyptTimeDifferenceMinutes = (laterDate, earlierDate) => {
    const later = moment.tz(laterDate, EGYPT_TIMEZONE);
    const earlier = moment.tz(earlierDate, EGYPT_TIMEZONE);
    return later.diff(earlier, 'minutes');
};

/**
 * Check if current Egypt time is within a time window
 * @param {Date} startTime - Start time in Egypt timezone
 * @param {number} earlyMinutes - Minutes allowed before start
 * @param {number} lateMinutes - Minutes allowed after start
 * @returns {boolean} Whether current time is within window
 */
const isWithinEgyptTimeWindow = (startTime, earlyMinutes, lateMinutes) => {
    const now = getCurrentEgyptTime();
    const start = moment.tz(startTime, EGYPT_TIMEZONE);

    const diffMinutes = now.diff(start, 'minutes');
    return diffMinutes >= -earlyMinutes && diffMinutes <= lateMinutes;
};

module.exports = {
    EGYPT_TIMEZONE,
    getCurrentEgyptTime,
    parseAsEgyptTime,
    utcToEgyptTime,
    formatEgyptTime,
    getEgyptTimeDifferenceMinutes,
    isWithinEgyptTimeWindow
};