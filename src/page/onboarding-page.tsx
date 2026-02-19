import OnboardingBg from '@shared/assets/onboarding.svg?react';
import { Button } from '@shared/ui/button';
import KakaoIcon from '@shared/assets/icon/KakaoTalk.svg?react';
const OnboardingPage = () => {
  const handleKakaoLogin = () => {
    window.location.href = import.meta.env.VITE_KAKAO_LOGIN_URL;
  };

  return (
    <div>
      <div className="absolute bottom-[6.1rem] w-full px-[2.4rem]">
        <Button color="yellow" icon={<KakaoIcon />} onClick={handleKakaoLogin}>
          카카오 로그인
        </Button>
      </div>
    </div>
  );
};
export default OnboardingPage;
