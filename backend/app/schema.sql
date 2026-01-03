-- Tables for BiosciZone

CREATE TABLE IF NOT EXISTS admins (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    hashed_password TEXT NOT NULL,
    role TEXT DEFAULT 'admin'
);

CREATE TABLE IF NOT EXISTS bio_buddies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT NOT NULL,
    student_id TEXT,
    course TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    research_topic TEXT NOT NULL,
    research_field TEXT,
    research_subject TEXT,
    description TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS articles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category TEXT NOT NULL, -- magazine, news, achievement, resource, science_corner
    title TEXT NOT NULL,
    content TEXT,
    author TEXT,
    external_link TEXT,
    file_url TEXT,
    publication_date DATE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS feedbacks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sender_name TEXT NOT NULL,
    email TEXT NOT NULL,
    student_id TEXT,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS labs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    lead_name TEXT,
    email TEXT,
    phone TEXT,
    research_areas TEXT
);

-- System Settings (for superadmin)
CREATE TABLE IF NOT EXISTS system_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_by TEXT
);

-- Audit Logs (for superadmin)
CREATE TABLE IF NOT EXISTS audit_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    admin_username TEXT NOT NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT,
    details TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Insert default system settings
INSERT OR IGNORE INTO system_settings (key, value) VALUES ('registration_enabled', 'true');
INSERT OR IGNORE INTO system_settings (key, value) VALUES ('maintenance_mode', 'false');
