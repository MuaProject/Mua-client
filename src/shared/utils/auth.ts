import { jwtDecode } from 'jwt-decode';

export const getMyMemberId = () => {
  const token = localStorage.getItem('accessToken');
  if (!token) return null;

  const decoded: any = jwtDecode(token);
  return decoded.memberId;
};
