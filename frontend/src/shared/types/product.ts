export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: string;
  category: string;
  fat: string | null;
  weight: string | null;
  image: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProductsResponse {
  products: Product[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
