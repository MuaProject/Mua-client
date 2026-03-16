import { TopNavigation } from '@shared/ui/topNavigation';
import ArrowLeftIcon from '@shared/assets/icon/arrow-left.svg?react';
import BellIcon from '@shared/assets/icon/bell.svg?react';
import ArchiveIcon from '@shared/assets/icon/archive.svg?react';
import EditIcon from '@shared/assets/icon/edit.svg?react';
import { useNavigate } from 'react-router-dom';
import { NotificationPopover } from '@widgets/main/notification/notification-popover';
import { useState } from 'react';
import { MyButton } from '@widgets/my/my-button';
const MyPage = () => {
  const navigate = useNavigate();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [nickname] = useState('영교');
  return (
    <div>
      <TopNavigation
        leftIcon={<ArrowLeftIcon width="2.4rem" height="2.4rem" />}
        rightIcon={<BellIcon width="2.4rem" height="2.4rem" />}
        onLeftClick={() => navigate(-1)}
        onRightClick={() => setIsNotificationOpen((prev) => !prev)}
      />
      <NotificationPopover
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
      />
      <p className="typo-h1 px-[2.4rem]">마이페이지</p>
      <div className="flex items-center gap-[1.2rem] h-[11.2rem] px-[2.4rem] py-[2rem] border-b">
        <img className="w-[7.2rem] h-[7.2rem] rounded-full border" />
        <span className="typo-h2">{nickname}</span>
      </div>
      <div>
        <MyButton
          icon={<ArchiveIcon width={'2.4rem'} height={'2.4rem'} />}
          label="참가 기록"
        />
        <MyButton
          icon={<EditIcon width={'2.4rem'} height={'2.4rem'} />}
          label="닉네임 변경"
          onClick={() => navigate('/my/nickname')}
        />
      </div>
    </div>
  );
};
export default MyPage;
