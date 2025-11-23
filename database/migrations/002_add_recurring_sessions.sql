-- =====================================================
-- Migration: Update Sessions for Recurring & Open Attendance
-- Date: 2025-11-23
-- Description: 
--   1. Add recurrence support (weekly/one-time)
--   2. Remove assistant_id requirement
--   3. Allow any assistant to mark attendance
-- =====================================================

USE attendance_system;

-- Step 1: Add recurrence fields to sessions table
ALTER TABLE sessions 
ADD COLUMN recurrence_type ENUM('one_time', 'weekly') NOT NULL DEFAULT 'one_time' AFTER subject,
ADD COLUMN day_of_week TINYINT NULL COMMENT '1=Monday, 7=Sunday' AFTER recurrence_type,
ADD COLUMN is_active BOOLEAN NOT NULL DEFAULT TRUE AFTER day_of_week;

-- Step 2: Make assistant_id nullable (sessions are now open to any assistant)
ALTER TABLE sessions 
MODIFY COLUMN assistant_id INT NULL;

-- Step 3: Add index for recurring sessions queries
ALTER TABLE sessions
ADD INDEX idx_recurrence (recurrence_type, is_active),
ADD INDEX idx_day_of_week (day_of_week);

-- Step 4: Update existing sessions to be one-time
UPDATE sessions 
SET recurrence_type = 'one_time',
    is_active = TRUE;

-- Verification queries
SELECT 
    'Sessions table updated successfully' as status;

SELECT 
    id,
    subject,
    recurrence_type,
    day_of_week,
    is_active,
    start_time
FROM sessions
LIMIT 5;

-- =====================================================
-- Migration Complete
-- New Features:
-- 1. Sessions can be weekly or one-time
-- 2. Any assistant can mark attendance
-- 3. Weekly sessions repeat automatically
-- =====================================================
