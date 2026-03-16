import MessageIcon from '@shared/assets/icon/message-square.svg?react';
import { Chip, type ApprovalStatus } from '@widgets/postDetail/chip/chip';

export interface CommentItemProps {
  commentId?: number;
  nickname?: string;
  description?: string;
  parentId?: number | null;
  commentType?: string;
  depth?: number;
  memberId?: number;
  participationId?: number;
  createdAt?: string;
  children?: CommentItemProps[];
}

export interface Participant {
  participationId?: number;
  status?: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELED';
}

interface CommentItemUIProps extends CommentItemProps {
  isOwner?: boolean;
  participants?: Participant[];
  onReply?: (commentId: number, nickname?: string) => void;
  onChangeApproval?: (
    participationId: number,
    status: Exclude<ApprovalStatus, 'pending'>,
  ) => void;
}

export function CommentItem({
  nickname,
  description,
  commentType = 'USER',
  isOwner = false,
  depth,
  onChangeApproval,
  onReply,
  commentId,
  children,
  participationId,
  participants,
}: CommentItemUIProps) {
  const isSystem = commentType !== 'USER';

  const participation = participants?.find(
    (p) => p.participationId === participationId,
  );

  let computedStatus: ApprovalStatus = 'pending';

  if (participation?.status === 'APPROVED') computedStatus = 'approved';
  if (participation?.status === 'REJECTED') computedStatus = 'rejected';

  return (
    <div className="flex gap-[0.8rem]">
      <img className="w-[3.6rem] h-[3.6rem] rounded-full border" />

      <div className="flex flex-col flex-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-[0.4rem]">
            <span className="typo-body3">{nickname}</span>
          </div>

          {isSystem &&
            (isOwner ? (
              <Chip
                mode="action"
                status={computedStatus}
                onChange={(next) => {
                  if (!participationId) return;

                  console.log('🔥 participationId:', participationId);
                  onChangeApproval?.(participationId, next);
                }}
              />
            ) : (
              <Chip mode="display" status={computedStatus} />
            ))}
        </div>

        <div className="mt-[0.4rem]">
          <p className="typo-body1 whitespace-pre-line">{description}</p>

          {depth === 0 && (
            <button
              onClick={() => onReply?.(commentId!, nickname)}
              className="mt-[0.6rem] flex gap-[0.4rem] items-center typo-caption text-gray-500"
            >
              <MessageIcon width={'1.8rem'} height={'1.8rem'} />
              {children?.length ?? 0} 답글 쓰기
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
