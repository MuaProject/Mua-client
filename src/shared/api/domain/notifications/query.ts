import { mutationOptions, queryOptions } from '@tanstack/react-query';
import { api } from '@shared/api/config/instance';
import { END_POINT } from '@shared/api/end-point';
import { NOTIFICATION_QUERY_KEY } from '@shared/api/query-key';
import type { GetNotificationsResponse } from '@shared/types/notifications/type';

const getNotifications = async (): Promise<GetNotificationsResponse> => {
  return api
    .get(END_POINT.NOTIFICATION.LIST)
    .json<GetNotificationsResponse>();
};

const deleteNotifications = async () => {
  await api.delete(END_POINT.NOTIFICATION.LIST);
};

export const NOTIFICATION_QUERY_OPTIONS = {
  LIST: () =>
    queryOptions({
      queryKey: NOTIFICATION_QUERY_KEY.LIST(),
      queryFn: getNotifications,
    }),
};

export const NOTIFICATION_MUTATION_OPTIONS = {
  DELETE_ALL: () =>
    mutationOptions({
      mutationFn: deleteNotifications,
    }),
};
