import * as types from '../../store/types/categories';

const categoriesInitialState = {
  parentCategories: [],
  childCategories: [],
  takeCareFBCategories: [],
  totalContents: 0,
  totalFanpages: 0,
};

const CategoriesReducer = (state = categoriesInitialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case types.GET_PARENT_CATEGORIES:
      return { ...state, parentCategories: payload };

    case types.GET_CHILD_CATEGORIES:
      return { ...state, childCategories: payload };

    case types.GET_TAKE_CARE_FB_CATEGORIES:
      return { ...state, takeCareFBCategories: payload };

    default:
      return state;
  }
};

export default CategoriesReducer;
