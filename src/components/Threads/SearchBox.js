import React, { useCallback, useEffect, useState } from 'react';
import { FaSearch, FaSlidersH, FaTimes } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import {
  actionChangeSearchType,
  actionGetThreadsChannels,
  actionGetThreadsVideos,
  actionUpdateCurrentKeyword,
  actionUpdateCurrentVideoType,
  actionUpdateFilteringSettings,
  ACTION_GET_THREADS_VIDEOS_SUCCESS,
  ACTION_FILTER_STATUS_VIDEOS_SUCCESS,
  ACTION_FILTER_THREADS_VIDEOS_SUCCESS,
} from '../../store/actions/threads';
import { Button, Label } from 'reactstrap';
import Select from 'react-select';
import {
  lengthOptions,
  orderOptions,
  orderTypeOptions,
  videoTypeOptions,
  listDefaultKws,
  commentTypeOptions,
  shareTypeOptions,
  scheduleOptions,
} from './constants';
import { toast } from 'react-toastify';
import IconThreads from '../../assets/images/threads-thumbnail.png';

const SearchBox = (props) => {
  const { setCurrentKeyword = () => {}, isSchedule = false } = props;
  const dispatch = useDispatch();
  const [inputValue, setInputValue] = useState('');
  const [isShowAdvanced, setIsShowAdvanced] = useState(false);
  const [order, setOrder] = useState(orderOptions[0]);
  const [length, setLength] = useState(lengthOptions[0]);
  const [orderType, setOrderType] = useState(orderTypeOptions[0]);
  const [videoType, setVideoType] = useState(videoTypeOptions[0]);
  const [searchType, setSearchType] = useState('video');
  const [searchData, setSearchData] = useState({
    media_type: '',
    likes: '',
    comments: '',
    reposts: '',
    is_reels: '',
  });
  const [hasNoData, setHasNoData] = useState(false);

  const {
    searchVideos = null,
    filterData,
    isFilter = false,
  } = useSelector((state) => state.threads);

  const { scheduledContents = [] } = useSelector((state) => state.schedules);

  useEffect(() => {
    // check if no data on searchVideos || filterData
    if (
      (!searchVideos || searchVideos?.videos?.length === 0) &&
      isFilter === false
    ) {
      setHasNoData(true);
    } else {
      setHasNoData(false);
    }
  }, [searchVideos]);

  useEffect(() => {
    // load trending videos when first load
    if (hasNoData) {
      onSearch({ preventDefault: () => {} });
    }
  }, [hasNoData]);

  useEffect(() => {
    if (isFilter === false) {
      // reset all Select to default value
      setOrder(orderOptions[0]);
      setLength(lengthOptions[0]);
      setOrderType(orderTypeOptions[0]);
      setVideoType(videoTypeOptions[0]);
    }
  }, [isFilter]);

  const onChangeValue = (e) => {
    setInputValue(e.target.value);
    setCurrentKeyword(e.target.value);
  };

  const onSearch = async (e) => {
    dispatch({
      type: ACTION_FILTER_STATUS_VIDEOS_SUCCESS,
      payload: false,
    });
    if (searchType === 'channel') {
      if (!inputValue) {
        e.preventDefault();
        // show message
        toast.error('Vui lòng nhập nội dung tìm kiếm');
        return;
      } else {
        dispatch(actionUpdateCurrentKeyword(inputValue));
        dispatch(actionChangeSearchType('channel'));
        // call action to search channel
        dispatch(
          actionGetThreadsChannels({
            keyword: inputValue,
            offset: 0,
            search_id: 0,
          })
        );
      }
    } else {
      dispatch(actionChangeSearchType('video'));
      e.preventDefault();
      let searchValue = inputValue;
      if (!searchValue) {
        dispatch(
          actionUpdateCurrentVideoType({
            type: 'trending',
            channel_id: '',
            name: 'Đang thịnh hành',
          })
        );
        searchValue =
          listDefaultKws[Math.floor(Math.random() * listDefaultKws.length)];
        setCurrentKeyword(searchValue);
        dispatch(actionUpdateCurrentKeyword(searchValue));
      } else {
        dispatch(
          actionUpdateCurrentVideoType({
            type: 'keyword',
            channel_id: '',
            name: searchValue,
          })
        );
        dispatch(actionUpdateCurrentKeyword(searchValue));
      }
      dispatch(actionGetThreadsVideos(searchValue));
      dispatch(actionChangeSearchType('video'));
    }
    // prevent default
    e.preventDefault();
  };

  const onTrending = (e) => {
    e.preventDefault();
    setInputValue('');
    setCurrentKeyword('');
    dispatch(actionUpdateCurrentKeyword(''));
    onSearch(e);
  };

  const onChangeFilter = (type, data) => {
    setSearchData({
      ...searchData,
      [type]: data.value,
    });
    if (data.value === 0) {
      dispatch({
        type: ACTION_FILTER_STATUS_VIDEOS_SUCCESS,
        payload: false,
      });
      return;
    }
    dispatch({
      type: ACTION_FILTER_STATUS_VIDEOS_SUCCESS,
      payload: true,
    });
    let newData = searchVideos.videos;

    switch (type) {
      case 'media_type':
        newData = newData.filter((elt) => elt?.media_type === data.value);
        break;

      case 'likes':
      case 'comments':
      case 'reposts':
        newData = newData.sort((a, b) => {
          return data.value === 1 ? a[type] - b[type] : b[type] - a[type];
        });
        break;

      case 'is_reels':
        newData = newData.filter(
          (elt) => elt?.media_type === 'video' && data.value
        );
        break;

      case 'schedule':
        newData = newData.filter((elt) => {
          const search = scheduledContents.find(
            (item) =>
              item?.content_id === elt?.code && item?.source_type === 'threads'
          );
          return data.value === 1 ? !search : search;
        });
        break;

      default:
        newData = newData.sort((a, b) => {
          return data.value === 1 ? a[type] - b[type] : b[type] - a[type];
        });
        break;
    }

    dispatch({
      type: ACTION_FILTER_THREADS_VIDEOS_SUCCESS,
      payload: newData,
    });
  };

  const onClear = (e) => {
    e.preventDefault();
    setInputValue('');
    setCurrentKeyword('');
  };

  const onClickAdvanced = () => {
    setIsShowAdvanced((state) => !state);
  };

  const onClickConfirm = () => {
    dispatch(
      actionUpdateFilteringSettings({
        order: order?.value || 0,
        orderType: orderType?.value || 0,
        length: length?.value || 0,
        videoType: videoType?.value || 0,
      })
    );
  };

  return (
    <div>
      <form
        className="flex justify-between gap-2 pt-3 mb-3"
        onSubmit={onSearch}
      >
        {/* trending button */}
        <button
          className="w-2/12 bg-primary text-white flex justify-center items-center rounded-lg gap-3 hover:bg-primaryHover"
          type="button"
          onClick={(e) => onTrending(e)}
        >
          <img src={IconThreads} alt="icon-threads" className="w-7" />
          <span className="text-xs">Thịnh hành</span>
        </button>
        <div className="flex items-center relative w-full">
          <input
            className="w-full h-14 rounded-md border-gray-300 outline-none p-2 border"
            placeholder="Nhập nội dung tìm kiếm"
            value={inputValue}
            onChange={onChangeValue}
          />
          {inputValue !== '' ? (
            <button
              className="w-14 h-14 text-red-600 flex justify-center items-center rounded-lg hover:bg-gray-200 absolute right-1"
              type="button"
              onClick={onClear}
            >
              <FaTimes size={20} />
            </button>
          ) : null}
        </div>
        {/* add 2 radio option: channel or video */}
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              id="video"
              name="searchType"
              value="video"
              defaultChecked={searchType === 'video'}
              className="h-5 w-5"
              onChange={(e) => setSearchType(e.target.value)}
            />
            <label htmlFor="video" className="flex gap-2 w-16">
              Bài đăng{' '}
            </label>
          </div>
          <div className="flex items-center gap-2 cursor-pointer">
            <label htmlFor="channel" className="flex gap-2">
              <input
                type="radio"
                id="channel"
                name="searchType"
                value="channel"
                className="h-5 w-5"
                defaultChecked={searchType === 'channel'}
                onChange={(e) => setSearchType(e.target.value)}
              />{' '}
              Kênh
            </label>
          </div>
          <Button
            className="w-20 h-14 bg-primary text-white flex justify-center items-center rounded-lg hover:bg-primaryHover"
            onClick={(e) => onSearch(e)}
          >
            <FaSearch size={20} />
          </Button>
          <Button
            className="w-14 h-14 hover:text-white flex justify-center items-center rounded-lg hover:bg-primaryHover border"
            onClick={() => onClickAdvanced()}
          >
            <FaSlidersH size={20} />
          </Button>
        </div>
      </form>

      <div
        className={`advancedSearch transition-all ease-in-out gap-2 grid grid-cols-2 lg:grid-cols-5 ${
          isShowAdvanced ? 'h-auto p-2 z-20 relative' : 'h-0 overflow-hidden'
        }`}
      >
        <div>
          <Label>Định dạng</Label>
          <Select
            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block"
            options={orderOptions}
            onChange={(e) => onChangeFilter('media_type', e)}
            defaultValue={order}
          />
        </div>
        {/* <div>
          <Label>Sắp xếp</Label>
          <Select
            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block"
            options={orderOptions}
            onChange={(e) => setOrder(e)}
            defaultValue={order}
          />
        </div> */}
        <div>
          <Label>Lượt tim</Label>
          <Select
            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block"
            options={orderTypeOptions}
            onChange={(e) => onChangeFilter('likes', e)}
            defaultValue={orderType}
          />
        </div>
        <div>
          <Label>Bình luận</Label>
          <Select
            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block"
            options={commentTypeOptions}
            onChange={(e) => onChangeFilter('comments', e)}
            defaultValue={length}
          />
        </div>
        {!isSchedule && (
          <div>
            <Label>Lượt đăng lại</Label>
            <Select
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block"
              options={shareTypeOptions}
              onChange={(e) => onChangeFilter('reposts', e)}
              defaultValue={length}
            />
          </div>
        )}
        <div>
          <Label>Video chuẩn reels</Label>
          <Select
            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block"
            options={videoTypeOptions}
            onChange={(e) => onChangeFilter('is_reels', e)}
            defaultValue={videoType}
          />
        </div>
        {isSchedule && (
          <div>
            <Label>Lọc trùng lịch</Label>
            <Select
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block"
              options={scheduleOptions}
              defaultValue={scheduleOptions[0]}
              onChange={(e) => onChangeFilter('schedule', e)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBox;
