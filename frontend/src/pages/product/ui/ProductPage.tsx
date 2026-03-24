import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Package,
  Phone,
  MessageCircle,
  Heart,
  Droplets,
  Weight,
  Tag,
  Calendar,
  Eye,
  ZoomIn,
  X,
} from 'lucide-react';
import { productApi } from '@/entities/product';
import { useInView } from '@/shared/hooks/useInView';
import { useFavorites } from '@/shared/hooks/useFavorites';
import type { Product } from '@/shared/types';

const Section = ({
  children,
  className = '',
  animation = 'animate-fade-in-up',
}: {
  children: React.ReactNode;
  className?: string;
  animation?: string;
}) => {
  const { ref, isInView } = useInView({ threshold: 0.1 });
  return (
    <div ref={ref} className={`${isInView ? animation : 'animate-hidden'} ${className}`}>
      {children}
    </div>
  );
};

export const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const { toggle: toggleFavorite, has: hasFav } = useFavorites();
  const [zoomed, setZoomed] = useState(false);
  const [lensPos, setLensPos] = useState({ x: 50, y: 50 });
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const data = await productApi.getById(Number(id));
        setProduct(data);

        try {
          const all = await productApi.getAll({ category: data.category, limit: 5 });
          setRelated(all.products.filter((p) => p.id !== data.id).slice(0, 4));
        } catch {
          // ignore
        }
      } catch {
        setError('Продукт не найден');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  const handleToggleFavorite = () => {
    if (!product) return;
    toggleFavorite(product.id);
  };

  const isFav = product ? hasFav(product.id) : false;

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!imgRef.current) return;
    const rect = imgRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setLensPos({ x, y });
  };

  if (loading) {
    return (
      <div className="flex justify-center py-32">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <Package className="w-20 h-20 text-gray-200 mx-auto mb-4" />
        <p className="text-gray-500 text-xl font-semibold mb-2">{error || 'Продукт не найден'}</p>
        <p className="text-gray-400 text-sm mb-8">Возможно, товар был удалён или ссылка неверна</p>
        <Link
          to="/catalog"
          className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-dark transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Вернуться в каталог
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      {/* Back button */}
      <Link
        to="/catalog"
        className="animate-fade-in inline-flex items-center gap-2 text-gray-500 hover:text-primary mb-8 transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Назад в каталог
      </Link>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
        {/* ===== Photo ===== */}
        <div className="animate-slide-left">
          <div
            ref={imgRef}
            className="relative aspect-square bg-gray-50 rounded-3xl overflow-hidden shadow-lg cursor-zoom-in group"
            onMouseMove={handleMouseMove}
            onClick={() => product.image && setZoomed(true)}
          >
            {product.image ? (
              <>
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  style={{
                    transformOrigin: `${lensPos.x}% ${lensPos.y}%`,
                  }}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-300" />
                <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm p-2.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all">
                  <ZoomIn className="w-5 h-5 text-gray-600" />
                </div>
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package className="w-28 h-28 text-gray-200" />
              </div>
            )}

            {/* Category badge */}
            <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-primary text-sm font-bold px-4 py-1.5 rounded-full shadow-sm">
              {product.category}
            </span>
          </div>
        </div>

        {/* ===== Info ===== */}
        <div className="animate-slide-right">
          <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 leading-tight">
            {product.name}
          </h1>

          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-4xl lg:text-5xl font-extrabold text-primary">
              {Number(product.price).toFixed(0)} ₽
            </span>
            {product.weight && (
              <span className="text-lg text-gray-400">/ {product.weight} г</span>
            )}
          </div>

          {/* Action buttons */}
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="tel:+74911234567"
              className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-dark transition-all hover:scale-[1.02] shadow-md"
            >
              <Phone className="w-5 h-5" />
              Позвонить
            </a>
            <a
              href={`https://wa.me/79001234567?text=${encodeURIComponent(`Здравствуйте! Интересует товар: ${product.name} (${Number(product.price).toFixed(0)} ₽)`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-600 transition-all hover:scale-[1.02] shadow-md"
            >
              <MessageCircle className="w-5 h-5" />
              WhatsApp
            </a>
            <button
              onClick={handleToggleFavorite}
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all hover:scale-[1.02] border-2 ${isFav
                ? 'bg-red-50 border-red-300 text-red-600'
                : 'bg-white border-gray-200 text-gray-700 hover:border-red-300 hover:text-red-500'
                }`}
            >
              <Heart className={`w-5 h-5 ${isFav ? 'fill-current' : ''}`} />
              {isFav ? 'В избранном' : 'В избранное'}
            </button>
          </div>

          {/* Description */}
          {product.description && (
            <div className="mt-8">
              <h2 className="text-lg font-bold text-gray-900 mb-3">Описание</h2>
              <p className="text-gray-600 leading-relaxed text-[15px]">{product.description}</p>
            </div>
          )}

          {/* Composition placeholder */}
          <div className="mt-8">
            <h2 className="text-lg font-bold text-gray-900 mb-3">Состав</h2>
            <p className="text-gray-600 leading-relaxed text-[15px]">
              Натуральное цельное молоко, закваска. Без консервантов, ароматизаторов и ГМО.
            </p>
          </div>

          {/* Characteristics */}
          <div className="mt-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Характеристики</h2>
            <div className="grid grid-cols-2 gap-3">
              {product.fat !== null && (
                <div className="flex items-center gap-3 bg-gray-50 px-4 py-3.5 rounded-xl">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                    <Droplets className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">Жирность</div>
                    <div className="text-sm font-bold text-gray-900">{product.fat}%</div>
                  </div>
                </div>
              )}
              {product.weight !== null && (
                <div className="flex items-center gap-3 bg-gray-50 px-4 py-3.5 rounded-xl">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center shrink-0">
                    <Weight className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">Вес</div>
                    <div className="text-sm font-bold text-gray-900">{product.weight} г</div>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3 bg-gray-50 px-4 py-3.5 rounded-xl">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                  <Tag className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="text-xs text-gray-400">Категория</div>
                  <div className="text-sm font-bold text-gray-900">{product.category}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-gray-50 px-4 py-3.5 rounded-xl">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center shrink-0">
                  <Calendar className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <div className="text-xs text-gray-400">Срок хранения</div>
                  <div className="text-sm font-bold text-gray-900">7 дней</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Related products ===== */}
      {related.length > 0 && (
        <section className="mt-20 lg:mt-28">
          <Section>
            <div className="flex items-end justify-between mb-10">
              <div>
                <span className="text-primary font-semibold text-sm uppercase tracking-widest">Рекомендуем</span>
                <h2 className="mt-2 text-2xl lg:text-3xl font-extrabold text-gray-900">Ещё товары</h2>
              </div>
              <Link
                to="/catalog"
                className="hidden sm:inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
              >
                Все товары
                <ArrowLeft className="w-4 h-4 rotate-180" />
              </Link>
            </div>
          </Section>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {related.map((item, idx) => (
              <Section key={item.id} animation="animate-scale-in" className={`delay-${(idx + 1) * 100}`}>
                <Link to={`/catalog/${item.id}`} className="group block">
                  <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden card-hover">
                    <div className="aspect-[4/3] bg-gray-50 img-zoom relative">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-12 h-12 text-gray-200" />
                        </div>
                      )}
                      <span className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm text-primary text-xs font-bold px-2.5 py-1 rounded-full">
                        {item.category}
                      </span>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-gray-900 group-hover:text-primary transition-colors line-clamp-1 text-sm lg:text-base">
                        {item.name}
                      </h3>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-lg font-extrabold text-gray-900">
                          {Number(item.price).toFixed(0)} ₽
                        </span>
                        <span className="inline-flex items-center gap-1 text-primary text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                          <Eye className="w-3.5 h-3.5" />
                          Смотреть
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </Section>
            ))}
          </div>
        </section>
      )}

      {/* ===== Fullscreen zoom modal ===== */}
      {zoomed && product.image && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 animate-fade-in cursor-zoom-out"
          onClick={() => setZoomed(false)}
        >
          <button
            onClick={() => setZoomed(false)}
            className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={product.image}
            alt={product.name}
            className="max-w-full max-h-[90vh] object-contain rounded-2xl animate-scale-in"
          />
        </div>
      )}
    </div>
  );
};
