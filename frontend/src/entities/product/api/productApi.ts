import { api } from '@/shared/api';
import type { Product, ProductsResponse } from '@/shared/types';

interface GetProductsParams {
  search?: string;
  category?: string;
  page?: number;
  limit?: number;
  priceMin?: number;
  priceMax?: number;
  fatMin?: number;
  fatMax?: number;
  weight?: string;
  sort?: string;
}

export const productApi = {
  getAll: async (params?: GetProductsParams): Promise<ProductsResponse> => {
    const { data } = await api.get<ProductsResponse>('/products', { params });
    return data;
  },

  getById: async (id: number): Promise<Product> => {
    const { data } = await api.get<Product>(`/products/${id}`);
    return data;
  },

  create: async (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> => {
    const { data } = await api.post<Product>('/products', product);
    return data;
  },

  update: async (id: number, product: Partial<Product>): Promise<Product> => {
    const { data } = await api.put<Product>(`/products/${id}`, product);
    return data;
  },

  delete: async (id: number): Promise<{ message: string }> => {
    const { data } = await api.delete<{ message: string }>(`/products/${id}`);
    return data;
  },
};
