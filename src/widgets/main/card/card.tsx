import { CardInfo } from '@widgets/main/card/card-info';
import { CardTitle } from '@widgets/main/card/card-title';

interface CardProps {
  image?: string;
  title: string;
  date: string;
  count: string;
  location: string;
  onClick: () => void;
}

export function Card({
  image,
  title,
  date,
  count,
  location,
  onClick,
}: CardProps) {
  const imageSrc = image && image !== 'undefined' ? image : null;

  return (
    <div
      onClick={onClick}
      className="flex flex-low gap-[1.6rem] w-[32.7rem] h-[14.8rem] pb-[2rem] border-b border-gray-100"
    >
      <div className="w-[10.2rem] h-[12.8rem] shrink-0 overflow-hidden border rounded-[8px]">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-400 typo-caption">
            이미지 없음
          </div>
        )}
      </div>
      <div className="flex flex-col gap-[1.2rem]">
        <CardTitle title={title} />
        <CardInfo date={date} count={count} location={location} />
      </div>
    </div>
  );
}
