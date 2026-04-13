-- Atelier D1 Schema

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT,
  role TEXT NOT NULL DEFAULT 'pending',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS public_profiles (
  user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT '',
  display_name TEXT DEFAULT '',
  bio TEXT DEFAULT '',
  niche TEXT DEFAULT '',
  avatar_url TEXT DEFAULT '',
  photo_url TEXT DEFAULT '',
  website TEXT DEFAULT '',
  industry TEXT DEFAULT '',
  theme TEXT DEFAULT 'luxury',
  external_links TEXT DEFAULT '[]',
  social_links TEXT DEFAULT '[]',
  custom_space_order TEXT DEFAULT '[]',
  username TEXT UNIQUE,
  followers TEXT DEFAULT '0',
  engagement_rate TEXT DEFAULT '0%',
  avg_views TEXT DEFAULT '0',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS oauth_accounts (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  provider TEXT NOT NULL,
  provider_user_id TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(provider, provider_user_id)
);

CREATE TABLE IF NOT EXISTS spaces (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  username TEXT,
  title TEXT NOT NULL DEFAULT '',
  description TEXT DEFAULT '',
  image_url TEXT DEFAULT '',
  markers TEXT NOT NULL DEFAULT '[]',
  is_public INTEGER NOT NULL DEFAULT 1,
  is_starred INTEGER NOT NULL DEFAULT 0,
  space_type TEXT DEFAULT 'TAGGABLE_ITEM_SPACE',
  display_order INTEGER DEFAULT 0,
  views INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  brand_id TEXT NOT NULL REFERENCES users(id),
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  price REAL DEFAULT 0,
  image_url TEXT DEFAULT '',
  category TEXT DEFAULT '',
  buy_link TEXT DEFAULT '',
  interactions_count INTEGER DEFAULT 0,
  purchases_count INTEGER DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS interactions (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  creator_id TEXT,
  target_id TEXT,
  type TEXT NOT NULL,
  space_id TEXT,
  marker_id TEXT,
  product_title TEXT,
  metadata TEXT DEFAULT '{}',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS tasks (
  id TEXT PRIMARY KEY,
  brand_id TEXT NOT NULL,
  creator_id TEXT NOT NULL,
  campaign_id TEXT,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  deadline TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  content_url TEXT DEFAULT '',
  scheduled_date TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS campaigns (
  id TEXT PRIMARY KEY,
  brand_id TEXT NOT NULL,
  name TEXT NOT NULL,
  goal TEXT DEFAULT '',
  product_link TEXT DEFAULT '',
  budget TEXT DEFAULT '',
  category TEXT DEFAULT '',
  collab_type TEXT DEFAULT '',
  instructions TEXT DEFAULT '',
  deadline TEXT,
  platform TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'active',
  selected_creators TEXT DEFAULT '[]',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS connections (
  id TEXT PRIMARY KEY,
  brand_id TEXT NOT NULL,
  creator_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(brand_id, creator_id)
);

CREATE TABLE IF NOT EXISTS admin_emails (
  email TEXT PRIMARY KEY,
  added_by TEXT,
  added_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_spaces_user_id ON spaces(user_id);
CREATE INDEX IF NOT EXISTS idx_spaces_username ON spaces(username);
CREATE INDEX IF NOT EXISTS idx_spaces_is_public ON spaces(is_public);
CREATE INDEX IF NOT EXISTS idx_public_profiles_username ON public_profiles(username);
CREATE INDEX IF NOT EXISTS idx_products_brand_id ON products(brand_id);
CREATE INDEX IF NOT EXISTS idx_interactions_creator_id ON interactions(creator_id);
CREATE INDEX IF NOT EXISTS idx_tasks_brand_id ON tasks(brand_id);
CREATE INDEX IF NOT EXISTS idx_tasks_creator_id ON tasks(creator_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_brand_id ON campaigns(brand_id);
