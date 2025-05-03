export const ROLES = {
    ADMIN: 'admin',
    SALES: 'sales',
    INVENTORY: 'inventory',
    ANALYTICS: 'analytics',
    USER: 'user'
  } as const
  
  export const PROTECTED_ROUTES = {
    '/dashboard': [ROLES.ADMIN, ROLES.SALES, ROLES.INVENTORY, ROLES.ANALYTICS, ROLES.USER],
    '/sales': [ROLES.ADMIN, ROLES.SALES],
    '/inventory': [ROLES.ADMIN, ROLES.INVENTORY],
    '/analytics': [ROLES.ADMIN, ROLES.ANALYTICS],
  }
  export const PUBLIC_ROUTES = [
    '/login',
    '/unauthorized',
    '/not-found',
  ]
  export function isPublicRoute(pathname: string) {
    return PUBLIC_ROUTES.some(path => pathname.startsWith(path))
  }
  export function isProtectedRoute(pathname: string) {
    return Object.keys(PROTECTED_ROUTES).some(path => pathname.startsWith(path))
  }
  export function pathExists(pathname: string) {
    const existsInProtected = isProtectedRoute(pathname)
    const existsInPublic = isPublicRoute(pathname)
    return existsInProtected || existsInPublic
  }
  export function checkRoutePermission(pathname: string, userRole: [string, ...string[]]): boolean {
    // Buscar la ruta más específica que coincida
    const matchedEntry = Object.entries(PROTECTED_ROUTES).find(([route]) =>
      pathname.startsWith(route)
    );;
    if (!matchedEntry) return false;

    const [matchedRoute, allowedRoles] = matchedEntry;
    console.log('Ruta coincidente:', matchedRoute)
  
    console.log('Roles permitidos:', allowedRoles)
    return allowedRoles.some(role => userRole.includes(role));
  }