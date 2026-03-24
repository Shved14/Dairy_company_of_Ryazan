import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
} from 'lucide-react';
import { productApi } from '@/entities/product';
import { useInView } from '@/shared/hooks/useInView';
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
      <div className="bg-gray-900 text-gray-300 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
            <a href="tel:+74911234567" className="inline-flex items-center gap-1.5 hover:text-white transition-colors">
              <Phone className="w-3.5 h-3.5" />
              +7 (491) 123-45-67
            </a>
            <a href="tel:+79001234567" className="inline-flex items-center gap-1.5 hover:text-white transition-colors">
              <Phone className="w-3.5 h-3.5" />
              +7 (900) 123-45-67
            </a>
            <a href="mailto:info@dairy-ryazan.ru" className="inline-flex items-center gap-1.5 hover:text-white transition-colors">
              <Mail className="w-3.5 h-3.5" />
              info@dairy-ryazan.ru
            </a>
          </div>
          <div className="inline-flex items-center gap-1.5 text-gray-400">
            <MapPin className="w-3.5 h-3.5" />
            г. Рязань, ул. Молочная, 1
          </div>
        </div>
      </div>

      {/* ===== Hero ===== */}
      <section className="relative min-h-[600px] lg:min-h-[700px] flex items-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=1600&q=80')",
          }}
        />
        <div className="absolute inset-0 gradient-overlay" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20">
          <div className="max-w-2xl">
            <div className="animate-fade-in-up">
              <span className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Truck className="w-4 h-4" />
                Бесплатная доставка от 1000 ₽
              </span>
            </div>

            <h1 className="animate-fade-in-up delay-100 animate-hidden text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.1] tracking-tight">
              Натуральная молочная <br />
              <span className="text-green-300">продукция из Рязани</span>
            </h1>

            <p className="animate-fade-in-up delay-200 animate-hidden mt-6 text-lg lg:text-xl text-white/85 leading-relaxed max-w-lg">
              Свежие фермерские продукты каждый день. Качество, проверенное поколениями рязанских фермеров.
            </p>

            <div className="animate-fade-in-up delay-300 animate-hidden mt-10 flex flex-wrap gap-4">
              <Link
                to="/catalog"
                className="inline-flex items-center gap-2 bg-white text-gray-900 px-7 py-3.5 rounded-xl font-bold text-lg hover:bg-green-50 transition-all hover:scale-105 shadow-lg"
              >
                В каталог
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href="tel:+74911234567"
                className="inline-flex items-center gap-2 border-2 border-white/40 text-white px-7 py-3.5 rounded-xl font-bold text-lg hover:bg-white/10 transition-all backdrop-blur-sm"
              >
                <Phone className="w-5 h-5" />
                Позвонить
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ===== О компании ===== */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <Section animation="animate-slide-left">
              <div className="relative">
                <div className="rounded-2xl overflow-hidden shadow-2xl img-zoom">
                  <img
                    src="https://images.unsplash.com/photo-1550583724-b2692b85b150?w=800&q=80"
                    alt="Молочная ферма"
                    className="w-full h-[400px] object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 bg-primary text-white rounded-2xl p-6 shadow-xl hidden sm:block">
                  <div className="text-4xl font-extrabold">15+</div>
                  <div className="text-sm text-green-100 mt-1">лет на рынке</div>
                </div>
              </div>
            </Section>

            <Section animation="animate-slide-right">
              <span className="text-primary font-semibold text-sm uppercase tracking-widest">О компании</span>
              <h2 className="mt-3 text-3xl lg:text-4xl font-extrabold text-gray-900 leading-tight">
                Молочная компания <br />Рязани
              </h2>
              <p className="mt-6 text-gray-600 leading-relaxed text-lg">
                Мы — семейная ферма, которая уже более 15 лет производит натуральную молочную продукцию
                в Рязанской области. Наши коровы пасутся на экологически чистых пастбищах,
                а продукция проходит строгий контроль качества на каждом этапе.
              </p>
              <p className="mt-4 text-gray-600 leading-relaxed text-lg">
                Мы гордимся тем, что каждый наш продукт — от молока до сыра —
                сделан с любовью и заботой о вашем здоровье.
              </p>
              <div className="mt-8 grid grid-cols-3 gap-6">
                <div>
                  <div className="text-3xl font-extrabold text-primary">50+</div>
                  <div className="text-sm text-gray-500 mt-1">продуктов</div>
                </div>
                <div>
                  <div className="text-3xl font-extrabold text-primary">2000+</div>
                  <div className="text-sm text-gray-500 mt-1">клиентов</div>
                </div>
                <div>
                  <div className="text-3xl font-extrabold text-primary">100%</div>
                  <div className="text-sm text-gray-500 mt-1">натурально</div>
                </div>
              </div>
            </Section>
          </div>
        </div>
      </section>

      {/* ===== Преимущества ===== */}
      <section className="py-20 lg:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Section>
            <div className="text-center mb-16">
              <span className="text-primary font-semibold text-sm uppercase tracking-widest">Преимущества</span>
              <h2 className="mt-3 text-3xl lg:text-4xl font-extrabold text-gray-900">
                Почему выбирают нас
              </h2>
            </div>
          </Section>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Leaf className="w-7 h-7" />,
                color: 'bg-green-100 text-primary',
                title: '100% натурально',
                desc: 'Без консервантов, добавок и ГМО. Только чистые натуральные ингредиенты с фермы.',
              },
              {
                icon: <Award className="w-7 h-7" />,
                color: 'bg-amber-100 text-amber-600',
                title: 'Высокое качество',
                desc: 'Вся продукция сертифицирована и проходит многоступенчатый контроль качества.',
              },
              {
                icon: <Truck className="w-7 h-7" />,
                color: 'bg-blue-100 text-blue-600',
                title: 'Быстрая доставка',
                desc: 'Бесплатная доставка по Рязани от 1000 ₽. Доставка в день заказа.',
              },
              {
                icon: <ShieldCheck className="w-7 h-7" />,
                color: 'bg-purple-100 text-purple-600',
                title: 'Гарантия свежести',
                desc: 'Продукция производится ежедневно и доставляется в течение 24 часов.',
              },
            ].map((item, idx) => (
              <Section key={idx} animation="animate-scale-in" className={`delay-${(idx + 1) * 100}`}>
                <div className="bg-white rounded-2xl p-7 border border-gray-100 card-hover h-full">
                  <div className={`w-14 h-14 ${item.color} rounded-xl flex items-center justify-center mb-5`}>
                    {item.icon}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-500 leading-relaxed text-sm">{item.desc}</p>
                </div>
              </Section>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Популярные товары ===== */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Section>
            <div className="flex items-end justify-between mb-12">
              <div>
                <span className="text-primary font-semibold text-sm uppercase tracking-widest">Каталог</span>
                <h2 className="mt-3 text-3xl lg:text-4xl font-extrabold text-gray-900">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product, idx) => (
                <Section key={product.id} animation="animate-fade-in-up" className={`delay-${(idx + 1) * 100}`}>
                  <Link to={`/catalog/${product.id}`} className="group block">
                    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden card-hover">
                      <div className="aspect-[4/3] bg-gray-100 img-zoom">
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
                  </Link>
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
      <section className="relative py-20 lg:py-24">
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
            <h2 className="text-3xl lg:text-5xl font-extrabold text-white leading-tight">
              Попробуйте настоящий вкус <br className="hidden sm:block" />
              рязанской молочной продукции
            </h2>
            <p className="mt-6 text-white/80 text-lg max-w-2xl mx-auto">
              Закажите свежие продукты с доставкой прямо к вашему столу.
              Бесплатная доставка при заказе от 1000 ₽.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link
                to="/catalog"
                className="inline-flex items-center gap-2 bg-white text-gray-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-green-50 transition-all hover:scale-105 shadow-lg"
              >
                Перейти в каталог
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href="tel:+74911234567"
                className="inline-flex items-center gap-2 border-2 border-white/40 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/10 transition-all backdrop-blur-sm"
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
