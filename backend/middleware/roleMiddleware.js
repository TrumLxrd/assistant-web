/**
 * Middleware to check if user has required role
 * @param {string} role - Required role ('admin' or 'assistant')
 */
const checkRole = (role) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized. Please login.'
            });
        }

        if (req.user.role !== role) {
            return res.status(403).json({
                success: false,
                message: `Access denied. ${role} role required.`
            });
        }

        next();
    };
};

module.exports = checkRole;
