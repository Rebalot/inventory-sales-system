import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const PUBLIC_PATHS = ['/login'];

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('access_token')?.value;

  const url = req.nextUrl.clone();
  const path = req.nextUrl.pathname;

  if (!token && !PUBLIC_PATHS.includes(path)) {
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  if (token) {
    try {
      const { payload } = await jwtVerify(
        token,
        new TextEncoder().encode(process.env.JWT_SECRET),
      );

      const role = payload.role;

      // Rutas protegidas según rol
      if (path.startsWith('/dashboard') && role !== 'admin') {
        url.pathname = '/unauthorized';
        return NextResponse.redirect(url);
      }

      if (path.startsWith('/inventory') && !['admin', 'inventory'].includes(role)) {
        url.pathname = '/unauthorized';
        return NextResponse.redirect(url);
      }

      // Puedes agregar más verificaciones por ruta/rol aquí

      return NextResponse.next();
    } catch (err) {
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/inventory/:path*', '/analytics/:path*'],
};