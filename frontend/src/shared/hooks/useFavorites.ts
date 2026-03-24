import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'favorites_data';
const VISITOR_KEY = 'visitor_id';
const EVENT_NAME = 'favorites-updated';
const EXPIRY_MS = 48 * 60 * 60 * 1000; // 48 hours

interface FavoritesData {
  ids: number[];
  updatedAt: number;
}

const generateUUID = (): string => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
};

const ensureVisitorId = (): string => {
  let id = localStorage.getItem(VISITOR_KEY);
  if (!id) {
    id = generateUUID();
    localStorage.setItem(VISITOR_KEY, id);
  }
  return id;
};

const read = (): number[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const data: FavoritesData = JSON.parse(raw);
    if (Date.now() - data.updatedAt > EXPIRY_MS) {
      localStorage.removeItem(STORAGE_KEY);
      return [];
    }
    return data.ids;
  } catch {
    return [];
  }
};

const write = (ids: number[]) => {
  const data: FavoritesData = { ids, updatedAt: Date.now() };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  window.dispatchEvent(new CustomEvent(EVENT_NAME));
};

export const useFavorites = () => {
  const [ids, setIds] = useState<number[]>(() => {
    ensureVisitorId();
    return read();
  });

  useEffect(() => {
    const sync = () => setIds(read());
    const onVisibility = () => {
      if (document.visibilityState === 'visible') sync();
    };
    window.addEventListener(EVENT_NAME, sync);
    window.addEventListener('storage', sync);
    window.addEventListener('focus', sync);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      window.removeEventListener(EVENT_NAME, sync);
      window.removeEventListener('storage', sync);
      window.removeEventListener('focus', sync);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  const toggle = useCallback((id: number) => {
    const current = read();
    const next = current.includes(id)
      ? current.filter((f) => f !== id)
      : [...current, id];
    write(next);
    setIds(next);
  }, []);

  const remove = useCallback((id: number) => {
    const current = read();
    const next = current.filter((f) => f !== id);
    write(next);
    setIds(next);
  }, []);

  const has = useCallback((id: number) => ids.includes(id), [ids]);

  const clear = useCallback(() => {
    write([]);
    setIds([]);
  }, []);

  return { ids, toggle, remove, has, clear, count: ids.length };
};
