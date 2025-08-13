import React, { useState } from 'react';
import {
  FiCheckCircle,
  FiEdit,
  FiMaximize,
  FiPlayCircle,
  FiTrash,
  FiPlusCircle,
} from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import LoadingApp from '../../../../components/LoadingApp';
import {
  ACTION_GET_HISTORY_QUESTION,
  deleteHistory,
  getHistory,
  saveHistory,
  toggleEditorText,
  updateHistory,
  updateHistoryHashtag,
} from '../../../../store/actions/createContent';
import PopupDetailContentChat from '../popupDetailContentChat';

import styled from 'styled-components';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import PopupTag from './popupTag';
import { FaSortAmountDown, FaSortAmountUp } from 'react-icons/fa';
import moment from 'moment';
import PerfectScrollbar from 'react-perfect-scrollbar';

const TextStyled = styled.div`
  span {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
`;
const Saved = (props) => {
  const dispatch = useDispatch();
  const [isOpenPopup, setIsOpenPopup] = useState(false);
  const [isSort, setIsSort] = useState(false);
  const { historyQuestionList } = useSelector((state) => state['createPost']);
  const { isLoading } = useSelector((state) => state.isLoadingApp);
  const [isCoppied, setIsCoppied] = useState({ status: false, id: null });
  const [isContent, setIsContent] = useState('');
  const [historyList, setHistoryList] = useState([]);
  const [originalHistoryList, setOriginalHistoryList] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isPopupTag, setIsPopupTag] = useState(false);
  const togglePopupTag = () => {
    setIsPopupTag(!isPopupTag);
  };

  const handleSaveHistory = (editingHashtag = null) => {
    if (editingHashtag) {
      dispatch(
        updateHistoryHashtag(editingHashtag.oldTag, editingHashtag.newTag)
      );
      setIsPopupTag(false);
    } else {
      const obj = {
        question: isContent.question,
        answer: isContent.answer,
        tag: isContent.tag,
      };
      dispatch(updateHistory(isContent.id, obj));
      setIsPopupTag(false);
    }
  };

  const handleCoppyToClipBoard = (content, id) => {
    dispatch(toggleEditorText(content, true));
    setIsCoppied({ status: true, id: id });
    toast.success('Thao tác thành công !');
    setTimeout(() => {
      setIsCoppied({ status: false, id: null });
    }, 2000);
  };

  const handleDeteleQuestion = (id) => {
    // eslint-disable-next-line no-restricted-globals
    const comfirm = confirm('Bạn có chắc chắn muốn xoá nội dung này ?');
    if (comfirm) {
      dispatch(deleteHistory(id));
    }
  };

  const togglePopup = (question, answer = undefined, id) => {
    setIsOpenPopup(!isOpenPopup);
    if (answer) {
      setIsContent({ question, content: answer, id });
    }
  };

  const handleOnSearch = (value) => {
    setInputValue(value);
    if (value !== '' && value) {
      const filterItem = originalHistoryList.filter(
        (_elt) =>
          _elt?.question.toLowerCase().includes(value) ||
          _elt?.answer.toLowerCase().includes(value) ||
          _elt?.tag.toLowerCase().includes(value)
      );
      dispatch({
        type: ACTION_GET_HISTORY_QUESTION,
        payload: filterItem,
      });
    } else {
      dispatch({
        type: ACTION_GET_HISTORY_QUESTION,
        payload: originalHistoryList,
      });
    }
  };

  const reFind = () => {
    dispatch({
      type: ACTION_GET_HISTORY_QUESTION,
      payload: originalHistoryList,
    });
    setInputValue('');
  };

  const sortByTime = () => {
    setIsSort(!isSort);
    if (isSort) {
      const sortedData2 = originalHistoryList.sort((a, b) =>
        moment(b.created).diff(moment(a.created))
      );
      dispatch({
        type: ACTION_GET_HISTORY_QUESTION,
        payload: sortedData2,
      });
    } else {
      const sortedData = originalHistoryList.sort((a, b) =>
        moment(a.created).diff(moment(b.created))
      );
      dispatch({
        type: ACTION_GET_HISTORY_QUESTION,
        payload: sortedData,
      });
    }
  };

  const onClickUpdateTag = (question, answer, id, tag) => {
    const obj = {
      question,
      answer,
      content: answer,
      id,
      tag,
    };
    setIsContent(obj);
    setIsPopupTag(true);
  };

  useEffect(() => {
    dispatch(getHistory());
  }, []);

  useEffect(() => {
    if (historyQuestionList.length > 0) {
      const list = historyQuestionList.filter(
        (item) => item.type !== 'threads'
      );
      setHistoryList(list);
      setOriginalHistoryList(list);
    }
  }, [historyQuestionList]);
  return (
    <>
      <div className="flex gap-3">
        <input
          className="w-full h-14 rounded-md shadow-sm border-gray-100 border-2 outline-none p-2"
          placeholder="Tìm kiếm câu hỏi , nội dung , thẻ ..."
          value={inputValue}
          onChange={(e) => handleOnSearch(e.target.value)}
        />
        <button
          className="w-14 bg-white flex justify-center items-center rounded-md shadow-sm"
          onClick={sortByTime}
        >
          {isSort ? (
            <FaSortAmountDown size={23} />
          ) : (
            <FaSortAmountUp size={25} />
          )}
        </button>
      </div>
      <section className="mt-4">
        {historyList.length === 0 && isLoading && <LoadingApp />}
        {historyList.length === 0 && !isLoading ? (
          <>
            <div className="flex justify-center flex-row mb-3">
              <span className="text-md font-bold text-center">
                Không có câu trả lời nào hiển thị tại đây !
              </span>
            </div>
          </>
        ) : null}
        {inputValue !== '' && historyList.length === 0 && (
          <div className="flex justify-center flex-row">
            {' '}
            <button
              onClick={reFind}
              className="bg-blue-500 px-3 rounded-md hover:bg-gray-400 disabled:bg-gray-400 text-white h-8"
            >
              Tìm kiếm lại
            </button>
          </div>
        )}
        {historyList.length > 0 ? (
          <PerfectScrollbar
            className=" w-full mt-1"
            style={{ height: '450px' }}
          >
            {historyList.map(({ question, answer, id, tag }, index) => (
              <div
                className="bg-gray-100 rounded-lg shadow-sm p-3 mb-4"
                key={index}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-base">{question}</h3>
                  </div>
                  <TextStyled>
                    <span dangerouslySetInnerHTML={{ __html: answer }}></span>
                  </TextStyled>
                </div>
                {/* <div className='flex justify-end'> <span className='bg-green-500 rounded-md text-white px-3 ml-3'>{tag}</span></div> */}
                <div className="flex justify-between gap-5 mt-3 items-center">
                  {tag ? (
                    <span
                      className="bg-green-500 rounded-md text-white px-3 py-1 cursor-pointer"
                      title="Chỉnh sửa"
                      onClick={() =>
                        onClickUpdateTag(question, answer, id, tag)
                      }
                    >
                      {tag}
                    </span>
                  ) : null}
                  <div className="gap-5 flex ml-auto items-center">
                    {!tag && (
                      <FiPlusCircle
                        size="25"
                        color="green"
                        className="hover:text-green-500 cursor-pointer"
                        onClick={() =>
                          onClickUpdateTag(question, answer, id, tag)
                        }
                      />
                    )}
                    <button
                      onClick={() => togglePopup(question, answer, id)}
                      title="Xem thêm"
                    >
                      <FiMaximize
                        size="25"
                        color="#FF8B13"
                        className="hover:text-green-500"
                      />
                    </button>
                    {isCoppied.status && isCoppied.id === id ? (
                      <FiCheckCircle
                        size="25"
                        color="green"
                        className="hover:text-green-500"
                      />
                    ) : (
                      <button
                        onClick={() => handleCoppyToClipBoard(answer, id)}
                      >
                        <FiEdit
                          size="25"
                          color="green"
                          className="hover:text-green-500"
                          title="Đưa vào trình soạn thảo"
                        />
                      </button>
                    )}
                    <button
                      onClick={() => handleDeteleQuestion(id)}
                      title="Xoá kết quả"
                    >
                      <FiTrash
                        size="25"
                        color="red"
                        className="hover:text-green-500"
                      />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </PerfectScrollbar>
        ) : null}
      </section>
      <PopupDetailContentChat
        isOpen={isOpenPopup}
        id={isContent.id}
        toggle={togglePopup}
        handleCoppyToClipBoard={handleCoppyToClipBoard}
        content={isContent.content}
        question={isContent.question}
        isCoppied={isCoppied}
      />
      {isPopupTag && (
        <PopupTag
          isOpen={isPopupTag}
          toggle={togglePopupTag}
          handleSaveHistory={handleSaveHistory}
          isContent={isContent}
          setIsContent={setIsContent}
          isEdit={true}
        />
      )}
    </>
  );
};

export default Saved;
