import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaSpinner } from 'react-icons/fa';
import { FiPlus } from 'react-icons/fi';
import { setScheduleWaitingList } from '../../../store/actions/Schedules';
import { setContentDetailToShow } from '../../../store/actions/Contents/contentActions';
import SingleVideo from './SingleVideo';
import { actionGetVideos, actionLoadMoreVideos } from '../../../store/actions/videoEditor';
import LoadingApp from '../../LoadingApp';
import auth from '../../../utils/auth';
import { confirmAlert } from 'react-confirm-alert';
import { VIDEO_EDITOR_URL } from '../../../configs';

const VideoEditor = (props) => {
  const dispatch = useDispatch();
  const { isAuto = false, handleAddToWaitingList = () => {} } = props;
  // @ts-ignore
  const { isLoading, isLoadingMore = false, videos = [], pagination = {}, hasInitialized = false } = useSelector((state) => state.videoEditor);
  // @ts-ignore
  const { autoWaitingList } = useSelector((state) => state.schedules);
  const [renderedVideos, setRenderedVideos] = useState([]);

  const togglePopup = (video) => {
    dispatch(
      setContentDetailToShow({
        post_text: video.description,
        medias: [""],
        isCreatedContent: true,
        media_url: video.rendered_url,
        media_type: "video",
        user_screenname: "_",
      })
    );
  };

  // Load videos on component mount if not already initialized
  useEffect(() => {
    if (!hasInitialized) {
      dispatch(actionGetVideos(1, 16));
    } else {
      // Force update rendered videos if already initialized
      const filteredVideos = videos.filter((video) => video.rendered_url);
      setRenderedVideos(filteredVideos);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array to run only once on mount

  useEffect(() => {
    // only get videos has rendered_url
    const filteredVideos = videos.filter((video) => video.rendered_url);
    setRenderedVideos(filteredVideos);
  }, [videos, hasInitialized]);

  // Show loading only when actually loading and no videos yet
  const shouldShowLoading = isLoading && !hasInitialized;

  // Show empty state only when initialized and no rendered videos
  const shouldShowEmptyState = hasInitialized && renderedVideos.length === 0 && !isLoading;

  // Handle load more for videos
  const handleLoadMore = () => {
    const nextPage = pagination.current_page + 1;
    if (nextPage <= pagination.last_page) {
      dispatch(actionLoadMoreVideos(nextPage, pagination.per_page));
    }
  };

  // Check if there are more videos to load
  const hasMoreVideos = pagination.current_page < pagination.last_page;

  const onSelectAll = () => {
    dispatch(
      setScheduleWaitingList({
        ...autoWaitingList,
        contents: renderedVideos,
        source_type: 'video_editor',
      })
    );
  };

  const onUnSelectAll = () => {
    dispatch(
      setScheduleWaitingList({
        ...autoWaitingList,
        contents: [],
        source_type: 'video_editor',
      })
    );
  };


  const onClickVideoEditor = () => {
    const accessToken = auth.getToken();
    if (!accessToken) {
      confirmAlert({
        title: 'Thông báo',
        message: 'Bạn cần đăng nhập để sử dụng tính năng này.',
        buttons: [
          {
            label: 'OK',
            onClick: () => window.location.href = '/login',
          },
        ],
      });
      return;
    }
    const url = new URL(`${VIDEO_EDITOR_URL}/`);
    url.searchParams.set('access_token', accessToken);
    window.open(url.toString(), '_blank');
  }

  return (
    <div className="VideoEditorContainer">
      {shouldShowLoading ? (
        <LoadingApp />
      ) : (
        <div className="VideoEditor">
          {shouldShowEmptyState ? (
            <div className="text-center mt-4 h-80 flex items-center justify-center text-base">
              Bạn xuất bản video nào từ Video Editor, hãy sử dụng tính năng này trong
              trình tạo nội dung.
              <span
                className="underline cursor-pointer font-bold uppercase"
                onClick={() => onClickVideoEditor()}
              >
                tại đây
              </span>
            </div>
          ) : (
            <div>
              {/* Info and actions header */}
              <div className="flex gap-2 items-center mb-4 z-10 bg-white py-2 sticky border-b top-0">
                {isAuto && (
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
                )}
                
                {isAuto && (
                  <div className="summary text-base">
                    <span>Đã chọn: </span>
                    <span className="font-bold">
                      {autoWaitingList?.contents?.length || 0}
                    </span>
                  </div>
                )}
              </div>

              {/* Video Grid */}
              {renderedVideos.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3">
                  {renderedVideos.map((video) => {
                    return (
                      <SingleVideo
                        key={video.id}
                        video={video}
                        isAuto={isAuto}
                        handleAddToWaitingList={handleAddToWaitingList}
                        onClickShowDetail={(video) => {
                          togglePopup(video);
                        }}
                      />
                    );
                  })}
                </div>
              ) : (
                hasInitialized && (
                  <div className="text-center py-8 text-gray-500">
                    Không có video nào đã được render
                  </div>
                )
              )}

              {/* Load More Button */}
              {hasMoreVideos && renderedVideos.length >= pagination.total && (
                <div className="flex justify-center mt-6">
                  <button
                    onClick={handleLoadMore}
                    disabled={isLoadingMore}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                      isLoadingMore
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-blue-500 text-white hover:bg-blue-600 hover:shadow-lg transform hover:scale-105'
                    }`}
                  >
                    {isLoadingMore ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-400"></div>
                        <span>Đang tải...</span>
                      </>
                    ) : (
                      <>
                        <FiPlus className="w-5 h-5" />
                        <span>Xem thêm video</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VideoEditor;
