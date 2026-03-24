import { BrowserRouter } from 'react-router-dom';
import { AppRouter } from './router';
import { Layout } from '@/widgets/layout';

export const App = () => {
  return (
    <BrowserRouter>
      <Layout>
        <AppRouter />
      </Layout>
    </BrowserRouter>
  );
};
