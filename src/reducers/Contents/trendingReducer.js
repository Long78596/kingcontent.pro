import {
  ACTION_GET_POST_TAB_RIGHT,
  RESET_TRENDING,
} from '../../store/actions/createContent';
import * as types from '../../store/types/index';

const trendingReducerInitialState = {
  trendings: [],
  _trendings: [],
  totalTrendings: 0,
  keywords: '',
  totalPages: 0,
  page: 1,
  isLoadingTrends: false,
};

const trendingReducer = (state = trendingReducerInitialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case types.SET_LOADING:
      return { ...state, isLoadingTrends: payload };

    case types.GET_TOTAL_TRENDING_CONTENTS:
      return { ...state, totalTrendings: payload };

    case types.SET_KEYWORDS_SEARCH_TRENDINGS:
      return { ...state, keywords: payload };

    case types.GET_TRENDING_WITH_KEYWORDS:
      const { contents, totalPages, page, fromSchedule = false } = payload;
      if (page === 1) {
        return { ...state, trendings: contents, totalPages, page };
      } else {
        return {
          ...state,
          trendings: fromSchedule
            ? [...state.trendings, ...contents]
            : contents,
          totalPages,
          page,
        };
      }
      break;

    case types.GET__TRENDING_WITH_KEYWORDS:
      return { ...state, _trendings: payload };

    case ACTION_GET_POST_TAB_RIGHT:
      const dataArr = state.trendings.concat(action.payload);
      return { ...state, trendings: dataArr };

    case RESET_TRENDING:
      return { ...state, trendings: [], totalPages: 0, page: 1 };

    default:
      return state;
  }
};

export default trendingReducer;
