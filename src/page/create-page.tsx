import { TopNavigation } from '@shared/ui/topNavigation';
import ArrowLeftIcon from '@shared/assets/icon/arrow-left.svg?react';
import MapPingIcon from '@shared/assets/icon/map-pin.svg?react';
import { useNavigate } from 'react-router-dom';
import { ModalButton } from '@widgets/create/modal-button';
import Input from '@shared/ui/input';
import { DropDown } from '@widgets/create/dropDown';
import { useState } from 'react';
import { DROPDOWN_OPTIONS } from '@page/constants/dropdown-option';
import { Textarea } from '@widgets/create/textarea';
import { Button } from '@shared/ui/button';
import { AddImage } from '@widgets/create/add-image';
import Modal from '@widgets/create/modal/modal';
import { ModalLocationSearch } from '@widgets/create/modal/contents/modal-location-search';
import { DateTimePicker } from '@widgets/create/modal/contents/wheel/date-time-picker';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FEED_MUTATION_OPTIONS } from '@shared/api/domain/feeds/query'; // 네가 만든 위치
import { FEED_QUERY_KEY } from '@shared/api/query-key';
import { getPresignedUpload } from '@shared/api/domain/controller/query';
import type { LocationSelection } from '@features/location-picker/types';
type CreateModalType = 'location' | 'datetime' | null;

const CreatPage = () => {
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [count, setCount] = useState('');
  const [round, setRound] = useState('');
  const [time, setTime] = useState('');
  const [openModal, setOpenModal] = useState<CreateModalType>(null);
  const navigate = useNavigate();
  const [location, setLocation] = useState<LocationSelection | null>(null);
  const [tempLocation, setTempLocation] = useState<LocationSelection | null>(
    null,
  );
  const [dateTime, setDateTime] = useState<{
    dateText: string;
    hour: string;
    minute: string;
  } | null>(null);
  const [imageUrl, setImageUrl] = useState('');

  const [tempDateTime, setTempDateTime] = useState<{
    dateText: string;
    hour: string;
    minute: string;
  } | null>(null);
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    ...FEED_MUTATION_OPTIONS.CREATE(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: FEED_QUERY_KEY.LIST(),
      });

      navigate('/main');
    },
  });
  const handleImageUpload = async (file: File) => {
    try {
      // 1️⃣ presigned 요청 (우리 서버)
      const { uploadUrl, fileUrl } = await getPresignedUpload(
        'feed',
        file.type,
      );

      // 2️⃣ S3 업로드 (외부 URL)
      await fetch(uploadUrl, {
        method: 'put',
        headers: {
          'Content-Type': file.type,
        },
        body: file,
      });

      // 3️⃣ 상태 저장
      setImageUrl(fileUrl);
    } catch (e) {
      console.error('이미지 업로드 실패', e);
    }
  };

  return (
    <div className="flex flex-col gap-[2rem]">
      <TopNavigation
        leftIcon={<ArrowLeftIcon width={'2.4rem'} height={'2.4rem'} />}
        onLeftClick={() => navigate(-1)}
      />
      <div className="typo-h1 px-[2.4rem] pb-[2rem]">게시글 작성하기</div>
      <div className="flex flex-col gap-[0.8rem] px-[2.4rem]">
        <span className="typo-body1">
          제목 <span className="text-red">*</span>
        </span>
        <Input
          placeholder="제목을 입력하세요"
          inputSize="lg"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <DropDown
        label="인원 수"
        value={count}
        placeholder="선택해주세요"
        options={DROPDOWN_OPTIONS.PERSON_COUNT}
        onChange={setCount}
      />

      <DropDown
        label="라운드"
        value={round}
        placeholder="선택해주세요"
        options={DROPDOWN_OPTIONS.ROUND}
        onChange={setRound}
      />

      <DropDown
        label="타이머"
        value={time}
        placeholder="선택해주세요"
        options={DROPDOWN_OPTIONS.TIME}
        onChange={setTime}
      />
      <ModalButton
        label="장소"
        value={location?.name || location?.address}
        placeholder={
          <span className="flex gap-[0.8rem]">
            <MapPingIcon width="2.4rem" height="2.4rem" />
            클릭하여 장소 선택
          </span>
        }
        onClick={() => {
          setTempLocation(location);
          setOpenModal('location');
        }}
      />

      <ModalButton
        label="일시"
        value={
          dateTime
            ? `${dateTime.dateText} ${dateTime.hour}:${dateTime.minute}`
            : undefined
        }
        placeholder="날짜 입력"
        onClick={() => setOpenModal('datetime')}
      />
      <div className=" flex flex-col gap-[0.8rem] px-[2.4rem]">
        <span className="typo-body1">
          내용 입력 <span className="text-red">*</span>
        </span>
        <Textarea
          placeholder="게시글 내용을 작성해주세요"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>
      <AddImage max={5} onChange={handleImageUpload} />
      <div className="px-[2.4rem] pb-[2rem]">
        <Button
          size="md"
          onClick={() => {
            if (!title || !text || !location || !dateTime) {
              alert('필수 항목을 입력해주세요');
              return;
            }
            const currentYear = new Date().getFullYear();

            const [monthDay] = dateTime.dateText.split(' ');
            const [month, day] = monthDay.split('.');

            const isoDate = new Date(
              `${currentYear}-${month}-${day}T${dateTime.hour}:${dateTime.minute}:00`,
            ).toISOString();

            mutate({
              title,
              description: text,
              playGround: location.name || location.address,
              playDate: isoDate,
              playCount: parseInt(count.replace(/\D/g, ''), 10),
              round: parseInt(round.replace(/\D/g, ''), 10),
              timer: parseInt(time.replace(/\D/g, ''), 10),
              image: imageUrl,
              address: location.address,
              latitude: location.latitude,
              longitude: location.longitude,
            });
          }}
        >
          업로드
        </Button>
      </div>
      <Modal.Root
        isOpen={openModal !== null}
        onClose={() => setOpenModal(null)}
      >
        <Modal.Overlay />

        {/* 장소 선택 (md) */}
        {openModal === 'location' && (
          <Modal.Container size="md">
            <Modal.Header title="장소 선택" />
            <Modal.Content>
              <ModalLocationSearch
                value={tempLocation}
                onChange={(next) => {
                  setTempLocation(next);
                }}
              />
            </Modal.Content>
            <Modal.Footer
              onConfirm={() => {
                setLocation(tempLocation);
                setOpenModal(null);
              }}
            />
          </Modal.Container>
        )}

        {openModal === 'datetime' && (
          <Modal.Container size="sm">
            <Modal.Header title="일시 선택" />
            <Modal.Content>
              <DateTimePicker
                onChange={(value) => {
                  setTempDateTime(value);
                }}
              />
            </Modal.Content>
            <Modal.Footer
              onConfirm={() => {
                if (tempDateTime) {
                  setDateTime(tempDateTime);
                }
                setOpenModal(null);
              }}
            />
          </Modal.Container>
        )}
      </Modal.Root>
    </div>
  );
};

export default CreatPage;
