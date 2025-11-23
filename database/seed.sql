-- =====================================================
-- Sample Data for Testing
-- =====================================================

USE attendance_system;

-- Sample Centers (Cairo locations)
INSERT INTO centers (name, latitude, longitude, radius_m, address) VALUES
('Nasr City Center', 30.0444, 31.2357, 30, '123 Nasr City, Cairo'),
('Heliopolis Center', 30.0808, 31.3241, 30, '456 Heliopolis, Cairo'),
('Maadi Center', 29.9602, 31.2569, 30, '789 Maadi, Cairo');

-- Sample Admin User
-- Email: admin@attendance.com
-- Password: Admin@2024
INSERT INTO users (name, email, password_hash, role) VALUES
('System Administrator', 'admin@attendance.com', '$2a$10$d2dr9IyUrdcna5hWufOvQOF8zowONltPKe1zHI1lRHqiXHMJH06zG', 'admin');

-- Sample Assistants
-- Email: assistant1@attendance.com / Password: Assistant@2024
-- Email: assistant2@attendance.com / Password: Assistant@2024
-- Email: assistant3@attendance.com / Password: Assistant@2024
INSERT INTO users (name, email, password_hash, role) VALUES
('Ahmed Hassan', 'assistant1@attendance.com', '$2a$10$D3GjkV5GpQMc0DUVOVyR4OTxowB6FmZo1bQQKT.feKZM9TSj.WmVG', 'assistant'),
('Sara Mohamed', 'assistant2@attendance.com', '$2a$10$D3GjkV5GpQMc0DUVOVyR4OTxowB6FmZo1bQQKT.feKZM9TSj.WmVG', 'assistant'),
('Omar Ali', 'assistant3@attendance.com', '$2a$10$D3GjkV5GpQMc0DUVOVyR4OTxowB6FmZo1bQQKT.feKZM9TSj.WmVG', 'assistant');

-- Assign assistants to centers
INSERT INTO assistants_centers (assistant_id, center_id) VALUES
(2, 1), -- Ahmed at Nasr City
(2, 2), -- Ahmed at Heliopolis
(3, 1), -- Sara at Nasr City
(3, 3), -- Sara at Maadi
(4, 2), -- Omar at Heliopolis
(4, 3); -- Omar at Maadi

-- Sample Sessions for today and tomorrow
INSERT INTO sessions (assistant_id, center_id, subject, date, start_time, end_time) VALUES
-- Today's sessions
(2, 1, 'Mathematics', CURDATE(), '14:00:00', '16:00:00'),
(2, 2, 'Physics', CURDATE(), '17:00:00', '19:00:00'),
(3, 1, 'Chemistry', CURDATE(), '15:00:00', '17:00:00'),
(3, 3, 'Biology', CURDATE(), '18:00:00', '20:00:00'),
(4, 2, 'English', CURDATE(), '16:00:00', '18:00:00'),

-- Tomorrow's sessions
(2, 1, 'Mathematics', DATE_ADD(CURDATE(), INTERVAL 1 DAY), '14:00:00', '16:00:00'),
(3, 3, 'Chemistry', DATE_ADD(CURDATE(), INTERVAL 1 DAY), '15:00:00', '17:00:00'),
(4, 2, 'Physics', DATE_ADD(CURDATE(), INTERVAL 1 DAY), '17:00:00', '19:00:00');

-- Sample attendance records (for testing reports)
INSERT INTO attendance (assistant_id, session_id, center_id, latitude, longitude, time_recorded, delay_minutes) VALUES
-- On-time attendance
(2, 1, 1, 30.0445, 31.2358, CONCAT(CURDATE(), ' 13:55:00'), 0),
-- Late attendance
(3, 3, 1, 30.0446, 31.2359, CONCAT(CURDATE(), ' 15:12:00'), 12);
