const db = require('../config/database');
const { calculateDistance } = require('../utils/haversine');

/**
 * Record attendance with GPS validation
 * POST /api/attendance/record
 */
const recordAttendance = async (req, res) => {
    try {
        const { session_id, latitude, longitude } = req.body;
        const assistantId = req.user.id;

        // Validation
        if (!session_id || !latitude || !longitude) {
            return res.status(400).json({
                success: false,
                message: 'Session ID, latitude, and longitude are required'
            });
        }

        // Get session details
        const [sessions] = await db.query(
            `SELECT 
        s.id,
        s.assistant_id,
        s.center_id,
        s.subject,
        s.date,
        s.start_time,
        c.latitude as center_lat,
        c.longitude as center_lng,
        c.radius_m,
        c.name as center_name
      FROM sessions s
      JOIN centers c ON s.center_id = c.id
      WHERE s.id = ?`,
            [session_id]
        );

        if (sessions.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Session not found'
            });
        }

        const session = sessions[0];

        // Verify session belongs to assistant
        if (session.assistant_id !== assistantId) {
            return res.status(403).json({
                success: false,
                message: 'This session is not assigned to you'
            });
        }

        // Check if already attended
        const [existingAttendance] = await db.query(
            'SELECT id FROM attendance WHERE session_id = ? AND assistant_id = ?',
            [session_id, assistantId]
        );

        if (existingAttendance.length > 0) {
            return res.status(409).json({
                success: false,
                message: 'Attendance already recorded for this session'
            });
        }

        // Calculate distance from center
        const distance = calculateDistance(
            session.center_lat,
            session.center_lng,
            latitude,
            longitude
        );

        // Check if within radius
        if (distance > session.radius_m) {
            return res.status(400).json({
                success: false,
                message: `You are ${Math.round(distance)}m away from ${session.center_name}. You must be within ${session.radius_m}m to mark attendance.`,
                data: {
                    distance: Math.round(distance),
                    required_radius: session.radius_m
                }
            });
        }

        // Calculate delay
        const now = new Date();
        const sessionDate = new Date(session.date);
        const [hours, minutes] = session.start_time.split(':');
        sessionDate.setHours(parseInt(hours), parseInt(minutes), 0);

        const delayMs = now - sessionDate;
        const delayMinutes = Math.max(0, Math.floor(delayMs / 60000));

        // Record attendance
        const [result] = await db.query(
            `INSERT INTO attendance 
        (assistant_id, session_id, center_id, latitude, longitude, time_recorded, delay_minutes) 
       VALUES (?, ?, ?, ?, ?, NOW(), ?)`,
            [assistantId, session_id, session.center_id, latitude, longitude, delayMinutes]
        );

        const arrivalTime = now.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });

        res.json({
            success: true,
            message: `Attendance recorded for ${session.subject} — ${session.start_time}. Arrival time: ${arrivalTime}. ${delayMinutes > 0 ? `Delay: ${delayMinutes} minutes.` : 'No delay.'}`,
            data: {
                attendance_id: result.insertId,
                session: session.subject,
                center: session.center_name,
                arrival_time: arrivalTime,
                delay_minutes: delayMinutes,
                distance: Math.round(distance)
            }
        });

    } catch (error) {
        console.error('Record attendance error:', error);
        res.status(500).json({
            success: false,
            message: 'Error recording attendance'
        });
    }
};

/**
 * Get assistant's attendance history
 * GET /api/attendance/my-history
 */
const getMyAttendance = async (req, res) => {
    try {
        const assistantId = req.user.id;

        const [records] = await db.query(
            `SELECT 
        a.id,
        a.time_recorded,
        a.delay_minutes,
        s.subject,
        s.date,
        s.start_time,
        s.end_time,
        c.name as center_name
      FROM attendance a
      JOIN sessions s ON a.session_id = s.id
      JOIN centers c ON a.center_id = c.id
      WHERE a.assistant_id = ?
      ORDER BY a.time_recorded DESC
      LIMIT 50`,
            [assistantId]
        );

        res.json({
            success: true,
            data: records
        });

    } catch (error) {
        console.error('Get attendance error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching attendance history'
        });
    }
};

module.exports = { recordAttendance, getMyAttendance };
