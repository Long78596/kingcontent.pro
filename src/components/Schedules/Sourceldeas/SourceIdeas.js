import React, { useCallback, useState } from 'react';
import { FiX } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import * as SCHEDULES from '../../../store/actions/Schedules';
import {
  DEFAULT,
  TREND,
  SPECIAL,
  ADS,
  CREATED,
  LIKED,
  TIKTOK,
  SYSTEM,
  EVENT,
  IDEAS_ARR,
  INSTAGRAM,
  THREADS,
  DOUYIN,
  CHATGPT,
  VIDEO_EDITOR,
  VIDEOGEN_AI
} from './utility';
import Trends from '../Trends';
import Ads from '../Ads';
import Plans from '../Created/Plans';
import Events from '../Events';
import Liked from '../Liked';
import Specials from '../Specials';
import Takecare from '../Takecare';
import Tiktok from '../Tiktok';
import Instagram from '../Instagram/Instagram';
import Threads from '../threads/threads';
import Douyin from '../douyin/douyin';
import ChatGPT from '../ChatGPT';
import VideoEditor from '../VideoEditor';
import TabCompleted, { ParentType } from '../../../pages/TextToVldeo/TabCompleted';

const SourceIdeas = (props) => {
  const { currentScheduleContentType: titleType = DEFAULT } = useSelector(
    (state) => state.schedules
  );
  const [descriptionType, setDescriptionType] = useState('');

  const dispatch = useDispatch();

  const renderContentType = () => {
    switch (titleType) {
      case TREND:
        return <Trends />;
      case SPECIAL:
        return <Specials />;
      case ADS:
        return <Ads />;
      case CREATED:
        return <Plans />;
      case LIKED:
        return <Liked />;
      case TIKTOK:
        return <Tiktok />;
      case INSTAGRAM:
        return <Instagram />;
      case SYSTEM:
        return <Takecare />;
      case EVENT:
        return <Events isShowEditContentBtn={true} />;
      case THREADS:
        return <Threads />;
      case DOUYIN:
        return <Douyin />;
      case CHATGPT:
        return <ChatGPT />;
      case VIDEO_EDITOR:
        return <VideoEditor />;
      case VIDEOGEN_AI:
        return <TabCompleted parent={ParentType.SourceIdeas}/>;
      default:
        return null;
    }
  };

  const reset = () => {
    dispatch(SCHEDULES.setCurrentScheduleContentType(DEFAULT));
    dispatch(SCHEDULES.setSelectedEvent(null));
  };

  const selectType = (type) => {
    dispatch(SCHEDULES.setCurrentScheduleContentType(type?.title));
    setDescriptionType(type?.description);
  };

  const handleClickGoBack = () => {
    dispatch(SCHEDULES.setCurrentScheduleContentType(DEFAULT));
    dispatch(SCHEDULES.setSelectedEvent(null));
    setDescriptionType('');
  };

  const handleClickBg = () => {
    dispatch(SCHEDULES.setShowSourceIdeasPopup(false));
    dispatch(SCHEDULES.setCurrentScheduleContentType(DEFAULT));
    dispatch(SCHEDULES.setSelectedEvent(null));
  };

  const renderDefaultContentArr = () => {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-4 md:grid-cols-2 gap-4 p-5">
        {IDEAS_ARR.map((_elt, index) => (
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
    <div className="sourceIdeasContainer fixed left-0 top-0 z-9999 w-full h-screen">
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
                {titleType === DEFAULT || titleType === null ? (
                  renderDefaultContentArr()
                ) : (
                  <div className="popupBody">{renderContentType()}</div>
                )}
              </div>
            </div>

            {/* footer */}
            <div className="flex gap-4 px-6 mb-4">
              <button
                className="border-2 border-gray-200 bg-gray-100 hover:bg-blue-50 py-3 px-4 text-gray-500 rounded-md"
                onClick={() => handleClickBg()}
              >
                Huỷ
              </button>
              {titleType !== DEFAULT && (
                <button
                  className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-3 text-blue-600 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 font-bold"
                  onClick={() => handleClickGoBack()}
                >
                  Quay lại
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </div>
  );
};
export default SourceIdeas;
