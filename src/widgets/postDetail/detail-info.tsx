import { CardInfo } from '@widgets/main/card/card-info';
import { formatDate } from '@shared/utils/date';

interface DetailInfoProps {
  playDate?: string;
  playCount?: number;
  location?: string;
  writerNickname?: string;
}

export function DetailInfo({
  playDate,
  playCount,
  location,
  writerNickname,
}: DetailInfoProps) {
  return (
    <div className="flex w-[32.7rem] gap-[2rem] flex-col border-b py-[2rem]">
      <div className="flex gap-[0.8rem]">
        <img className="w-[4.8rem] h-[4.8rem] rounded-full border" />
        <div className="flex flex-col">
          <span className="typo-body1">{writerNickname}</span>
          <span className="typo-body3">
            {playDate ? formatDate(playDate) : ''}
          </span>
        </div>
      </div>

      <div className="typo-body2">
        <CardInfo
          mode="detail"
          date={playDate ? formatDate(playDate) : ''}
          count={playCount ? `${playCount}명` : ''}
          location={location ?? ''}
        />
      </div>
    </div>
  );
}
