import {
  ACTION_CHANGE_STATUS_SEARCH,
  ACTION_GET_ALL_FANPAGE,
  ACTION_IS_LOADING,
  ACTION_SAVE_CATEGORY,
  ACTION_SAVE_PAGE,
  ACTION_SEARCH_FANPAGE,
} from '../../store/actions/Fanpages';
const initialState = {
  availableFanpage: [],
  fanpageSearchData: [],
  isFilter: '',
  isLoading: false,
  isCategory: '',
  isPage: 1,
};

const fanpagesReducers = (state = initialState, { type, payload }) => {
  switch (type) {
    case ACTION_GET_ALL_FANPAGE:
      return {
        ...state,
        availableFanpage: payload,
        fanpageSearchData: payload,
      };
    case ACTION_SEARCH_FANPAGE:
      return {
        ...state,
        fanpageSearchData: payload,
        availableFanpage: payload,
      };
    case ACTION_CHANGE_STATUS_SEARCH:
      return {
        ...state,
        isFilter: payload,
      };
    case ACTION_IS_LOADING:
      return {
        ...state,
        isLoading: payload,
      };
    case ACTION_SAVE_CATEGORY:
      return {
        ...state,
        isCategory: payload,
      };
    case ACTION_SAVE_PAGE:
      return {
        ...state,
        isPage: payload,
      };
    default:
      return state;
  }
};
export default fanpagesReducers;
