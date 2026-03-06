export const FEED_QUERY_KEY = {
  LIST: () => ['feeds'] as const,
  DETAIL: (feedId: number) => ['feed', feedId] as const,
};
