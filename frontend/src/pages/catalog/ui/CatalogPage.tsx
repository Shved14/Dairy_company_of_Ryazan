import { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Search,
  Package,
  Heart,
  SlidersHorizontal,
  X,
  ChevronLeft,
  ChevronRight,
  Eye,
} from 'lucide-react';
import { productApi } from '@/entities/product';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { useInView } from '@/shared/hooks/useInView';
import type { Product } from '@/shared/types';

const CATEGORIES = ['Все', 'Молоко', 'Кефир', 'Сметана', 'Творог', 'Масло', 'Сыр', 'Йогурт'];

const getFavorites = (): number[] => {
  try {
    return JSON.parse(localStorage.getItem('favorites') || '[]');
  } catch {
    return [];
  }
};

const saveFavorites = (favs: number[]) => {
  localStorage.setItem('favorites', JSON.stringify(favs));
};

const AnimatedCard = ({ children, index }: { children: React.ReactNode; index: number }) => {
  const { ref, isInView } = useInView({ threshold: 0.05 });
  return (
    <div
      ref={ref}
      className={isInView ? 'animate-fade-in-up' : 'animate-hidden'}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {children}
    </div>
  );
};

export const CatalogPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || 'Все');
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [favorites, setFavorites] = useState<number[]>(getFavorites);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const debouncedSearch = useDebounce(search, 400);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = { page, limit: 12 };
      if (debouncedSearch) params.search = debouncedSearch;
      if (activeCategory !== 'Все') params.category = activeCategory;

      const data = await productApi.getAll(params);
      setProducts(data.products);
      setTotalPages(data.pagination.totalPages);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, activeCategory, page]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    const params: Record<string, string> = {};
    if (debouncedSearch) params.search = debouncedSearch;
    if (activeCategory !== 'Все') params.category = activeCategory;
    setSearchParams(params, { replace: true });
  }, [debouncedSearch, activeCategory, setSearchParams]);

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setPage(1);
    setSidebarOpen(false);
  };

  const handleToggleFavorite = (e: React.MouseEvent, id: number) => {
    e.preventDefault();
    e.stopPropagation();
    const favs = getFavorites();
    const next = favs.includes(id) ? favs.filter((f) => f !== id) : [...favs, id];
    saveFavorites(next);
    setFavorites(next);
  };

  const isFav = (id: number) => favorites.includes(id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <div>
          <span className="text-primary font-semibold text-sm uppercase tracking-widest">Каталог</span>
          <h1 className="mt-1 text-3xl lg:text-4xl font-extrabold text-gray-900">Наша продукция</h1>
        </div>
        <div className="text-sm text-gray-500">
          {!loading && `Найдено: ${products.length} товаров`}
        </div>
      </div>

      <div className="flex gap-8">
        {/* ===== Desktop Sidebar ===== */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-24 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4" />
              Фильтры
            </h3>

            {/* Search */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="Поиск..."
                className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
              />
              {search && (
                <button
                  onClick={() => { setSearch(''); setPage(1); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Categories */}
            <div>
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Категории</h4>
              <div className="space-y-1">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCategoryChange(cat)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${activeCategory === cat
                        ? 'bg-primary text-white shadow-sm'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* ===== Mobile Filter Button ===== */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden fixed bottom-6 right-6 z-40 bg-primary text-white p-4 rounded-full shadow-xl hover:bg-primary-dark transition-colors"
        >
          <SlidersHorizontal className="w-5 h-5" />
        </button>

        {/* ===== Mobile Sidebar Overlay ===== */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
            <div className="absolute left-0 top-0 bottom-0 w-80 max-w-[85vw] bg-white p-6 shadow-2xl overflow-y-auto animate-slide-left">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4" />
                  Фильтры
                </h3>
                <button onClick={() => setSidebarOpen(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  placeholder="Поиск..."
                  className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                />
                {search && (
                  <button
                    onClick={() => { setSearch(''); setPage(1); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Категории</h4>
              <div className="space-y-1">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCategoryChange(cat)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${activeCategory === cat
                        ? 'bg-primary text-white shadow-sm'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ===== Product Grid ===== */}
        <div className="flex-1 min-w-0">
          {/* Active filters */}
          {(activeCategory !== 'Все' || search) && (
            <div className="flex flex-wrap items-center gap-2 mb-6">
              {activeCategory !== 'Все' && (
                <span className="inline-flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm font-medium">
                  {activeCategory}
                  <button onClick={() => handleCategoryChange('Все')} className="hover:text-primary-dark">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              )}
              {search && (
                <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full text-sm font-medium">
                  «{search}»
                  <button onClick={() => { setSearch(''); setPage(1); }} className="hover:text-gray-900">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              )}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center py-24">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-24">
              <Package className="w-20 h-20 text-gray-200 mx-auto mb-4" />
              <p className="text-gray-500 text-xl font-semibold">Товары не найдены</p>
              <p className="text-gray-400 text-sm mt-2">Попробуйте изменить параметры поиска</p>
              {(activeCategory !== 'Все' || search) && (
                <button
                  onClick={() => { setSearch(''); setActiveCategory('Все'); setPage(1); }}
                  className="mt-6 inline-flex items-center gap-2 text-primary font-semibold hover:underline"
                >
                  Сбросить фильтры
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map((product, idx) => (
                  <AnimatedCard key={product.id} index={idx}>
                    <div className="group bg-white rounded-2xl border border-gray-100 overflow-hidden card-hover h-full flex flex-col">
                      {/* Image */}
                      <div className="relative aspect-[4/3] bg-gray-50 img-zoom">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-14 h-14 text-gray-200" />
                          </div>
                        )}

                        {/* Overlay buttons */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
                        <button
                          onClick={(e) => handleToggleFavorite(e, product.id)}
                          className={`absolute top-3 right-3 p-2.5 rounded-full shadow-md transition-all duration-300 ${isFav(product.id)
                              ? 'bg-red-500 text-white scale-110'
                              : 'bg-white/90 text-gray-500 opacity-0 group-hover:opacity-100 hover:bg-red-50 hover:text-red-500'
                            }`}
                        >
                          <Heart className={`w-4 h-4 ${isFav(product.id) ? 'fill-current' : ''}`} />
                        </button>

                        {/* Category badge */}
                        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-primary text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                          {product.category}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="p-5 flex flex-col flex-1">
                        <h3 className="font-bold text-gray-900 group-hover:text-primary transition-colors line-clamp-1 text-lg">
                          {product.name}
                        </h3>
                        {product.description && (
                          <p className="mt-1 text-sm text-gray-400 line-clamp-2">{product.description}</p>
                        )}

                        <div className="mt-auto pt-4 flex items-center justify-between">
                          <div>
                            <span className="text-2xl font-extrabold text-gray-900">
                              {Number(product.price).toFixed(0)} ₽
                            </span>
                            {product.weight && (
                              <span className="text-xs text-gray-400 ml-1">/ {product.weight} г</span>
                            )}
                          </div>
                          <Link
                            to={`/catalog/${product.id}`}
                            className="inline-flex items-center gap-1.5 bg-primary text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-primary-dark transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                            Подробнее
                          </Link>
                        </div>
                      </div>
                    </div>
                  </AnimatedCard>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-12">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="p-2.5 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-10 h-10 rounded-xl text-sm font-semibold transition-all ${page === p
                          ? 'bg-primary text-white shadow-md scale-105'
                          : 'text-gray-600 hover:bg-gray-100'
                        }`}
                    >
                      {p}
                    </button>
                  ))}

                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="p-2.5 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
