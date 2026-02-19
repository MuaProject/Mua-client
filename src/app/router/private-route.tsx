import { routePath } from '@app/router/path';
import { Navigate, Outlet } from 'react-router-dom';

export default function PrivateRoute() {
  const token = localStorage.getItem('accessToken');

  if (!token) {
    return <Navigate to={routePath.ONBOARDING} replace />;
  }

  return <Outlet />;
}
