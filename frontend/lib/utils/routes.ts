import { PROTECTED_ROUTES, PUBLIC_ROUTES, Role } from "../constants"

  export function isPublicPath(pathname: string) {
    return PUBLIC_ROUTES.some(path => pathname === path || pathname.startsWith(`${path}/`))
  }
  export function isProtectedPath(pathname: string) {
    return Object.keys(PROTECTED_ROUTES).some(path => pathname === path || pathname.startsWith(`${path}/`))
  }
  export function pathExists(pathname: string) {
    const existsInProtected = isProtectedPath(pathname)
    const existsInPublic = isPublicPath(pathname)
    return existsInProtected || existsInPublic
  }
  export function checkRoutePermission(pathname: string, userRole: Role[]): boolean {
    // Buscar la ruta más específica que coincida
    const matchedEntry = Object.entries(PROTECTED_ROUTES).find(([route]) =>
      pathname.startsWith(route)
    );
    if (!matchedEntry) return false;

    const [matchedRoute, allowedRoles] = matchedEntry;
    console.log('Ruta coincidente:', matchedRoute)
  
    console.log('Roles permitidos:', allowedRoles)
    return allowedRoles.some(role => userRole.includes(role));
  }