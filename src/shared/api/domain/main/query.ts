import { queryOptions } from '@tanstack/react-query';
import { api } from '@shared/api/config/instance';
import { END_POINT } from '@shared/api/end-point';
import { FEED_QUERY_KEY } from '@shared/api/query-key';
import type { GetFeedsResponse } from '@shared/types/type';

const getFeeds = async (): Promise<GetFeedsResponse> => {
  return api.get(END_POINT.FEED.LIST).json<GetFeedsResponse>();
};

export const FEED_QUERY_OPTIONS = {
  LIST: () =>
    queryOptions({
      queryKey: FEED_QUERY_KEY.LIST(),
      queryFn: getFeeds,
    }),
};
