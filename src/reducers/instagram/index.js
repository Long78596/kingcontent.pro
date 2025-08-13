import {
  INSTAGRAM_GET_COLLECTIONS,
  INSTAGRAM_GET_COLLECTIONS_SUCCESS,
  INSTAGRAM_GET_COLLECTION_DETAIL,
  INSTAGRAM_GET_COLLECTION_DETAIL_SUCCESS,
  INSTAGRAM_GET_COLLECTION_POSTS,
  INSTAGRAM_GET_COLLECTION_POSTS_SUCCESS,
  INSTAGRAM_GET_HASHTAG_POSTS,
  INSTAGRAM_GET_HASHTAG_POSTS_SUCCESS,
  INSTAGRAM_GET_REEL_DETAIL,
  INSTAGRAM_GET_REEL_DETAIL_SUCCESS,
  INSTAGRAM_GET_USERS,
  INSTAGRAM_GET_USERS_SUCCESS,
  INSTAGRAM_GET_USER_POSTS,
  INSTAGRAM_GET_USER_POSTS_SUCCESS,
  INSTAGRAM_GET_USER_REELS,
  INSTAGRAM_GET_USER_REELS_SUCCESS,
  INSTAGRAM_GET_USER_SAVED,
  INSTAGRAM_GET_USER_SAVED_SUCCESS,
  INSTAGRAM_SET_COLLECTION_MODAL_OPEN,
  INSTAGRAM_SET_COLLECTION_SAVE_LOADING,
  INSTAGRAM_SET_COLLECTION_TYPE,
  INSTAGRAM_SET_CURRENT_COLLECTION,
  INSTAGRAM_SET_CURRENT_CONTENT,
  INSTAGRAM_SET_CURRENT_CONTENT_TYPE,
  INSTAGRAM_SET_CURRENT_KEYWORD,
  INSTAGRAM_SET_CURRENT_USER,
  INSTAGRAM_SET_ORDER_DIR,
  INSTAGRAM_SET_ORDER_TYPE,
  INSTAGRAM_SET_SCHEDULE_FILTER,
  INSTAGRAM_UPDATE_CHOSEN_POSTS,
} from '../../store/actions/instagram';

const initialState = {
  loadingUsers: false,
  loadingReels: false,
  loadingFeeds: false,
  loadingDetail: false,
  loadingSavedUsers: false,
  loadingCollections: false,
  loadingCollectionDetail: false,
  nextIsLoading: false,
  loadingSaveCollection: false,
  users: [],
  reels: null,
  posts: null,
  reelDetail: null,
  currentUser: null,
  currentContent: null,
  savedUsers: null,
  collections: null,
  collectionPosts: null,
  collectionDetail: null,
  modalCollectionType: 'add',
  modalCollectionOpen: false,
  currentCollection: null,
  chosenPosts: [],
  currentSearchKeyword: '',
  currentContentType: 'post',
  orderType: '',
  orderDir: 0,
  scheduleFilter: 0,
  currentHashTag: '',
  hashTagNextCursor: '',
};

const instagramReducers = (state = initialState, { type, payload }) => {
  switch (type) {
    case INSTAGRAM_GET_HASHTAG_POSTS:
      const { next_page: next_page_hashtag = false, hashtag = '' } = payload;

      return {
        ...state,
        currentHashTag: hashtag,
        loadingFeeds: !next_page_hashtag,
        nextIsLoading: next_page_hashtag,
      };

    case INSTAGRAM_GET_HASHTAG_POSTS_SUCCESS:
      const { data = {}, next_page: next_page_hashtag_success = false, next_cursor: next_cursor_hashtag = '' } =
        payload;
      if (next_page_hashtag_success) {
        let posts = state.posts;
        // merge new data with old data without duplicate
        posts.items = [
          ...posts.items,
          ...data.items.filter(
            (item) => !posts.items.some((post) => post.id === item.id)
          ),
        ];
        return { ...state, posts, loadingFeeds: false, nextIsLoading: false, hashTagNextCursor: next_cursor_hashtag };
      }
      return {
        ...state,
        posts: data,
        loadingFeeds: false,
        nextIsLoading: false,
        hashTagNextCursor: next_cursor_hashtag
      };

    case INSTAGRAM_GET_USERS:
      return { ...state, loadingUsers: true, currentHashTag: '' };

    case INSTAGRAM_GET_USERS_SUCCESS:
      return { ...state, loadingUsers: false, users: payload };

    case INSTAGRAM_GET_USER_POSTS:
      const { isNext = false } = payload;
      if (isNext) {
        return { ...state, nextIsLoading: true, currentHashTag: '' };
      } else {
        return { ...state, loadingFeeds: true, currentHashTag: '' };
      }

    case INSTAGRAM_GET_USER_POSTS_SUCCESS:
      const {
        next_page = false,
        items = [],
        has_next = false,
        next_cursor = '',
      } = payload;
      if (next_page) {
        let posts = state.posts;
        posts.items = [...posts.items, ...items];
        posts.has_next = has_next;
        posts.next_cursor = next_cursor;
        return {
          ...state,
          loadingFeeds: false,
          posts: posts,
          nextIsLoading: false,
        };
      } else {
        return {
          ...state,
          loadingFeeds: false,
          posts: payload,
          nextIsLoading: false,
        };
      }

    case INSTAGRAM_GET_USER_REELS:
      const { reelsIsNext = false } = payload;
      if (reelsIsNext) {
        return { ...state, nextIsLoading: true, currentHashTag: '' };
      } else {
        return { ...state, loadingReels: true, currentHashTag: '' };
      }

    case INSTAGRAM_GET_USER_REELS_SUCCESS:
      const {
        reels_next_page = false,
        reels_items = [],
        reels_has_next = false,
        reels_next_cursor = '',
      } = payload;
      if (reels_next_page) {
        let reels = state.reels;
        return {
          ...state,
          loadingReels: false,
          reels: {
            ...reels,
            items: [...reels.items, ...reels_items],
            has_next: reels_has_next,
            next_cursor: reels_next_cursor,
          },
          nextIsLoading: false,
        };
      } else {
        return {
          ...state,
          loadingReels: false,
          reels: payload,
          nextIsLoading: false,
        };
      }

    case INSTAGRAM_GET_REEL_DETAIL:
      return { ...state, loadingDetail: true };

    case INSTAGRAM_GET_REEL_DETAIL_SUCCESS:
      return { ...state, loadingDetail: false, reelDetail: payload };

    case INSTAGRAM_SET_CURRENT_USER:
      // check if new user is different from current user
      if (payload && state.currentUser && payload.id === state.currentUser.id) {
        return state;
      } else {
        return { ...state, currentUser: payload, posts: null, reels: null };
      }

    case INSTAGRAM_SET_CURRENT_CONTENT:
      return { ...state, currentContent: payload };

    case INSTAGRAM_GET_USER_SAVED:
      return { ...state, loadingSavedUsers: true, savedUsers: null };

    case INSTAGRAM_GET_USER_SAVED_SUCCESS:
      return { ...state, loadingSavedUsers: false, savedUsers: payload };

    case INSTAGRAM_GET_COLLECTIONS:
      return { ...state, collections: null, loadingCollections: true };

    case INSTAGRAM_GET_COLLECTIONS_SUCCESS:
      return { ...state, collections: payload, loadingCollections: false };

    case INSTAGRAM_GET_COLLECTION_DETAIL:
      // check if new collection is different from current collection
      if (state.collectionDetail && payload === state.collectionDetail.id) {
        return state;
      } else {
        return {
          ...state,
          collectionDetail: null,
          loadingCollectionDetail: true,
        };
      }

    case INSTAGRAM_GET_COLLECTION_DETAIL_SUCCESS:
      return {
        ...state,
        collectionDetail: payload,
        loadingCollectionDetail: false,
      };

    case INSTAGRAM_SET_CURRENT_KEYWORD:
      return { ...state, currentSearchKeyword: payload };

    case INSTAGRAM_SET_CURRENT_COLLECTION:
      return { ...state, currentCollection: payload };

    case INSTAGRAM_GET_COLLECTION_POSTS:
      return { ...state, collectionPosts: null };

    case INSTAGRAM_GET_COLLECTION_POSTS_SUCCESS:
      return { ...state, collectionPosts: payload };

    case INSTAGRAM_UPDATE_CHOSEN_POSTS:
      return { ...state, chosenPosts: payload };

    case INSTAGRAM_SET_CURRENT_CONTENT_TYPE:
      return { ...state, currentContentType: payload };

    case INSTAGRAM_SET_COLLECTION_MODAL_OPEN:
      return { ...state, modalCollectionOpen: payload };

    case INSTAGRAM_SET_COLLECTION_TYPE:
      return { ...state, modalCollectionType: payload };

    case INSTAGRAM_SET_COLLECTION_SAVE_LOADING:
      return { ...state, loadingSaveCollection: payload };

    case INSTAGRAM_SET_ORDER_TYPE:
      return { ...state, orderType: payload };

    case INSTAGRAM_SET_ORDER_DIR:
      return { ...state, orderDir: payload };

    case INSTAGRAM_SET_SCHEDULE_FILTER:
      return { ...state, scheduleFilter: payload };

    default:
      return state;
  }
};
export default instagramReducers;
