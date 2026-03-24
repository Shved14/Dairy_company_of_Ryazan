import { useState, useEffect, useCallback, useMemo } from 'react';

import type { AdminRole } from '@/features/auth/api/adminApi';

const TOKEN_KEY = 'token';
const AUTH_EVENT = 'auth-updated';

function parseJwtPayload(token: string | null): { id?: number; login?: string; role?: AdminRole } {
  if (!token) return {};
  try {
    const base64 = token.split('.')[1];
    if (!base64) return {};
    return JSON.parse(atob(base64));
  } catch {
    return {};
  }
}

export const useAuth = () => {
  const [token, setToken] = useState<string | null>(localStorage.getItem(TOKEN_KEY));

  useEffect(() => {
    const sync = () => setToken(localStorage.getItem(TOKEN_KEY));
    window.addEventListener(AUTH_EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(AUTH_EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const payload = useMemo(() => parseJwtPayload(token), [token]);

  const login = useCallback((jwt: string) => {
    localStorage.setItem(TOKEN_KEY, jwt);
    setToken(jwt);
    window.dispatchEvent(new CustomEvent(AUTH_EVENT));
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    window.dispatchEvent(new CustomEvent(AUTH_EVENT));
  }, []);

  return {
    token,
    isAuth: !!token,
    role: payload.role || null,
    adminId: payload.id || null,
    adminLogin: payload.login || null,
    isSuperAdmin: payload.role === 'SUPER_ADMIN',
    login,
    logout,
  };
};
