'use client'

import { createContext, useContext, ReactNode, useState, useEffect } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { Role, checkRoutePermission } from '@/lib/roles'
import { API_ENDPOINTS } from '../config'
import { authFetch } from '../fetch'

export interface User {
  id: string
  email: string
  firstName: string,
  lastName?: string,
  avatar: string,
  role: Role[]
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  setIsLoading: (loading: boolean) => void
  clearError: () => void
  canAccessRoute: (pathname: string) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    const fetchUser = async () => {
      console.log('Fetching user...')
      try {
        const res = await authFetch(API_ENDPOINTS.AUTH.ME)
        if (!res.ok) {
          return setUser(null)
        }
        const data = await res.json()
        setUser(data)
      } catch {
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }
  
    fetchUser()
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    setError(null)
    
    try {
      console.log('Iniciando sesión...')
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
    
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      await authFetch(API_ENDPOINTS.AUTH.LOGOUT, {
        method: 'POST',
      })
      router.replace('/login')
      setTimeout(() => {
        setUser(null);
      }, 50);
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const canAccessRoute = (pathname: string): boolean => {
    console.log('User canAccessRoute:', user)
    if (!user) return false;
    return checkRoutePermission(pathname, user.role);
  }

  const clearError = () => setError(null)

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      error,
      login,
      logout,
      setIsLoading,
      canAccessRoute,
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