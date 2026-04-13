import React, { createContext, useContext, useEffect, useState } from 'react'
import { api } from '../lib/api'

export type Role = 'shopper' | 'creator' | 'brand' | 'admin' | 'pending'

export interface UserProfile {
  uid: string
  id: string
  email: string
  role: Role
  name: string
  displayName?: string
  bio?: string
  niche?: string
  website?: string
  industry?: string
  avatarUrl?: string
  photoURL?: string
  theme?: string
  externalLinks?: any[]
  socialLinks?: any[]
  customSpaceOrder?: string[]
  username?: string
  createdAt?: any
}

// Minimal user object — just enough for auth checks
export interface AuthUser {
  uid: string
  email: string
}

interface AuthContextType {
  user: AuthUser | null
  profile: UserProfile | null
  loading: boolean
  simulatedRole: Role | null
  setSimulatedRole: (role: Role | null) => void
  loginWithGoogle: () => void
  loginWithEmail: (email: string, pass: string) => Promise<void>
  registerWithEmail: (email: string, pass: string, role: Role, data: any) => Promise<void>
  logout: () => Promise<void>
  updateProfile: (data: Partial<UserProfile>) => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  simulatedRole: null,
  setSimulatedRole: () => {},
  loginWithGoogle: () => {},
  loginWithEmail: async () => {},
  registerWithEmail: async () => {},
  logout: async () => {},
  updateProfile: async () => {},
})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [simulatedRole, setSimulatedRole] = useState<Role | null>(null)

  // On mount: check session via API
  useEffect(() => {
    api.auth.me()
      .then(({ user: u }) => {
        if (u) {
          setUser({ uid: u.uid || u.id, email: u.email })
          setProfile(u as UserProfile)
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const loginWithGoogle = () => {
    // Redirects to Google OAuth — page will reload after callback sets session cookie
    window.location.href = '/api/auth/google'
  }

  const loginWithEmail = async (email: string, pass: string) => {
    const { user: u } = await api.auth.login(email, pass)
    setUser({ uid: u.uid || u.id, email: u.email })
    setProfile(u as UserProfile)
  }

  const registerWithEmail = async (email: string, pass: string, role: Role, data: any) => {
    const { user: u } = await api.auth.register({ email, password: pass, role, ...data })
    setUser({ uid: u.uid || u.id, email: u.email })
    setProfile(u as UserProfile)
  }

  const logout = async () => {
    await api.auth.logout()
    setUser(null)
    setProfile(null)
    setSimulatedRole(null)
  }

  const updateProfile = async (data: Partial<UserProfile>) => {
    const { profile: updated } = await api.profile.update(data)
    setProfile(updated as UserProfile)
    if (updated) setUser({ uid: updated.uid || updated.id, email: updated.email })
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, simulatedRole, setSimulatedRole, loginWithGoogle, loginWithEmail, registerWithEmail, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}
