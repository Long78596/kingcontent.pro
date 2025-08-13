import React, { useEffect, useState } from 'react';
import { BiTag } from 'react-icons/bi';
import { FaBook, FaRegEdit, FaRegListAlt } from 'react-icons/fa';
import { ImEye } from 'react-icons/im';
import { MdAccessTime } from 'react-icons/md';
import { TiMinusOutline } from 'react-icons/ti';
import { useSelector } from 'react-redux';
import VideoGenIcon from '../../../assets/images/icon/main-menu/menu-icon-videogen.png';


const renderVideoGenIcon = () => {
  return (
    <div className="w-10 h-10 bg-white rounded-md flex items-center justify-center border border-black transition-all duration-200 hover:border-orange-500">
      <img
        src={VideoGenIcon}
        alt="VideoGen Icon"
        className="w-8 h-8 text-gray-700 transition-all duration-200 group-hover:text-orange-500"
      />
    </div>
  );
}
const DefaultModalOverlayList = [
  { icon: ImEye, title: 'Xem chi tiết', action: 'VIEW_DETAIL_CONTENT' },
  { icon: FaBook, title: 'Thích', action: 'SAVE_LIKED_CONTENT' },
  { icon: MdAccessTime, title: 'Lên lịch', action: 'SCHEDULE_CONTENT' },
  { icon: FaRegEdit, title: 'Soạn thảo', action: 'CREATE_CONTENT' },
  { icon: renderVideoGenIcon, title: 'Tạo Video AI', action: 'SET_SCRIPT_VIDEO_AI' },
];

const ModalOverlayList = [
  { icon: ImEye, title: 'Xem chi tiết', action: 'VIEW_DETAIL_CONTENT' },
  {
    icon: FaRegListAlt,
    title: 'Xem thêm bài viết',
    action: 'VIEW_MORE_CONTENT',
  },
  { icon: FaBook, title: 'Thích', action: 'SAVE_LIKED_CONTENT' },
  { icon: MdAccessTime, title: 'Lên lịch', action: 'SCHEDULE_CONTENT' },
  { icon: FaRegEdit, title: 'Soạn thảo', action: 'CREATE_CONTENT' },
  { icon: renderVideoGenIcon, title: 'Tạo Video AI', action: 'SET_SCRIPT_VIDEO_AI' },
];

const ModalOverlayList_2 = [
  { icon: ImEye, title: 'Xem chi tiết', action: 'VIEW_DETAIL_CONTENT' },
  { icon: FaRegEdit, title: 'Soạn thảo', action: 'CREATE_CONTENT' },
  { icon: MdAccessTime, title: 'Lên lịch', action: 'SCHEDULE_CONTENT' },
  { icon: TiMinusOutline, title: 'Bỏ thích', action: 'DISLIKE' },
  { icon: BiTag, title: 'Thay đổi hashtag', action: 'EDIT_TAG' },
  { icon: renderVideoGenIcon, title: 'Tạo Video AI', action: 'SET_SCRIPT_VIDEO_AI' },
];

const ModalOverlayList_3 = [
  { icon: ImEye, title: 'Xem chi tiết', action: 'VIEW_DETAIL_CONTENT' },
  { icon: FaRegEdit, title: 'Soạn thảo', action: 'CREATE_CONTENT' },
  { icon: MdAccessTime, title: 'Lên lịch', action: 'SCHEDULE_CONTENT' },
  { icon: renderVideoGenIcon, title: 'Tạo Video AI', action: 'SET_SCRIPT_VIDEO_AI' },
];
const ModalOverlayList_4 = [
  { icon: ImEye, title: 'Xem chi tiết', action: 'VIEW_DETAIL_CONTENT' },
  { icon: FaRegEdit, title: 'Soạn thảo', action: 'CREATE_CONTENT' },
  { icon: renderVideoGenIcon, title: 'Tạo Video AI', action: 'SET_SCRIPT_VIDEO_AI' },
];
const ModalOverlayList_5 = [
  { icon: ImEye, title: 'Xem chi tiết', action: 'VIEW_DETAIL_CONTENT' },
  { icon: FaRegEdit, title: 'Soạn thảo', action: 'CREATE_CONTENT' },
  { icon: MdAccessTime, title: 'Lên lịch', action: 'SCHEDULE_CONTENT' },
  { icon: renderVideoGenIcon, title: 'Tạo Video AI', action: 'SET_SCRIPT_VIDEO_AI' },
];

const removeLiked = {
  icon: TiMinusOutline,
  title: 'Bỏ thích',
  action: 'REMOVE_LIKED_CONTENT',
};

const ModalOverlay = (props) => {
  const { handleAction, page = '', post_id } = props;
  const { likedContents = [] } = useSelector((state) => state.userReducer);
  const [isLiked, setIsLiked] = useState(false);
  const [overlayList, setOverlayList] = useState([]);

  useEffect(() => {
    if (likedContents && likedContents.length > 0) {
      let isExist = false;
      likedContents.map((item, idx) => {
        const { type_id = '' } = item;
        if (type_id === post_id) isExist = true;
      });
      setIsLiked(isExist);
    } else {
      setIsLiked(false);
    }
  }, [likedContents, post_id]);

  useEffect(() => {
    if (page) {
      switch (page) {
        case 'contentLikedPage':
          setOverlayList(ModalOverlayList_2);
          break;
        case 'specialFollowPage':
          setOverlayList(ModalOverlayList_3);
          break;
        case 'trenddingPage':
          setOverlayList(ModalOverlayList_4);
        case 'ads':
          setOverlayList(ModalOverlayList_5);
          break;
        case 'categoryPage':
          const newList = ModalOverlayList.reduce((acc, item, idx) => {
            const { action } = item;
            if (action === 'SAVE_LIKED_CONTENT' && isLiked) {
              acc.push(removeLiked);
            } else {
              acc.push(item);
            }
            return acc;
          }, []);
          setOverlayList(newList);
          break;
        default:
          setOverlayList(DefaultModalOverlayList);
          break;
      }
    }
  }, [page, isLiked]);
  return (
    <div className="rounded-t-md absolute overflow-hidden bg-createContent-modalOverLayClr left-0 top-0 right-0 h-0 group-hover:h-full transition-height duration-300 ease-linear z-20">
      <div className="h-full w-full flex items-center">
        <ul className=" max-w-350 mx-auto">
          {overlayList.map((item, index) => (
            <li
              onClick={() => handleAction(item.action)}
              key={index}
              className="p-2 m-2 flex items-center cursor-pointer font-medium text-black hover:text-red-500 transition-all duration-200 ease-linear"
            >
              <item.icon className="w-10 h-10 px-2 py-1 bg-gray-50 border border-black rounded-md " />
              <a className="ml-4 no-underline text-base font-medium text-gray-50 hover:text-red-600 transition-all duration-200 ease-linear">
                {item.title}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default React.memo(ModalOverlay);
