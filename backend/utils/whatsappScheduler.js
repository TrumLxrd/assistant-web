const { generateWhatsAppRecordsForDate } = require('../controllers/activityController');
const moment = require('moment-timezone');
const { getCurrentEgyptTime } = require('./timezone');
const { logError } = require('./errorLogger');

/**
 * Generate WhatsApp records for today only
 * This function is called by the cron job daily
 * It generates records for today's date based on the day of week schedule
 */
const generateDailyWhatsAppRecords = async () => {
    try {
        const now = getCurrentEgyptTime();
        const today = moment.tz(now, 'Africa/Cairo').startOf('day');

        // Generate records for today only (day by day)
        await generateWhatsAppRecordsForDate(today.toDate());

        console.log('✅ WhatsApp records generated for today');
        return true;
    } catch (error) {
        console.error('❌ Error generating WhatsApp records:', error);
        await logError(error, { action: 'WHATSAPP_SCHEDULER_CRON' });
        return false;
    }
};

/**
 * Initialize the WhatsApp scheduler cron job
 * This should be called after database connection is established
 */
const initializeWhatsAppScheduler = (cron) => {
    // Run daily at 1 AM Egypt time
    // Cron format: minute hour day month dayOfWeek
    // Using timezone option to run in Egypt timezone
    const cronJob = cron.schedule('0 1 * * *', async () => {
        console.log('🕐 Running WhatsApp scheduler cron job...');
        await generateDailyWhatsAppRecords();
    }, {
        scheduled: true,
        timezone: 'Africa/Cairo'
    });

    console.log('✅ WhatsApp scheduler initialized (runs daily at 1 AM Egypt time)');
    return cronJob;
};

module.exports = {
    generateDailyWhatsAppRecords,
    initializeWhatsAppScheduler
};

