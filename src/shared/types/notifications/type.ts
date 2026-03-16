import type { paths } from '@shared/types/schema';

export type GetNotificationsResponse =
  paths['/api/notifications']['get']['responses']['200']['content']['*/*'];

