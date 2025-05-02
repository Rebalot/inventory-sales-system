type Environment = 'development' | 'production' | 'test';

const env = process.env.NODE_ENV as Environment;

const API_BASES = {
  development: 'http://localhost:3001',
  production: '',
  test: '',
} satisfies Record<Environment, string>;

export const API_BASE_URL = API_BASES[env];

export const API_ENDPOINTS = {
  AUTH: {
    ME: `${API_BASE_URL}/api/auth/me`,
    LOGIN: `${API_BASE_URL}/api/auth/login`,
    LOGOUT: `${API_BASE_URL}/api/auth/logout`,
  },
  INVENTORY: `${API_BASE_URL}/api/inventory`,
  SALES: `${API_BASE_URL}/api/sales`,
} as const;