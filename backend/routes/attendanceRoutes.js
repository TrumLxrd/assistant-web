const express = require('express');
const router = express.Router();
const { recordAttendance, getMyAttendance } = require('../controllers/attendanceController');
const authenticateToken = require('../middleware/authMiddleware');
const checkRole = require('../middleware/roleMiddleware');

// All routes require authentication
router.use(authenticateToken);

// POST /api/attendance/record (Assistant only)
router.post('/record', checkRole('assistant'), recordAttendance);

// GET /api/attendance/my-history (Assistant only)
router.get('/my-history', checkRole('assistant'), getMyAttendance);

module.exports = router;
