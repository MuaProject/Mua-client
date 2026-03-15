import { useEffect, useRef, useState } from 'react';
import Input, { type InputSize } from '@shared/ui/input';
import { FloatingActionButton } from '@shared/ui/floatingActionButton';
import LocationIcon from '@shared/assets/icon/material-symbols_my-location-outline-rounded.svg?react';
import { loadKakaoMap } from '@shared/lib/kakao-map/load-kakao-map';
import type { LocationSelection } from '@features/location-picker/types';

const DEFAULT_CENTER = {
  latitude: 37.5665,
  longitude: 126.978,
};

interface LocationPickerProps {
  value: LocationSelection | null;
  onChange: (value: LocationSelection) => void;
  inputSize?: InputSize;
  inputPlaceholder?: string;
  containerClassName?: string;
  searchRowClassName?: string;
  mapClassName?: string;
}

export function LocationPicker({
  value,
  onChange,
  inputSize = 'sm',
  inputPlaceholder = '동을 입력해주세요. 예) 역삼동',
  containerClassName = 'flex flex-col gap-[1.6rem] px-[2.4rem] pb-[2.4rem]',
  searchRowClassName = 'flex items-center gap-[1.2rem]',
  mapClassName = 'relative h-[24rem] w-full overflow-hidden rounded-[16px] border border-gray-200',
}: LocationPickerProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const placesRef = useRef<any>(null);
  const geocoderRef = useRef<any>(null);
  const syncTokenRef = useRef(0);
  const idleTimeoutRef = useRef<number | null>(null);
  const ignoreNextIdleSyncRef = useRef(false);
  const suppressSearchRef = useRef(false);
  const [keyword, setKeyword] = useState(value?.name || value?.address || '');
  const [isMapReady, setIsMapReady] = useState(false);

  const syncCenterToSelection = (
    latitude: number,
    longitude: number,
    fallbackName?: string,
  ) => {
    if (!geocoderRef.current || !window.kakao?.maps?.services) {
      onChange({
        name: fallbackName || '선택한 위치',
        address: fallbackName || '선택한 위치',
        latitude,
        longitude,
      });
      return;
    }

    syncTokenRef.current += 1;
    const currentToken = syncTokenRef.current;

    geocoderRef.current.coord2Address(
      longitude,
      latitude,
      (result: any[], status: string) => {
        if (currentToken !== syncTokenRef.current) return;

        const address =
          status === window.kakao.maps.services.Status.OK
            ? result[0]?.road_address?.address_name ||
              result[0]?.address?.address_name ||
              fallbackName ||
              '선택한 위치'
            : fallbackName || '선택한 위치';

        onChange({
          name: fallbackName || address,
          address,
          latitude,
          longitude,
        });
      },
    );
  };

  const moveMapCenter = (
    latitude: number,
    longitude: number,
    fallbackName?: string,
  ) => {
    if (!window.kakao?.maps || !mapRef.current) return;

    ignoreNextIdleSyncRef.current = true;
    const position = new window.kakao.maps.LatLng(latitude, longitude);
    mapRef.current.panTo(position);
    syncCenterToSelection(latitude, longitude, fallbackName);
  };

  useEffect(() => {
    let isMounted = true;

    loadKakaoMap()
      .then((kakao) => {
        if (!isMounted || !mapContainerRef.current) return;

        const center = new kakao.maps.LatLng(
          value?.latitude ?? DEFAULT_CENTER.latitude,
          value?.longitude ?? DEFAULT_CENTER.longitude,
        );

        const map = new kakao.maps.Map(mapContainerRef.current, {
          center,
          level: 3,
        });

        kakao.maps.event.addListener(map, 'idle', () => {
          if (ignoreNextIdleSyncRef.current) {
            ignoreNextIdleSyncRef.current = false;
            return;
          }

          if (idleTimeoutRef.current) {
            window.clearTimeout(idleTimeoutRef.current);
          }

          const nextCenter = map.getCenter();

          idleTimeoutRef.current = window.setTimeout(() => {
            syncCenterToSelection(nextCenter.getLat(), nextCenter.getLng());
          }, 180);
        });

        mapRef.current = map;
        placesRef.current = new kakao.maps.services.Places();
        geocoderRef.current = new kakao.maps.services.Geocoder();
        setIsMapReady(true);
      })
      .catch((error) => {
        console.error(error);
      });

    return () => {
      isMounted = false;

      if (idleTimeoutRef.current) {
        window.clearTimeout(idleTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isMapReady || !value || !mapRef.current || !window.kakao?.maps) return;

    const center = mapRef.current.getCenter();
    const lat = center.getLat();
    const lng = center.getLng();

    if (Math.abs(lat - value.latitude) < 0.000001 && Math.abs(lng - value.longitude) < 0.000001) {
      return;
    }

    ignoreNextIdleSyncRef.current = true;
    const position = new window.kakao.maps.LatLng(
      value.latitude,
      value.longitude,
    );
    mapRef.current.panTo(position);
  }, [isMapReady, value]);

  useEffect(() => {
    if (!isMapReady || !placesRef.current || !window.kakao?.maps?.services) return;

    const trimmedKeyword = keyword.trim();

    if (trimmedKeyword.length < 2) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      if (suppressSearchRef.current) {
        suppressSearchRef.current = false;
        return;
      }

      geocoderRef.current?.addressSearch(
        trimmedKeyword,
        (addressData: any[], addressStatus: string) => {
          if (
            addressStatus === window.kakao.maps.services.Status.OK &&
            addressData[0]
          ) {
            const firstAddress = addressData[0];
            moveMapCenter(
              Number(firstAddress.y),
              Number(firstAddress.x),
              firstAddress.address_name,
            );
            return;
          }

          placesRef.current.keywordSearch(
            trimmedKeyword,
            (placeData: any[], placeStatus: string) => {
              if (
                placeStatus !== window.kakao.maps.services.Status.OK ||
                !placeData[0]
              ) {
                return;
              }

              const firstPlace = placeData[0];
              moveMapCenter(
                Number(firstPlace.y),
                Number(firstPlace.x),
                firstPlace.place_name,
              );
            },
          );
        },
      );
    }, 400);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [isMapReady, keyword]);

  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      window.alert('현재 위치를 지원하지 않는 환경입니다.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        moveMapCenter(
          position.coords.latitude,
          position.coords.longitude,
          '현재 위치',
        );
      },
      (error) => {
        console.error(error);

        if (error.code === error.PERMISSION_DENIED) {
          window.alert('위치 권한이 꺼져 있어요. 브라우저 위치 권한을 허용해주세요.');
          return;
        }

        window.alert('현재 위치를 가져오지 못했습니다. 위치 권한과 네트워크를 확인해주세요.');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );
  };

  return (
    <div className={containerClassName}>
      <div className={searchRowClassName}>
        <Input
          inputSize={inputSize}
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          placeholder={inputPlaceholder}
        />
        <FloatingActionButton
          mode="inline"
          onClick={handleCurrentLocation}
          icon={<LocationIcon width="2rem" height="2rem" />}
        />
      </div>

      <div className={mapClassName}>
        <div ref={mapContainerRef} className="h-full w-full" />
        <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-full">
          <img
            src="https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png"
            alt=""
            className="h-[4.6rem] w-[3.6rem] drop-shadow-[0_6px_12px_rgba(0,0,0,0.18)]"
          />
        </div>
      </div>
    </div>
  );
}
