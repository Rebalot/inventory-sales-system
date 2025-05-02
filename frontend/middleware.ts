import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { checkRoutePermission, getMatchedProtectedRoute, PUBLIC_ROUTES } from './lib/roles'
import { API_ENDPOINTS } from './lib/config'

export async function middleware(request: NextRequest) {

  const { pathname } = request.nextUrl
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', request.url), 307)
  }
  console.log('Ruta solicitada:', pathname) 
  // 1. Rutas públicas (siempre accesibles)
  // Comprobar si la ruta solicitada existe en la lista de rutas públicas
  if (PUBLIC_ROUTES.some(path => pathname.startsWith(path))) {
    console.log('Ruta pública, permitiendo acceso:', pathname)
    return NextResponse.next()
  }
  // 2. Comprobar si la ruta solicitada existe en las rutas protegidas
  // Si la ruta no es pública ni protegida, redirigir a /not-found
  if (!getMatchedProtectedRoute(pathname)) {
    console.log('Ruta no encontrada, redirigiendo a /not-found...')
    return NextResponse.redirect(new URL('/not-found', request.url), 307)
  }

  try {
    // 3. Verificar autenticación
    const authResponse = await fetch(API_ENDPOINTS.AUTH.ME, {
      headers: {
        Cookie: request.headers.get('cookie') || '', // reenviando la cookie que vino del navegador
      },
    })

    // 4. Si no está autenticado, redirigir a login
    if (!authResponse.ok) {
      console.log('No autenticado, redirigiendo a /login...')
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl, 307); // 307 Temporary Redirect
    }

    const user = await authResponse.json()
    console.log('Usuario autenticado:', user)
    // 5. Verificar permisos de ruta
    const hasPermission = checkRoutePermission(pathname, user.role)

    // 6. Si no tiene permisos, redirigir
    if (!hasPermission) {
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