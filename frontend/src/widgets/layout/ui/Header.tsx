import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, Milk, Phone } from 'lucide-react';
import { FavoritesPopup } from '@/widgets/favorites';
import { AuthModal } from '@/features/auth';
import { useAuth } from '@/shared/hooks/useAuth';

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const { isAuth } = useAuth();
  const { pathname } = useLocation();

  useEffect(() => { setIsOpen(false); }, [pathname]);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `transition-colors font-medium text-[15px] ${isActive ? 'text-primary' : 'text-gray-700 hover:text-primary'}`;

  const mobileLinkClass = ({ isActive }: { isActive: boolean }) =>
    `block px-4 py-3 rounded-xl transition-all font-medium ${isActive ? 'bg-primary/5 text-primary' : 'text-gray-700 hover:bg-gray-50'}`;

  return (
    <>
      <header className="bg-white/95 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <Link to="/" className="flex items-center gap-2 text-primary font-bold text-lg sm:text-xl shrink-0">
              <Milk className="w-6 h-6 sm:w-7 sm:h-7" />
              <span className="hidden sm:inline">Молочная компания</span>
              <span className="sm:hidden">МК Рязань</span>
            </Link>

            <nav className="hidden md:flex items-center gap-5 lg:gap-6">
              <NavLink to="/" className={linkClass} end>Главная</NavLink>
              <NavLink to="/catalog" className={linkClass}>Каталог</NavLink>
              {isAuth ? (
                <NavLink to="/admin" className={linkClass}>Админ</NavLink>
              ) : (
                <button onClick={() => setShowAuth(true)} className="transition-colors font-medium text-[15px] text-gray-700 hover:text-primary">Админ</button>
              )}
              <FavoritesPopup />
              <a href="tel:+74911234567"
                className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-primary-dark transition-colors btn-press whitespace-nowrap">
                <Phone className="w-4 h-4" />
                <span className="hidden lg:inline">+7 (491) 123-45-67</span>
                <span className="lg:hidden">Звонок</span>
              </a>
            </nav>

            <div className="flex items-center gap-1 md:hidden">
              <FavoritesPopup />
              <button className="p-2 text-gray-600 hover:text-primary transition-colors rounded-lg hover:bg-gray-50"
                onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-80' : 'max-h-0'}`}>
          <nav className="px-4 pb-4 space-y-1 border-t border-gray-100 pt-2">
            <NavLink to="/" className={mobileLinkClass} end onClick={() => setIsOpen(false)}>Главная</NavLink>
            <NavLink to="/catalog" className={mobileLinkClass} onClick={() => setIsOpen(false)}>Каталог</NavLink>
            {isAuth ? (
              <NavLink to="/admin" className={mobileLinkClass} onClick={() => setIsOpen(false)}>Админ</NavLink>
            ) : (
              <button onClick={() => { setShowAuth(true); setIsOpen(false); }}
                className="block w-full text-left px-4 py-3 rounded-xl transition-all font-medium text-gray-700 hover:bg-gray-50">Админ</button>
            )}
            <a href="tel:+74911234567"
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-primary/5 text-primary font-semibold">
              <Phone className="w-4 h-4" />
              +7 (491) 123-45-67
            </a>
          </nav>
        </div>
      </header>
      <AuthModal open={showAuth} onClose={() => setShowAuth(false)} />
    </>
  );
};
