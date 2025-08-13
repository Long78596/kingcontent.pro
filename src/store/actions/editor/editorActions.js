import * as types from '../../types/index';
import client from '../../../Client';
import auth from '../../../utils/auth';

export const getCreatedContents = (userId) => async (dispatch) => {
  try {
    const result = await client.get(
      `/user-contents?user=${userId}&_sort=id:DESC`
    );
    dispatch({ type: types.GET_CREATED_CONTENTS, payload: result.data.data });
  } catch (err) {
    console.log('error:', err);
  }
};

export const getFeedbackKeywords = () => async (dispatch) => {
  try {
    let returnKeywords = [];
    const { data } = await client.get(`/filter-keywords?type=feedback`);

    if (data.length > 0) {
      data.map((item) => {
        const kw = item.value || '';
        if (kw) returnKeywords.push(kw);
      });
    }
    dispatch({ type: types.GET_FEEDBACK_KEYWORDS, payload: returnKeywords });
  } catch (error) {
    console.log('error', error);
  }
};

export const getGoogleSubjects = () => async (dispatch) => {
  try {
    const { data } = await client.get(`/google-suggestion-subjects?_limit=-1`);
    dispatch({ type: types.GET_GOOGLE_SUBJECTS, payload: data });
  } catch (error) {
    console.log('error', error);
  }
};

export const getFeedbackSuggestions =
  (defaultKeywords, keyword, page) => async (dispatch) => {
    try {
      let kws = [...defaultKeywords];
      if (keyword && keyword.toLowerCase() !== 'feedback') kws.push(keyword);

      const limit = 5; // default latest 5 contents
      const sort = 'id:DESC';
      let start = 0;
      if (page > 1) start = (page - 1) * limit;

      let query = `_limit=${limit}&_sort=${sort}&_start=${start}`;
      kws.map((kw, i) => {
        query += `&_where[_or][${i}][content_contains]=${kw}`;
      });
      const { data } = await client.get(`/contents?${query}`);
      dispatch({ type: types.GET_FEEDBACK_SUGGESTIONS, payload: data });
    } catch (error) {
      console.log('error', error);
    }
  };

export const getTrendSuggestions = (keyword, page) => async (dispatch) => {
  try {
    const limit = 5; // default latest 5 contents
    const sort = 'id:DESC';
    let start = 0;
    if (page > 1) start = (page - 1) * limit;

    let query = `_limit=${limit}&_sort=${sort}&_start=${start}`;
    if (keyword) query += `&_where[content_contains]=${keyword}`;

    const { data } = await client.get(`/hot-trend-contents?${query}`);
    dispatch({ type: types.GET_TREND_SUGGESTIONS, payload: data });
  } catch (error) {
    console.log('error', error);
  }
};

export const getAllCategories = () => async (dispatch) => {
  try {
    const limit = -1;
    const sort = 'name:ASC';
    const { data } = await client.get(
      `/categories?_limit=${limit}&_sort=${sort}`
    );
    dispatch({
      type: types.GET_ALL_CATEGORIES,
      payload: data,
    });
  } catch (error) {
    console.log('error', error);
  }
};

export const get100DonCharts =
  (catId = 0) =>
  async (dispatch) => {
    try {
      const limit = 1;
      let query = `_limit=${limit}`;
      if (catId) query += `&category=${catId}`;
      const { data } = await client.get(`/100-don-charts?${query}`);
      dispatch({
        type: types.GET_100_DON_CHARTS,
        payload: data,
      });
    } catch (error) {
      console.log('error', error);
    }
  };

export const get100DonDetails =
  (page = 1, catId = 0) =>
  async (dispatch) => {
    try {
      const limit = 20;
      let start = 0;
      if (page > 1) start = (page - 1) * limit;
      let query = `_limit=${limit}&_start=${start}`;
      if (catId) query += `&category=${catId}`;
      const { data } = await client.get(`/100-don-details?${query}`);
      dispatch({
        type: types.GET_100_DON_DETAILS,
        payload: data,
      });
    } catch (error) {
      console.log('error', error);
    }
  };

export const changeStateCategoriesPopup = (state) => (dispatch) => {
  dispatch({
    type: types.CHANGE_STATE_CATEGORIES_POPUP,
    payload: state,
  });
};

export const changeStateSelectedCat = (catId) => (dispatch) => {
  dispatch({
    type: types.CHANGE_STATE_SELECTED_CAT,
    payload: catId,
  });
};

// feedbacks form actions
export const changeStateFeedbacksForm = (state) => (dispatch) => {
  dispatch({
    type: types.CHANGE_STATE_FEEDBACKS_FORM,
    payload: state,
  });
};

export const changeStateFeedbacksTypes = (state) => (dispatch) => {
  dispatch({
    type: types.CHANGE_STATE_FEEDBACKS_TYPE,
    payload: state,
  });
};

export const changeFeedbackSettings = (state) => (dispatch) => {
  dispatch({
    type: types.CHANGE_FEEDBACK_SETTINGS,
    payload: state,
  });
};

export const pushFeedbackMessage = (state) => (dispatch) => {
  dispatch({
    type: types.PUSH_FEEDBACK_MESSAGE,
    payload: state,
  });
};

export const updateFeedbackMessage = (state) => (dispatch) => {
  dispatch({
    type: types.UPDATE_FEEDBACK_MESSAGE,
    payload: state,
  });
};

export const removeFeedbackMessage = (state) => (dispatch) => {
  dispatch({
    type: types.REMOVE_FEEDBACK_MESSAGE,
    payload: state,
  });
};

export const resetFeedbackData = () => (dispatch) => {
  dispatch({
    type: types.RESET_FEEDBACK_DATA,
    payload: null,
  });
  dispatch({
    type: types.SET_CURRENT_FEEDBACK,
    payload: 0,
  });
};

export const setCurrentFeedback = (state) => (dispatch) => {
  dispatch({
    type: types.SET_CURRENT_FEEDBACK,
    payload: state,
  });
};

export const saveFeedbackData = (state) => (dispatch) => {
  dispatch({
    type: types.SAVE_FEEDBACK_DATA,
    payload: state,
  });
};

export const saveUserContent = (requestData) => async (dispatch) => {
  try {
    // create content
    const user = auth.getUserInfo();
    const { id: userId } = user;
    const { medias } = requestData;
    const contentData = { ...requestData, user: userId, medias: [] };
    const { data } = await client.post(`/user-contents`, contentData);
    const { id } = data;
    // upload medias to created content
    if (medias && medias.length > 0) {
      await medias.forEach(async (media) => {
        let uploadFormData = new FormData();
        await fetch(media)
          .then((res) => res.blob())
          .then((blob) => {
            const file = new File([blob], 'File name', { type: 'image/png' });
            uploadFormData.append('files', file);
            uploadFormData.append('field', 'medias');
            uploadFormData.append('refId', id);
            uploadFormData.append('ref', 'user-contents');
            client.post(`/upload`, uploadFormData);
          });
      });
      dispatch({
        type: types.CREATED_USER_CONTENT,
        payload: null,
      });
    } else {
      dispatch({
        type: types.CREATED_USER_CONTENT,
        payload: null,
      });
    }
  } catch (error) {
    console.log('error', error);
  }
};

export const setContentType = (state) => (dispatch) => {
  dispatch({
    type: types.SET_CONTENT_TYPE,
    payload: state,
  });
};
