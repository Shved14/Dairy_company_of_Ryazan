import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Milk, Phone, Mail, MapPin, Clock, Shield } from 'lucide-react';
import { AuthModal } from '@/features/auth';
import { useAuth } from '@/shared/hooks/useAuth';

export const Footer = () => {
  const [showAuth, setShowAuth] = useState(false);
  const { isAuth } = useAuth();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 text-white font-bold text-xl mb-4">
              <Milk className="w-7 h-7 text-primary" />
              <span>Молочная компания</span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              Натуральная молочная продукция из Рязани. Свежесть и качество каждый день с 2009 года.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">Навигация</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/" className="hover:text-white hover:pl-1 transition-all">Главная</Link>
              </li>
              <li>
                <Link to="/catalog" className="hover:text-white hover:pl-1 transition-all">Каталог</Link>
              </li>
              <li>
                {isAuth ? (
                  <Link to="/admin" className="inline-flex items-center gap-1.5 hover:text-white hover:pl-1 transition-all">
                    <Shield className="w-3.5 h-3.5" />
                    Админ-панель
                  </Link>
                ) : (
                  <button
                    onClick={() => setShowAuth(true)}
                    className="inline-flex items-center gap-1.5 hover:text-white hover:pl-1 transition-all"
                  >
                    <Shield className="w-3.5 h-3.5" />
                    Админ
                  </button>
                )}
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">Контакты</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="tel:+74911234567" className="inline-flex items-center gap-2 hover:text-white transition-colors">
                  <Phone className="w-4 h-4 text-primary" />
                  +7 (491) 123-45-67
                </a>
              </li>
              <li>
                <a href="tel:+79001234567" className="inline-flex items-center gap-2 hover:text-white transition-colors">
                  <Phone className="w-4 h-4 text-primary" />
                  +7 (900) 123-45-67
                </a>
              </li>
              <li>
                <a href="mailto:info@dairy-ryazan.ru" className="inline-flex items-center gap-2 hover:text-white transition-colors">
                  <Mail className="w-4 h-4 text-primary" />
                  info@dairy-ryazan.ru
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">Адрес</h3>
            <ul className="space-y-3 text-sm">
              <li className="inline-flex items-start gap-2">
                <MapPin className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <span>г. Рязань, ул. Молочная, д. 1</span>
              </li>
              <li className="inline-flex items-start gap-2">
                <Clock className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <span>Пн–Сб: 8:00–20:00<br />Вс: 9:00–18:00</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <span>&copy; {new Date().getFullYear()} Молочная компания Рязани. Все права защищены.</span>
          <span>Сделано с заботой о качестве</span>
        </div>
      </div>
      <AuthModal open={showAuth} onClose={() => setShowAuth(false)} />
    </footer>
  );
};
