import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { checkRoutePermission, isPublicRoute, pathExists } from './lib/roles'
import { API_ENDPOINTS } from './lib/config'

export async function middleware(request: NextRequest) {
  const currentPath = request.nextUrl.pathname
  const previousPath = request.cookies.get('previousPath')?.value
  console.log('Ruta anterior:', previousPath)
  if (currentPath === '/') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  console.log('Ruta solicitada:', currentPath) 
  const response = NextResponse.next()
  if (previousPath === currentPath) {
    console.log('Mismo path que antes, no redirige')
    return response
  }
  
  response.cookies.set('previousPath', currentPath, {
    path: '/',
  })
  const accessToken = request.cookies.get('access_token')?.value;

  if(accessToken && currentPath === '/login') {
    console.log('Token encontrado y ruta es /login, redirigiendo a /dashboard...')
    return NextResponse.redirect(new URL('/dashboard', request.url), 307)
  }
  if (isPublicRoute(currentPath)) {
    console.log('Ruta pública, permitiendo acceso:', currentPath)
    return response
  }
  if (!pathExists(currentPath)) {
    console.log('Ruta no encontrada, redirigiendo a /not-found...')
    return NextResponse.redirect(new URL('/not-found', request.url), 307)
  }

  
  if (!accessToken) {
    console.log('No hay token, redirigiendo a /login...');
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', currentPath);
    return NextResponse.redirect(loginUrl, 307);
  }

  try {
    // 3. Verificar autenticación
    const authResponse = await fetch(API_ENDPOINTS.AUTH.ME, {
      headers: {
        Cookie: request.headers.get('cookie') || '', // reenviando la cookie que vino del navegador
      },
    })
    console.log('Respuesta de autenticación:', authResponse.status, authResponse.statusText)
    // 4. Si no está autenticado, redirigir a login
    if (!authResponse.ok) {
      if(authResponse.status === 401) {
        console.log('Token inválido, eliminando cookie...')
        const logoutUrl = new URL('/logout', request.url);
        return NextResponse.redirect(logoutUrl, 307);
      }
      console.log('No autenticado, redirigiendo a /login...')
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', currentPath);
      return NextResponse.redirect(loginUrl, 307); // 307 Temporary Redirect
    }

    const user = await authResponse.json()
    console.log('Usuario autenticado:', user)
    
    // 5. Verificar permisos de ruta
    const hasPermission = checkRoutePermission(currentPath, user.role)

    // 6. Si no tiene permisos, redirigir
    if (!hasPermission) {
      console.log('No tiene permisos para esta ruta, redirigiendo...')
      return NextResponse.redirect(new URL('/unauthorized', request.url), 307)
    }

    return response
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