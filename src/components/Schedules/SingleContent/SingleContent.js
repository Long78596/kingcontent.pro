import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import addIcons from '../../../assets/images/icon/create-content/add.png';
import CommentIcon from '../../../assets/images/icon/comment.png';
import LikeIcon from '../../../assets/images/icon/like.png';
import ShareIcon from '../../../assets/images/icon/share.png';
import defaultThumbUrl from '../../../assets/images/anh-cute-nhat.jpg';
import styled from 'styled-components';
import { kFormatter } from '../../../utils/utilityFunc';
import {
  FaCheckSquare,
  FaExclamation,
  FaPencilAlt,
  FaRegSquare,
} from 'react-icons/fa';
import { FiPlayCircle } from 'react-icons/fi';
import ReactPlayer from 'react-player';
import { setCurrentEditingContent } from '../../../store/actions/Schedules';
import moment from 'moment';

const ContentStyled = styled.div`
  max-height: 100px;
`;

const SingleContent = (props) => {
  const {
    item = [],
    handleActionShowPopup,
    handleAddToSchedule,
    cat_id = 0,
    isAuto = false,
    handleAddToWaitingList,
    content_type = 'system',
    isShowEditContentBtn = false,
    hashtag = '',
  } = props;

  const {
    autoWaitingList,
    scheduledContents,
    editingContents = [],
  } = useSelector((state) => state.schedules);

  const [thumbnail, setThumbnail] = useState(defaultThumbUrl);
  const [displayPostText, setDisplayPostText] = useState('');
  const [isSelected, setIsSelected] = useState(false);
  const [isScheduled, setIsScheduled] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (item?.post_text) {
      setDisplayPostText(item?.post_text);
    }
  }, [item]);

  useEffect(() => {
    if (autoWaitingList) {
      const { contents = [] } = autoWaitingList;
      if (contents.length > 0) {
        const search = contents.find(
          (elt) => elt && elt?.post_id === item?.post_id
        );
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
  }, [item, autoWaitingList]);

  useEffect(() => {
    if (scheduledContents && scheduledContents.length > 0) {
      const search = scheduledContents.find((elt) => {
        if (content_type === 'user')
          return parseInt(elt?.content_id) === parseInt(item?.id);
        else return elt?.content_id === item?.post_id;
      });
      if (search) {
        setIsScheduled(true);
      } else {
        setIsScheduled(false);
      }
    } else {
      setIsScheduled(false);
    }
  }, [item, scheduledContents, content_type]);

  useEffect(() => {
    if (item) {
      const { medias = [], image_url } = item;
      if (medias && medias.length > 0) {
        setThumbnail(medias[0] || '');
      }
      if (isShowEditContentBtn) {
        setThumbnail(image_url);
      }
    } else {
      setThumbnail(defaultThumbUrl);
    }
  }, [item]);

  const handleEditContent = (item) => {
    const { id = 0, post_id = '', event_id = 0, source_type = '' } = item;
    const editingContent = {
      id: event_id > 0 ? id : post_id,
      text: displayPostText,
      source_type: event_id > 0 ? 'event' : source_type || 'system',
    };
    dispatch(setCurrentEditingContent(editingContent));
  };

  useEffect(() => {
    if (editingContents && editingContents.length > 0) {
      const search = editingContents.find(
        (elt) => elt?.id === (item?.event_id > 0 ? item?.id : item?.post_id)
      );
      if (search) {
        setDisplayPostText(search?.text);
      }
    }
  }, [editingContents]);

  return (
    <div
      className={`relative mb-2 flex gap-2 hover:bg-gray-200 rounded-md transition-all cursor-pointer border p-2 items-center`}
    >
      {isAuto && (
        <div
          className="w-1/12 flex items-center text-center justify-center"
          onClick={() => handleAddToWaitingList(content_type, item, cat_id)}
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
          onClick={() => handleEditContent(item)}
        >
          <FaPencilAlt />
        </div>
      )}

      {item?.media_type === 'video' && content_type === 'user' ? (
        <div className="w-3/12 rounded-md overflow-hidden h-40 relative">
          <ReactPlayer
            className="react-player w-full h-full object-cover"
            height={'100'}
            url={item?.media_url || ''}
            playing={false}
            width={'100'}
          />
          <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center z-2">
            <div className="w-10 h-10 bg-gray-400 rounded-full opacity-50">
              <FiPlayCircle className="w-full h-full text-white" />
            </div>
          </div>
        </div>
      ) : (
        <div
          className="w-3/12 flex h-40 relative bg-no-repeat bg-cover bg-center rounded-lg"
          onClick={() => handleActionShowPopup(item)}
          style={{ backgroundImage: `url(${thumbnail})` }}
        >
          {item?.media_type === 'video' && (
            <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center z-2">
              <div className="w-10 h-10 bg-gray-400 rounded-full opacity-50">
                <FiPlayCircle className="w-full h-full text-white" />
              </div>
            </div>
          )}
        </div>
      )}

      <div className="w-8/12" onClick={() => handleActionShowPopup(item)}>
        <h3 className="font-bold">{item?.user_screenname}</h3>
        {content_type === 'special' && (
          <span className="m-1 py-1 text-xs text-gray-700 font-medium">
            {moment.unix(item?.post_timestamp).format('DD/MM/YYYY')}
          </span>
        )}
        <ContentStyled className="overflow-hidden">
          <p
            className="line-clamp"
            dangerouslySetInnerHTML={{ __html: displayPostText }}
          ></p>
        </ContentStyled>
        {content_type !== 'user' ? (
          <div className="flex gap-5 p-3 items-center mt-2 rounded-md">
            <div className="gap-2 flex items-center">
              <img src={LikeIcon} alt="" className="w-4" />
              <span>{kFormatter(item?.likes)}</span>
            </div>
            <div className="gap-2 flex items-center">
              <img src={CommentIcon} alt="" className="w-4" />
              <span>{kFormatter(item?.comments)}</span>
            </div>
            <div className="gap-2 flex items-center">
              <img src={ShareIcon} alt="" className="w-4" />
              <span>{kFormatter(item?.shares)}</span>
            </div>
          </div>
        ) : (
          <div className="flex gap-2 items-center mt-3 italic text-xs">
            {item?.note}
          </div>
        )}

        {/* show hash tag when content_type is liked */}
        {content_type === 'liked' && hashtag && (
          <div className="flex p-3 items-center mt-2 italic text-xs">
            {hashtag.indexOf('#') === -1 && (
              <span className="font-bold text-gray-500">#</span>
            )}
            <span>{hashtag}</span>
          </div>
        )}
      </div>
      {!isAuto && (
        <>
          <div
            className="w-1/12 flex items-center justify-center"
            onClick={() => handleAddToSchedule(item, cat_id)}
          >
            <img src={addIcons} className="w-8" />
          </div>
        </>
      )}
      {isScheduled && (
        <span
          className="absolute bottom-1 right-1 text-red-500"
          title="Bài viết đã được lên lịch"
        >
          <FaExclamation />
        </span>
      )}
    </div>
  );
};

export default SingleContent;
