import React, { useCallback, useEffect, useState } from 'react';
import { FaSearch, FaSlidersH, FaTimes } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { toast } from 'react-toastify';
import { Button, Label } from 'reactstrap';
import IconTikTok from '../../assets/images/icon/tiktok.png';
import {
  ACTION_FILTER_DOUYIN_VIDEOS_SUCCESS,
  ACTION_FILTER_STATUS_DOUYIN_VIDEOS_SUCCESS,
  actionChangeSearchType,
  actionGetDouyinChannels,
  actionGetDouyinVideos,
  actionUpdateCurrentKeyword,
  actionUpdateCurrentVideoType,
  actionUpdateFilteringSettings,
} from '../../store/actions/douyin';
import {
  commentTypeOptions,
  orderTypeOptions,
  scheduleOptions,
  shareTypeOptions,
} from '../Threads/constants';
import { lengthOptions, listDefaultKws } from './constants';

const SearchBox = (props) => {
  const { setCurrentKeyword = () => {}, isSchedule = false } = props;
  const dispatch = useDispatch();
  const [inputValue, setInputValue] = useState('');
  const [isShowAdvanced, setIsShowAdvanced] = useState(false);
  // const [order, setOrder] = useState(threadsOrderOptions[0]);
  const [length, setLength] = useState(lengthOptions[0]);
  // const [orderType, setOrderType] = useState(orderTypeOptions[0]);
  // const [videoType, setVideoType] = useState(videoTypeOptions[0]);
  const [searchType, setSearchType] = useState('video');
  const [hasNoData, setHasNoData] = useState(false);

  const [searchData, setSearchData] = useState({
    media_type: '',
    likes: '',
    comments: '',
    reposts: '',
    is_reels: '',
  });

  const videoTypeOptions = [
    {
      label: 'Tất cả',
      value: 0,
    },
    {
      label: 'Chuẩn Reels (nhỏ nhất 540x960)',
      value: 1,
    },
    {
      label: 'Không chuẩn Reels',
      value: 2,
    },
  ];
  const {
    searchVideos = null,
    filteringSettings,
    searchChannels = null,
    currentCollection = null,
    isLoading = false,
  } = useSelector((state) => state.douyins);

  const { scheduledContents = [] } = useSelector((state) => state.schedules);

  const onChangeValue = (e) => {
    setInputValue(e.target.value);
    setCurrentKeyword(e.target.value);
  };

  const onSearch = async (e) => {
    // change search by type
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
          actionGetDouyinChannels({
            keyword: inputValue,
            offset: 0,
            search_id: 0,
          })
        );
      }
    } else {
      e.preventDefault();
      let searchValue = inputValue;
      dispatch(
        actionUpdateFilteringSettings({
          ...filteringSettings,
          isFilter: false,
        })
      );
      if (!searchValue) {
        dispatch(
          actionUpdateCurrentVideoType({
            type: 'trending',
            channel_id: '',
            name: 'Đang thịnh hành',
          })
        );
        // searchValue = listDefaultKws[Math.floor(Math.random() * listDefaultKws.length)];
        searchValue = '';
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
      dispatch(actionGetDouyinVideos(searchValue));
      dispatch(actionChangeSearchType('video'));
    }
    // prevent default
    e.preventDefault();
  };

  useEffect(() => {
    // check if no data on searchVideos || searchChannels || currentCollection
    if (
      !isLoading &&
      (!searchVideos || searchVideos?.videos?.length === 0) &&
      (!searchChannels || searchChannels?.users?.length === 0) &&
      !currentCollection
    ) {
      setHasNoData(true);
    } else {
      setHasNoData(false);
    }
  }, [searchVideos, searchChannels, currentCollection]);

  useEffect(() => {
    // load trending videos when first load
    if (hasNoData) {
      onSearch({ preventDefault: () => {} });
    }
  }, [hasNoData]);

  const onClear = (e) => {
    e.preventDefault();
    setInputValue('');
    setCurrentKeyword('');
  };

  const onClickAdvanced = useCallback(() => {
    setIsShowAdvanced((state) => !state);
  }, []);

  const onChangeFilter = (type, data) => {
    dispatch(
      actionUpdateFilteringSettings({
        lastType: type,
        isFilter: true,
      })
    );
    setSearchData({
      ...searchData,
      [type]: data.value,
    });
    if (data.value === 0) {
      dispatch({
        type: ACTION_FILTER_STATUS_DOUYIN_VIDEOS_SUCCESS,
        payload: false,
      });
      return;
    }
    switch (type) {
      case 'is_reels':
        const isReelsNewData = searchVideos.videos.filter((item) => {
          return data.value === 1 ? item.is_reels : !item.is_reels;
        });
        dispatch({
          type: ACTION_FILTER_STATUS_DOUYIN_VIDEOS_SUCCESS,
          payload: true,
        });
        dispatch({
          type: ACTION_FILTER_DOUYIN_VIDEOS_SUCCESS,
          payload: isReelsNewData,
        });
        break;

      case 'duration':
        const newDataDuration = searchVideos.videos.filter((item) => {
          switch (data.value) {
            case 1: // less than 60s
              return item.duration < 60;
            case 2: // 3-5 mins
              return item.duration >= 180 && item.duration <= 300;
            case 3: // more than 5 mins
              return item.duration > 300;
            default:
              return true;
          } // end switch
        });
        dispatch({
          type: ACTION_FILTER_STATUS_DOUYIN_VIDEOS_SUCCESS,
          payload: true,
        });
        dispatch({
          type: ACTION_FILTER_DOUYIN_VIDEOS_SUCCESS,
          payload: newDataDuration,
        });
        break;

      case 'schedule':
        const newDataSchedule = searchVideos.videos.filter((item) => {
          const search = scheduledContents.find(
            (elt) =>
              elt?.content_id === item?.video_id &&
              elt?.source_type === 'douyin'
          );
          return data.value === 1 ? !search : search;
        });
        dispatch({
          type: ACTION_FILTER_STATUS_DOUYIN_VIDEOS_SUCCESS,
          payload: true,
        });
        dispatch({
          type: ACTION_FILTER_DOUYIN_VIDEOS_SUCCESS,
          payload: newDataSchedule,
        });
        break;

      default:
        const newData = searchVideos.videos.sort((a, b) => {
          return data.value === 1 ? a[type] - b[type] : b[type] - a[type];
        });
        dispatch({
          type: ACTION_FILTER_STATUS_DOUYIN_VIDEOS_SUCCESS,
          payload: true,
        });
        dispatch({
          type: ACTION_FILTER_DOUYIN_VIDEOS_SUCCESS,
          payload: newData,
        });
        break;
    }
  };

  useEffect(() => {
    dispatch(
      actionUpdateCurrentVideoType({
        type: searchType,
      })
    );
  }, [searchType]);

  return (
    <div>
      <form className="flex gap-3 pt-3 mb-3" onSubmit={onSearch}>
        {/* trending button */}
        <button
          className="w-2/12 bg-primary text-white flex justify-center items-center rounded-lg gap-1 hover:bg-primaryHover"
          type="button"
          onClick={() => onSearch({ preventDefault: () => {} })}
        >
          <img src={IconTikTok} alt="icon-tiktok" className="w-14" />
          <span className="text-xs">Thịnh hành</span>
        </button>
        <div className="flex items-center w-2/3 relative">
          <input
            className="w-full h-14 rounded-md border-gray-300 outline-none p-2 border placeholder-red-600 font-bold"
            placeholder="Vui lòng nhập từ khóa bằng tiếng TRUNG hoặc tiếng ANH để tìm kết quả tốt nhất"
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
        <div className="flex items-center gap-2 cursor-pointer">
          <label htmlFor="video" className="flex gap-2">
            <input
              type="radio"
              id="video"
              name="searchType"
              value="video"
              defaultChecked={searchType === 'video'}
              className="h-5 w-5"
              onChange={(e) => setSearchType(e.target.value)}
            />
            Video
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
      </form>
      <div
        className={`advancedSearch transition-all ease-in-out gap-2 grid grid-cols-2 lg:grid-cols-5 ${
          isShowAdvanced ? 'h-auto p-2 relative z-20' : 'h-0 overflow-hidden'
        }`}
      >
        <div>
          <Label>Lượt tim</Label>
          <Select
            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block"
            options={orderTypeOptions}
            onChange={(e) => onChangeFilter('likes', e)}
          />
        </div>
        <div>
          <Label>Bình luận</Label>
          <Select
            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block"
            options={commentTypeOptions}
            onChange={(e) => onChangeFilter('comments', e)}
          />
        </div>
        {!isSchedule && (
          <div>
            <Label>Lượt chia sẻ</Label>
            <Select
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block"
              options={shareTypeOptions}
              onChange={(e) => onChangeFilter('shares', e)}
            />
          </div>
        )}
        <div>
          <Label>Thời gian</Label>
          <Select
            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block"
            options={lengthOptions}
            onChange={(e) => onChangeFilter('duration', e)}
          />
        </div>
        <div>
          <Label>Video chuẩn reels</Label>
          <Select
            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block"
            options={videoTypeOptions}
            onChange={(e) => onChangeFilter('is_reels', e)}
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
