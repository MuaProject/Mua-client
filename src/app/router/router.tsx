import { createBrowserRouter } from 'react-router';
import { globalRoutes } from '@app/router/routes/global-routes';
import GlobalLayout from '@app/router/global-layout';

export const router = createBrowserRouter([
  {
    Component: GlobalLayout,
    children: [...globalRoutes],
  },
]);
