import { useDispatch, useSelector } from 'react-redux';
import LoadingApp from '../../LoadingApp';
import SingleUser from '../SingleUser';
import React, { useEffect, useState } from 'react';
import {
  actionGetHashtagPosts,
  actionSetCollectionModalOpen,
  actionSetCollectionType,
  actionSetCurrentContentType,
  actionSetCurrentUser,
  actionUpdateChosenPosts,
} from '../../../store/actions/instagram';
import { convertInstagramLink } from '../../../helpers';
import UserContents from './UserContents';
import { FiArrowLeft, FiChevronLeft } from 'react-icons/fi';
import PerfectScrollbar from 'react-perfect-scrollbar';
import SinglePost from './UserPosts/SinglePost';
import { toast } from 'react-toastify';
import QuickFilter from '../QuickFilter';
import { applyOrder } from '../helpers';
import { setScheduleWaitingList } from '../../../store/actions/Schedules';
import { listDefaultHashTag } from '../helpers';

const RightPart = (props) => {
  const {
    isSchedule = false,
    isAuto = false,
    handleAddToWaitingList = () => {},
    open = false,
  } = props;
  const dispatch = useDispatch();
  const [isShowUsers, setIsShowUsers] = useState(true);
  const [isShowContents, setIsShowContents] = useState(false);
  const [collectionPosts, setCollectionPosts] = useState([]);
  const [isShowCollectionActions, setIsShowCollectionActions] = useState(false);
  const [contentsData, setContentsData] = useState([]);
  const [hasNoData, setHasNoData] = useState(false);

  const {
    loadingUsers = false,
    loadingCollections = false,
    users = [],
    currentUser = null,
    currentCollection = null,
    loadingCollectionDetail = false,
    collectionDetail = null,
    chosenPosts = [],
    currentContentType = 'post',
    posts = null,
    reels = null,
    orderType,
    orderDir,
    currentHashTag = '',
  // @ts-ignore
  } = useSelector((state) => state.instagram);

  // @ts-ignore
  const { autoWaitingList } = useSelector((state) => state.schedules);

  useEffect(() => {
    if (currentContentType === 'post' || currentHashTag) {
      setContentsData(posts?.items || []);
    } else {
      setContentsData(reels?.items || []);
    }
  }, [currentContentType, posts, reels, currentHashTag]);

  useEffect(() => {
    if (currentUser) {
      setIsShowUsers(false);
      setIsShowContents(true);
      if (!isSchedule) setIsShowCollectionActions(true);
    } else {
      if (currentHashTag) {
        setIsShowUsers(false);
        setIsShowContents(true);
        if (!isSchedule) setIsShowCollectionActions(true);
      } else {
        setIsShowUsers(true);
        setIsShowContents(false);
        setIsShowCollectionActions(false);
      }
    }
  }, [currentUser, isSchedule, currentHashTag]);

  useEffect(() => {
    if (collectionDetail) {
      const { postsData = [] } = collectionDetail;
      // add post_id to postsData
      postsData.forEach((post) => {
        post.post_id = post.id;
      });
      const orderedData = applyOrder(orderType, orderDir, postsData);
      setCollectionPosts([...orderedData]);
    } else {
      setCollectionPosts([]);
    }
  }, [collectionDetail, orderDir, orderType]);

  useEffect(() => {
    if (
      !posts?.items?.length &&
      !reels?.items?.length &&
      !users?.length &&
      !currentUser &&
      !currentCollection
    ) {
      setHasNoData(true);
    }
  }, [posts, reels, currentUser, currentCollection]);

  useEffect(() => {
    if (hasNoData) {
      // get random hashtag
      const randomIndex = Math.floor(Math.random() * listDefaultHashTag.length);
      const randomHashTag = listDefaultHashTag[randomIndex];
      dispatch(actionGetHashtagPosts(randomHashTag));
      dispatch(actionSetCurrentContentType('post'));
    }
  }, [hasNoData]);

  const handleOnClickGoBack = () => {
    dispatch(actionSetCurrentUser(null));
  };

  const selectAllPosts = () => {
    const newChosenPosts = contentsData.filter((content) => {
      const index = collectionPosts.findIndex((item) => item.id === item.id);
      if (index > -1) {
        return false;
      }
      return true;
    });
    dispatch(actionUpdateChosenPosts(newChosenPosts));
  };

  const showCollectionModal = () => {
    if (chosenPosts.length > 0) {
      dispatch(actionSetCollectionModalOpen(true));
      dispatch(actionSetCollectionType('addPosts'));
    } else {
      toast.error('Vui lòng chọn bài viết');
    }
  };

  const onSelectAll = () => {
    dispatch(
      setScheduleWaitingList({
        ...autoWaitingList,
        contents: collectionPosts,
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
    <div className="results">
      {loadingUsers || loadingCollections ? (
        <div className="border border-gray-300 rounded-md bg-white p-3">
          <LoadingApp />
        </div>
      ) : (
        <div className="rightContentContainer">
          {currentCollection && (
            <div>
              <div className="selectedCollectionDetail flex items-center gap-3 border border-gray-300 rounded-md bg-white py-3 px-3 mb-2 relative z-20">
                <h3 className="text-sm font-bold">{currentCollection?.name}</h3>
                <div className="quickFilterContainer ml-auto">
                  <QuickFilter
                    type={currentContentType}
                    isSchedule={isSchedule}
                  />
                </div>
              </div>
              {loadingCollectionDetail ? (
                <div className="border border-gray-300 rounded-md bg-white p-3">
                  <LoadingApp />
                </div>
              ) : (
                <div>
                  {isAuto && !loadingCollectionDetail && (
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
                  <PerfectScrollbar className="max-h-screen">
                    <div
                      className={`collectionPosts gap-1 border border-gray-300 rounded-md p-3 bg-white relative z-10 grid ${
                        open ? 'grid-cols-2' : 'grid-cols-3'
                      }`}
                    >
                      {collectionPosts.map((post, index) => (
                        <SinglePost
                          key={index}
                          post={post}
                          isSchedule={isSchedule}
                          isAuto={isAuto}
                          handleAddToWaitingList={handleAddToWaitingList}
                        />
                      ))}
                    </div>
                  </PerfectScrollbar>
                </div>
              )}
            </div>
          )}
          {!currentCollection && isShowUsers && (
            <div>
              <div className="flex items-center gap-3 border border-gray-300 rounded-md bg-white py-4 px-3 mb-2">
                <h3 className="text-sm font-bold">Kết quả tìm kiếm</h3>
              </div>
              <PerfectScrollbar className="max-h-screen">
                {users.length > 0 ? (
                  <div
                    className={`instagramUsers gap-2 border border-gray-300 rounded-md bg-white p-3 ${
                      open ? '' : 'grid grid-cols-2'
                    }`}
                  >
                    {users.map((user, index) => (
                      <SingleUser
                        key={index}
                        index={index}
                        user={user}
                        isSchedule={isSchedule}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 border border-gray-300 rounded-md bg-white p-3">
                    Vui lòng nhập từ khoá để tìm kiếm
                  </div>
                )}
              </PerfectScrollbar>
            </div>
          )}
          {!currentCollection && isShowContents && (
            <div className="userDetailContainer">
              <div
                className={`selectedUserDetail flex items-center border border-gray-300 rounded-md bg-white mb-3 ${
                  !currentHashTag || isSchedule ? '' : 'p-3'
                }`}
              >
                {!currentHashTag && (
                  <div
                    className={`flex items-center w-1/3 gap-3 whitespace-nowrap flex-nowrap ${
                      !currentUser ? 'hidden' : 'pl-2'
                    } `}
                  >
                    {/* icon go back */}
                    <div
                      className="cursor-pointer px-2 py-4 border border-primary rounded-md text-primary hover:bg-primary hover:text-white"
                      onClick={() => handleOnClickGoBack()}
                    >
                      <FiChevronLeft />
                    </div>
                    <div
                      className="avatar bg-cover rounded-full bg-no-repeat w-14 h-14"
                      style={{
                        backgroundImage: `url(${convertInstagramLink(
                          currentUser?.picture
                        )})`,
                      }}
                    >
                      {''}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold">
                        {currentUser?.username}
                      </h3>
                      <p className="text-sm text-gray-500 whitespace-pre-wrap">
                        {currentUser?.page_name}
                      </p>
                      <p className="font-bold">{currentUser?.desc}</p>
                    </div>
                  </div>
                )}
                {/* show actions */}
                {isShowCollectionActions && (
                  <div className="collectionActions flex gap-2 items-center justify-center ml-auto bg-white">
                    {chosenPosts.length > 0 ? (
                      <div className="summary">
                        <span>Bạn đã chọn </span>
                        <span className="font-bold">
                          {chosenPosts?.length || 0}
                        </span>
                        /{' '}
                        <span className="font-bold">
                          {contentsData?.length || 0}
                        </span>
                        <span> bài viết</span>
                      </div>
                    ) : (
                      <div className="summary hidden">
                        <span>
                          Chọn bài viết bên dưới để lưu vào bộ sưu tập
                        </span>
                      </div>
                    )}
                    <div className="actions flex gap-3 whitespace-nowrap">
                      <button
                        className="border-1 disabled:cursor-not-allowed border-red-800 bg-red-800 hover:bg-red-500 py-3 px-4 text-white rounded-md"
                        disabled={chosenPosts.length === 0}
                        onClick={() => dispatch(actionUpdateChosenPosts([]))}
                      >
                        Bỏ chọn
                      </button>
                      <button
                        className="border-1 border-green-700 bg-green-700 disabled:cursor-not-allowed hover:bg-green-500 py-3 px-4 text-white rounded-md"
                        onClick={() => selectAllPosts()}
                        disabled={
                          contentsData.length === 0 ||
                          chosenPosts.length === contentsData.length
                        }
                      >
                        Chọn toàn bộ
                      </button>
                      <button
                        className="border-1 disabled:cursor-not-allowed border-primary bg-primary hover:bg-primaryHover py-3 px-4 text-white rounded-md"
                        onClick={() => showCollectionModal()}
                        disabled={chosenPosts.length === 0}
                      >
                        Lưu vào bộ sưu tập
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <UserContents
                isSchedule={isSchedule}
                isAuto={isAuto}
                handleAddToWaitingList={handleAddToWaitingList}
                open={open}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RightPart;
