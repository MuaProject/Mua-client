import { queryOptions, mutationOptions } from '@tanstack/react-query';
import { api } from '@shared/api/config/instance';
import { END_POINT } from '@shared/api/end-point';
import type {
  CreateCommentRequest,
  GetCommentsResponse,
} from '@shared/types/comments/type';

const getComments = async (feedId: number) => {
  return api.get(END_POINT.FEED.COMMENTS(feedId)).json<GetCommentsResponse>();
};

const createComment = async (feedId: number, body: CreateCommentRequest) => {
  return api.post(END_POINT.FEED.COMMENTS(feedId), {
    json: body,
  });
};

export const COMMENT_QUERY_OPTIONS = {
  LIST: (feedId: number) =>
    queryOptions({
      queryKey: ['comments', feedId],
      queryFn: () => getComments(feedId),
    }),
};

export const COMMENT_MUTATION_OPTIONS = {
  CREATE: () =>
    mutationOptions({
      mutationFn: ({
        feedId,
        body,
      }: {
        feedId: number;
        body: CreateCommentRequest;
      }) => createComment(feedId, body),
    }),
};
