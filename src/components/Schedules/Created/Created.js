import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SearchForm from '../SearchForm';
import SingleContent from '../SingleContent';
import {
  setIsShowFinalStep,
  setScheduleWaitingList,
  setSelectedScheduleContent,
  setShowSourceIdeasPopup,
} from '../../../store/actions/Schedules';
import { FaLongArrowAltLeft } from 'react-icons/fa';
import LoadingApp from '../../LoadingApp';
import { setContentDetailToShow } from '../../../store/actions/Contents/contentActions';

const Created = (props) => {
  const {
    isAuto = false,
    handleAddToWaitingList = () => {},
    userContents = [],
    goBack = () => {},
    selectedPlan = {},
  } = props;
  const dispatch = useDispatch();

  const [filteredContents, setFilteredContents] = useState([]);
  const { autoWaitingList = [], isLoadingUserContents } = useSelector((state) => state.schedules);

  const handleActionShowPopup = (elt) => {
    dispatch(setContentDetailToShow(elt));
  };

  const onSearch = (data, isObject = true) => {
    const { keyword = '', videoType = 0 } = data;
    const currentKw = isObject ? keyword : data;
    let newFilteredContents = userContents;
    if (currentKw) {
      newFilteredContents = userContents.filter((_elt) => {
        const { label = null } = _elt;
        return (
          _elt?.post_text.toLowerCase().includes(currentKw.toLowerCase()) ||
          _elt?.note?.toLowerCase().includes(currentKw.toLowerCase()) ||
          label?.name?.toLowerCase().includes(currentKw.toLowerCase())
        );
      });
    }
    switch (videoType) {
      case 1:
        newFilteredContents = newFilteredContents.filter((_elt) => {
          return _elt?.media_type === 'video' && (_elt?.is_reels === 1 || _elt?.is_reels === true); 
        });
        break;

      case 2:
        newFilteredContents = newFilteredContents.filter((_elt) => {
          return _elt?.media_type === 'video' && (_elt?.is_reels === 0 || _elt?.is_reels === false); 
        });
        break;

      default:
        break;
    }
    setFilteredContents(newFilteredContents);
  };

  const handleAddToSchedule = useCallback(
    (elt) => {
      dispatch(
        setSelectedScheduleContent({
          ...elt,
          source_type: 'user',
        })
      );
      dispatch(setIsShowFinalStep(true));
      dispatch(setShowSourceIdeasPopup(false));
    },
    [dispatch]
  );

  const onSelectAll = () => {
    dispatch(
      setScheduleWaitingList({
        ...autoWaitingList,
        contents: filteredContents,
        source_type: 'user',
      })
    );
  };

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
    if (userContents && userContents.length > 0) {
      setFilteredContents(userContents);
    } else {
      setFilteredContents([]);
    }
  }, [userContents]);

  return (
    <div>
      {/* goback */}
      <div className="flex items-center mb-2">
        <button
          className="border-2 border-gray-200 bg-red-500 hover:bg-red-300 py-3 px-4 text-white rounded-md mr-3 flex gap-2 items-center"
          onClick={goBack}
        >
          <FaLongArrowAltLeft />
          <span>Chọn kế hoạch khác</span>
        </button>
        <p>
          Bạn đã chọn kế hoạch:{' '}
          <span className="font-bold italic text-base">
            {selectedPlan?.name}
          </span>
        </p>
      </div>

      <SearchForm onSearch={onSearch} isCreated={true} />
      {filteredContents.length === 0 && !isLoadingUserContents ? (
        <div className="flex justify-center">
          <span className="font-bold">Không có dữ liệu hiển thị</span>
        </div>
      ) : isLoadingUserContents ? (
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
            {filteredContents.map((_elt, index) => (
              <SingleContent
                isAuto={isAuto}
                handleAddToWaitingList={handleAddToWaitingList}
                content_type="user"
                handleAddToSchedule={handleAddToSchedule}
                handleActionShowPopup={handleActionShowPopup}
                key={index}
                item={_elt}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Created;
