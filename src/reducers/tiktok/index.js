import {
  ACTION_GET_TIKTOK_VIDEOS,
  ACTION_GET_TIKTOK_VIDEOS_SUCCESS,
  ACTION_GET_TIKTOK_COLLECTIONS,
  ACTION_GET_TIKTOK_COLLECTIONS_SUCCESS,
  ACTION_GET_TIKTOK_FOLLOWING_CHANNELS,
  ACTION_GET_TIKTOK_FOLLOWING_CHANNELS_SUCCESS,
  ACTION_GET_TIKTOK_CHANNELS,
  ACTION_GET_TIKTOK_CHANNELS_SUCCESS,
  ACTION_GET_TIKTOK_VIDEOS_BY_CHANNEL,
  ACTION_GET_TIKTOK_VIDEOS_BY_CHANNEL_SUCCESS,
  ACTION_CHANGE_SEARCH_TYPE,
  ACTION_UPDATE_CHOSEN_VIDEOS,
  ACTION_UPDATE_CURRENT_VIDEO_TYPE,
  ACTION_UPDATE_COLLECTION_MODAL_TYPE,
  ACTION_UPDATE_COLLECTION_MODAL_OPEN,
  ACTION_UPDATE_CURRENT_COLLECTION,
  ACTION_GET_ALL_COLLECTIONS_VIDEOS_SUCCESS,
  ACTION_GET_TIKTOK_VIDEOS_BY_COLLECTION,
  ACTION_GET_TIKTOK_VIDEOS_BY_COLLECTION_SUCCESS,
  ACTION_REMOVE_VIDEO_FROM_COLLECTION,
  ACTION_REMOVE_VIDEO_FROM_COLLECTION_SUCCESS,
  ACTION_SAVE_COLLECTION_SUCCESS,
  ACTION_UPDATE_CURRENT_KEYWORD,
  ACTION_UPDATE_FILLTERING_SETTINGS,
  ACTION_UPDATE_CHANNEL_ORDER_TYPE,
  ACTION_GET_MY_VIDEOS,
  ACTION_GET_MY_VIDEOS_SUCCESS,
} from '../../store/actions/tiktok';

const initialState = {
  searchVideos: {
    videos: [],
    next_offset: 0,
    search_id: '',
    offset: 0,
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
    channels: [],
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
    scheduledType: 0,
  },
  currentChannelOrderType: 'latest',
  myVideos: null,
  isLoadingMyVideos: false,
  isNextLoadingMyVideos: false,
};

const tiktokReducers = (state = initialState, { type, payload }) => {
  switch (type) {
    case ACTION_GET_TIKTOK_VIDEOS:
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

    case ACTION_GET_TIKTOK_VIDEOS_SUCCESS:
      if (payload) {
        const {
          next_offset = 0,
          data = [],
          offset = 0,
          search_id = '',
          keyword = '',
        } = payload;
        if (parseInt(offset) === 0) {
          return {
            ...state,
            // reset chosen videos
            chosenVideos: [],
            searchVideos: {
              videos: data,
              next_offset,
              search_id,
              offset,
            },
            isLoading: false,
            nextIsLoading: false,
            keyword,
          };
        } else {
          const oldData = state?.searchVideos?.videos ?? [];
          const newData = [...oldData, ...data];
          return {
            ...state,
            searchVideos: { videos: newData, next_offset, search_id, offset },
            keyword,
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

    case ACTION_GET_TIKTOK_COLLECTIONS:
      return { ...state, isLoading: true };
      break;

    case ACTION_GET_TIKTOK_COLLECTIONS_SUCCESS:
      if (payload) {
        const { next_offset = 0, data = [], offset = 0 } = payload;
        if (parseInt(offset) === 0) {
          return { ...state, collections: payload };
        } else {
          const oldData = state?.collections?.data ?? [];
          const newData = [...oldData, ...data];
          return {
            ...state,
            collections: { data: newData, next_offset },
            // isLoading: false,
          };
        }
      } else {
        return {
          ...state,
          collections: [],
          // isLoading: false,
        };
      }
      break;

    case ACTION_GET_TIKTOK_FOLLOWING_CHANNELS:
      return { ...state, isLoading: true };
      break;

    case ACTION_GET_TIKTOK_FOLLOWING_CHANNELS_SUCCESS:
      if (payload) {
        const { next_offset = 0, data = [], offset = 0 } = payload;
        if (parseInt(offset) === 0) {
          return {
            ...state,
            followingChannels: payload,
            // isLoading: false
          };
        } else {
          const oldData = state?.followingChannels?.data ?? [];
          const newData = [...oldData, ...data];
          return {
            ...state,
            followingChannels: { data: newData, next_offset },
            // isLoading: false,
          };
        }
      } else {
        return {
          ...state,
          followingChannels: [],
          // isLoading: false,
        };
      }
      break;

    case ACTION_GET_TIKTOK_CHANNELS:
      return { ...state, isLoading: true };
      break;

    case ACTION_GET_TIKTOK_CHANNELS_SUCCESS:
      let newSearchChannel = {
        channels: [],
        next_offset: 0,
        search_id: '',
      };
      if (payload) {
        const { search_id = '', next_cursor = 0, data = [] } = payload;

        if (parseInt(next_cursor) === 20) {
          // first page
          newSearchChannel = {
            channels: data,
            next_offset: next_cursor,
            search_id,
          };
          return {
            ...state,
            searchChannel: newSearchChannel,
            isLoading: false,
          };
        } else {
          const oldData = state?.searchChannel?.channels ?? [];
          const newData = [...oldData, ...data];
          // set newdata to newSearchChannel
          newSearchChannel = {
            channels: newData,
            next_offset: next_cursor,
            search_id,
          };
          return {
            ...state,
            searchChannel: newSearchChannel,
            isLoading: false,
          };
        }
      } else {
        return { ...state, searchChannel: newSearchChannel, isLoading: false };
      }
      break;

    case ACTION_GET_TIKTOK_VIDEOS_BY_CHANNEL:
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

    case ACTION_GET_TIKTOK_VIDEOS_BY_CHANNEL_SUCCESS:
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

    case ACTION_GET_TIKTOK_VIDEOS_BY_COLLECTION:
      const { page = 1 } = payload;
      if (parseInt(page) === 1) {
        return { ...state, isLoading: true, searchVideos: payload };
      } else {
        return { ...state, nextIsLoading: true };
      }
      break;

    case ACTION_GET_TIKTOK_VIDEOS_BY_COLLECTION_SUCCESS:
      if (payload) {
        const { page = 1, has_more = false, videos = [] } = payload;
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
          return {
            ...state,
            searchVideos: {
              ...state.searchVideos,
              videos: newData,
              page,
              has_more,
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

    case ACTION_UPDATE_CHANNEL_ORDER_TYPE:
      return {
        ...state,
        currentChannelOrderType: payload,
      };

    case ACTION_GET_MY_VIDEOS:
      if (payload) {
        const { nextCursor = '' } = payload;
        if (nextCursor === '') {
          return { ...state, isLoadingMyVideos: true };
        } else {
          return { ...state, isNextLoadingMyVideos: true };
        }
      }
      return { ...state, isLoadingMyVideos: true };

    case ACTION_GET_MY_VIDEOS_SUCCESS:
      if (payload) {
        const { next_offset = 0, data = [], offset = 0 } = payload;
        if (parseInt(offset) === 0) {
          return {
            ...state,
            myVideos: payload,
            isLoadingMyVideos: false,
            isNextLoadingMyVideos: false,
          };
        } else {
          const oldData = state?.myVideos?.data ?? [];
          const newData = [...oldData, ...data];
          return {
            ...state,
            myVideos: { data: newData, next_offset },
            isLoadingMyVideos: false,
            isNextLoadingMyVideos: false,
          };
        }
      } else {
        return {
          ...state,
          myVideos: [],
          isLoadingMyVideos: false,
          isNextLoadingMyVideos: false,
        };
      }

    default:
      return state;
  }
};
export default tiktokReducers;
