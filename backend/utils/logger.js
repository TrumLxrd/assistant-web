const fs = require('fs');
const path = require('path');

// Check if running on Vercel
const IS_VERCEL = process.env.VERCEL === '1';

// Log file location (relative to utils folder)
const LOG_FILE = path.join(__dirname, '..', 'logs', 'app.log');

// Ensure the logs directory exists ONLY if not on Vercel
if (!IS_VERCEL) {
    try {
        fs.mkdirSync(path.dirname(LOG_FILE), { recursive: true });
    } catch (err) {
        console.error('Failed to create logs directory:', err);
    }
}

function format(level, message) {
    const ts = new Date().toISOString();
    return `[${ts}] [${level}] ${message}`;
}

function info(message) {
    const logMsg = format('INFO', message);
    console.log(logMsg); // Always log to console for Vercel/Cloud logs

    if (!IS_VERCEL) {
        try {
            fs.appendFileSync(LOG_FILE, logMsg + '\n');
        } catch (e) {
            // Ignore file write errors
        }
    }
}

function error(message) {
    const logMsg = format('ERROR', message);
    console.error(logMsg); // Always log to console for Vercel/Cloud logs

    if (!IS_VERCEL) {
        try {
            fs.appendFileSync(LOG_FILE, logMsg + '\n');
        } catch (e) {
            // Ignore file write errors
        }
    }
}

module.exports = { info, error };
