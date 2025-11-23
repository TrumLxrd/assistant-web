const db = require('../config/database');

/**
 * Get all centers
 * GET /api/centers
 */
const getAllCenters = async (req, res) => {
    try {
        const [centers] = await db.query(
            'SELECT id, name, latitude, longitude, radius_m, address, created_at FROM centers ORDER BY name'
        );

        res.json({
            success: true,
            data: centers
        });
    } catch (error) {
        console.error('Get centers error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching centers'
        });
    }
};

/**
 * Create new center (Admin only)
 * POST /api/centers
 */
const createCenter = async (req, res) => {
    try {
        const { name, latitude, longitude, radius_m = 30, address } = req.body;

        if (!name || !latitude || !longitude) {
            return res.status(400).json({
                success: false,
                message: 'Name, latitude, and longitude are required'
            });
        }

        const [result] = await db.query(
            'INSERT INTO centers (name, latitude, longitude, radius_m, address) VALUES (?, ?, ?, ?, ?)',
            [name, latitude, longitude, radius_m, address]
        );

        res.status(201).json({
            success: true,
            message: 'Center created successfully',
            data: {
                id: result.insertId,
                name,
                latitude,
                longitude,
                radius_m,
                address
            }
        });
    } catch (error) {
        console.error('Create center error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating center'
        });
    }
};

/**
 * Update center (Admin only)
 * PUT /api/centers/:id
 */
const updateCenter = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, latitude, longitude, radius_m, address } = req.body;

        const [result] = await db.query(
            `UPDATE centers 
       SET name = COALESCE(?, name),
           latitude = COALESCE(?, latitude),
           longitude = COALESCE(?, longitude),
           radius_m = COALESCE(?, radius_m),
           address = COALESCE(?, address)
       WHERE id = ?`,
            [name, latitude, longitude, radius_m, address, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Center not found'
            });
        }

        res.json({
            success: true,
            message: 'Center updated successfully'
        });
    } catch (error) {
        console.error('Update center error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating center'
        });
    }
};

/**
 * Get single center by ID
 * GET /api/centers/:id
 */
const getCenterById = async (req, res) => {
    try {
        const { id } = req.params;

        const [centers] = await db.query(
            'SELECT id, name, latitude, longitude, radius_m, address, created_at FROM centers WHERE id = ?',
            [id]
        );

        if (centers.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Center not found'
            });
        }

        res.json({
            success: true,
            data: centers[0]
        });
    } catch (error) {
        console.error('Get center error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching center'
        });
    }
};

/**
 * Delete center (Admin only)
 * DELETE /api/centers/:id
 */
const deleteCenter = async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await db.query('DELETE FROM centers WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Center not found'
            });
        }

        res.json({
            success: true,
            message: 'Center deleted successfully'
        });
    } catch (error) {
        console.error('Delete center error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting center'
        });
    }
};

module.exports = {
    getAllCenters,
    getCenterById,
    createCenter,
    updateCenter,
    deleteCenter
};
