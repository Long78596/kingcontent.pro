import { CompositeDecorator, convertToRaw } from 'draft-js';
import { EditorState } from 'draft-js';
import {
  ACTION_ADD_IMAGE,
  ACTION_CREATE_CONTENT_SCHEDULE,
  ACTION_GET_BANK_QUESTION,
  ACTION_GET_DESIGN_CATEGORIES,
  ACTION_GET_CHART,
  ACTION_GET_GOOGLE_SUBJECTS,
  ACTION_GET_HISTORY_QUESTION,
  ACTION_GET_IEAD_WORD,
  ACTION_GET_DESIGNS,
  ACTION_GET_POST_BY_KEY,
  ACTION_GET_POST_CATE,
  ACTION_GET_TAG,
  ACTION_GET_TITLE,
  ACTION_GET_TITLE_CHILD,
  ACTION_QUESTION_CHAT_GPT,
  ACTION_RESET_CONTENT,
  ACTION_RESET_STATE,
  ACTION_SAVE_TITLE_OBJ,
  ACTION_SELECT_CATEGORY,
  ACTION_SPECIAL_TRACK,
  ACTION_TOGGLE_POPUP_SELECT_CATE,
  ACTION_UPDATE_AVAILABLE_CONTENT,
  ACTION_UPDATE_CHECK_VPCS,
  ACTION_UPDATE_KEY_HAS_IN_CONTENT,
  ACTION_UPDATE_PROPS_CREATE_CONTENT,
  ACTION_UPDATE_STEP_1,
  ACTION_UPDATE_STEP_2,
  ACTION_UPDATE_SYNC_REQUEST_LIST,
  DELETE_IMAGES,
  REPLACE_CONTENT,
  UPDATE_EDITOR_STATE,
  UPDATE_VPCS_KEY,
} from '../../store/actions/createContent';
import {
  GET_FACEBOOK_PRESETS,
  GET_FACEBOOK_PRESETS_SUCCESS,
  SET_IS_ACTIVE_PRESET,
  SET_SELECTED_FACEBOOK_PRESET,
} from '../../store/types/index';

let words = [];
const Decorated = ({ children }) => {
  return (
    <span className="isVPCS-text" style={{ background: 'red', color: '#fff' }}>
      {children}
    </span>
  );
};

function findWithRegex(words, contentBlock, callback) {
  const text = contentBlock.getText();
  words.forEach((word) => {
    const matches = [...text.matchAll(word)];
    matches.forEach((match) =>
      callback(match.index, match.index + match[0].length)
    );
  });
}

function handleStrategy(contentBlock, callback) {
  findWithRegex(words, contentBlock, callback);
}

const createDecorator = () =>
  new CompositeDecorator([
    {
      strategy: handleStrategy,
      component: Decorated,
    },
  ]);
let isCheckVPCS = false;
export const KEY_LABEL_SELECT = 'labelSelect';
export const KEY_TAG_SELECT = 'tagSelect';
export const KEY_PLANS = 'plans';
export const KEY_HASH_TAG_PLANS = 'hashTagPlans';
export const KEY_PLAN_SELECT = 'planSelect';
export const KEY_PLAN_DATA = 'planData';
export const KEY_IMAGE_SELECT = 'imageSelect';
export const KEY_LABELS = 'labels';
export const KEY_ITEM_EDIT = 'itemEdit';
export const KEY_NOTE = 'note';
export const KEY_IMAGES = 'image';
export const KEY_SCRIPTED_CREATION = 'scriptedCreation';
export const KEY_EDITOR_IMAGE = 'editorImage';
export const KEY_INDEX_IMAGE_SELECT = 'indexImageSelect';
export const KEY_HASH_VIDEO_OR_IMAGE = 'hashVideoOrImage';
export const KEY_ELEMENTS_IMAGES = 'elements';

const initialState = {
  contentTitle: [],
  titleObjet: [],
  titleChild: [],
  subjects: [],
  postByKey: [],
  posts: [],
  chartTrending: [],
  categorySelect: '',
  imageSelect: [],
  designs: [],
  designCurrentPage: 1,
  designTotalPages: 1,
  categoriesDesignAvailable: [],
  keyworksCheck: [],
  keyWordsHasInContent: [],
  isCheckVPCS: false,
  editorState: EditorState.createEmpty(createDecorator()),
  textContent: '',
  wordIdea: [],
  contentAvailabel: '',
  specialTrackContent: [],
  isOpenCatePopUp: false,
  chatGPTdata: [],
  syncRequestPedding: [],
  bankQuestionList: [],
  historyQuestionList: [],
  tagList: [],
  isCreateToHomepage: {
    status: false,
    question: '',
    type: 'gochat',
  },
  isReels: false,
  step_1: true,
  step_2: false,
  [KEY_SCRIPTED_CREATION]: false,
  [KEY_LABEL_SELECT]: null,
  [KEY_TAG_SELECT]: {},
  [KEY_PLANS]: [],
  [KEY_HASH_TAG_PLANS]: [],
  [KEY_PLAN_SELECT]: null,
  [KEY_LABELS]: null,
  [KEY_ITEM_EDIT]: {},
  [KEY_NOTE]: '',
  [KEY_IMAGES]: [],
  [KEY_HASH_VIDEO_OR_IMAGE]: null,
  [KEY_EDITOR_IMAGE]: null,
  [KEY_INDEX_IMAGE_SELECT]: null,
  [KEY_ELEMENTS_IMAGES]: [],
  newCreatedContentId: 0,
  isSaving: false,
  facebookPresets: [],
  isLoadingFacebookPresets: false,
  facebookPresetsCurrentPage: 1,
  facebookPresetsTotalPages: 1,
  selectedFacebookPreset: null,
  isActivePreset: false,
  threadsChatGptData: [],
};

export const createPostReducers = (state = initialState, action) => {
  let _draftState = { ...state };
  const { type, payload } = action;
  switch (type) {
    case ACTION_GET_TITLE:
      return { ...state, contentTitle: payload };
    case ACTION_SAVE_TITLE_OBJ:
      return { ...state, titleObjet: payload };
    case ACTION_GET_TITLE_CHILD:
      return { ...state, titleChild: payload };
    case ACTION_GET_GOOGLE_SUBJECTS:
      return { ...state, subjects: payload };
    case ACTION_GET_POST_BY_KEY:
      return { ...state, postByKey: payload };
    case ACTION_GET_POST_CATE:
      const dataArr = state.posts.concat(payload);
      const unique = dataArr
        .map((e) => e['title'])
        // store the keys of the unique objects
        .map((e, i, final) => final.indexOf(e) === i && i)
        // eliminate the dead keys & store unique objects
        .filter((e) => dataArr[e] && dataArr[e].title.split(' ').length > 15)
        .map((e) => dataArr[e]);
      const stringArrr = unique.map((_elt) => {
        return {
          ..._elt,
          title: _elt.title.replace(/[^\p{L}\p{N}\p{P}\p{Z}^$\n]|br/gu, ' '),
        };
      });
      return { ...state, posts: stringArrr };
    case ACTION_GET_CHART:
      return { ...state, chartTrending: payload };
    case ACTION_SELECT_CATEGORY:
      return { ...state, categorySelect: payload };

    case ACTION_ADD_IMAGE:
      const { feedbackId, type } = payload;
      const { imageSelect = [] } = state;
      if (feedbackId) {
        const index = imageSelect.findIndex(
          (item) => item.feedbackId === feedbackId
        );
        if (index !== -1) {
          const arr = [...imageSelect];
          arr[index] = payload;
          return { ...state, imageSelect: arr };
        }
      }
      if (type === 'feedback') payload.feedbackId = imageSelect.length + 1;
      const arr = [...imageSelect, payload];
      return { ...state, imageSelect: arr };
    case ACTION_GET_DESIGNS:
      const { data = [], current_page, last_page } = payload;
      if (state.designCurrentPage < current_page) {
        return {
          ...state,
          designs: [...state.designs, ...data],
          designCurrentPage: current_page,
          designTotalPages: last_page,
        };
      }
      return {
        ...state,
        designs: data,
        designCurrentPage: payload?.current_page,
        designTotalPages: payload?.last_page,
      };
    case ACTION_GET_IEAD_WORD:
      return { ...state, wordIdea: payload };
    case ACTION_TOGGLE_POPUP_SELECT_CATE:
      return { ...state, isOpenCatePopUp: payload };
    case DELETE_IMAGES:
      return { ...state, imageSelect: payload };
    case ACTION_GET_DESIGN_CATEGORIES:
      return { ...state, categoriesDesignAvailable: payload };
    case ACTION_UPDATE_AVAILABLE_CONTENT:
      return { ...state, contentAvailabel: payload };
    case UPDATE_EDITOR_STATE:
      const blocks = convertToRaw(payload.getCurrentContent()).blocks;
      const value = blocks.map((block) => block.text).join('\n');
      return {
        ...state,
        editorState: payload,
        textContent: value,
      };
    case REPLACE_CONTENT:
      const contents = convertToRaw(payload.getCurrentContent()).blocks;
      const result = contents.map((block) => block.text).join('\n');
      return {
        ...state,
        editorState: payload,
        textContent: result,
      };

    case UPDATE_VPCS_KEY:
      words = payload.map((_elt) => _elt.original);
      return {
        ...state,
        keyworksCheck: payload,
      };
    case ACTION_QUESTION_CHAT_GPT:
      return { ...state, chatGPTdata: payload };
    case ACTION_GET_BANK_QUESTION:
      return { ...state, bankQuestionList: payload };
    case ACTION_GET_HISTORY_QUESTION:
      return { ...state, historyQuestionList: payload };
    case ACTION_GET_TAG:
      return { ...state, tagList: payload };
    case ACTION_RESET_STATE:
      return {
        ...state,
        contentTitle: [],
        titleObjet: [],
        titleChild: [],
        subjects: [],
        postByKey: [],
        posts: [],
        chartTrending: [],
        isCheckVPCS: false,
      };
    case ACTION_UPDATE_CHECK_VPCS:
      return { ...state, isCheckVPCS: payload };
    case ACTION_UPDATE_KEY_HAS_IN_CONTENT:
      return { ...state, keyWordsHasInContent: payload };
    case ACTION_UPDATE_SYNC_REQUEST_LIST:
      return { ...state, syncRequestPedding: payload };
    case ACTION_CREATE_CONTENT_SCHEDULE:
      return { ...state, isCreateToHomepage: payload };
    case ACTION_UPDATE_STEP_1:
      return { ...state, step_1: payload };
    case ACTION_UPDATE_STEP_2:
      return {
        ...state,
        step_2: payload.status,
        step_2_auto_refresh: payload.auto_refresh
      };
    case ACTION_SPECIAL_TRACK:
      return {
        ...state,
        specialTrackContent: payload,
      };
    case ACTION_UPDATE_PROPS_CREATE_CONTENT:
      for (let item of payload) {
        const { prop, value } = item;
        _draftState[prop] = value;
      }
      return _draftState;

    case ACTION_RESET_CONTENT:
      return {
        ...state,
        imageSelect: [],
        editorState: EditorState.createEmpty(createDecorator()),
        textContent: '',
        contentAvailabel: '',
      };

    case GET_FACEBOOK_PRESETS:
      return { ...state, isLoadingFacebookPresets: true };

    case GET_FACEBOOK_PRESETS_SUCCESS:
      const {
        data: facebookPresetsData = [],
        current_page: currentPage,
        last_page: totalPages,
      } = payload;
      return {
        ...state,
        facebookPresets:
          currentPage > 1
            ? [...state.facebookPresets, ...facebookPresetsData]
            : facebookPresetsData,
        isLoadingFacebookPresets: false,
        facebookPresetsCurrentPage: currentPage,
        facebookPresetsTotalPages: totalPages,
      };

    case SET_SELECTED_FACEBOOK_PRESET:
      const newSeleted =
        state.selectedFacebookPreset === payload ? null : payload;
      return { ...state, selectedFacebookPreset: newSeleted };

    case SET_IS_ACTIVE_PRESET:
      return { ...state, isActivePreset: payload };

    default:
      return state;
  }
};
export default createPostReducers;
