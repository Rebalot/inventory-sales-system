import { NextRequest, NextResponse } from 'next/server'
import { checkRoutePermission, isProtectedPath, isPublicPath, pathExists } from './lib/utils/routes'
import { Role } from './lib/constants'
import { jwtDecode } from 'jwt-decode'

export default async function middleware(req: NextRequest) {
  // Check if the current route is protected or public
  const currentPath = req.nextUrl.pathname
  const previousPath = req.cookies.get('previousPath')?.value
  const isPublicRoute = isPublicPath(currentPath)
  const response = NextResponse.next()
  const token = req.cookies.get('session')?.value
  
  if (currentPath === '/') {
    if (token) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    } else {
      return NextResponse.redirect(new URL('/login', req.url))
    }
  }
console.log('Ruta actual:', currentPath)

  // if(currentPath === '/'){
  //   return NextResponse.redirect(new URL('/dashboard', req.nextUrl))
  // }
  // console.log('Ruta actual:', currentPath)

  if (!pathExists(currentPath)) {
    console.log('Ruta no encontrada, redirigiendo a /not-found...')
    return NextResponse.redirect(new URL('/not-found', req.url), 307)
  }
  
  response.cookies.set('previousPath', currentPath, {
    path: '/',
  })

  // if(token){
  //   console.log('Getting session...')
  //   try{
  //     const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
  //     const { payload } = await jwtVerify(token, secret);
  //     console.log('Payload token:', payload)
  //     const role = (payload as { role: Role[] }).role;
  //     console.log('User role:', role)
  //     const hasAccess = checkRoutePermission(currentPath, role)

  //     if(currentPath === '/login') {
  //       console.log('Token encontrado y ruta es /login, redirigiendo a /dashboard...')
  //       return NextResponse.redirect(new URL('/dashboard', req.url), 307)
  //     }
  //     if(!hasAccess && !isPublicRoute) {
  //       return NextResponse.redirect(new URL('/unauthorized', req.nextUrl))
  //     }
  //     return response
  //   }catch (error) {
  //     console.error('Error verifying token:', error)
  //     const loginUrl = new URL('/login', req.url);
  //     loginUrl.searchParams.set('redirect', currentPath);
  //     return NextResponse.redirect(loginUrl, 307);
  //   }
  // }
  // if (isPublicRoute) {
  //   return response
  // }
  // // 4. Redirect to /login if the user is not authenticated
  // console.log('No hay token, redirigiendo a /login...');
  // const loginUrl = new URL('/login', req.url);
  // loginUrl.searchParams.set('redirect', currentPath);
  // return NextResponse.redirect(loginUrl, 307);

  // 🔓 Rutas públicas
  if (isPublicRoute) {
    if (token && currentPath === '/login') {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
    return response
  }

  // 🔐 Rutas protegidas
  if (!token) {
    console.log('No hay token')
    const loginUrl = new URL('/login', req.url)
    loginUrl.searchParams.set('redirect', currentPath)
    return NextResponse.redirect(loginUrl, 307)
  }

  try {
    const decoded: any = jwtDecode(token)

    // ⏰ Expiración visible
    if (decoded.exp * 1000 < Date.now()) {
      const loginUrl = new URL('/login', req.url)
      loginUrl.searchParams.set('redirect', currentPath)
      return NextResponse.redirect(loginUrl, 307)
    }

    // ⚠️ UX-only role check
    const role: Role[] = decoded.role ?? []
    const hasAccess = checkRoutePermission(currentPath, role)

    if (!hasAccess) {
      return NextResponse.redirect(new URL('/unauthorized', req.url))
    }

    return response
  } catch {
    
    const loginUrl = new URL('/login', req.url)
    loginUrl.searchParams.set('redirect', currentPath)
    return NextResponse.redirect(loginUrl, 307)
  }
}

// Routes Middleware should not run on
export const config = {
  matcher: ["/((?!_next|favicon\\.ico|api|images|static).*)"],
}