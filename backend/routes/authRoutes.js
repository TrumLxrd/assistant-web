const express = require('express');
const router = express.Router();
const { login, register } = require('../controllers/authController');

// POST /api/auth/login
router.post('/login', login);

// POST /api/auth/register (for testing - should be admin-only in production)
router.post('/register', register);

module.exports = router;
