'use client'

import NavigationLayout from '@/components/navigation/NavigationLayout'
import { useAuth } from '@/lib/AuthContext'
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
    const { user, isLoggingIn, isLoading } = useAuth();
    const router = useRouter()

    useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/login')
    }
  }, [isLoading, user])
  
    if (isLoggingIn || !user) {
        return null
      }
    return (
    <NavigationLayout>
    {children}
    </NavigationLayout>
    )
}