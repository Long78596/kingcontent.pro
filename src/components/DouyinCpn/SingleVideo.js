import React from 'react';
import {
  FaComment,
  FaHeart,
  FaPlay,
  FaShare,
  FaClock,
  FaCheckSquare,
  FaRegSquare,
  FaTimesCircle,
  FaDownload,
  FaExclamation,
  FaPencilAlt,
} from 'react-icons/fa';
import { checkInCollection, fancyTimeFormat } from '../../utils/utilityFunc';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ImPlay, ImVideoCamera } from 'react-icons/im';
import { nFormatter } from '../../configs';
import {
  FiClock,
  FiHeart,
  FiPlay,
  FiShare,
  FiSlash,
  FiUser,
} from 'react-icons/fi';
import {
  setCurrentEditingContent,
  setIsShowFinalStep,
  setSelectedScheduleContent,
  setShowSourceIdeasPopup,
} from '../../store/actions/Schedules';
// @ts-ignore
import addIcons from '../../assets/images/icon/create-content/add.png';
import { convertInstagramLink } from '../../helpers';
import { confirmAlert } from 'react-confirm-alert';
import auth from '../../utils/auth';

const defaultActions = [
  { icon: ImPlay, title: 'Xem video', action: 'VIEW_DETAIL_CONTENT' },
  /*{
    icon: FaHeart,
    title: 'Thêm vào BST',
    action: 'ADD_TO_COLLECTION',
  },*/
  { icon: FaRegSquare, title: 'Chọn', action: 'CHOOSE_VIDEO' },
  { icon: FaClock, title: 'Lên lịch', action: 'SCHEDULE_CONTENT' },
  { icon: FaDownload, title: 'Tải về', action: 'DOWNLOAD', size: 40 },
];

const collectionActions = [
  { icon: ImPlay, title: 'Xem video', action: 'VIEW_DETAIL_CONTENT' },
  {
    icon: FaTimesCircle,
    title: 'Xoá khỏi BST',
    action: 'REMOVE_FROM_COLLECTION',
  },
  { icon: FaClock, title: 'Lên lịch', action: 'SCHEDULE_CONTENT' },
  { icon: FaDownload, title: 'Tải về', action: 'DOWNLOAD', size: 40 },
];

const actionsForEditor = [
  { icon: ImVideoCamera, title: 'Sửa video', action: 'EDIT_VIDEO' },
];

const SingleVideo = ({
  video,
  handleAction = () => {},
  isChosen = false,
  isSchedule = false,
  isAuto = false,
  handleAddToWaitingList = () => {},
}) => {
  const {
    feed_name = '',
    video_id = '',
    text = '',
    thumbnail = '',
    duration = 0,
    collection_id,
    likes = 0,
    comments = 0,
    shares = 0,
  } = video;

  const [actions, setActions] = useState(defaultActions);
  const [collectionId, setCollectionId] = useState(0);
  const [isSelected, setIsSelected] = useState(false);
  const [displayPostText, setDisplayPostText] = useState(text || '');
  const {
    autoWaitingList,
    scheduledContents,
    editingContents = [],
  // @ts-ignore
  } = useSelector((state) => state.schedules);
  const [isScheduled, setIsScheduled] = useState(false);
  const dispatch = useDispatch();

  const { videoType = {}, collectionsVideos = [] } = useSelector(
    // @ts-ignore
    (state) => state.douyins
  );

  useEffect(() => {
    if (scheduledContents && scheduledContents.length > 0) {
      const search = scheduledContents.find((elt) => {
        return (
          elt?.content_id === video?.video_id && elt?.source_type === 'douyin'
        );
      });
      if (search) {
        setIsScheduled(true);
      } else {
        setIsScheduled(false);
      }
    } else {
      setIsScheduled(false);
    }
  }, [video, scheduledContents]);

  useEffect(() => {
    if (autoWaitingList) {
      const { contents } = autoWaitingList;
      if (contents.length > 0) {
        const search = contents.find((elt) => elt.video_id === video.video_id);
        if (search) {
          setIsSelected(true);
        } else {
          setIsSelected(false);
        }
      } else {
        setIsSelected(false);
      }
    } else {
      setIsSelected(false);
    }
  }, [video, autoWaitingList]);

  useEffect(() => {
    if (videoType && videoType.type === 'collection') {
      if (auth.isHasVip3()) {
        setActions([
          ...collectionActions,
          ...actionsForEditor,
        ]);
      } else {
        setActions(collectionActions);
      }
      setCollectionId(0);
    } else {
      // check if video is in collection
      const collId = checkInCollection(collectionsVideos, video_id);
      if (collId) {
        if (auth.isHasVip3()) {
          setActions([
            ...collectionActions,
            ...actionsForEditor,
          ]);
        } else {
          setActions(collectionActions);
        }
        setCollectionId(collId);
      } else {
        if (auth.isHasVip3()) {
          setActions([
            ...defaultActions,
            ...actionsForEditor,
          ]);
        } else {
          setActions(defaultActions);
        }
      }
    }
  }, [videoType, collectionsVideos, video_id, auth]);

  const handleAddToSchedule = () => {
    if (duration <= 300) {
      dispatch(
        setSelectedScheduleContent({
          ...video,
          source_type: 'douyin',
          post_id: video_id,
          post_text: text,
          media_type: 'video',
        })
      );
      dispatch(setIsShowFinalStep(true));
      dispatch(setShowSourceIdeasPopup(false));
    } else {
      confirmAlert({
        title: 'Thông báo',
        message:
          'Kingcontent chỉ hỗ trợ đăng video dài tối đa 5 phút. Vui lòng chọn video khác',
        buttons: [
          {
            label: 'Đồng ý',
            onClick: () => {},
          },
        ],
      });
    }
  };

  useEffect(() => {
    if (editingContents && editingContents.length > 0 && isAuto) {
      const search = editingContents.find(
        (elt) => elt.id === video_id && elt.source_type === 'douyin'
      );
      if (search) {
        setDisplayPostText(search.text);
      }
    }
  }, [editingContents, video_id, isAuto]);

  const handleEditContent = (item) => {
    const editingContent = {
      id: item.video_id,
      text: displayPostText,
      source_type: 'douyin',
    };
    dispatch(setCurrentEditingContent(editingContent));
  };

  return (
    <div className="singleDouyin relative">
      {isSchedule ? (
        <div
          className={`mb-2 flex gap-2 hover:bg-gray-200 rounded-md transition-all cursor-pointer border p-2`}
        >
          {isAuto && (
            <div
              className="w-1/12 flex items-center text-center justify-center"
              // @ts-ignore
              onClick={() => handleAddToWaitingList('douyin', video)}
            >
              {isSelected ? (
                <FaCheckSquare className="w-6 text-green-500 text-base" />
              ) : (
                <FaRegSquare className="w-6 text-gray-500 text-base" />
              )}
            </div>
          )}
          <div
            className="w-1/4 relative h-40 bg-no-repeat bg-cover bg-center rounded-lg"
              // @ts-ignore
            onClick={() => handleAction('VIEW_DETAIL_CONTENT', video)}
            style={{
              backgroundImage: `url(${convertInstagramLink(thumbnail)})`,
            }}
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform">
              <FiPlay
                size={50}
                color="#fff"
                className="hover:scale-125 cursor-pointer"
                title="Nhấp để xem"
              />
            </div>
          </div>
          <div
            className="w-4/6 relative"
              // @ts-ignore
            onClick={() => handleAction('VIEW_DETAIL_CONTENT', video)}
          >
            <h3 className="font-bold">{feed_name || ''}</h3>
            <p
              className="overflow-hidden line-clamp-3"
              dangerouslySetInnerHTML={{
                __html: isAuto ? displayPostText : text,
              }}
            ></p>
            <div className="w-full mt-2">
              <div className="flex justify-between">
                <span className="flex gap-1">
                  <FiHeart size={20} /> <span>{nFormatter(likes)}</span>
                </span>
                <span className="flex gap-1">
                  <FiUser size={20} /> <span>{nFormatter(comments)}</span>
                </span>
                <span className="flex gap-1">
                  <FiShare size={20} /> <span>{nFormatter(shares)}</span>
                </span>
              </div>
            </div>
            <div className="w-full mt-2 absolute bottom-2">
              <div className="flex justify-between">
                <span className="bg-darkBgOpacityClr py-1 px-2 rounded-md font-bold text-white flex gap-1">
                  <FiClock size={20} /> {fancyTimeFormat(duration)}
                </span>
              </div>
            </div>
          </div>
          {!isAuto && (
            <div
              className="w-1/6 ml-auto flex items-center justify-center"
              onClick={() => handleAddToSchedule()}
            >
              <img src={addIcons} className="w-8" />
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-2 p-3 mb-2 group relative">
          <div
            className="relative w-full h-96 overflow-hidden bg-cover bg-center rounded-lg"
            style={{
              backgroundImage: collection_id
                ? `url(${thumbnail})`
                : `url(${convertInstagramLink(thumbnail)})`,
            }}
          >
            {/* play count and duration */}
            <div className="absolute bottom-0 right-0 p-2 bg-black bg-opacity-50 rounded-bl-lg flex flex-nowrap justify-between w-full items-center">
              <span className="text-white gap-2 flex items-center">
                {fancyTimeFormat(duration)}
              </span>
            </div>
          </div>
          <div className="description overflow-ellipsis whitespace-nowrap overflow-hidden mt-1">
            {text}
          </div>
          <div className="flex justify-between mt-1">
            {/* like icon */}
            <div className="flex items-center gap-2">
              <FaHeart size={24} />
              <span>{nFormatter(likes)}</span>
            </div>
            {/* comment icon */}
            <div className="flex items-center gap-2">
              <FaComment size={24} />
              <span>{nFormatter(comments)}</span>
            </div>
            {/* share icon */}
            <div className="flex items-center gap-2">
              <FaShare size={24} />
              <span>{nFormatter(shares)}</span>
            </div>
          </div>
          <div className="rounded-md absolute overflow-hidden bg-createContent-modalOverLayClr left-0 top-0 right-0 h-0 group-hover:h-full transition-height duration-300 ease-linear">
            <div className="h-full w-full flex items-center">
              <ul className=" max-w-350 mx-auto">
                {actions.map((item, index) => (
                  <li
                    onClick={() =>
                      // @ts-ignore
                      handleAction(item.action, video, collectionId)
                    }
                    key={index}
                    className="p-2 m-2 flex items-center cursor-pointer font-medium text-black hover:text-red-500 transition-all duration-200 ease-linear gap-3"
                  >
                    {item.action === 'CHOOSE_VIDEO' && isChosen ? (
                      <FaCheckSquare
                        color="green"
                        className="w-6 h-6 text-gray-100"
                      />
                    ) : (
                      <item.icon
                        className="w-6 h-6 text-gray-100"
                        size={item.size}
                      />
                    )}
                    <a className="no-underline text-base font-medium text-gray-100 hover:text-white transition-all duration-200 ease-linear">
                      {item.action === 'CHOOSE_VIDEO' && isChosen
                        ? 'Bỏ chọn'
                        : item.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
      {isScheduled && (
        <span
          className="absolute bottom-3 right-1 text-red-500"
          title="Bài viết đã được lên lịch"
        >
          <FaExclamation />
        </span>
      )}
      {duration > 300 && (
        <span
          className="absolute top-2 right-7 text-red-500"
          title="Video dài hơn 5 phút"
        >
          <FiSlash />
        </span>
      )}
      {/* add Pencil on top right */}
      {isAuto && (
        <div
          className="absolute top-2 right-2 text-gray-500 cursor-pointer"
          onClick={() => handleEditContent(video)}
        >
          <FaPencilAlt />
        </div>
      )}
    </div>
  );
};

export default SingleVideo;
