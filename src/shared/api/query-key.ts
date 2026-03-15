export const FEED_QUERY_KEY = {
  LIST: () => ['feeds'] as const,
  DETAIL: (feedId: number) => ['feed', feedId] as const,
};

export const NOTIFICATION_QUERY_KEY = {
  LIST: () => ['notifications'] as const,
};
