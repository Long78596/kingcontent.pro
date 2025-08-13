import * as types from '../../store/types/index';

const contentInitialState = {
  isShowCreateContentForm: false,
  isShowFormularPopup: false,
  isShowFormularPopupForm: false,
  isShowGetMediaForm: false,
  isGetImages: false,
  isGetVideo: false,
  isGetEmoji: true,
  imagesContent: null,
  videoContent: '',  
  selectedKeyword: '',
  suggestionContents: '',
};

const createContentReducer = (state = contentInitialState, action) => {
  const { type, payload } = action;
  switch (type) {

    // Funtions for Show/Hidden FORMS
    case types.CHANGE_STATE_CREATE_CONTENT_FORM:
      return { ...state, isShowCreateContentForm: payload };

    case types.CHANGE_STATE_SHOW_FORMULAR_POPUP:
      return { ...state, isShowFormularPopup: payload };

    case types.CHANGE_STATE_SHOW_FORMULAR_POPUP_FORM:
      return { ...state, isShowFormularPopupForm: payload };

    case types.CHANGE_STATE_GET_MEDIA_FORM:
      return { ...state, isShowGetMediaForm: payload };

    // Functions for IMAGES
    case types.CHANGE_STATE_GET_IMAGES:
      return { ...state, isGetImages: payload };

    case types.SET_IMAGES_CONTENT:
      return { ...state, imagesContent: { ...state.imagesContent, payload } };

    // Functions for VIDEO
    case types.CHANGE_STATE_GET_VIDEO:
      return { ...state, isGetVideo: payload };

    case types.SET_VIDEO_CONTENT:
      return { ...state, videoContent: payload };

    case types.REMOVE_VIDEO_CONTENT:
      return { ...state, videoContent: '' };

    // Functions for EMOJI
    case types.CHANGE_STATE_GET_EMOJI:
      return { ...state, isGetEmoji: payload };
      
    case types.GET_CONTENT_SUGGESTIONS:      
    return {...state, suggestionContents: payload};

    case types.CHANGE_STATE_SELECTED_KEYWORD:
      return { ...state, selectedKeyword: payload };

    default:
      return state;
  }
};

export default createContentReducer;
