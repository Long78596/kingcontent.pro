import { toast } from 'react-toastify';
import { OK } from '../../../configs';
import { douyinService } from '../../../services/douyin';
// import { ACTION_RESET_DOUYIN_STORE } from '../../../reducers/tiktok';

export const ACTION_GET_DOUYIN_VIDEOS = 'ACTION_GET_DOUYIN_VIDEOS';
export const ACTION_GET_DOUYIN_VIDEOS_SUCCESS =
  'ACTION_GET_DOUYIN_VIDEOS_SUCCESS';
export const ACTION_GET_DOUYIN_VIDEOS_OF_CHANNEL_SUCCESS =
  'ACTION_GET_DOUYIN_VIDEOS_OF_CHANNEL_SUCCESS ';

export const ACTION_GET_DOUYIN_COLLECTIONS = 'ACTION_GET_DOUYIN_COLLECTIONS';
export const ACTION_GET_DOUYIN_COLLECTIONS_SUCCESS =
  'ACTION_GET_DOUYIN_COLLECTIONS_SUCCESS';

export const ACTION_GET_DOUYIN_FOLLOWING_CHANNELS =
  'ACTION_GET_DOUYIN_FOLLOWING_CHANNELS';
export const ACTION_GET_DOUYIN_FOLLOWING_CHANNELS_SUCCESS =
  'ACTION_GET_DOUYIN_FOLLOWING_CHANNELS_SUCCESS';

export const ACTION_GET_DOUYIN_CHANNELS = 'ACTION_GET_DOUYIN_CHANNELS';
export const ACTION_GET_DOUYIN_CHANNELS_SUCCESS =
  'ACTION_GET_DOUYIN_CHANNELS_SUCCESS';

export const ACTION_GET_DOUYIN_VIDEOS_BY_CHANNEL =
  'ACTION_GET_DOUYIN_VIDEOS_BY_CHANNEL';
export const ACTION_GET_DOUYIN_VIDEOS_BY_CHANNEL_SUCCESS =
  'ACTION_GET_DOUYIN_VIDEOS_BY_CHANNEL_SUCCESS';

export const ACTION_GET_DOUYIN_VIDEOS_BY_COLLECTION =
  'ACTION_GET_DOUYIN_VIDEOS_BY_COLLECTION';
export const ACTION_GET_DOUYIN_VIDEOS_BY_COLLECTION_SUCCESS =
  'ACTION_GET_DOUYIN_VIDEOS_BY_COLLECTION_SUCCESS';

export const ACTION_CHANGE_SEARCH_TYPE = 'ACTION_CHANGE_SEARCH_TYPE';
export const ACTION_UPDATE_CHOSEN_VIDEOS = 'ACTION_UPDATE_CHOSEN_VIDEOS';
export const ACTION_UPDATE_CURRENT_VIDEO_TYPE =
  'ACTION_UPDATE_CURRENT_VIDEO_TYPE';

// collection modal
export const ACTION_UPDATE_COLLECTION_MODAL_TYPE =
  'ACTION_UPDATE_COLLECTION_MODAL_TYPE';
export const ACTION_UPDATE_COLLECTION_MODAL_OPEN =
  'ACTION_UPDATE_COLLECTION_MODAL_OPEN';
export const ACTION_UPDATE_CURRENT_COLLECTION =
  'ACTION_UPDATE_CURRENT_COLLECTION';

export const ACTION_GET_ALL_COLLECTIONS_VIDEOS =
  'ACTION_GET_ALL_COLLECTIONS_VIDEOS';
export const ACTION_GET_ALL_COLLECTIONS_VIDEOS_SUCCESS =
  'ACTION_GET_ALL_COLLECTIONS_VIDEOS_SUCCESS';

export const ACTION_REMOVE_VIDEO_FROM_COLLECTION =
  'ACTION_REMOVE_VIDEO_FROM_COLLECTION';
export const ACTION_REMOVE_VIDEO_FROM_COLLECTION_SUCCESS =
  'ACTION_REMOVE_VIDEO_FROM_COLLECTION_SUCCESS';

export const ACTION_UPDATE_CURRENT_KEYWORD = 'ACTION_UPDATE_CURRENT_KEYWORD';

export const ACTION_SAVE_COLLECTION_SUCCESS = 'ACTION_SAVE_COLLECTION_SUCCESS';

export const ACTION_UPDATE_FILLTERING_SETTINGS =
  'ACTION_UPDATE_FILLTERING_SETTINGS';

export const ACTION_FILTER_DOUYIN_VIDEOS_SUCCESS =
  'ACTION_FILTER_DOUYIN_VIDEOS_SUCCESS';
export const ACTION_FILTER_STATUS_DOUYIN_VIDEOS_SUCCESS =
  'ACTION_FILTER_STATUS_DOUYIN_VIDEOS_SUCCESS';

export const ACTION_CHANGE_LOADING_APP = 'ACTION_CHANGE_LOADING_APP';
export const ACTION_RESET_VIDEO = 'ACTION_RESET_VIDEO';

export const actionGetDouyinVideos = (
  inputValue,
  offset = 0,
  search_id = '',
  nexToken = '',
  lastIds = []
) => {
  return async (dispatch) => {
    dispatch({
      type: ACTION_GET_DOUYIN_VIDEOS,
      payload: { offset: offset },
    });
    try {
      const res = await douyinService.getDouyinVideos(
        inputValue,
        offset,
        search_id,
        nexToken,
        lastIds
      );
      if (res.status === OK) {
        const { data } = res?.data || null;
        dispatch({
          type: ACTION_GET_DOUYIN_VIDEOS_SUCCESS,
          payload: {
            keyword: inputValue,
            offset: offset,
            search_id: search_id,
            videos: data?.videos || [],
            next_token: data?.next_token || '',
            next_offset: data?.next_cursor || 0,
            has_next: data?.has_next || false,
          },
        });
      }
    } catch (error) {
      dispatch({
        type: ACTION_GET_DOUYIN_VIDEOS_SUCCESS,
        payload: {
          keyword: inputValue,
          offset: offset,
          search_id: search_id,
          data: [],
        },
      });
    }
  };
};

export const actionGetDouyinVideosAll = () => {
  return async (dispatch) => {
    const res = await douyinService.getAllVideoTitktok();
    if (res.status === OK) {
      const { data } = res.data || null;
      dispatch({
        type: ACTION_GET_DOUYIN_VIDEOS_SUCCESS,
        payload: data,
      });
    } else {
      dispatch({
        type: ACTION_GET_DOUYIN_VIDEOS_SUCCESS,
        payload: [],
      });
    }
  };
};

export const actionGetDouyinCollections = () => {
  return async (dispatch) => {
    const res = await douyinService.getDouyinCollections();
    if (res.status === OK) {
      const { data } = res.data;
      dispatch({
        type: ACTION_GET_DOUYIN_COLLECTIONS_SUCCESS,
        payload: data,
      });
    } else {
      dispatch({
        type: ACTION_GET_DOUYIN_COLLECTIONS_SUCCESS,
        payload: [],
      });
    }
  };
};

export const actionGetDouyinFollowingChannels = () => {
  return async (dispatch) => {
    const res = await douyinService.getDouyinFollowingChannels();
    if (res.status === OK) {
      const { data } = res.data;
      dispatch({
        type: ACTION_GET_DOUYIN_FOLLOWING_CHANNELS_SUCCESS,
        payload: data,
      });
    } else {
      dispatch({
        type: ACTION_GET_DOUYIN_FOLLOWING_CHANNELS_SUCCESS,
        payload: [],
      });
    }
  };
};

export const actionGetDouyinChannels = (params) => {
  return async (dispatch) => {
    await dispatch({
      type: ACTION_GET_DOUYIN_CHANNELS,
      payload: params,
    });
    const res = await douyinService.getDouyinChannels(params);
    if (res.status === OK) {
      const { data } = res.data;
      dispatch({
        type: ACTION_GET_DOUYIN_CHANNELS_SUCCESS,
        payload: data,
      });
    } else {
      dispatch({
        type: ACTION_GET_DOUYIN_CHANNELS_SUCCESS,
        payload: [],
      });
    }
  };
};

export const actionGetDouyinVideosByChannel = (channelId, offset = 0) => {
  return async (dispatch) => {
    dispatch({
      type: ACTION_CHANGE_LOADING_APP,
      payload: true,
    });
    dispatch({
      type: ACTION_GET_DOUYIN_VIDEOS_BY_CHANNEL,
      payload: { offset: offset },
    });
    const res = await douyinService.getDouyinVideosByChannel(channelId, offset);
    if (res.status === OK) {
      const { data } = res.data;
      dispatch({
        type: ACTION_GET_DOUYIN_VIDEOS_OF_CHANNEL_SUCCESS,
        payload: { ...data, offset: offset },
      });
    } else {
      dispatch({
        type: ACTION_GET_DOUYIN_VIDEOS_OF_CHANNEL_SUCCESS,
        payload: [],
      });
    }
  };
};

export const actionRemoveChannel = (channelId) => {
  return async (dispatch) => {
    const res = await douyinService.removeChannel(channelId);
    if (res.status === OK) {
      dispatch(actionGetDouyinFollowingChannels());
    } else {
      toast.error('Xóa kênh thất bại! Vui lòng thử lại sau.');
    }
  };
};

export const actionAddChannel = (channel) => {
  return async (dispatch) => {
    const res = await douyinService.addChannel(channel);
    if (res.status === OK) {
      dispatch(actionGetDouyinFollowingChannels());
    }
  };
};

// function change status search type
export const actionChangeSearchType = (searchType) => {
  return async (dispatch) => {
    dispatch({
      type: ACTION_CHANGE_SEARCH_TYPE,
      payload: searchType,
    });
  };
};

// function update chosen videos
export const actionUpdateChosenVideos = (videos) => {
  return async (dispatch) => {
    dispatch({
      type: ACTION_UPDATE_CHOSEN_VIDEOS,
      payload: videos,
    });
  };
};

// function update current video type
export const actionUpdateCurrentVideoType = (videoType) => {
  return async (dispatch) => {
    dispatch({
      type: ACTION_UPDATE_CURRENT_VIDEO_TYPE,
      payload: videoType,
    });
  };
};

export const actionUpdateCollectionModalType = (type) => {
  return async (dispatch) => {
    dispatch({
      type: ACTION_UPDATE_COLLECTION_MODAL_TYPE,
      payload: type,
    });
  };
};

export const actionUpdateCollectionModalOpen = (isOpen) => {
  return async (dispatch) => {
    dispatch({
      type: ACTION_UPDATE_COLLECTION_MODAL_OPEN,
      payload: isOpen,
    });
  };
};

export const actionUpdateCurrentCollection = (collection) => {
  return async (dispatch) => {
    dispatch({
      type: ACTION_UPDATE_CURRENT_COLLECTION,
      payload: collection,
    });
  };
};

export const actionGetDouyinVideosByCollection = (collectionId, page = 1) => {
  return async (dispatch) => {
    dispatch({
      type: ACTION_GET_DOUYIN_VIDEOS_BY_COLLECTION,
      payload: { page: page },
    });
    const res = await douyinService.getDouyinCollectionDetail(
      collectionId,
      page
    );
    if (res.status === OK) {
      const { data } = res.data;
      dispatch({
        type: ACTION_GET_DOUYIN_VIDEOS_BY_COLLECTION_SUCCESS,
        payload: { ...data, collection_id: collectionId },
      });
    } else {
      dispatch({
        type: ACTION_GET_DOUYIN_VIDEOS_BY_COLLECTION_SUCCESS,
        payload: null,
      });
    }
  };
};

export const actionRemoveCollection = (collectionId) => {
  return async (dispatch) => {
    const res = await douyinService.removeCollection(collectionId);
    if (res.status === OK) {
      dispatch(actionGetDouyinCollections());
    }
  };
};

export const actionSaveCollection = (collection) => {
  return async (dispatch) => {
    const res = await douyinService.saveCollection(collection);
    if (res.status === OK) {
      const { data } = res.data;
      await dispatch(actionGetDouyinCollections());
      dispatch({
        type: ACTION_SAVE_COLLECTION_SUCCESS,
        payload: data,
      });
    }
  };
};

export const actionSaveVideoToCollection = (
  collectionId = 0,
  collectionName = '',
  videos = []
) => {
  return async (dispatch) => {
    const res = await douyinService.saveVideoToCollection(
      collectionId,
      collectionName,
      videos
    );
    if (res.status === OK) {
      await dispatch(actionGetDouyinCollections());
      dispatch(actionGetDouyinVideosInCollections());
    }
  };
};

export const actionRemoveVideoFromCollection = (collectionId, videoId) => {
  return async (dispatch) => {
    dispatch({
      type: ACTION_REMOVE_VIDEO_FROM_COLLECTION,
      payload: null,
    });
    const res = await douyinService.removeVideoFromCollection(
      collectionId,
      videoId
    );
    if (res.status === OK) {
      dispatch({
        type: ACTION_REMOVE_VIDEO_FROM_COLLECTION_SUCCESS,
        payload: videoId,
      });
    } else {
      dispatch({
        type: ACTION_REMOVE_VIDEO_FROM_COLLECTION_SUCCESS,
        payload: null,
      });
    }
  };
};

export const actionGetDouyinVideosInCollections = () => {
  return async (dispatch) => {
    const res = await douyinService.getAllCollectionsVideos();
    if (res.status === OK) {
      const { data } = res.data;
      dispatch({
        type: ACTION_GET_ALL_COLLECTIONS_VIDEOS_SUCCESS,
        payload: data,
      });
    } else {
      dispatch({
        type: ACTION_GET_ALL_COLLECTIONS_VIDEOS_SUCCESS,
        payload: [],
      });
    }
  };
};

export const actionGetDouyinVideosDouyinInCollections = () => {
  return async (dispatch) => {
    const res = await douyinService.getAllCollectionsVideosDouyin();
    if (res.status === OK) {
      const { data } = res.data;
      dispatch({
        type: ACTION_GET_ALL_COLLECTIONS_VIDEOS_SUCCESS,
        payload: data,
      });
    } else {
      dispatch({
        type: ACTION_GET_ALL_COLLECTIONS_VIDEOS_SUCCESS,
        payload: [],
      });
    }
  };
};

export const actionUpdateCurrentKeyword = (keyword) => {
  return async (dispatch) => {
    dispatch({
      type: ACTION_UPDATE_CURRENT_KEYWORD,
      payload: keyword,
    });
  };
};

export const actionUpdateFilteringSettings = (settings) => {
  return async (dispatch) => {
    dispatch({
      type: ACTION_UPDATE_FILLTERING_SETTINGS,
      payload: settings,
    });
  };
};
// export const actionResetStoreDouyinAndDouyin = () =>{
//   return async (dispatch) => {
//     dispatch({
//       type: ACTION_RESET_DOUYIN_STORE,
//     });
//   };
// }
