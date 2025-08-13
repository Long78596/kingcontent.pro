import React, { useEffect, useState } from 'react';
import {
  FaCheckSquare,
  FaClock,
  FaComment,
  FaExclamation,
  FaEye,
  FaHeart,
  FaPencilAlt,
  FaRegSquare,
  FaTimesCircle,
} from 'react-icons/fa';
import { ImPlay } from 'react-icons/im';
import { useDispatch, useSelector } from 'react-redux';
import { nFormatter } from '../../configs';
import { checkInCollection, kFormatter } from '../../utils/utilityFunc';
import Images from './Images';
import Header from '../CategoriesContent/ContentDetailThreads/Header';
import { FaRegEdit } from 'react-icons/fa';
import { breakWord, convertInstagramLink } from '../../helpers';
import {
  FiMessageCircle,
  FiPlay,
  FiRefreshCcw,
  FiThumbsUp,
} from 'react-icons/fi';
import {
  setCurrentEditingContent,
  setIsShowFinalStep,
  setSelectedScheduleContent,
  setShowSourceIdeasPopup,
} from '../../store/actions/Schedules';
// @ts-ignore
import addIcons from '../../assets/images/icon/create-content/add.png';
import { formatUnixDate } from '../../helpers/date';

const defaultActions = [
  { icon: FaEye, title: 'Xem bài đăng', action: 'VIEW_DETAIL_CONTENT' },
  { icon: FaRegEdit, title: 'Soạn thảo', action: 'CREATE_CONTENT' },
  { icon: FaRegSquare, title: 'Chọn', action: 'CHOOSE_VIDEO' },
  { icon: FaClock, title: 'Lên lịch', action: 'SCHEDULE_CONTENT' },
];

const collectionActions = [
  { icon: ImPlay, title: 'Xem bài đăng', action: 'VIEW_DETAIL_CONTENT' },
  { icon: FaRegEdit, title: 'Soạn thảo', action: 'CREATE_CONTENT' },
  {
    icon: FaTimesCircle,
    title: 'Xoá khỏi BST',
    action: 'REMOVE_FROM_COLLECTION',
  },
  { icon: FaClock, title: 'Lên lịch', action: 'SCHEDULE_CONTENT' },
];

const SingleVideo = ({
  video,
  handleAction = (type = '', item = null, id = 0) => {},
  isChosen = false,
  isSchedule = false,
  isAuto = false,
  handleAddToWaitingList = (type = '', item = null) => {},
}) => {
  const {
    id = '',
    code = '',
    text = '',
    created = 0,
    likes = 0,
    comments = 0,
    reposts = 0,
    user_picture,
    media_type,
    images,
    user_name,
    videos,
  } = video;

  const [actions, setActions] = useState(defaultActions);
  const [collectionId, setCollectionId] = useState(0);
  const [isVideo, setIsVideo] = useState(false);
  const [thumbnail, setThumbnail] = useState('');
  const [isSelected, setIsSelected] = useState(false);
  const [displayPostText, setDisplayPostText] = useState(text);
  const [isScheduled, setIsScheduled] = useState(false);
  const dispatch = useDispatch();
  const {
    autoWaitingList,
    editingContents = [],
    scheduledContents = [],
  // @ts-ignore
  } = useSelector((state) => state.schedules);

  const { videoType = {}, collectionsVideos = [] } = useSelector(
    // @ts-ignore
    (state) => state.threads
  );

  useEffect(() => {
    if (scheduledContents && scheduledContents.length > 0) {
      const search = scheduledContents.find((elt) => {
        return elt?.content_id === code && elt?.source_type === 'threads';
      });
      if (search) {
        setIsScheduled(true);
      } else {
        setIsScheduled(false);
      }
    } else {
      setIsScheduled(false);
    }
  }, [code, scheduledContents]);

  useEffect(() => {
    if (autoWaitingList) {
      const { contents } = autoWaitingList;
      if (contents.length > 0) {
        const search = contents.find((elt) => elt.id === video.id);
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
      setActions(collectionActions);
      setCollectionId(0);
    } else {
      // check if video is in collection
      const collId = checkInCollection(collectionsVideos, id);
      if (collId) {
        setActions(collectionActions);
        setCollectionId(collId);
      } else {
        setActions(defaultActions);
      }
    }
  }, [videoType, collectionsVideos, id]);

  useEffect(() => {
    if (images && images.length > 0) {
      const thumb = images[0];
      setThumbnail(convertInstagramLink(thumb));
    }
  }, [images]);

  useEffect(() => {
    if (videos && videos.length > 0) {
      const thumb = videos[0]?.thumbnail || videos[0]?.thumbail;
      setThumbnail(convertInstagramLink(thumb));
      setIsVideo(true);
    } else {
      setIsVideo(false);
    }
  }, [videos]);

  const handleAddToSchedule = (elt) => {
    dispatch(
      setSelectedScheduleContent({
        ...elt,
        source_type: 'threads',
        feed_name: user_name,
        post_text: text,
      })
    );
    dispatch(setIsShowFinalStep(true));
    dispatch(setShowSourceIdeasPopup(false));
  };

  const handleEditContent = (item) => {
    const editingContent = {
      id: item?.id,
      text: displayPostText,
      source_type: 'threads',
    };
    dispatch(setCurrentEditingContent(editingContent));
  };

  useEffect(() => {
    if (editingContents && editingContents.length > 0 && isAuto) {
      const search = editingContents.find((elt) => elt?.id === id);
      if (search) {
        setDisplayPostText(search?.text);
      }
    }
  }, [editingContents, id, isAuto]);

  return (
    <div className="singleThread">
      {isSchedule ? (
        <div className="relative flex gap-2 border border-gray-200 rounded-md cursor-pointer mb-2 p-2">
          {isAuto && (
            <div
              className="w-1/12 flex items-center text-center justify-center"
              onClick={() => handleAddToWaitingList('threads', video)}
            >
              {isSelected ? (
                <FaCheckSquare className="w-6 text-green-500 text-base" />
              ) : (
                <FaRegSquare className="w-6 text-gray-500 text-base" />
              )}
            </div>
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

          {thumbnail && (
            <div
              className="thumbnail w-1/3 relative h-40 rounded-md overflow-hidden"
              onClick={() => handleAction('VIEW_DETAIL_CONTENT', video)}
            >
              <img src={thumbnail} className="w-full h-full object-cover" />
              {images && images.length > 1 && (
                <div className="absolute inset-0 w-12 h-12 rounded-full bg-opacity-50 bg-black m-auto">
                  <span className="h-full flex items-center justify-center text-xl text-white font-semibold">
                    + {images.length - 1}
                  </span>
                </div>
              )}
              {isVideo && (
                <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center z-10">
                  <div className="w-20 h-20 opacity-80">
                    <FiPlay className="w-full h-full text-white" />
                  </div>
                </div>
              )}
            </div>
          )}
          <div
            className={`info p-2 ${thumbnail ? 'w-2/3' : 'w-full'}`}
            onClick={() => handleAction('VIEW_DETAIL_CONTENT', video)}
          >
            <div className="flex items-center gap-2 mb-2">
              <div
                className="bg-no-repeat bg-cover w-10 h-10 rounded-full"
                style={{
                  backgroundImage: `url(${convertInstagramLink(user_picture)})`,
                }}
              ></div>
              <span className="font-bold">{user_name || ''}</span>
            </div>
            <div className="desc">
              <p className="text-sm font-medium text-gray-700 line-clamp-3">
                {isAuto ? displayPostText : text}
              </p>
            </div>
            <div className="created">
              <span className="text-xs text-gray-500">
                Ngày tạo: {formatUnixDate(created)}
              </span>
            </div>
            <div className="flex items-center gap-4 mt-3 justify-between px-3">
              <div className="flex items-center gap-1 likes">
                <FiThumbsUp className="w-6 h-6" />
                <span>{kFormatter(likes)}</span>
              </div>
              <div className="flex items-center gap-1 comments">
                <FiMessageCircle className="w-6 h-6" />
                <span>{kFormatter(comments)}</span>
              </div>
              <div className="flex items-center gap-1 reposts">
                <FiRefreshCcw className="w-6 h-6" />
                <span>{kFormatter(reposts)}</span>
              </div>
            </div>
          </div>
          {!isAuto && (
            <div
              className="w-1/6 ml-auto flex items-center justify-center"
              onClick={() => handleAddToSchedule(video)}
            >
              <img src={addIcons} className="w-8" />
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
        </div>
      ) : (
        <div className="flex flex-col gap-2 p-3 mb-2 group relative border-2 border-gray-200 rounded-lg shadow-md">
          <Header
            fanpageName={user_name}
            page_avatar={user_picture}
            created={created}
          />
          {media_type === 'no_media' || !media_type ? (
            <p
              className=" text-sm overflow-auto max-h-98"
              dangerouslySetInnerHTML={{
                __html: breakWord(text),
              }}
              style={{ minHeight: '100px' }}
            ></p>
          ) : (
            <div className="description overflow-ellipsis whitespace-nowrap overflow-hidden mt-1">
              {text}
            </div>
          )}

          <Images medias={images} contentType={media_type} videos={videos} />
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
              <FiRefreshCcw size={24} />
              <span>{nFormatter(reposts)}</span>
            </div>
          </div>
          <div className="rounded-md absolute overflow-hidden bg-createContent-modalOverLayClr left-0 top-0 right-0 h-0 group-hover:h-full transition-height duration-300 ease-linear">
            <div className="h-full w-full flex items-center">
              <ul className=" max-w-350 mx-auto">
                {actions.map((item, index) => (
                  <li
                    onClick={() =>
                      handleAction(item.action, video, collectionId)
                    }
                    key={index}
                    className="p-2 m-2 flex items-center cursor-pointer font-medium text-black hover:text-red-500 transition-all duration-200 ease-linear gap-3"
                  >
                    {item.action === 'CHOOSE_VIDEO' && isChosen ? (
                      <FaCheckSquare
                        color="green"
                        className="w-6 h-6 text-gray-100 bg-white"
                      />
                    ) : (
                      <item.icon className="w-6 h-6 text-gray-100" />
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
    </div>
  );
};

export default SingleVideo;
