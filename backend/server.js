const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const sessionRoutes = require('./routes/sessionRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const centerRoutes = require('./routes/centerRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || `http://localhost:${PORT}`,
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from frontend directory
app.use(express.static(path.join(__dirname, '../frontend')));

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/centers', centerRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'Attendance System API is running',
        timestamp: new Date().toISOString()
    });
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Welcome to Assistant Attendance System API',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            sessions: '/api/sessions',
            attendance: '/api/attendance',
            centers: '/api/centers',
            admin: '/api/admin'
        }
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint not found'
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Start server
app.listen(PORT, () => {
    console.log('═══════════════════════════════════════════════════════');
    console.log('  🎯 Assistant Attendance System');
    console.log('═══════════════════════════════════════════════════════');
    console.log(`  ✅ Server running on port ${PORT}`);
    console.log('');
    console.log('  📱 ASSISTANT PWA:');
    console.log(`     http://localhost:${PORT}/assistant/`);
    console.log('');
    console.log('  🔐 ADMIN DASHBOARD:');
    console.log(`     http://localhost:${PORT}/admin/`);
    console.log('');
    console.log('  🔧 API Endpoints:');
    console.log(`     http://localhost:${PORT}/api`);
    console.log('');
    console.log(`  📋 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log('═══════════════════════════════════════════════════════');
    console.log('  💡 Tip: Ctrl+Click the links above to open in browser');
    console.log('═══════════════════════════════════════════════════════');
});

module.exports = app;
