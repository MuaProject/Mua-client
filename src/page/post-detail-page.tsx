import { TopNavigation } from '@shared/ui/topNavigation';
import { useNavigate, useParams } from 'react-router-dom';
import ArrowLeftIcon from '@shared/assets/icon/arrow-left.svg?react';
import UploadIcon from '@shared/assets/icon/upload.svg?react';
import { Carousel } from '@widgets/postDetail/carousel/carousel';
import { DetailInfo } from '@widgets/postDetail/detail-info';
import { Comment } from '@widgets/postDetail/comment/comment';
import type { CommentItemProps } from '@widgets/postDetail/comment/comment-item';
import Input from '@shared/ui/input';
import { FloatingActionButton } from '@shared/ui/floatingActionButton';
import SendIcon from '@shared/assets/icon/send.svg?react';
import { Button } from '@shared/ui/button';
import { useQuery } from '@tanstack/react-query';
import { FEED_QUERY_OPTIONS } from '@shared/api/domain/feeds/query';

const mockComments: CommentItemProps[] = [
  {
    id: 1,
    author: '승택',
    time: '19시간 전',
    value: '제발 저요!!!',
    parentId: null,
    type: 'user',
  },
];

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

  const { data, isLoading } = useQuery(
    FEED_QUERY_OPTIONS.DETAIL(numericFeedId),
  );
  if (isLoading) return <div>loading...</div>;

  if (!data) return <div>no data</div>;

  const isOwner = false;
  const isApplied = false;
  const isClosed = false;

  const canApply = !isOwner && !isApplied && !isClosed;
  console.log('feed detail:', data);
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

      {/* 🔥 댓글 (아직 mock) */}
      <div className="px-[2.4rem] py-[2rem] border-b">
        <Comment comments={mockComments} />
      </div>

      {canApply && (
        <div className="flex flex-col items-center px-[2.4rem] pt-[2rem]">
          <Button>참가 신청하기</Button>
          <div className="flex w-full gap-[1.6rem] py-[1.4rem]">
            <Input inputSize="sm" placeholder="댓글을 입력해주세요" />
            <FloatingActionButton
              mode="inline"
              icon={<SendIcon width={'2rem'} height={'2rem'} />}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PostDetailPage;
