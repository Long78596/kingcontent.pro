import React, { useState, useEffect } from 'react';
// @ts-ignore
import InstagramIcon from '../../../../assets/images/icon/main-menu/menu-icon-instagram.png';
// @ts-ignore
import addIcons from '../../../../assets/images/icon/create-content/add.png';
import { useDispatch, useSelector } from 'react-redux';
import { convertInstagramLink } from '../../../../helpers';
import {
  checkInInstagramCollection,
  kFormatter,
} from '../../../../utils/utilityFunc';
import { FiMessageCircle, FiThumbsUp, FiPlay } from 'react-icons/fi';
import {
  actionGetCollectionPosts,
  actionGetCollections,
  actionRemovePostsFromCollection,
  actionSetCurrentContent,
  actionUpdateChosenPosts,
} from '../../../../store/actions/instagram';
import { toast } from 'react-toastify';
import { instagramService } from '../../../../services/instagram';
import { ImEye } from 'react-icons/im';
import {
  FaCheckSquare,
  FaClock,
  FaExclamation,
  FaPencilAlt,
  FaRegEdit,
  FaRegSquare,
  FaTimesCircle,
} from 'react-icons/fa';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import {
  setIsShowFinalStep,
  setSelectedScheduleContent,
  setShowSourceIdeasPopup,
  setCurrentDateTime,
} from '../../../../store/actions/Schedules';
import { confirmAlert } from 'react-confirm-alert';
import {
  actionUpdateStep1,
  createContentToHomepage,
  resetCreateContent,
} from '../../../../store/actions/createContent';
import { actionPushContentToCreateContentScreen } from '../../../../store/actions/homepage';
import { OK } from '../../../../configs';

const defaultActions = [
  { icon: ImEye, title: 'Xem chi tiết', action: 'VIEW_DETAIL_CONTENT' },
  { icon: FaRegEdit, title: 'Soạn thảo', action: 'CREATE_CONTENT' },
  { icon: FaRegSquare, title: 'Chọn', action: 'CHOOSE_POST' },
  { icon: FaClock, title: 'Lên lịch', action: 'SCHEDULE_CONTENT' },
];

const collectionActions = [
  { icon: ImEye, title: 'Xem chi tiết', action: 'VIEW_DETAIL_CONTENT' },
  { icon: FaRegEdit, title: 'Soạn thảo', action: 'CREATE_CONTENT' },
  {
    icon: FaTimesCircle,
    title: 'Xoá khỏi BST',
    action: 'REMOVE_FROM_COLLECTION',
  },
  { icon: FaClock, title: 'Lên lịch', action: 'SCHEDULE_CONTENT' },
];

const scheduleActions = [
  { icon: ImEye, title: 'Xem chi tiết', action: 'VIEW_DETAIL_CONTENT' },
  { icon: FaClock, title: 'Lên lịch', action: 'SCHEDULING' },
];

const scheduleAutoActions = [
  { icon: ImEye, title: 'Xem chi tiết', action: 'VIEW_DETAIL_CONTENT' },
  { icon: FaRegSquare, title: 'Chọn', action: 'SCHEDULE_CHOOSE_POST' },
];

const SingleReel = (props) => {
  const {
    reel = null,
    isSchedule = false,
    isAuto = false,
    handleAddToWaitingList = () => {},
  } = props;

  const {
    id = '',
    code = '',
    likes = 0,
    comments = 0,
    user_display_name = '',
    thumbnail: thumb = '',
    text = '',
    images = [],
    videos = [],
    is_reels = false,
    media_type = 'image',
  } = reel;

  const [thumbnail, setThumbnail] = useState(InstagramIcon);
  const [actions, setActions] = useState(defaultActions);
  const [isChosen, setIsChosen] = useState(false);
  const [collectionId, setCollectionId] = useState(0);
  const dispatch = useDispatch();
  const history = useHistory();
  const [isSelected, setIsSelected] = useState(false);
  const [displayPostText, setDisplayPostText] = useState(text || '');
  const [isScheduled, setIsScheduled] = useState(false);

  const {
    currentCollection = null,
    collectionPosts = null,
    chosenPosts = [],
  } = useSelector((state) => state.instagram);
  const {
    autoWaitingList,
    editingContents = [],
    scheduledContents,
  } = useSelector((state) => state.schedules);

  useEffect(() => {
    if (autoWaitingList) {
      const { contents } = autoWaitingList;
      if (contents.length > 0) {
        const search = contents.find((elt) => elt.post_id === reel.post_id);
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
  }, [reel, autoWaitingList]);

  useEffect(() => {
    if (isSchedule) {
      if (isAuto) {
        setActions(scheduleAutoActions);
      } else {
        setActions(scheduleActions);
      }
    } else if (currentCollection) {
      setActions(collectionActions);
      setCollectionId(0);
    } else {
      // check if video is in collection
      const collId = checkInInstagramCollection(collectionPosts, id);
      if (collId) {
        setActions(collectionActions);
        setCollectionId(collId);
      } else {
        setActions(defaultActions);
      }
    }
  }, [currentCollection, collectionPosts, id, isSchedule, isAuto]);

  useEffect(() => {
    if (media_type === 'image') {
      const firstImage = images[0];
      setThumbnail(convertInstagramLink(firstImage));
    } else {
      const thumb = videos[0]?.thumbnail;
      setThumbnail(convertInstagramLink(thumb));
    }
  }, [media_type, thumb, images, videos]);

  useEffect(() => {
    const index = chosenPosts.findIndex((item) => item.id === id);
    if (index > -1) {
      setIsChosen(true);
    } else {
      setIsChosen(false);
    }
  }, [chosenPosts, id]);

  useEffect(() => {
    if (scheduledContents && scheduledContents.length > 0) {
      const search = scheduledContents.find((elt) => {
        return elt?.content_id === reel?.id && elt?.source_type === 'instagram';
      });
      if (search) {
        setIsScheduled(true);
      } else {
        setIsScheduled(false);
      }
    } else {
      setIsScheduled(false);
    }
  }, [reel, scheduledContents]);

  const handleAction = async (action, collId = 0) => {
    switch (action) {
      case 'VIEW_DETAIL_CONTENT':
        toast.info('Đang lấy thông tin bài viết, vui lòng chờ trong giây lát');
        const res = await instagramService.getReelDetail(id, code);
        const { status = 0, data } = res;
        if (status === OK) {
          dispatch(actionSetCurrentContent(data?.data));
        } else {
          toast.error(
            data?.message ||
              'Vui lòng liên hệ nhân viên để được hỗ trợ tốt hơn!'
          );
        }
        toast.dismiss();
        break;

      case 'CREATE_CONTENT':
        confirmAlert({
          title: 'Thông báo',
          message: 'Vui lòng chọn một hình thức soạn thảo bài viết:',
          buttons: [
            {
              label: 'Chỉ lấy văn bản',
              onClick: async () => {
                dispatch(actionUpdateStep1(true));
                dispatch(resetCreateContent());
                dispatch(
                  actionPushContentToCreateContentScreen(
                    text,
                    images.map((img) => convertInstagramLink(img)),
                    'text',
                    is_reels
                  )
                );
                history.push('/tao-content');
              },
            },
            {
              label: 'Lấy văn bản & video',
              onClick: async () => {
                const videoUrl = videos[0].source || '';
                const medias = [
                  {
                    type: 'video',
                    url: videoUrl,
                  },
                ];
                dispatch(actionUpdateStep1(true));
                dispatch(resetCreateContent());
                dispatch(createContentToHomepage({ status: true }));
                dispatch(
                  actionPushContentToCreateContentScreen(
                    text,
                    medias,
                    'video',
                    is_reels
                  )
                );
                history.push('/tao-content');
              },
            },
            {
              label: 'Huỷ',
              onClick: () => {},
            },
          ],
          overlayClassName: 'large-confirmation',
        });
        break;

      case 'CHOOSE_POST':
        if (isChosen) {
          const index = chosenPosts.findIndex((item) => item.id === id);
          if (index > -1) {
            const newChosenPosts = [...chosenPosts];
            newChosenPosts.splice(index, 1);
            dispatch(actionUpdateChosenPosts(newChosenPosts));
          }
        } else {
          dispatch(actionUpdateChosenPosts([...chosenPosts, reel]));
        }
        break;

      case 'SCHEDULE_CHOOSE_POST':
        handleAddToWaitingList('instagram', reel);
        break;

      case 'REMOVE_FROM_COLLECTION':
        const collectionId = collId ? collId : currentCollection.id;
        confirmAlert({
          title: 'Thông báo',
          message: 'Bạn có chắc chắn muốn xoá video này khỏi BST không?',
          buttons: [
            {
              label: 'Chắc chắn',
              onClick: async () => {
                dispatch(actionRemovePostsFromCollection(collectionId, id));
                dispatch(actionGetCollections());
                dispatch(actionGetCollectionPosts());
              },
            },
            {
              label: 'Đổi ý',
              onClick: () => {},
            },
          ],
        });
        break;

      case 'SCHEDULE_CONTENT':
        dispatch(
          setSelectedScheduleContent({
            ...reel,
            source_type: 'instagram',
            media_type: 'video',
            is_reels: true,
            feed_name: user_display_name,
            post_id: id,
          })
        );
        dispatch(setCurrentDateTime());
        dispatch(setIsShowFinalStep(true));
        dispatch(setShowSourceIdeasPopup(false));
        history.push('/lich-dang-bai');
        break;

      case 'SCHEDULING':
        dispatch(
          setSelectedScheduleContent({
            ...reel,
            source_type: 'instagram',
            media_type: 'video',
            is_reels: true,
            feed_name: user_display_name,
            post_id: id,
          })
        );
        dispatch(setIsShowFinalStep(true));
        dispatch(setShowSourceIdeasPopup(false));
        break;

      default:
        break;
    }
  };

  const handleAddToSchedule = (elt) => {
    dispatch(
      setSelectedScheduleContent({
        ...reel,
        source_type: 'instagram',
        media_type: 'video',
        is_reels: true,
        feed_name: user_display_name,
        content_id: id,
      })
    );
    dispatch(setIsShowFinalStep(true));
    dispatch(setShowSourceIdeasPopup(false));
  };

  const handleOnClickContent = async () => {
    toast.info('Đang lấy thông tin bài viết, vui lòng chờ trong giây lát');
    const res = await instagramService.getReelDetail(id, code);
    const { status = 0, data } = res;
    if (status === OK) {
      dispatch(actionSetCurrentContent(data?.data));
    } else {
      toast.error(
        data?.message || 'Vui lòng liên hệ nhân viên để được hỗ trợ tốt hơn!'
      );
    }
    toast.dismiss();
  };

  useEffect(() => {
    if (editingContents && editingContents.length > 0 && isAuto) {
      const search = editingContents.find(
        (elt) => elt.id === code && elt.source_type === 'instagram'
      );
      if (search) {
        setDisplayPostText(search.text);
      }
    }
  }, [editingContents, code, isAuto]);

  const handleEditContent = (item) => {
    const editingContent = {
      id: item.code,
      text: displayPostText,
      source_type: 'instagram',
    };
    // dispatch(setCurrentEditingContent(editingContent));
  };

  return (
    <div key={id} className="singleReel relative">
      <div className="border border-gray-200 rounded-md cursor-pointer relative h-80 group">
        <img
          src={thumbnail}
          alt="thumbnail"
          className="w-full h-full object-cover rounded-md"
        />
        <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center z-10">
          <div className="w-20 h-20 opacity-80">
            <FiPlay className="w-full h-full text-white" />
          </div>
        </div>
        <div className="info absolute bottom-0 left-0 right-0 bg-gray-800 bg-opacity-50 text-white p-2 z-10">
          <div className="flex items-center justify-center gap-5">
            <div className="flex items-center gap-1 likes">
              <FiThumbsUp className="w-7 h-7" />
              <span>{kFormatter(likes)}</span>
            </div>
            <div className="flex items-center gap-1 comments">
              <FiMessageCircle className="w-7 h-7" />
              <span>{kFormatter(comments)}</span>
            </div>
          </div>
        </div>
        <div className="rounded-md absolute overflow-hidden bg-createContent-modalOverLayClr left-0 top-0 right-0 h-0 group-hover:h-full transition-height duration-300 ease-linear z-20">
          <div className="h-full w-full flex items-center">
            <ul className=" max-w-350 mx-auto">
              {actions.map((item, index) => (
                <li
                  onClick={() => handleAction(item.action, collectionId)}
                  key={index}
                  className={`p-2 m-2 flex items-center cursor-pointer font-medium text-black hover:text-red-500 transition-all duration-200 ease-linear gap-3 hover:bg-black rounded-md ${item.action}`}
                >
                  {(item.action === 'CHOOSE_POST' && isChosen) ||
                  (item.action === 'SCHEDULE_CHOOSE_POST' && isSelected) ? (
                    <FaCheckSquare
                      color="green"
                      className="w-6 h-6 text-gray-100"
                    />
                  ) : (
                    <item.icon className="w-6 h-6 text-gray-100" />
                  )}
                  <a className="no-underline text-base font-medium text-gray-100 hover:text-white transition-all duration-200 ease-linear whitespace-nowrap">
                    {item.action === 'CHOOSE_POST' && isChosen
                      ? 'Bỏ chọn'
                      : item.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* add Pencil on top right */}
      {isAuto && (
        <div
          className="absolute top-2 right-2 text-gray-500 cursor-pointer"
          onClick={() => handleEditContent(reel)}
        >
          <FaPencilAlt />
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
  );
};

export default SingleReel;
