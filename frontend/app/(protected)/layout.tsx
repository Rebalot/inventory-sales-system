'use client'

import NavigationLayout from '@/components/navigation/NavigationLayout'
import { useAuth } from '@/lib/auth-context'

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
    const { user, isLoggingIn } = useAuth();
    
    if (isLoggingIn || !user) {
        return null
      }
    return (
    <NavigationLayout>
    {children}
    </NavigationLayout>
    )
}