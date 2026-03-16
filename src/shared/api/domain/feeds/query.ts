import { mutationOptions, queryOptions } from '@tanstack/react-query';
import { api } from '@shared/api/config/instance';
import { END_POINT } from '@shared/api/end-point';
import { FEED_QUERY_KEY } from '@shared/api/query-key';
import type {
  CreateFeedRequest,
  GetFeedDetailResponse,
  GetFeedsResponse,
} from '@shared/types/feeds/type';

interface GetFeedsParams extends Record<string, string | number | undefined> {
  sort?: 'LATEST' | 'DISTANCE';
  latitude?: number;
  longitude?: number;
}

const getFeeds = async (params?: GetFeedsParams): Promise<GetFeedsResponse> => {
  return api
    .get(END_POINT.FEED.LIST, {
      searchParams: params,
    })
    .json<GetFeedsResponse>();
};

const getFeedDetail = async (
  feedId: number,
): Promise<GetFeedDetailResponse> => {
  return api.get(END_POINT.FEED.DETAIL(feedId)).json();
};

const postFeed = async (body: CreateFeedRequest) => {
  return api.post(END_POINT.FEED.LIST, { json: body }).json();
};

export const FEED_QUERY_OPTIONS = {
  LIST: (params?: GetFeedsParams) =>
    queryOptions({
      queryKey: FEED_QUERY_KEY.LIST(params),
      queryFn: () => getFeeds(params),
    }),
  DETAIL: (feedId: number) =>
    queryOptions({
      queryKey: FEED_QUERY_KEY.DETAIL(feedId),
      queryFn: () => getFeedDetail(feedId),
      enabled: !!feedId,
      staleTime: 0,
    }),
};

export const FEED_MUTATION_OPTIONS = {
  CREATE: () =>
    mutationOptions({
      mutationFn: postFeed,
    }),
};
