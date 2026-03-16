export const END_POINT = {
  FEED: {
    LIST: 'api/feeds',
    DETAIL: (feedId: number) => `api/feeds/${feedId}`,
    PARTICIPATION: (feedId: number) => `api/feeds/${feedId}/participations`,
    COMMENTS: (feedId: number) => `api/feeds/${feedId}/comments`,
    CREATE: (feedId: number) => `api/feeds/${feedId}/comments`,
  },
  PARTICIPATION: {
    APPROVE: (id: number) => `api/participations/${id}/approve`,
    REJECT: (id: number) => `api/participations/${id}/reject`,
  },

  S3: {
    PRESIGNED_UPLOAD: 'api/s3/presigned-upload',
  },
  NOTIFICATION: {
    LIST: 'api/notifications',
  },
} as const;
