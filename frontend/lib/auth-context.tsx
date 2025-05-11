'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User } from './types/user.interface'
import { API_ENDPOINTS } from './config'
import { usePathname } from 'next/navigation'

type AuthContextType = {
    user: User | null
    isLoggingIn: boolean
    isLoggingOut: boolean
    isLoading: boolean
    error: string | null
    login: (email: string, password: string) => Promise<boolean>
    logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoggingIn, setLoggingIn] = useState(false)
const [isLoggingOut, setLoggingOut] = useState(false)
  const isLoading = isLoggingIn || isLoggingOut
  const [error, setError] = useState<string | null>(null)
  const pathname = usePathname()
  useEffect(() => {
    const loadUser = async () => {
      setLoggingIn(true)
      try {
        const res = await fetch(API_ENDPOINTS.AUTH.ME, {
          credentials: 'include',
        })

        if (res.ok) {
          const data = await res.json()
          console.log('User data AuthContext:', data)
          setUser(data)
        } else {
          setUser(null)
        }
      } catch {
        setUser(null)
      } finally {
        setLoggingIn(false)
      }
    }

    loadUser()
  }, [])

  useEffect(() => {
    if (!isLoggingOut) return;

    if (pathname === '/login') {
      setUser(null);
    }
  }, [isLoggingOut, pathname]);

  const login = async (email: string, password: string) => {
    setLoggingIn(true)
    setError(null)
    
    try {
        const res = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        })
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}))
          console.error('Login error:', errorData)
          throw new Error(errorData.message || 'Invalid credentials')
        }
    
        const userRes = await fetch(API_ENDPOINTS.AUTH.ME, {
          credentials: 'include',
        })
    
        if (!userRes.ok) {
          throw new Error('Failed to fetch user data after login')
        }
    
        const data = await userRes.json()
        setUser(data)
        return true
        
        } catch (err: any) {
          console.error('Login error:', err)
          setError(err.message || 'An error occurred during login')
          return false
        } finally {
          setLoggingIn(false)
        }
  }

  const logout = async () => {
    setLoggingOut(true)
    setError(null)
    
    try {
        await fetch(API_ENDPOINTS.AUTH.LOGOUT, {
        method: 'POST',
        credentials: 'include',
        })
    } catch (err: any) {
        console.error('Logout error:', err)
        setError(err.message || 'Failed to log out. Please try again.')
    } finally {
        setLoggingOut(false)
  }
  }

  return (
    <AuthContext.Provider value={{ user, error, isLoggingIn, isLoggingOut, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}