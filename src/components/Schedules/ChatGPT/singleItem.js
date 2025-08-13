import React, { Fragment, useEffect, useState } from 'react';
import {
  FiCheckCircle,
  FiEdit,
  FiEye,
  FiMaximize,
  FiPlusCircle,
  FiTrash,
} from 'react-icons/fi';
import { defaultThreadsPrompt } from '../../../store/actions/createContent';
import addIcons from '../../../assets/images/icon/create-content/add.png';
import {
  FaCheckSquare,
  FaExclamation,
  FaPencilAlt,
  FaRegSquare,
} from 'react-icons/fa';
import {
  setCurrentEditingContent,
  setIsShowFinalStep,
  setSelectedScheduleContent,
  setShowSourceIdeasPopup,
} from '../../../store/actions/Schedules';
import { useDispatch, useSelector } from 'react-redux';
import PopupDetailContentChat from '../../../pages/createPost/components/popupDetailContentChat';

const SingleItem = (props) => {
  const { item, isAuto, handleAddToWaitingList, onClickShowDetail } = props;
  const { question, answer, tag, id } = item;

  const convertedTitle = question.replace(
    `${defaultThreadsPrompt} `,
    'Nội dung gốc: '
  );
  const dispatch = useDispatch();

  const [isScheduled, setIsScheduled] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const [displayPostText, setDisplayPostText] = useState('');

  const {
    autoWaitingList,
    scheduledContents,
    editingContents = [],
  } = useSelector((state) => state.schedules);

  useEffect(() => {
    if (autoWaitingList) {
      const { contents } = autoWaitingList;
      if (contents.length > 0) {
        const search = contents.find((elt) => elt.id === item.id);
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
    if (item) {
      setDisplayPostText(item?.answer || '');
    }
  }, [item]);

  const handleAddToSchedule = () => {
    dispatch(
      setSelectedScheduleContent({
        ...item,
        source_type: 'chatgpt',
        post_id: id,
        post_text: displayPostText,
        media_type: 'text',
        images: [],
        videos: [],
      })
    );
    dispatch(setIsShowFinalStep(true));
    dispatch(setShowSourceIdeasPopup(false));
  };

  useEffect(() => {
    if (scheduledContents && scheduledContents.length > 0) {
      const search = scheduledContents.find((elt) => {
        return elt?.content_id === item?.id && elt?.source_type === 'chatgpt';
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
        (elt) => elt.id === item.id && elt.source_type === 'chatgpt'
      );
      if (search) {
        setDisplayPostText(search.text);
      }
    }
  }, [editingContents]);

  const handleEditContent = (item) => {
    const editingContent = {
      id: item.id,
      text: displayPostText,
      source_type: 'chatgpt',
    };
    dispatch(setCurrentEditingContent(editingContent));
  };

  return (
    <div className="bg-gray-100 rounded-lg shadow-sm p-3 relative flex gap-2">
      {isAuto && (
        <div
          className="w-1/12 flex items-center text-center justify-center cursor-pointer"
          onClick={() => handleAddToWaitingList('chatgpt', item)}
        >
          {isSelected ? (
            <FaCheckSquare className="w-6 text-green-500 text-base" />
          ) : (
            <FaRegSquare className="w-6 text-gray-500 text-base" />
          )}
        </div>
      )}

      <div className="w-11/12">
        <div className="flex items-center justify-between line-clamp-2 pb-2">
          <h3 className="font-bold text-base">{convertedTitle}</h3>
        </div>
        <div className="max-h-40 overflow-auto whitespace-pre-wrap">
          <p dangerouslySetInnerHTML={{ __html: displayPostText }}></p>
        </div>

        <div className="flex justify-between gap-5 mt-3 items-center">
          {tag ? (
            <span className="bg-green-500 rounded-md text-white px-3 py-1 cursor-pointer">
              {tag}
            </span>
          ) : null}
          <div className="actions flex items-center gap-3">
            <div
              className="cursor-pointer flex items-center gap-2 p-2 rounded-md border border-gray-300 bg-blue-100 hover:bg-blue-200 text-blue-500"
              onClick={() => handleEditContent(item)}
            >
              <FaPencilAlt />
              <span>Chỉnh sửa</span>
            </div>
            <div
              className="cursor-pointer flex items-center gap-2 rounded-md p-2 border border-gray-300 bg-blue-800 hover:bg-blue-400 text-white"
              onClick={() =>
                onClickShowDetail({
                  ...item,
                  text: displayPostText,
                })
              }
            >
              <FiEye />
              <span>Xem chi tiết</span>
            </div>
          </div>
        </div>
      </div>
      {!isAuto && (
        <div
          className="w-1/12 ml-auto flex items-center justify-center cursor-pointer"
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

export default SingleItem;
