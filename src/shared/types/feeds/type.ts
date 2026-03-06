import type { paths } from '@shared/types/schema';

export type GetFeedsResponse =
  paths['/api/feeds']['get']['responses']['200']['content']['application/json'];

export type CreateFeedRequest =
  paths['/api/feeds']['post']['requestBody']['content']['application/json'];

export type GetFeedDetailResponse =
  paths['/api/feeds/{feedId}']['get']['responses']['200']['content']['application/json'];
