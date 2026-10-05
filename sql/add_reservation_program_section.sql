USE lecture_room_reservation;

ALTER TABLE reservations
    ADD COLUMN IF NOT EXISTS program_section VARCHAR(150) NOT NULL DEFAULT '' AFTER purpose;

SET @roomsync_sql = IF(
    EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_schema = DATABASE()
          AND table_name = 'reservations'
          AND constraint_name = 'chk_reservation_valid_time'
          AND constraint_type = 'CHECK'
    ),
    'SELECT 1',
    'ALTER TABLE reservations ADD CONSTRAINT chk_reservation_valid_time CHECK (end_date > start_date)'
);
PREPARE roomsync_stmt FROM @roomsync_sql;
EXECUTE roomsync_stmt;
DEALLOCATE PREPARE roomsync_stmt;
