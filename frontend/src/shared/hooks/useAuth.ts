import { useState, useEffect, useCallback } from 'react';

const TOKEN_KEY = 'token';
const AUTH_EVENT = 'auth-updated';

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

  return { token, isAuth: !!token, login, logout };
};
