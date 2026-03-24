import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, Milk, Phone } from 'lucide-react';
import { FavoritesPopup } from '@/widgets/favorites';
import { AuthModal } from '@/features/auth';
import { useAuth } from '@/shared/hooks/useAuth';

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const { isAuth } = useAuth();

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `transition-colors font-medium ${isActive ? 'text-primary' : 'text-gray-700 hover:text-primary'}`;

  const adminLink = isAuth ? (
    <NavLink to="/admin" className={linkClass}>
      Админ
    </NavLink>
  ) : (
    <button
      onClick={() => { setShowAuth(true); setIsOpen(false); }}
      className="transition-colors font-medium text-gray-700 hover:text-primary"
    >
      Админ
    </button>
  );

  return (
    <>
      <header className="bg-white/95 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2 text-primary font-bold text-xl">
              <Milk className="w-7 h-7" />
              <span>Молочная компания</span>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              <NavLink to="/" className={linkClass} end>
                Главная
              </NavLink>
              <NavLink to="/catalog" className={linkClass}>
                Каталог
              </NavLink>
              {adminLink}
              <FavoritesPopup />
              <a
                href="tel:+74911234567"
                className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-primary-dark transition-colors"
              >
                <Phone className="w-4 h-4" />
                +7 (491) 123-45-67
              </a>
            </nav>

            <div className="flex items-center gap-2 md:hidden">
              <FavoritesPopup />
              <button
                className="p-2 text-gray-600 hover:text-primary"
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {isOpen && (
            <nav className="md:hidden pb-4 flex flex-col gap-3">
              <NavLink to="/" className={linkClass} end onClick={() => setIsOpen(false)}>
                Главная
              </NavLink>
              <NavLink to="/catalog" className={linkClass} onClick={() => setIsOpen(false)}>
                Каталог
              </NavLink>
              {adminLink}
              <a
                href="tel:+74911234567"
                className="inline-flex items-center gap-2 text-primary font-medium"
              >
                <Phone className="w-4 h-4" />
                +7 (491) 123-45-67
              </a>
            </nav>
          )}
        </div>
      </header>
      <AuthModal open={showAuth} onClose={() => setShowAuth(false)} />
    </>
  );
};
