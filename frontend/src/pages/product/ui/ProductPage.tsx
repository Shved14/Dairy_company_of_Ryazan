import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Package } from 'lucide-react';
import { productApi } from '@/entities/product';
import type { Product } from '@/shared/types';

export const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const data = await productApi.getById(Number(id));
        setProduct(data);
      } catch {
        setError('Продукт не найден');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 text-lg mb-6">{error || 'Продукт не найден'}</p>
        <Link to="/catalog" className="text-primary font-medium hover:underline">
          Вернуться в каталог
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        to="/catalog"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-primary mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Назад в каталог
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="aspect-square bg-gray-100 rounded-2xl flex items-center justify-center overflow-hidden">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <Package className="w-24 h-24 text-gray-300" />
          )}
        </div>

        <div>
          <span className="text-sm font-medium text-primary bg-green-50 px-3 py-1 rounded-full">
            {product.category}
          </span>
          <h1 className="mt-4 text-3xl font-bold text-gray-900">{product.name}</h1>

          <p className="mt-4 text-4xl font-extrabold text-gray-900">
            {Number(product.price).toFixed(2)} ₽
          </p>

          {product.description && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Описание</h2>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>
          )}

          <div className="mt-6 border-t border-gray-100 pt-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Характеристики</h2>
            <dl className="grid grid-cols-2 gap-4">
              {product.fat !== null && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <dt className="text-sm text-gray-500">Жирность</dt>
                  <dd className="text-lg font-semibold">{product.fat}%</dd>
                </div>
              )}
              {product.weight !== null && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <dt className="text-sm text-gray-500">Вес</dt>
                  <dd className="text-lg font-semibold">{product.weight} г</dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};
