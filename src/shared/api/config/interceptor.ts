import { routePath } from '@app/router/path';
import { api } from './instance';

let refreshPromise: Promise<string> | null = null;

/**
 * 🔐 accessToken 자동 주입
 */
export const handleCheckAndSetToken = (request: Request) => {
  const token = localStorage.getItem('accessToken');

  if (token) {
    request.headers.set('Authorization', `Bearer ${token}`);
  }
};

/**
 * 🔁 401 → refresh 시도
 */
export const handleUnauthorizedResponse = async (
  request: Request,
  options: any,
  response: Response,
) => {
  if (response.status !== 401) return response;

  try {
    if (!refreshPromise) {
      refreshPromise = fetch(`${import.meta.env.VITE_BASE_URL}/token/refresh`, {
        method: 'POST',
        credentials: 'include', // 🔥 쿠키 자동 포함
      })
        .then(async (res) => {
          if (!res.ok) throw new Error('refresh 실패');
          const data = await res.json();
          localStorage.setItem('accessToken', data.accessToken);
          return data.accessToken;
        })
        .finally(() => {
          refreshPromise = null;
        });
    }

    const newAccessToken = await refreshPromise;

    request.headers.set('Authorization', `Bearer ${newAccessToken}`);

    return api(request, options);
  } catch {
    logout();
  }
};

function logout() {
  localStorage.removeItem('accessToken');
  window.location.href = routePath.ONBOARDING;
}
