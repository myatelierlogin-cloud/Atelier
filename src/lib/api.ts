const BASE = '/api'

async function req<T = any>(path: string, opts?: RequestInit): Promise<T> {
  const resp = await fetch(`${BASE}${path}`, {
    ...opts,
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...opts?.headers },
  })
  if (!resp.ok) {
    const body = await resp.json().catch(() => ({ error: 'Request failed' }))
    throw Object.assign(new Error((body as any).error || 'Request failed'), { status: resp.status, code: (body as any).code })
  }
  return resp.json()
}

export const api = {
  auth: {
    me: () => req('/auth/me'),
    login: (email: string, password: string) => req('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
    register: (data: { email: string; password: string; role: string; name?: string; niche?: string; bio?: string; website?: string; industry?: string }) =>
      req('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
    logout: () => req('/auth/logout', { method: 'POST' }),
    googleLogin: () => { window.location.href = '/api/auth/google' },
  },

  profile: {
    get: (uid: string) => req(`/users/profile/${uid}`),
    byUsername: (username: string) => req(`/users/by-username/${username}`),
    update: (data: Record<string, any>) => req('/users/profile', { method: 'PUT', body: JSON.stringify(data) }),
    creators: () => req('/users/creators'),
    all: () => req('/users/all'),
    updateRole: (uid: string, role: string) => req(`/users/role/${uid}`, { method: 'PUT', body: JSON.stringify({ role }) }),
  },

  spaces: {
    list: (params?: { userId?: string; username?: string }) => {
      const qs = params ? '?' + new URLSearchParams(params as any).toString() : ''
      return req(`/spaces${qs}`)
    },
    all: () => req('/spaces/all'),
    public: (username: string) => req(`/spaces/public?username=${encodeURIComponent(username)}`),
    categories: () => req('/spaces/categories'),
    create: (data: Record<string, any>) => req('/spaces', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Record<string, any>) => req(`/spaces/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    remove: (id: string) => req(`/spaces/${id}`, { method: 'DELETE' }),
    interact: (id: string, data: { type: string; markerId?: string; productTitle?: string; metadata?: any }) =>
      req(`/spaces/${id}/interact`, { method: 'POST', body: JSON.stringify(data) }),
  },

  products: {
    list: (brandId?: string) => req(brandId ? `/products?brandId=${brandId}` : '/products'),
    trending: () => req('/products/trending'),
    create: (data: Record<string, any>) => req('/products', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Record<string, any>) => req(`/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    remove: (id: string) => req(`/products/${id}`, { method: 'DELETE' }),
  },

  campaigns: {
    list: (brandId: string) => req(`/campaigns?brandId=${brandId}`),
    create: (data: Record<string, any>) => req('/campaigns', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Record<string, any>) => req(`/campaigns/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  },

  tasks: {
    list: (params: { brandId?: string; creatorId?: string }) =>
      req('/tasks?' + new URLSearchParams(params as any).toString()),
    create: (data: Record<string, any>) => req('/tasks', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Record<string, any>) => req(`/tasks/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  },

  interactions: {
    list: (params: { creatorId?: string; brandId?: string }) =>
      req('/interactions?' + new URLSearchParams(params as any).toString()),
  },

  admin: {
    stats: () => req('/admin/stats'),
    emails: () => req('/admin/emails'),
    addEmail: (email: string) => req('/admin/emails', { method: 'POST', body: JSON.stringify({ email }) }),
    removeEmail: (email: string) => req(`/admin/emails/${encodeURIComponent(email)}`, { method: 'DELETE' }),
  },

  upload: async (file: File | Blob, filename?: string): Promise<{ url: string; key: string }> => {
    const form = new FormData()
    form.append('file', file, filename)
    const resp = await fetch('/api/upload', { method: 'POST', body: form, credentials: 'include' })
    if (!resp.ok) throw new Error('Upload failed')
    return resp.json()
  },

  ai: {
    detectObjects: async (imageBlob: Blob): Promise<{ objects: any[] }> => {
      const form = new FormData()
      form.append('image', imageBlob)
      const resp = await fetch('/api/detect-objects', { method: 'POST', body: form, credentials: 'include' })
      return resp.json()
    },
    analyzeImage: (data: { imageBase64?: string; imageUrl?: string; x?: number; y?: number }) =>
      req('/analyze-image', { method: 'POST', body: JSON.stringify(data) }),
    generateDescription: (title: string) =>
      req('/generate-description', { method: 'POST', body: JSON.stringify({ title }) }),
  },
}
