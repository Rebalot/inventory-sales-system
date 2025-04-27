'use client'

import { createContext, useContext, ReactNode, useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { ROLES, checkRoutePermission } from '@/lib/roles'
import { API_ENDPOINTS, authFetch } from '../config'

interface User {
  id: string
  email: string
  name: string
  roles: string[]
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  hasRole: (role: string) => boolean
  checkAccess: (path?: string) => boolean
  clearError: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  // Verificar sesión al cargar
  useEffect(() => {
    if (['/login', '/unauthorized'].includes(pathname)) return;
    if (!document.cookie.includes('access_token')) return;
    const validateSession = async () => {
      try {
        const res = await authFetch(API_ENDPOINTS.AUTH.ME);
        
        if (res.ok) {
          const userData = await res.json()
          setUser(userData)
        }
      } catch (error) {
        console.error('Session validation error:', error)
      } finally {
        setIsLoading(false)
      }
    }

    validateSession()
  }, [pathname])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const res = await authFetch(API_ENDPOINTS.AUTH.LOGIN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || 'Login failed')
      }

      const userData = await res.json()
      setUser(userData)
      
      // // Redirigir según roles después de login
      // const redirectPath = userData.roles.includes(ROLES.ADMIN) ? '/admin' : '/dashboard'
      // router.push(redirectPath)
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    await authFetch(API_ENDPOINTS.AUTH.LOGOUT, {
      method: 'POST',
    })
    setUser(null)
    router.push('/login')
  }

  const hasRole = (role: string) => {
    return user?.roles.includes(role) ?? false
  }

  const checkAccess = (path = pathname) => {
    return checkRoutePermission(path, user?.roles || [])
  }

  const clearError = () => setError(null)

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      error,
      login,
      logout,
      hasRole,
      checkAccess,
      clearError
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}