require('dotenv').config();

module.exports = {
    secret: (process.env.JWT_SECRET || 'your-secret-key-please-change').trim(),
    expiresIn: (process.env.JWT_EXPIRES_IN || '30d').trim(),
    refreshExpiresIn: (process.env.JWT_REFRESH_EXPIRES_IN || '90d').trim()
};
