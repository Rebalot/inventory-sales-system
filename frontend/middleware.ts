import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { ROUTE_PERMISSIONS } from './lib/roles'
import { API_ENDPOINTS } from './lib/config'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  console.log('Ruta solicitada:', pathname) 
  // 1. Rutas públicas (siempre accesibles)
  const publicPaths = ['/login', '/unauthorized']
  if (publicPaths.some(path => pathname.startsWith(path))) {
    console.log('Ruta pública, permitiendo acceso:', pathname)
    return NextResponse.next()
  }

  try {
    // 2. Verificar autenticación
    const authResponse = await fetch(API_ENDPOINTS.AUTH.ME, {
      headers: { Cookie: request.headers.get('cookie') || '' },
      credentials: 'include'
    })

    // 3. Si no está autenticado, redirigir a login
    if (!authResponse.ok) {
      console.log('No autenticado, redirigiendo a /login...')
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl, 307); // 307 Temporary Redirect
    }

    const user = await authResponse.json()
    console.log('Usuario autenticado:', user)
    // 4. Verificar permisos de ruta
    const hasPermission = Object.entries(ROUTE_PERMISSIONS)
      .filter(([route]) => pathname.startsWith(route))
      .some(([_, roles]) => (roles as string[]).some(role => user.roles.includes(role)))

    // 5. Si no tiene permisos, redirigir
    if (!hasPermission && Object.keys(ROUTE_PERMISSIONS).some(route => pathname.startsWith(route))) {
      console.log('No tiene permisos para esta ruta, redirigiendo...')
      return NextResponse.redirect(new URL('/unauthorized', request.url), 307)
    }

    return NextResponse.next()
  } catch (error) {
    console.error('Middleware error:', error)
    return NextResponse.redirect(new URL('/login', request.url), 307) // Redirigir a login en caso de error
  }
}

// Configuración del matcher
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images/ (image files)
     * - api/auth (auth API routes)
     */
    '/((?!_next/static|_next/image|favicon.ico|images/|api/auth).*)'
  ]
}