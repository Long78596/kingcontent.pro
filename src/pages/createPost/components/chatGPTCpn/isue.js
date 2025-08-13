import React, { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { FiPlusSquare } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import LoadingApp from '../../../../components/LoadingApp';
import {
  actionGetChartByKeyword,
  actionGetTitle,
  actionQuestionChatGPT,
  actionResetState,
  actionUpdateSyncRequestPedding,
} from '../../../../store/actions/createContent';
import { actionLoadingApp } from '../../../../store/actions/loading';
import PerfectScrollbar from 'react-perfect-scrollbar';

const Isue = () => {
  const dispatch = useDispatch();
  const [currentpage, setCurrentPage] = useState(1);
  const [loadingData, setLoadingData] = useState(false);
  const { contentTitle, titleObjet, syncRequestPedding } = useSelector(
    (state) => state.createPost
  );
  const { isLoading } = useSelector((state) => state.isLoadingApp);
  const [inputValue, setInputValue] = useState('');
  const handleSeachTitle = (type) => {
    if (type === 'next') {
      dispatch(actionLoadingApp(true));
      setLoadingData(true);
      const page = currentpage + 1;
      setCurrentPage(page);
      dispatch(actionGetTitle(inputValue, page, setLoadingData));
    } else {
      dispatch(actionGetChartByKeyword(inputValue));
      dispatch(actionGetTitle(inputValue, currentpage, setLoadingData));
    }
  };
  const handleGetContentChild = (keyword) => {
    const _newSync = [...syncRequestPedding];
    _newSync.push({
      title: keyword,
      status: 'REJECT',
    });
    dispatch(actionUpdateSyncRequestPedding(_newSync));
    toast.success(
      'Đang xử lý câu hỏi , Vui lòng theo dõi tiến trình tại màn hình đang xử lý !'
    );
    dispatch(actionQuestionChatGPT({ question: keyword }, setInputValue));
  };
  useEffect(() => {
    dispatch(actionLoadingApp(false));
  }, []);
  return (
    <div>
      <div className="flex gap-1 p-2 mb-2">
        <input
          className="w-full outline-none p-2 rounded-md shadow-md"
          placeholder="Nhập từ khoá cần có trong tiêu đề ..."
          onChange={(e) => {
            if (e.target.value === '') {
              setInputValue(e.target.value);
              dispatch(actionResetState());
            } else {
              setInputValue(e.target.value);
            }
          }}
        />
        <button
          className="bg-blue-500 border-gray-300 border-1 text-white p-3 rounded-md shadow-md hover:bg-red-500"
          onClick={handleSeachTitle}
        >
          <FaSearch size={20} color="#fff" />
        </button>
      </div>
      <div className="overflow-scroll overflow-x-hidden max-h-screen mb-20">
        {contentTitle.length === 0 && !isLoading ? (
          <div className="flex justify-center">
            <span className="font-bold mt-2  mb-72">
              Không có dữ liệu hiển thị
            </span>
          </div>
        ) : isLoading && contentTitle.length === 0 ? (
          <LoadingApp />
        ) : (
          <>
            <div className="flex flex-col">
              <PerfectScrollbar className="flex-grow overflow-auto max-h-500">
                <div className="relative w-full">
                  <div className="divide-y">
                    {contentTitle.map((_elt, index) => (
                      <div key={index} className="cursor-pointer flex flex-col">
                        <div className="px-6 py-4 bg-gray-200  rounded-md">
                          {_elt.title}
                        </div>
                        <div className="pl-5 pt-2 pb-2">
                          {titleObjet[_elt.title]
                            ? titleObjet[_elt.title].map((word, index) => {
                                return (
                                  <div
                                    className="flex justify-between items-center hover:bg-gray-200"
                                    key={index}
                                    onClick={() => handleGetContentChild(word)}
                                  >
                                    <span
                                      className={`pb-2 pt-2  pl-1 rounded-lg cursor-pointer`}
                                    >
                                      - {word}
                                    </span>
                                    <span className="pr-2">
                                      {/* <img
                                                                                src={aimIcon}
                                                                                className="w-5"
                                                                            /> */}
                                      <FiPlusSquare size="25" color="green" />
                                    </span>
                                  </div>
                                );
                              })
                            : null}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </PerfectScrollbar>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Isue;
