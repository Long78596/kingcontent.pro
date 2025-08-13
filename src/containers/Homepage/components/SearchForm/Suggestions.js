import React, { useEffect, useState } from 'react';
import ListContents from './ListContents';
// import ListFanpages from './ListFanpages';
import { useSelector } from 'react-redux';
import { ImCross } from 'react-icons/im';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';

const Suggestions = (props) => {
  const { isSearch, loading, setLoading, isHome = true } = props;
  const [showResults, setShowResults] = useState(false);
  const [showNoResults, setShowNoResults] = useState(false);
  const { contents = [], fanpages = [] } = useSelector(
    (state) => state.homepage
  );
  useEffect(() => {
    setShowResults(contents.length > 0 || fanpages.length > 0);
  }, [contents, fanpages]);

  useEffect(() => {
    setShowNoResults(contents.length === 0 && fanpages.length === 0);
  }, [contents, fanpages]);

  const onCloseResults = () => {
    setLoading(false);
    setShowResults(false);
    setShowNoResults(false);
  };

  const renderSuggestions = () => {
    return (
      <div className='SearchSuggestions'>
        {showResults && (
          <div
            className={`suggestions flex absolute bg-white w-2/3 left-0 right-0 p-4 top-11 mt-1 rounded-md pb-5 border z-10 shadow-lg`}
          >
            {contents.length > 0 && (
              <div
                className={`listContents text-left max-h-72 overflow-hidden relative pr-4 pt-0 ${
                  fanpages.length === 0 ? 'w-full' : 'w-2/3'
                }`}
              >
                {/* add icon on top right to close results */}
                <div
                  className="absolute -top-2 -right-2 cursor-pointer p-2"
                  onClick={() => onCloseResults()}
                  title='Đóng'
                >
                  <ImCross className="w-3 h-3 text-red-500" />
                </div>
                <ListContents contents={contents} />
              </div>
            )}
            {fanpages.length > 0 && false && (
              <div
                className={`listFanpages text-left max-h-72 overflow-hidden ${
                  contents.length === 0 ? 'w-full' : 'w-1/3'
                }`}
              >
                {/* <ListFanpages fanpages={fanpages} /> */}
              </div>
            )}
          </div>
        )}
        {showNoResults && (
          <div
            className={`suggestions flex absolute bg-white w-full ${
              isHome ? `m-auto` : ``
            } left-0 right-0 p-4 top-11 mt-1 rounded-md pb-5 border z-10 shadow-lg`}
          >
            <p className="text-center w-full">
              Nội dung này chưa có, vui lòng <a href='https://fb.com/kingcontent.pro' target='_blank' className='text-primary underline'>BẤM VÀO ĐÂY</a> để đề xuất quản trị viên xử lý!
            </p>
          </div>
        )}
      </div>
    );
  };
  return (
    <>
      {isSearch && loading && (
        <div className="flex justify-center items-center relative">
          <div className="animate-spin rounded-full h-24 w-24 border-b-2 border-t-2 border-gray-600"></div>
          <label className="absolute top-1/3 z-10">Loading ...</label>
        </div>
      )}

      {!loading && isSearch && renderSuggestions()}
    </>
  );
};
export default Suggestions;
