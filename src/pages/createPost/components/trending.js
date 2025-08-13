import { Tab } from '@headlessui/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { BiArrowBack } from 'react-icons/bi';
import { FaSearch } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import aimIcon from '../../../assets/images/icon/create-content/aim.png';
import LoadingApp from '../../../components/LoadingApp';
import { API_GET_GOOGLE_SUGGESTIONS_DETAIL, OK } from '../../../configs';
import {
  ACTION_GET_TITLE_CHILD,
  actionGetChartByKeyword,
  actionGetTitle,
  actionResetState,
} from '../../../store/actions/createContent';
import { actionLoadingApp } from '../../../store/actions/loading';
import Client from '../../../Client';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}
const Trending = () => {
  const dispatch = useDispatch();
  const [currentpage, setCurrentPage] = useState(1);
  const [loadingData, setLoadingData] = useState(false);
  const [titleChildSelect, setTitleChildSelect] = useState('');
  const { contentTitle, titleObjet, titleChild, chartTrending } = useSelector(
    (state) => state.createPost
  );
  const { isLoading } = useSelector((state) => state.isLoadingApp);
  const [inputValue, setInputValue] = useState('');
  const [titleChildStatus, setTitleChild] = useState(false);
  const handleSeachTitle = (type) => {
    if (type === 'next') {
      dispatch(actionLoadingApp(true));
      setLoadingData(true);
      const page = currentpage + 1;
      setCurrentPage(page);
      dispatch(actionGetTitle(inputValue, page, setLoadingData));
    } else {
      dispatch(actionGetTitle(inputValue, currentpage, setLoadingData));
    }
  };
  const handleGetContentChild = async (keyword) => {
    dispatch(actionLoadingApp(true));
    setTitleChild(true);
    setTitleChildSelect(keyword);
    const res = await Client.get(
      `${API_GET_GOOGLE_SUGGESTIONS_DETAIL}?q=${keyword}`
    );
    if (res.status === OK) {
      dispatch({
        type: ACTION_GET_TITLE_CHILD,
        payload: res.data.data || [],
      });
      dispatch(actionLoadingApp(false));
    }
  };
  useEffect(() => {
    dispatch(actionLoadingApp(false));
  }, []);
  const renderTitleChild = () => {
    return (
      <>
        <div className="ml-3 mt-5 relative flex justify-center mb-3 items-center">
          <button
            onClick={() => setTitleChild(false)}
            className="bg-blue-500 hover:bg-red-500 text-white p-2 rounded-md flex gap-1 items-center absolute left-0"
            disabled={inputValue === ''}
          >
            {' '}
            <BiArrowBack size={20} />
          </button>
          <span className="font-bold text-base">{titleChildSelect}</span>
        </div>
        <div className="flex flex-col">
          <div className="flex-grow overflow-auto">
            <table className="relative w-full mt-2 mb-8">
              <tbody className="divide-y">
                {titleChild.length === 0 && !isLoading ? (
                  <div className="flex justify-center">
                    <span>Không có dũ liệu hiển thị</span>
                  </div>
                ) : isLoading ? (
                  <LoadingApp />
                ) : (
                  <>
                    {titleChild.slice(0, 21).map((_elt, index) => {
                      return (
                        <div className="flex gap-2 py-4 items-center">
                          <span className="bg-blue-500 text-white w-8 h-8 flex justify-center items-center rounded-md">
                            {index + 1}
                          </span>
                          <a
                            href={_elt.url}
                            target="_blank"
                            className="truncate hover:underline hover:text-blue-400"
                          >
                            {_elt.title}
                          </a>
                        </div>
                      );
                    })}
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </>
    );
  };
  let [categories] = useState({
    // 'Nhân khẩu học': [],
    'TOP 20 bài viết': [],
  });

  return (
    <div className="w-full p-2">
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
      <Tab.Group>
        <Tab.List className="flex space-x-1 rounded-xl bg-gray-200 p-1">
          {Object.keys(categories).map((category) => (
            <Tab
              key={category}
              className={({ selected }) =>
                classNames(
                  'w-full rounded-lg py-2.5 font-medium leading-5 text-blue-700',
                  'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                  selected
                    ? 'bg-white shadow'
                    : 'text-blue-100 hover:bg-white/[0.12] hover:text-black'
                )
              }
            >
              {category}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="mt-2 overflow-scroll overflow-x-hidden max-h-screen">
          <Tab.Panel>
            <div className="overflow-scroll overflow-x-hidden max-h-screen mb-20">
              {contentTitle.length === 0 && !isLoading ? (
                <div className="flex justify-center">
                  <span className="font-bold mt-2 mb-2">
                    Không có dữ liệu hiển thị
                  </span>
                </div>
              ) : (isLoading && contentTitle.length) || isLoading ? (
                <LoadingApp />
              ) : (
                <>
                  {titleChildStatus ? (
                    renderTitleChild()
                  ) : (
                    <>
                      <div className="flex flex-col">
                        <div className="flex-grow overflow-auto">
                          <div className="relative w-full">
                            <div className="divide-y">
                              {contentTitle.map((_elt, index) => (
                                <div
                                  key={index}
                                  className="cursor-pointe flex flex-col"
                                >
                                  <div className="px-6 py-4 bg-gray-200  rounded-md">
                                    {_elt.title}
                                  </div>
                                  <div className="pl-5 pt-2 pb-2">
                                    {titleObjet[_elt.title]
                                      ? titleObjet[_elt.title]
                                          .slice(0, 21)
                                          .map((word, index) => {
                                            return (
                                              <div
                                                className="flex justify-between items-center hover:bg-gray-200"
                                                key={index}
                                                onClick={() =>
                                                  handleGetContentChild(word)
                                                }
                                              >
                                                <span
                                                  className={`pb-2 pt-2  pl-1 rounded-lg cursor-pointer`}
                                                >
                                                  - {word}
                                                </span>
                                                <span
                                                  className="pr-2"
                                                  onClick={() =>
                                                    handleGetContentChild(word)
                                                  }
                                                >
                                                  <img
                                                    src={aimIcon}
                                                    className="w-5"
                                                  />
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
                        </div>
                      </div>
                      {contentTitle.length === 0 ? null : (
                        <button
                          className={`w-full ${
                            loadingData
                              ? 'bg-gray-500'
                              : 'bg-blue-500 hover:bg-red-500 '
                          }  rounded-md mb-20 text-white cursor-pointer pb-3 pt-3`}
                          onClick={() => {
                            handleSeachTitle('next');
                          }}
                          disabled={loadingData}
                        >
                          Xem thêm
                        </button>
                      )}
                    </>
                  )}
                </>
              )}
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default Trending;
