import { routePath } from '@app/router/path';
import {
  CreatPage,
  LoginCallbackPage,
  MainPage,
  MyPage,
  NickNameChagePage,
  OnboardingPage,
  PostDetailPage,
} from '@app/router/lazy';

import PrivateRoute from '@app/router/private-route';

export const globalRoutes = [
  {
    path: routePath.ONBOARDING,
    element: <OnboardingPage />,
  },
  {
    path: routePath.LOGIN_CALLBACK,
    element: <LoginCallbackPage />,
  },
  {
    element: <PrivateRoute />,
    children: [
      {
        path: routePath.MAIN,
        element: <MainPage />,
      },
      {
        path: routePath.MY,
        element: <MyPage />,
      },
      {
        path: routePath.CREATE,
        element: <CreatPage />,
      },
      {
        path: routePath.DETAIL,
        element: <PostDetailPage />,
      },
      {
        path: routePath.NICKNAMECHAGE,
        element: <NickNameChagePage />,
      },
    ],
  },
];
