-- Additive migration for existing RoomSync installations.
-- Requires rooms.id INT UNSIGNED and users.id VARCHAR(100), as in
-- roomsync_database.sql and the current roomsync.sql schema.
USE lecture_room_reservation;

CREATE TABLE IF NOT EXISTS equipment (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    room_id INT UNSIGNED NOT NULL,
    code VARCHAR(50) NOT NULL,
    name VARCHAR(150) NOT NULL,
    description TEXT NULL,
    status ENUM('operational', 'maintenance', 'retired') NOT NULL DEFAULT 'operational',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_equipment_code (code),
    KEY idx_equipment_room_status (room_id, status),
    CONSTRAINT fk_equipment_room
        FOREIGN KEY (room_id) REFERENCES rooms(id)
        ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS laboratory_reports (
    id VARCHAR(100) NOT NULL,
    room_id INT UNSIGNED NOT NULL,
    equipment_id INT UNSIGNED NULL DEFAULT NULL,
    reported_by VARCHAR(100) NOT NULL,
    issue_type VARCHAR(100) NOT NULL,
    severity ENUM('low', 'medium', 'high', 'critical') NOT NULL DEFAULT 'medium',
    description TEXT NOT NULL,
    status ENUM('reported', 'under_review', 'in_progress', 'resolved')
        NOT NULL DEFAULT 'reported',
    resolution_notes TEXT NULL,
    resolved_at DATETIME NULL DEFAULT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_laboratory_reports_room_status (room_id, status),
    KEY idx_laboratory_reports_reporter (reported_by, created_at),
    KEY idx_laboratory_reports_equipment (equipment_id),
    KEY idx_laboratory_reports_status (status),
    CONSTRAINT fk_laboratory_report_room
        FOREIGN KEY (room_id) REFERENCES rooms(id)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_laboratory_report_equipment
        FOREIGN KEY (equipment_id) REFERENCES equipment(id)
        ON UPDATE CASCADE ON DELETE SET NULL,
    CONSTRAINT fk_laboratory_report_reporter
        FOREIGN KEY (reported_by) REFERENCES users(id)
        ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;
