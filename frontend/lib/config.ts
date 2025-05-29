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
  INVENTORY: {
    GET_PRODUCTS: (query: Record<string, string>) =>
    `${API_BASE_URL}/api/inventory/get-products?`+ new URLSearchParams(query),
    CREATE_PRODUCT: `${API_BASE_URL}/api/inventory/create-product`,
    UPDATE_PRODUCT: ( id: string ) => 
    `${API_BASE_URL}/api/inventory/update-product/${id}`,
    DELETE_PRODUCT: ( id: string ) =>
    `${API_BASE_URL}/api/inventory/delete-product/${id}`,
  },
  SALES: {
    GET_ORDERS: (query: Record<string, any>) =>
    `${API_BASE_URL}/api/sales/get-orders?`+ new URLSearchParams(query),
  }
} as const;