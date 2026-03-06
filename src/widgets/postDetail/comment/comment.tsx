import type { ApprovalStatus } from '@widgets/postDetail/chip/chip';
import {
  CommentItem,
  type CommentItemProps,
} from '@widgets/postDetail/comment/comment-item';

interface CommentProps {
  comments: CommentItemProps[];
  isOwner?: boolean;
  onChangeApproval?: (
    commentId: number,
    status: Exclude<ApprovalStatus, 'pending'>,
  ) => void;
}

export function Comment({ comments, isOwner, onChangeApproval }: CommentProps) {
  const systemRoot = comments.filter(
    (c) => c.parentId === null && c.commentType === 'SYSTEM',
  );

  const userRoot = comments.filter(
    (c) => c.parentId === null && c.commentType !== 'SYSTEM',
  );

  return (
    <div className="flex flex-col gap-[1.2rem]">
      <span className="typo-body2">댓글 {comments.length}</span>

      <div className="flex flex-col gap-[2.4rem]">
        {systemRoot.map((comment) => (
          <CommentItem
            key={comment.commentId}
            {...comment}
            isOwner={isOwner}
            onChangeApproval={onChangeApproval}
          />
        ))}

        {userRoot.map((comment) => (
          <div className="flex flex-col gap-[2rem]" key={comment.commentId}>
            <CommentItem
              {...comment}
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
