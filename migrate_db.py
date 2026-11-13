import libsql

conn = libsql.connect('uniguide_local.db')
conn.executescript('''
BEGIN TRANSACTION;
ALTER TABLE bio_buddies RENAME TO bio_buddies_old;
CREATE TABLE bio_buddies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT NOT NULL,
    student_id TEXT,
    course TEXT,
    academic_title TEXT,
    academic_degree TEXT,
    workplace TEXT,
    email TEXT NOT NULL,
    phone TEXT,
    research_topic TEXT NOT NULL,
    research_field TEXT,
    research_subject TEXT,
    description TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO bio_buddies (id, full_name, student_id, course, academic_title, academic_degree, workplace, email, phone, research_topic, research_field, research_subject, description, status, created_at)
SELECT id, full_name, student_id, course, academic_title, academic_degree, workplace, email, phone, research_topic, research_field, research_subject, description, status, created_at FROM bio_buddies_old;
DROP TABLE bio_buddies_old;
COMMIT;
''')
print('Migrated bio_buddies successfully!')
conn.close()