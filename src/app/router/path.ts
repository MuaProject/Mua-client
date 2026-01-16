export const routePath = {
  MAIN: '/',
} as const;

export type Routes = (typeof routePath)[keyof typeof routePath];
