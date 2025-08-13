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
} from 'react-icons/fa';
import {
  checkInCollection,
  fancyTimeFormat,
} from '../../utils/utilityFunc';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { ImPlay, ImVideoCamera } from 'react-icons/im';
import { nFormatter } from '../../configs';
import auth from '../../utils/auth';
import VideoGenIcon from '../../assets/images/icon/main-menu/menu-icon-videogen.png';


const renderVideoGenIcon = () => {
  return (
    <img
        src={VideoGenIcon}
        alt="VideoGen Icon"
        className="bg-white rounded-md w-6 h-6 text-gray-700 transition-all duration-200 group-hover:text-orange-500"
      />
  );
}
const defaultActions = [
  { icon: ImPlay, title: 'Xem video', action: 'VIEW_DETAIL_CONTENT' },
  /*{
    icon: FaHeart,
    title: 'Thêm vào BST',
    action: 'ADD_TO_COLLECTION',
  },*/
  { icon: FaRegSquare, title: 'Chọn', action: 'CHOOSE_VIDEO' },
  { icon: FaClock, title: 'Lên lịch', action: 'SCHEDULE_CONTENT' },
  { icon: renderVideoGenIcon, title: 'Tạo Video AI', action: 'SET_SCRIPT_VIDEO_AI' },
];

const actionsForEditor = [
  { icon: ImVideoCamera, title: 'Sửa video', action: 'EDIT_VIDEO' },
];

const collectionActions = [
  { icon: ImPlay, title: 'Xem video', action: 'VIEW_DETAIL_CONTENT' },
  {
    icon: FaTimesCircle,
    title: 'Xoá khỏi BST',
    action: 'REMOVE_FROM_COLLECTION',
  },
  { icon: FaClock, title: 'Lên lịch', action: 'SCHEDULE_CONTENT' },
  { icon: renderVideoGenIcon, title: 'Tạo Video AI', action: 'SET_SCRIPT_VIDEO_AI' },
];

const SingleVideo = ({ video, handleAction = () => {}, isChosen = false }) => {
  const {
    post_id = '',
    text = '',
    thumbnail = '',
    duration = 0,
    view = 0,
    react = 0,
    comment = 0,
    share = 0,
  } = video;

  const [actions, setActions] = useState(defaultActions);
  const [collectionId, setCollectionId] = useState(0);

  const { videoType = {}, collectionsVideos = [] } = useSelector(
    // @ts-ignore
    (state) => state.tiktoks
  );

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
      const collId = checkInCollection(collectionsVideos, post_id);
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
  }, [videoType, collectionsVideos, post_id, auth]);

  return (
    <div className="flex flex-col gap-2 p-3 mb-2 group relative">
      <div
        className="relative w-full h-96 overflow-hidden bg-cover bg-center rounded-lg"
        style={{ backgroundImage: `url(${thumbnail})` }}
      >
        {/* play count and duration */}
        <div className="absolute bottom-0 right-0 p-2 bg-black bg-opacity-50 rounded-bl-lg flex flex-nowrap justify-between w-full items-center">
          <span className="text-white gap-2 flex items-center">
            <FaPlay size={16} /> {nFormatter(view)}
          </span>
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
          <span>{nFormatter(react)}</span>
        </div>
        {/* comment icon */}
        <div className="flex items-center gap-2">
          <FaComment size={24} />
          <span>{nFormatter(comment)}</span>
        </div>
        {/* share icon */}
        <div className="flex items-center gap-2">
          <FaShare size={24} />
          <span>{nFormatter(share)}</span>
        </div>
      </div>
      <div className="rounded-md absolute overflow-hidden bg-createContent-modalOverLayClr left-0 top-0 right-0 h-0 group-hover:h-full transition-height duration-300 ease-linear">
        <div className="h-full w-full flex items-center">
          <ul className=" max-w-350 mx-auto">
            {actions.map((item, index) => (
              <li
                // @ts-ignore
                onClick={() => handleAction(item.action, video, collectionId)}
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
  );
};

export default SingleVideo;
