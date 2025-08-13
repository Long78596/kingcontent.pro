import { useDispatch, useSelector } from 'react-redux';
import SearchBox from '../../TiktokCpn/SearchBox';
import Card from '../../TiktokCpn/Card';
import React, { Fragment, useCallback, useEffect, useState } from 'react';
import SingleTiktokContent from '../SingleContent/SingleTiktokContent';
import DetailTiktok from './DetailTiktok';
import {
  actionGetTiktokChannels,
  actionGetTiktokVideos,
  actionGetTiktokVideosByChannel,
  actionGetTiktokVideosByCollection,
  actionUpdateChannelOrderType,
} from '../../../store/actions/tiktok';
import {
  setIsShowFinalStep,
  setScheduleWaitingList,
  setSelectedScheduleContent,
  setShowSourceIdeasPopup,
} from '../../../store/actions/Schedules';
import { listDefaultKws } from '../../TiktokCpn/constants';
import LoadingApp from '../../LoadingApp';
import SingleChannel from '../../TiktokCpn/SingleChannel';
import PerfectScrollbar from 'react-perfect-scrollbar';
import Select from 'react-select';

const Tiktok = (props) => {
  var { isAuto = false, handleAddToWaitingList = null, additionalButton = null, isCreatedContent = false } = props;
  const dispatch = useDispatch();

  const [isShowChannels, setIsShowChannels] = useState(false);
  const [isShowVideos, setIsShowVideos] = useState(true);
  const [channels, setChannels] = useState([]);
  const [open, setOpen] = useState(false);
  const [objSelect, setObjSelect] = useState({});
  const [contents, setContents] = useState([]);
  const [filteredContents, setFilteredContents] = useState([]);
  const [nextOffset, setNextOffset] = useState(0);
  const [currentKeyword, setCurrentKeyword] = useState('');
  const [videoSearchId, setVideoSearchId] = useState('');
  const [searchId, setSearchId] = useState('');
  const [isShowOrdering, setIsShowOrdering] = useState(false);


  const {
    isLoading = false,
    nextIsLoading = false,
    searchType = 'video',
    searchChannel = null,
    searchVideos = null,
    videoType = null,
    keyword = '',
    filteringSettings = null,
    currentChannelOrderType = 'latest',
  } = useSelector((state) => state.tiktoks);

  const { autoWaitingList, scheduledContents = [] } = useSelector(
    (state) => state.schedules
  );

  useEffect(() => {
    if (searchVideos?.videos?.length === 0 && !currentKeyword) {
      const searchValue =
        listDefaultKws[Math.floor(Math.random() * listDefaultKws.length)];
      setCurrentKeyword(searchValue);
      dispatch(actionGetTiktokVideos(searchValue, 0));
    }
  }, [dispatch, searchVideos, currentKeyword]);

  const switchSearchTypeResult = (type) => {
    switch (type) {
      case 'channel':
        setIsShowChannels(true);
        setIsShowVideos(false);
        break;
      case 'video':
        setIsShowChannels(false);
        setIsShowVideos(true);
        break;
      default:
        setIsShowChannels(false);
        setIsShowVideos(false);
        break;
    }
  };

  useEffect(() => {
    if (searchType) {
      switchSearchTypeResult(searchType);
    }
  }, [searchType]);

  useEffect(() => {
    if (searchChannel) {
      const { channels = [], next_offset = 0, search_id = '' } = searchChannel;
      setChannels(channels);
      setNextOffset(next_offset);
      setSearchId(search_id);
    }
  }, [searchChannel]);

  useEffect(() => {
    if (searchVideos) {
      const {
        videos = [],
        next_offset = 0,
        search_id = '',
        page = 1,
        has_more = false,
      } = searchVideos;
      onFilteringVideos();
      setNextOffset(next_offset);
      if (has_more) {
        setNextOffset(parseInt(page) + 1);
      }
      setVideoSearchId(search_id);
    } else {
      setFilteredContents([]);
      setNextOffset(0);
      setVideoSearchId('');
    }
  }, [searchVideos]);

  useEffect(() => {
    if (filteringSettings) {
      onFilteringVideos();
    }
  }, [filteringSettings]);

  const handleActionShowPopup = (elt) => {
    const { images = [], videos = [], page_name = '', timestamp } = elt;
    let mediaType = 'image';
    let mediaUrl = '';
    let medias = [];
    if (videos.length > 0) {
      mediaType = 'video';
      mediaUrl = videos[0].video;
      medias.push(videos[0].thumb);
    } else {
      medias = images;
    }
    setObjSelect({
      ...elt,
      medias: medias,
      user_screenname: page_name,
      post_timestamp: timestamp,
      media_type: mediaType,
      media_url: mediaUrl,
    });
    setOpen(true);
  };

  const handleClosePopup = () => {
    setOpen(!open);
  };

  const handleAddToSchedule = useCallback(
    (elt) => {
      dispatch(
        setSelectedScheduleContent({
          ...elt,
          source_type: 'tiktok',
        })
      );
      dispatch(setIsShowFinalStep(true));
      dispatch(setShowSourceIdeasPopup(false));
    },
    [dispatch]
  );

  const onFilteringVideos = () => {
    const {
      order = 0,
      orderType = 0,
      length = 0,
      videoType = 0,
      scheduledType = 0,
    } = filteringSettings;

    let filterContents = searchVideos?.videos || [];
    // length
    switch (parseInt(length)) {
      case 1: // less than 30s
        filterContents = filterContents.filter((item) => item.duration <= 30);
        break;

      case 2: // less than 60s
        filterContents = filterContents.filter((item) => item.duration <= 60);
        break;

      case 3: // less than 60s
        filterContents = filterContents.filter((item) => item.duration <= 90);
        break;

      case 4: // less than 60s
        filterContents = filterContents.filter((item) => item.duration > 90);
        break;

      case 5: // less than 5 minutes
        filterContents = filterContents.filter((item) => item.duration <= 300);
        break;

      default:
        break;
    }

    // video type
    const minHeight = 960;
    const minWidth = 540;
    const minRatio = 0.56;
    switch (parseInt(videoType)) {
      case 1: // Reels format
        filterContents = filterContents.filter((item) => {
          const { height = 0, width = 0 } = item;
          const ratio = width / height;
          if (height >= minHeight && width >= minWidth && ratio >= minRatio)
            return true;
        });
        break;

      case 2: // Non-reels
        filterContents = filterContents.filter((item) => {
          const { height = 0, width = 0 } = item;
          const ratio = width / height;
          if (height < minHeight || width < minWidth || ratio < minRatio)
            return true;
        });
        break;

      default:
        break;
    }

    switch (parseInt(scheduledType)) {
      case 1: // scheduled
        filterContents = filterContents.filter((item) => {
          const search = scheduledContents?.find((elt) => {
            return (
              elt?.content_id === item?.post_id && elt?.source_type === 'tiktok'
            );
          });
          if (search) return true;
        });
        break;

      case 2: // not scheduled
        filterContents = filterContents.filter((item) => {
          const search = scheduledContents?.find((elt) => {
            return (
              elt?.content_id === item?.post_id && elt?.source_type === 'tiktok'
            );
          });
          if (!search) return true;
        });
        break;

      default:
        break;
    }

    // re-order
    filterContents.sort((a, b) => {
      switch (parseInt(order)) {
        case 1:
          if (orderType === 2) {
            return a.view - b.view;
          } else {
            return b.view - a.view;
          }

        case 2:
          if (orderType === 2) {
            return a.duration - b.duration;
          } else {
            return b.duration - a.duration;
          }
      }
    });

    const newContents = [...filterContents];
    setFilteredContents(newContents);
  };

  const onSelectAll = () => {
    dispatch(
      setScheduleWaitingList({
        ...autoWaitingList,
        contents: filteredContents,
        source_type: 'tiktok',
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


  if (!handleAddToWaitingList) {
    handleAddToWaitingList = (type, item, cat_id = 0) => {
      if (!autoWaitingList) {
        const newList = {
          source_type: type,
          contents: [item],
        };
        dispatch(setScheduleWaitingList(newList));
      } else {
        const { contents } = autoWaitingList;
        let newContents = null;
        // check if exist
        const search = contents.find((elt) => {
          switch (type) {
            case 'douyin':
              return elt.video_id === item.video_id;
            case 'threads':
            case 'chatgpt':
              return elt.id === item.id;
            default:
              return elt.post_id === item.post_id;
          }
        });
        if (search) {
          newContents = contents.filter((elt) => {
            switch (type) {
              case 'douyin':
                return elt.video_id !== item.video_id;
              case 'threads':
              case 'chatgpt':
                return elt.id !== item.id;
              default:
                return elt.post_id !== item.post_id;
            }
          });
        } else {
          newContents = [...contents, item];
        }
        // push content
        dispatch(
          setScheduleWaitingList({
            ...autoWaitingList,
            contents: newContents,
            source_type: type,
            cat_id,
          })
        );
      }
    };
  }

  const getMoreVideos = () => {
    const { type = '' } = videoType;
    switch (type) {
      case 'channel':
        dispatch(
          actionGetTiktokVideosByChannel(
            videoType?.channel_id,
            nextOffset,
            currentChannelOrderType
          )
        );
        break;

      case 'collection':
        dispatch(
          actionGetTiktokVideosByCollection(
            searchVideos?.id,
            parseInt(searchVideos?.page) + 1
          )
        );
        break;

      default:
        dispatch(actionGetTiktokVideos(keyword, nextOffset, videoSearchId));
        break;
    }
  };

  const handleChangeChannels = () => {
    switchSearchTypeResult('channel');
  };

  const handleChangeVideos = () => {
    switchSearchTypeResult('video');
  };

  const renderVideos = () => {
    return filteredContents.map((item, index) => {
      return (
        <SingleTiktokContent
          key={index}
          item={item}
          handleActionShowPopup={handleActionShowPopup}
          handleClosePopup={handleClosePopup}
          handleAddToSchedule={handleAddToSchedule}
          handleAddToWaitingList={handleAddToWaitingList}
          isAuto={isAuto}
        />
      );
    });
  };

  useEffect(() => {
    // set is show ordering when showing detail of channel
    if (videoType) {
      const { type = '' } = videoType;
      if (type === 'channel') {
        setIsShowOrdering(true);
      } else {
        setIsShowOrdering(false);
      }
    } else {
      setIsShowOrdering(false);
    }
  }, [videoType]);

  const onOrderTypeChange = (orderType) => {
    dispatch(actionUpdateChannelOrderType(orderType));
    dispatch(
      actionGetTiktokVideosByChannel(videoType?.channel_id, 0, orderType)
    );
  };

  return (
    <div className='pr-5 pl-5'>
      <SearchBox setCurrentKeyword={setCurrentKeyword} isCreatedContent={isCreatedContent} />
      {filteredContents.length === 0 && channels.length === 0 && !isLoading ? (
        <div className="flex justify-center h-60 items-center">
          <span className="font-bold">
            Nhập từ khoá để có được kết quả chính xác
          </span>
        </div>
      ) : isLoading ? (
        <LoadingApp />
      ) : (
        <div>
          {/* tab channel or video */}
          <div className="tab flex gap-3 border-b py-3 relative z-20">
            <div
              className={`tab_channel cursor-pointer ${isShowChannels ? 'underline text-blue-500' : ''
                }`}
              onClick={handleChangeChannels}
            >
              <span>Kênh</span>
            </div>
            <div
              className={`tab_video cursor-pointer ${isShowVideos ? 'underline text-blue-500' : ''
                }`}
              onClick={handleChangeVideos}
            >
              <span>Video</span>
            </div>
            {/* show ordering */}
            {isShowOrdering && (
              <div className="flex gap-3 items-center justify-center ml-auto">
                <Select
                  options={[
                    { value: 'latest', label: 'Mới nhất' },
                    { value: 'popular', label: 'Phổ biến nhất' },
                    { value: 'oldest', label: 'Cũ nhất' },
                  ]}
                  defaultValue={{ value: 'latest', label: 'Mới nhất' }}
                  value={{
                    value: currentChannelOrderType,
                    label:
                      currentChannelOrderType === 'latest'
                        ? 'Mới nhất'
                        : currentChannelOrderType === 'popular'
                          ? 'Phổ biến nhất'
                          : 'Cũ nhất',
                  }}
                  onChange={(selected) => onOrderTypeChange(selected.value)}
                  className="w-40"
                />
              </div>
            )}
          </div>
          {/* show channels */}
          {isShowChannels ? (
            channels.length > 0 ? (
              <PerfectScrollbar className="max-h-98">
                <div className="list_channel grid grid-cols-2 gap-3">
                  {channels?.map((channel) => (
                    <SingleChannel
                      key={channel.id}
                      channel={channel}
                      isSchedule={true}
                    />
                  ))}
                </div>
                <div className="text-center mt-3">
                  {nextOffset !== 0 && (
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded-md"
                      onClick={() =>
                        dispatch(
                          actionGetTiktokChannels({
                            keyword,
                            offset: nextOffset,
                            search_id: searchId,
                          })
                        )
                      }
                    >
                      Xem thêm
                    </button>
                  )}
                </div>
              </PerfectScrollbar>
            ) : (
              <div className="text-base text-center p-4">
                Vui lòng chọn một kênh hoặc tìm từ khoá ở trên
              </div>
            )
          ) : null}
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
                <span>Số video đã chọn: </span>
                <span className="font-bold">
                  {autoWaitingList?.contents?.length || 0}
                </span>
              </div>
            </div>
          )}
          {isShowVideos && (
            <Fragment>
              <div
                className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 ${isCreatedContent ? '' : 'xl:grid-cols-3'}  gap-2`}
              >
                {renderVideos()}
              </div>
              {nextIsLoading ? <LoadingApp className="col-span-2" /> : null}
              <div className="flex justify-center mt-3">
                {nextOffset ? (
                  <button
                    className={`rounded-md text-white bg-blue-400 p-3 m-3 w-1/2`}
                    onClick={(e) => getMoreVideos()}
                  >
                    Xem thêm
                  </button>
                ) : null}
                {additionalButton ? (additionalButton) : null}
              </div>
            </Fragment>
          )}
          <DetailTiktok
            open={open}
            setOpen={handleClosePopup}
            handleClosePopup={handleClosePopup}
            obj={objSelect}
          />
        </div>
      )}
    </div>
  );
};

export default Tiktok;
