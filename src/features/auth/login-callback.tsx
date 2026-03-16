import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { routePath } from '@app/router/path';

export default function LoginCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    const finalToken = token ?? localStorage.getItem('accessToken');

    if (!finalToken) {
      navigate(routePath.ONBOARDING, { replace: true });
      return;
    }

    if (token) {
      localStorage.setItem('accessToken', token);
    }

    navigate(routePath.MAIN, { replace: true });
  }, [navigate]);

  return <div>로그인 처리중...</div>;
}
