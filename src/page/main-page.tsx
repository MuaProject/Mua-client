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
import type { LocationSelection } from '@features/location-picker/types';
import { loadKakaoMap } from '@shared/lib/kakao-map/load-kakao-map';

export type SortType = 'latest' | 'near';
type SheetType = 'location' | 'sort' | null;

const MainPage = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState<LocationSelection | null>(null);
  const [currentLocation, setCurrentLocation] =
    useState<LocationSelection | null>(null);
  const [sortType, setSortType] = useState<SortType>('latest');
  const [openSheet, setOpenSheet] = useState<SheetType>(null);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const loadCurrentLocation = () =>
    new Promise<LocationSelection>((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('현재 위치를 지원하지 않는 환경입니다.'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const kakao = await loadKakaoMap();
            const geocoder = new kakao.maps.services.Geocoder();

            geocoder.coord2Address(
              position.coords.longitude,
              position.coords.latitude,
              (result: any[], status: string) => {
                const address =
                  status === kakao.maps.services.Status.OK
                    ? result[0]?.road_address?.address_name ||
                      result[0]?.address?.address_name ||
                      '현재 위치'
                    : '현재 위치';

                resolve({
                  name: address,
                  address,
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude,
                });
              },
            );
          } catch {
            resolve({
              name: '현재 위치',
              address: '현재 위치',
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          }
        },
        () => {
          reject(
            new Error(
              '현재 위치를 가져오지 못했습니다. 브라우저 위치 권한을 확인해주세요.',
            ),
          );
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        },
      );
    });

  const feedListQuery = FEED_QUERY_OPTIONS.LIST(
    sortType === 'near'
      ? currentLocation
        ? {
            sort: 'DISTANCE',
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
          }
        : undefined
      : location
        ? {
            sort: 'LATEST',
            latitude: location.latitude,
            longitude: location.longitude,
          }
        : {
            sort: 'LATEST',
          },
  );
  const { data } = useQuery(feedListQuery);
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
          label={location?.name || location?.address || '위치 선택'}
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
                  onChange={async (next) => {
                    if (next === 'near') {
                      try {
                        const nextCurrentLocation =
                          currentLocation ?? (await loadCurrentLocation());
                        setCurrentLocation(nextCurrentLocation);
                        setLocation(nextCurrentLocation);
                        setSortType('near');
                      } catch (error) {
                        window.alert(
                          error instanceof Error
                            ? error.message
                            : '현재 위치를 가져오지 못했습니다.',
                        );
                        return;
                      }
                    } else {
                      setSortType('latest');
                    }

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
