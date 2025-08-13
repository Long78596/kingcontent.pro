import { counter } from '@fortawesome/fontawesome-svg-core';
// import Avatar from '../../assets/images/editor/avatar.jpg';
import * as types from '../../store/types/index';
const defaultFeedbackSettings = {
  branchName: 'Viettel',
  clock: '18:16',
  battery: '19',
  customerName: 'Duong Thinh',
  activity: 'Đang hoạt động',
  // avatar: Avatar,
};

const defaultFeedbacksType = 'messenger';

const editorInitialState = {
  createdContents: [],
  feedbackContents: [],
  trendContents: [],
  feedbackKeywords: [],
  specialContents: [],
  columnContent: [],
  parentCategories: [],
  childCategories: [],
  googleSubjects: [],
  charts: [],
  chartDetails: [],
  selectedCatId: 0,
  isShowCategories: false,
  isShowFeedbacksForm: false,
  feedbacksType: defaultFeedbacksType,
  feedbackSettings: defaultFeedbackSettings,
  listMessages: [],
  createdContentSuccess: false,
  currentContentType: 'manual',
  savedFeedbacks: [],
  currentFeedback: 0,
};

const editorReducer = (state = editorInitialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case types.GET_CREATED_CONTENTS:
      const tempsColumn = [];
      const contentTypes = [
        'manual',
        'formular',
        'feedback',
        'special',
        'trend',
      ];
      const column = { title: '', type: '', totalContent: 0, contents: [] };
      contentTypes.forEach((contentType) => {
        switch (contentType) {
          case 'manual':
            column.title = 'Viết tự do';
            break;
          case 'formular':
            column.title = 'Viết theo công thức';
            break;
          case 'feedback':
            column.title = 'Tạo feedback';
            break;
          case 'special':
            column.title = 'Theo dõi đặc biệt';
            break;
          case 'trend':
            column.title = 'Đu trend';
            break;
          default:
            return;
        }
        column.type = contentType;
        if (payload && payload.length > 0) {
          column.contents = destructContentType(contentType, payload);
          column.totalContent = destructContentType(
            contentType,
            payload
          ).length;
        }
        tempsColumn.push({ ...column });
      });
      return { ...state, createdContents: payload, columnContent: tempsColumn };

    case types.GET_FEEDBACK_SUGGESTIONS:
      return { ...state, feedbackContents: payload };

    case types.GET_TREND_SUGGESTIONS:
      return { ...state, trendContents: payload };

    case types.GET_FEEDBACK_KEYWORDS:
      return { ...state, feedbackKeywords: payload };

    case types.GET_GOOGLE_SUBJECTS:
      return { ...state, googleSubjects: payload };

    case types.GET_100_DON_CHARTS:
      return { ...state, charts: payload };

    case types.GET_100_DON_DETAILS:
      return { ...state, chartDetails: payload };

    case types.GET_ALL_CATEGORIES:
      if (payload && payload.length > 0) {
        const childCats = destructChildCats(payload);
        const parentCats = destructParentCats(payload);
        return {
          ...state,
          parentCategories: parentCats,
          childCategories: childCats,
        };
      }

    case types.CHANGE_STATE_CATEGORIES_POPUP:
      return { ...state, isShowCategories: payload };

    case types.CHANGE_STATE_FEEDBACKS_FORM:
      return { ...state, isShowFeedbacksForm: payload };

    case types.CHANGE_STATE_FEEDBACKS_TYPE:
      return { ...state, feedbacksType: payload };

    case types.CHANGE_STATE_SELECTED_CAT:
      return { ...state, selectedCatId: payload };

    case types.CHANGE_FEEDBACK_SETTINGS:
      return { ...state, feedbackSettings: payload };

    case types.PUSH_FEEDBACK_MESSAGE:
      const listMessages = state.listMessages || [];
      let newPayload = payload;
      const { id } = newPayload;
      if (id === 0) {
        newPayload = { ...payload, id: listMessages.length + 1 };
      }
      const newListMessages = [...listMessages, newPayload];

      return { ...state, listMessages: newListMessages };

    case types.REMOVE_FEEDBACK_MESSAGE:
      const newListMessages1 = state.listMessages.filter(function (item) {
        const { id } = item;
        if (id !== payload) return item;
      });
      return { ...state, listMessages: newListMessages1 };

    case types.UPDATE_FEEDBACK_MESSAGE:
      const updatedListMessages = state.listMessages.map((el) =>
        el.id === payload.id ? payload : el
      );
      return { ...state, listMessages: updatedListMessages };

    case types.RESET_FEEDBACK_DATA:
      return {
        ...state,
        listMessages: [],
        feedbackSettings: defaultFeedbackSettings,
        feedbacksType: defaultFeedbacksType,
      };

    case types.SAVE_FEEDBACK_DATA:
      const {
        savedFeedbacks = [],
        currentFeedback = 0,
        feedbackSettings = defaultFeedbackSettings,
        feedbacksType = 'meesenger',
        listMessages: newListMessages2 = [],
      } = state;
      if (currentFeedback === 0) {
        const newSavedFeedbacks = [
          ...savedFeedbacks,
          {
            feedbackSettings,
            feedbacksType,
            listMessages: newListMessages2,
            id: savedFeedbacks.length + 1,
          },
        ];
        return { ...state, savedFeedbacks: newSavedFeedbacks };
      } else {
        const newSavedFeedbacks = savedFeedbacks.map((el) =>
          el.id === currentFeedback
            ? {
                feedbackSettings,
                feedbacksType,
                listMessages: newListMessages2,
              }
            : el
        );
      }

    case types.CREATED_USER_CONTENT:
      return { ...state, createdContentSuccess: true };

    case types.SET_CURRENT_FEEDBACK:
      const { savedFeedbacks: savedFeedbacks1 = [] } = state;
      const feedback = savedFeedbacks1.find((item) => item.id === payload);
      if (feedback) {
        return {
          ...state,
          feedbackSettings: feedback.feedbackSettings,
          feedbacksType: feedback.feedbacksType,
          listMessages: feedback.listMessages,
          currentFeedback: payload,
        };
      }
      return { ...state, currentFeedback: payload };

    case types.SET_CONTENT_TYPE:
      return { ...state, currentContentType: payload };

    default:
      return state;
  }
};

const destructContentType = (type, contents = []) => {
  const returnData = [...contents].reduce((acc, content) => {
    let { type: contentType } = content;
    if (contentType === '') contentType = 'manual';
    if (contentType === type) acc.push(content);
    return acc;
  }, []);
  return returnData;
};

const destructParentCats = (categories) => {
  const returnData = [...categories].reduce((acc, cat) => {
    let { parent } = cat;
    if (parent === null) acc.push(cat);
    return acc;
  }, []);
  return returnData;
};

const destructChildCats = (categories) => {
  const returnData = [...categories].reduce((acc, cat) => {
    let { parent } = cat;
    if (parent !== null) acc.push(cat);
    return acc;
  }, []);
  return returnData;
};

export default editorReducer;
