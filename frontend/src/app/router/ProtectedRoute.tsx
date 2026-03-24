import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/shared/hooks/useAuth';
import { AuthModal } from '@/features/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuth } = useAuth();
  const [showLogin, setShowLogin] = useState(!isAuth);

  if (!isAuth && !showLogin) {
    return <Navigate to="/" replace />;
  }

  if (!isAuth) {
    return (
      <>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center animate-fade-in">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Доступ ограничен</h2>
            <p className="text-gray-500 mb-6">Для входа в панель администратора необходима авторизация</p>
            <button
              onClick={() => setShowLogin(true)}
              className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-dark transition-colors"
            >
              Войти
            </button>
          </div>
        </div>
        <AuthModal open={showLogin} onClose={() => setShowLogin(false)} />
      </>
    );
  }

  return <>{children}</>;
};
