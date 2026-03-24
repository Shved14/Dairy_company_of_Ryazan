import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'favorites';
const EVENT_NAME = 'favorites-updated';

const read = (): number[] => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
};

const write = (ids: number[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  window.dispatchEvent(new CustomEvent(EVENT_NAME));
};

export const useFavorites = () => {
  const [ids, setIds] = useState<number[]>(read);

  useEffect(() => {
    const sync = () => setIds(read());
    window.addEventListener(EVENT_NAME, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(EVENT_NAME, sync);
      window.removeEventListener('storage', sync);
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
