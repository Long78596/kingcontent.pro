import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SingleReel from './SingleReel';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  actionGetHashtagPosts,
  actionGetUserReels,
} from '../../../../store/actions/instagram';
import LoadingApp from '../../../LoadingApp';
import { applyOrder } from '../../helpers';

const UserReels = (props) => {
  const {
    isSchedule = false,
    isAuto = false,
    handleAddToWaitingList = () => {},
  } = props;
  const {
    currentUser,
    reels = null,
    loadingReels = false,
    nextIsLoading = false,
    orderDir = 1,
    orderType = 'created',
    currentHashTag = '',
    scheduleFilter = 0,
  } = useSelector((state) => state.instagram);

  const { scheduledContents = [] } = useSelector((state) => state.schedules);

  const [listReels, setListReels] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    if (reels && !loadingReels && !nextIsLoading) {
      const { items = [] } = reels;
      const orderedReels = applyOrder(orderType, orderDir, items);

      switch (scheduleFilter) {
        case 1: // scheduled
          const filteredPosts = orderedReels.filter((post) => {
            return scheduledContents.some(
              (content) =>
                content.content_id === post.id &&
                content.source_type === 'instagram'
            );
          });
          setListReels([...filteredPosts]);
          break;

        case 2: // not scheduled
          const notScheduledPosts = orderedReels.filter((post) => {
            return !scheduledContents.some(
              (content) =>
                content.content_id === post.id &&
                content.source_type === 'instagram'
            );
          });
          setListReels([...notScheduledPosts]);
          break;

        default:
          setListReels([...orderedReels]);
          break;
      }
    }
  }, [
    reels,
    loadingReels,
    nextIsLoading,
    orderDir,
    orderType,
    scheduleFilter,
    scheduledContents,
  ]);

  const onLoadMore = () => {
    const { has_next = false, next_cursor = '' } = reels;
    if (has_next) {
      dispatch(
        actionGetUserReels(
          currentUser?.instagram_id || currentUser?.id,
          next_cursor
        )
      );
    }
  };

  const onLoadMoreHashTag = () => {
    dispatch(actionGetHashtagPosts(currentHashTag, true));
  };

  return (
    <div>
      {listReels.length > 0 ? (
        <div
          className={`grid gap-1 mt-3 ${
            isSchedule ? 'grid-cols-3' : 'grid-cols-3'
          }`}
        >
          {listReels.map((reel, index) => (
            <SingleReel
              reel={reel}
              key={index}
              isSchedule={isSchedule}
              isAuto={isAuto}
              handleAddToWaitingList={handleAddToWaitingList}
            />
          ))}
        </div>
      ) : (
        <div className="text-center p-5">
          <p>Không có bài viết nào</p>
        </div>
      )}
      {/* load more */}
      {nextIsLoading && (
        <div className="text-center p-3">
          <LoadingApp />
        </div>
      )}

      {!loadingReels &&
        !nextIsLoading &&
        listReels.length > 0 &&
        reels?.has_next &&
        !currentHashTag && (
          <div className="text-center p-3 mt-3">
            <button
              className="bg-blue-500 text-white px-5 py-3 rounded-md w-1/3"
              onClick={() => onLoadMore()}
            >
              Lấy thêm bài viết
            </button>
          </div>
        )}

      {!loadingReels && currentHashTag && (
        <div className="text-center p-3 mt-3">
          <button
            className="bg-blue-500 text-white px-5 py-3 rounded-md w-1/3"
            onClick={() => onLoadMoreHashTag()}
          >
            Lấy thêm bài viết
          </button>
        </div>
      )}
    </div>
  );
};

export default UserReels;
