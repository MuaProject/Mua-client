import type { paths } from '@shared/types/schema';

export type GetCommentsResponse =
  paths['/api/feeds/{feedId}/comments']['get']['responses']['200']['content']['*/*'];
