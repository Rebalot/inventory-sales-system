'use client';

import { useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import { checkRoutePermission, isProtectedRoute, isPublicRoute, pathExists } from '@/lib/roles';
import { red } from '@mui/material/colors';

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect');
  
  useEffect(() => {
    console.log('User en RequireAuth: ', user)
    const redirectPath = redirect ? redirect : pathname
        
    if (!isLoading && user) {
        if(isProtectedRoute(redirectPath) || redirectPath === '/login') {
            console.log('Ruta en RequireAuth:', redirectPath)
            const pathnameExists = pathExists(redirectPath)
            if (!pathnameExists) {
                console.log('Route not found:', pathname)
                router.replace('/not-found')
                return
            }
            const isAuthorized = checkRoutePermission(redirectPath, user.role)
            if (!isAuthorized) {
                console.log('User does not have permission to access this route:', redirectPath)
                router.replace('/dashboard')
                return
            }
            
            console.log('User is authorized, redirecting to:', redirectPath)
            router.replace(redirectPath);
        }
    }
  }, [user]);

  return <>{children}</>;
}