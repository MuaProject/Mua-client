import { mutationOptions, queryOptions } from '@tanstack/react-query';
import { api } from '@shared/api/config/instance';
import { END_POINT } from '@shared/api/end-point';
import type { GetParticipantsResponse } from '@shared/types/participations/type';
const applyParticipation = async (feedId: number) => {
  return api.post(END_POINT.FEED.PARTICIPATION(feedId)).json();
};
const approveParticipation = async (id: number) => {
  return api.patch(END_POINT.PARTICIPATION.APPROVE(id)).json();
};

const rejectParticipation = async (id: number) => {
  return api.patch(END_POINT.PARTICIPATION.REJECT(id)).json();
};

const getParticipants = async (
  feedId: number,
): Promise<GetParticipantsResponse> => {
  return api
    .get(END_POINT.FEED.PARTICIPATION(feedId))
    .json<GetParticipantsResponse>();
};

export const PARTICIPATION_MUTATION_OPTIONS = {
  APPLY: () =>
    mutationOptions({
      mutationFn: applyParticipation,
    }),

  APPROVE: () =>
    mutationOptions({
      mutationFn: approveParticipation,
    }),

  REJECT: () =>
    mutationOptions({
      mutationFn: rejectParticipation,
    }),
};

export const PARTICIPATION_QUERY_OPTIONS = {
  LIST: (feedId: number) =>
    queryOptions({
      queryKey: ['participations', feedId],
      queryFn: () => getParticipants(feedId),
    }),
};
