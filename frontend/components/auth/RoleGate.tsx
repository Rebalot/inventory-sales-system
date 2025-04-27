'use client'

import { useAuth } from '@/lib/auth/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { checkRoutePermission } from '@/lib/roles'

export default function RoleGate({
  children,
  allowedRoles,
  redirectPath = '/unauthorized'
}: {
  children: React.ReactNode
  allowedRoles: string[]
  redirectPath?: string
}) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && user && !allowedRoles.some(role => user.roles.includes(role))) {
      router.push(redirectPath)
    }
  }, [user, isLoading, router, allowedRoles, redirectPath])

  if (isLoading) return <div>Loading...</div>
  if (!user || !allowedRoles.some(role => user.roles.includes(role))) return null

  return <>{children}</>
}