const express = require('express');
const router = express.Router();
const {
    getAllCenters,
    getCenterById,
    createCenter,
    updateCenter,
    deleteCenter
} = require('../controllers/centerController');
const authenticateToken = require('../middleware/authMiddleware');
const checkRole = require('../middleware/roleMiddleware');

// GET /api/centers (public or authenticated)
router.get('/', getAllCenters);

// GET /api/centers/:id (public or authenticated)
router.get('/:id', getCenterById);

// All other routes require admin authentication
router.use(authenticateToken);
router.use(checkRole('admin'));

// POST /api/centers (Admin only)
router.post('/', createCenter);

// PUT /api/centers/:id (Admin only)
router.put('/:id', updateCenter);

// DELETE /api/centers/:id (Admin only)
router.delete('/:id', deleteCenter);

module.exports = router;
