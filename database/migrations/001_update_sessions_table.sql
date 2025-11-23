-- =====================================================
-- Migration: Update Sessions Table Structure
-- Date: 2025-11-23
-- Description: Convert sessions table from separate date/time fields 
--              to single start_time DATETIME field
-- =====================================================

USE attendance_system;

-- Step 1: Add new start_time column as DATETIME
ALTER TABLE sessions 
ADD COLUMN start_time_new DATETIME AFTER subject;

-- Step 2: Migrate existing data by combining date and start_time
UPDATE sessions 
SET start_time_new = TIMESTAMP(date, start_time);

-- Step 3: Drop old columns
ALTER TABLE sessions 
DROP COLUMN date,
DROP COLUMN start_time,
DROP COLUMN end_time;

-- Step 4: Rename new column to start_time
ALTER TABLE sessions 
CHANGE COLUMN start_time_new start_time DATETIME NOT NULL;

-- Step 5: Update indexes
ALTER TABLE sessions 
DROP INDEX idx_assistant_date,
DROP INDEX idx_center_date,
DROP INDEX idx_date;

-- Step 6: Add new indexes for the updated structure
ALTER TABLE sessions
ADD INDEX idx_assistant_start (assistant_id, start_time),
ADD INDEX idx_center_start (center_id, start_time),
ADD INDEX idx_start_time (start_time);

-- Verification query
SELECT 
    id,
    assistant_id,
    center_id,
    subject,
    start_time,
    created_at
FROM sessions
LIMIT 5;

-- =====================================================
-- Migration Complete
-- =====================================================
