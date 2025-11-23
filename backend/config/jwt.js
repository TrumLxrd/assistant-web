require('dotenv').config();

module.exports = {
    secret: process.env.JWT_SECRET || 'your-secret-key-please-change',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
};
