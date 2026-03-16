import ky from 'ky';
import {
  handleCheckAndSetToken,
  handleUnauthorizedResponse,
} from './interceptor';

export const api = ky.create({
  prefixUrl: import.meta.env.VITE_BASE_URL,
  credentials: 'include', // 쿠키
  retry: 0,
  hooks: {
    beforeRequest: [handleCheckAndSetToken],
    afterResponse: [handleUnauthorizedResponse],
  },
});
