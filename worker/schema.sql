-- Basalt waitlist: one row per address. Nothing else is stored (no IP, no user agent).
CREATE TABLE IF NOT EXISTS waitlist (
  email      TEXT PRIMARY KEY,
  created_at TEXT NOT NULL
);
