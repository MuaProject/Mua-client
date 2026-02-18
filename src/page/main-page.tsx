import { TopNavigation } from '@shared/ui/topNavigation';
import UserIcon from '@shared/assets/icon/user.svg?react';
import BellIcon from '@shared/assets/icon/bell.svg?react';
import { DropButton } from '@widgets/main/dropBotton';
import { useState } from 'react';
import BottomSheet from '@widgets/main/bottom-sheet/bottom-sheet';
import { BottomSheetLocationSearch } from '@widgets/main/bottom-sheet/contents/bottom-sheet-location-search';
import { RadioContent } from '@widgets/main/bottom-sheet/contents/radio/radio-content';
import { Card } from '@widgets/main/card/card';
import { NotificationPanel } from '@widgets/main/notification/notificationPanel';
import { useNavigate } from 'react-router-dom';
import { FloatingActionButton } from '@shared/ui/floatingActionButton';
import PlusIcon from '@shared/assets/icon/plus.svg?react';
import { useQuery } from '@tanstack/react-query';
import { FEED_QUERY_OPTIONS } from '@shared/api/domain/main/query';

export type SortType = 'latest' | 'near';
type SheetType = 'location' | 'sort' | null;

const mockCards = [
  {
    id: 1,
    image: 'https://via.placeholder.com/102x128',
    title: '역삼동 공터에서 경도 할 사람 찾고 있어요!! (성인만)',
    date: '01.01 / 13:40',
    count: '1 / 20',
    location: '개나리 공원',
  },
  {
    id: 2,
    image: 'https://via.placeholder.com/102x128',
    title: '주말에 같이 운동하실 분 구합니다',
    date: '01.02 / 10:00',
    count: '3 / 10',
    location: '역삼 체육관',
  },
  {
    id: 3,
    image: 'https://via.placeholder.com/102x128',
    title: '역삼동 공터에서 경도 할 사람 찾고 있어요!! (성인만)',
    date: '01.01 / 13:40',
    count: '1 / 20',
    location: '개나리 공원',
  },
  {
    id: 4,
    image: 'https://via.placeholder.com/102x128',
    title: '역삼동 공터에서 경도 할 사람 찾고 있어요!! (성인만)',
    date: '01.01 / 13:40',
    count: '1 / 20',
    location: '개나리 공원',
  },
  {
    id: 5,
    image: 'https://via.placeholder.com/102x128',
    title: '역삼동 공터에서 경도 할 사람 찾고 있어요!! (성인만)',
    date: '01.01 / 13:40',
    count: '1 / 20',
    location: '개나리 공원',
  },
];
const mockNotifications = [
  {
    value:
      '“역삼동 공터에서 경도하실 분 찾아요!” 게임에서 참가가 확정되었습니다.',
    time: '방금 전',
  },
  {
    value:
      '“역삼동 공터에서 경도하실 분 찾아요!” 게임에서 참가가 확정되었습니다.',
    time: '10분 전',
  },
];

const MainPage = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState('');
  const [sortType, setSortType] = useState<SortType>('latest');
  const [openSheet, setOpenSheet] = useState<SheetType>(null);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const { data } = useQuery(FEED_QUERY_OPTIONS.LIST());
  return (
    <div>
      <TopNavigation
        leftIcon={<UserIcon width="2.4rem" height="2.4rem" />}
        rightIcon={<BellIcon width="2.4rem" height="2.4rem" />}
        onLeftClick={() => navigate('/my')}
        onRightClick={() => setIsNotificationOpen((prev) => !prev)}
      />
      {isNotificationOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsNotificationOpen(false)}
          />
          <div
            className="absolute right-[2.4rem] top-[5.6rem] z-50"
            onClick={(e) => e.stopPropagation()}
          >
            <NotificationPanel notifications={mockNotifications} />
          </div>
        </>
      )}
      <div className="flex flex-col gap-[0.8rem] px-[2.4rem] pb-[0.4rem]">
        <span className="text-gray-600 typo-h3 h-[2.2rem]">
          오늘도 안전한 하루 되세요!
        </span>
        <p className="typo-h1">방 찾기</p>
      </div>
      <div className="flex px-[2.4rem] gap-[1.2rem] py-[2rem]">
        <DropButton
          label={location || '위치 선택'}
          onClick={() => setOpenSheet('location')}
        />
        <DropButton
          label={sortType === 'latest' ? '최신순' : '가까운 순'}
          onClick={() => setOpenSheet('sort')}
        />
      </div>
      <div className="flex flex-col gap-[2rem] items-center">
        {mockCards.map((card) => (
          <Card
            key={card.id}
            image={card.image}
            title={card.title}
            date={card.date}
            count={card.count}
            location={card.location}
            onClick={() => navigate(`/posts/${card.id}`)}
          />
        ))}
      </div>
      <FloatingActionButton
        icon={
          <PlusIcon
            width={'2rem'}
            height={'2rem'}
            onClick={() => navigate('/create')}
          />
        }
      />
      <BottomSheet.Root
        isOpen={openSheet !== null}
        onClose={() => setOpenSheet(null)}
      >
        <BottomSheet.Overlay />

        <BottomSheet.Container size={openSheet === 'location' ? 'md' : 'sm'}>
          {openSheet === 'location' && (
            <>
              <BottomSheet.Header title="위치 설정" />
              <BottomSheet.Content>
                <BottomSheetLocationSearch
                  value={location}
                  onChange={setLocation}
                />
              </BottomSheet.Content>
            </>
          )}
          {openSheet === 'sort' && (
            <>
              <BottomSheet.Header title="정렬" />
              <BottomSheet.Content>
                <RadioContent
                  value={sortType}
                  onChange={(next) => {
                    setSortType(next);
                    setOpenSheet(null);
                  }}
                />
              </BottomSheet.Content>
            </>
          )}
        </BottomSheet.Container>
      </BottomSheet.Root>
    </div>
  );
};
export default MainPage;
