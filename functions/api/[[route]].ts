import { Hono } from 'hono'
import { getCookie, setCookie, deleteCookie } from 'hono/cookie'
import { handle } from 'hono/cloudflare-pages'
import { GoogleGenAI, Type } from '@google/genai'

// ─── Types ────────────────────────────────────────────────────────────────────

type Env = {
  DB: D1Database
  BUCKET: R2Bucket
  KV: KVNamespace
  GOOGLE_CLIENT_ID: string
  GOOGLE_CLIENT_SECRET: string
  GOOGLE_APPLICATION_CREDENTIALS_JSON: string
  GEMINI_API_KEY: string
  APP_URL: string
}

type AuthUser = { id: string; email: string; role: string }
type Variables = { user: AuthUser | null }

const app = new Hono<{ Bindings: Env; Variables: Variables }>()

// ─── Normalizers ──────────────────────────────────────────────────────────────

function parseJson(val: any, fallback: any = []) {
  if (!val) return fallback
  if (typeof val !== 'string') return val
  try { return JSON.parse(val) } catch { return fallback }
}

function normalizeSpace(row: any) {
  if (!row) return null
  return {
    id: row.id,
    userId: row.user_id,
    username: row.username,
    title: row.title,
    description: row.description,
    imageUrl: row.image_url,
    markers: parseJson(row.markers, []),
    isPublic: Boolean(row.is_public),
    isStarred: Boolean(row.is_starred),
    spaceType: row.space_type,
    displayOrder: row.display_order,
    order: row.display_order,
    views: row.views,
    clicks: row.clicks,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function normalizeProfile(row: any) {
  if (!row) return null
  return {
    uid: row.user_id || row.id,
    id: row.user_id || row.id,
    email: row.email || '',
    role: row.role || 'shopper',
    name: row.name || '',
    displayName: row.display_name || row.name || '',
    bio: row.bio || '',
    niche: row.niche || '',
    avatarUrl: row.avatar_url || '',
    photoURL: row.photo_url || row.avatar_url || '',
    website: row.website || '',
    industry: row.industry || '',
    theme: row.theme || 'luxury',
    externalLinks: parseJson(row.external_links, []),
    socialLinks: parseJson(row.social_links, []),
    customSpaceOrder: parseJson(row.custom_space_order, []),
    username: row.username || '',
    followers: row.followers || '0',
    engagementRate: row.engagement_rate || '0%',
    avgViews: row.avg_views || '0',
    createdAt: row.created_at,
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function hashPassword(password: string): Promise<string> {
  const enc = new TextEncoder()
  const salt = crypto.getRandomValues(new Uint8Array(16))
  const key = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits'])
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' }, key, 256)
  const saltB64 = btoa(String.fromCharCode(...salt))
  const hashB64 = btoa(String.fromCharCode(...new Uint8Array(bits)))
  return `${saltB64}:${hashB64}`
}

async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [saltB64, hashB64] = stored.split(':')
  const salt = Uint8Array.from(atob(saltB64), c => c.charCodeAt(0))
  const enc = new TextEncoder()
  const key = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits'])
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' }, key, 256)
  return btoa(String.fromCharCode(...new Uint8Array(bits))) === hashB64
}

async function createSession(kv: KVNamespace, userId: string): Promise<string> {
  const id = crypto.randomUUID()
  await kv.put(`session:${id}`, userId, { expirationTtl: 604800 })
  return id
}

async function getGoogleAccessToken(credentialsJson: string): Promise<string> {
  const creds = JSON.parse(credentialsJson)
  const now = Math.floor(Date.now() / 1000)
  const toB64Url = (s: string) => btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
  const header = toB64Url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }))
  const payload = toB64Url(JSON.stringify({
    iss: creds.client_email,
    scope: 'https://www.googleapis.com/auth/cloud-vision',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now, exp: now + 3600
  }))
  const sigInput = `${header}.${payload}`
  const pemBody = creds.private_key.replace(/-----BEGIN PRIVATE KEY-----|-----END PRIVATE KEY-----|\n/g, '').replace(/\\n/g, '')
  const binaryKey = Uint8Array.from(atob(pemBody), c => c.charCodeAt(0))
  const key = await crypto.subtle.importKey('pkcs8', binaryKey, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['sign'])
  const sig = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', key, new TextEncoder().encode(sigInput))
  const jwt = `${sigInput}.${toB64Url(btoa(String.fromCharCode(...new Uint8Array(sig))))}`
  const resp = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: jwt })
  })
  return ((await resp.json()) as any).access_token
}

async function isAdminEmail(db: D1Database, email: string): Promise<boolean> {
  if (email === 'kristiss747@gmail.com') return true
  const row = await db.prepare('SELECT 1 FROM admin_emails WHERE email = ?').bind(email.toLowerCase()).first()
  return !!row
}

function sessionCookieOpts() {
  return { path: '/', httpOnly: true, secure: true, sameSite: 'Lax' as const, maxAge: 604800 }
}

// ─── Auth Middleware ──────────────────────────────────────────────────────────

app.use('*', async (c, next) => {
  const sessionId = getCookie(c, 'session')
  if (sessionId) {
    const userId = await c.env.KV.get(`session:${sessionId}`)
    if (userId) {
      const u = await c.env.DB.prepare('SELECT id, email, role FROM users WHERE id = ?').bind(userId).first<AuthUser>()
      c.set('user', u || null)
    } else {
      c.set('user', null)
    }
  } else {
    c.set('user', null)
  }
  return next()
})

// ─── AUTH ─────────────────────────────────────────────────────────────────────

app.get('/api/auth/me', async (c) => {
  const u = c.get('user')
  if (!u) return c.json({ user: null })
  const row = await c.env.DB.prepare(
    'SELECT pp.*, u.email, u.role FROM public_profiles pp JOIN users u ON u.id = pp.user_id WHERE pp.user_id = ?'
  ).bind(u.id).first()
  return c.json({ user: row ? normalizeProfile(row) : { uid: u.id, id: u.id, email: u.email, role: u.role } })
})

app.post('/api/auth/login', async (c) => {
  const { email, password } = await c.req.json()
  if (!email || !password) return c.json({ error: 'Email and password required' }, 400)
  const u = await c.env.DB.prepare('SELECT * FROM users WHERE email = ?').bind(email.toLowerCase()).first<any>()
  if (!u || !u.password_hash) return c.json({ error: 'Invalid credentials' }, 401)
  if (!(await verifyPassword(password, u.password_hash))) return c.json({ error: 'Invalid credentials' }, 401)
  if (await isAdminEmail(c.env.DB, u.email) && u.role !== 'admin') {
    await c.env.DB.prepare("UPDATE users SET role = 'admin' WHERE id = ?").bind(u.id).run()
    u.role = 'admin'
  }
  const row = await c.env.DB.prepare(
    'SELECT pp.*, u.email, u.role FROM public_profiles pp JOIN users u ON u.id = pp.user_id WHERE pp.user_id = ?'
  ).bind(u.id).first()
  const sessionId = await createSession(c.env.KV, u.id)
  setCookie(c, 'session', sessionId, sessionCookieOpts())
  return c.json({ user: row ? normalizeProfile(row) : { uid: u.id, id: u.id, email: u.email, role: u.role } })
})

app.post('/api/auth/register', async (c) => {
  const { email, password, role, name, niche, bio, website, industry } = await c.req.json()
  if (!email || !password || !role) return c.json({ error: 'Email, password and role required' }, 400)
  const existing = await c.env.DB.prepare('SELECT id FROM users WHERE email = ?').bind(email.toLowerCase()).first()
  if (existing) return c.json({ error: 'Email already registered' }, 409)
  const admin = await isAdminEmail(c.env.DB, email)
  const finalRole = admin ? 'admin' : role
  const id = crypto.randomUUID()
  const now = new Date().toISOString()
  await c.env.DB.prepare('INSERT INTO users (id, email, password_hash, role, created_at) VALUES (?, ?, ?, ?, ?)')
    .bind(id, email.toLowerCase(), await hashPassword(password), finalRole, now).run()
  const displayName = name || email.split('@')[0]
  await c.env.DB.prepare(
    'INSERT INTO public_profiles (user_id, name, display_name, bio, niche, website, industry, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
  ).bind(id, displayName, displayName, bio || '', niche || '', website || '', industry || '', now, now).run()
  const row = await c.env.DB.prepare(
    'SELECT pp.*, u.email, u.role FROM public_profiles pp JOIN users u ON u.id = pp.user_id WHERE pp.user_id = ?'
  ).bind(id).first()
  const sessionId = await createSession(c.env.KV, id)
  setCookie(c, 'session', sessionId, sessionCookieOpts())
  return c.json({ user: normalizeProfile(row) }, 201)
})

app.post('/api/auth/logout', async (c) => {
  const sessionId = getCookie(c, 'session')
  if (sessionId) { await c.env.KV.delete(`session:${sessionId}`); deleteCookie(c, 'session', { path: '/' }) }
  return c.json({ ok: true })
})

app.get('/api/auth/google', async (c) => {
  const state = crypto.randomUUID()
  await c.env.KV.put(`oauth:state:${state}`, '1', { expirationTtl: 600 })
  const url = new URL('https://accounts.google.com/o/oauth2/v2/auth')
  url.searchParams.set('client_id', c.env.GOOGLE_CLIENT_ID)
  url.searchParams.set('redirect_uri', `${c.env.APP_URL}/api/auth/google/callback`)
  url.searchParams.set('response_type', 'code')
  url.searchParams.set('scope', 'openid email profile')
  url.searchParams.set('state', state)
  return c.redirect(url.toString())
})

app.get('/api/auth/google/callback', async (c) => {
  const code = c.req.query('code')
  const state = c.req.query('state')
  if (!code || !state || !(await c.env.KV.get(`oauth:state:${state}`))) return c.redirect('/?auth_error=invalid')
  await c.env.KV.delete(`oauth:state:${state}`)
  const tokenResp = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code, client_id: c.env.GOOGLE_CLIENT_ID, client_secret: c.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: `${c.env.APP_URL}/api/auth/google/callback`, grant_type: 'authorization_code'
    })
  })
  const tokens = await tokenResp.json() as any
  if (!tokens.access_token) return c.redirect('/?auth_error=token_failed')
  const gUser = await (await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: { Authorization: `Bearer ${tokens.access_token}` }
  })).json() as any
  if (!gUser.email) return c.redirect('/?auth_error=no_email')
  const admin = await isAdminEmail(c.env.DB, gUser.email)
  let u = await c.env.DB.prepare('SELECT * FROM users WHERE email = ?').bind(gUser.email.toLowerCase()).first<any>()
  if (!u) {
    const id = crypto.randomUUID()
    const now = new Date().toISOString()
    const role = admin ? 'admin' : 'pending'
    await c.env.DB.prepare('INSERT INTO users (id, email, role, created_at) VALUES (?, ?, ?, ?)').bind(id, gUser.email.toLowerCase(), role, now).run()
    await c.env.DB.prepare('INSERT INTO public_profiles (user_id, name, display_name, avatar_url, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)').bind(id, gUser.name || gUser.email, gUser.name || '', gUser.picture || '', now, now).run()
    await c.env.DB.prepare('INSERT INTO oauth_accounts (id, user_id, provider, provider_user_id, created_at) VALUES (?, ?, ?, ?, ?)').bind(crypto.randomUUID(), id, 'google', gUser.sub, now).run()
    u = { id, email: gUser.email.toLowerCase(), role }
  } else if (admin && u.role !== 'admin') {
    await c.env.DB.prepare("UPDATE users SET role = 'admin' WHERE id = ?").bind(u.id).run()
    u.role = 'admin'
  }
  const sessionId = await createSession(c.env.KV, u.id)
  const resp = c.redirect('/')
  resp.headers.append('Set-Cookie', `session=${sessionId}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=604800`)
  return resp
})

// ─── USERS / PROFILES ─────────────────────────────────────────────────────────

app.put('/api/users/profile', async (c) => {
  const u = c.get('user')
  if (!u) return c.json({ error: 'Unauthorized' }, 401)
  const data = await c.req.json()
  const now = new Date().toISOString()
  // Update role in users table
  if (data.role && data.role !== 'pending') {
    await c.env.DB.prepare('UPDATE users SET role = ? WHERE id = ?').bind(data.role, u.id).run()
  }
  // Build profile update
  const colMap: Record<string, string> = {
    name: 'name', displayName: 'display_name', bio: 'bio', niche: 'niche',
    avatarUrl: 'avatar_url', photoURL: 'photo_url', website: 'website',
    industry: 'industry', theme: 'theme', username: 'username',
    externalLinks: 'external_links', socialLinks: 'social_links',
    customSpaceOrder: 'custom_space_order'
  }
  const sets: string[] = []
  const vals: any[] = []
  for (const [jsKey, col] of Object.entries(colMap)) {
    if (data[jsKey] !== undefined) {
      sets.push(`${col} = ?`)
      vals.push(typeof data[jsKey] === 'object' ? JSON.stringify(data[jsKey]) : data[jsKey])
    }
  }
  if (sets.length > 0) {
    sets.push('updated_at = ?'); vals.push(now, u.id)
    await c.env.DB.prepare(`UPDATE public_profiles SET ${sets.join(', ')} WHERE user_id = ?`).bind(...vals).run()
  }
  const row = await c.env.DB.prepare(
    'SELECT pp.*, u.email, u.role FROM public_profiles pp JOIN users u ON u.id = pp.user_id WHERE pp.user_id = ?'
  ).bind(u.id).first()
  return c.json({ profile: normalizeProfile(row) })
})

app.get('/api/users/profile/:uid', async (c) => {
  const row = await c.env.DB.prepare(
    'SELECT pp.*, u.email, u.role FROM public_profiles pp JOIN users u ON u.id = pp.user_id WHERE pp.user_id = ?'
  ).bind(c.req.param('uid')).first()
  if (!row) return c.json({ error: 'Not found' }, 404)
  return c.json({ profile: normalizeProfile(row) })
})

app.get('/api/users/by-username/:username', async (c) => {
  const username = c.req.param('username')
  const row = await c.env.DB.prepare(
    "SELECT pp.*, u.id as uid, u.email, u.role FROM public_profiles pp JOIN users u ON u.id = pp.user_id WHERE pp.username = ? OR lower(replace(pp.name,' ','')) = lower(?)"
  ).bind(username, username).first<any>()
  if (!row) {
    // Try by user_id directly
    const byId = await c.env.DB.prepare(
      'SELECT pp.*, u.email, u.role FROM public_profiles pp JOIN users u ON u.id = pp.user_id WHERE pp.user_id = ?'
    ).bind(username).first()
    if (!byId) return c.json({ error: 'Not found' }, 404)
    return c.json({ profile: normalizeProfile(byId) })
  }
  return c.json({ profile: normalizeProfile({ ...row, user_id: row.uid || row.user_id }) })
})

app.get('/api/users/creators', async (c) => {
  const { results } = await c.env.DB.prepare(
    "SELECT pp.*, u.id as uid, u.email, u.role FROM public_profiles pp JOIN users u ON u.id = pp.user_id WHERE u.role IN ('creator','admin')"
  ).all<any>()
  return c.json({ creators: results.map(r => normalizeProfile({ ...r, user_id: r.uid || r.user_id })) })
})

app.get('/api/users/all', async (c) => {
  const u = c.get('user')
  if (!u || u.role !== 'admin') return c.json({ error: 'Forbidden' }, 403)
  const { results } = await c.env.DB.prepare(
    'SELECT pp.*, u.id as uid, u.email, u.role FROM public_profiles pp JOIN users u ON u.id = pp.user_id'
  ).all<any>()
  return c.json({ users: results.map(r => normalizeProfile({ ...r, user_id: r.uid || r.user_id })) })
})

app.put('/api/users/role/:uid', async (c) => {
  const u = c.get('user')
  if (!u || u.role !== 'admin') return c.json({ error: 'Forbidden' }, 403)
  const { role } = await c.req.json()
  await c.env.DB.prepare('UPDATE users SET role = ? WHERE id = ?').bind(role, c.req.param('uid')).run()
  return c.json({ ok: true })
})

// ─── SPACES ───────────────────────────────────────────────────────────────────

app.get('/api/spaces/all', async (c) => {
  const { results } = await c.env.DB.prepare('SELECT * FROM spaces WHERE is_public = 1 ORDER BY created_at DESC').all()
  return c.json({ spaces: results.map(normalizeSpace) })
})

app.get('/api/spaces/categories', async (c) => {
  const { results } = await c.env.DB.prepare('SELECT markers FROM spaces WHERE is_public = 1').all<any>()
  const cats = new Set<string>()
  for (const row of results) {
    for (const m of parseJson(row.markers, [])) {
      if (m.details?.category) cats.add(m.details.category.trim())
    }
  }
  return c.json({ categories: Array.from(cats).sort() })
})

app.get('/api/spaces/public', async (c) => {
  const username = c.req.query('username')
  if (!username) return c.json({ error: 'username required' }, 400)
  const profile = await c.env.DB.prepare(
    "SELECT user_id FROM public_profiles WHERE username = ? OR lower(replace(name,' ','')) = lower(?)"
  ).bind(username, username).first<any>()
  const uid = profile?.user_id || username
  const { results } = await c.env.DB.prepare(
    'SELECT * FROM spaces WHERE (user_id = ? OR username = ?) AND is_public = 1 ORDER BY display_order ASC, created_at DESC'
  ).bind(uid, username).all()
  return c.json({ spaces: results.map(normalizeSpace) })
})

app.get('/api/spaces', async (c) => {
  const u = c.get('user')
  if (!u) return c.json({ error: 'Unauthorized' }, 401)
  const userId = c.req.query('userId') || u.id
  const username = c.req.query('username')
  if (username) {
    const profile = await c.env.DB.prepare(
      "SELECT user_id FROM public_profiles WHERE username = ? OR lower(replace(name,' ','')) = lower(?)"
    ).bind(username, username).first<any>()
    const uid = profile?.user_id || userId
    const { results } = await c.env.DB.prepare(
      'SELECT * FROM spaces WHERE user_id = ? OR username = ? ORDER BY display_order ASC, created_at DESC'
    ).bind(uid, username).all()
    return c.json({ spaces: results.map(normalizeSpace) })
  }
  const { results } = await c.env.DB.prepare(
    'SELECT * FROM spaces WHERE user_id = ? ORDER BY display_order ASC, created_at DESC'
  ).bind(userId).all()
  return c.json({ spaces: results.map(normalizeSpace) })
})

app.post('/api/spaces', async (c) => {
  const u = c.get('user')
  if (!u) return c.json({ error: 'Unauthorized' }, 401)
  const data = await c.req.json()
  const id = data.id || crypto.randomUUID()
  const now = new Date().toISOString()
  const profile = await c.env.DB.prepare("SELECT username, name FROM public_profiles WHERE user_id = ?").bind(u.id).first<any>()
  const username = profile?.username || profile?.name?.toLowerCase().replace(/\s+/g, '') || u.id
  await c.env.DB.prepare(
    'INSERT INTO spaces (id, user_id, username, title, description, image_url, markers, is_public, is_starred, space_type, display_order, views, clicks, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0, ?, ?)'
  ).bind(
    id, u.id, username, data.title || '', data.description || '', data.imageUrl || '',
    typeof data.markers === 'string' ? data.markers : JSON.stringify(data.markers || []),
    data.isPublic !== false ? 1 : 0, data.isStarred ? 1 : 0,
    data.spaceType || data.space_type || 'TAGGABLE_ITEM_SPACE',
    data.order ?? data.displayOrder ?? 0, now, now
  ).run()
  const space = await c.env.DB.prepare('SELECT * FROM spaces WHERE id = ?').bind(id).first()
  return c.json({ space: normalizeSpace(space) }, 201)
})

app.put('/api/spaces/:id', async (c) => {
  const u = c.get('user')
  if (!u) return c.json({ error: 'Unauthorized' }, 401)
  const id = c.req.param('id')
  const data = await c.req.json()
  const existing = await c.env.DB.prepare('SELECT user_id FROM spaces WHERE id = ?').bind(id).first<any>()
  if (!existing) return c.json({ error: 'Not found' }, 404)
  if (existing.user_id !== u.id && u.role !== 'admin') return c.json({ error: 'Forbidden' }, 403)
  const fieldMap: Record<string, string> = {
    title: 'title', description: 'description', imageUrl: 'image_url',
    markers: 'markers', isPublic: 'is_public', isStarred: 'is_starred',
    spaceType: 'space_type', order: 'display_order', displayOrder: 'display_order',
    views: 'views', clicks: 'clicks'
  }
  const sets: string[] = []
  const vals: any[] = []
  for (const [key, col] of Object.entries(fieldMap)) {
    if (data[key] !== undefined) {
      sets.push(`${col} = ?`)
      let val = data[key]
      if (key === 'markers' && typeof val !== 'string') val = JSON.stringify(val)
      if (key === 'isPublic') val = val ? 1 : 0
      if (key === 'isStarred') val = val ? 1 : 0
      vals.push(val)
    }
  }
  if (sets.length > 0) {
    sets.push('updated_at = ?'); vals.push(new Date().toISOString(), id)
    await c.env.DB.prepare(`UPDATE spaces SET ${sets.join(', ')} WHERE id = ?`).bind(...vals).run()
  }
  const space = await c.env.DB.prepare('SELECT * FROM spaces WHERE id = ?').bind(id).first()
  return c.json({ space: normalizeSpace(space) })
})

app.delete('/api/spaces/:id', async (c) => {
  const u = c.get('user')
  if (!u) return c.json({ error: 'Unauthorized' }, 401)
  const id = c.req.param('id')
  const existing = await c.env.DB.prepare('SELECT user_id FROM spaces WHERE id = ?').bind(id).first<any>()
  if (!existing) return c.json({ error: 'Not found' }, 404)
  if (existing.user_id !== u.id && u.role !== 'admin') return c.json({ error: 'Forbidden' }, 403)
  await c.env.DB.prepare('DELETE FROM spaces WHERE id = ?').bind(id).run()
  return c.json({ ok: true })
})

app.post('/api/spaces/:id/interact', async (c) => {
  const u = c.get('user')
  const id = c.req.param('id')
  const data = await c.req.json()
  const space = await c.env.DB.prepare('SELECT user_id FROM spaces WHERE id = ?').bind(id).first<any>()
  if (space) {
    if (data.type === 'view') await c.env.DB.prepare('UPDATE spaces SET views = views + 1 WHERE id = ?').bind(id).run()
    else if (data.type === 'click' || data.type === 'buy_button_click') await c.env.DB.prepare('UPDATE spaces SET clicks = clicks + 1 WHERE id = ?').bind(id).run()
    await c.env.DB.prepare(
      'INSERT INTO interactions (id, user_id, creator_id, target_id, type, space_id, marker_id, product_title, metadata, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
    ).bind(crypto.randomUUID(), u?.id || null, space.user_id, id, data.type || 'view', id, data.markerId || null, data.productTitle || null, JSON.stringify(data.metadata || {}), new Date().toISOString()).run()
  }
  return c.json({ ok: true })
})

// ─── PRODUCTS ─────────────────────────────────────────────────────────────────

app.get('/api/products/trending', async (c) => {
  const { results } = await c.env.DB.prepare('SELECT * FROM products ORDER BY interactions_count DESC LIMIT 20').all()
  return c.json({ products: results })
})

app.get('/api/products', async (c) => {
  const brandId = c.req.query('brandId')
  if (brandId) {
    const { results } = await c.env.DB.prepare('SELECT * FROM products WHERE brand_id = ? ORDER BY created_at DESC').bind(brandId).all()
    return c.json({ products: results })
  }
  const { results } = await c.env.DB.prepare('SELECT * FROM products ORDER BY interactions_count DESC').all()
  return c.json({ products: results })
})

app.post('/api/products', async (c) => {
  const u = c.get('user')
  if (!u) return c.json({ error: 'Unauthorized' }, 401)
  const data = await c.req.json()
  const id = crypto.randomUUID()
  await c.env.DB.prepare(
    'INSERT INTO products (id, brand_id, name, description, price, image_url, category, buy_link, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
  ).bind(id, u.id, data.name || '', data.description || '', data.price || 0, data.imageUrl || '', data.category || '', data.buyLink || '', new Date().toISOString()).run()
  const product = await c.env.DB.prepare('SELECT * FROM products WHERE id = ?').bind(id).first()
  return c.json({ product }, 201)
})

app.put('/api/products/:id', async (c) => {
  const u = c.get('user')
  if (!u) return c.json({ error: 'Unauthorized' }, 401)
  const data = await c.req.json()
  const id = c.req.param('id')
  const colMap: Record<string, any> = { name: data.name, description: data.description, price: data.price, image_url: data.imageUrl, category: data.category, buy_link: data.buyLink }
  const entries = Object.entries(colMap).filter(([, v]) => v !== undefined)
  if (entries.length > 0) {
    await c.env.DB.prepare(`UPDATE products SET ${entries.map(([k]) => `${k} = ?`).join(', ')} WHERE id = ?`).bind(...entries.map(([, v]) => v), id).run()
  }
  return c.json({ product: await c.env.DB.prepare('SELECT * FROM products WHERE id = ?').bind(id).first() })
})

app.delete('/api/products/:id', async (c) => {
  const u = c.get('user')
  if (!u) return c.json({ error: 'Unauthorized' }, 401)
  await c.env.DB.prepare('DELETE FROM products WHERE id = ?').bind(c.req.param('id')).run()
  return c.json({ ok: true })
})

// ─── CAMPAIGNS ────────────────────────────────────────────────────────────────

app.get('/api/campaigns', async (c) => {
  const brandId = c.req.query('brandId')
  if (!brandId) return c.json({ error: 'brandId required' }, 400)
  const { results } = await c.env.DB.prepare('SELECT * FROM campaigns WHERE brand_id = ? ORDER BY created_at DESC').bind(brandId).all()
  return c.json({ campaigns: results.map(r => ({ ...r, selectedCreators: parseJson((r as any).selected_creators, []) })) })
})

app.post('/api/campaigns', async (c) => {
  const u = c.get('user')
  if (!u) return c.json({ error: 'Unauthorized' }, 401)
  const data = await c.req.json()
  const id = crypto.randomUUID()
  const now = new Date().toISOString()
  await c.env.DB.prepare(
    'INSERT INTO campaigns (id, brand_id, name, goal, product_link, budget, category, collab_type, instructions, deadline, platform, status, selected_creators, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
  ).bind(id, u.id, data.name || '', data.goal || '', data.productLink || '', data.budget || '', data.category || '', data.collabType || '', data.instructions || '', data.deadline || null, data.platform || '', 'active', JSON.stringify(data.selectedCreators || []), now).run()
  // Auto-create tasks for selected creators
  if (data.selectedCreators?.length) {
    for (const creatorId of data.selectedCreators) {
      await c.env.DB.prepare(
        'INSERT INTO tasks (id, brand_id, creator_id, campaign_id, title, description, deadline, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
      ).bind(crypto.randomUUID(), u.id, creatorId, id, data.name, data.instructions || '', data.deadline || null, 'pending', now).run()
    }
  }
  return c.json({ campaign: await c.env.DB.prepare('SELECT * FROM campaigns WHERE id = ?').bind(id).first() }, 201)
})

app.put('/api/campaigns/:id', async (c) => {
  const u = c.get('user')
  if (!u) return c.json({ error: 'Unauthorized' }, 401)
  const { status } = await c.req.json()
  if (status) await c.env.DB.prepare('UPDATE campaigns SET status = ? WHERE id = ?').bind(status, c.req.param('id')).run()
  return c.json({ campaign: await c.env.DB.prepare('SELECT * FROM campaigns WHERE id = ?').bind(c.req.param('id')).first() })
})

// ─── TASKS ────────────────────────────────────────────────────────────────────

app.get('/api/tasks', async (c) => {
  const brandId = c.req.query('brandId')
  const creatorId = c.req.query('creatorId')
  if (brandId && creatorId) {
    const { results } = await c.env.DB.prepare('SELECT * FROM tasks WHERE brand_id = ? AND creator_id = ? ORDER BY created_at DESC').bind(brandId, creatorId).all()
    return c.json({ tasks: results })
  }
  if (brandId) {
    const { results } = await c.env.DB.prepare('SELECT * FROM tasks WHERE brand_id = ? ORDER BY created_at DESC').bind(brandId).all()
    return c.json({ tasks: results })
  }
  if (creatorId) {
    const { results } = await c.env.DB.prepare('SELECT * FROM tasks WHERE creator_id = ? ORDER BY created_at DESC').bind(creatorId).all()
    return c.json({ tasks: results })
  }
  return c.json({ error: 'brandId or creatorId required' }, 400)
})

app.post('/api/tasks', async (c) => {
  const u = c.get('user')
  if (!u) return c.json({ error: 'Unauthorized' }, 401)
  const data = await c.req.json()
  const id = crypto.randomUUID()
  await c.env.DB.prepare(
    'INSERT INTO tasks (id, brand_id, creator_id, campaign_id, title, description, deadline, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
  ).bind(id, u.id, data.creatorId, data.campaignId || null, data.title, data.description || '', data.deadline || null, 'pending', new Date().toISOString()).run()
  return c.json({ task: await c.env.DB.prepare('SELECT * FROM tasks WHERE id = ?').bind(id).first() }, 201)
})

app.put('/api/tasks/:id', async (c) => {
  const u = c.get('user')
  if (!u) return c.json({ error: 'Unauthorized' }, 401)
  const data = await c.req.json()
  if (data.status) await c.env.DB.prepare('UPDATE tasks SET status = ? WHERE id = ?').bind(data.status, c.req.param('id')).run()
  if (data.contentUrl) await c.env.DB.prepare('UPDATE tasks SET content_url = ? WHERE id = ?').bind(data.contentUrl, c.req.param('id')).run()
  return c.json({ task: await c.env.DB.prepare('SELECT * FROM tasks WHERE id = ?').bind(c.req.param('id')).first() })
})

// ─── INTERACTIONS / ANALYTICS ─────────────────────────────────────────────────

app.get('/api/interactions', async (c) => {
  const creatorId = c.req.query('creatorId')
  const brandId = c.req.query('brandId')
  if (creatorId) {
    const { results } = await c.env.DB.prepare('SELECT * FROM interactions WHERE creator_id = ? ORDER BY created_at DESC LIMIT 500').bind(creatorId).all()
    return c.json({ interactions: results })
  }
  if (brandId) {
    const { results } = await c.env.DB.prepare(
      'SELECT i.* FROM interactions i WHERE i.creator_id IN (SELECT DISTINCT creator_id FROM tasks WHERE brand_id = ?) ORDER BY i.created_at DESC LIMIT 500'
    ).bind(brandId).all()
    return c.json({ interactions: results })
  }
  return c.json({ error: 'creatorId or brandId required' }, 400)
})

// ─── FILE UPLOAD (R2) ─────────────────────────────────────────────────────────

app.post('/api/upload', async (c) => {
  const u = c.get('user')
  if (!u) return c.json({ error: 'Unauthorized' }, 401)
  const formData = await c.req.formData()
  const file = formData.get('file') as File | null
  if (!file) return c.json({ error: 'No file provided' }, 400)
  const ext = file.name?.split('.').pop() || 'bin'
  const key = `uploads/${crypto.randomUUID()}.${ext}`
  await c.env.BUCKET.put(key, await file.arrayBuffer(), { httpMetadata: { contentType: file.type || 'application/octet-stream' } })
  return c.json({ url: `/api/files/${key}`, key })
})

app.get('/api/files/*', async (c) => {
  const key = c.req.path.replace('/api/files/', '')
  const obj = await c.env.BUCKET.get(key)
  if (!obj) return c.notFound()
  const headers = new Headers()
  obj.writeHttpMetadata(headers)
  headers.set('etag', obj.httpEtag)
  headers.set('cache-control', 'public, max-age=31536000')
  return new Response(obj.body, { headers })
})

// ─── ADMIN ────────────────────────────────────────────────────────────────────

app.get('/api/admin/stats', async (c) => {
  const u = c.get('user')
  if (!u || u.role !== 'admin') return c.json({ error: 'Forbidden' }, 403)
  const [interactionsRow, purchasesRow] = await Promise.all([
    c.env.DB.prepare('SELECT COUNT(*) as count FROM interactions').first<any>(),
    c.env.DB.prepare("SELECT COUNT(*) as count FROM interactions WHERE type = 'purchase'").first<any>()
  ])
  return c.json({ totalInteractions: interactionsRow?.count || 0, totalPurchases: purchasesRow?.count || 0 })
})

app.get('/api/admin/emails', async (c) => {
  const u = c.get('user')
  if (!u || u.role !== 'admin') return c.json({ error: 'Forbidden' }, 403)
  const { results } = await c.env.DB.prepare('SELECT * FROM admin_emails ORDER BY added_at DESC').all()
  return c.json({ emails: results })
})

app.post('/api/admin/emails', async (c) => {
  const u = c.get('user')
  if (!u || u.role !== 'admin') return c.json({ error: 'Forbidden' }, 403)
  const { email } = await c.req.json()
  if (!email) return c.json({ error: 'email required' }, 400)
  const normalized = email.toLowerCase().trim()
  try {
    await c.env.DB.prepare('INSERT INTO admin_emails (email, added_by, added_at) VALUES (?, ?, ?)').bind(normalized, u.id, new Date().toISOString()).run()
  } catch { return c.json({ error: 'Email already exists' }, 409) }
  return c.json({ ok: true }, 201)
})

app.delete('/api/admin/emails/:email', async (c) => {
  const u = c.get('user')
  if (!u || u.role !== 'admin') return c.json({ error: 'Forbidden' }, 403)
  const email = decodeURIComponent(c.req.param('email')).toLowerCase()
  await c.env.DB.prepare('DELETE FROM admin_emails WHERE email = ?').bind(email).run()
  const target = await c.env.DB.prepare('SELECT id FROM users WHERE email = ?').bind(email).first<any>()
  if (target) await c.env.DB.prepare("UPDATE users SET role = 'shopper' WHERE id = ? AND email != 'kristiss747@gmail.com'").bind(target.id).run()
  return c.json({ ok: true })
})

// ─── AI ───────────────────────────────────────────────────────────────────────

app.post('/api/detect-objects', async (c) => {
  const formData = await c.req.formData()
  const imageFile = formData.get('image') as File | null
  if (!imageFile) return c.json({ error: 'No image provided' }, 400)
  const credJson = c.env.GOOGLE_APPLICATION_CREDENTIALS_JSON
  if (!credJson) return c.json({ error: 'Vision API not configured' }, 500)
  try {
    const buf = await imageFile.arrayBuffer()
    const b64 = btoa(String.fromCharCode(...new Uint8Array(buf)))
    const token = await getGoogleAccessToken(credJson)
    const resp = await fetch('https://vision.googleapis.com/v1/images:annotate', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ requests: [{ image: { content: b64 }, features: [{ type: 'OBJECT_LOCALIZATION', maxResults: 20 }] }] })
    })
    const result = await resp.json() as any
    const objects = (result.responses?.[0]?.localizedObjectAnnotations || []).map((obj: any, i: number) => ({
      id: obj.mid || `obj_${i}`, name: obj.name, confidence: obj.score,
      boundingBox: { vertices: (obj.boundingPoly?.normalizedVertices || []).map((v: any) => ({ x: v.x || 0, y: v.y || 0 })) }
    }))
    return c.json({ objects })
  } catch (e) {
    console.error('Vision error:', e)
    return c.json({ error: 'Vision API failed' }, 500)
  }
})

app.post('/api/analyze-image', async (c) => {
  const { imageBase64, imageUrl, x, y } = await c.req.json()
  const hasCoords = x !== undefined && y !== undefined
  const ai = new GoogleGenAI({ apiKey: c.env.GEMINI_API_KEY })
  try {
    let imgData: string
    let mimeType = 'image/jpeg'
    if (imageBase64) {
      imgData = imageBase64.replace(/^data:image\/\w+;base64,/, '')
    } else if (imageUrl) {
      const r = await fetch(imageUrl)
      mimeType = r.headers.get('content-type') || 'image/jpeg'
      imgData = btoa(String.fromCharCode(...new Uint8Array(await r.arrayBuffer())))
    } else {
      return c.json({ error: 'imageBase64 or imageUrl required' }, 400)
    }
    const promptText = hasCoords
      ? `Identify the single most prominent product at approximately x=${x.toFixed(1)}%, y=${y.toFixed(1)}% from top-left in this image. Return JSON with: title, price (string), currency, description (2 sentences), boundingBoxes [{x,y,width,height} as percentages].`
      : `Identify 3-5 prominent products in this image. Return a JSON array, each with: title, price (string), currency, description (2 sentences), boundingBoxes [{x,y,width,height} as percentages].`
    const itemSchema = {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING }, price: { type: Type.STRING }, currency: { type: Type.STRING },
        description: { type: Type.STRING },
        boundingBoxes: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { x: { type: Type.NUMBER }, y: { type: Type.NUMBER }, width: { type: Type.NUMBER }, height: { type: Type.NUMBER } } } }
      }
    }
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: [{ role: 'user', parts: [{ inlineData: { mimeType, data: imgData } }, { text: promptText }] }],
      config: { responseMimeType: 'application/json', responseSchema: hasCoords ? itemSchema : { type: Type.ARRAY, items: itemSchema } }
    })
    const parsed = JSON.parse(response.text || (hasCoords ? '{}' : '[]'))
    return c.json(hasCoords ? { product: parsed } : { products: parsed })
  } catch (e) {
    console.error('Gemini error:', e)
    return c.json({ error: 'AI analysis failed' }, 500)
  }
})

app.post('/api/generate-description', async (c) => {
  const { title } = await c.req.json()
  if (!title) return c.json({ error: 'title required' }, 400)
  const ai = new GoogleGenAI({ apiKey: c.env.GEMINI_API_KEY })
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: [{ role: 'user', parts: [{ text: `Write a short, engaging product description (max 2 sentences) for a product named "${title}". Make it sound appealing to a shopper.` }] }]
    })
    return c.json({ description: response.text })
  } catch {
    return c.json({ error: 'Generation failed' }, 500)
  }
})

// ─── Export ───────────────────────────────────────────────────────────────────

export const onRequest = handle(app)
