-- Database Schema for Ruang Naskah Drama
-- Conforms to PRD & SRS v1.0 specifications

CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'admin',
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    icon TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS tags (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS scripts (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    author TEXT NOT NULL,
    synopsis TEXT NOT NULL,
    cast_list TEXT, -- JSON array of characters or formatted text
    category_id TEXT NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
    language TEXT NOT NULL,
    genre TEXT,
    performance_type TEXT,
    duration TEXT,
    cast_count INTEGER,
    age_group TEXT,
    content TEXT, -- Full script text for online reading
    file_url TEXT, -- Uploaded PDF/DOCX file path
    cover_url TEXT, -- Cover image path
    status TEXT NOT NULL DEFAULT 'Draft', -- 'Draft', 'Pending', 'Disetujui', 'Ditolak', 'Terbit', 'Trash'
    views INTEGER NOT NULL DEFAULT 0,
    downloads INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS script_tags (
    script_id TEXT NOT NULL REFERENCES scripts(id) ON DELETE CASCADE,
    tag_id TEXT NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (script_id, tag_id)
);

CREATE TABLE IF NOT EXISTS submissions (
    id TEXT PRIMARY KEY,
    contributor_name TEXT NOT NULL,
    email TEXT NOT NULL,
    institution TEXT,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    category_id TEXT NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
    language TEXT NOT NULL,
    genre TEXT,
    performance_type TEXT,
    duration TEXT,
    cast_count INTEGER,
    age_group TEXT,
    synopsis TEXT NOT NULL,
    cast_list TEXT,
    tags TEXT,
    content TEXT,
    file_url TEXT,
    status TEXT NOT NULL DEFAULT 'Pending', -- 'Pending', 'Disetujui', 'Ditolak'
    admin_note TEXT,
    copyright_agreed INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    reviewed_at TEXT,
    reviewed_by TEXT REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS reports (
    id TEXT PRIMARY KEY,
    report_type TEXT NOT NULL, -- 'copyright', 'broken_file', 'inappropriate', 'feedback', 'other'
    script_id TEXT REFERENCES scripts(id) ON DELETE SET NULL,
    script_title TEXT,
    reporter_name TEXT NOT NULL,
    reporter_email TEXT NOT NULL,
    description TEXT NOT NULL,
    proof_url TEXT,
    status TEXT NOT NULL DEFAULT 'Open', -- 'Open', 'In Review', 'Resolved', 'Dismissed'
    admin_notes TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    resolved_at TEXT
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
    user_name TEXT,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT,
    metadata TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
);

-- Indices for rapid search and high-performance querying
CREATE INDEX IF NOT EXISTS idx_scripts_slug ON scripts(slug);
CREATE INDEX IF NOT EXISTS idx_scripts_status ON scripts(status);
CREATE INDEX IF NOT EXISTS idx_scripts_category_id ON scripts(category_id);
CREATE INDEX IF NOT EXISTS idx_scripts_language ON scripts(language);
CREATE INDEX IF NOT EXISTS idx_scripts_created_at ON scripts(created_at);
CREATE INDEX IF NOT EXISTS idx_scripts_views ON scripts(views);
CREATE INDEX IF NOT EXISTS idx_scripts_downloads ON scripts(downloads);
CREATE INDEX IF NOT EXISTS idx_submissions_status ON submissions(status);
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);

