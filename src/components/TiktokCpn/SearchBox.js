import React, { useCallback, useEffect, useState, Fragment } from 'react';
import { FaSearch, FaSlidersH, FaTimes } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import {
  actionChangeSearchType,
  actionGetTikTokCollections,
  actionGetTiktokChannels,
  actionGetTiktokFollowingChannels,
  actionGetTiktokVideos,
  actionGetTiktokVideosByManualLinks,
  actionUpdateCurrentKeyword,
  actionUpdateCurrentVideoType,
  actionUpdateFilteringSettings,
} from '../../store/actions/tiktok';
import { Button, Label } from 'reactstrap';
import Select from 'react-select';
import {
  lengthOptions,
  orderOptions,
  orderTypeOptions,
  videoTypeOptions,
  listDefaultKws,
  scheduledTypes,
} from './constants';
import LogoTikTok from '../../assets/images/logo-tiktok.png';
import IconTikTok from '../../assets/images/icon/main-menu/menu-icon-tiktok.png';
import IconNews from '../../assets/images/icon/schedules/news.png';
import { toast } from 'react-toastify';
import SingleChannel from './SingleChannel';
import SingleCollection from './SingleCollection';
import PerfectScrollbar from 'react-perfect-scrollbar';
import ManualLinks from './ManualLinks';

const SearchBox = (props) => {
  const { setCurrentKeyword = () => {}, isFromManagePage = false, isCreatedContent = false } = props;
  const dispatch = useDispatch();
  const [inputValue, setInputValue] = useState('');
  const [isShowAdvanced, setIsShowAdvanced] = useState(false);
  const [order, setOrder] = useState(orderOptions[0]);
  const [length, setLength] = useState(lengthOptions[0]);
  const [orderType, setOrderType] = useState(orderTypeOptions[0]);
  const [videoType, setVideoType] = useState(videoTypeOptions[0]);
  const [searchType, setSearchType] = useState('video');
  const [firstLoad, setFirstLoad] = useState(true);
  const [isShowSavedData, setIsShowSavedData] = useState(false);
  const [isShowManualLinks, setIsShowManualLinks] = useState(false);
  const [scheduledType, setScheduledType] = useState(scheduledTypes[0]);
  const [manualLinks, setManualLinks] = useState('');

  const {
    searchVideos = null,
    followingChannels = [],
    collections = [],
  } = useSelector((state) => state.tiktoks);

  const onChangeValue = (e) => {
    setInputValue(e.target.value);
    setCurrentKeyword(e.target.value);
  };

  const onSearch = async (e, tiktokLinks = '') => {
    // search video by manual links
    if (tiktokLinks) {
      setManualLinks(tiktokLinks);
      dispatch(actionChangeSearchType('video'));
      dispatch(actionGetTiktokVideosByManualLinks(tiktokLinks));
      return;
    }
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
          actionGetTiktokChannels({
            keyword: inputValue,
            offset: 0,
            search_id: 0,
          })
        );
      }
    } else {
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
      dispatch(actionGetTiktokVideos(searchValue));
      dispatch(actionChangeSearchType('video'));
    }
    // prevent default
    e.preventDefault();
  };

  useEffect(() => {
    // load trending videos when first load
    if (isFromManagePage && firstLoad) {
      onSearch({ preventDefault: () => {} });
      setFirstLoad(false);
    }
  }, [dispatch, isFromManagePage, firstLoad]);

  const onClear = (e) => {
    e.preventDefault();
    setInputValue('');
    setCurrentKeyword('');
  };

  const onClickAdvanced = () => {
    setIsShowAdvanced((state) => !state);
  };

  const onClickManualLinks = () => {
    setIsShowManualLinks((state) => !state);
  };

  const onClickConfirm = () => {
    dispatch(
      actionUpdateFilteringSettings({
        order: order?.value || 0,
        orderType: orderType?.value || 0,
        length: length?.value || 0,
        videoType: videoType?.value || 0,
        scheduledType: scheduledType.value || 0,
      })
    );
  };

  useEffect(() => {
    if (!isFromManagePage) {
      dispatch(actionGetTiktokFollowingChannels());
      dispatch(actionGetTikTokCollections());
    }
  }, [dispatch]);

  return (
    <div className="relative z-30">
      <form className="flex gap-3 pt-3 mb-3" onSubmit={onSearch}>
        {/* trending button */}
        <button
          className="w-2/12 bg-primary text-white flex justify-center items-center rounded-lg gap-3 hover:bg-primaryHover"
          type="button"
          onClick={() => onSearch({ preventDefault: () => {} })}
        >
          <img
            src={LogoTikTok}
            alt="icon-tiktok"
            className="w-7 rounded-full"
          />
          <span className="text-xs">Thịnh hành</span>
        </button>
        <div className="flex items-center w-2/3 relative">
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
          <FaSlidersH size={24} />
        </Button>
        {!isFromManagePage && (
          <Fragment>
            {/* change image to mask-image */}
            <Button
              className="w-14 h-14 hover:text-white flex justify-center items-center rounded-lg hover:bg-primaryHover border"
              onClick={() => onClickManualLinks()}
            >
              <img
                src={IconTikTok}
                alt="Thêm link thủ công"
                title="Thêm link thủ công"
                className="w-8"
              />
            </Button>
            <Button
              className="w-14 h-14 hover:text-white flex justify-center items-center rounded-lg hover:bg-primaryHover border"
              title="Nguồn đã lưu"
              onClick={() => setIsShowSavedData((state) => !state)}
            >
              <img src={IconNews} alt="icon-news" className="w-8" />
            </Button>
          </Fragment>
        )}
      </form>
      {!isFromManagePage && (
        <div
          className={`savedData transition-all ease-in-out gap-2 flex mb-4 ${
            isShowSavedData
              ? 'h-auto p-2 border rounded'
              : 'h-0 overflow-hidden'
          }`}
        >
          <PerfectScrollbar className="folowingChannels w-1/2 max-h-64">
            <Label className="font-bold uppercase">
              Danh sách kênh đã theo dõi ({followingChannels?.length || 0})
            </Label>
            {followingChannels &&
              followingChannels.length > 0 &&
              followingChannels.map((channel, index) => (
                <Fragment key={index}>
                  <SingleChannel
                    channel={channel}
                    isSchedule={!isFromManagePage}
                  />
                </Fragment>
              ))}
          </PerfectScrollbar>
          <PerfectScrollbar className="collections w-1/2 max-h-64">
            <Label className="font-bold uppercase">
              Danh sách bộ sưu tập đã lưu ({collections?.length || 0})
            </Label>
            {collections &&
              collections.length > 0 &&
              collections.map((collection, index) => (
                <Fragment key={index}>
                  <SingleCollection
                    collection={collection}
                    isSchedule={!isFromManagePage}
                  />
                </Fragment>
              ))}
          </PerfectScrollbar>
        </div>
      )}
      <div
        className={`advancedSearch transition-all ease-in-out gap-3 grid grid-cols-2 md:grid-cols-3 ${
          isShowAdvanced ? 'h-auto p-2' : 'h-0 overflow-hidden'
        } ${isCreatedContent ? '' : 'lg:grid-cols-5'}`}
      >
        <div>
          <Label>Sắp xếp</Label>
          <Select
            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block"
            options={orderOptions}
            onChange={(e) => setOrder(e)}
            defaultValue={order}
          />
        </div>
        <div>
          <Label>Thứ tự</Label>
          <Select
            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block"
            options={orderTypeOptions}
            onChange={(e) => setOrderType(e)}
            defaultValue={orderType}
          />
        </div>
        <div>
          <Label>Lọc video</Label>
          <Select
            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block"
            options={lengthOptions}
            onChange={(e) => setLength(e)}
            defaultValue={length}
          />
        </div>
        <div>
          <Label>Kích thước</Label>
          <Select
            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block"
            options={videoTypeOptions}
            onChange={(e) => setVideoType(e)}
            defaultValue={videoType}
          />
        </div>
        <div>
          <Label>Lọc trùng</Label>
          <Select
            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block"
            options={scheduledTypes}
            onChange={(e) => setScheduledType(e)}
            defaultValue={scheduledType}
          />
        </div>
        <div className="actions focus-within:w-full mt-2 flex gap-2">
          <Button
            className="border-2 border-gray-200 bg-gray-100 hover:bg-blue-50 py-3 px-4 text-gray-500 rounded-md"
            onClick={() => onClickAdvanced()}
          >
            Đóng
          </Button>
          <Button
            className="border-2 border-gray-200 bg-primary hover:bg-primaryHover py-3 px-4 text-white rounded-md"
            onClick={() => onClickConfirm()}
          >
            Xác nhận
          </Button>
        </div>
      </div>
      <ManualLinks
        open={isShowManualLinks}
        setOpen={onClickManualLinks}
        setManualLinks={setManualLinks}
        onSearch={onSearch}
        setSearchType={setSearchType}
      />
    </div>
  );
};

export default SearchBox;
