import { ACTION_GET_VIDEOS, ACTION_GET_VIDEOS_FAILURE, ACTION_GET_VIDEOS_SUCCESS, ACTION_LOAD_MORE_VIDEOS, ACTION_LOAD_MORE_VIDEOS_SUCCESS, ACTION_LOAD_MORE_VIDEOS_FAILURE, ACTION_REMOVE_VIDEO, ACTION_REMOVE_VIDEO_FAILURE, ACTION_REMOVE_VIDEO_SUCCESS, ACTION_SET_CURRENT_VIDEO, ACTION_SET_SHOW_MODAL, ACTION_UPDATE_CURRENT_VIDEO, ACTION_UPDATE_CURRENT_VIDEO_FAILURE, ACTION_UPDATE_CURRENT_VIDEO_SUCCESS } from "../../store/actions/videoEditor";

const initialState = {
  isLoading: false,
  isLoadingMore: false,
  videos: [],
  hashtags: [],
  pagination: {
    current_page: 1,
    per_page: 4,
    total: 0,
    last_page: 1,
    from: 0,
    to: 0,
  },
  isRemovingId: null,
  removeError: null,
  isUpdating: false,
  updateError: null,
  currentVideo: null,
  showModal: false,
  hasInitialized: false,
}

const videoEditorReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case ACTION_GET_VIDEOS:
      return { ...state, isLoading: true };

    case ACTION_GET_VIDEOS_SUCCESS:
      if (payload){
        const { videos = [], hashtags = [], pagination = {} } = payload;
        return {
          ...state,
          isLoading: false,
          isRemovingId: null,
          removeError: null,
          isUpdating: false,
          videos,
          hashtags,
          pagination,
          hasInitialized: true
        };
      }
      return { ...state, isLoading: false, videos: [], hashtags: [], hasInitialized: true };

    case ACTION_GET_VIDEOS_FAILURE:
      return { ...state, isLoading: false, videos: [], hasInitialized: true };

    case ACTION_LOAD_MORE_VIDEOS:
      return { ...state, isLoadingMore: true };

    case ACTION_LOAD_MORE_VIDEOS_SUCCESS:
      if (payload){
        const { videos = [], hashtags = [], pagination = {} } = payload;
        return {
          ...state,
          isLoadingMore: false,
          videos: [...state.videos, ...videos],
          // @ts-ignore
          hashtags: [...new Set([...state.hashtags, ...hashtags])],
          pagination,
        };
      }
      return { ...state, isLoadingMore: false };

    case ACTION_LOAD_MORE_VIDEOS_FAILURE:
      return { ...state, isLoadingMore: false };

    case ACTION_REMOVE_VIDEO:
      return { ...state, isRemovingId: payload };

    case ACTION_REMOVE_VIDEO_SUCCESS:
      return { ...state, isRemovingId: null };
    
    case ACTION_REMOVE_VIDEO_FAILURE:
      return { ...state, isRemovingId: null, removeError: payload };

    case ACTION_UPDATE_CURRENT_VIDEO:
      return { ...state, isUpdating: true };

    case ACTION_UPDATE_CURRENT_VIDEO_SUCCESS:
      return { ...state, isUpdating: false, updateError: null };

    case ACTION_UPDATE_CURRENT_VIDEO_FAILURE:
      return { ...state, isUpdating: false, updateError: payload };

    case ACTION_SET_CURRENT_VIDEO:
      return { ...state, currentVideo: payload };

    case ACTION_SET_SHOW_MODAL:
      return { ...state, showModal: payload };

    default:
      return state;
  }
}
export default videoEditorReducer;
