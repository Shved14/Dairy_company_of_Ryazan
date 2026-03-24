import { Routes, Route } from 'react-router-dom';
import { HomePage } from '@/pages/home';
import { CatalogPage } from '@/pages/catalog';
import { ProductPage } from '@/pages/product';
import { AdminPage } from '@/pages/admin';

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/catalog" element={<CatalogPage />} />
      <Route path="/catalog/:id" element={<ProductPage />} />
      <Route path="/admin" element={<AdminPage />} />
    </Routes>
  );
};
