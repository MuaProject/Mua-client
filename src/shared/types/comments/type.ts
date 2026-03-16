import type { paths } from '@shared/types/schema';

export type GetCommentsResponse =
  paths['/api/feeds/{feedId}/comments']['get']['responses']['200']['content']['*/*'];

export type CreateCommentRequest =
  paths['/api/feeds/{feedId}/comments']['post']['requestBody']['content']['application/json'];
