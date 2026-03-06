import { queryOptions } from '@tanstack/react-query';
import { api } from '@shared/api/config/instance';
import { END_POINT } from '@shared/api/end-point';
import type { GetCommentsResponse } from '@shared/types/comments/type';

const getComments = async (feedId: number) => {
  return api.get(END_POINT.FEED.COMMENTS(feedId)).json<GetCommentsResponse>();
};

export const COMMENT_QUERY_OPTIONS = {
  LIST: (feedId: number) =>
    queryOptions({
      queryKey: ['comments', feedId],
      queryFn: () => getComments(feedId),
    }),
};
