import {
  ACTION_EMPTY_ARR_SEARCH,
  ACTION_SEARCH_ADS,
  ACTION_UPDATE_KEYWORD,
} from '../../store/actions/runningAds';

const initialState = {
  availabelADS: [],
  searchADSData: [],
  keyword: '',
};

const runningAdsReducers = (state = initialState, { type, payload }) => {
  switch (type) {
    case ACTION_UPDATE_KEYWORD:
      return { ...state, keyword: payload };

    case ACTION_SEARCH_ADS:
      const { first_page = false } = payload;
      if (first_page) {
        return { ...state, searchADSData: payload };
      }
      // append results to exists data
      const { results = [] } = payload;
      const { searchADSData } = state;
      const { results: existsResults = [] } = searchADSData;
      const newResults = [...existsResults, ...results];
      const newSearchADSData = {
        ...searchADSData,
        results: newResults,
        collection_token: payload.collection_token,
        forward_cursor: payload.forward_cursor,
      };
      return { ...state, searchADSData: newSearchADSData };

    case ACTION_EMPTY_ARR_SEARCH:
      return { ...state, searchADSData: payload };
    default:
      return state;
  }
};
export default runningAdsReducers;
