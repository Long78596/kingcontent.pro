import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import DialogDetailPost from '../SingleContent/dialogPostDetail';
import { getLikedData } from '../../../store/actions/user';
import SingleContent from '../SingleContent';
import SearchForm from '../SearchForm';
import LoadingApp from '../../LoadingApp/index';
import {
  setIsShowFinalStep,
  setScheduleWaitingList,
  setSelectedScheduleContent,
  setShowSourceIdeasPopup,
} from '../../../store/actions/Schedules';
import { setContentDetailToShow } from '../../../store/actions/Contents/contentActions';
const limit = 8;

const Liked = (props) => {
  const { isAuto = false, handleAddToWaitingList = () => {} } = props;
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.isLoadingApp);
  const { likedContents: contents = null } = useSelector(
    (state) => state.userReducer
  );
  const { autoWaitingList } = useSelector((state) => state.schedules);
  const [filteredContents, setFilteredContents] = useState([]);
  const [paginatedContents, setPaginatedContents] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    // check has more by comparing current page with total page
    setHasMore(page < totalPage);
  }, [page, totalPage]);

  // only show 8 items per page
  useEffect(() => {
    if (filteredContents && filteredContents.length > 0) {
      const start = (page - 1) * limit;
      const end = page * limit;
      const slicedData = filteredContents.slice(start, end);
      // append to paginatedContents when page > 1
      if (page > 1) {
        setPaginatedContents([...paginatedContents, ...slicedData]);
      } else {
        setPaginatedContents(slicedData);
      }
    }
  }, [filteredContents, page]);

  const handleActionShowPopup = (elt) => {
    dispatch(setContentDetailToShow(elt));
  };

  const onSearch = (data, isObject = true) => {
    let currentKw = '';
    let currentHashtag = '';
    if (isObject) {
      currentKw = data?.keyword || '';
      currentHashtag = data?.hashtag || '';
    } else {
      currentKw = data;
      currentHashtag = '';
    }
    if (currentKw || currentHashtag) {
      let newFilteredContents = contents;
      // check if keyword is not empty
      if (currentKw) {
        newFilteredContents = newFilteredContents.filter((item) => {
          const { content = null } = item;
          if (content) {
            return content.post_text
              .toLowerCase()
              .includes(currentKw.toLowerCase());
          }
          return false;
        });
      }
      // check if hashtag is not empty
      if (currentHashtag) {
        newFilteredContents = newFilteredContents.filter((item) => {
          const { hashtag = '' } = item;
          if (hashtag) {
            return hashtag.toLowerCase().includes(currentHashtag.toLowerCase());
          }
          return false;
        });
      }
      // update total page
      setTotalPage(Math.ceil(newFilteredContents.length / limit));
      // reset page to 1
      setPage(1);
      setFilteredContents(newFilteredContents);
    } else {
      // reset total page
      setTotalPage(Math.ceil(contents.length / limit));
      // reset page to 1
      setPage(1);
      setFilteredContents(contents);
    }
  };

  const handleAddToSchedule = useCallback(
    (elt, catId = 0) => {
      dispatch(
        setSelectedScheduleContent({
          ...elt,
          source_type: 'system',
          cat_id: catId,
        })
      );
      dispatch(setIsShowFinalStep(true));
      dispatch(setShowSourceIdeasPopup(false));
    },
    [dispatch]
  );

  const onSelectAll = useCallback(() => {
    let pushContents = [];
    if (filteredContents && filteredContents.length > 0) {
      pushContents = filteredContents.reduce((acc, item, idx) => {
        const { content = null, cate_id = 0 } = item;
        acc.push(content);
        return acc;
      }, []);
    }
    dispatch(
      setScheduleWaitingList({
        ...autoWaitingList,
        contents: pushContents,
        source_type: 'liked',
      })
    );
  }, [dispatch, autoWaitingList, filteredContents]);

  const onUnSelectAll = useCallback(() => {
    // push empty contents
    dispatch(
      setScheduleWaitingList({
        ...autoWaitingList,
        contents: [],
      })
    );
  }, [dispatch, autoWaitingList]);

  useEffect(() => {
    if (contents === null) {
      dispatch(getLikedData());
    }
  }, [contents]);

  useEffect(() => {
    if (contents && contents.length > 0) {
      setTotalPage(Math.ceil(contents.length / limit));
      setFilteredContents(contents);
    } else {
      setFilteredContents([]);
    }
  }, [contents]);

  return (
    <div>
      <SearchForm onSearch={onSearch} hashtag={1} contents={contents} />
      {filteredContents.length === 0 && !isLoading ? (
        <div className="flex justify-center">
          <span className="font-bold">Không có dữ liệu hiển thị</span>
        </div>
      ) : isLoading ? (
        <LoadingApp />
      ) : (
        <>
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
          <div
            className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2`}
          >
            {paginatedContents.map((_elt, index) => {
              const { content = null, cate_id = 0, hashtag = '' } = _elt;
              return (
                <SingleContent
                  handleAddToSchedule={handleAddToSchedule}
                  handleActionShowPopup={handleActionShowPopup}
                  key={index}
                  item={content}
                  cat_id={cate_id}
                  isAuto={isAuto}
                  handleAddToWaitingList={handleAddToWaitingList}
                  content_type="liked"
                  hashtag={hashtag}
                />
              );
            })}
          </div>
          {hasMore && (
            <div className="flex justify-center mt-2">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-1/5"
                onClick={() => setPage(page + 1)}
              >
                Xem thêm
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Liked;
