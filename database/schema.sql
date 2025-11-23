-- =====================================================
-- Assistant Attendance System - MySQL Database Schema
-- =====================================================

-- Create database
CREATE DATABASE IF NOT EXISTS attendance_system;
USE attendance_system;

-- =====================================================
-- Table: users
-- Stores both admins and assistants
-- =====================================================
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'assistant') NOT NULL DEFAULT 'assistant',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Table: centers
-- Educational centers with GPS coordinates
-- =====================================================
CREATE TABLE centers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(150) NOT NULL,
    latitude DECIMAL(10, 7) NOT NULL,
    longitude DECIMAL(10, 7) NOT NULL,
    radius_m INT NOT NULL DEFAULT 30,
    address VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Table: assistants_centers
-- Many-to-many relationship: assistants can work at multiple centers
-- =====================================================
CREATE TABLE assistants_centers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    assistant_id INT NOT NULL,
    center_id INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (assistant_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (center_id) REFERENCES centers(id) ON DELETE CASCADE,
    UNIQUE KEY unique_assignment (assistant_id, center_id),
    INDEX idx_assistant (assistant_id),
    INDEX idx_center (center_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Table: sessions
-- Teaching sessions - can be one-time or weekly recurring
-- Updated: 2025-11-23 - Added recurrence support, optional assistant
-- =====================================================
CREATE TABLE sessions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    assistant_id INT NULL COMMENT 'Optional - for pre-assigned sessions',
    center_id INT NOT NULL,
    subject VARCHAR(150) NOT NULL,
    recurrence_type ENUM('one_time', 'weekly') NOT NULL DEFAULT 'one_time',
    day_of_week TINYINT NULL COMMENT '1=Monday, 7=Sunday (for weekly sessions)',
    is_active BOOLEAN NOT NULL DEFAULT TRUE COMMENT 'For deactivating recurring sessions',
    start_time DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (assistant_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (center_id) REFERENCES centers(id) ON DELETE CASCADE,
    INDEX idx_assistant_start (assistant_id, start_time),
    INDEX idx_center_start (center_id, start_time),
    INDEX idx_start_time (start_time),
    INDEX idx_recurrence (recurrence_type, is_active),
    INDEX idx_day_of_week (day_of_week)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Table: attendance
-- Records of attendance with GPS validation
-- =====================================================
CREATE TABLE attendance (
    id INT PRIMARY KEY AUTO_INCREMENT,
    assistant_id INT NOT NULL,
    session_id INT NOT NULL,
    center_id INT NOT NULL,
    latitude DECIMAL(10, 7) NOT NULL,
    longitude DECIMAL(10, 7) NOT NULL,
    time_recorded DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    delay_minutes INT NOT NULL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (assistant_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE,
    FOREIGN KEY (center_id) REFERENCES centers(id) ON DELETE CASCADE,
    UNIQUE KEY unique_attendance (assistant_id, session_id),
    INDEX idx_session (session_id),
    INDEX idx_assistant (assistant_id),
    INDEX idx_center (center_id),
    INDEX idx_time_recorded (time_recorded)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Default admin account
-- Email: admin@example.com
-- Password: admin123 (bcrypt hash below)
-- =====================================================
INSERT INTO users (name, email, password_hash, role) VALUES
('System Admin', 'admin@example.com', '$2a$10$YGZ5qp5qZ5qZ5qZ5qZ5qZeK5qZ5qZ5qZ5qZ5qZ5qZ5qZ5qZ5qZ5qZ', 'admin');

-- Note: The password hash above is placeholder. 
-- You should generate a proper bcrypt hash for your password.
