CREATE TABLE users_valiantlynx (
    id TEXT PRIMARY KEY DEFAULT ('user_' || lower(hex(randomblob(7)))),
    created DATETIME NOT NULL DEFAULT (datetime('now')),
    updated DATETIME NOT NULL DEFAULT (datetime('now')),
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    emailVisibility INTEGER DEFAULT 0,
    verified INTEGER DEFAULT 0,
    tokenKey TEXT NOT NULL,
    passwordHash TEXT NOT NULL,
    lastResetSentAt DATETIME,
    lastVerificationSentAt DATETIME,
    name TEXT DEFAULT '',
    avatar TEXT DEFAULT '',
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'editor', 'admin', 'manager')),
    bio TEXT DEFAULT '',
    website TEXT DEFAULT '',
    twitter TEXT DEFAULT '',
    github TEXT DEFAULT '',
    linkedin TEXT DEFAULT ''
);

CREATE TABLE blogs (
    id TEXT PRIMARY KEY DEFAULT ('blog_' || lower(hex(randomblob(7)))),
    created DATETIME NOT NULL DEFAULT (datetime('now')),
    updated DATETIME NOT NULL DEFAULT (datetime('now')),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    summary TEXT NOT NULL,
    image TEXT DEFAULT '',
    alt TEXT NOT NULL,
    content_object TEXT DEFAULT '{}',
    author TEXT NOT NULL,
    tags TEXT DEFAULT '[]',
    views INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    published INTEGER DEFAULT 1,
    FOREIGN KEY (author) REFERENCES users_valiantlynx(id) ON DELETE CASCADE
);

CREATE TABLE projects_valiantlynx (
    id TEXT PRIMARY KEY DEFAULT ('project_' || lower(hex(randomblob(7)))),
    created DATETIME NOT NULL DEFAULT (datetime('now')),
    updated DATETIME NOT NULL DEFAULT (datetime('now')),
    name TEXT NOT NULL,
    tagline TEXT NOT NULL,
    url TEXT NOT NULL,
    thumbnail TEXT DEFAULT '',
    description TEXT DEFAULT '',
    user TEXT NOT NULL,
    featured INTEGER DEFAULT 0,
    active INTEGER DEFAULT 1,
    FOREIGN KEY (user) REFERENCES users_valiantlynx(id) ON DELETE CASCADE
);

CREATE TABLE tags (
    id TEXT PRIMARY KEY DEFAULT ('tag_' || lower(hex(randomblob(7)))),
    created DATETIME NOT NULL DEFAULT (datetime('now')),
    updated DATETIME NOT NULL DEFAULT (datetime('now')),
    name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT DEFAULT '',
    color TEXT DEFAULT '#3B82F6'
);

CREATE TABLE sites (
    id TEXT PRIMARY KEY DEFAULT ('site_' || lower(hex(randomblob(7)))),
    created DATETIME NOT NULL DEFAULT (datetime('now')),
    updated DATETIME NOT NULL DEFAULT (datetime('now')),
    site_name TEXT DEFAULT 'valiantlynx',
    clarity_tag TEXT DEFAULT '',
    google_tag TEXT DEFAULT '',
    google_ads_client TEXT DEFAULT '',
    site_description TEXT DEFAULT '',
    site_logo TEXT DEFAULT '',
    site_favicon TEXT DEFAULT '',
    meta_keywords TEXT DEFAULT '',
    og_image TEXT DEFAULT '',
    twitter_handle TEXT DEFAULT '',
    facebook_url TEXT DEFAULT '',
    github_url TEXT DEFAULT '',
    linkedin_url TEXT DEFAULT ''
);

CREATE TABLE likes (
    id TEXT PRIMARY KEY DEFAULT ('like_' || lower(hex(randomblob(7)))),
    created DATETIME NOT NULL DEFAULT (datetime('now')),
    updated DATETIME NOT NULL DEFAULT (datetime('now')),
    user TEXT NOT NULL,
    blog TEXT NOT NULL,
    FOREIGN KEY (user) REFERENCES users_valiantlynx(id) ON DELETE CASCADE,
    FOREIGN KEY (blog) REFERENCES blogs(id) ON DELETE CASCADE,
    UNIQUE(user, blog)
);

CREATE TABLE comments (
    id TEXT PRIMARY KEY DEFAULT ('comment_' || lower(hex(randomblob(7)))),
    created DATETIME NOT NULL DEFAULT (datetime('now')),
    updated DATETIME NOT NULL DEFAULT (datetime('now')),
    content TEXT NOT NULL,
    author TEXT NOT NULL,
    blog TEXT NOT NULL,
    parent TEXT DEFAULT '',
    approved INTEGER DEFAULT 1,
    flagged INTEGER DEFAULT 0,
    FOREIGN KEY (author) REFERENCES users_valiantlynx(id) ON DELETE CASCADE,
    FOREIGN KEY (blog) REFERENCES blogs(id) ON DELETE CASCADE,
    FOREIGN KEY (parent) REFERENCES comments(id) ON DELETE CASCADE
);

CREATE TABLE oauth2_accounts (
    id TEXT PRIMARY KEY DEFAULT ('oauth_' || lower(hex(randomblob(7)))),
    created DATETIME NOT NULL DEFAULT (datetime('now')),
    updated DATETIME NOT NULL DEFAULT (datetime('now')),
    user TEXT NOT NULL,
    provider TEXT NOT NULL CHECK (provider IN ('google', 'github', 'facebook', 'discord')),
    providerId TEXT NOT NULL,
    accessToken TEXT DEFAULT '',
    refreshToken TEXT DEFAULT '',
    expiresAt DATETIME,
    FOREIGN KEY (user) REFERENCES users_valiantlynx(id) ON DELETE CASCADE,
    UNIQUE(user, provider)
);

CREATE TABLE feedback (
    id TEXT PRIMARY KEY DEFAULT ('feedback_' || lower(hex(randomblob(7)))),
    created DATETIME NOT NULL DEFAULT (datetime('now')),
    updated DATETIME NOT NULL DEFAULT (datetime('now')),
    emotion INTEGER CHECK (emotion >= 1 AND emotion <= 4),
    note TEXT NOT NULL,
    url TEXT DEFAULT '',
    user TEXT DEFAULT '',
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'reviewed', 'resolved')),
    FOREIGN KEY (user) REFERENCES users_valiantlynx(id) ON DELETE SET NULL
);

CREATE TABLE messages (
    id TEXT PRIMARY KEY DEFAULT ('message_' || lower(hex(randomblob(7)))),
    created DATETIME NOT NULL DEFAULT (datetime('now')),
    updated DATETIME NOT NULL DEFAULT (datetime('now')),
    sender TEXT NOT NULL,
    recipient TEXT DEFAULT '',
    content TEXT NOT NULL,
    read INTEGER DEFAULT 0,
    FOREIGN KEY (sender) REFERENCES users_valiantlynx(id) ON DELETE CASCADE,
    FOREIGN KEY (recipient) REFERENCES users_valiantlynx(id) ON DELETE CASCADE
);

CREATE TRIGGER IF NOT EXISTS update_users_valiantlynx_timestamp 
AFTER UPDATE ON users_valiantlynx
BEGIN
    UPDATE users_valiantlynx SET updated = datetime('now') WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS update_blogs_timestamp 
AFTER UPDATE ON blogs
BEGIN
    UPDATE blogs SET updated = datetime('now') WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS update_projects_timestamp 
AFTER UPDATE ON projects_valiantlynx
BEGIN
    UPDATE projects_valiantlynx SET updated = datetime('now') WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS update_tags_timestamp 
AFTER UPDATE ON tags
BEGIN
    UPDATE tags SET updated = datetime('now') WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS update_sites_timestamp 
AFTER UPDATE ON sites
BEGIN
    UPDATE sites SET updated = datetime('now') WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS update_comments_timestamp 
AFTER UPDATE ON comments
BEGIN
    UPDATE comments SET updated = datetime('now') WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS update_messages_timestamp 
AFTER UPDATE ON messages
BEGIN
    UPDATE messages SET updated = datetime('now') WHERE id = NEW.id;
END;

CREATE INDEX IF NOT EXISTS idx_blogs_slug ON blogs(slug);
CREATE INDEX IF NOT EXISTS idx_blogs_author ON blogs(author);
CREATE INDEX IF NOT EXISTS idx_blogs_created ON blogs(created);
CREATE INDEX IF NOT EXISTS idx_projects_user ON projects_valiantlynx(user);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects_valiantlynx(featured);
CREATE INDEX IF NOT EXISTS idx_tags_slug ON tags(slug);
CREATE INDEX IF NOT EXISTS idx_tags_name ON tags(name);
CREATE INDEX IF NOT EXISTS idx_likes_user ON likes(user);
CREATE INDEX IF NOT EXISTS idx_likes_blog ON likes(blog);
CREATE INDEX IF NOT EXISTS idx_comments_blog ON comments(blog);
CREATE INDEX IF NOT EXISTS idx_comments_author ON comments(author);
CREATE INDEX IF NOT EXISTS idx_comments_parent ON comments(parent);
CREATE INDEX IF NOT EXISTS idx_comments_created ON comments(created);
CREATE INDEX IF NOT EXISTS idx_oauth2_user ON oauth2_accounts(user);
CREATE INDEX IF NOT EXISTS idx_oauth2_provider ON oauth2_accounts(provider, providerId);
CREATE INDEX IF NOT EXISTS idx_feedback_status ON feedback(status);
CREATE INDEX IF NOT EXISTS idx_feedback_created ON feedback(created);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender);
CREATE INDEX IF NOT EXISTS idx_messages_recipient ON messages(recipient);
CREATE INDEX IF NOT EXISTS idx_messages_created ON messages(created);

INSERT OR IGNORE INTO sites (id, site_name, site_description) 
VALUES ('default_site', 'valiantlynx', 'A modern blog platform built with SvelteKit and PocketBase');

INSERT OR IGNORE INTO tags (id, name, slug, color) VALUES
('tag_web_dev', 'Web Development', 'web-development', '#3B82F6'),
('tag_javascript', 'JavaScript', 'javascript', '#F7DF1E'),
('tag_svelte', 'Svelte', 'svelte', '#FF3E00'),
('tag_tutorial', 'Tutorial', 'tutorial', '#10B981'),
('tag_tech', 'Technology', 'technology', '#8B5CF6');
