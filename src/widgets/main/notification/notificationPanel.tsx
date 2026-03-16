import {
  NotificationCard,
  type NotificationCardProps,
} from '@widgets/main/notification/notification-card';

interface NotificationPanelProps {
  notifications: NotificationCardProps[];
  isDeleting?: boolean;
  onDeleteAll?: () => void;
}

export function NotificationPanel({
  notifications,
  isDeleting = false,
  onDeleteAll,
}: NotificationPanelProps) {
  return (
    <div className="w-[30rem] px-[1.2rem] h-[30.6rem] bg-white border border-gray-200 rounded-[12px]">
      <div className="flex h-[5.4rem] justify-between">
        <span className="w-[6.4rem] h-[2.2rem] pt-[1.2rem] typo-h3">
          알림 내역
        </span>
        <button
          className="w-[4.1rem] h-[1.8rem] pt-[1.4rem] typo-cation text-gray-300 disabled:opacity-50"
          onClick={onDeleteAll}
          disabled={notifications.length === 0 || isDeleting}
        >
          전체삭제
        </button>
      </div>
      <div className="flex flex-col gap-[1.2rem]">
        {notifications.length === 0 ? (
          <div className="flex h-[22rem] items-center justify-center typo-body2 text-gray-300">
            도착한 알림이 없어요.
          </div>
        ) : (
          notifications.map((item) => (
            <NotificationCard
              key={item.id}
              id={item.id}
              value={item.value}
              time={item.time}
            />
          ))
        )}
      </div>
    </div>
  );
}
