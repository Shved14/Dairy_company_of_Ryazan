import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  Leaf,
  Award,
  Truck,
  ShieldCheck,
  Clock,
  Heart,
} from 'lucide-react';
import { productApi } from '@/entities/product';
import { HowWeProduceSection } from './HowWeProduceSection';
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

export const HomePage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const navigate = useNavigate();
  const { toggle: toggleFavorite, has: isFav } = useFavorites();

  const handleToggleFavorite = (e: React.MouseEvent, id: number) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(id);
  };

  useEffect(() => {
    const load = async () => {
      try {
        const data = await productApi.getAll({ limit: 4 });
        setProducts(data.products);
      } catch {
        // API not available
      } finally {
        setLoadingProducts(false);
      }
    };
    load();
  }, []);

  return (
    <div className="overflow-hidden">
      {/* ===== Contact Bar ===== */}
      <div className="bg-gray-900 text-gray-300 text-xs sm:text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-2.5 flex items-center justify-between gap-2">
          <div className="flex items-center gap-x-4 sm:gap-x-6">
            <a href="tel:+74911234567" className="inline-flex items-center gap-1.5 hover:text-white transition-colors">
              <Phone className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline">+7 (491) 123-45-67</span>
              <span className="sm:hidden">Звонок</span>
            </a>
            <a href="mailto:info@dairy-ryazan.ru" className="hidden sm:inline-flex items-center gap-1.5 hover:text-white transition-colors">
              <Mail className="w-3.5 h-3.5" />
              info@dairy-ryazan.ru
            </a>
          </div>
          <div className="inline-flex items-center gap-1.5 text-gray-400">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden sm:inline">г. Рязань, ул. Молочная, 1</span>
            <span className="sm:hidden">Рязань</span>
          </div>
        </div>
      </div>

      {/* ===== Hero ===== */}
      <section className="relative min-h-[520px] sm:min-h-[600px] lg:min-h-[92vh] flex items-center overflow-hidden">
        {/* Background image with slow zoom */}
        <div
          className="absolute inset-0 bg-cover bg-center hero-bg-zoom"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1550583724-b2692b85b150?w=1920&q=80')",
          }}
        />
        {/* Cinematic dark overlay — text-side heavier */}
        <div className="absolute inset-0 hero-overlay" />
        {/* Bottom gradient fade */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/40 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16 sm:py-20 lg:py-0">
          <div className="max-w-2xl">
            {/* Badge */}
            <div className="animate-fade-in-up">
              <span className="inline-flex items-center gap-2 bg-primary/90 backdrop-blur-sm text-white px-4 py-2 rounded-full text-xs sm:text-sm font-semibold mb-5 sm:mb-7 shadow-lg">
                <Truck className="w-4 h-4" />
                Бесплатная доставка от 1000 ₽
              </span>
            </div>

            {/* Headline */}
            <h1 className="animate-fade-in-up delay-100 animate-hidden text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.08] tracking-tight">
              Свежая молочная{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-emerald-400">
                продукция
              </span>
              <br />
              прямо с фермы
            </h1>

            {/* Subtitle */}
            <p className="animate-fade-in-up delay-200 animate-hidden mt-5 sm:mt-7 text-base sm:text-lg lg:text-xl text-white/80 leading-relaxed max-w-lg">
              Без консервантов и добавок. Доставка в день производства.
              Натуральный вкус, которому доверяют более 2 000 семей Рязани.
            </p>

            {/* Trust markers */}
            <div className="animate-fade-in-up delay-300 animate-hidden mt-5 sm:mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-white/60 text-xs sm:text-sm font-medium">
              <span className="inline-flex items-center gap-1.5">
                <Leaf className="w-4 h-4 text-green-400" />
                100% натурально
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-green-400" />
                Сертифицировано
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-green-400" />
                Свежее каждый день
              </span>
            </div>

            {/* CTAs */}
            <div className="animate-fade-in-up delay-400 animate-hidden mt-8 sm:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Link
                to="/catalog"
                className="inline-flex items-center justify-center gap-2.5 bg-primary text-white px-7 sm:px-8 py-3.5 sm:py-4 rounded-xl font-bold text-base sm:text-lg hover:bg-primary-dark transition-all hover:scale-[1.03] shadow-xl pulse-glow btn-press"
              >
                Смотреть каталог
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href="tel:+74911234567"
                className="inline-flex items-center justify-center gap-2.5 bg-white/10 backdrop-blur-md border border-white/25 text-white px-7 sm:px-8 py-3.5 sm:py-4 rounded-xl font-bold text-base sm:text-lg hover:bg-white/20 transition-all hover:scale-[1.03] btn-press"
              >
                <Phone className="w-5 h-5" />
                Позвонить
              </a>
            </div>
          </div>
        </div>
      </section>

      <HowWeProduceSection />

      {/* ===== О компании ===== */}
      <section className="py-12 sm:py-16 lg:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-20 items-center">
            <Section animation="animate-slide-left">
              <div className="relative">
                <div className="rounded-2xl overflow-hidden shadow-2xl img-zoom">
                  <img
                    src="https://images.unsplash.com/photo-1550583724-b2692b85b150?w=800&q=80"
                    alt="Молочная ферма"
                    className="w-full h-[250px] sm:h-[350px] lg:h-[400px] object-cover"
                  />
                </div>
                <div className="absolute -bottom-4 -right-4 sm:-bottom-6 sm:-right-6 bg-primary text-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-xl hidden sm:block">
                  <div className="text-2xl sm:text-4xl font-extrabold">15+</div>
                  <div className="text-xs sm:text-sm text-green-100 mt-1">лет на рынке</div>
                </div>
              </div>
            </Section>

            <Section animation="animate-slide-right">
              <span className="text-primary font-semibold text-sm uppercase tracking-widest">О компании</span>
              <h2 className="mt-3 text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 leading-tight">
                Молочная компания <br />Рязани
              </h2>
              <p className="mt-4 sm:mt-6 text-gray-600 leading-relaxed text-base sm:text-lg">
                Мы — семейная ферма, которая уже более 15 лет производит натуральную молочную продукцию
                в Рязанской области. Наши коровы пасутся на экологически чистых пастбищах,
                а продукция проходит строгий контроль качества на каждом этапе.
              </p>
              <p className="mt-3 sm:mt-4 text-gray-600 leading-relaxed text-base sm:text-lg">
                Мы гордимся тем, что каждый наш продукт — от молока до сыра —
                сделан с любовью и заботой о вашем здоровье.
              </p>
              <div className="mt-6 sm:mt-8 grid grid-cols-3 gap-4 sm:gap-6">
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-primary">50+</div>
                  <div className="text-xs sm:text-sm text-gray-500 mt-1">продуктов</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-primary">2000+</div>
                  <div className="text-xs sm:text-sm text-gray-500 mt-1">клиентов</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-primary">100%</div>
                  <div className="text-xs sm:text-sm text-gray-500 mt-1">натурально</div>
                </div>
              </div>
            </Section>
          </div>
        </div>
      </section>

      {/* ===== Почему выбирают нас ===== */}
      <section className="py-14 sm:py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Section>
            <div className="text-center mb-10 sm:mb-14">
              <span className="text-primary font-semibold text-sm uppercase tracking-widest">Преимущества</span>
              <h2 className="mt-3 text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900">
                Почему выбирают нас
              </h2>
              <p className="mt-3 text-gray-500 max-w-xl mx-auto text-sm sm:text-base">
                Каждый продукт — результат заботы о качестве на каждом этапе
              </p>
            </div>
          </Section>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5 lg:gap-6">
            {[
              {
                icon: <Leaf className="w-6 h-6" />,
                color: 'bg-green-50 text-green-600 border-green-100',
                title: 'Без консервантов',
                desc: 'Никаких химических добавок — только чистый натуральный состав.',
              },
              {
                icon: <Clock className="w-6 h-6" />,
                color: 'bg-amber-50 text-amber-600 border-amber-100',
                title: 'Свежая продукция',
                desc: 'Производим каждый день и доставляем в течение 24 часов.',
              },
              {
                icon: <Award className="w-6 h-6" />,
                color: 'bg-blue-50 text-blue-600 border-blue-100',
                title: 'Своё производство',
                desc: 'Полный цикл — от фермы до упаковки под нашим контролем.',
              },
              {
                icon: <Truck className="w-6 h-6" />,
                color: 'bg-purple-50 text-purple-600 border-purple-100',
                title: 'Быстрая доставка',
                desc: 'Бесплатно по Рязани от 1 000 ₽. В день заказа.',
              },
              {
                icon: <ShieldCheck className="w-6 h-6" />,
                color: 'bg-rose-50 text-rose-600 border-rose-100',
                title: 'Натуральные ингредиенты',
                desc: 'Молоко от своих коров, без ГМО и порошковых заменителей.',
              },
            ].map((item, idx) => (
              <Section key={idx} animation="animate-fade-in-up" className={`delay-${(idx + 1) * 100}`}>
                <div className="group bg-white rounded-2xl p-6 border border-gray-100 h-full transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-gray-200 text-center">
                  <div className={`w-12 h-12 ${item.color} border rounded-xl flex items-center justify-center mx-auto mb-4 transition-transform duration-300 group-hover:scale-110`}>
                    {item.icon}
                  </div>
                  <h3 className="text-base font-bold text-gray-900 mb-1.5">{item.title}</h3>
                  <p className="text-gray-500 leading-relaxed text-sm">{item.desc}</p>
                </div>
              </Section>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Популярные товары ===== */}
      <section className="py-12 sm:py-16 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Section>
            <div className="flex items-end justify-between mb-8 sm:mb-12">
              <div>
                <span className="text-primary font-semibold text-sm uppercase tracking-widest">Каталог</span>
                <h2 className="mt-3 text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900">
                  Популярные товары
                </h2>
              </div>
              <Link
                to="/catalog"
                className="hidden sm:inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
              >
                Все товары
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </Section>

          {loadingProducts ? (
            <div className="flex justify-center py-16">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
              {products.map((product, idx) => (
                <Section key={product.id} animation="animate-fade-in-up" className={`delay-${(idx + 1) * 100}`}>
                  <div
                    onClick={() => navigate(`/catalog/${product.id}`)}
                    className="group block cursor-pointer"
                  >
                    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-gray-200">
                      <div className="relative aspect-[4/3] bg-gray-100 img-zoom">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <div className="text-center text-gray-300">
                              <Clock className="w-10 h-10 mx-auto mb-2" />
                              <span className="text-xs">Фото скоро</span>
                            </div>
                          </div>
                        )}
                        {/* Fav button */}
                        <button
                          onClick={(e) => handleToggleFavorite(e, product.id)}
                          className={`absolute top-2 right-2 sm:top-3 sm:right-3 p-2 sm:p-2.5 rounded-full shadow-md transition-all duration-300 ${isFav(product.id)
                            ? 'bg-red-500 text-white scale-110'
                            : 'bg-white/90 text-gray-500 sm:opacity-0 sm:group-hover:opacity-100 hover:bg-red-50 hover:text-red-500'
                            }`}
                        >
                          <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isFav(product.id) ? 'fill-current' : ''}`} />
                        </button>
                      </div>
                      <div className="p-5">
                        <span className="text-xs font-semibold text-primary/70 uppercase tracking-wider">
                          {product.category}
                        </span>
                        <h3 className="mt-1 text-lg font-bold text-gray-900 group-hover:text-primary transition-colors line-clamp-1">
                          {product.name}
                        </h3>
                        {product.description && (
                          <p className="mt-1 text-sm text-gray-400 line-clamp-2">{product.description}</p>
                        )}
                        <div className="mt-3 flex items-center justify-between">
                          <span className="text-xl font-extrabold text-gray-900">
                            {Number(product.price).toFixed(0)} ₽
                          </span>
                          {product.weight && (
                            <span className="text-sm text-gray-400">{product.weight} г</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Section>
              ))}
            </div>
          ) : (
            <Section>
              <div className="text-center py-16 text-gray-400">
                <p className="text-lg">Товары скоро появятся</p>
                <p className="text-sm mt-1">Мы готовим для вас лучшую продукцию</p>
              </div>
            </Section>
          )}

          <div className="mt-8 text-center sm:hidden">
            <Link
              to="/catalog"
              className="inline-flex items-center gap-2 text-primary font-semibold"
            >
              Все товары
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="relative py-12 sm:py-16 lg:py-24">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1523473827533-2a64d0d36748?w=1600&q=80')",
          }}
        />
        <div className="absolute inset-0 gradient-overlay" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Section>
            <h2 className="text-2xl sm:text-3xl lg:text-5xl font-extrabold text-white leading-tight">
              Попробуйте настоящий вкус <br className="hidden sm:block" />
              рязанской молочной продукции
            </h2>
            <p className="mt-6 text-white/80 text-lg max-w-2xl mx-auto">
              Закажите свежие продукты с доставкой прямо к вашему столу.
              Бесплатная доставка при заказе от 1000 ₽.
            </p>
            <div className="mt-6 sm:mt-10 flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
              <Link
                to="/catalog"
                className="inline-flex items-center justify-center gap-2 bg-white text-gray-900 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg hover:bg-green-50 transition-all hover:scale-105 shadow-lg btn-press"
              >
                Перейти в каталог
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href="tel:+74911234567"
                className="inline-flex items-center justify-center gap-2 border-2 border-white/40 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg hover:bg-white/10 transition-all backdrop-blur-sm btn-press"
              >
                <Phone className="w-5 h-5" />
                +7 (491) 123-45-67
              </a>
            </div>
          </Section>
        </div>
      </section>
    </div>
  );
};
