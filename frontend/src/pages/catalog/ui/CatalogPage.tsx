import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Search,
  Package,
  Heart,
  SlidersHorizontal,
  X,
  ChevronLeft,
  ChevronRight,
  Flame,
  Sparkles,
  RotateCcw,
} from 'lucide-react';
import { productApi } from '@/entities/product';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { useInView } from '@/shared/hooks/useInView';
import { useFavorites } from '@/shared/hooks/useFavorites';
import type { Product } from '@/shared/types';
import { SkeletonCard } from '@/shared/ui/Skeleton';

const CATEGORIES = ['Все', 'Молоко', 'Кефир', 'Сметана', 'Творог', 'Масло', 'Сыр', 'Йогурт'];

const FAT_RANGES = [
  { label: '0–1%', min: 0, max: 1 },
  { label: '2–5%', min: 2, max: 5 },
  { label: '5%+', min: 5, max: undefined },
];

const WEIGHT_OPTIONS = [200, 500, 930, 1000];

const SORT_OPTIONS = [
  { value: '', label: 'По умолчанию' },
  { value: 'price_asc', label: 'Сначала дешёвые' },
  { value: 'price_desc', label: 'Сначала дорогие' },
  { value: 'newest', label: 'Новинки' },
];

const QUICK_CHIPS = [
  { key: 'newest', label: 'Новинки', icon: <Sparkles className="w-3.5 h-3.5" /> },
  { key: 'cheap', label: 'Низкая цена', icon: <Flame className="w-3.5 h-3.5" /> },
  { key: 'low_fat', label: 'Обезжиренное', icon: null },
];

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
  const { toggle: toggleFavorite, has: isFav } = useFavorites();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  // New filter state
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [activeFat, setActiveFat] = useState<number | null>(null);
  const [activeWeights, setActiveWeights] = useState<number[]>([]);
  const [sort, setSort] = useState('');
  const [quickChip, setQuickChip] = useState('');

  const debouncedSearch = useDebounce(search, 400);
  const debouncedPriceMin = useDebounce(priceMin, 500);
  const debouncedPriceMax = useDebounce(priceMax, 500);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = { page, limit: 12 };
      if (debouncedSearch) params.search = debouncedSearch;
      if (activeCategory !== 'Все') params.category = activeCategory;
      if (debouncedPriceMin) params.priceMin = Number(debouncedPriceMin);
      if (debouncedPriceMax) params.priceMax = Number(debouncedPriceMax);

      if (activeFat !== null && FAT_RANGES[activeFat]) {
        const range = FAT_RANGES[activeFat];
        params.fatMin = range.min;
        if (range.max !== undefined) params.fatMax = range.max;
      }

      if (activeWeights.length) params.weight = activeWeights.join(',');
      if (sort) params.sort = sort;

      const data = await productApi.getAll(params);
      setProducts(data.products);
      setTotalPages(data.pagination.totalPages);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, activeCategory, page, debouncedPriceMin, debouncedPriceMax, activeFat, activeWeights, sort]);

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
    toggleFavorite(id);
  };

  const handleQuickChip = (key: string) => {
    if (quickChip === key) {
      setQuickChip('');
      setSort('');
      setActiveFat(null);
      setPage(1);
      return;
    }
    setQuickChip(key);
    if (key === 'newest') { setSort('newest'); setActiveFat(null); }
    else if (key === 'cheap') { setSort('price_asc'); setActiveFat(null); }
    else if (key === 'low_fat') { setSort(''); setActiveFat(0); }
    setPage(1);
  };

  const toggleWeight = (w: number) => {
    setActiveWeights((prev) =>
      prev.includes(w) ? prev.filter((x) => x !== w) : [...prev, w]
    );
    setPage(1);
  };

  const hasActiveFilters = activeCategory !== 'Все' || search || priceMin || priceMax || activeFat !== null || activeWeights.length > 0 || sort || quickChip;

  const resetAllFilters = () => {
    setSearch(''); setActiveCategory('Все'); setPriceMin(''); setPriceMax('');
    setActiveFat(null); setActiveWeights([]); setSort(''); setQuickChip(''); setPage(1);
  };

  const activeFilterCount = [
    activeCategory !== 'Все',
    search,
    priceMin || priceMax,
    activeFat !== null,
    activeWeights.length > 0,
    sort,
  ].filter(Boolean).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 sm:gap-4 mb-6 sm:mb-8">
        <div>
          <span className="text-primary font-semibold text-xs sm:text-sm uppercase tracking-widest">Каталог</span>
          <h1 className="mt-1 text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900">Наша продукция</h1>
        </div>
        <div className="text-xs sm:text-sm text-gray-500">
          {!loading && `Найдено: ${products.length} товаров`}
        </div>
      </div>

      {/* ===== Quick Chips ===== */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        {QUICK_CHIPS.map((chip) => (
          <button
            key={chip.key}
            onClick={() => handleQuickChip(chip.key)}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${quickChip === chip.key
              ? 'bg-primary text-white shadow-sm'
              : 'bg-white border border-gray-200 text-gray-600 hover:border-primary hover:text-primary'
              }`}
          >
            {chip.icon}
            {chip.label}
          </button>
        ))}

        {/* Sort dropdown */}
        <div className="ml-auto hidden sm:block">
          <select
            value={sort}
            onChange={(e) => { setSort(e.target.value); setQuickChip(''); setPage(1); }}
            className="bg-white border border-gray-200 text-gray-600 text-sm rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-primary focus:border-transparent cursor-pointer"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex gap-6 lg:gap-8">
        {/* ===== Desktop Sidebar ===== */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-24 space-y-4 max-h-[calc(100vh-7rem)] overflow-y-auto pr-1">
            {/* Search */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  placeholder="Поиск..."
                  className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                />
                {search && (
                  <button onClick={() => { setSearch(''); setPage(1); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Categories */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Категории</h4>
              <div className="space-y-1">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCategoryChange(cat)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition-all ${activeCategory === cat
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Price range */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Цена, ₽</h4>
              <div className="flex items-center gap-2">
                <input
                  type="number" min="0" placeholder="от" value={priceMin}
                  onChange={(e) => { setPriceMin(e.target.value); setPage(1); }}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <span className="text-gray-300">–</span>
                <input
                  type="number" min="0" placeholder="до" value={priceMax}
                  onChange={(e) => { setPriceMax(e.target.value); setPage(1); }}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            {/* Fat range */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Жирность</h4>
              <div className="flex flex-wrap gap-2">
                {FAT_RANGES.map((range, idx) => (
                  <button
                    key={idx}
                    onClick={() => { setActiveFat(activeFat === idx ? null : idx); setQuickChip(''); setPage(1); }}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${activeFat === idx
                      ? 'bg-primary text-white'
                      : 'bg-gray-50 text-gray-600 border border-gray-200 hover:border-primary hover:text-primary'
                      }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Weight */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Вес</h4>
              <div className="flex flex-wrap gap-2">
                {WEIGHT_OPTIONS.map((w) => (
                  <button
                    key={w}
                    onClick={() => toggleWeight(w)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${activeWeights.includes(w)
                      ? 'bg-primary text-white'
                      : 'bg-gray-50 text-gray-600 border border-gray-200 hover:border-primary hover:text-primary'
                      }`}
                  >
                    {w >= 1000 ? `${w / 1000} л` : `${w} г`}
                  </button>
                ))}
              </div>
            </div>

            {/* Reset */}
            {hasActiveFilters && (
              <button
                onClick={resetAllFilters}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-500 bg-gray-50 border border-gray-200 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Сбросить все фильтры
              </button>
            )}
          </div>
        </aside>

        {/* ===== Mobile Filter Button ===== */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden fixed bottom-6 right-6 z-40 bg-primary text-white p-4 rounded-full shadow-xl hover:bg-primary-dark transition-colors"
        >
          <SlidersHorizontal className="w-5 h-5" />
          {activeFilterCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>

        {/* ===== Mobile Sidebar Overlay ===== */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
            <div className="absolute left-0 top-0 bottom-0 w-80 max-w-[85vw] bg-gray-50 shadow-2xl overflow-y-auto animate-slide-left">
              <div className="sticky top-0 bg-white z-10 flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4" />
                  Фильтры
                </h3>
                <button onClick={() => setSidebarOpen(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-5 space-y-5">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="text" value={search}
                    onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                    placeholder="Поиск..."
                    className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  />
                </div>

                {/* Sort (mobile) */}
                <div>
                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Сортировка</h4>
                  <select value={sort}
                    onChange={(e) => { setSort(e.target.value); setQuickChip(''); setPage(1); }}
                    className="w-full bg-white border border-gray-200 text-gray-600 text-sm rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-primary"
                  >
                    {SORT_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                {/* Categories */}
                <div>
                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Категории</h4>
                  <div className="space-y-1">
                    {CATEGORIES.map((cat) => (
                      <button key={cat} onClick={() => handleCategoryChange(cat)}
                        className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition-all ${activeCategory === cat
                          ? 'bg-primary text-white shadow-sm' : 'text-gray-600 hover:bg-white'}`}
                      >{cat}</button>
                    ))}
                  </div>
                </div>

                {/* Price */}
                <div>
                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Цена, ₽</h4>
                  <div className="flex items-center gap-2">
                    <input type="number" min="0" placeholder="от" value={priceMin}
                      onChange={(e) => { setPriceMin(e.target.value); setPage(1); }}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary" />
                    <span className="text-gray-300">–</span>
                    <input type="number" min="0" placeholder="до" value={priceMax}
                      onChange={(e) => { setPriceMax(e.target.value); setPage(1); }}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary" />
                  </div>
                </div>

                {/* Fat */}
                <div>
                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Жирность</h4>
                  <div className="flex flex-wrap gap-2">
                    {FAT_RANGES.map((range, idx) => (
                      <button key={idx}
                        onClick={() => { setActiveFat(activeFat === idx ? null : idx); setQuickChip(''); setPage(1); }}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${activeFat === idx
                          ? 'bg-primary text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-primary'}`}
                      >{range.label}</button>
                    ))}
                  </div>
                </div>

                {/* Weight */}
                <div>
                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Вес</h4>
                  <div className="flex flex-wrap gap-2">
                    {WEIGHT_OPTIONS.map((w) => (
                      <button key={w} onClick={() => toggleWeight(w)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${activeWeights.includes(w)
                          ? 'bg-primary text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-primary'}`}
                      >{w >= 1000 ? `${w / 1000} л` : `${w} г`}</button>
                    ))}
                  </div>
                </div>

                {/* Reset */}
                {hasActiveFilters && (
                  <button onClick={() => { resetAllFilters(); setSidebarOpen(false); }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-red-500 bg-red-50 border border-red-200 hover:bg-red-100 transition-all"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Сбросить все
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ===== Product Grid ===== */}
        <div className="flex-1 min-w-0">
          {/* Active filter tags */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 mb-5">
              {activeCategory !== 'Все' && (
                <span className="inline-flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm font-medium">
                  {activeCategory}
                  <button onClick={() => handleCategoryChange('Все')} className="hover:text-primary-dark"><X className="w-3.5 h-3.5" /></button>
                </span>
              )}
              {(priceMin || priceMax) && (
                <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 px-3 py-1.5 rounded-full text-sm font-medium">
                  {priceMin || '0'} – {priceMax || '∞'} ₽
                  <button onClick={() => { setPriceMin(''); setPriceMax(''); setPage(1); }} className="hover:text-amber-900"><X className="w-3.5 h-3.5" /></button>
                </span>
              )}
              {activeFat !== null && FAT_RANGES[activeFat] && (
                <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-sm font-medium">
                  Жирность: {FAT_RANGES[activeFat].label}
                  <button onClick={() => { setActiveFat(null); setQuickChip(''); setPage(1); }} className="hover:text-blue-900"><X className="w-3.5 h-3.5" /></button>
                </span>
              )}
              {activeWeights.length > 0 && (
                <span className="inline-flex items-center gap-1.5 bg-purple-50 text-purple-700 px-3 py-1.5 rounded-full text-sm font-medium">
                  Вес: {activeWeights.map((w) => w >= 1000 ? `${w / 1000}л` : `${w}г`).join(', ')}
                  <button onClick={() => { setActiveWeights([]); setPage(1); }} className="hover:text-purple-900"><X className="w-3.5 h-3.5" /></button>
                </span>
              )}
              {search && (
                <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full text-sm font-medium">
                  «{search}»
                  <button onClick={() => { setSearch(''); setPage(1); }} className="hover:text-gray-900"><X className="w-3.5 h-3.5" /></button>
                </span>
              )}
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-24">
              <Package className="w-20 h-20 text-gray-200 mx-auto mb-4" />
              <p className="text-gray-500 text-xl font-semibold">Товары не найдены</p>
              <p className="text-gray-400 text-sm mt-2">Попробуйте изменить параметры поиска</p>
              {hasActiveFilters && (
                <button
                  onClick={resetAllFilters}
                  className="mt-6 inline-flex items-center gap-2 text-primary font-semibold hover:underline"
                >
                  <RotateCcw className="w-4 h-4" />
                  Сбросить все фильтры
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                {products.map((product, idx) => {
                  const isNew = (Date.now() - new Date(product.createdAt).getTime()) < 7 * 24 * 60 * 60 * 1000;
                  const isHit = product.id % 3 === 0;
                  return (
                    <AnimatedCard key={product.id} index={idx}>
                      <div
                        onClick={() => navigate(`/catalog/${product.id}`)}
                        className="group bg-white rounded-xl sm:rounded-2xl border border-gray-100 overflow-hidden h-full flex flex-col cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:border-gray-200 hover:scale-[1.02]"
                      >
                        {/* Image */}
                        <div className="relative aspect-[4/3] bg-gray-50 overflow-hidden">
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="w-14 h-14 text-gray-200" />
                            </div>
                          )}

                          {/* Hover overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                          {/* Fav button */}
                          <button
                            onClick={(e) => handleToggleFavorite(e, product.id)}
                            className={`absolute top-2 right-2 sm:top-3 sm:right-3 p-2 sm:p-2.5 rounded-full shadow-md transition-all duration-300 hover:scale-125 active:scale-95 ${isFav(product.id)
                              ? 'bg-red-500 text-white scale-110'
                              : 'bg-white/90 text-gray-500 sm:opacity-0 sm:group-hover:opacity-100 hover:bg-red-50 hover:text-red-500'
                              }`}
                          >
                            <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-200 ${isFav(product.id) ? 'fill-current' : ''}`} />
                          </button>

                          {/* Badges — top-left */}
                          <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex flex-col gap-1">
                            <span className="bg-white/90 backdrop-blur-sm text-primary text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full shadow-sm">
                              {product.category}
                            </span>
                            {isHit && (
                              <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full shadow-sm flex items-center gap-1 w-fit">
                                <Flame className="w-3 h-3" />Хит
                              </span>
                            )}
                            {isNew && (
                              <span className="bg-gradient-to-r from-blue-500 to-violet-500 text-white text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full shadow-sm flex items-center gap-1 w-fit">
                                <Sparkles className="w-3 h-3" />Новинка
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-3 sm:p-5 flex flex-col flex-1">
                          <h3 className="font-bold text-gray-900 group-hover:text-primary transition-colors duration-200 line-clamp-1 text-sm sm:text-lg">
                            {product.name}
                          </h3>
                          {product.description && (
                            <p className="mt-1 text-xs sm:text-sm text-gray-400 line-clamp-2 hidden sm:block">{product.description}</p>
                          )}

                          <div className="mt-auto pt-2 sm:pt-4 flex items-end justify-between">
                            <div>
                              <span className="text-lg sm:text-2xl font-extrabold text-gray-900">
                                {Number(product.price).toFixed(0)} ₽
                              </span>
                              {product.weight && (
                                <span className="text-[10px] sm:text-xs text-gray-400 ml-1">/ {product.weight} г</span>
                              )}
                            </div>
                            {product.fat && (
                              <span className="text-[10px] sm:text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded-md font-medium">
                                {product.fat}%
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </AnimatedCard>
                  );
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-1.5 sm:gap-2 mt-8 sm:mt-12">
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
