import type { ApprovalStatus } from '@widgets/postDetail/chip/chip';
import {
  CommentItem,
  type CommentItemProps,
  type Participant,
} from '@widgets/postDetail/comment/comment-item';

interface CommentProps {
  comments: CommentItemProps[];
  participants?: Participant[];
  isOwner?: boolean;
  onChangeApproval?: (
    participationId: number,
    status: Exclude<ApprovalStatus, 'pending'>,
  ) => void;
}

export function Comment({
  comments,
  participants,
  isOwner,
  onChangeApproval,
}: CommentProps) {
  const systemRoot = comments.filter(
    (c) => c.parentId === null && c.commentType === 'APPLY',
  );

  const userRoot = comments.filter(
    (c) => c.parentId === null && c.commentType !== 'APPLY',
  );

  return (
    <div className="flex flex-col gap-[1.2rem]">
      <span className="typo-body2">댓글 {comments.length}</span>

      <div className="flex flex-col gap-[2.4rem]">
        {systemRoot.map((comment) => (
          <CommentItem
            key={comment.commentId}
            {...comment}
            participants={participants}
            isOwner={isOwner}
            onChangeApproval={onChangeApproval}
          />
        ))}

        {userRoot.map((comment) => (
          <div className="flex flex-col gap-[2rem]" key={comment.commentId}>
            <CommentItem
              {...comment}
              participants={participants}
              isOwner={isOwner}
              onChangeApproval={onChangeApproval}
            />

            <div className="flex flex-col gap-[1rem] pl-[4.4rem]">
              {comments
                .filter((c) => c.parentId === comment.commentId)
                .map((reply) => (
                  <CommentItem
                    key={reply.commentId}
                    {...reply}
                    participants={participants}
                    isOwner={isOwner}
                    onChangeApproval={onChangeApproval}
                  />
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
