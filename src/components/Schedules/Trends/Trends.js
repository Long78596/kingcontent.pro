import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actionGetTrendingContent } from '../../../store/actions/createContent';
import PostSugesstion from '../../ContentSugesstion/PostSugesstion';
import FilterForm from '../FilterForm';
import LoadingApp from '../../LoadingApp/index';
import SingleContent from '../SingleContent';
import { destructSearchData } from '../Sourceldeas/utility';
import {
  setIsShowFinalStep,
  setSelectedScheduleContent,
  setShowSourceIdeasPopup,
} from '../../../store/actions/Schedules';
import { setContentDetailToShow } from '../../../store/actions/Contents/contentActions';

const Trends = (props) => {
  const dispatch = useDispatch();
  const { trendings: contents, totalPages = 1 } = useSelector(
    (state) => state.trendings
  );
  const { isLoading } = useSelector((state) => state.isLoadingApp);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilter, setShowFilter] = useState(false);
  const [currentConditions, setCurrentConditions] = useState('');

  const handleActionShowPopup = (elt) => {
    dispatch(setContentDetailToShow(elt));
  };

  useEffect(() => {
    dispatch(actionGetTrendingContent(currentPage));
  }, []);

  const getMoreContents = useCallback(() => {
    const nextPage = currentPage + 1;
    dispatch(actionGetTrendingContent(nextPage, currentConditions));
    setCurrentPage(nextPage);
  }, [currentPage, dispatch, currentConditions]);

  useEffect(() => {
    if (contents && contents.length > 0) {
      setShowFilter(true);
    } else {
      setShowFilter(false);
    }
  }, [contents]);

  const onSearch = useCallback((data) => {
    const query = destructSearchData(data);
    setCurrentConditions(query);
    dispatch(actionGetTrendingContent(1, query));
  }, []);

  const handleAddToSchedule = useCallback(
    (elt) => {
      dispatch(
        setSelectedScheduleContent({
          ...elt,
          source_type: 'trending',
        })
      );
      dispatch(setIsShowFinalStep(true));
      dispatch(setShowSourceIdeasPopup(false));
    },
    [dispatch]
  );

  return (
    <div className="p-2">
      <FilterForm onSearch={onSearch} />
      {!showFilter && !isLoading ? (
        <div className="flex justify-center">
          <span className="font-bold">Không có dữ liệu hiển thị</span>
        </div>
      ) : isLoading ? (
        <LoadingApp />
      ) : (
        <div>
          <div
            className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2`}
          >
            {contents.map((_elt, index) => (
              <SingleContent
                handleAddToSchedule={handleAddToSchedule}
                handleActionShowPopup={handleActionShowPopup}
                key={index}
                item={_elt}
              />
            ))}
          </div>
          <div className="flex justify-center">
            <button
              className={`rounded-md text-white bg-blue-400 p-3 w-full ${
                totalPages === currentPage ? 'hidden' : ''
              }`}
              onClick={(e) => getMoreContents()}
            >
              Xem thêm
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Trends;
