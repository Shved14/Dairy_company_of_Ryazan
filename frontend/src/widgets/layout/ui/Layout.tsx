import type { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const { pathname } = useLocation();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main key={pathname} className="flex-1 page-enter">
        {children}
      </main>
      <Footer />
    </div>
  );
};
