import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import LoadingApp from '../../LoadingApp';
import {
  actionGetUserPosts,
  actionGetUserReels,
  actionSetCurrentContentType,
} from '../../../store/actions/instagram';
import UserPosts from './UserPosts/UserPosts';
import UserReels from './UserReels/UserReels';
import QuickFilter from '../QuickFilter';
import { setScheduleWaitingList } from '../../../store/actions/Schedules';

const UserContents = (props) => {
  const {
    isSchedule = false,
    isAuto = false,
    handleAddToWaitingList = () => {},
    open = false,
  } = props;

  const {
    loadingFeeds = false,
    loadingReels = false,
    reels = null,
    posts = null,
    currentUser = null,
    currentContentType = 'post',
    currentHashTag = '',
  } = useSelector((state) => state.instagram);

  const { autoWaitingList } = useSelector((state) => state.schedules);
  const dispatch = useDispatch();

  useEffect(() => {
    if (
      currentContentType === 'post' &&
      posts === null &&
      currentUser &&
      currentUser.username
    ) {
      dispatch(actionGetUserPosts(currentUser?.username));
    }
  }, [currentContentType, currentUser, posts]);

  useEffect(() => {
    if (currentContentType === 'reel' && reels === null && currentUser) {
      const { id = '', instagram_id = '' } = currentUser || {};
      dispatch(actionGetUserReels(instagram_id || id));
    }
  }, [currentContentType, currentUser, reels]);

  const handleChangeType = (type) => {
    dispatch(actionSetCurrentContentType(type));
  };

  const onSelectAll = () => {
    const contents = currentContentType === 'post' ? posts : reels;
    dispatch(
      setScheduleWaitingList({
        ...autoWaitingList,
        contents: contents?.items || [],
        source_type: 'instagram',
      })
    );
  };

  const onUnSelectAll = () => {
    dispatch(
      setScheduleWaitingList({
        ...autoWaitingList,
        contents: [],
      })
    );
  };

  return (
    <div className="userContents border border-gray-300 rounded-md bg-white p-2">
      <div className="tabs flex gap-3 items-center border-b border-primary pl-2 z-8888 relative">
        <div
          className={`tab_posts cursor-pointer py-3 px-5 ${
            currentContentType === 'post'
              ? 'border rounded-md border-primary text-primary border-b-0 rounded-b-none bg-white'
              : ''
          }`}
          style={{ marginBottom: '-1px' }}
          onClick={() => handleChangeType('post')}
        >
          Feed
        </div>
        <div
          className={`tab_reels cursor-pointer py-3 px-5 ${
            currentContentType === 'reel'
              ? 'border rounded-md border-primary text-primary border-b-0 rounded-b-none bg-white'
              : ''
          }`}
          style={{ marginBottom: '-1px' }}
          onClick={() => handleChangeType('reel')}
        >
          Reels
        </div>
        <div className="quickFilterContainer ml-auto">
          <QuickFilter type={currentContentType} isSchedule={isSchedule} />
        </div>
      </div>

      <div className="tabsContents pt-2">
        {isAuto && !loadingReels && !loadingFeeds && (
          <div className="flex gap-2 items-center mb-2 z-10 bg-white py-2 sticky border-b top-0">
            <div className="actions">
              <button
                className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-3 text-blue-600 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 font-bold mr-1"
                onClick={() => onSelectAll()}
              >
                Chọn toàn bộ
              </button>
              <button
                className="border-2 border-gray-200 bg-gray-100 hover:bg-blue-50 py-3 px-4 text-gray-500 rounded-md"
                onClick={() => onUnSelectAll()}
              >
                Bỏ chọn
              </button>
            </div>
            <div className="summary mb-2 ml-auto text-base">
              <span>Số bài viết đã chọn: </span>
              <span className="font-bold">
                {autoWaitingList?.contents?.length || 0}
              </span>
            </div>
          </div>
        )}
        {currentContentType === 'post' && (
          <div className="posts">
            {loadingFeeds ? (
              <LoadingApp />
            ) : (
              <UserPosts
                isSchedule={isSchedule}
                isAuto={isAuto}
                handleAddToWaitingList={handleAddToWaitingList}
              />
            )}
          </div>
        )}
        {currentContentType === 'reel' && (
          <div className="reels">
            {loadingReels ? (
              <LoadingApp />
            ) : (
              <UserReels
                isSchedule={isSchedule}
                isAuto={isAuto}
                handleAddToWaitingList={handleAddToWaitingList}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserContents;
