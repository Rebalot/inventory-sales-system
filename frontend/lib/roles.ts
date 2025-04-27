export const ROLES = {
    ADMIN: 'admin',
    SALES: 'sales',
    INVENTORY: 'inventory',
    ANALYTICS: 'analytics'
  } as const
  
  // 2. Mapeo de rutas a roles requeridos
  export const ROUTE_PERMISSIONS = {
    '/dashboard': [ROLES.ADMIN, ROLES.SALES, ROLES.INVENTORY, ROLES.ANALYTICS],
    '/sales': [ROLES.ADMIN, ROLES.SALES],
    '/inventory': [ROLES.ADMIN, ROLES.INVENTORY],
    '/analytics': [ROLES.ADMIN, ROLES.ANALYTICS],
  }
  
  // 3. Helper para verificar permisos
  export function checkRoutePermission(path: string, userRoles: string[] = []): boolean {
    // Buscar la ruta más específica que coincida
    const matchedRoute = Object.entries(ROUTE_PERMISSIONS)
      .sort(([a], [b]) => b.length - a.length) // Ordenar de más específico a menos
      .find(([route]) => path.startsWith(route))
  
    // Si no hay regla para esta ruta, permitir acceso
    if (!matchedRoute) return true
  
    const [_, requiredRoles] = matchedRoute
    return requiredRoles.some(role => userRoles.includes(role))
  }