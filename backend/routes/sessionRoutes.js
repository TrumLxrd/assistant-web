const express = require('express');
const router = express.Router();
const { getTodaySessions, getSessionById } = require('../controllers/sessionController');
const authenticateToken = require('../middleware/authMiddleware');
const checkRole = require('../middleware/roleMiddleware');

// All routes require authentication
router.use(authenticateToken);

// GET /api/sessions/today (Assistant only)
router.get('/today', checkRole('assistant'), getTodaySessions);

// GET /api/sessions/:id (Assistant only)
router.get('/:id', checkRole('assistant'), getSessionById);

module.exports = router;
