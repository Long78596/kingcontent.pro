import * as types from '../../store/types/index';


const categoriesContentInitialState = {
  categoriesId: '',
  categoriesName: '',
  category: [],
  contents: [],
  totalContents: 0,
  totalFanpages: 0,
  contentDetailToShow: null,
  contentCompare: null,
  loading: true,
  totalContentsInCate: 0,
  totalPagesInCate: 0,
  uniqueFanpage: [],
  currentPage: 1,
};

const contentsReducer = (state = categoriesContentInitialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case types.GET_CATEGORIES_INFO_BY_SLUG:
      return {
        ...state,
        categoriesId: payload.cate_id,
        categoriesName: payload.cate_name,
        category: payload,
      };

    case types.GET_CONTENTS:
      const { current_page = 1, from_cate = false } = payload;
      if (current_page > 1 && !from_cate) {
        return {
          ...state,
          contents: [...state.contents, ...payload.data],
          totalContents: payload.total || 0,
          currentPage: current_page,
          totalPagesInCate: payload.last_page || 0,
        };
      }
      return {
        ...state,
        contents: payload.data,
        totalContents: payload.total || 0,
        currentPage: current_page,
        totalPagesInCate: payload.last_page || 0,
      };

    case types.GET_TOTAL_CONTENTS:
      return { ...state, totalContents: payload };
    case types.GET_UNIQUE_FANPAGE:
      return { ...state, uniqueFanpage: payload };

    case types.GET_TOTAL_FANPAGES:
      // console.log('total fanpage: '+payload);
      return { ...state, totalFanpages: payload };

    case types.SET_CONTENT_DETAIL_TO_SHOW:
      return { ...state, contentDetailToShow: payload };
    
    case types.SET_CONTENT_COMPARE:
      return { ...state, contentCompare: payload };

    case types.SET_LOADING:
      return { ...state, loading: payload };

    default:
      return state;
  }
};

export default contentsReducer;
