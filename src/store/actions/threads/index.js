import { toast } from 'react-toastify';
import { OK } from '../../../configs';
import { threadsService } from '../../../services/threads';
// import { ACTION_RESET_THREADS_STORE } from '../../../reducers/tiktok';

export const ACTION_GET_THREADS_VIDEOS = 'ACTION_GET_THREADS_VIDEOS';
export const ACTION_GET_THREADS_VIDEOS_SUCCESS =
  'ACTION_GET_THREADS_VIDEOS_SUCCESS';

export const ACTION_GET_THREADS_COLLECTIONS = 'ACTION_GET_THREADS_COLLECTIONS';
export const ACTION_GET_THREADS_COLLECTIONS_SUCCESS =
  'ACTION_GET_THREADS_COLLECTIONS_SUCCESS';

export const ACTION_GET_THREADS_FOLLOWING_CHANNELS =
  'ACTION_GET_THREADS_FOLLOWING_CHANNELS';
export const ACTION_GET_THREADS_FOLLOWING_CHANNELS_SUCCESS =
  'ACTION_GET_THREADS_FOLLOWING_CHANNELS_SUCCESS';

export const ACTION_GET_THREADS_CHANNELS = 'ACTION_GET_THREADS_CHANNELS';
export const ACTION_GET_THREADS_CHANNELS_SUCCESS =
  'ACTION_GET_THREADS_CHANNELS_SUCCESS';

export const ACTION_GET_THREADS_VIDEOS_BY_CHANNEL =
  'ACTION_GET_THREADS_VIDEOS_BY_CHANNEL';
export const ACTION_GET_THREADS_VIDEOS_BY_CHANNEL_SUCCESS =
  'ACTION_GET_THREADS_VIDEOS_BY_CHANNEL_SUCCESS';

export const ACTION_GET_THREADS_VIDEOS_BY_COLLECTION =
  'ACTION_GET_THREADS_VIDEOS_BY_COLLECTION';
export const ACTION_GET_THREADS_VIDEOS_BY_COLLECTION_SUCCESS =
  'ACTION_GET_THREADS_VIDEOS_BY_COLLECTION_SUCCESS';

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

export const ACTION_FILTER_THREADS_VIDEOS_SUCCESS =
  'ACTION_FILTER_THREADS_VIDEOS_SUCCESS';
export const ACTION_FILTER_STATUS_VIDEOS_SUCCESS =
  'ACTION_FILTER_STATUS_VIDEOS_SUCCESS';

export const ACTION_GET_MY_POSTS = 'ACTION_GET_MY_POSTS';
export const ACTION_GET_MY_POSTS_SUCCESS = 'ACTION_GET_MY_POSTS_SUCCESS';

export const actionGetMyPosts = (nextCursor = '') => {
  return async (dispatch) => {
    dispatch({
      type: ACTION_GET_MY_POSTS,
      payload: nextCursor,
    });

    const res = await threadsService.getMyPosts(nextCursor);
    if (res.status === OK) {
      const { data } = res?.data || null;
      dispatch({
        type: ACTION_GET_MY_POSTS_SUCCESS,
        payload: { ...data, nextPage: nextCursor ? true : false },
      });
    } else {
      dispatch({
        type: ACTION_GET_MY_POSTS_SUCCESS,
        payload: null,
      });
    }
  };
};

export const actionGetThreadsVideos = (inputValue, offset = 0) => {
  return async (dispatch) => {
    dispatch({
      type: ACTION_GET_THREADS_VIDEOS,
      payload: { offset: offset },
    });
    try {
      const res = await threadsService.getThreadsVideos(inputValue, offset);
      if (res.status === OK) {
        const { data } = res.data || null;
        dispatch({
          type: ACTION_GET_THREADS_VIDEOS_SUCCESS,
          payload: {
            keyword: inputValue,
            offset: offset,
            data: data.posts,
            next_cursor: data.next_cursor,
            has_next: data.has_next,
          },
        });
      }
    } catch (error) {
      dispatch({
        type: ACTION_GET_THREADS_VIDEOS_SUCCESS,
        payload: {
          keyword: inputValue,
          offset: offset,
          data: [],
        },
      });
    }
  };
};

export const actionGetThreadsVideosAll = () => {
  return async (dispatch) => {
    const res = await threadsService.getAllVideoTitktok();
    if (res.status === OK) {
      const { data } = res.data || null;
      dispatch({
        type: ACTION_GET_THREADS_VIDEOS_SUCCESS,
        payload: data,
      });
    } else {
      dispatch({
        type: ACTION_GET_THREADS_VIDEOS_SUCCESS,
        payload: [],
      });
    }
  };
};

export const actionGetThreadsCollections = () => {
  return async (dispatch) => {
    const res = await threadsService.getThreadsCollections();
    if (res.status === OK) {
      const { data } = res.data;
      dispatch({
        type: ACTION_GET_THREADS_COLLECTIONS_SUCCESS,
        payload: data,
      });
    } else {
      dispatch({
        type: ACTION_GET_THREADS_COLLECTIONS_SUCCESS,
        payload: [],
      });
    }
  };
};

export const actionGetThreadsFollowingChannels = () => {
  return async (dispatch) => {
    const res = await threadsService.getThreadsFollowingChannels();
    if (res.status === OK) {
      const { data } = res.data;
      dispatch({
        type: ACTION_GET_THREADS_FOLLOWING_CHANNELS_SUCCESS,
        payload: data,
      });
    } else {
      dispatch({
        type: ACTION_GET_THREADS_FOLLOWING_CHANNELS_SUCCESS,
        payload: [],
      });
    }
  };
};

export const actionGetThreadsChannels = (params) => {
  return async (dispatch) => {
    await dispatch({
      type: ACTION_GET_THREADS_CHANNELS,
      payload: null,
    });
    const res = await threadsService.getThreadsChannels(params);
    if (res.status === OK) {
      const { data } = res.data;
      dispatch({
        type: ACTION_GET_THREADS_CHANNELS_SUCCESS,
        payload: data,
      });
    } else {
      dispatch({
        type: ACTION_GET_THREADS_CHANNELS_SUCCESS,
        payload: [],
      });
    }
  };
};

export const actionGetThreadsVideosByChannel = (channelId, offset = 0) => {
  return async (dispatch) => {
    dispatch({
      type: ACTION_GET_THREADS_VIDEOS_BY_CHANNEL,
      payload: { offset: offset },
    });
    const res = await threadsService.getThreadsVideosByChannel(
      channelId,
      offset
    );
    if (res.status === OK) {
      const { data } = res.data;
      dispatch({
        type: ACTION_GET_THREADS_VIDEOS_SUCCESS,
        payload: {
          keyword: '',
          offset: offset,
          data: data.posts,
          next_cursor: data.next_cursor,
          has_next: data.has_next,
        },
      });
    } else {
      dispatch({
        type: ACTION_GET_THREADS_VIDEOS_SUCCESS,
        payload: [],
      });
    }
  };
};

export const actionRemoveChannel = (channelId) => {
  return async (dispatch) => {
    const res = await threadsService.removeChannel(channelId);
    if (res.status === OK) {
      dispatch(actionGetThreadsFollowingChannels());
    } else {
      toast.error('Xóa kênh thất bại! Vui lòng thử lại sau.');
    }
  };
};

export const actionAddChannel = (channel) => {
  return async (dispatch) => {
    const res = await threadsService.addChannel(channel);
    if (res.status === OK) {
      dispatch(actionGetThreadsFollowingChannels());
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

export const actionGetThreadsVideosByCollection = (collectionId, page = 1) => {
  return async (dispatch) => {
    dispatch({
      type: ACTION_GET_THREADS_VIDEOS_BY_COLLECTION,
      payload: { page: page },
    });
    const res = await threadsService.getThreadsCollectionDetail(
      collectionId,
      page
    );
    if (res.status === OK) {
      const { data } = res.data;
      dispatch({
        type: ACTION_GET_THREADS_VIDEOS_BY_COLLECTION_SUCCESS,
        payload: data,
      });
    } else {
      dispatch({
        type: ACTION_GET_THREADS_VIDEOS_BY_COLLECTION_SUCCESS,
        payload: null,
      });
    }
  };
};

export const actionRemoveCollection = (collectionId) => {
  return async (dispatch) => {
    const res = await threadsService.removeCollection(collectionId);
    if (res.status === OK) {
      dispatch(actionGetThreadsCollections());
    }
  };
};

export const actionSaveCollection = (collection) => {
  return async (dispatch) => {
    console.log('collection', collection);
    const res = await threadsService.saveCollection(collection);
    if (res.status === OK) {
      const { data } = res.data;
      await dispatch(actionGetThreadsCollections());
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
    const res = await threadsService.saveVideoToCollection(
      collectionId,
      collectionName,
      videos
    );
    if (res.status === OK) {
      await dispatch(actionGetThreadsCollections());
      dispatch(actionGetThreadsVideosInCollections());
    }
  };
};

export const actionRemoveVideoFromCollection = (collectionId, videoId) => {
  return async (dispatch) => {
    dispatch({
      type: ACTION_REMOVE_VIDEO_FROM_COLLECTION,
      payload: null,
    });
    const res = await threadsService.removeVideoFromCollection(
      collectionId,
      videoId
    );
    if (res.status === OK) {
      dispatch(actionGetThreadsCollections());
      dispatch(actionGetThreadsVideosByCollection(collectionId));
      toast.success('Xoá bài viết ra khỏi bộ sưu tập thành công !');
    } else {
      dispatch({
        type: ACTION_REMOVE_VIDEO_FROM_COLLECTION_SUCCESS,
        payload: null,
      });
    }
  };
};

export const actionGetThreadsVideosInCollections = () => {
  return async (dispatch) => {
    const res = await threadsService.getAllCollectionsVideos();
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

export const actionGetThreadsVideosThreadsInCollections = () => {
  return async (dispatch) => {
    const res = await threadsService.getAllCollectionsVideos();
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
// export const actionFilter = (data) => {
//   dispatch({
//     type: ACTION_FILTER_THREADS_VIDEOS_SUCCESS,
//     payload: data,
//   });
// };
// export const actionFilterStatus = (status) => {
//   dispatch({
//     type: ACTION_FILTER_STATUS_VIDEOS_SUCCESS,
//     payload: status,
//   });
// };
export const actionFilter = (data) => {
  return (dispatch) => {
    dispatch({
      type: ACTION_FILTER_THREADS_VIDEOS_SUCCESS,
      payload: data,
    });
  };
};

export const actionFilterStatus = (status) => {
  return (dispatch) => {
    dispatch({
      type: ACTION_FILTER_STATUS_VIDEOS_SUCCESS,
      payload: status,
    });
  };
};


export const ACTION_GET_THREAD_COMMENTS = 'ACTION_GET_THREAD_COMMENTS';
export const ACTION_GET_THREAD_COMMENTS_SUCCESS = 'ACTION_GET_THREAD_COMMENTS_SUCCESS';

export const actionGetThreadComments = (mediaId, cursor = '') => {
  return async (dispatch) => {
    dispatch({
      type: ACTION_GET_THREAD_COMMENTS,
      payload: null,
    });
    const res = await threadsService.getThreadComments(mediaId, cursor);
    if (res.status === OK) {
      const { data } = res.data;
      dispatch({
        type: ACTION_GET_THREAD_COMMENTS_SUCCESS,
        payload: {...data, isGetMore: cursor ? true : false},
      });
    }
  };
};

export const ACTION_POST_THREADS_COMMENT = 'ACTION_POST_THREADS_COMMENT';

export const actionPostThreadsComment = (mediaId, text) => {
  return async (dispatch) => {
    dispatch({
      type: ACTION_POST_THREADS_COMMENT,
      payload: true,
    });
    const res = await threadsService.postThreadsComment(mediaId, text);
    if (res.status === OK) {
      dispatch(actionGetThreadComments(mediaId));
    }
    dispatch({
      type: ACTION_POST_THREADS_COMMENT,
      payload: false,
    });
  };
}
