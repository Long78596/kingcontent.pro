import {
  ACTION_GET_CHOSEN_CATEGORIES,
  ACTION_GET_MY_TOPIC_HOMEPAGE,
  ACTION_GET_TRENDDING,
  ACTION_SELECY_CATE_HOME_PAGE,
} from '../../store/actions/homepage';
import {
  GET_SCHEDULE_HOME_PAGE,
  GET_SCHEDULE_HOME_PAGE_SUCCESS,
} from '../../store/actions/Schedules';
import * as types from '../../store/types/homepage';

const homepageInitialState = {
  fanpages: [],
  contents: [],
  polularTags: [],
  specialFanpages: [],
  specialContents: [],
  selectedCats: [],
  schedules: [],
  trendding: [],
  mytopic: [],
  topicSelected: {},
  chosenCategories: [],
  loadingScheduleContents: false,
};

const homepageReducer = (state = homepageInitialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case types.GET_POPULAR_TAGS:
      return { ...state, polularTags: payload };

    case types.GET_TAGS_BY_KEYWORD:
      return { ...state, contents: payload };

    case types.GET_FANPAGES_BY_KEYWORD:
      return { ...state, fanpages: payload };

    case types.GET_SPECIAL_FANPAGES:
      return { ...state, specialFanpages: payload };

    case types.GET_SPECIAL_CONTENTS:
      return { ...state, specialContents: payload };

    case types.SET_SELECTED_CATEGORY_IDS:
      return { ...state, selectedCats: payload };

    case GET_SCHEDULE_HOME_PAGE:
      return { ...state, loadingScheduleContents: true };

    case GET_SCHEDULE_HOME_PAGE_SUCCESS:
      return { ...state, schedules: payload, loadingScheduleContents: false };

    case ACTION_GET_TRENDDING:
      return { ...state, trendding: payload };

    case ACTION_GET_MY_TOPIC_HOMEPAGE:
      return { ...state, mytopic: payload };

    case ACTION_SELECY_CATE_HOME_PAGE:
      return { ...state, topicSelected: payload };

    case ACTION_GET_CHOSEN_CATEGORIES:
      return { ...state, chosenCategories: payload };

    default:
      return state;
  }
};

export default homepageReducer;
