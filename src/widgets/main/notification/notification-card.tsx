import ChevronRightIcon from '@shared/assets/icon/chevron-right.svg?react';
export interface NotificationCardProps {
  id: number;
  value: string;
  time: string;
}

export function NotificationCard({ value, time }: NotificationCardProps) {
  return (
    <div className="w-[27.6rem] h-[7.6rem] pb-[1.2rem] border-b">
      <button className="flex text-start gap-[1.2rem] h-[6.1rem]">
        <div className="flex flex-col">
          <p className="w-[24rem] h-[4.2rem] typo-body2 line-clamp-2">
            {value}
          </p>
          <span className="typo-caption text-gray-300">{time}</span>
        </div>
        <div className="flex justify-center items-center w-[2.4rem] h-[6.4rem]">
          <ChevronRightIcon width={'2.4rem'} height={'2.4rem'} />
        </div>
      </button>
    </div>
  );
}
