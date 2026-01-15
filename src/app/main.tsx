import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { QueryProvider } from 'src/app/providers/query-provider.tsx';

createRoot(document.getElementById('root')!).render(
  <QueryProvider>
    <App />
  </QueryProvider>,
);
