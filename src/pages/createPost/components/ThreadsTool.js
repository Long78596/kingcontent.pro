import { confirmAlert } from 'react-confirm-alert';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'rsuite';
import {
  actionOptimizeThreads,
  defaultThreadsPrompt,
  deleteHistory,
  getHistory,
  saveHistory,
  toggleEditorText,
  updateHistoryHashtag,
  updateIsSavedThreadsChatGptData,
  updateThreadsChatGptData,
} from '../../../store/actions/createContent';
import { Fragment, useEffect, useState } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  FiCheckCircle,
  FiEdit,
  FiMaximize,
  FiPlusCircle,
  FiRefreshCcw,
  FiSave,
  FiSunrise,
  FiTrash,
} from 'react-icons/fi';
import PopupDetailContentChat from './popupDetailContentChat';
import PopupTag from './chatGPTCpn/popupTag';
import { toast } from 'react-toastify';
import chatIcon from '../../../assets/images/icon/create-content/chat.png';
import downloadIcon from '../../../assets/images/icon/create-content/download.png';
import { CHAT, DOWNLOAD } from '../utility';

const threadsTabs = [
  {
    title: 'Tối ưu Threads',
    icon: chatIcon,
    type: CHAT,
  },
  {
    title: 'Kết quả đã lưu',
    icon: downloadIcon,
    type: DOWNLOAD,
  },
];

const ThreadsChatGpt = (props) => {
  const {
    isCopied,
    setIsPopupTag,
    setIsContent,
    togglePopup,
    handleCopyToClipBoard,
  } = props;
  const [hasPending, setHasPending] = useState(false);

  const dispatch = useDispatch();
  const { textContent, threadsChatGptData } = useSelector(
    (state) => state.createPost
  );

  useEffect(() => {
    const hasPending = threadsChatGptData.some(
      (item) => item.status === 'PENDING'
    );
    setHasPending(hasPending);
  }, [threadsChatGptData]);

  const onClickOptimize = () => {
    confirmAlert({
      title: 'Xác nhận',
      message: 'Bạn có chắc chắn muốn tối ưu nội dung?',
      buttons: [
        {
          label: 'Có',
          onClick: () => {
            dispatch(actionOptimizeThreads(textContent));
          },
        },
        {
          label: 'Không',
          onClick: () => {},
        },
      ],
    });
  };

  const handleReplaceQuestion = (question, id) => {
    confirmAlert({
      title: 'Xác nhận',
      message: 'Bạn có muốn đổi một content mới?',
      buttons: [
        {
          label: 'Thay thế nội dung cũ',
          onClick: () => {
            const newThreadsChatGptData = threadsChatGptData.map((item) => {
              if (item.id === id) {
                return { ...item, status: 'PENDING' };
              }
              return item;
            });
            dispatch(updateThreadsChatGptData(newThreadsChatGptData));
          },
        },
        {
          label: 'Lấy nội dung mới',
          onClick: () => {
            dispatch(actionOptimizeThreads(textContent));
          },
        },
        {
          label: 'Hủy',
          onClick: () => {},
        },
      ],
      overlayClassName: 'large-confirmation',
    });
  };

  const handleDeleteQuestion = (id) => {
    confirmAlert({
      title: 'Xác nhận',
      message: 'Bạn có chắc chắn muốn xoá nội dung này?',
      buttons: [
        {
          label: 'Xoá',
          onClick: () => {
            const _newData = threadsChatGptData.filter(
              (_elt) => _elt.id !== id
            );
            dispatch(updateThreadsChatGptData(_newData));
            toast.success('Xoá thành công!');
          },
        },
        {
          label: 'Hủy',
          onClick: () => {},
        },
      ],
    });
  };

  const renderSingleItem = (id, title, convertTitle, answer, isSaved = false) => {
    return (
      <div
        className="bg-gray-100 rounded-lg shadow-sm p-3 mb-4"
      >
        <div>
          <h3 className="font-bold text-base line-clamp-1">
            {convertTitle}
          </h3>
          <div className="line-clamp-3">
            <span>{answer}</span>
          </div>
        </div>
        <div className="flex justify-end gap-5 mt-3">
          <button
            onClick={() => handleReplaceQuestion(title, id)}
            title="Đổi kết quả"
          >
            <FiRefreshCcw size="25" className="text-black" />
          </button>
          <button
            onClick={() => togglePopup(title, answer, id)}
            title="Xem thêm"
          >
            <FiMaximize
              size="25"
              color="#FF8B13"
              className="hover:text-green-500"
            />
          </button>
          {isCopied.status && isCopied.id === id ? (
            <FiCheckCircle
              size="25"
              color="green"
              className="hover:text-green-500"
            />
          ) : (
            <button
              title="Đưa vào trình soạn thảo"
              onClick={() => handleCopyToClipBoard(answer, id)}
            >
              <FiEdit
                size="25"
                color="green"
                className="hover:text-green-500"
              />
            </button>
          )}
          <button title="Lưu kết quả">
            {isSaved ? (
              <FiCheckCircle
                size="25"
                color="green"
                className="hover:text-green-500"
              />
            ) : (
              <FiSave
                size="25"
                color="#FFD95A"
                onClick={() => {
                  setIsContent({
                    question: title,
                    answer,
                    content: answer,
                    id,
                    tag: '',
                  });
                  setIsPopupTag(true);
                }}
                className="hover:text-green-500"
            />
            )}
          </button>
          <button
            onClick={() => handleDeleteQuestion(id)}
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
    );
  }

  return (
    <div>
      <p className="italic text-center font-bold">
        * Tối ưu nội dung ở trình soạn thảo dành riêng cho nền tảng Threads!
      </p>

      <div className="flex justify-center mt-2">
        {textContent.length > 0 ? (
          <p>
            Số lượng ký tự:{' '}
            <span className="font-bold">{textContent.length}</span> /{' '}
            <span className="text-red-500 font-bold">500</span>
          </p>
        ) : (
          <p className="text-red-500">
            Vui lòng soạn nội dung trước khi tối ưu
          </p>
        )}
      </div>

      <div className="flex justify-center mt-2">
        <Button
          className={`bg-blue-500 p-3 px-4 text-white rounded-lg shadow-lg flex gap-2 items-center hover:bg-red-600 transform transition-all ${
            !textContent.length || hasPending ? 'bg-gray-200' : ''
          }`}
          disabled={!textContent.length || hasPending}
          onClick={onClickOptimize}
        >
          <FiSunrise size="25" />
          <span>Tối ưu ngay</span>
        </Button>
      </div>

      <PerfectScrollbar className="w-full mt-4 max-h-screen">
        {threadsChatGptData.length > 0 && (
          <div className="grid grid-cols-1 gap-2">
            {threadsChatGptData.map((item, index) => {
              const { id, answer, title, status, isSaved = false } = item;
              // remove default prompt in title
              const convertedTitle = title.replace(
                `${defaultThreadsPrompt} `,
                'Nội dung gốc: '
              );
              if (status === 'PENDING') {
                return (
                  <div
                    className="animate-pulse bg-gray-100 rounded-lg shadow-sm p-3 mb-4 text-gray-400"
                    key={index}
                  >
                    <div>
                      <h3 className="font-bold text-base line-clamp-1">
                        {convertedTitle}
                      </h3>
                      <div className="line-clamp-2">
                        <span className="text-gray-400">Đang xử lý ...</span>
                      </div>
                    </div>
                  </div>
                );
              } else {
                return (
                  <Fragment key={index}>
                    {renderSingleItem(id, title, convertedTitle, answer, isSaved)}
                  </Fragment>
                );
              }
            })}
          </div>
        )}
      </PerfectScrollbar>
    </div>
  );
};

const DownloadTool = (props) => {
  const {
    isCopied,
    setIsPopupTag,
    setIsContent,
    togglePopup,
    handleCopyToClipBoard,
  } = props;
  const { historyQuestionList } = useSelector((state) => state.createPost);
  const [threadsHistory, setThreadsHistory] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [tagList, setTagList] = useState([]);
  const [currentKeyword, setCurrentKeyword] = useState('');
  const [currentTag, setCurrentTag] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {
    const _threadsHistory = historyQuestionList.filter(
      (item) => item.type === 'threads'
    );
    setThreadsHistory(_threadsHistory);
    setFilteredList(_threadsHistory);
    setTagList(
      _threadsHistory.reduce((acc, item) => {
        if (item.tag) {
          // check if tag is already in the list
          const isExist = acc.some((tag) => tag.value === item.tag);
          if (!isExist) {
            acc.push({ name: item.tag, value: item.tag });
          }
        }
        return acc;
      }, [])
    );
  }, [historyQuestionList]);

  const handleDeleteQuestion = (id) => {
    confirmAlert({
      title: 'Xác nhận',
      message: 'Bạn có chắc chắn muốn xoá nội dung này?',
      buttons: [
        {
          label: 'Xoá',
          onClick: () => {
            dispatch(deleteHistory(id));
            toast.success('Xoá thành công!');
          },
        },
        {
          label: 'Hủy',
          onClick: () => {},
        },
      ],
    });
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
    if (currentKeyword || currentTag) {
      let _filteredList = threadsHistory;
      if (currentTag) {
        _filteredList = _filteredList.filter((item) => item.tag === currentTag);
      }
      if (currentKeyword) {
        _filteredList = _filteredList.filter(
          (item) =>
            item.question.includes(currentKeyword) ||
            item.answer.includes(currentKeyword)
        );
      }
      setFilteredList(_filteredList);
    } else {
      setFilteredList(threadsHistory);
    }
  }, [currentKeyword, currentTag, threadsHistory]);

  return (
    <div>
      {/* quick filter */}
      <div className="flex justify-between items-center mb-4 gap-2">
        <input
          type="text"
          placeholder="Tìm kiếm nhanh...."
          className="p-2 w-full border border-gray-200 rounded-lg"
          onChange={(e) => setCurrentKeyword(e.target.value)}
        />
        {/* tag list */}
        <select
          className="p-2 w-1/4 border border-gray-200 rounded-lg"
          onChange={(e) => {
            setCurrentTag(e.target.value);
          }}
          defaultValue=""
          value={currentTag}
        >
          <option value="">Chọn tag ...</option>
          {tagList.map((item, index) => {
            return (
              <option key={index} value={item.value}>
                {item.name}
              </option>
            );
          })}
        </select>
      </div>

      <PerfectScrollbar className="w-full max-h-screen">
        {filteredList.length > 0 ? (
          <div className="grid grid-cols-1 gap-2">
            {filteredList.map((item, index) => {
              const { id, question, answer, tag } = item;
              const convertedQuestion = question.replace(
                `${defaultThreadsPrompt} `,
                'Nội dung gốc: '
              );
              return (
                <div
                  className="bg-gray-100 rounded-lg shadow-sm p-3 mb-4"
                  key={index}
                >
                  <div>
                    <h3 className="font-bold text-base line-clamp-1">
                      {convertedQuestion}
                    </h3>
                    <div className="line-clamp-3">
                      <span>{item.answer}</span>
                    </div>
                  </div>
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
                      {isCopied.status && isCopied.id === id ? (
                        <FiCheckCircle
                          size="25"
                          color="green"
                          className="hover:text-green-500"
                        />
                      ) : (
                        <button
                          onClick={() => handleCopyToClipBoard(answer, id)}
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
                        onClick={() => handleDeleteQuestion(id)}
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
              );
            })}
          </div>
        ) : (
          <div className="flex justify-center items-center h-96">
            <p>Bạn hãy bỏ lọc hoặc thêm dữ liệu mới</p>
          </div>
        )}
      </PerfectScrollbar>
    </div>
  );
};

const ThreadsTool = () => {
  const [tabSelected, setTabSelected] = useState(CHAT);
  const [firstLoad, setFirstLoad] = useState(true);
  const [isOpenPopup, setIsOpenPopup] = useState(false);
  const [isCopied, setIsCopied] = useState({ status: false, id: null });
  const [isPopupTag, setIsPopupTag] = useState(false);
  const [isContent, setIsContent] = useState({});
  const { historyQuestionList } = useSelector((state) => state.createPost);
  const dispatch = useDispatch();

  const handleCopyToClipBoard = (content, id) => {
    dispatch(toggleEditorText(content, tabSelected === CHAT));
    setIsCopied({ status: true, id: id });
    toast.success('Thao tác thành công');
    setTimeout(() => {
      setIsCopied({ status: false, id: null });
    }, 2000);
  };

  const togglePopup = (question, answer = undefined, id) => {
    setIsOpenPopup(!isOpenPopup);
    if (answer) {
      setIsContent({ question: question, content: answer, id });
    }
  };

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
        type: 'threads',
      };
      dispatch(saveHistory(obj));
      dispatch(updateIsSavedThreadsChatGptData(isContent.id));
      setIsPopupTag(false);
    }
  };

  useEffect(() => {
    if (firstLoad && historyQuestionList.length === 0) {
      dispatch(getHistory());
      setFirstLoad(false);
    }
  }, [dispatch, historyQuestionList, firstLoad]);

  return (
    <div className="p-4">
      <div className="flex gap-5 mb-4 border-b border-gray-200 dark:border-gray-700">
        {threadsTabs.map((tab, index) => {
          return (
            <div
              key={index}
              onClick={() => setTabSelected(tab.type)}
              className={`mr-2 p-4 border-b-2 rounded-t-lg flex items-center hover:border-blue-700 relative  cursor-pointer ${
                tabSelected === tab.type &&
                'border-blue-700 transition-all duration-700'
              }`}
            >
              <img src={tab.icon} alt="icon" className="w-6 h-6 mr-2" />
              {tab.type === DOWNLOAD && (
                <div className="absolute top-2 left-8 w-3 h-3 text-xs">
                  {historyQuestionList.length > 0 &&
                    historyQuestionList.filter(
                      (item) => item.type === 'threads'
                    ).length}
                </div>
              )}
              <span className="uppercase">{tab.title}</span>
            </div>
          );
        })}
      </div>
      {tabSelected === CHAT ? (
        <ThreadsChatGpt
          isCopied={isCopied}
          setIsOpenPopup={setIsOpenPopup}
          setIsCopied={setIsCopied}
          setIsPopupTag={setIsPopupTag}
          setIsContent={setIsContent}
          togglePopup={togglePopup}
          handleCopyToClipBoard={handleCopyToClipBoard}
        />
      ) : (
        <DownloadTool
          isCopied={isCopied}
          setIsOpenPopup={setIsOpenPopup}
          setIsCopied={setIsCopied}
          setIsPopupTag={setIsPopupTag}
          setIsContent={setIsContent}
          togglePopup={togglePopup}
          handleCopyToClipBoard={handleCopyToClipBoard}
        />
      )}
      <PopupDetailContentChat
        isOpen={isOpenPopup}
        id={isContent.id}
        toggle={togglePopup}
        handleCopyToClipBoard={handleCopyToClipBoard}
        content={isContent.content}
        question={isContent?.question?.replace(
          `${defaultThreadsPrompt} `,
          'Nội dung gốc: '
        )}
        isCopied={isCopied}
        replace={tabSelected === CHAT}
      />
      <PopupTag
        isOpen={isPopupTag}
        toggle={togglePopupTag}
        handleSaveHistory={handleSaveHistory}
        isContent={isContent}
        setIsContent={setIsContent}
      />
    </div>
  );
};

export default ThreadsTool;
