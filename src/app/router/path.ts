export const routePath = {
  ONBOARDING: '/',
  MAIN: '/main',
  MY: '/my',
  CREATE: '/create',
  DETAIL: '/posts/:id',
  NICKNAMECHAGE: '/my/nickname',
  LOGIN_CALLBACK: '/oauth/success',
} as const;

export type Routes = (typeof routePath)[keyof typeof routePath];
