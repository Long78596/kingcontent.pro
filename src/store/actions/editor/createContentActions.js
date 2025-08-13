import * as types from '../../types/index';
import client from '../../../Client';

export const changeStateCreateContentForm = (state) => (dispatch) => {
  dispatch({
    type: types.CHANGE_STATE_CREATE_CONTENT_FORM,
    payload: state,
  });
};

export const changeStateFormularPopup = (state) => (dispatch) => {
  dispatch({
    type: types.CHANGE_STATE_SHOW_FORMULAR_POPUP,
    payload: state,
  });
};

export const changeStateFormularPopupForm = (state) => (dispatch) => {
  dispatch({
    type: types.CHANGE_STATE_SHOW_FORMULAR_POPUP_FORM,
    payload: state,
  });
};

export const changeStateGetMediaForm = (state) => (dispatch) => {
  dispatch({ type: types.CHANGE_STATE_GET_MEDIA_FORM, payload: state });
};

export const setImagesContent = (images) => (dispatch) => {
  dispatch({ type: types.SET_IMAGES_CONTENT, payload: images });
};

export const setVideoContent = (video) => (dispatch) => {
  dispatch({ type: types.SET_VIDEO_CONTENT, payload: video });
};

export const removeVideoContent = () => (dispatch) => {
  dispatch({ type: types.REMOVE_VIDEO_CONTENT });
};

export const changeStateGetImages = (state) => (dispatch) => {
  dispatch({ type: types.CHANGE_STATE_GET_IMAGES, payload: state });
};

export const changeStateGetVideo = (state) => (dispatch) => {
  dispatch({ type: types.CHANGE_STATE_GET_VIDEO, payload: state });
};

export const changeStateGetEmoji = (state) => (dispatch) => {
  dispatch({ type: types.CHANGE_STATE_GET_EMOJI, payload: state });
};

export const changeSelectedKeyword = (state) => (dispatch) => {
  dispatch({ type: types.CHANGE_STATE_SELECTED_KEYWORD, payload: state });
};

export const getContentSuggestions =
  (catId, keywords = [], page = 1, isExclude = false) =>
  async (dispatch) => {
    try {
      const limit = 9; // default latest 9 contents
      const sort = 'id:DESC';
      let start = 0;
      if (page > 1) start = (page - 1) * limit;

      let query = `_limit=${limit}&_sort=${sort}&_start=${start}&category=${catId}`;
      if (keywords && keywords.length > 0) {
        keywords.map((kw, i) => {
          if (isExclude) {
            query += `&_where[${i}][content_ncontains]=${kw}`;
          } else {
            query += `&_where[_or][${i}][content_contains]=${kw}`;
          }
        });
      }
      const { data } = await client.get(`/contents?${query}`);
      dispatch({ type: types.GET_CONTENT_SUGGESTIONS, payload: data });
    } catch (error) {
      console.log('error', error);
    }
  };

export const getFacebookPresets =
  (curentPage = 1) =>
  async (dispatch) => {
    try {
      dispatch({ type: types.GET_FACEBOOK_PRESETS, payload: [] });
      const { data: resData } = await client.get(
        `/facebook-presets?page=${curentPage}&_limit=48`
      );
      const { data, last_page, current_page } = resData?.data || {};
      dispatch({
        type: types.GET_FACEBOOK_PRESETS_SUCCESS,
        payload: {
          data,
          last_page,
          current_page,
        },
      });
    } catch (error) {
      console.log('error', error);
      dispatch({ type: types.GET_FACEBOOK_PRESETS, payload: [] });
    }
  };

export const setSelectFacebookPreset = (preset) => (dispatch) => {
  dispatch({ type: types.SET_SELECTED_FACEBOOK_PRESET, payload: preset });
};

export const setIsActivePreset = (isActive) => (dispatch) => {
  dispatch({ type: types.SET_IS_ACTIVE_PRESET, payload: isActive });
};
