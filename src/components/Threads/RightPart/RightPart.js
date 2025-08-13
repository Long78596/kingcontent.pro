// @ts-nocheck
import moment from 'moment';
import React, { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import { confirmAlert } from 'react-confirm-alert';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { toast } from 'react-toastify';
import { isArrayEmpty, OK } from '../../../configs';
import { setContentDetailToShow } from '../../../store/actions/Contents/contentActions';
import {
  setCurrentDateTime,
  setIsShowFinalStep,
  setScheduleWaitingList,
  setSelectedScheduleContent,
  setShowSourceIdeasPopup,
} from '../../../store/actions/Schedules';
import {
  actionGetThreadsVideos,
  actionGetThreadsVideosByChannel,
  actionGetThreadsVideosByCollection,
  actionRemoveVideoFromCollection,
  actionUpdateChosenVideos,
  actionUpdateCollectionModalOpen,
  actionUpdateCollectionModalType,
} from '../../../store/actions/threads';
import LoadingApp from '../../LoadingApp';
import SingleChannel from '../SingleChannel';
import SingleVideo from '../SingleVideo';
import Me from '../components/me';
import { listDefaultKws } from '../constants';
import { threadsService } from '../../../services/threads';
import ContentDetail from '../ContentDetail/ContentDetail';
import {
  actionUpdateStep1,
  createContentToHomepage,
  resetCreateContent,
} from '../../../store/actions/createContent';
import { actionPushContentToCreateContentScreen } from '../../../store/actions/homepage';
import { convertInstagramLink } from '../../../helpers';
import { DataScroller } from 'primereact/datascroller';
import styled from 'styled-components';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import auth from '../../../utils/auth';

// Type casting to fix JSX component compatibility
const MasonryComponent = /** @type {any} */ (Masonry);
const ResponsiveMasonryComponent = /** @type {any} */ (ResponsiveMasonry);

const ListStyle = styled.div`
  ul.p-datascroller-list {
    display: grid;
    grid-template-columns: 1fr 1fr !important;
  }
`;
const RightPart = (props) => {
  const {
    isSchedule = false,
    isAuto = false,
    handleAddToWaitingList = () => {},
    leftOpen = false,
  } = props;
  const user = auth.getUserInfo();

  const [isShowChannels, setIsShowChannels] = useState(false);
  const [isShowVideos, setIsShowVideos] = useState(true);
  const [isShowMe, setIsShowMe] = useState(false);
  const [channels, setChannels] = useState([]);
  const [nextOffset, setNextOffset] = useState(0);
  const [nexToken, setNextToken] = useState(null);
  const [searchId, setSearchId] = useState('');
  const [videos, setVideos] = useState([]);
  const [open, setOpen] = useState(false);
  const [objSelect, setObjSelect] = useState({});

  const [videoNextOffset, setVideoNextOffset] = useState(0);
  const [videoSearchId, setVideoSearchId] = useState('');
  const [isShowCollectionActions, setIsShowCollectionActions] = useState(false);
  // @ts-ignore
  const { autoWaitingList } = useSelector((state) => state.schedules);
  const history = useHistory();

  const dispatch = useDispatch();

  const {
    isLoading = false,
    nextIsLoading = false,
    searchType,
    searchChannel = null,
    searchVideos = null,
    chosenVideos = [],
    videoType = null,
    collectionsVideos = [],
    keyword = '',
    filteringSettings = null,
    isFilter,
    filterData,
    isLoadingSearchChannel = false,
  } = useSelector((state) => {
    // @ts-ignore
    return state.threads;
  });
  const ds = useRef(null);

  const { contentDetailToShow } = useSelector(
    // @ts-ignore
    (state) => state.contents
  );

  const handleAction = async (action, elt, collId = 0) => {
    switch (action) {
      case 'VIEW_DETAIL_CONTENT':
        dispatch(setContentDetailToShow(elt));
        break;

      case 'CHOOSE_VIDEO':
        const index = chosenVideos.findIndex((item) => item.id === elt.id);
        if (index > -1) {
          const newChosenVideos = chosenVideos.filter(
            (item) => item.id !== elt.id
          );
          dispatch(actionUpdateChosenVideos(newChosenVideos));
        } else {
          dispatch(actionUpdateChosenVideos([...chosenVideos, elt]));
        }
        break;

      case 'CREATE_CONTENT':
        const {
          text = '',
          images = [],
          videos = [],
          video = null,
          thumbnail: thumb = '',
          is_reels = false,
        } = elt;
        if (video || (videos && !isArrayEmpty(videos))) {
          confirmAlert({
            title: 'Thông báo',
            message: 'Vui lòng chọn một hình thức soạn thảo bài viết:',
            buttons: [
              {
                label: 'Chỉ lấy văn bản',
                onClick: async () => {
                  dispatch(actionUpdateStep1(true));
                  dispatch(resetCreateContent());
                  dispatch(
                    actionPushContentToCreateContentScreen(
                      text,
                      images.map((img) => convertInstagramLink(img)),
                      'text',
                      is_reels
                    )
                  );
                  history.push('/tao-content');
                },
              },
              {
                label: 'Lấy văn bản & video',
                onClick: async () => {
                  toast.info('Đang tải video, vui lòng chờ trong chốc lát...');
                  const videoUrl = videos[0].source || '';
                  const medias = [
                    {
                      type: 'video',
                      url: videoUrl,
                    },
                  ];
                  dispatch(actionUpdateStep1(true));
                  dispatch(resetCreateContent());
                  dispatch(createContentToHomepage({ status: true }));
                  dispatch(
                    actionPushContentToCreateContentScreen(
                      text,
                      medias,
                      'video',
                      is_reels
                    )
                  );
                  history.push('/tao-content');
                },
              },
              {
                label: 'Huỷ',
                onClick: () => {},
              },
            ],
            overlayClassName: 'large-confirmation',
          });
          return;
        }
        //reset content => replace content
        dispatch(createContentToHomepage({ status: true }));
        dispatch(actionUpdateStep1(true));
        dispatch(resetCreateContent());
        dispatch(
          actionPushContentToCreateContentScreen(
            text,
            images.map((img) => convertInstagramLink(img)),
            images.length > 0 ? 'image' : 'text',
            is_reels
          )
        );
        history.push('/tao-content');
        break;

      case 'REMOVE_FROM_COLLECTION':
        confirmAlert({
          title: 'Thông báo',
          message: 'Bạn có chắc muốn xóa content này khỏi bộ sưu tập không?',
          buttons: [
            {
              label: 'Chắc chắn',
              onClick: async () => {
                dispatch(actionRemoveVideoFromCollection(videoType.id, elt.id));
              },
            },
            {
              label: 'Đổi ý',
              onClick: () => {},
            },
          ],
        });
        break;

      case 'SCHEDULE_CONTENT':
        if (elt.media_type === 'video') {
          const resSize = await threadsService.checkSizeVideo(
            elt.videos[0].source
          );
          if (resSize.status === OK) {
            if (Number(resSize.data.data.size) > 400000000) {
              confirmAlert({
                title: 'Thông báo',
                message:
                  'Video này có dung lượng quá lớn, tạm thời Kingcontent không hỗ trợ được. Vui lòng chọn bài viết khác!',
                buttons: [
                  {
                    label: 'Đồng ý',
                    onClick: () => {},
                  },
                ],
              });
              return;
            }
          }
          const minHeight = 960;
          const minWidth = 540;
          const minRatio = 0.56;
          const { height = 0, width = 0, duration } = elt.videos[0];
          const ratio = width / height;
          if (
            height >= minHeight &&
            width >= minWidth &&
            ratio >= minRatio &&
            duration <= 90
          ) {
            dispatch(
              setSelectedScheduleContent({
                ...elt,
                media_type: elt?.media_type,
                source_type: 'threads',
                post_header: elt?.user_name,
                post_timestamp: elt?.created,
                avatar: elt?.user_picture,
                post_text: elt?.text,
                isNotReel: false,
                content_id: elt?.id,
              })
            );
            dispatch(setCurrentDateTime());
            dispatch(setIsShowFinalStep(true));
            dispatch(setShowSourceIdeasPopup(false));
            history.push('/lich-dang-bai');
          } else {
            confirmAlert({
              title: 'Thông báo',
              message:
                'Video này không đủ điều kiện về kích thước & độ dài để tận dụng thuật toán xu hướng, bạn có muốn tiếp tục lên lịch đăng không?',
              buttons: [
                {
                  label: 'Có',
                  onClick: async () => {
                    dispatch(
                      setSelectedScheduleContent({
                        ...elt,
                        media_type: elt.media_type,
                        source_type: 'threads',
                        post_header: elt.user_name,
                        post_timestamp: elt.created,
                        avatar: elt.user_picture,
                        post_text: elt.text,
                        isNotReel: true,
                        content_id: elt.id,
                      })
                    );
                    dispatch(
                      setCurrentDateTime(
                        moment().utc(true).format('YYYY-MM-DD')
                      )
                    );
                    dispatch(setIsShowFinalStep(true));
                    dispatch(setShowSourceIdeasPopup(false));
                    history.push('/lich-dang-bai');
                  },
                },
                {
                  label: 'Không',
                  onClick: () => {},
                },
              ],
            });
          }
        } else {
          dispatch(
            setSelectedScheduleContent({
              ...elt,
              media_type: elt.media_type,
              source_type: 'threads',
              post_header: elt.user_name,
              post_timestamp: elt.created,
              avatar: elt.user_picture,
              post_text: elt.text,
              content_id: elt.id,
            })
          );
          dispatch(setCurrentDateTime());
          dispatch(setIsShowFinalStep(true));
          dispatch(setShowSourceIdeasPopup(false));
          history.push('/lich-dang-bai');
        }

        break;

      default:
        break;
    }
  };

  const itemTemplate = (data) => {
    return (
      <Fragment key={data.id}>
        <SingleChannel channel={data} isSearch={true} />
      </Fragment>
    );
  };
  const footer = (
    <button
      onClick={() => ds.current.load()}
      className="bg-primary text-white px-4 py-2 rounded-md"
    >
      Xem thêm
    </button>
  );
  const handleClosePopup = () => {
    setObjSelect(null);
    setOpen(!open);
  };

  const switchSearchTypeResult = (type) => {
    switch (type) {
      case 'channel':
        setIsShowChannels(true);
        setIsShowVideos(false);
        setIsShowMe(false);
        break;
      case 'video':
        setIsShowChannels(false);
        setIsShowVideos(true);
        setIsShowMe(false);
        break;
      case 'me':
        setIsShowMe(true);
        setIsShowChannels(false);
        setIsShowVideos(false);
        break;
      default:
        setIsShowChannels(false);
        setIsShowVideos(false);
        break;
    }
  };

  const onFilteringVideos = () => {
    const {
      order = 0,
      orderType = 0,
      length = 0,
      videoType = 0,
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
    setVideos(newContents);
  };

  useEffect(() => {
    if (videoType && videoType.type === 'collection') {
      setIsShowCollectionActions(false);
    } else {
      if (!isSchedule) setIsShowCollectionActions(true);
    }
  }, [videoType]);

  useEffect(() => {
    if (searchChannel) {
      const {
        channels = [],
        next_offset = 0,
        search_id = '',
        next_token,
      } = searchChannel;
      if (channels.length > 0) {
        switchSearchTypeResult('channel');
      }
      setChannels(channels);
      // setNextOffset(next_offset);
      // setNextToken(next_token);
      // setSearchId(search_id);
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
        next_cursor,
      } = searchVideos;
      if (videos.length > 0) {
        switchSearchTypeResult('video');
      }
      onFilteringVideos();
      setVideoNextOffset(next_offset);
      setNextToken(next_cursor);
      if (has_more) {
        setVideoNextOffset(parseInt(page) + 1);
        setNextToken(next_cursor);
      }
      setVideoSearchId(search_id);
    }
  }, [searchVideos]);

  useEffect(() => {
    switchSearchTypeResult(searchType);
  }, [searchType]);

  const handleChangeChannels = () => {
    switchSearchTypeResult('channel');
  };

  const handleChangeVideos = () => {
    const searchValue =
      listDefaultKws[Math.floor(Math.random() * listDefaultKws.length)];
    dispatch(actionGetThreadsVideos(searchValue, 0));
    switchSearchTypeResult('video');
  };

  const handleChangeMe = () => {
    switchSearchTypeResult('me');
  };

  const checkVideoIsChosen = useCallback(
    (video) => {
      const index = chosenVideos.findIndex((item) => item.id === video.id);
      if (index > -1) {
        return true;
      }
      return false;
    },
    [chosenVideos]
  );

  const selectAllVideos = useCallback(() => {
    // only select videos that are not in collections
    const newChosenVideos = videos.filter((video) => {
      const index = collectionsVideos.findIndex((item) => item.id === video.id);
      if (index > -1) {
        return false;
      }
      return true;
    });
    dispatch(actionUpdateChosenVideos(newChosenVideos));
  }, [videos]);

  const showCollectionModal = useCallback(() => {
    if (chosenVideos.length > 0) {
      dispatch(actionUpdateCollectionModalOpen(true));
      dispatch(actionUpdateCollectionModalType('addVideo'));
    } else {
      toast.error('Vui lòng chọn video');
    }
  }, [chosenVideos]);

  const getMoreVideos = useCallback(() => {
    const { type = '' } = videoType;
    switch (type) {
      case 'channel':
        dispatch(
          actionGetThreadsVideosByChannel(
            videoType?.channel_id,
            searchVideos?.next_cursor
          )
        );
        break;

      case 'collection':
        dispatch(
          actionGetThreadsVideosByCollection(
            searchVideos?.id,
            searchVideos?.next_cursor
          )
        );
        break;

      default:
        dispatch(actionGetThreadsVideos(keyword, searchVideos?.next_cursor));
        break;
    }
  }, [videoNextOffset, videoSearchId, videoType, searchVideos]);

  const onSelectAll = (data = null) => {
    dispatch(
      setScheduleWaitingList({
        ...autoWaitingList,
        contents: data || videos,
        source_type: 'threads',
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

  return (
    <div className="results border border-gray-300 rounded-md bg-white p-2 border-b">
      <>
        {/* tab channel or video */}
        <div className="tab flex border-b py-3 items-center">
          <div className="tabs flex gap-3 items-center">
            <div
              className={`tab_video cursor-pointer p-3 ${
                isShowVideos
                  ? 'border rounded-md border-primary text-primary'
                  : ''
              }`}
              onClick={handleChangeVideos}
            >
              Threads
            </div>
            <div
              className={`tab_channel cursor-pointer p-3 ${
                isShowChannels
                  ? 'border rounded-md border-primary text-primary'
                  : ''
              }`}
              onClick={handleChangeChannels}
            >
              Kênh
            </div>
            {user?.threads_access_token && user?.threads_id && (
              <div
                className={`tab_channel cursor-pointer p-3 ${
                  isShowMe
                    ? 'border rounded-md border-primary text-primary'
                    : ''
                }`}
                onClick={handleChangeMe}
              >
                Tôi
              </div>
            )}
          </div>

          {/* show actions */}
          {isShowVideos && isShowCollectionActions && (
            <div className="flex gap-2 items-center justify-center ml-auto">
              {chosenVideos.length > 0 ? (
                <div className="summary">
                  <span>Bạn đã chọn </span>
                  <span className="font-bold">{chosenVideos?.length || 0}</span>
                  / <span className="font-bold">{videos?.length || 0}</span>
                  <span> bài đăng</span>
                </div>
              ) : (
                <div className="summary hidden">
                  <span>Chọn video bên dưới để lưu vào bộ sưu tập</span>
                </div>
              )}
              <div className="actions flex gap-3 whitespace-nowrap">
                {!isArrayEmpty(chosenVideos) && (
                  <button
                    className="border-1 disabled:cursor-not-allowed border-red-800 bg-red-800 hover:bg-red-500 py-3 px-4 text-white rounded-md"
                    disabled={chosenVideos.length === 0}
                    onClick={() => dispatch(actionUpdateChosenVideos([]))}
                  >
                    Bỏ chọn
                  </button>
                )}

                <button
                  className="border-1 border-green-700 bg-green-700 disabled:cursor-not-allowed hover:bg-green-500 py-3 px-4 text-white rounded-md"
                  onClick={() => selectAllVideos()}
                  disabled={
                    videos.length === 0 || chosenVideos.length === videos.length
                  }
                >
                  Chọn toàn bộ
                </button>
                {!isArrayEmpty(chosenVideos) && (
                  <button
                    className="border-1 disabled:cursor-not-allowed border-primary bg-primary hover:bg-primaryHover py-3 px-4 text-white rounded-md"
                    onClick={() => showCollectionModal()}
                    disabled={chosenVideos.length === 0}
                  >
                    Lưu vào bộ sưu tập
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
        {/* list channel or video */}
        <div className="list mt-3">
          {isShowChannels && isLoadingSearchChannel && (
            <div className="text-base text-center p-4">
              <LoadingApp />
            </div>
          )}
          {isShowChannels && !isFilter ? (
            channels.length > 0 ? (
              <ListStyle>
                <DataScroller
                  ref={ds}
                  value={channels}
                  itemTemplate={itemTemplate}
                  rows={10}
                  loader
                  footer={footer}
                  buffer={0.4}
                  inline
                />
              </ListStyle>
            ) : (
              <div className="text-base text-center p-4">
                {isShowChannels && (
                  <span>Vui lòng chọn một kênh hoặc tìm từ khoá ở trên</span>
                )}
              </div>
            )
          ) : (
            <></>
          )}
          {isFilter ? (
            <Fragment>
              {isAuto && (
                <div className="flex gap-2 items-center mb-2 z-10 bg-white py-2 sticky border-b top-0">
                  <div className="actions">
                    <button
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-3 text-blue-600 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 font-bold mr-1"
                      onClick={() => onSelectAll(filterData)}
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
              {isArrayEmpty(filterData) ? (
                <div className="text-base text-center p-4">
                  Không tìm thấy dữ liệu nào
                </div>
              ) : (
                <ResponsiveMasonryComponent
                  columnsCountBreakPoints={{
                    350: 1,
                    750: 2,
                    900: isSchedule ? (leftOpen ? 2 : 3) : 3,
                    1200: isSchedule ? (leftOpen ? 2 : 3) : 3,
                  }}
                >
                  <MasonryComponent gutter="10px">
                    {filterData.map((video) => {
                      if (video && video.text !== '') {
                        return (
                          <Fragment key={video.id}>
                            <SingleVideo
                              video={video}
                              handleAction={handleAction}
                              isChosen={checkVideoIsChosen(video)}
                              isSchedule={isSchedule}
                              isAuto={isAuto}
                              handleAddToWaitingList={handleAddToWaitingList}
                            />
                          </Fragment>
                        );
                      }
                    })}
                  </MasonryComponent>
                </ResponsiveMasonryComponent>
              )}
            </Fragment>
          ) : (
            <Fragment>
              {isShowVideos ? (
                <div className="videoContainer">
                  {isLoading && <LoadingApp />}
                  {/* tmp hide this title */}
                  {/* show title of video type */}
                  <div className="title w-full text-center py-3 hidden">
                    <h3 className="text-xl">
                      {videoType?.type === 'channel' ? (
                        <span>
                          Danh sách video của kênh:{' '}
                          <span className="font-bold">{videoType?.name}</span>
                        </span>
                      ) : videoType?.type === 'collection' ? (
                        <span>
                          Danh sách video của bộ sưu tập:{' '}
                          <span className="font-bold">{videoType?.name}</span>
                        </span>
                      ) : videoType?.type === 'keyword' ? (
                        <span>
                          Kết quả tìm kiếm theo từ khoá:{' '}
                          <span className="font-bold">{videoType?.name}</span>
                        </span>
                      ) : (
                        <span>Danh sách video đang thịnh hành</span>
                      )}
                    </h3>
                  </div>
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

                  {videos.length > 0 && (
                    <div>
                      <ResponsiveMasonryComponent
                        columnsCountBreakPoints={{
                          350: 1,
                          750: 2,
                          900: isSchedule ? (leftOpen ? 2 : 3) : 3,
                          1200: isSchedule ? (leftOpen ? 2 : 3) : 3,
                        }}
                        className="max-h-screen overflow-auto"
                      >
                        <MasonryComponent gutter="10px">
                          {videos.map((video) => {
                            if (video && video.text !== '') {
                              return (
                                <Fragment key={video.id}>
                                  <SingleVideo
                                    video={video}
                                    handleAction={handleAction}
                                    isChosen={checkVideoIsChosen(video)}
                                    isSchedule={isSchedule}
                                    isAuto={isAuto}
                                    handleAddToWaitingList={
                                      handleAddToWaitingList
                                    }
                                  />
                                </Fragment>
                              );
                            }
                          })}
                        </MasonryComponent>
                      </ResponsiveMasonryComponent>
                      {nextIsLoading && <LoadingApp />}
                      <div className="text-center mt-3">
                        {searchVideos?.has_next && (
                          <button
                            className="bg-primary text-white px-4 py-2 rounded-md w-1/2"
                            onClick={() => getMoreVideos()}
                          >
                            Xem thêm
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <></>
              )}
            </Fragment>
          )}

          {isShowMe && <Me handleAction={handleAction} />}
        </div>
      </>
      {contentDetailToShow && <ContentDetail />}
    </div>
  );
};

export default RightPart;
