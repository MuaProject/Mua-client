export const FEED_QUERY_KEY = {
  LIST: (params?: {
    sort?: 'LATEST' | 'DISTANCE';
    latitude?: number;
    longitude?: number;
  }) => ['feeds', params ?? {}] as const,
  DETAIL: (feedId: number) => ['feed', feedId] as const,
};
