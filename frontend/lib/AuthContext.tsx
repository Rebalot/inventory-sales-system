'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User } from './types/user.interface'
import { API_ENDPOINTS } from './config'
import { usePathname } from 'next/navigation'
import { set } from 'date-fns'

type AuthContextType = {
    user: User | null
    isLoggingIn: boolean
    isLoggingOut: boolean
    isLoading: boolean
    error: string | null
    login: (email: string, password: string) => Promise<boolean>
    logout: () => Promise<boolean>
}

type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoggingIn, setLoggingIn] = useState(false)
  const [isLoggingOut, setLoggingOut] = useState(false)
  const [status, setStatus] = useState<AuthStatus>('loading')
  const [error, setError] = useState<string | null>(null)
  const pathname = usePathname()

  const loadUser = async () => {
    try {
      const res = await fetch(API_ENDPOINTS.AUTH.ME, {
        credentials: 'include',
      })
      if (!res.ok) {
        setUser(null)
        setStatus('unauthenticated')
        return null
      }
      const data = await res.json()
      console.log('User data AuthContext:', data)
      setUser(data)
      setStatus('authenticated')
      return data
    } catch {
      setUser(null)
      setStatus('unauthenticated')
      return null
    }
  }
  useEffect(() => {
    setStatus('loading')
    loadUser()
  }, [])

  // useEffect(() => {
  //   if (!isLoggingOut) return;

  //   if (pathname === '/login') {
  //     setUser(null);
  //   }
  // }, [isLoggingOut, pathname]);

  const login = async (email: string, password: string) => {
    setStatus('loading')
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
          throw new Error('Invalid credentials')
      }
  
      const user = await loadUser()
      if (!user) {
        throw new Error('Failed to load user data after login')
      }
      return true
    } catch (err: any) {
      console.error('Login error:', err)
      setError(err.message || 'An error occurred during login')
      setStatus('unauthenticated')
      return false
    } finally {
      setLoggingIn(false)
    }
  }

  const logout = async () => {
    setStatus('loading')
    setLoggingOut(true)
    setError(null)
    
    try {
        const res = await fetch(API_ENDPOINTS.AUTH.LOGOUT, {
        method: 'POST',
        credentials: 'include',
        })
        if (!res.ok) {
          throw new Error('Logout failed')
        }
        setUser(null)
        return true
    } catch (err: any) {
        console.error('Logout error:', err)
        setError(err.message || 'Failed to log out. Please try again.')
        setStatus('unauthenticated')
        return false
      } finally {
        setLoggingOut(false)
  }
  }
  
  const isLoading = status === 'loading'
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