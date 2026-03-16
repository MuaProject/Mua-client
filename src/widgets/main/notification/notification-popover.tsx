import {
  NOTIFICATION_MUTATION_OPTIONS,
  NOTIFICATION_QUERY_OPTIONS,
} from '@shared/api/domain/notifications/query';
import { formatRelativeTime } from '@shared/utils/date';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { NotificationPanel } from '@widgets/main/notification/notificationPanel';

interface NotificationPopoverProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationPopover({
  isOpen,
  onClose,
}: NotificationPopoverProps) {
  const queryClient = useQueryClient();
  const { data: notifications = [] } = useQuery({
    ...NOTIFICATION_QUERY_OPTIONS.LIST(),
    enabled: isOpen,
  });
  const { mutate: deleteAllNotifications, isPending } = useMutation({
    ...NOTIFICATION_MUTATION_OPTIONS.DELETE_ALL(),
    onSuccess: () => {
      queryClient.setQueryData(
        NOTIFICATION_QUERY_OPTIONS.LIST().queryKey,
        [],
      );
    },
  });

  if (!isOpen) {
    return null;
  }

  const mappedNotifications = notifications.map((notification) => ({
    id: notification.notificationId ?? 0,
    value: notification.message ?? '',
    time: notification.createdAt
      ? formatRelativeTime(notification.createdAt)
      : '',
  }));

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div
        className="absolute right-[2.4rem] top-[5.6rem] z-50"
        onClick={(e) => e.stopPropagation()}
      >
        <NotificationPanel
          notifications={mappedNotifications}
          isDeleting={isPending}
          onDeleteAll={() => deleteAllNotifications()}
        />
      </div>
    </>
  );
}
