import { routePath } from '@app/router/path';
import { MainPage } from '@app/router/lazy';

export const globalRoutes = [
  {
    path: routePath.MAIN,
    element: <MainPage />,
  },
];
