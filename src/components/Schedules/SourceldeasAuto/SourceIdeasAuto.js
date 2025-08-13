import React, { useCallback, useEffect, useState } from 'react';
import { FiX } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import {
  DEFAULT,
  TREND,
  SPECIAL,
  ADS,
  CREATED,
  LIKED,
  TIKTOK,
  INSTAGRAM,
  SYSTEM,
  EVENT,
  IDEAS_AUTO_ARR,
  THREADS,
  DOUYIN,
  CHATGPT,
  VIDEOGEN_AI,
  VIDEO_EDITOR,
} from '../Sourceldeas/utility';

import Created from '../Created/Created';
import Events from '../Events/Events';
import Liked from '../Liked/Liked';
import Specials from '../Specials';
import Takecare from '../Takecare';
import Tiktok from '../Tiktok/Tiktok';
import Instagram from '../Instagram/Instagram';
import Threads from '../threads/threads';
import Douyin from '../douyin/douyin';
import Plans from '../Created/Plans';

import {
  setCurrentScheduleContentType,
  setIsShowFinalStepAuto,
  setScheduleWaitingList,
  setShowSourceIdeasAutoPopup,
} from '../../../store/actions/Schedules';
import { toast } from 'react-toastify';
import { confirmAlert } from 'react-confirm-alert';
import ChatGPT from '../ChatGPT';
import VideoEditor from '../VideoEditor';
import TabCompleted, { ParentType } from '../../../pages/TextToVldeo/TabCompleted';

const SourceIdeasAuto = (props) => {
  const { autoWaitingList, currentScheduleContentType = DEFAULT } = useSelector(
    // @ts-ignore
    (state) => state.schedules
  );

  const [titleType, setTitleType] = useState(DEFAULT);
  const [descriptionType, setDescriptionType] = useState('');
  const [isDisableSubmit, setIsDisableSubmit] = useState(false);

  useEffect(() => {
    if (currentScheduleContentType && currentScheduleContentType !== DEFAULT) {
      setTitleType(currentScheduleContentType);
    }
  }, [currentScheduleContentType]);

  const dispatch = useDispatch();

  const renderContentType = (titleType, handleAddToWaitingList) => {
    switch (titleType) {
      case SPECIAL:
        return (
          <Specials
            isAuto={true}
            handleAddToWaitingList={handleAddToWaitingList}
          />
        );

      case CREATED:
        return (
          <Plans
            isAuto={true}
            handleAddToWaitingList={handleAddToWaitingList}
          />
        );

      case LIKED:
        return (
          <Liked
            isAuto={true}
            handleAddToWaitingList={handleAddToWaitingList}
          />
        );

      case TIKTOK:
        return (
          <Tiktok
            isAuto={true}
            handleAddToWaitingList={handleAddToWaitingList}
          />
        );

      case INSTAGRAM:
        return (
          <Instagram
            isAuto={true}
            handleAddToWaitingList={handleAddToWaitingList}
          />
        );

      case SYSTEM:
        return (
          <Takecare
            isAuto={true}
            handleAddToWaitingList={handleAddToWaitingList}
          />
        );

      case EVENT:
        return (
          <Events
            isAuto={true}
            handleAddToWaitingList={handleAddToWaitingList}
          />
        );

      case THREADS:
        return (
          <Threads
            isAuto={true}
            handleAddToWaitingList={handleAddToWaitingList}
          />
        );

      case DOUYIN:
        return (
          <Douyin
            isAuto={true}
            handleAddToWaitingList={handleAddToWaitingList}
          />
        );

      case CHATGPT:
        return (
          <ChatGPT
            isAuto={true}
            handleAddToWaitingList={handleAddToWaitingList}
          />
        );
      case VIDEOGEN_AI:
        return (
          <TabCompleted
            parent={ParentType.SourceIdeasAuto}
            handleAddToWaitingList={handleAddToWaitingList}
          />
        );

      case VIDEO_EDITOR:
        return (
          <VideoEditor
            isAuto={true}
            handleAddToWaitingList={handleAddToWaitingList}
          />
        );

      default:
        return null;
    }
  };

  const reset = () => {
    setTitleType(DEFAULT);
    dispatch(setCurrentScheduleContentType(DEFAULT));
  };

  const selectType = (type) => {
    setTitleType(type?.title);
    setDescriptionType(type?.description);
    dispatch(setCurrentScheduleContentType(type?.title));
  };

  const handleClickGoBack = useCallback(() => {
    setTitleType(DEFAULT);
    dispatch(setCurrentScheduleContentType(DEFAULT));
    setDescriptionType('');
    dispatch(setScheduleWaitingList(null));
  }, []);

  const handleClickBg = () => {
    dispatch(setShowSourceIdeasAutoPopup(false));
    dispatch(setScheduleWaitingList(null));
  };

  const handleAddToWaitingList = (type, item, cat_id = 0) => {
    if (!autoWaitingList) {
      const newList = {
        source_type: type,
        contents: [item],
      };
      dispatch(setScheduleWaitingList(newList));
    } else {
      const { contents } = autoWaitingList;
      let newContents = null;
      // check if exist
      const search = contents.find((elt) => {
        switch (type) {
          case 'douyin':
            return elt.video_id === item.video_id;
          case 'threads':
          case 'chatgpt':
          case 'video_editor':
            return elt.id === item.id;
          default:
            return elt.post_id === item.post_id;
        }
      });
      if (search) {
        newContents = contents.filter((elt) => {
          switch (type) {
            case 'douyin':
              return elt.video_id !== item.video_id;
            case 'threads':
            case 'chatgpt':
            case 'video_editor':
              return elt.id !== item.id;
            default:
              return elt.post_id !== item.post_id;
          }
        });
      } else {
        newContents = [...contents, item];
      }
      // push content
      dispatch(
        setScheduleWaitingList({
          ...autoWaitingList,
          contents: newContents,
          source_type: type,
          cat_id,
        })
      );
    }
  };

  const onConfirmSchedule = () => {
    const totalSelected = autoWaitingList?.contents?.length || 0;
    if (totalSelected === 0) {
      toast.error('Vui lòng chọn ít nhất 1 content');
      return;
    } else {
      const { source_type, contents } = autoWaitingList;
      if (source_type === 'douyin') {
        // const countNotReels = contents.filter((elt) => !elt.is_reels).length;
        const countDurationLargerThan5Min = contents.filter(
          (elt) => elt.duration > 300
        ).length;
        // if (countNotReels > 0) {
        if (countDurationLargerThan5Min > 0) {
          confirmAlert({
            title: 'Thông báo',
            overlayClassName: 'large-confirmation',
            message: `Kingcontent chỉ hỗ trợ đăng video dài tối đa 5 phút. Vui lòng bỏ ${countDurationLargerThan5Min} video không phù hợp và chọn video khác! (Video không phù hợp được đánh dấu tròn màu đỏ)`,
            buttons: [
              {
                label: 'Chọn lại',
                onClick: () => {},
              },
              {
                label: 'Tự động bỏ video không phù hợp',
                className: 'bg-red-500 text-white whitespace-nowrap w-auto',
                onClick: () => {
                  const newContents = contents.filter(
                    (elt) => elt.duration <= 300
                  );
                  dispatch(
                    setScheduleWaitingList({
                      ...autoWaitingList,
                      contents: newContents,
                    })
                  );
                  dispatch(setIsShowFinalStepAuto(true));
                  dispatch(setShowSourceIdeasAutoPopup(false));
                },
              },
            ],
          });
          return;
        }
      }
      dispatch(setIsShowFinalStepAuto(true));
      dispatch(setShowSourceIdeasAutoPopup(false));
    }
  };

  const renderDefaultContentArr = () => {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-4 p-5">
        {IDEAS_AUTO_ARR.map((_elt, index) => (
          <div key={index}>
            <div
              className="border-2 border-gray-200 bg-gray-100 rounded-lg p-4 h-26 hover:bg-blue-50 cursor-pointer flex justify-center transition-all"
              onClick={() => selectType(_elt)}
            >
              <img src={_elt?.icon} className="w-16" />
            </div>
            <p className="text-center"> {_elt?.title}</p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="sourceIdeasAutoContainer fixed left-0 top-0 z-9999 w-full h-screen">
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none max-h-screen">
        <div className="relative w-98% mx-auto max-h-95 overflow-auto">
          {/*content*/}
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            {/*header*/}
            <div className="flex items-start justify-between px-2 py-4 border-b border-solid border-gray-300 rounded-t">
              <div className="bg-gray-50  text-sm overflow-hidden pt-3 pb-3 flex1 justify-between border-l-4 border-green-500 pl-2 w-full">
                <p className="font-bold uppercase text-base">{titleType}</p>
                {titleType !== DEFAULT ? (
                  <span className="italic">{descriptionType}</span>
                ) : (
                  ''
                )}
              </div>
            </div>
            {/*body*/}
            <div className="relative p-2 flex flex-auto gap-3">
              <div className="w-full">
                {titleType === DEFAULT ? (
                  renderDefaultContentArr()
                ) : (
                  <div className="popupBody">
                    {renderContentType(titleType, handleAddToWaitingList)}
                  </div>
                )}
              </div>
            </div>
            {/* footer */}
            <div className="mb-4 flex gap-4 px-6 sticky bottom-0 bg-white p-3 z-50">
              <button
                className="border-2 border-gray-200 bg-gray-100 hover:bg-blue-50 py-3 px-4 text-gray-500 rounded-md"
                onClick={() => handleClickBg()}
              >
                Huỷ
              </button>
              {titleType !== DEFAULT && (
                <>
                  <button
                    className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-3 text-blue-600 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 font-bold mr-1"
                    onClick={() => handleClickGoBack()}
                  >
                    Quay lại
                  </button>
                  <button
                    className="border-2 border-gray-200 bg-blue-800 hover:bg-blue-400 py-3 px-4 text-white rounded-md"
                    onClick={() => onConfirmSchedule()}
                    disabled={isDisableSubmit}
                  >
                    Xác nhận
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </div>
  );
};
export default SourceIdeasAuto;
