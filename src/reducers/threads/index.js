import {
  ACTION_GET_THREADS_VIDEOS,
  ACTION_GET_THREADS_VIDEOS_SUCCESS,
  ACTION_GET_THREADS_COLLECTIONS,
  ACTION_GET_THREADS_COLLECTIONS_SUCCESS,
  ACTION_GET_THREADS_FOLLOWING_CHANNELS,
  ACTION_GET_THREADS_FOLLOWING_CHANNELS_SUCCESS,
  ACTION_GET_THREADS_CHANNELS,
  ACTION_GET_THREADS_CHANNELS_SUCCESS,
  ACTION_GET_THREADS_VIDEOS_BY_CHANNEL,
  ACTION_GET_THREADS_VIDEOS_BY_CHANNEL_SUCCESS,
  ACTION_CHANGE_SEARCH_TYPE,
  ACTION_UPDATE_CHOSEN_VIDEOS,
  ACTION_UPDATE_CURRENT_VIDEO_TYPE,
  ACTION_UPDATE_COLLECTION_MODAL_TYPE,
  ACTION_UPDATE_COLLECTION_MODAL_OPEN,
  ACTION_UPDATE_CURRENT_COLLECTION,
  ACTION_GET_ALL_COLLECTIONS_VIDEOS_SUCCESS,
  ACTION_GET_THREADS_VIDEOS_BY_COLLECTION,
  ACTION_GET_THREADS_VIDEOS_BY_COLLECTION_SUCCESS,
  ACTION_REMOVE_VIDEO_FROM_COLLECTION,
  ACTION_REMOVE_VIDEO_FROM_COLLECTION_SUCCESS,
  ACTION_SAVE_COLLECTION_SUCCESS,
  ACTION_UPDATE_CURRENT_KEYWORD,
  ACTION_UPDATE_FILLTERING_SETTINGS,
  ACTION_FILTER_THREADS_VIDEOS_SUCCESS,
  ACTION_FILTER_STATUS_VIDEOS_SUCCESS,
  ACTION_GET_MY_POSTS,
  ACTION_GET_MY_POSTS_SUCCESS,
  ACTION_GET_THREAD_COMMENTS,
  ACTION_GET_THREAD_COMMENTS_SUCCESS,
  ACTION_POST_THREADS_COMMENT,
} from '../../store/actions/threads';

const initialState = {
  searchVideos: {
    videos: [],
    next_offset: 0,
    search_id: '',
    offset: 0,
  },
  keyword: '',
  isLoading: false,
  isLoadingCollection: false,
  isLoadingChannel: false,
  isLoadingSearchChannel: false,
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
  },
  isFilter: false,
  filterData: [],
  myPosts: null,
  isLoadingMyPosts: false,
  isNextLoadingMyPosts: false,
  replies: null,
  isLoadingReplies: false,
  isPostingReply: false,
};

const threadsReducers = (state = initialState, { type, payload }) => {
  switch (type) {
    case ACTION_GET_THREADS_VIDEOS:
      if (payload) {
        const { offset = 0 } = payload;
        if (parseInt(offset) === 0) {
          return { ...state, isLoading: true, searchVideos: payload };
        } else {
          return { ...state, nextIsLoading: true };
        }
      }
      return { ...state, isLoading: true, searchVideos: null };

    case ACTION_GET_THREADS_VIDEOS_SUCCESS:
      if (payload) {
        const {
          next_offset = 0,
          data = [],
          offset = 0,
          search_id = '',
          next_cursor,
          has_next,
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
              next_cursor,
              has_next,
            },
            isLoading: false,
            nextIsLoading: false,
          };
        } else {
          const oldData = state?.searchVideos?.videos ?? [];
          const newData = [...oldData, ...data];
          return {
            ...state,
            searchVideos: {
              videos: newData,
              next_offset,
              search_id,
              offset,
              next_cursor,
              has_next,
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

    case ACTION_GET_THREADS_COLLECTIONS:
      return { ...state, isLoadingCollection: true };

    case ACTION_GET_THREADS_COLLECTIONS_SUCCESS:
      if (payload) {
        const { next_offset = 0, data = [], offset = 0 } = payload;
        if (parseInt(offset) === 0) {
          return { ...state, collections: payload, isLoadingCollection: false };
        } else {
          const oldData = state?.collections?.data ?? [];
          const newData = [...oldData, ...data];
          return {
            ...state,
            collections: { data: newData, next_offset },
            isLoadingCollection: false,
          };
        }
      } else {
        return {
          ...state,
          collections: [],
          isLoadingCollection: false,
        };
      }

    case ACTION_GET_THREADS_FOLLOWING_CHANNELS:
      return { ...state, isLoadingChannel: true };

    case ACTION_GET_THREADS_FOLLOWING_CHANNELS_SUCCESS:
      if (payload) {
        const { next_offset = 0, data = [], offset = 0 } = payload;
        if (parseInt(offset) === 0) {
          return {
            ...state,
            followingChannels: payload,
            isLoadingChannel: false,
          };
        } else {
          const oldData = state?.followingChannels?.data ?? [];
          const newData = [...oldData, ...data];
          return {
            ...state,
            followingChannels: { data: newData, next_offset },
            isLoadingChannel: false,
          };
        }
      } else {
        return {
          ...state,
          followingChannels: [],
          isLoadingChannel: false,
        };
      }

    case ACTION_GET_THREADS_CHANNELS:
      return { ...state, isLoadingSearchChannel: true };

    case ACTION_GET_THREADS_CHANNELS_SUCCESS:
      let newSearchChannel = {
        channels: [],
        next_offset: 0,
        search_id: '',
      };
      if (payload) {
        const { search_id = '', next_cursor = 0, data = [] } = payload;
        newSearchChannel = {
          channels: payload,
          next_offset: next_cursor,
          search_id,
        };
        return {
          ...state,
          searchChannel: newSearchChannel,
          isLoadingSearchChannel: false,
        };
      } else {
        return {
          ...state,
          searchChannel: newSearchChannel,
          isLoadingSearchChannel: false,
        };
      }

    case ACTION_GET_THREADS_VIDEOS_BY_CHANNEL:
      if (payload) {
        const { offset = 0 } = payload;
        if (parseInt(offset) === 0) {
          return { ...state, isLoading: true };
        } else {
          return { ...state, nextIsLoading: true };
        }
      }
      return { ...state, isLoading: true };

    case ACTION_GET_THREADS_VIDEOS_BY_CHANNEL_SUCCESS:
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

    case ACTION_CHANGE_SEARCH_TYPE:
      return { ...state, searchType: payload };

    case ACTION_UPDATE_CHOSEN_VIDEOS:
      return { ...state, chosenVideos: payload };

    case ACTION_UPDATE_CURRENT_VIDEO_TYPE:
      return { ...state, videoType: payload };

    case ACTION_UPDATE_COLLECTION_MODAL_TYPE:
      return { ...state, modalCollectionType: payload };

    case ACTION_UPDATE_COLLECTION_MODAL_OPEN:
      return { ...state, modalCollectionOpen: payload };

    case ACTION_UPDATE_CURRENT_COLLECTION:
      return { ...state, currentCollection: payload };

    case ACTION_GET_THREADS_VIDEOS_BY_COLLECTION:
      const { page = 1 } = payload;
      if (parseInt(page) === 1) {
        return { ...state, isLoading: true, searchVideos: payload };
      } else {
        return { ...state, nextIsLoading: true };
      }

    case ACTION_GET_THREADS_VIDEOS_BY_COLLECTION_SUCCESS:
      if (payload) {
        return {
          ...state,
          searchVideos: { videos: payload, has_next: false },
          isLoading: false,
          nextIsLoading: false,
        };
      }

    case ACTION_GET_ALL_COLLECTIONS_VIDEOS_SUCCESS:
      return { ...state, collectionsVideos: payload };

    case ACTION_REMOVE_VIDEO_FROM_COLLECTION:
      return { ...state, isLoading: true };

    case ACTION_REMOVE_VIDEO_FROM_COLLECTION_SUCCESS:
      if (payload) {
        const videos = state?.searchVideos?.videos || [];
        const newVideos = videos.filter((item) => item.post_id !== payload);
        return {
          ...state,
          searchVideos: { ...state?.searchVideos, videos: newVideos },
          isLoading: false,
        };
      }
      return { ...state, isLoading: false };

    case ACTION_SAVE_COLLECTION_SUCCESS:
      const { id = 0 } = payload;
      return {
        ...state,
        latestCollectionId: id,
      };

    case ACTION_UPDATE_CURRENT_KEYWORD:
      return {
        ...state,
        keyword: payload,
      };
    case ACTION_FILTER_THREADS_VIDEOS_SUCCESS:
      return {
        ...state,
        filterData: payload,
      };
    case ACTION_FILTER_STATUS_VIDEOS_SUCCESS:
      // reset filterSettings when payload is false
      if (!payload) {
        return {
          ...state,
          isFilter: payload,
          filteringSettings: {
            order: 0,
            orderType: 0,
            length: 0,
            videoType: 0,
          },
        };
      }
      return {
        ...state,
        isFilter: payload,
      };

    case ACTION_UPDATE_FILLTERING_SETTINGS:
      return {
        ...state,
        filteringSettings: payload,
      };

    case ACTION_GET_MY_POSTS:
      return {
        ...state,
        isLoadingMyPosts: payload ? false : true,
        isNextLoadingMyPosts: payload ? true : false,
      };

    case ACTION_GET_MY_POSTS_SUCCESS:
      const { nextPage = false } = payload;
      if (nextPage) {
        const oldData = state?.myPosts?.posts ?? [];
        const newData = [...oldData, ...payload.posts];
        return {
          ...state,
          myPosts: {
            ...payload,
            posts: newData,
          },
          isLoadingMyPosts: false,
          isNextLoadingMyPosts: false,
        };
      } else {
        return {
          ...state,
          myPosts: payload,
          isLoadingMyPosts: false,
          isNextLoadingMyPosts: false,
        };
      }

    case ACTION_GET_THREAD_COMMENTS:
      return {
        ...state,
        isLoadingReplies: true,
      };

    case ACTION_GET_THREAD_COMMENTS_SUCCESS:
      const { isGetMore = false } = payload;
      if (isGetMore) {
        return {
          ...state,
          isLoadingReplies: false,
          replies: {
            ...state.replies,
            ...payload,
          },
        };
      }
      return {
        ...state,
        isLoadingReplies: false,
        replies: payload,
      };

    case ACTION_POST_THREADS_COMMENT:
      return {
        ...state,
        isPostingReply: payload,
      };

    default:
      return state;
  }
};
export default threadsReducers;
