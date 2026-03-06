export const END_POINT = {
  FEED: {
    LIST: 'api/feeds',
    DETAIL: (feedId: number) => `api/feeds/${feedId}`,
  },
  S3: {
    PRESIGNED_UPLOAD: 'api/s3/presigned-upload',
  },
} as const;
