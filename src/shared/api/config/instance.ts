import ky from 'ky';
import { routePath } from '@app/router/path';

export const api = ky.create({
  prefixUrl: import.meta.env.VITE_BASE_URL,
  retry: 0,

  hooks: {
    // 🔥 요청 전에 accessToken 자동 주입
    beforeRequest: [
      (request) => {
        const token = localStorage.getItem('accessToken');

        if (token) {
          request.headers.set('Authorization', `Bearer ${token}`);
        }
      },
    ],

    afterResponse: [
      async (request, options, response) => {
        if (response.status !== 401) return;

        const refreshToken = localStorage.getItem('refreshToken');

        if (!refreshToken) {
          localStorage.clear();
          window.location.href = routePath.ONBOARDING;
          return;
        }

        try {
          const refreshResponse = await ky
            .post(`${import.meta.env.VITE_BASE_URL}/token/refresh`, {
              headers: {
                'Refresh-Token': refreshToken,
              },
            })
            .json<{ accessToken: string }>();

          localStorage.setItem('accessToken', refreshResponse.accessToken);

          // 🔥 기존 요청 헤더 교체
          request.headers.set(
            'Authorization',
            `Bearer ${refreshResponse.accessToken}`,
          );

          // 🔥 원래 요청 다시 실행
          return ky(request);
        } catch {
          localStorage.clear();
          window.location.href = routePath.ONBOARDING;
        }
      },
    ],
  },
});
