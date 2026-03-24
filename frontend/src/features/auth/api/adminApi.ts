import { api } from '@/shared/api';

export type AdminRole = 'SUPER_ADMIN' | 'ADMIN';

export interface AdminUser {
  id: number;
  login: string;
  role: AdminRole;
  createdAt: string;
}

interface AuthResponse {
  admin: { id: number; login: string; role: AdminRole };
  token: string;
}

export const adminApi = {
  login: async (login: string, password: string): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>('/admin/login', { login, password });
    return data;
  },

  getUsers: async (): Promise<AdminUser[]> => {
    const { data } = await api.get<AdminUser[]>('/admin/users');
    return data;
  },

  createUser: async (login: string, password: string): Promise<{ admin: AdminUser }> => {
    const { data } = await api.post<{ admin: AdminUser }>('/admin/users', { login, password });
    return data;
  },

  deleteUser: async (id: number): Promise<void> => {
    await api.delete(`/admin/users/${id}`);
  },
};
