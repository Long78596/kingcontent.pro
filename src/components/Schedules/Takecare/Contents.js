import { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getSuggestionSystemContents,
  setIsShowFinalStep,
  setScheduleWaitingList,
  setSelectedScheduleContent,
  setShowSourceIdeasPopup,
} from '../../../store/actions/Schedules';
import SingleContent from '../SingleContent';
import { FaAngleLeft } from 'react-icons/fa';
import FilterForm from '../FilterForm';
import { destructSearchData } from '../Sourceldeas/utility';
import { setContentDetailToShow } from '../../../store/actions/Contents/contentActions';

const Contents = (props) => {
  const {
    cate,
    setSelectedCat,
    isAuto = false,
    handleAddToWaitingList,
  } = props;

  const dispatch = useDispatch();
  const {
    suggestionsContent: contents = [],
    suggestionsTotalPages: totalPages = 1,
    suggestionsCurrentPage: currentPage = 1,
    autoWaitingList = null,
  } = useSelector((state) => state.schedules);

  const { isLoading } = useSelector((state) => state.isLoadingApp);
  const [showFilter, setShowFilter] = useState(false);
  const [currentConditions, setCurrentConditions] = useState('');

  const handleActionShowPopup = (elt) => {
    dispatch(setContentDetailToShow(elt));
  };

  const getMoreContents = () => {
    const nextPage = currentPage + 1;
    dispatch(
      getSuggestionSystemContents(cate?.cate_id, nextPage, currentConditions)
    );
  };

  const handleClickGoBack = () => {
    setSelectedCat(null);
  };

  const onSearch = (data) => {
    const query = destructSearchData(data);
    setCurrentConditions(query);
    dispatch(getSuggestionSystemContents(cate?.cate_id, 1, query));
  };

  const handleAddToSchedule = (elt) => {
    dispatch(
      setSelectedScheduleContent({
        ...elt,
        source_type: 'system',
        cat_id: cate?.cate_id,
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
        source_type: 'system',
        cat_id: cate?.cate_id,
      })
    );
  };

  const onUnSelectAll = () => {
    dispatch(
      setScheduleWaitingList({
        ...autoWaitingList,
        contents: [],
      })
    );
  };

  useEffect(() => {
    if (cate) {
      dispatch(getSuggestionSystemContents(cate?.cate_id, currentPage));
    }
  }, [cate]);

  useEffect(() => {
    if (contents && contents.length > 0) {
      setShowFilter(true);
    } else {
      setShowFilter(false);
    }
  }, [contents]);

  return (
    <div className="p-2">
      <div className="flex gap-2 items-center">
        <button
          className="mb-2 flex gap-1 border-2 rounded-md p-2"
          onClick={(e) => {
            handleClickGoBack();
          }}
        >
          <FaAngleLeft fontSize={20} />
          <span>Quay lại</span>
        </button>
        <h4 className="mb-2">
          Bạn đã chọn danh mục{' '}
          <span className="text-red-500">{cate?.cate_name || ''}</span>
        </h4>
      </div>
      <FilterForm onSearch={onSearch} />
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
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2`}>
        {!showFilter && !isLoading ? (
          <div className="flex justify-center">
            <span className="font-bold">Không có dữ liệu hiển thị</span>
          </div>
        ) : (
          <Fragment>
            {contents.map((_elt, index) => (
              <Fragment key={index}>
                <SingleContent
                  content_type="system"
                  isAuto={isAuto}
                  cat_id={cate?.cate_id}
                  handleAddToWaitingList={handleAddToWaitingList}
                  handleAddToSchedule={handleAddToSchedule}
                  handleActionShowPopup={handleActionShowPopup}
                  item={_elt}
                />
              </Fragment>
            ))}
          </Fragment>
        )}
      </div>
      <div className="flex justify-center">
        <button
          className={`rounded-md w-1/2 text-white bg-blue-400 p-3 col-span-2 ${
            totalPages === currentPage ? 'hidden' : ''
          }`}
          onClick={(e) => getMoreContents()}
        >
          Xem thêm
        </button>
      </div>
    </div>
  );
};

export default Contents;
