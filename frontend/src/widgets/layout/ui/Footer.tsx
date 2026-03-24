import { Milk } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 text-white font-bold text-lg mb-4">
              <Milk className="w-6 h-6" />
              <span>Молочная компания Рязани</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Натуральная молочная продукция из Рязани. Качество, проверенное временем.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Навигация</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="hover:text-white transition-colors">Главная</a></li>
              <li><a href="/catalog" className="hover:text-white transition-colors">Каталог</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Контакты</h3>
            <ul className="space-y-2 text-sm">
              <li>г. Рязань, ул. Молочная, 1</li>
              <li>+7 (491) 123-45-67</li>
              <li>info@dairy-ryazan.ru</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Молочная компания Рязани. Все права защищены.
        </div>
      </div>
    </footer>
  );
};
