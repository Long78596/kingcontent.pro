import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actionGetSpecialContents } from '../../../store/actions/createContent';
import PostSugesstion from '../../ContentSugesstion/PostSugesstion';
import FilterForm from '../FilterForm';
import SingleContent from '../SingleContent';
import { destructSearchData } from '../Sourceldeas/utility';
import {
  setIsShowFinalStep,
  setScheduleWaitingList,
  setSelectedScheduleContent,
  setShowSourceIdeasPopup,
} from '../../../store/actions/Schedules';
import LoadingApp from '../../LoadingApp';
import { setContentDetailToShow } from '../../../store/actions/Contents/contentActions';

const Specials = (props) => {
  const { isAuto = false, handleAddToWaitingList = () => {} } = props;
  const dispatch = useDispatch();
  const { contents, totalPages = 1 } = useSelector(
    (state) => state.specialContents
  );
  const { isLoading } = useSelector((state) => state.isLoadingApp);
  const { autoWaitingList = null, editingContents = [] } = useSelector(
    (state) => state.schedules
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [showFilter, setShowFilter] = useState(false);
  const [currentConditions, setCurrentConditions] = useState('');

  const handleActionShowPopup = (item) => {
    let postText = item?.post_text || '';
    if (editingContents && editingContents.length > 0) {
      const search = editingContents.find((elt) => elt?.id === item?.post_id);
      if (search) {
        postText = search?.text;
      }
    }
    dispatch(
      setContentDetailToShow({
        ...item,
        post_text: postText,
      })
    );
  };

  const getMoreContents = () => {
    const nextPage = currentPage + 1;
    dispatch(actionGetSpecialContents(nextPage, currentConditions));
    setCurrentPage(nextPage);
  };

  const onSearch = (data) => {
    const query = destructSearchData(data);
    setCurrentConditions(query);
    dispatch(actionGetSpecialContents(1, query));
  };

  const handleAddToSchedule = (elt) => {
    dispatch(
      setSelectedScheduleContent({
        ...elt,
        source_type: 'special',
      })
    );
    dispatch(setIsShowFinalStep(true));
    dispatch(setShowSourceIdeasPopup(false));
  };

  const onSelectAll = () => {
    dispatch(
      setScheduleWaitingList({
        ...autoWaitingList,
        contents: contents,
        source_type: 'special',
      })
    );
  };

  const onUnSelectAll = () => {
    // push empty contents
    dispatch(
      setScheduleWaitingList({
        ...autoWaitingList,
        contents: [],
      })
    );
  };

  useEffect(() => {
    dispatch(actionGetSpecialContents(currentPage));
  }, []);

  useEffect(() => {
    if (contents && contents.length > 0) {
      setShowFilter(true);
    } else {
      setShowFilter(false);
    }
  }, [contents]);

  return (
    <div className="p-2">
      <FilterForm onSearch={onSearch} isSpecial={true} isSchedule={true} />
      {!showFilter && !isLoading ? (
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
            style={{
              minHeight: '250px',
            }}
          >
            {contents.map((_elt, index) => (
              <SingleContent
                isAuto={isAuto}
                handleAddToWaitingList={handleAddToWaitingList}
                content_type="special"
                handleAddToSchedule={handleAddToSchedule}
                handleActionShowPopup={handleActionShowPopup}
                key={index}
                item={_elt}
              />
            ))}
          </div>
          <button
            className={`rounded-md w-full text-white bg-blue-400 p-3 col-span-2 ${
              totalPages === currentPage ? 'hidden' : ''
            }`}
            onClick={(e) => getMoreContents()}
          >
            Xem thêm
          </button>
        </>
      )}
    </div>
  );
};

export default Specials;
