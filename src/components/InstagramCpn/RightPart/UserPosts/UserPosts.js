import React, { useState, useEffect, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SinglePost from './SinglePost';
import {
  actionGetHashtagPosts,
  actionGetUserPosts,
} from '../../../../store/actions/instagram';
import LoadingApp from '../../../LoadingApp';
import { applyOrder } from '../../helpers';

const UserPosts = (props) => {
  const {
    isSchedule = false,
    isAuto = false,
    handleAddToWaitingList = () => {},
  } = props;

  const {
    posts = null,
    loadingFeeds = false,
    currentUser = null,
    nextIsLoading = false,
    orderType = 'created',
    orderDir = 1,
    scheduleFilter = 0,
    currentHashTag = '',
    hashTagNextCursor = '',
  } = useSelector((state) => state.instagram);

  const { scheduledContents = [] } = useSelector((state) => state.schedules);

  const dispatch = useDispatch();
  const [listPosts, setListPosts] = useState([]);

  useEffect(() => {
    if (posts && !loadingFeeds && !nextIsLoading) {
      const { items = [] } = posts;
      const orderedPosts = applyOrder(orderType, orderDir, items);

      switch (scheduleFilter) {
        case 1: // scheduled
          const filteredPosts = orderedPosts.filter((post) => {
            return scheduledContents.some(
              (content) =>
                content.content_id === post.id &&
                content.source_type === 'instagram'
            );
          });
          setListPosts([...filteredPosts]);
          break;

        case 2: // not scheduled
          const notScheduledPosts = orderedPosts.filter((post) => {
            return !scheduledContents.some(
              (content) =>
                content.content_id === post.id &&
                content.source_type === 'instagram'
            );
          });
          setListPosts([...notScheduledPosts]);
          break;

        default:
          setListPosts([...orderedPosts]);
          break;
      }
    }
  }, [
    posts,
    loadingFeeds,
    nextIsLoading,
    orderDir,
    orderType,
    scheduleFilter,
    scheduledContents,
  ]);

  const onLoadMore = () => {
    const { has_next = false, next_cursor = '' } = posts;
    if (has_next) {
      dispatch(actionGetUserPosts(currentUser?.username, next_cursor));
    }
  };

  const onLoadMoreHashTag = () => {
    dispatch(actionGetHashtagPosts(currentHashTag, true, hashTagNextCursor));
  };

  return (
    <div>
      {listPosts.length > 0 ? (
        <div
          className={`grid gap-1 mt-3 ${
            isSchedule ? 'grid-cols-2' : 'grid-cols-2'
          }`}
        >
          {listPosts.map((post, index) => (
            <Fragment key={index}>
              <SinglePost
                post={post}
                key={index}
                isSchedule={isSchedule}
                isAuto={isAuto}
                handleAddToWaitingList={handleAddToWaitingList}
              />
            </Fragment>
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

      {!loadingFeeds &&
        !nextIsLoading &&
        listPosts.length > 0 &&
        posts?.has_next && (
          <div className="text-center p-3 mt-3">
            <button
              className="bg-blue-500 text-white px-5 py-3 rounded-md w-1/3"
              onClick={() => onLoadMore()}
            >
              Lấy thêm bài viết
            </button>
          </div>
        )}

      {!loadingFeeds && currentHashTag && listPosts?.length > 0 && (
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

export default UserPosts;
