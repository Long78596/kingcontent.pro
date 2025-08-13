import React, { useState, useEffect } from "react";
import SingleVideo from "./SingleVideo";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { setContentDetailToShow } from "../../store/actions/Contents/contentActions";
import { actionRemoveVideo, actionSetCurrentVideo, actionSetShowModal, actionGetVideos, actionLoadMoreVideos } from "../../store/actions/videoEditor";
import { setCurrentDateTime, setIsShowFinalStep, setSelectedScheduleContent, setShowSourceIdeasPopup } from "../../store/actions/Schedules";
import { confirmAlert } from "react-confirm-alert";
import { FiCalendar, FiEye, FiEdit, FiPlus } from "react-icons/fi";
import DescriptionModal from "./DescriptionModal";

const ListVideos = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  // @ts-ignore
  const { videos = [], pagination = {}, hasInitialized = false, isLoadingMore = false } = useSelector((state) => state.videoEditor);

  const [isDescriptionModalOpen, setDescriptionModalOpen] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(null);

  // Load videos on component mount only if not already initialized
  useEffect(() => {
    if (!hasInitialized) {
      dispatch(actionGetVideos(1, 16));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array to run only once on mount

  // Handle load more
  const handleLoadMore = () => {
    const nextPage = pagination.current_page + 1;
    if (nextPage <= pagination.last_page) {
      dispatch(actionLoadMoreVideos(nextPage, pagination.per_page));
    }
  };

  // Check if there are more videos to load
  const hasMoreVideos = pagination.current_page < pagination.last_page;

  // Optional: Auto-load more videos when scrolling near bottom
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight) return;
      
      // Auto load more when reaching bottom
      const stillHasMoreVideos = pagination.current_page < pagination.last_page;
      if (!isLoadingMore && stillHasMoreVideos) {
        const nextPage = pagination.current_page + 1;
        if (nextPage <= pagination.last_page) {
          dispatch(actionLoadMoreVideos(nextPage, pagination.per_page));
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLoadingMore, pagination.current_page, pagination.last_page, pagination.per_page, dispatch]);

  const handleViewOriginalVideo = (video) => {
    dispatch(
      setContentDetailToShow({
        post_text: video.description,
        medias: [""],
        isCreatedContent: true,
        media_url: video.video_url,
        media_type: "video",
        user_screenname: "_",
      })
    );
  };

  const handleViewRenderedVideo = (video) => {
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

  const handleScheduleVideo = (video) => {
    dispatch(
      setSelectedScheduleContent({
        post_text: video.title,
        medias: [],
        user_id: video.user_id,
        media_url: video.rendered_url || video.video_url,
        media_type: "video",
        source_type: "video_editor",
        content_id: video.id,
        post_id: video.id,
        videos: [video.rendered_url || video.video_url],
      })
    );
    dispatch(setCurrentDateTime());
    dispatch(setIsShowFinalStep(true));
    dispatch(setShowSourceIdeasPopup(false));
    history.push("/lich-dang-bai");
  };

  const handleDeleteVideo = (id) => {
    confirmAlert({
      title: "Xác nhận xóa",
      message: "Bạn có chắc chắn muốn xóa video này? Hành động này không thể hoàn tác.",
      buttons: [
        {
          label: "Xóa",
          onClick: () => {
            dispatch(actionRemoveVideo(id, pagination.current_page, pagination.per_page));
          },
          className: "bg-red-500 text-white px-4 py-2 rounded-md",
        },
        {
          label: "Hủy",
          onClick: () => {},
          className: "bg-green-500 text-white px-4 py-2 rounded-md",
        },
      ],
    });
  };

  const handleEditHashtag = (video) => {
    dispatch(actionSetCurrentVideo(video));
    dispatch(actionSetShowModal(true));
  };

  const handleEditDescription = (video) => {
    setCurrentVideo(video);
    setDescriptionModalOpen(true);
  };

  const getActions = (rendered_url) => [
    {
      id: "view_result",
      label: "Xem kết quả",
      icon: <FiEye className="text-2xl" />,
      onClick: handleViewRenderedVideo,
      condition: !!rendered_url,
    },
    {
      id: "view_original",
      label: "Xem video gốc",
      icon: <FiEye className="text-white text-2xl" />,
      onClick: handleViewOriginalVideo,
      condition: true,
    },
    {
      id: "schedule",
      label: "Lên lịch",
      icon: <FiCalendar className="text-2xl" />,
      onClick: handleScheduleVideo,
      condition: true,
    },
    {
      id: "edit_description",
      label: "Chỉnh sửa mô tả",
      icon: <FiEdit className="text-2xl" />,
      onClick: handleEditDescription,
      condition: true,
    },
  ];

  return (
    <>
      <div className="space-y-6 mb-3">
        {/* Video Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {videos.map((video) => {
            return (
              <SingleVideo
                key={video.id}
                video={video}
                getActions={getActions}
                handleEditHashtag={handleEditHashtag}
                handleDeleteVideo={handleDeleteVideo}
              />
            );
          })}
        </div>

        {/* Load More Button */}
        {hasMoreVideos && (
          <div className="flex justify-center mt-8">
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

        {/* Video Count Info */}
        {videos.length > 0 && (
          <div className="text-center text-sm text-gray-600">
            Hiển thị {videos.length} / {pagination.total} video
          </div>
        )}

        {/* Empty State */}
        {videos.length === 0 && hasInitialized && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">Chưa có video nào</div>
            <div className="text-gray-400 text-sm mt-2">Hãy tạo video đầu tiên của bạn</div>
          </div>
        )}
      </div>

      {isDescriptionModalOpen && (
        <DescriptionModal
          video={currentVideo}
          onClose={() => setDescriptionModalOpen(false)}
        />
      )}
    </>
  );
};

export default ListVideos;