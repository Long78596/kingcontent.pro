import { OK } from "../../configs";
import { VideoEditorService } from "../../services/videoEditor";

const VIDEO_EDITOR_PREFIX = 'VIDEO_EDITOR';

export const ACTION_GET_VIDEOS = `${VIDEO_EDITOR_PREFIX}_GET_VIDEOS`;
export const ACTION_GET_VIDEOS_SUCCESS = `${VIDEO_EDITOR_PREFIX}_GET_VIDEOS_SUCCESS`;
export const ACTION_GET_VIDEOS_FAILURE = `${VIDEO_EDITOR_PREFIX}_GET_VIDEOS_FAILURE`;

export const ACTION_LOAD_MORE_VIDEOS = `${VIDEO_EDITOR_PREFIX}_LOAD_MORE_VIDEOS`;
export const ACTION_LOAD_MORE_VIDEOS_SUCCESS = `${VIDEO_EDITOR_PREFIX}_LOAD_MORE_VIDEOS_SUCCESS`;
export const ACTION_LOAD_MORE_VIDEOS_FAILURE = `${VIDEO_EDITOR_PREFIX}_LOAD_MORE_VIDEOS_FAILURE`;

export const ACTION_REMOVE_VIDEO = `${VIDEO_EDITOR_PREFIX}_REMOVE_VIDEO`;
export const ACTION_REMOVE_VIDEO_SUCCESS = `${VIDEO_EDITOR_PREFIX}_REMOVE_VIDEO_SUCCESS`;
export const ACTION_REMOVE_VIDEO_FAILURE = `${VIDEO_EDITOR_PREFIX}_REMOVE_VIDEO_FAILURE`;

export const ACTION_UPDATE_CURRENT_VIDEO = `${VIDEO_EDITOR_PREFIX}_UPDATE_CURRENT_VIDEO`;
export const ACTION_UPDATE_CURRENT_VIDEO_SUCCESS = `${VIDEO_EDITOR_PREFIX}_UPDATE_CURRENT_VIDEO_SUCCESS`;
export const ACTION_UPDATE_CURRENT_VIDEO_FAILURE = `${VIDEO_EDITOR_PREFIX}_UPDATE_CURRENT_VIDEO_FAILURE`;

export const ACTION_SET_CURRENT_VIDEO = `${VIDEO_EDITOR_PREFIX}_SET_CURRENT_VIDEO`;
export const ACTION_SET_SHOW_MODAL = `${VIDEO_EDITOR_PREFIX}_SET_SHOW_MODAL`;

const getAllHashtags = (videos) => {
  const hashtags = [];
  videos.forEach((video) => {
    if (video.hash_tag){
      hashtags.push(video.hash_tag)
    }
  });
  return hashtags;
}

export const actionGetVideos = (page = 1, perPage = 4) => {
  return async (dispatch) => {
    dispatch({
      type: ACTION_GET_VIDEOS,
    });
    const res = await VideoEditorService.getVideos(page, perPage);
    if (res.status === OK) {
      const { data } = res || null;
      const videos = data?.data || [];
      const hashtags = getAllHashtags(videos);
      dispatch({
        type: ACTION_GET_VIDEOS_SUCCESS,
        payload: {
          videos: videos,
          hashtags: hashtags,
          pagination: {
            current_page: data?.current_page || 1,
            per_page: data?.per_page || 4,
            total: data?.total || 0,
            last_page: data?.last_page || 1,
            from: data?.from || 0,
            to: data?.to || 0,
          }
        }
      });
    } else {
      dispatch({
        type: ACTION_GET_VIDEOS_FAILURE,
      });
    }
  };
};

export const actionLoadMoreVideos = (page = 2, perPage = 4) => {
  return async (dispatch) => {
    dispatch({
      type: ACTION_LOAD_MORE_VIDEOS,
    });
    const res = await VideoEditorService.getVideos(page, perPage);
    if (res.status === OK) {
      const { data } = res || null;
      const videos = data?.data || [];
      const hashtags = getAllHashtags(videos);
      dispatch({
        type: ACTION_LOAD_MORE_VIDEOS_SUCCESS,
        payload: {
          videos: videos,
          hashtags: hashtags,
          pagination: {
            current_page: data?.current_page || page,
            per_page: data?.per_page || 4,
            total: data?.total || 0,
            last_page: data?.last_page || 1,
            from: data?.from || 0,
            to: data?.to || 0,
          }
        }
      });
    } else {
      dispatch({
        type: ACTION_LOAD_MORE_VIDEOS_FAILURE,
      });
    }
  };
};

export const actionRemoveVideo = (videoId, currentPage = 1, perPage = 4) => {
  return async (dispatch, getState) => {
    dispatch({
      type: ACTION_REMOVE_VIDEO,
      payload: videoId,
    });
    const res = await VideoEditorService.removeVideo(videoId);
    if (res.status === OK) {
      dispatch({
        type: ACTION_REMOVE_VIDEO_SUCCESS,
        payload: videoId,
      });
      
      // For infinite loading, we need to reload all videos up to the current point
      const state = getState();
      const { videos = [], pagination = {} } = state.videoEditor;
      
      // Calculate how many videos to load (maintain current scroll position)
      const currentTotalVideos = videos.length;
      const videosToLoad = Math.max(perPage, currentTotalVideos - 1); // -1 because we deleted one
      
      // Reload from beginning with the calculated amount
      dispatch(actionGetVideos(1, videosToLoad));
    } else {
      dispatch({
        type: ACTION_REMOVE_VIDEO_FAILURE,
        payload: "Xóa video thất bại",
      });
    }
  };
};

export const actionUpdateCurrentVideo = (data, shouldRefresh = false, currentPage = 1, perPage = 12) => {
  return async (dispatch) => {
    dispatch({
      type: ACTION_UPDATE_CURRENT_VIDEO,
      payload: data,
    });
    const res = await VideoEditorService.updateVideo(data.id, data);
    if (res.status === OK) {
      dispatch({
        type: ACTION_UPDATE_CURRENT_VIDEO_SUCCESS,
        payload: "Cập nhật video thành công",
      });
      if (shouldRefresh) {
        dispatch(actionGetVideos(currentPage, perPage));
      }
    } else {
      dispatch({
        type: ACTION_UPDATE_CURRENT_VIDEO_FAILURE,
        payload: "Cập nhật video thất bại",
      });
    }
  };
};

export const actionSetCurrentVideo = (video) => {
  return {
    type: ACTION_SET_CURRENT_VIDEO,
    payload: video,
  };
};

export const actionSetShowModal = (show) => {
  return {
    type: ACTION_SET_SHOW_MODAL,
    payload: show,
  };
};
