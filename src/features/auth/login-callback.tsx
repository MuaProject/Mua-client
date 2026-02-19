import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { routePath } from '@app/router/path';

export default function LoginCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const token = params.get('token');

    if (!token) {
      navigate(routePath.ONBOARDING, { replace: true });
      return;
    }

    // 🔐 토큰 저장
    localStorage.setItem('accessToken', token);

    // 메인으로 이동
    navigate(routePath.MAIN, { replace: true });
  }, [navigate]);

  return <div>로그인 처리중...</div>;
}
