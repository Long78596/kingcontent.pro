import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import addIcons from '../../../assets/images/icon/create-content/add.png';
import styled from 'styled-components';
import {
  FaCheckSquare,
  FaExclamation,
  FaPencilAlt,
  FaRegSquare,
} from 'react-icons/fa';
import { FiClock, FiPlay } from 'react-icons/fi';
import { nFormatter } from '../../../configs';
import moment from 'moment';
import { FiHeart } from 'react-icons/fi';
import { FiShare } from 'react-icons/fi';
import { FiUser } from 'react-icons/fi';
import { setCurrentEditingContent } from '../../../store/actions/Schedules';
const ContentStyled = styled.div`
  max-height: 100px;
`;

const SingleTiktokContent = (props) => {
  const {
    item = null,
    handleActionShowPopup,
    handleAddToSchedule,
    handleAddToWaitingList,
    isAuto = false,
  } = props;

  const {
    autoWaitingList,
    scheduledContents,
    editingContents = [],
  } = useSelector((state) => state.schedules);
  const [isScheduled, setIsScheduled] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const [displayPostText, setDisplayPostText] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {
    if (item) {
      setDisplayPostText(item?.text || '');
    }
  }, [item]);

  useEffect(() => {
    if (autoWaitingList) {
      const { contents } = autoWaitingList;
      if (contents.length > 0) {
        const search = contents.find((elt) => elt.post_id === item.post_id);
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
        return (
          elt?.content_id === item?.post_id && elt?.source_type === 'tiktok'
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
  }, [item, scheduledContents]);

  useEffect(() => {
    if (editingContents && editingContents.length > 0) {
      const search = editingContents.find(
        (elt) => elt.id === item.post_id && elt.source_type === 'tiktok'
      );
      if (search) {
        setDisplayPostText(search.text);
      }
    }
  }, [editingContents]);

  const handleEditContent = (item) => {
    const editingContent = {
      id: item.post_id,
      text: displayPostText,
      source_type: 'tiktok',
    };
    dispatch(setCurrentEditingContent(editingContent));
  };

  return (
    <div
      className={`mb-2 flex gap-2 hover:bg-gray-200 rounded-md transition-all cursor-pointer border p-2 relative`}
    >
      {isAuto && (
        <div
          className="w-1/12 flex items-center text-center justify-center"
          onClick={() => handleAddToWaitingList('tiktok', item)}
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

      <div
        className="w-3/12 relative h-40 bg-no-repeat bg-cover bg-center rounded-lg"
        onClick={() => handleActionShowPopup(item)}
        style={{ backgroundImage: `url(${item?.thumbnail})` }}
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
        className="w-7/12 relative"
        onClick={() => handleActionShowPopup(item)}
      >
        <h3 className="font-bold">{item?.feed_name || ''}</h3>
        <ContentStyled className="overflow-hidden">
          <p
            className="truncate"
            dangerouslySetInnerHTML={{ __html: displayPostText }}
          ></p>
        </ContentStyled>
        <div className="w-full mt-2">
          <div className="flex justify-between">
            <span className="flex gap-1">
              <FiHeart size={20} /> <span>{nFormatter(item?.react)}</span>
            </span>
            <span className="flex gap-1">
              <FiUser size={20} /> <span>{nFormatter(item?.comment)}</span>
            </span>
            <span className="flex gap-1">
              <FiShare size={20} /> <span>{nFormatter(item?.share)}</span>
            </span>
          </div>
        </div>
        <div className="w-full mt-2 absolute bottom-2">
          <div className="flex justify-between">
            <span className="bg-darkBgOpacityClr py-1 px-2 rounded-md font-bold text-white flex gap-1">
              <FiPlay size={20} /> <span>{nFormatter(item?.view)}</span>
            </span>
            <span className="bg-darkBgOpacityClr py-1 px-2 rounded-md font-bold text-white flex gap-1">
              <FiClock size={20} />{' '}
              {moment.utc(item?.duration * 1000).format('mm:ss')}
            </span>
          </div>
        </div>
      </div>
      {!isAuto && (
        <div
          className="w-1/12 ml-auto flex items-center justify-center"
          onClick={() => handleAddToSchedule(item)}
        >
          <img src={addIcons} className="w-8" />
        </div>
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

export default SingleTiktokContent;
