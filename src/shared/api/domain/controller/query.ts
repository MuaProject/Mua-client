import { api } from '@shared/api/config/instance';
import { END_POINT } from '@shared/api/end-point';
import type { GetPresignedUploadResponse } from '@shared/types/controller/type';

export const getPresignedUpload = async (
  type: string,
  contentType: string,
): Promise<GetPresignedUploadResponse> => {
  return api
    .get(END_POINT.S3.PRESIGNED_UPLOAD, {
      searchParams: { type, contentType },
    })
    .json<GetPresignedUploadResponse>();
};
