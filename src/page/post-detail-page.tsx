import { TopNavigation } from '@shared/ui/topNavigation';
import { useNavigate, useParams } from 'react-router-dom';
import ArrowLeftIcon from '@shared/assets/icon/arrow-left.svg?react';
import UploadIcon from '@shared/assets/icon/upload.svg?react';
import { Carousel } from '@widgets/postDetail/carousel/carousel';
import { DetailInfo } from '@widgets/postDetail/detail-info';
import { Comment } from '@widgets/postDetail/comment/comment';
import Input from '@shared/ui/input';
import { FloatingActionButton } from '@shared/ui/floatingActionButton';
import SendIcon from '@shared/assets/icon/send.svg?react';
import { Button } from '@shared/ui/button';
import { useQuery } from '@tanstack/react-query';
import { FEED_QUERY_OPTIONS } from '@shared/api/domain/feeds/query';
import { useMutation } from '@tanstack/react-query';
import {
  PARTICIPATION_MUTATION_OPTIONS,
  PARTICIPATION_QUERY_OPTIONS,
} from '@shared/api/domain/participations/query';
import { getMyMemberId } from '@shared/utils/auth';
import { COMMENT_QUERY_OPTIONS } from '@shared/api/domain/comments/query';
import { queryClient } from '@app/providers/query-client';

const handleShare = async () => {
  const url = window.location.href;

  if (navigator.share) {
    try {
      await navigator.share({
        title: '공유하기',
        text: '게시글을 확인해보세요!',
        url,
      });
    } catch {
      console.log('공유 취소');
    }
  }
};

const PostDetailPage = () => {
  const navigate = useNavigate();
  const { feedId } = useParams();
  const numericFeedId = Number(feedId);
  const { mutate: applyParticipation } = useMutation({
    ...PARTICIPATION_MUTATION_OPTIONS.APPLY(),
    onSuccess: () => {
      console.log('✅ 참가 신청 성공');

      queryClient.invalidateQueries({
        queryKey: ['participations', numericFeedId],
      });

      queryClient.invalidateQueries({
        queryKey: ['comments', numericFeedId],
      });
    },

    onError: (error) => {
      console.error('❌ 참가 신청 실패:', error);
    },
  });
  const { data: participants } = useQuery(
    PARTICIPATION_QUERY_OPTIONS.LIST(numericFeedId),
  );
  const { data: commentsData } = useQuery(
    COMMENT_QUERY_OPTIONS.LIST(numericFeedId),
  );
  const { mutate: approveParticipation } = useMutation({
    ...PARTICIPATION_MUTATION_OPTIONS.APPROVE(),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['participations', numericFeedId],
      });

      queryClient.invalidateQueries({
        queryKey: ['comments', numericFeedId],
      });
    },
  });

  const { mutate: rejectParticipation } = useMutation({
    ...PARTICIPATION_MUTATION_OPTIONS.REJECT(),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['participations', numericFeedId],
      });

      queryClient.invalidateQueries({
        queryKey: ['comments', numericFeedId],
      });
    },
  });

  const { data, isLoading } = useQuery(
    FEED_QUERY_OPTIONS.DETAIL(numericFeedId),
  );
  if (isLoading) return <div>loading...</div>;

  if (!data) return <div>no data</div>;

  const myId = getMyMemberId();

  const isOwner = data.writer?.writerId === myId;
  const isApplied = participants?.some((p) => p.applicantId === myId) ?? false;
  const isClosed = false;

  const canApply = !isOwner && !isApplied && !isClosed;
  return (
    <div>
      <TopNavigation
        leftIcon={<ArrowLeftIcon width={'2.4rem'} height={'2.4rem'} />}
        rightIcon={<UploadIcon width={'2.4rem'} height={'2.4rem'} />}
        onLeftClick={() => navigate(-1)}
        onRightClick={handleShare}
      />

      {/* 🔥 이미지 */}
      <Carousel>
        <img src={data.image} alt="" />
      </Carousel>

      {/* 🔥 제목 */}
      <p className="h-[10.6rem] px-[2.4rem] py-[2rem] typo-h2 border-b">
        {data.title}
      </p>

      {/* 🔥 상세 정보 */}
      <div className="flex items-center flex-col px-[2.4rem] justify-center">
        <DetailInfo
          playDate={data.playDate}
          playCount={data.playCount}
          location={data.playGround}
          writerNickname={data.writer?.nickname}
        />
        <p className="flex typo-body1 py-[2rem] border-b">{data.description}</p>
      </div>

      <div className="px-[2.4rem] py-[2rem] border-b">
        <Comment
          comments={commentsData ?? []}
          isOwner={isOwner}
          onChangeApproval={(id, status) => {
            if (status === 'approved') {
              approveParticipation(id);
            } else {
              rejectParticipation(id);
            }
          }}
        />
      </div>

      {canApply && (
        <div className="flex flex-col items-center px-[2.4rem] pt-[2rem]">
          <Button onClick={() => applyParticipation(numericFeedId)}>
            참가 신청하기
          </Button>
        </div>
      )}
      <div className="flex w-full gap-[1.6rem] py-[1.4rem] px-[2.4rem]">
        <Input inputSize="sm" placeholder="댓글을 입력해주세요" />
        <FloatingActionButton
          mode="inline"
          icon={<SendIcon width={'2rem'} height={'2rem'} />}
        />
      </div>
    </div>
  );
};

export default PostDetailPage;
