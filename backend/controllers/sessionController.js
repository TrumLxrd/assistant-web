const db = require('../config/database');

/**
 * Get assistant's sessions for today
 * GET /api/sessions/today
 */
const getTodaySessions = async (req, res) => {
    try {
        const assistantId = req.user.id;

        const [sessions] = await db.query(
            `SELECT 
        s.id,
        s.subject,
        s.date,
        s.start_time,
        s.end_time,
        c.id as center_id,
        c.name as center_name,
        c.latitude,
        c.longitude,
        c.radius_m,
        a.id as attendance_id
      FROM sessions s
      JOIN centers c ON s.center_id = c.id
      LEFT JOIN attendance a ON a.session_id = s.id AND a.assistant_id = ?
      WHERE s.assistant_id = ? AND s.date = CURDATE()
      ORDER BY s.start_time`,
            [assistantId, assistantId]
        );

        res.json({
            success: true,
            data: sessions.map(session => ({
                ...session,
                attended: session.attendance_id !== null
            }))
        });

    } catch (error) {
        console.error('Get sessions error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching sessions'
        });
    }
};

/**
 * Get specific session details
 * GET /api/sessions/:id
 */
const getSessionById = async (req, res) => {
    try {
        const { id } = req.params;
        const assistantId = req.user.id;

        const [sessions] = await db.query(
            `SELECT 
        s.id,
        s.subject,
        s.date,
        s.start_time,
        s.end_time,
        c.id as center_id,
        c.name as center_name,
        c.latitude,
        c.longitude,
        c.radius_m
      FROM sessions s
      JOIN centers c ON s.center_id = c.id
      WHERE s.id = ? AND s.assistant_id = ?`,
            [id, assistantId]
        );

        if (sessions.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Session not found or not assigned to you'
            });
        }

        res.json({
            success: true,
            data: sessions[0]
        });

    } catch (error) {
        console.error('Get session error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching session'
        });
    }
};

module.exports = { getTodaySessions, getSessionById };
