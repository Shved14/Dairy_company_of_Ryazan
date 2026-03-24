import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Heart, X, Package, Trash2, ShoppingBag } from 'lucide-react';
import { useFavorites } from '@/shared/hooks/useFavorites';
import { productApi } from '@/entities/product';
import type { Product } from '@/shared/types';

export const FavoritesPopup = () => {
  const { ids, remove, clear, count } = useFavorites();
  const [open, setOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open || ids.length === 0) {
      if (ids.length === 0) setProducts([]);
      return;
    }

    const load = async () => {
      setLoading(true);
      try {
        const all = await productApi.getAll({ limit: 100 });
        setProducts(all.products.filter((p) => ids.includes(p.id)));
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [open, ids]);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target as Node) &&
        btnRef.current &&
        !btnRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [open]);

  return (
    <div className="relative">
      {/* Trigger button */}
      <button
        ref={btnRef}
        onClick={() => setOpen(!open)}
        className="relative p-2 text-gray-600 hover:text-red-500 transition-colors"
        aria-label="Избранное"
      >
        <Heart className={`w-6 h-6 transition-all ${count > 0 ? 'text-red-500 fill-red-500' : ''}`} />
        {count > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-scale-in">
            {count > 99 ? '99+' : count}
          </span>
        )}
      </button>

      {/* Popup panel */}
      {open && (
        <>
          {/* Mobile overlay */}
          <div className="fixed inset-0 bg-black/30 z-40 sm:hidden" onClick={() => setOpen(false)} />

          <div
            ref={panelRef}
            className="fixed right-0 top-0 h-full w-full sm:w-96 sm:absolute sm:top-full sm:right-0 sm:h-auto sm:max-h-[80vh] sm:mt-2 sm:rounded-2xl bg-white shadow-2xl border border-gray-100 z-50 flex flex-col animate-slide-right sm:animate-scale-in overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                <h3 className="font-bold text-gray-900">Избранное</h3>
                {count > 0 && (
                  <span className="text-xs bg-red-50 text-red-600 font-semibold px-2 py-0.5 rounded-full">
                    {count}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {count > 0 && (
                  <button
                    onClick={clear}
                    className="text-xs text-gray-400 hover:text-red-500 transition-colors"
                  >
                    Очистить
                  </button>
                )}
                <button
                  onClick={() => setOpen(false)}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="w-8 h-8 border-3 border-red-400 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : count === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                    <Heart className="w-8 h-8 text-gray-300" />
                  </div>
                  <p className="text-gray-500 font-semibold">Список пуст</p>
                  <p className="text-gray-400 text-sm mt-1">Добавляйте товары, нажимая ❤️</p>
                  <Link
                    to="/catalog"
                    onClick={() => setOpen(false)}
                    className="mt-6 inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary-dark transition-colors"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    В каталог
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {products.map((product) => (
                    <div key={product.id} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors group">
                      {/* Image */}
                      <Link
                        to={`/catalog/${product.id}`}
                        onClick={() => setOpen(false)}
                        className="w-16 h-16 rounded-xl bg-gray-100 overflow-hidden shrink-0"
                      >
                        {product.image ? (
                          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-6 h-6 text-gray-300" />
                          </div>
                        )}
                      </Link>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <Link
                          to={`/catalog/${product.id}`}
                          onClick={() => setOpen(false)}
                          className="font-semibold text-gray-900 text-sm hover:text-primary transition-colors line-clamp-1 block"
                        >
                          {product.name}
                        </Link>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-sm font-bold text-primary">
                            {Number(product.price).toFixed(0)} ₽
                          </span>
                          <span className="text-xs text-gray-400">{product.category}</span>
                        </div>
                      </div>

                      {/* Remove */}
                      <button
                        onClick={() => remove(product.id)}
                        className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                        title="Удалить"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {count > 0 && !loading && (
              <div className="px-5 py-4 border-t border-gray-100 bg-gray-50/50">
                <Link
                  to="/catalog"
                  onClick={() => setOpen(false)}
                  className="w-full inline-flex items-center justify-center gap-2 bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary-dark transition-colors text-sm"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Перейти в каталог
                </Link>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
