import {
  ACTION_GET_DOUYIN_VIDEOS,
  ACTION_GET_DOUYIN_VIDEOS_SUCCESS,
  ACTION_GET_DOUYIN_COLLECTIONS,
  ACTION_GET_DOUYIN_COLLECTIONS_SUCCESS,
  ACTION_GET_DOUYIN_FOLLOWING_CHANNELS,
  ACTION_GET_DOUYIN_FOLLOWING_CHANNELS_SUCCESS,
  ACTION_GET_DOUYIN_CHANNELS,
  ACTION_GET_DOUYIN_CHANNELS_SUCCESS,
  ACTION_GET_DOUYIN_VIDEOS_BY_CHANNEL,
  ACTION_GET_DOUYIN_VIDEOS_BY_CHANNEL_SUCCESS,
  ACTION_CHANGE_SEARCH_TYPE,
  ACTION_UPDATE_CHOSEN_VIDEOS,
  ACTION_UPDATE_CURRENT_VIDEO_TYPE,
  ACTION_UPDATE_COLLECTION_MODAL_TYPE,
  ACTION_UPDATE_COLLECTION_MODAL_OPEN,
  ACTION_UPDATE_CURRENT_COLLECTION,
  ACTION_GET_ALL_COLLECTIONS_VIDEOS_SUCCESS,
  ACTION_GET_DOUYIN_VIDEOS_BY_COLLECTION,
  ACTION_GET_DOUYIN_VIDEOS_BY_COLLECTION_SUCCESS,
  ACTION_REMOVE_VIDEO_FROM_COLLECTION,
  ACTION_REMOVE_VIDEO_FROM_COLLECTION_SUCCESS,
  ACTION_SAVE_COLLECTION_SUCCESS,
  ACTION_UPDATE_CURRENT_KEYWORD,
  ACTION_UPDATE_FILLTERING_SETTINGS,
  ACTION_GET_DOUYIN_VIDEOS_OF_CHANNEL_SUCCESS,
  ACTION_FILTER_STATUS_DOUYIN_VIDEOS_SUCCESS,
  ACTION_FILTER_DOUYIN_VIDEOS_SUCCESS,
  ACTION_CHANGE_LOADING_APP,
  ACTION_RESET_VIDEO,
} from '../../store/actions/douyin/index';

const initialState = {
  searchVideos: {
    videos: [],
    next_offset: 0,
    search_id: '',
    offset: 0,
    has_next: 0,
  },
  keyword: '',
  isLoading: false,
  nextIsLoading: false,
  followingChannels: null,
  channels: null,
  collections: null,
  searchType: 'video',
  chosenVideos: [],
  searchChannel: {
    users: [],
    next_offset: 0,
    search_id: '',
  },
  videoType: {
    type: 'trending',
    name: '',
  },
  modalCollectionType: 'add',
  modalCollectionOpen: false,
  currentCollection: null,
  collectionsVideos: [],
  latestCollectionId: 0,
  filteringSettings: {
    order: 0,
    orderType: 0,
    length: 0,
    videoType: 0,
  },
  isFilter: false,
  filterData: [],
};

const douyinReducers = (state = initialState, { type, payload }) => {
  switch (type) {
    case ACTION_GET_DOUYIN_VIDEOS:
      if (payload) {
        const { offset = 0 } = payload;
        if (parseInt(offset) === 0) {
          return { ...state, isLoading: true, searchVideos: payload };
        } else {
          return { ...state, nextIsLoading: true };
        }
      }
      return { ...state, isLoading: true, searchVideos: null };
      break;

    case ACTION_GET_DOUYIN_VIDEOS_SUCCESS:
      if (payload) {
        const { offset = 0, videos } = payload;
        if (parseInt(offset) === 0) {
          return {
            ...state,
            // reset chosen videos
            chosenVideos: [],
            searchVideos: payload,
            isLoading: false,
            nextIsLoading: false,
          };
        } else {
          const oldData = state?.searchVideos?.videos ?? [];
          // merge old data with new data without duplicate
          const newData = [
            ...oldData,
            ...videos.filter(
              (item) =>
                !oldData.some((oldItem) => oldItem.video_id === item.video_id)
            ),
          ];

          return {
            ...state,
            searchVideos: {
              ...payload,
              videos: newData,
            },
            isLoading: false,
            nextIsLoading: false,
          };
        }
      } else {
        return {
          ...state,
          searchVideos: null,
          isLoading: false,
          nextIsLoading: false,
        };
      }
      break;

    case ACTION_GET_DOUYIN_COLLECTIONS:
      return { ...state, isLoading: true };
      break;

    case ACTION_GET_DOUYIN_COLLECTIONS_SUCCESS:
      if (payload) {
        const { next_offset = 0, data = [], offset = 0 } = payload;
        if (parseInt(offset) === 0) {
          return { ...state, collections: payload, isLoading: false };
        } else {
          const oldData = state?.collections?.data ?? [];
          const newData = [...oldData, ...data];
          return {
            ...state,
            collections: { data: newData, next_offset },
            isLoading: false,
          };
        }
      } else {
        return {
          ...state,
          collections: [],
          isLoading: false,
        };
      }
      break;

    case ACTION_GET_DOUYIN_FOLLOWING_CHANNELS:
      return { ...state, isLoading: true };
      break;

    case ACTION_GET_DOUYIN_FOLLOWING_CHANNELS_SUCCESS:
      if (payload) {
        const { next_offset = 0, data = [], offset = 0 } = payload;
        if (parseInt(offset) === 0) {
          return { ...state, followingChannels: payload, isLoading: false };
        } else {
          const oldData = state?.followingChannels?.data ?? [];
          const newData = [...oldData, ...data];
          return {
            ...state,
            followingChannels: { data: newData, next_offset },
            isLoading: false,
          };
        }
      } else {
        return {
          ...state,
          followingChannels: [],
          isLoading: false,
        };
      }
      break;

    case ACTION_GET_DOUYIN_CHANNELS:
      const { offset = 0 } = payload;
      if (parseInt(offset) === 0) {
        return { ...state, isLoading: true };
      } else {
        return { ...state, nextIsLoading: true };
      }
      break;

    case ACTION_GET_DOUYIN_CHANNELS_SUCCESS:
      let newSearchChannel = {
        users: [],
        next_offset: 0,
        search_id: '',
      };
      if (payload) {
        const { next_cursor = 0, users = [], has_next = 0 } = payload;
        if (parseInt(next_cursor) === 30) {
          // first page
          return {
            ...state,
            searchChannel: payload,
            isLoading: false,
            nextIsLoading: false,
          };
        } else {
          const oldData = state?.searchChannel?.users ?? [];
          const newData = [...oldData, ...users];
          return {
            ...state,
            searchChannel: {
              ...payload,
              users: newData,
            },
            isLoading: false,
            nextIsLoading: false,
          };
        }
      } else {
        return {
          ...state,
          searchChannel: newSearchChannel,
          isLoading: false,
          nextIsLoading: false,
        };
      }

    case ACTION_GET_DOUYIN_VIDEOS_BY_CHANNEL:
      if (payload) {
        const { offset = 0 } = payload;
        if (parseInt(offset) === 0) {
          return { ...state, isLoading: true };
        } else {
          return { ...state, nextIsLoading: true };
        }
      }
      return { ...state, isLoading: true };
      break;

    case ACTION_GET_DOUYIN_VIDEOS_BY_CHANNEL_SUCCESS:
      if (payload) {
        const { next_offset = 0, data = [], offset = 0 } = payload;
        if (parseInt(offset) === 0) {
          return {
            ...state,
            searchVideos: payload,
            isLoading: false,
            nextIsLoading: false,
          };
        } else {
          const oldData = state?.videos?.data ?? [];
          const newData = [...oldData, ...data];
          return {
            ...state,
            searchVideos: { data: newData, next_offset },
            isLoading: false,
            nextIsLoading: false,
          };
        }
      } else {
        return {
          ...state,
          searchVideos: [],
          isLoading: false,
          nextIsLoading: false,
        };
      }
      break;

    case ACTION_CHANGE_SEARCH_TYPE:
      return { ...state, searchType: payload };
      break;

    case ACTION_UPDATE_CHOSEN_VIDEOS:
      return { ...state, chosenVideos: payload };
      break;

    case ACTION_UPDATE_CURRENT_VIDEO_TYPE:
      return { ...state, videoType: payload };
      break;

    case ACTION_UPDATE_COLLECTION_MODAL_TYPE:
      return { ...state, modalCollectionType: payload };
      break;

    case ACTION_UPDATE_COLLECTION_MODAL_OPEN:
      return { ...state, modalCollectionOpen: payload };
      break;

    case ACTION_UPDATE_CURRENT_COLLECTION:
      return { ...state, currentCollection: payload };
      break;

    case ACTION_GET_DOUYIN_VIDEOS_BY_COLLECTION:
      const { page = 1 } = payload;
      if (parseInt(page) === 1) {
        return { ...state, isLoading: true, searchVideos: payload };
      } else {
        return { ...state, nextIsLoading: true };
      }
      break;

    case ACTION_GET_DOUYIN_VIDEOS_BY_COLLECTION_SUCCESS:
      if (payload) {
        const { page = 1, has_next = false, videos = [] } = payload;
        if (parseInt(page) === 1) {
          return {
            ...state,
            searchVideos: payload,
            isLoading: false,
            nextIsLoading: false,
          };
        } else {
          const oldData = state?.searchVideos?.videos ?? [];
          const newData = [...oldData, ...videos];
          const oldSearchVideos = state?.searchVideos ?? {};
          return {
            ...state,
            searchVideos: {
              ...oldSearchVideos,
              videos: newData,
              has_next,
              page,
            },
            isLoading: false,
            nextIsLoading: false,
          };
        }
      } else {
        return {
          ...state,
          searchVideos: [],
          isLoading: false,
          nextIsLoading: false,
        };
      }
      break;

    case ACTION_GET_ALL_COLLECTIONS_VIDEOS_SUCCESS:
      return { ...state, collectionsVideos: payload };
      break;

    case ACTION_REMOVE_VIDEO_FROM_COLLECTION:
      return { ...state, isLoading: true };
      break;

    case ACTION_REMOVE_VIDEO_FROM_COLLECTION_SUCCESS:
      if (payload) {
        const videos = state?.searchVideos?.videos;
        const newVideos = videos.filter((item) => item.post_id !== payload);
        return {
          ...state,
          searchVideos: { ...state?.searchVideos, videos: newVideos },
          isLoading: false,
        };
      }
      return { ...state, isLoading: false };
      break;

    case ACTION_SAVE_COLLECTION_SUCCESS:
      const { id = 0 } = payload;
      return {
        ...state,
        latestCollectionId: id,
      };
      break;

    case ACTION_UPDATE_CURRENT_KEYWORD:
      return {
        ...state,
        keyword: payload,
      };
      break;

    case ACTION_UPDATE_FILLTERING_SETTINGS:
      return {
        ...state,
        filteringSettings: payload,
      };
    case ACTION_FILTER_DOUYIN_VIDEOS_SUCCESS:
      return {
        ...state,
        filterData: payload,
      };
    case ACTION_FILTER_STATUS_DOUYIN_VIDEOS_SUCCESS:
      return {
        ...state,
        isFilter: payload,
      };
    case ACTION_CHANGE_LOADING_APP:
      return {
        ...state,
        nextIsLoading: payload,
      };
    case ACTION_GET_DOUYIN_VIDEOS_OF_CHANNEL_SUCCESS:
      if (payload) {
        const { offset = 0 } = payload;
        if (parseInt(offset) === 0) {
          return {
            ...state,
            // reset chosen videos
            chosenVideos: [],
            searchVideos: payload,
            isLoading: false,
            nextIsLoading: false,
          };
        } else {
          const oldData = state?.searchVideos?.videos ?? [];
          const newData = [...oldData, ...payload.videos];
          return {
            ...state,
            searchVideos: {
              ...payload,
              videos: newData,
            },
            isLoading: false,
            nextIsLoading: false,
          };
        }
      } else {
        return {
          ...state,
          searchVideos: null,
          isLoading: false,
          nextIsLoading: false,
        };
      }
      break;
    case ACTION_RESET_VIDEO:
      return {
        ...state,
        searchVideos: {
          videos: [],
        },
      };
    default:
      return state;
  }
};
export default douyinReducers;
