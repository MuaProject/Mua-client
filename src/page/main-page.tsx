import { TopNavigation } from '@shared/ui/topNavigation';
import UserIcon from '@shared/assets/icon/user.svg?react';
import BellIcon from '@shared/assets/icon/bell.svg?react';
import { DropButton } from '@widgets/main/dropBotton';
import { useState } from 'react';
import BottomSheet from '@widgets/main/bottom-sheet/bottom-sheet';
import { BottomSheetLocationSearch } from '@widgets/main/bottom-sheet/contents/bottom-sheet-location-search';
import { RadioContent } from '@widgets/main/bottom-sheet/contents/radio/radio-content';
import { Card } from '@widgets/main/card/card';
import { NotificationPopover } from '@widgets/main/notification/notification-popover';
import { useNavigate } from 'react-router-dom';
import { FloatingActionButton } from '@shared/ui/floatingActionButton';
import PlusIcon from '@shared/assets/icon/plus.svg?react';
import { useQuery } from '@tanstack/react-query';
import { FEED_QUERY_OPTIONS } from '@shared/api/domain/feeds/query';
import { formatDate } from '@shared/utils/date';
export type SortType = 'latest' | 'near';
type SheetType = 'location' | 'sort' | null;

const MainPage = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState('');
  const [sortType, setSortType] = useState<SortType>('latest');
  const [openSheet, setOpenSheet] = useState<SheetType>(null);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const { data } = useQuery(FEED_QUERY_OPTIONS.LIST());
  if (!data) return null;
  return (
    <div>
      <TopNavigation
        leftIcon={<UserIcon width="2.4rem" height="2.4rem" />}
        rightIcon={<BellIcon width="2.4rem" height="2.4rem" />}
        onLeftClick={() => navigate('/my')}
        onRightClick={() => setIsNotificationOpen((prev) => !prev)}
      />
      <NotificationPopover
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
      />
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
        {data.feeds!.map((feed) => (
          <Card
            key={feed.feedId!}
            image={feed.image!}
            title={feed.title!}
            date={formatDate(feed.playDate!)}
            count={`${feed.playCount!}`}
            location={feed.playGround!}
            onClick={() => navigate(`/posts/${feed.feedId}`)}
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
