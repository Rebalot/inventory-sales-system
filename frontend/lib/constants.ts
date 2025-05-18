export const ROLES = {
    ADMIN: 'admin',
    SALES: 'sales',
    INVENTORY: 'inventory',
    ANALYTICS: 'analytics',
    USER: 'user'
  } as const

  export type Role = typeof ROLES[keyof typeof ROLES];

  export const PROTECTED_ROUTES: Record<string, Role[]> = {
    '/dashboard': [ROLES.ADMIN, ROLES.SALES, ROLES.INVENTORY, ROLES.ANALYTICS, ROLES.USER],
    '/sales': [ROLES.ADMIN, ROLES.SALES],
    '/inventory': [ROLES.ADMIN, ROLES.INVENTORY],
    '/analytics': [ROLES.ADMIN, ROLES.ANALYTICS],
  }
  export const PUBLIC_ROUTES = [
    '/login',
    '/logout',
    '/unauthorized',
    '/not-found'
  ]
  