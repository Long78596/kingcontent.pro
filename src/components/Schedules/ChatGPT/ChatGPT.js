import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actionLoadingApp } from '../../../store/actions/loading';
import { getHistory } from '../../../store/actions/createContent';
import { FaSpinner } from 'react-icons/fa';
import SingleItem from './singleItem';
import { setScheduleWaitingList } from '../../../store/actions/Schedules';
import { useHistory } from 'react-router-dom/cjs/react-router-dom';
import PopupDetailContentChat from '../../../pages/createPost/components/popupDetailContentChat';

const ChatGPT = (props) => {
  const dispatch = useDispatch();
  const { isAuto = false, handleAddToWaitingList = () => {} } = props;
  const { isLoading } = useSelector((state) => state.isLoadingApp);
  const { historyQuestionList } = useSelector((state) => state.createPost);
  const { autoWaitingList } = useSelector((state) => state.schedules);
  const history = useHistory();
  const [currentContent, setCurrentContent] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    dispatch(actionLoadingApp(false));
    dispatch(getHistory());
  }, []);

  const onSelectAll = () => {
    dispatch(
      setScheduleWaitingList({
        ...autoWaitingList,
        contents: historyQuestionList,
        source_type: 'chatgpt',
      })
    );
  };

  const onUnSelectAll = () => {
    dispatch(
      setScheduleWaitingList({
        ...autoWaitingList,
        contents: [],
        source_type: 'chatgpt',
      })
    );
  };

  const onClickLink = () => {
    history.push('/tao-content');
  };

  const onClickShowDetail = (item) => {
    setCurrentContent(item);
    togglePopup();
  };

  return (
    <div className="ChatGPTContainer">
      {isLoading ? (
        <div className="w-full h-full flex items-center justify-center absolute top-0 left-0 bg-gray-100 bg-opacity-95 z-20">
          <FaSpinner className="animate-spin text-4xl text-gray-500" />
        </div>
      ) : (
        <div className="ChatGPT">
          {historyQuestionList.length === 0 ? (
            <div className="text-center mt-4 h-80 flex items-center justify-center text-base">
              Bạn chưa lưu nội dung từ ChatGPT, hãy sử dụng tính năng này trong
              trình soạn thảo{' '}
              <span
                className="underline cursor-pointer font-bold uppercase"
                onClick={() => onClickLink()}
              >
                tại đây
              </span>
            </div>
          ) : (
            <div>
              {isAuto && (
                <div className="flex gap-2 items-center mb-2 z-10 bg-white py-2 sticky border-b top-0">
                  <div className="actions">
                    <button
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-3 text-blue-600 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 font-bold mr-1"
                      onClick={() => onSelectAll()}
                    >
                      Chọn toàn bộ
                    </button>
                    <button
                      className="border-2 border-gray-200 bg-gray-100 hover:bg-blue-50 py-3 px-4 text-gray-500 rounded-md"
                      onClick={() => onUnSelectAll()}
                    >
                      Bỏ chọn
                    </button>
                  </div>
                  <div className="summary mb-2 ml-auto text-base">
                    <span>Số bài viết đã chọn: </span>
                    <span className="font-bold">
                      {autoWaitingList?.contents?.length || 0}
                    </span>
                  </div>
                </div>
              )}
              <div className="grid grid-cols-2 gap-2">
                {historyQuestionList.map((item, index) => (
                  <div key={index} className="">
                    <SingleItem
                      item={item}
                      isAuto={isAuto}
                      handleAddToWaitingList={handleAddToWaitingList}
                      onClickShowDetail={onClickShowDetail}
                    />
                  </div>
                ))}
              </div>
              {currentContent && (
                <PopupDetailContentChat
                  isOpen={isOpen}
                  id={currentContent.id}
                  toggle={togglePopup}
                  content={currentContent.text}
                  question={currentContent.question}
                  isSchedule={true}
                />
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatGPT;
