import LoginBg from '@shared/assets/login.svg?react';
import { Button } from '@shared/ui/button';
import KakaoIcon from '@shared/assets/icon/KakaoTalk.svg?react';
const OnboardingPage = () => {
  const handleKakaoLogin = () => {
    window.location.href = import.meta.env.VITE_KAKAO_LOGIN_URL;
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* 배경 */}
      <LoginBg className="absolute inset-0 w-full h-full object-cover" />

      {/* 버튼 영역 */}
      <div className="absolute bottom-[6.1rem] w-full px-[2.4rem]">
        <Button color="yellow" icon={<KakaoIcon />} onClick={handleKakaoLogin}>
          카카오 로그인
        </Button>
      </div>
    </div>
  );
};
export default OnboardingPage;
