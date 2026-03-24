import { api } from '@/shared/api';

interface AuthResponse {
  admin: { id: number; login: string };
  token: string;
}

export const adminApi = {
  login: async (login: string, password: string): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>('/admin/login', { login, password });
    return data;
  },

  create: async (login: string, password: string): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>('/admin/create', { login, password });
    return data;
  },
};
