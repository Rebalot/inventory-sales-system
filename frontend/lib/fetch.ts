// Utilidad para fetch autenticado
export const authFetch = (input: RequestInfo, init?: RequestInit) => {
    return fetch(input, {
      ...init,
      credentials: 'include',
    });
  };