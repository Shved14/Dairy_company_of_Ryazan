import { Link } from 'react-router-dom';
import { ArrowRight, Leaf, Award, Truck } from 'lucide-react';

export const HomePage = () => {
  return (
    <div>
      <section className="relative bg-gradient-to-br from-green-50 to-emerald-100 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
              Натуральная молочная продукция
              <span className="text-primary"> из Рязани</span>
            </h1>
            <p className="mt-6 text-lg text-gray-600 leading-relaxed max-w-xl">
              Свежие молочные продукты от местного производителя. Качество, проверенное поколениями.
              Доставка по всей Рязанской области.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/catalog"
                className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
              >
                Перейти в каталог
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Почему выбирают нас
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-2xl bg-white shadow-sm border border-gray-100">
              <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Leaf className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">100% натурально</h3>
              <p className="text-gray-500">
                Только натуральные ингредиенты без консервантов и добавок
              </p>
            </div>
            <div className="text-center p-6 rounded-2xl bg-white shadow-sm border border-gray-100">
              <div className="w-14 h-14 bg-amber-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Award className="w-7 h-7 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Высокое качество</h3>
              <p className="text-gray-500">
                Продукция сертифицирована и соответствует всем стандартам
              </p>
            </div>
            <div className="text-center p-6 rounded-2xl bg-white shadow-sm border border-gray-100">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Truck className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Быстрая доставка</h3>
              <p className="text-gray-500">
                Доставка по Рязани и области в кратчайшие сроки
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
