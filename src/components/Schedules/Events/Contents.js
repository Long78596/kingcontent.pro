import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getEventContents,
  setIsShowFinalStep,
  setScheduleWaitingList,
  setSelectedScheduleContent,
  setShowSourceIdeasPopup,
  setSelectedEvent,
} from '../../../store/actions/Schedules';
import PostSugesstion from '../../ContentSugesstion/PostSugesstion';
import SingleContent from '../SingleContent';
// import DialogDetailPost from '../SingleContent/dialogPostDetail';
import { FaAngleLeft } from 'react-icons/fa';
import FilterForm from '../FilterForm';
import { destructSearchData } from '../Sourceldeas/utility';
import { setContentDetailToShow } from '../../../store/actions/Contents/contentActions';

const Contents = (props) => {
  const {
    event,
    isAuto = false,
    handleAddToWaitingList,
    isShowEditContentBtn,
  } = props;
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [objSelect, setObjSelect] = useState({});
  const {
    eventContents: contents = [],
    eventTotalPages: totalPages = 1,
    autoWaitingList = null,
  } = useSelector((state) => state.schedules);
  const { isLoading } = useSelector((state) => state.isLoadingApp);
  const [showFilter, setShowFilter] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentConditions, setCurrentConditions] = useState('');

  const handleActionShowPopup = (elt) => {
    dispatch(setContentDetailToShow(elt));
  };
  const handleClosePopup = () => {
    setOpen(!open);
  };

  const getMoreContents = useCallback(() => {
    const nextPage = currentPage + 1;

    dispatch(getEventContents(event.id, nextPage, currentConditions));
    setCurrentPage(nextPage);
  }, [currentPage, dispatch, event, currentConditions]);

  const handleClickGoBack = () => {
    dispatch(setSelectedEvent(null));
  };

  useEffect(() => {
    if (contents && contents.length > 0) {
      setShowFilter(true);
    } else {
      setShowFilter(false);
    }
  }, [contents]);

  const onSearch = useCallback(
    (data) => {
      const query = destructSearchData(data);
      setCurrentConditions(query);
      dispatch(getEventContents(event.event_id, 1, query));
    },
    [event, dispatch]
  );

  const handleAddToSchedule = useCallback(
    (elt) => {
      dispatch(
        setSelectedScheduleContent({
          ...elt,
          source_type: 'event',
          cat_id: event?.event_cat_id,
          is_event_content: true,
          images: elt?.medias,
        })
      );
      dispatch(setIsShowFinalStep(true));
      dispatch(setShowSourceIdeasPopup(false));
    },
    [event, dispatch]
  );

  const onSelectAll = useCallback(() => {
    dispatch(
      setScheduleWaitingList({
        ...autoWaitingList,
        contents: contents,
        source_type: 'event',
      })
    );
  }, [dispatch, autoWaitingList, contents]);

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
    if (event) {
      dispatch(getEventContents(event.id, currentPage));
    }
  }, [event]);

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
          <span>Xem tất cả sự kiện</span>
        </button>
        <h4 className="mb-2">
          Bạn đã chọn sự kiện{' '}
          <span className="text-red-500">{event?.title || ''}</span>
        </h4>
      </div>
      {/* <FilterForm onSearch={onSearch} /> */}
      {isAuto && (
        <div className="flex gap-2 items-center mb-3">
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
      <div className={`max-h-schedule-contents overflow-auto mt-3`}>
        {!showFilter && !isLoading ? (
          <div className="flex justify-center">
            <span className="font-bold">Không có dữ liệu hiển thị</span>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {contents.map((_elt, index) => (
                <SingleContent
                  content_type="event"
                  isAuto={isAuto}
                  cat_id={event?.event_cat_id}
                  handleAddToWaitingList={handleAddToWaitingList}
                  handleAddToSchedule={handleAddToSchedule}
                  handleActionShowPopup={handleActionShowPopup}
                  key={index}
                  item={_elt}
                  isShowEditContentBtn={isShowEditContentBtn}
                />
              ))}
            </div>
            {totalPages === currentPage ? null : (
              <div className="flex justify-center">
                <button
                  className={`rounded-md text-white bg-blue-400 p-3 w-1/2`}
                  onClick={(e) => getMoreContents()}
                >
                  Xem thêm
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Contents;
