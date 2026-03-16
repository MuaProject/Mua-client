import type { paths } from '@shared/types/schema';

export type GetPresignedUploadResponse =
  paths['/api/s3/presigned-upload']['get']['responses']['200']['content']['*/*'];
