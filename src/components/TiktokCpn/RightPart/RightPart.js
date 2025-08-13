/* eslint-disable max-lines */
import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SingleChannel from '../SingleChannel';
import SingleVideo from '../SingleVideo';
import LoadingApp from '../../LoadingApp';
import DetailTiktok from '../../Schedules/Tiktok/DetailTiktok';
import {
  actionGetTikTokCollections,
  actionGetTiktokChannels,
  actionGetTiktokVideos,
  actionGetTiktokVideosByChannel,
  actionGetTiktokVideosByCollection,
  actionGetTiktokVideosInCollections,
  actionRemoveVideoFromCollection,
  actionUpdateChannelOrderType,
  actionUpdateChosenVideos,
  actionUpdateCollectionModalOpen,
  actionUpdateCollectionModalType,
} from '../../../store/actions/tiktok';
import { toast } from 'react-toastify';
import { confirmAlert } from 'react-confirm-alert';
import {
  setCurrentDateTime,
  setIsShowFinalStep,
  setSelectedScheduleContent,
  setShowSourceIdeasPopup,
} from '../../../store/actions/Schedules';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import Select from 'react-select';
import Me from '../me';
import { isDevMode } from '../../../utils/utilityFunc';
import { OK, VIDEO_EDITOR_URL } from '../../../configs';
import { tiktokService } from '../../../services/tiktok';
import { setActiveTab, setIsLoadingGenerateScript, setScript } from '../../../store/actions/TextToVideo';
import { TABS } from '../../../pages/TextToVldeo/Ultils';
import auth from '../../../utils/auth';

const maxAllowDuration = 300; // 5 minutes

// Function to convert seconds to human readable format
const convertSecondsToReadableFormat = (seconds) => {
  if (seconds >= 60) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    if (remainingSeconds === 0) {
      return `${minutes} phút`;
    } else {
      return `${minutes} phút ${remainingSeconds} giây`;
    }
  }
  return `${seconds} giây`;
};

const RightPart = (props) => {
  const { leftOpen = false } = props;
  const [isShowChannels, setIsShowChannels] = useState(false);
  const [isShowVideos, setIsShowVideos] = useState(false);
  const [isShowMe, setIsShowMe] = useState(true);
  const [channels, setChannels] = useState([]);
  const [nextOffset, setNextOffset] = useState(0);
  const [searchId, setSearchId] = useState('');
  const [videos, setVideos] = useState([]);
  const [open, setOpen] = useState(false);
  const [objSelect, setObjSelect] = useState({});

  const [videoNextOffset, setVideoNextOffset] = useState(0);
  const [videoSearchId, setVideoSearchId] = useState('');
  const [isShowCollectionActions, setIsShowCollectionActions] = useState(true);
  const [isShowOrdering, setIsShowOrdering] = useState(false);
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
    currentChannelOrderType = 'latest',
  } = useSelector((state) => {
    // @ts-ignore
    return state.tiktoks;
  });

  const handleAction = async (action, elt, collId = 0) => {
    switch (action) {
      case 'VIEW_DETAIL_CONTENT':
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
        break;

      case 'CHOOSE_VIDEO':
        const index = chosenVideos.findIndex(
          (item) => item.post_id === elt.post_id
        );

        if (index > -1) {
          const newChosenVideos = chosenVideos.filter(
            (item) => item.post_id !== elt.post_id
          );
          dispatch(actionUpdateChosenVideos(newChosenVideos));
        } else {
          dispatch(actionUpdateChosenVideos([...chosenVideos, elt]));
        }

        break;

      case 'REMOVE_FROM_COLLECTION':
        const collectionId = collId ? collId : elt.collection_id;
        confirmAlert({
          title: 'Thông báo',
          message: 'Bạn có chắc chắn muốn xoá video này khỏi BST không?',
          buttons: [
            {
              label: 'Chắc chắn',
              onClick: async () => {
                await dispatch(
                  actionRemoveVideoFromCollection(collectionId, elt.post_id)
                );
                await dispatch(actionGetTikTokCollections());
                await dispatch(actionGetTiktokVideosInCollections());
                toast.success('Xoá video ra khỏi bộ sưu tập thành công !');
              },
            },
            {
              label: 'Đổi ý',
              onClick: () => {
                return;
              },
            },
          ],
        });
        break;

      case 'SCHEDULE_CONTENT':
        dispatch(
          setSelectedScheduleContent({
            ...elt,
            source_type: 'tiktok',
          })
        );
        dispatch(setCurrentDateTime());
        dispatch(setIsShowFinalStep(true));
        dispatch(setShowSourceIdeasPopup(false));
        history.push('/lich-dang-bai');
        break;

      case 'EDIT_VIDEO':
        const { post_id = '', duration = 0 } = elt;
        if (duration > maxAllowDuration) {
          confirmAlert({
            title: 'Thông báo',
            message: `Hiện tại Kingcontent chỉ hỗ trợ chỉnh sửa video dài tối đa ${convertSecondsToReadableFormat(maxAllowDuration)}. Vui lòng nhấn nút tải video này về và upload trực tiếp lên trình chỉnh sửa video (tối đa 200MB)`,
            buttons: [
              {
                label: 'Tải về',
                onClick: async () => {
                  // Download action - get video URL and download
                  const { videos = [] } = elt;
                  if (videos.length > 0 && videos[0].video) {
                    const link = document.createElement('a');
                    link.href = videos[0].video;
                    link.target = '_blank';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link); // Clean up
                  } else {
                    toast.info('Video đang được tải về, vui lòng chờ trong giây lát');
                    try {
                      const res = await tiktokService.getVideoMediaURL(post_id);
                      if (res.status === OK) {
                        toast.dismiss();
                        const link = document.createElement('a');
                        const { video_url = '' } = res.data.data;
                        link.href = video_url;
                        link.download = `${post_id}.mp4`;
                        link.setAttribute('download', `${post_id}.mp4`);
                        link.target = '_blank';
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link); // Clean up
                      } else {
                        toast.error('Có lỗi xảy ra, vui lòng thử lại sau');
                      }
                    } catch (error) {
                      toast.error('Có lỗi xảy ra, vui lòng thử lại sau');
                    }
                  }
                },
              },
              {
                label: 'Video editor',
                onClick: () => {
                  // Open video editor
                  const editorLink = document.createElement('a');
                  const baseEditorUrl = VIDEO_EDITOR_URL ?? 'http://localhost:3000';
                  editorLink.href = baseEditorUrl;
                  editorLink.target = '_blank';
                  document.body.appendChild(editorLink);
                  editorLink.click();
                  document.body.removeChild(editorLink);
                },
              },
            ],
            overlayClassName: 'large-confirmation',
          });
          return;
        }
        
        confirmAlert({
          title: 'Chọn cách chỉnh sửa',
          message: 'Bạn muốn chỉnh sửa video này như thế nào?',
          buttons: [
            {
              label: 'Chỉ video này',
              onClick: () => {
                // Edit single video immediately
                const editorLink = document.createElement('a');
                const baseEditorUrl = VIDEO_EDITOR_URL ?? 'http://localhost:3000';
                editorLink.href = `${baseEditorUrl}?type=tiktok&id=${post_id}&thumbnail=${encodeURIComponent(elt.thumbnail)}`;
                editorLink.target = '_blank';
                document.body.appendChild(editorLink);
                editorLink.click();
                document.body.removeChild(editorLink);
              },
            },
            {
              label: 'Đưa vào danh sách',
              onClick: () => {
                // Add to chosen videos list for batch editing
                const index = chosenVideos.findIndex(
                  (item) => item.post_id === elt.post_id
                );
                if (index === -1) {
                  dispatch(actionUpdateChosenVideos([...chosenVideos, elt]));
                  toast.success('Đã thêm vào hàng chờ Ở TRÊN CÙNG');
                } else {
                  toast.info('Video đã có trong danh sách');
                }
              },
            },
          ],
        });
        break;
      case "SET_SCRIPT_VIDEO_AI":
        history.push("/text-to-video");
        toast.info("Đang lấy kịch bản video, vui lòng chờ trong giây lát");
        dispatch(setActiveTab(TABS.GENERATE));
        dispatch(setIsLoadingGenerateScript(true));
        try {
          const res = await tiktokService.getVideoScript(elt.post_id);
          toast.success("Lấy kịch bản video thành công, bạn hãy tuỳ chỉnh và tạo video mới với AI!")
          dispatch(setScript(res.data?.data));
        }
        catch (error) {
          toast.error("Video này không có giọng đọc kịch bản hoặc giọng đọc kịch bản không rõ ràng, không thể lấy được kịch bản để tạo mới video AI.");
        }
        finally {
          dispatch(setIsLoadingGenerateScript(false));
        }
        break;

      default:
        break;
    }
  };

  const handleClosePopup = () => {
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
        setIsShowChannels(false);
        setIsShowVideos(false);
        setIsShowMe(true);
        break;

      default:
        setIsShowChannels(false);
        setIsShowVideos(false);
        setIsShowMe(false);
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

      case 3: // less than 90s
        filterContents = filterContents.filter((item) => item.duration <= 90);
        break;

      case 4: // more than 90s
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
      setIsShowCollectionActions(true);
    }
  }, [videoType]);

  useEffect(() => {
    if (searchChannel) {
      const { channels = [], next_offset = 0, search_id = '' } = searchChannel;

      if (channels.length > 0) {
        switchSearchTypeResult('channel');
      }

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

      if (videos.length > 0) {
        switchSearchTypeResult('video');
      }

      onFilteringVideos();
      setVideoNextOffset(next_offset);

      if (has_more) {
        setVideoNextOffset(parseInt(page) + 1);
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
    switchSearchTypeResult('video');
  };

  const checkVideoIsChosen = useCallback(
    (video) => {
      const index = chosenVideos.findIndex(
        (item) => item.post_id === video.post_id
      );

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
      const index = collectionsVideos.findIndex(
        (item) => item.video_id === video.post_id
      );

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

  const getMoreVideos = () => {
    const { type = '' } = videoType;

    switch (type) {
      case 'channel':
        dispatch(
          actionGetTiktokVideosByChannel(
            videoType?.channel_id,
            videoNextOffset,
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
        dispatch(
          actionGetTiktokVideos(keyword, videoNextOffset, videoSearchId)
        );
        break;
    }
  };

  useEffect(() => {
    if (filteringSettings) {
      onFilteringVideos();
    }
  }, [filteringSettings]);

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
    <div className="results border border-gray-300 rounded-md bg-white p-2 border-b">
      {isLoading ? (
        <LoadingApp />
      ) : (
        <>
          {/* tab channel or video */}
          <div className="tab flex border-b py-3 items-center">
            <div className="tabs flex gap-3 items-center">
              <button
                className={`tab_channel cursor-pointer p-3 ${isShowChannels
                  ? 'border rounded-md border-primary text-primary'
                  : ''
                  }`}
                onClick={handleChangeChannels}
              >
                Kênh
              </button>

              <button
                className={`tab_video cursor-pointer p-3 ${isShowVideos
                  ? 'border rounded-md border-primary text-primary'
                  : ''
                  }`}
                onClick={handleChangeVideos}
              >
                Video
              </button>

              {/* Me tab */}
              {isDevMode() && (
                <button
                  className={`tab_video cursor-pointer p-3 ${isShowMe
                    ? 'border rounded-md border-primary text-primary'
                    : ''
                    }`}
                  onClick={() => switchSearchTypeResult('me')}
                >
                  Tôi
                </button>
              )}
            </div>

            {/* show actions */}
            {isShowVideos && isShowCollectionActions && (
              <div className="flex gap-2 items-center justify-center ml-auto">
                {chosenVideos.length > 0 ? (
                  <div className="summary">
                    <span>Bạn đã chọn </span>
                    <span className="font-bold">
                      {chosenVideos?.length || 0}
                    </span>
                    / <span className="font-bold">{videos?.length || 0}</span>
                    <span> video</span>
                  </div>
                ) : (
                  <div className="summary hidden">
                    <span>Chọn video bên dưới để lưu vào bộ sưu tập</span>
                  </div>
                )}
                <div className="actions flex gap-3 whitespace-nowrap">
                  <button
                    className="border-1 disabled:cursor-not-allowed border-red-800 bg-red-800 hover:bg-red-500 py-3 px-4 text-white rounded-md"
                    disabled={chosenVideos.length === 0}
                    onClick={() => dispatch(actionUpdateChosenVideos([]))}
                  >
                    Bỏ chọn
                  </button>
                  <button
                    className="border-1 border-green-700 bg-green-700 disabled:cursor-not-allowed hover:bg-green-500 py-3 px-4 text-white rounded-md"
                    onClick={() => selectAllVideos()}
                    disabled={
                      videos.length === 0 ||
                      chosenVideos.length === videos.length
                    }
                  >
                    Chọn toàn bộ
                  </button>
                  <button
                    className="border-1 disabled:cursor-not-allowed border-primary bg-primary hover:bg-primaryHover py-3 px-4 text-white rounded-md"
                    onClick={() => showCollectionModal()}
                    disabled={chosenVideos.length === 0}
                  >
                    Lưu vào bộ sưu tập
                  </button>
                  {chosenVideos.length > 0 && auth.isHasVip3() && (
                    <button
                      className="border-1 disabled:cursor-not-allowed border-purple-600 bg-purple-600 hover:bg-purple-500 py-3 px-4 text-white rounded-md"
                      onClick={() => {
                        // Check if all chosen videos have valid duration
                        const invalidVideos = chosenVideos.filter(video => video.duration > maxAllowDuration);
                        
                        if (invalidVideos.length > 0) {
                          confirmAlert({
                            title: 'Thông báo',
                            message: `Có ${invalidVideos.length} video vượt quá thời lượng cho phép (${convertSecondsToReadableFormat(maxAllowDuration)}). Vui lòng bỏ chọn các video này trước khi chỉnh sửa tất cả.`,
                            buttons: [
                              {
                                label: 'Bỏ video lỗi và tiếp tục',
                                onClick: () => {
                                  // Remove invalid videos and continue with valid ones
                                  const validVideos = chosenVideos.filter(video => video.duration <= maxAllowDuration);
                                  dispatch(actionUpdateChosenVideos(validVideos));
                                  
                                  if (validVideos.length > 0) {
                                    // Open video editor with valid videos only
                                    const editorLink = document.createElement('a');
                                    const baseEditorUrl = process.env.VIDEO_EDITOR_URL ?? 'http://localhost:3000';
                                    const videoParams = validVideos.map(video => `type=tiktok&id=${video.post_id}&thumbnail=${encodeURIComponent(video.thumbnail)}`).join('&');
                                    editorLink.href = `${baseEditorUrl}?${videoParams}`;
                                    editorLink.target = '_blank';
                                    document.body.appendChild(editorLink);
                                    editorLink.click();
                                    document.body.removeChild(editorLink);
                                  } else {
                                    toast.error('Không có video hợp lệ để chỉnh sửa');
                                  }
                                },
                              },
                              {
                                label: 'Đồng ý',
                                onClick: () => {},
                              },
                            ],
                          });
                          return;
                        }
                        
                        // Open video editor with all chosen videos (all are valid)
                        const editorLink = document.createElement('a');
                        const baseEditorUrl = process.env.VIDEO_EDITOR_URL ?? 'http://localhost:3000';
                        const videoParams = chosenVideos.map(video => `type=tiktok&id=${video.post_id}&thumbnail=${encodeURIComponent(video.thumbnail)}`).join('&');
                        editorLink.href = `${baseEditorUrl}?${videoParams}`;
                        editorLink.target = '_blank';
                        document.body.appendChild(editorLink);
                        editorLink.click();
                        document.body.removeChild(editorLink);
                      }}
                      disabled={chosenVideos.length === 0}
                    >
                      Sửa video đang chờ
                    </button>
                  )}
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
            )}
          </div>
          {/* list channel or video */}
          <div className="list mt-3">
            {isShowChannels ? (
              channels.length > 0 ? (
                <div>
                  <div
                    className={`list_channel gap-3 grid grid-cols-2 ${leftOpen ? '' : 'xl:grid-cols-4'
                      }`}
                  >
                    {channels?.map((channel) => (
                      <Fragment key={channel.id}>
                        <SingleChannel channel={channel} isSearch={true} />
                      </Fragment>
                    ))}
                  </div>
                  <div className="text-center mt-3">
                    {nextOffset !== 0 ? (
                      <button
                        className="bg-primary text-white px-4 py-2 rounded-md w-1/2"
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
                    ) : null}
                  </div>
                </div>
              ) : (
                <div className="text-base text-center p-4">
                  Vui lòng chọn một kênh hoặc tìm từ khoá ở trên
                </div>
              )
            ) : (
              <></>
            )}

            {isShowVideos ? (
              <div className="videoContainer">
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

                {videos.length > 0 ? (
                  <div>
                    <div
                      className={`list_video grid grid-cols-2 lg:grid-cols-4 md:grid-cols-3 gap-2 ${leftOpen ? '' : 'xl:grid-cols-5'
                        }`}
                    >
                      {videos?.map((video, index) => (
                        <Fragment key={video.post_id}>
                          <SingleVideo
                            video={video}
                            handleAction={handleAction}
                            isChosen={checkVideoIsChosen(video)}
                          />
                        </Fragment>
                      ))}
                    </div>
                    {nextIsLoading && <LoadingApp />}
                    <div className="text-center mt-3">
                      {videoNextOffset !== 0 && (
                        <button
                          className="bg-primary text-white px-4 py-2 rounded-md w-1/2"
                          onClick={() => getMoreVideos()}
                        >
                          Xem thêm
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-base text-center p-4">
                    Vui lòng chọn một kênh hoặc tìm từ khoá ở trên
                  </div>
                )}
              </div>
            ) : (
              <></>
            )}

            {isShowMe ? <Me handleAction={handleAction} /> : null}
          </div>
        </>
      )}
      <DetailTiktok
        open={open}
        setOpen={handleClosePopup}
        // @ts-ignore
        handleClosePopup={handleClosePopup}
        obj={objSelect}
      />
    </div>
  );
};

export default RightPart;
