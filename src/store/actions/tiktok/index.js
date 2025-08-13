import { toast } from 'react-toastify';
import { OK } from '../../../configs';
import { tiktokService } from '../../../services/tiktok';

export const ACTION_GET_TIKTOK_VIDEOS = 'ACTION_GET_TIKTOK_VIDEOS';
export const ACTION_GET_TIKTOK_VIDEOS_SUCCESS =
  'ACTION_GET_TIKTOK_VIDEOS_SUCCESS';

export const ACTION_GET_TIKTOK_COLLECTIONS = 'ACTION_GET_TIKTOK_COLLECTIONS';
export const ACTION_GET_TIKTOK_COLLECTIONS_SUCCESS =
  'ACTION_GET_TIKTOK_COLLECTIONS_SUCCESS';

export const ACTION_GET_TIKTOK_FOLLOWING_CHANNELS =
  'ACTION_GET_TIKTOK_FOLLOWING_CHANNELS';
export const ACTION_GET_TIKTOK_FOLLOWING_CHANNELS_SUCCESS =
  'ACTION_GET_TIKTOK_FOLLOWING_CHANNELS_SUCCESS';

export const ACTION_GET_TIKTOK_CHANNELS = 'ACTION_GET_TIKTOK_CHANNELS';
export const ACTION_GET_TIKTOK_CHANNELS_SUCCESS =
  'ACTION_GET_TIKTOK_CHANNELS_SUCCESS';

export const ACTION_GET_TIKTOK_VIDEOS_BY_CHANNEL =
  'ACTION_GET_TIKTOK_VIDEOS_BY_CHANNEL';
export const ACTION_GET_TIKTOK_VIDEOS_BY_CHANNEL_SUCCESS =
  'ACTION_GET_TIKTOK_VIDEOS_BY_CHANNEL_SUCCESS';

export const ACTION_GET_TIKTOK_VIDEOS_BY_COLLECTION =
  'ACTION_GET_TIKTOK_VIDEOS_BY_COLLECTION';
export const ACTION_GET_TIKTOK_VIDEOS_BY_COLLECTION_SUCCESS =
  'ACTION_GET_TIKTOK_VIDEOS_BY_COLLECTION_SUCCESS';

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

export const ACTION_UPDATE_CHANNEL_ORDER_TYPE =
  'ACTION_UPDATE_CHANNEL_ORDER_TYPE';

export const ACTION_GET_MY_VIDEOS = 'ACTION_GET_MY_VIDEOS';
export const ACTION_GET_MY_VIDEOS_SUCCESS = 'ACTION_GET_MY_VIDEOS_SUCCESS';

export const actionUpdateChannelOrderType = (orderType) => {
  return async (dispatch) => {
    dispatch({
      type: ACTION_UPDATE_CHANNEL_ORDER_TYPE,
      payload: orderType,
    });
  };
};

export const actionGetTiktokVideosByManualLinks = (links) => {
  return async (dispatch) => {
    dispatch({
      type: ACTION_GET_TIKTOK_VIDEOS,
      payload: null,
    });

    const res = await tiktokService.getTikTokVideosByManualLinks(links);
    if (res.status === OK) {
      const { data } = res.data;
      dispatch({
        type: ACTION_GET_TIKTOK_VIDEOS_SUCCESS,
        payload: data,
      });
    } else {
      dispatch({
        type: ACTION_GET_TIKTOK_VIDEOS_SUCCESS,
        payload: [],
      });
    }
  };
};

export const actionGetTiktokVideos = (
  inputValue,
  offset = 0,
  search_id = ''
) => {
  return async (dispatch) => {
    dispatch({
      type: ACTION_GET_TIKTOK_VIDEOS,
      payload: { offset: offset },
    });
    const res = await tiktokService.getTiktokVideos(
      inputValue,
      offset,
      search_id
    );
    if (res.status === OK && res.data.success === true) {
      const { data } = res.data || null;
      dispatch({
        type: ACTION_GET_TIKTOK_VIDEOS_SUCCESS,
        payload: data,
      });
    } else {
      dispatch({
        type: ACTION_GET_TIKTOK_VIDEOS_SUCCESS,
        payload: [],
      });
    }
  };
};

export const actionGetTiktokVideosAll = () => {
  return async (dispatch) => {
    const res = await tiktokService.getAllVideoTitktok();
    if (res.status === OK) {
      const { data } = res.data || null;
      dispatch({
        type: ACTION_GET_TIKTOK_VIDEOS_SUCCESS,
        payload: data,
      });
    } else {
      dispatch({
        type: ACTION_GET_TIKTOK_VIDEOS_SUCCESS,
        payload: [],
      });
    }
  };
};

export const actionGetTikTokCollections = () => {
  return async (dispatch) => {
    const res = await tiktokService.getTiktokCollections();
    if (res.status === OK) {
      const { data } = res.data;
      dispatch({
        type: ACTION_GET_TIKTOK_COLLECTIONS_SUCCESS,
        payload: data,
      });
    } else {
      dispatch({
        type: ACTION_GET_TIKTOK_COLLECTIONS_SUCCESS,
        payload: [],
      });
    }
  };
};

export const actionGetTiktokFollowingChannels = () => {
  return async (dispatch) => {
    const res = await tiktokService.getTiktokFollowingChannels();
    if (res.status === OK) {
      const { data } = res.data;
      dispatch({
        type: ACTION_GET_TIKTOK_FOLLOWING_CHANNELS_SUCCESS,
        payload: data,
      });
    } else {
      dispatch({
        type: ACTION_GET_TIKTOK_FOLLOWING_CHANNELS_SUCCESS,
        payload: [],
      });
    }
  };
};

export const actionGetTiktokChannels = (params) => {
  return async (dispatch) => {
    await dispatch({
      type: ACTION_GET_TIKTOK_CHANNELS,
      payload: null,
    });
    const res = await tiktokService.getTiktokChannels(params);
    if (res.status === OK) {
      const { data } = res.data;
      dispatch({
        type: ACTION_GET_TIKTOK_CHANNELS_SUCCESS,
        payload: data,
      });
    } else {
      dispatch({
        type: ACTION_GET_TIKTOK_CHANNELS_SUCCESS,
        payload: [],
      });
    }
  };
};

export const actionGetTiktokVideosByChannel = (
  channelId,
  offset = 0,
  sortType = 'latest'
) => {
  return async (dispatch) => {
    dispatch({
      type: ACTION_GET_TIKTOK_VIDEOS_BY_CHANNEL,
      payload: { offset: offset },
    });
    const res = await tiktokService.getTiktokVideosByChannel(
      channelId,
      offset,
      sortType
    );
    if (res.status === OK) {
      const { data } = res.data;
      dispatch({
        type: ACTION_GET_TIKTOK_VIDEOS_SUCCESS,
        payload: data,
      });
    } else {
      dispatch({
        type: ACTION_GET_TIKTOK_VIDEOS_SUCCESS,
        payload: [],
      });
    }
  };
};

export const actionRemoveChannel = (channelId) => {
  return async (dispatch) => {
    const res = await tiktokService.removeChannel(channelId);
    if (res.status === OK) {
      dispatch(actionGetTiktokFollowingChannels());
    } else {
      toast.error('Xóa kênh thất bại! Vui lòng thử lại sau.');
    }
  };
};

export const actionAddChannel = (channel) => {
  return async (dispatch) => {
    const res = await tiktokService.addChannel(channel);
    if (res.status === OK) {
      dispatch(actionGetTiktokFollowingChannels());
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

export const actionGetTiktokVideosByCollection = (collectionId, page = 1) => {
  return async (dispatch) => {
    dispatch({
      type: ACTION_GET_TIKTOK_VIDEOS_BY_COLLECTION,
      payload: { page: page },
    });
    const res = await tiktokService.getTiktokCollectionDetail(
      collectionId,
      page
    );
    if (res.status === OK) {
      const { data } = res.data;
      dispatch({
        type: ACTION_GET_TIKTOK_VIDEOS_BY_COLLECTION_SUCCESS,
        payload: data,
      });
    } else {
      dispatch({
        type: ACTION_GET_TIKTOK_VIDEOS_BY_COLLECTION_SUCCESS,
        payload: null,
      });
    }
  };
};

export const actionRemoveCollection = (collectionId) => {
  return async (dispatch) => {
    const res = await tiktokService.removeCollection(collectionId);
    if (res.status === OK) {
      dispatch(actionGetTikTokCollections());
    }
  };
};

export const actionSaveCollection = (collection) => {
  return async (dispatch) => {
    const res = await tiktokService.saveCollection(collection);
    if (res.status === OK) {
      const { data } = res.data;
      await dispatch(actionGetTikTokCollections());
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
    const res = await tiktokService.saveVideoToCollection(
      collectionId,
      collectionName,
      videos
    );
    if (res.status === OK) {
      await dispatch(actionGetTikTokCollections());
      dispatch(actionGetTiktokVideosInCollections());
    }
  };
};

export const actionRemoveVideoFromCollection = (collectionId, videoId) => {
  return async (dispatch) => {
    dispatch({
      type: ACTION_REMOVE_VIDEO_FROM_COLLECTION,
      payload: null,
    });
    const res = await tiktokService.removeVideoFromCollection(
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

export const actionGetTiktokVideosInCollections = () => {
  return async (dispatch) => {
    const res = await tiktokService.getAllCollectionsVideos();
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

export const actionGetMyVideos = (nextCursor = '') => {
  return async (dispatch) => {
    dispatch({
      type: ACTION_GET_MY_VIDEOS,
      payload: {
        nextCursor,
      },
    });

    const res = await tiktokService.getMyVideos();
    if (res.status === OK) {
      const { data } = res.data;
      dispatch({
        type: ACTION_GET_MY_VIDEOS_SUCCESS,
        payload: data,
      });
    }
  };
};
