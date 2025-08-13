import axios from 'axios';
import { convertFromHTML } from 'draft-js';
import { ContentState } from 'draft-js';
import { EditorState } from 'draft-js';
import { htmlToDraftjs } from 'html-to-draftjs';
import { createContext } from 'react';
import Client from '../../../Client';
import { stateToHTML } from 'draft-js-export-html';
import {
  API_FIND_BY_KEYWORD,
  OK,
  uniqueObjInArray,
  _LIMIT_CURRENT,
  _LIMIT_CURRENT_LARGE,
  _LIMIT_CURRENT_MEDIUM,
  _LIMIT_CURRENT_SMALL,
  API_QUESTION_CHAT_GPT,
} from '../../../configs';
import { getObject_create_post } from '../../../pages/createPost/utility';
import { CreateContent } from '../../../services/createContent';
import * as types from '../../types/index';
import { ACTION_GET_ALL_FANPAGE } from '../Fanpages';
import { actionLoadingApp } from '../loading';
import { Header } from 'rsuite';
import { toast } from 'react-toastify';
import {
  KEY_ELEMENTS_IMAGES,
  KEY_HASH_TAG_PLANS,
  KEY_HASH_VIDEO_OR_IMAGE,
  KEY_IMAGE_SELECT,
  KEY_ITEM_EDIT,
  KEY_LABELS,
  KEY_LABEL_SELECT,
  KEY_NOTE,
  KEY_PLANS,
  KEY_PLAN_DATA,
  KEY_PLAN_SELECT,
} from '../../../reducers/createContent';
import { REDUX_NAME_CREATE_POST, isObjEmpty } from '../../../utils/utilityFunc';
import { uniqueId } from 'lodash';
import { userServices } from '../../../services/users';
import {
  setIsActivePreset,
  setSelectFacebookPreset,
} from '../editor/createContentActions';
import { getSchedules } from '../Schedules';
export const ACTION_GET_TITLE = 'ACTION_GET_TITLE';
export const ACTION_SAVE_TITLE_OBJ = 'ACTION_SAVE_TITLE_OBJ';
export const ACTION_GET_TITLE_CHILD = 'ACTION_GET_TITLE_CHILD';
export const ACTION_RESET_STATE = 'ACTION_RESET_STATE';
export const ACTION_GET_GOOGLE_SUBJECTS = 'ACTION_GET_GOOGLE_SUBJECTS';
export const ACTION_GET_POST_BY_KEY = 'ACTION_GET_POST_BY_KEY';
export const ACTION_GET_POST_CATE = 'ACTION_GET_POST_CATE';
export const ACTION_GET_POST_TAB_RIGHT = 'ACTION_GET_POST_TAB_RIGHT';
export const RESET_TRENDING = 'RESET_TRENDING';
export const ACTION_GET_CHART = 'ACTION_GET_CHART';
export const ACTION_SELECT_CATEGORY = 'ACTION_SELECT_CATEGORY';
export const ACTION_ADD_IMAGE = 'ACTION_ADD_IMAGE';
export const ACTION_GET_DESIGNS = 'ACTION_GET_DESIGNS';
export const ACTION_GET_DESIGN_CATEGORIES = 'ACTION_GET_DESIGN_CATEGORIES';
export const UPDATE_EDITOR_STATE = 'UPDATE_EDITOR_STATE';
export const UPDATE_VPCS_KEY = 'UPDATE_VPCS_KEY';
export const UPDATE_STT_CHECK = 'UPDATE_STT_CHECK';
export const DELETE_IMAGES = 'DELETE_IMAGES';
export const ACTION_GET_IEAD_WORD = 'ACTION_GET_IEAD_WORD';
export const REPLACE_CONTENT = 'REPLACE_CONTENT';
export const ACTION_RESET_CONTENT = 'ACTION_RESET_CONTENT';
export const ACTION_UPDATE_CHECK_VPCS = 'ACTION_UPDATE_CHECK_VPCS';
export const ACTION_UPDATE_KEY_HAS_IN_CONTENT =
  'ACTION_UPDATE_KEY_HAS_IN_CONTENT';
export const ACTION_SPECIAL_TRACK = 'ACTION_SPECIAL_TRACK';
export const ACTION_TOGGLE_POPUP_SELECT_CATE =
  'ACTION_TOGGLE_POPUP_SELECT_CATE';
export const ACTION_UPDATE_AVAILABLE_CONTENT =
  'ACTION_UPDATE_AVAILABLE_CONTENT';
export const ACTION_QUESTION_CHAT_GPT = 'ACTION_QUESTION_CHAT_GPT';

export const actionGetTrendingContent = (page = 1, query = '') => {
  return async (dispatch) => {
    if (page === 1) {
      dispatch({
        type: RESET_TRENDING,
      });
    }
    dispatch({
      type: types.SET_LOADING,
      payload: true,
    });
    const res = await CreateContent.getTrendContent(page, query);
    if (res.status === OK) {
      const { data, total, last_page, current_page } = res.data.data;
      const _data = data.map((elt) => {
        return {
          ...elt,
          postOrpage: 'post',
          contentType: 'image',
        };
      });
      dispatch({
        type: types.GET_TRENDING_WITH_KEYWORDS,
        payload: {
          contents: _data,
          totalPages: last_page,
          page: current_page,
          fromSchedule: true,
        },
      });
    }
    dispatch({
      type: types.SET_LOADING,
      payload: false,
    });
    dispatch(actionLoadingApp(false));
  };
};

export const actionGetTitle = (text, page, setLoadingData = () => { }) => {
  return async (dispatch, getState) => {
    const { titleObjet, contentTitle } = getState()['createPost'];

    dispatch(actionLoadingApp(true));
    const res = await CreateContent.getDataByKeyword(text, page);
    if (res.status === OK) {
      const data = Object.keys(res.data.data.data) || [];
      const dataConvert = data
        .map((_elt) => {
          return {
            title: _elt,
            usedNumber: Math.round(Math.random() * 500),
          };
        })
        .sort((a, b) => b.usedNumber - a.usedNumber);
      dispatch({
        type: ACTION_GET_TITLE,
        payload: [contentTitle, dataConvert].flat(),
      });
      dispatch({
        type: ACTION_SAVE_TITLE_OBJ,
        payload: { ...titleObjet, ...res.data.data.data },
      });
      setLoadingData(false);
      dispatch(actionLoadingApp(false));
    }
  };
};
export const actionGetTitleChild = (data) => {
  return (dispatch) => {
    dispatch({
      type: ACTION_GET_TITLE_CHILD,
      payload: data || [],
    });
  };
};
export const actionResetState = () => {
  return (dispatch) => {
    dispatch({
      type: ACTION_RESET_STATE,
    });
  };
};
export const actionGetGoogleSubjects = (key) => {
  return async (dispatch) => {
    const res = await CreateContent.getGoogleSubjects(key);
    if (res.status === OK) {
      const dataConvert = res.data[0].keywords
        .map((_elt) => {
          return {
            title: _elt,
            usedNumber: Math.round(Math.random() * 500),
          };
        })
        .sort((a, b) => b.usedNumber - a.usedNumber);
      dispatch({
        type: ACTION_GET_GOOGLE_SUBJECTS,
        payload: dataConvert || [],
      });
    }
  };
};
export const actionGetPostByKeyword = (api, query, keyword) => {
  return async (dispatch, getState) => {
    const { categorySelect } = getState()['createPost'];
    const resKey = await CreateContent.getKeyWord(api, query, keyword);
    if (resKey.status === OK) {
      const arrReq = resKey.data[0].keywords.map((_elt) =>
        Client.get(
          `${categorySelect.parent.old_id
          }-${API_FIND_BY_KEYWORD}?content_contains=${_elt}&category=${categorySelect._id
          }&_limit=${resKey.data[0].keywords.length > 4
            ? _LIMIT_CURRENT_SMALL
            : resKey.data[0].keywords.length > 2
              ? _LIMIT_CURRENT_MEDIUM
              : _LIMIT_CURRENT_LARGE
          }&_start=0`
        )
      );
      await axios.all(arrReq).then(([...responses]) => {
        responses.forEach((elt) => {
          dispatch(actionLoadingApp(false));
          elt.data.forEach((charater) => {
            const strings = charater.content.split(/([!|.|,|🚴‍♂️|�])/);
            const match = (s, content) => {
              const p = Array.from(s).reduce(
                (a, v, i) => `${a}[^${s.substr(i)}]*?${v}`,
                ''
              );
              const re = RegExp(p);
              return content.filter((v) => v.match(re));
            };
            resKey.data[0].keywords.forEach((key) => {
              const obj = {
                title: match(key, strings)[0],
                usedNumber: Math.round(Math.random() * 500),
              };
              if (match(key, strings)[0] !== undefined) {
                dispatch({
                  type: ACTION_GET_POST_CATE,
                  payload: obj || [],
                });
              }
            });
          });
        });
      });
    }
  };
};

export const actionGetPageByKeyword = (
  api,
  query,
  keyword,
  startDocument = 0
) => {
  return async (dispatch, getState) => {
    const { categorySelect } = getState()['createPost'];
    dispatch({
      type: RESET_TRENDING,
    });
    dispatch(actionLoadingApp(true));
    const resKey = await CreateContent.getKeyWord(api, query, keyword);
    if (resKey.status === OK) {
      const arrReq = resKey.data[0].keywords.map((_elt) =>
        Client.get(
          `${API_FIND_BY_KEYWORD}?content_contains=${_elt}&_limit=50&_start=${startDocument}&category=${categorySelect._id}`
        )
      );
      await axios.all(arrReq).then(([...responses]) => {
        responses.forEach((_elt) => {
          const data = _elt.data.map((elt) => {
            return {
              ...elt,
              postOrpage: 'post',
            };
          });
          dispatch({
            type: ACTION_GET_POST_TAB_RIGHT,
            payload: data,
          });
          dispatch(actionLoadingApp(false));
        });
      });
    }
  };
};
export const actionGetPostByKeywordTrending = (key) => {
  return async (dispatch) => {
    dispatch(actionLoadingApp(true));
    const res = await Client.get(
      `${API_FIND_BY_KEYWORD}?content_contains=${key}&_limit=20&_start=0`
    );
    if (res.status === OK) {
      dispatch({
        type: ACTION_GET_TITLE_CHILD,
        payload: res.data || [],
      });
      dispatch(actionLoadingApp(false));
    }
  };
};
export const actionGetChartByKeyword = (keyword, page) => {
  return async (dispatch) => {
    const res = await CreateContent.getChartTrendding(keyword, page);
    if (res.status === OK) {
      dispatch({
        type: ACTION_GET_CHART,
        payload: res.data.data || [],
      });
      dispatch(actionLoadingApp(false));
    }
  };
};
export const actionSelectCategory = (cate) => {
  return (dispatch) => {
    dispatch({
      type: ACTION_SELECT_CATEGORY,
      payload: cate,
    });
  };
};

export const actionGetIdea = (prIds, cateIds) => {
  return async (dispatch) => {
    dispatch({
      type: RESET_TRENDING,
    });
    const res = await CreateContent.getContentByParentIds(prIds, cateIds);
    if (res.status === OK) {
      const data = res.data.data.data.map((elt) => {
        return {
          ...elt,
          postOrpage: 'idea',
          medias: JSON.parse(elt.medias),
        };
      });
      dispatch(actionLoadingApp(false));
      dispatch({
        type: types.GET_TRENDING_WITH_KEYWORDS,
        payload: data,
      });
    }
  };
};
export const actionAddImage = (image) => {
  return (dispatch) => {
    dispatch({
      type: ACTION_ADD_IMAGE,
      payload: image,
    });
  };
};
export const actionGetDesigns = (page = 1, cat_id = 0) => {
  return async (dispatch) => {
    dispatch(actionLoadingApp(true));
    const res = await CreateContent.getDesigns(page, cat_id);
    if (res.status === OK) {
      dispatch({
        type: ACTION_GET_DESIGNS,
        payload: res?.data?.data || [],
      });
      dispatch(actionLoadingApp(false));
    }
  };
};

export const actionGetDesignCategories = () => {
  return async (dispatch) => {
    const res = await CreateContent.getDesginCategories();
    if (res.status === OK) {
      const data = res.data.data.map((_elt) => {
        return { label: _elt.name, value: _elt.id };
      });
      dispatch({
        type: ACTION_GET_DESIGN_CATEGORIES,
        payload: data || [],
      });
    }
  };
};
export const actionUpdateEditorState = (text) => {
  return (dispatch, getState) => {
    dispatch({ type: UPDATE_EDITOR_STATE, payload: text });
    dispatch({
      type: ACTION_UPDATE_AVAILABLE_CONTENT,
      payload: stateToHTML(text.getCurrentContent()),
    });
    const { keyworksCheck, textContent } = getState()['createPost'];
    let keyHas = [];
    keyworksCheck.forEach((_elt) => {
      if (
        textContent.includes(_elt.original) &&
        !keyworksCheck.includes(_elt.original)
      ) {
        keyHas.push(_elt.original);
      }
    });
    dispatch({ type: ACTION_UPDATE_KEY_HAS_IN_CONTENT, payload: keyHas });
  };
};
export const actionUpdateVPCSKey = () => {
  return async (dispatch) => {
    const res = await CreateContent.getVPCSKeyWord();
    const { data = [], status = 0 } = res;
    if (status === OK) {
      const payload = data?.data || [];
      dispatch({ type: UPDATE_VPCS_KEY, payload: payload });
    }
  };
};
export const toggleEditorText = (text, replace = false, newLine = false) => {
  return (dispatch, getState) => {
    const { editorState } = getState()['createPost'];
    const textContent = stateToHTML(editorState.getCurrentContent())
      .replace(/<br\s*\/?>/gi, '')
      .replace(/&nbsp;/gi, ' ')
      .replace(/<p>/gi, '')
      .replace(/<\/p>/gi, '');
    let newText = '';
    if (replace) {
      newText = text;
    } else {
      if (newLine) {
        newText = textContent + '\n' + text;
      } else {
        newText = textContent + text;
      }
    }
    if (newText) {
      newText = newText.replace('<p><br></p>/g', '');
      newText = newText
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/&nbsp;/gi, ' ')
        .replace(/<p>/gi, '\n')
        .replace(/<\/p>/gi, '\n');
    }
    dispatch(
      actionUpdateEditorState(
        EditorState.push(
          editorState,
          ContentState.createFromText(newText)
          // ContentState.createFromBlockArray(
          //   convertFromHTML(
          //     newText.replace(/<br\s*\/?>/gi, '\n').replace(/&nbsp;/gi, ' ')
          //   )
          // )
        )
      )
    );
  };
};

export const deleteImage = (arr) => {
  return (dispatch) => {
    dispatch({
      type: DELETE_IMAGES,
      payload: arr,
    });
  };
};

export const actionGetWordIdea = () => {
  return async (dispatch) => {
    const res = await CreateContent.getWordIdea();
    if (res.status === OK) {
      dispatch({
        type: ACTION_GET_IEAD_WORD,
        payload: res.data,
      });
    }
  };
};

export const actionGetPostByKeywordIdea = (keyword, startDocument) => {
  return async (dispatch, getState) => {
    const { categorySelect } = getState()['createPost'];
    dispatch(actionLoadingApp(true));
    const res = await Client.get(
      `${API_FIND_BY_KEYWORD}?content_contains=${keyword}&_limit=200&_start=0&category=${categorySelect._id}`
    );
    if (res.status === OK) {
      res.data.forEach((charater) => {
        const strings = charater.content.split(/([!|.|,|🚴‍♂️|�])/);
        const match = (s, content) => {
          const p = Array.from(s).reduce(
            (a, v, i) => `${a}[^${s.substr(i)}]*?${v}`,
            ''
          );
          const re = RegExp(p);
          return content.filter((v) => v.match(re));
        };
        [keyword].forEach((key) => {
          const obj = {
            title: match(key, strings)[0],
            usedNumber: Math.round(Math.random() * 500),
          };
          if (match(key, strings)[0] !== undefined) {
            dispatch({
              type: ACTION_GET_POST_CATE,
              payload: obj || [],
            });
            dispatch(actionLoadingApp(false));
          }
        });
      });
    }
  };
};
export const actionReplaceContent = (text) => {
  return (dispatch) => {
    dispatch({ type: REPLACE_CONTENT, payload: text });
  };
};
export const actionToggleReplaceContent = (text) => {
  return (dispatch, getState) => {
    const { editorState } = getState()['createPost'];
    dispatch(
      actionReplaceContent(
        EditorState.push(
          editorState,
          ContentState.createFromBlockArray(convertFromHTML(text || ''))
        )
      )
    );
    const { keyworksCheck, textContent } = getState()['createPost'];
    let keyHas = [];
    keyworksCheck.forEach((_elt) => {
      if (
        textContent.includes(_elt.original) &&
        !keyworksCheck.includes(_elt.original)
      ) {
        keyHas.push(_elt.original);
      }
    });
    dispatch({ type: ACTION_UPDATE_KEY_HAS_IN_CONTENT, payload: keyHas });
  };
};
export const getPostByLink = () => { };
export const resetContent = () => {
  return (dispatch, getState) => {
    dispatch({
      type: ACTION_RESET_CONTENT,
    });
  };
};

export const createPost = (hasSchedule = false, isReels = false) => {
  return async (dispatch, getState) => {
    const createPostState = getState()['createPost'];
    dispatch(updateProps([{ prop: 'isSaving', value: true }]));
    const {
      textContent,
      imageSelect,
      categorySelect,
      [KEY_LABEL_SELECT]: labelId,
      [KEY_PLAN_SELECT]: plan,
      [KEY_ITEM_EDIT]: editItem,
      [KEY_NOTE]: note,
      [KEY_HASH_VIDEO_OR_IMAGE]: hashVideoOrImage,
      selectedFacebookPreset = '',
      isActivePreset,
    } = createPostState;

    const { user } = getState()['userReducer'];
    const medias = imageSelect.map((_elt) => {
      return _elt.url ? _elt.url : _elt;
    });
    if (!isObjEmpty(editItem)) {
      const updatedData = getObject_create_post(
        categorySelect._id,
        textContent,
        medias,
        hashVideoOrImage === 'video' ? medias[0] : '',
        user._id,
        labelId,
        plan.id,
        note,
        hashVideoOrImage
      );
      updatedData.is_reels = isReels;

      updatedData.is_active_preset = isActivePreset;
      updatedData.preset_id = isActivePreset
        ? selectedFacebookPreset || ''
        : '';

      const res = await CreateContent.updatePost(editItem.id, updatedData);
      if (res.status === OK) {
        dispatch(resetContent());
        dispatch(
          updateProps([
            {
              prop: KEY_ITEM_EDIT,
              value: {},
            },
            {
              prop: KEY_LABEL_SELECT,
              value: null,
            },
            {
              prop: 'imageSelect',
              value: [],
            },
            {
              prop: 'isSaving',
              value: false,
            },
          ])
        );
        dispatch(actionUpdateStep1(false));
        dispatch(actionUpdateStep2(true));
        dispatch(actionTogglePopupSelectCate(false));
        dispatch(actionSelectLabel(null));
        if (!hasSchedule) toast.success('Cập nhật bài viết thành công !');
        dispatch(setSelectFacebookPreset(null));
        dispatch(setIsActivePreset(false));
      } else {
        toast.error('Cập nhật bài viết thất bại !');
      }
    } else {
      const newContentData = getObject_create_post(
        categorySelect._id,
        textContent,
        medias,
        '',
        user._id,
        labelId,
        plan.id,
        note,
        hashVideoOrImage
      );
      newContentData.is_reels = isReels;

      newContentData.is_active_preset = isActivePreset;
      newContentData.preset_id = isActivePreset
        ? selectedFacebookPreset || ''
        : '';

      const res = await CreateContent.createPost(newContentData);
      if (res.status === OK) {
        dispatch(resetContent());
        dispatch(actionUpdateStep1(false));
        dispatch(actionUpdateStep2(true));
        dispatch(actionTogglePopupSelectCate(false));
        dispatch(actionSelectLabel(null));
        dispatch(
          updateProps([
            {
              prop: 'newCreatedContentId',
              value: res?.data?.data?.id,
            },
            {
              prop: 'isSaving',
              value: false,
            },
          ])
        );
        if (!hasSchedule) toast.success('Tạo bài viết thành công !');
        dispatch(setSelectFacebookPreset(null));
        dispatch(setIsActivePreset(false));
      } else {
        if (!hasSchedule) toast.error('Tạo bài viết thất bại !');
      }
    }
  };
};

export const createPostAndSchedule = (data) => {
  return async (dispatch, getState) => {
    const {
      textContent,
      imageSelect,
      categorySelect,
      [KEY_LABEL_SELECT]: labelId,
      [KEY_PLAN_SELECT]: plan,
      [KEY_ITEM_EDIT]: editItem,
      [KEY_NOTE]: note,
      [KEY_HASH_VIDEO_OR_IMAGE]: hashVideoOrImage,
      selectedFacebookPreset = '',
      isActivePreset = false,
    } = getState()['createPost'];
    const { user } = getState()['userReducer'];
    const medias = imageSelect.map((_elt) => {
      return _elt.url ? _elt.url : _elt;
    });
    let isContinue = false;
    let newContentId = 0;
    if (!isObjEmpty(editItem)) {
      const updateData = getObject_create_post(
        categorySelect._id,
        textContent,
        medias,
        editItem.media_url || '',
        user._id,
        labelId,
        plan.id,
        note,
        hashVideoOrImage
      );
      updateData.is_reels = data.is_reels || false;

      updateData.is_active_preset = isActivePreset;
      updateData.preset_id = isActivePreset ? selectedFacebookPreset || '' : '';

      const res = await CreateContent.updatePost(editItem.id, updateData);

      if (res.status === OK) {
        dispatch(resetContent());
        dispatch(
          updateProps([
            {
              prop: KEY_ITEM_EDIT,
              value: {},
            },
            {
              prop: KEY_LABEL_SELECT,
              value: null,
            },
            {
              prop: 'imageSelect',
              value: [],
            },
          ])
        );
        dispatch(actionUpdateStep1(false));
        dispatch(actionUpdateStep2(true));
        dispatch(actionTogglePopupSelectCate(false));
        dispatch(actionSelectLabel(null));
        dispatch(setSelectFacebookPreset(null));
        dispatch(setIsActivePreset(false));
        isContinue = true;
        newContentId = editItem.id;
      }
    } else {
      const newData = getObject_create_post(
        categorySelect._id,
        textContent,
        medias,
        '',
        user._id,
        labelId,
        plan.id,
        '',
        hashVideoOrImage
      );
      newData.is_reels = data.is_reels || false;
      newData.is_active_preset = isActivePreset;
      newData.preset_id = isActivePreset ? selectedFacebookPreset || '' : '';

      const res = await CreateContent.createPost(newData);
      if (res.status === OK) {
        dispatch(resetContent());
        dispatch(actionUpdateStep1(false));
        dispatch(actionUpdateStep2(true));
        dispatch(actionTogglePopupSelectCate(false));
        dispatch(actionSelectLabel(null));
        dispatch(
          updateProps([
            {
              prop: 'newCreatedContentId',
              value: res?.data?.data?.id,
            },
          ])
        );
        dispatch(setSelectFacebookPreset(null));
        dispatch(setIsActivePreset(false));
        isContinue = true;
        newContentId = res?.data?.data?.id;
      }
    }
    if (isContinue) {
      data.content_id = newContentId;
      await userServices.createScheduleContent(data).then((res) => {
        const { success = false, message = '' } = res?.data;
        if (success === false) {
          toast.error(message);
        } else {
          dispatch(getSchedules(1));
          toast.success(message);
        }
      });
    }
  };
};

export const toggleIsCheckVPCS = (value) => {
  return (dispatch) => {
    dispatch({
      type: ACTION_UPDATE_CHECK_VPCS,
      payload: value,
    });
  };
};

export const actionGetSpecialContents = (page = 1, query = '') => {
  return async (dispatch) => {
    try {
      const res = await CreateContent.getSpecialContents(page, query);
      dispatch(actionLoadingApp(false));
      if (res.status === OK) {
        const { data, total, last_page, current_page } = res?.data?.data;
        const payload = {
          contents: data,
          totalPages: last_page,
          page: current_page,
        };
        dispatch({
          type: types.CREATE_CONTENT_GET_SPECIAL_CONTENTS,
          payload: payload,
        });
      } else {
        dispatch({
          type: types.CREATE_CONTENT_GET_SPECIAL_CONTENTS,
          payload: { contents: [], totalPages: 0, page: 1 },
        });
      }
    } catch (error) {
      dispatch({
        type: types.CREATE_CONTENT_GET_SPECIAL_CONTENTS,
        payload: { contents: [], totalPages: 0, page: 1 },
      });
    }
  };
};

export const actionChangeSelectedIndexsSpecial = (index, isSelected) => {
  return (dispatch) => {
    dispatch({
      type: types.CREATE_CONTENT_CHANGE_SELECTED_SPECIAL_CONTENT,
      payload: {
        index: index,
        isSelected: isSelected
      },
    });
  };
}

export const actionTogglePopupSelectCate = (status) => {
  return (dispatch) => {
    dispatch({
      type: ACTION_TOGGLE_POPUP_SELECT_CATE,
      payload: status,
    });
  };
};

export const actionQuestionChatGPT = (questionData, setInputValue) => {
  return async (dispatch, getState) => {
    const _requestPedding = getState()['createPost'].syncRequestPedding;

    _requestPedding.map(async (question, index) => {
      if (question.status === 'REJECT') {
        dispatch(actionLoadingApp(true));
        const id = Math.floor(
          Math.random() * Math.floor(Math.random() * Date.now())
        );
        const newRequest = [..._requestPedding];
        newRequest[index].status = 'PENDDING';
        newRequest[index].id = id;
        dispatch(actionUpdateSyncRequestPedding(newRequest));
        await Client.post(`${API_QUESTION_CHAT_GPT}`, {
          question: question.title,
        })
          .then(async (response) => {
            const requestPedding = getState()['createPost'].syncRequestPedding;
            const _chatGPTData = getState()['createPost'].chatGPTdata;
            const requests = requestPedding.filter((_item) => _item.id !== id);
            await dispatch(actionUpdateSyncRequestPedding(requests));
            const answerRevert = response?.data?.data || '';
            /*const anwerRevert = (response.data.data + '').replace(
              /([^>\r\n]?)(\r\n|\n\r|\r|\n)/g,
              '$1' + '<br />' + '$2'
            );*/
            const newData = await [
              ..._chatGPTData,
              {
                id: Math.floor(
                  Math.random() * Math.floor(Math.random() * Date.now())
                ),
                question: questionData.question,
                answer: answerRevert,
              },
            ];

            dispatch({
              type: ACTION_QUESTION_CHAT_GPT,
              payload: newData,
            });
            if (setInputValue) {
              setInputValue('');
            }
            dispatch(actionLoadingApp(false));
          })
          .catch((error) => {
            dispatch(actionLoadingApp(false));
            const requestPedding = getState()['createPost'].syncRequestPedding;
            const requests = requestPedding.filter((_item) => _item.id !== id);
            dispatch(actionUpdateSyncRequestPedding(requests));
            toast.error('Có lỗi xảy ra . Vui lòng thử lại !');
          });
      }
    });
  };
};

export const ACTION_UPDATE_SYNC_REQUEST_LIST =
  'ACTION_UPDATE_SYNC_REQUEST_LIST';
export const actionUpdateSyncRequestPedding = (request) => {
  return (dispatch) => {
    dispatch({
      type: ACTION_UPDATE_SYNC_REQUEST_LIST,
      payload: request,
    });
  };
};
export const ACTION_GET_BANK_QUESTION = 'ACTION_GET_BANK_QUESTION';
export const getBankQuestion = () => {
  return async (dispatch) => {
    const { data: questionData, status } =
      await CreateContent.getBankQuestion();
    if (status === OK) {
      dispatch({
        type: ACTION_GET_BANK_QUESTION,
        payload: questionData.data,
      });
    } else {
      toast.error('Có lỗi xảy ra . Vui lòng thử lại !');
    }
  };
};
export const getQuestionPromt = (id) => {
  return async (dispatch) => {
    const { data: questionData, status } =
      await CreateContent.getQuestionInCate(id);
    if (status === OK) {
      dispatch({
        type: ACTION_GET_BANK_QUESTION,
        payload: questionData.data,
      });
    } else {
      toast.error('Có lỗi xảy ra . Vui lòng thử lại !');
    }
  };
};

export const updateIsSavedChatGPT = (id) => {
  return async (dispatch, getState) => {
    const _chatGPTData = getState()['createPost'].chatGPTdata;
    const _newData = _chatGPTData.map((_item) => {
      if (_item.id === id) {
        return { ..._item, isSaved: true };
      }
      return _item;
    });
    dispatch({
      type: ACTION_QUESTION_CHAT_GPT,
      payload: _newData,
    });
  };
};

export const ACTION_GET_HISTORY_QUESTION = 'ACTION_GET_HISTORY_QUESTION';
export const ACTION_GET_TAG = 'ACTION_GET_TAG';

export const getHistory = () => {
  return async (dispatch) => {
    const { data: historyData, status } = await CreateContent.getListHistory();
    if (status === OK) {
      const _newTagArray = historyData.data
        .filter(
          (_elt, index) =>
            historyData.data.findIndex((item) => item.tag === _elt.tag) ===
            index
        )
        .map((_item) => {
          return _item.tag ? _item.tag : null;
        });
      dispatch({
        type: ACTION_GET_HISTORY_QUESTION,
        payload: historyData.data.reverse() || [],
      });
      dispatch({
        type: ACTION_GET_TAG,
        payload: _newTagArray || [],
      });
    } else {
      toast.error('Có lỗi xảy ra . Vui lòng thử lại !');
    }
  };
};
export const saveHistory = (item) => {
  return async (dispatch, getState) => {
    const _histories = getState()['createPost'].historyQuestionList;
    const { data: resHis, status } = await CreateContent.addHistory(item);
    if (status === OK) {
      toast.success('Lưu thành công !');
      dispatch(getHistory());
    } else {
      toast.error('Có lỗi xảy ra . Vui lòng thử lại !');
    }
  };
};
export const updateHistory = (id, item) => {
  return async (dispatch, getState) => {
    const { status } = await CreateContent.updateHistory(id, item);
    if (status === OK) {
      toast.success('Cập nhật thành công !');
      dispatch(getHistory());
    } else {
      toast.error('Có lỗi xảy ra . Vui lòng thử lại !');
    }
  };
};
export const deleteHistory = (id) => {
  return async (dispatch, getState) => {
    const { data, status } = await CreateContent.deleteHistory(id);
    if (status === OK) {
      const _histories = getState()['createPost'].historyQuestionList;
      const _newData = _histories.filter((_elt) => _elt.id !== id);
      dispatch({
        type: ACTION_GET_HISTORY_QUESTION,
        payload: _newData,
      });
      toast.success('Xoá thành công !');
    } else {
      toast.error('Có lỗi xảy ra . Vui lòng thử lại !');
    }
  };
};

export const removeHistoryHashtag = (tag) => {
  return async (dispatch) => {
    const { data, status } = await CreateContent.removeHistoryHashtag(tag);
    if (status === OK) {
      const { data: historyData } = data;
      const _newTagArray = historyData
        .filter(
          (_elt, index) =>
            historyData.findIndex((item) => item.tag === _elt.tag) === index
        )
        .map((_item) => {
          return _item.tag ? _item.tag : null;
        });
      dispatch({
        type: ACTION_GET_HISTORY_QUESTION,
        payload: historyData.reverse() || [],
      });
      dispatch({
        type: ACTION_GET_TAG,
        payload: _newTagArray || [],
      });
      toast.success('Xoá thành công !');
    } else {
      toast.error('Có lỗi xảy ra . Vui lòng thử lại !');
    }
  };
};

export const updateHistoryHashtag = (tag, newTag) => {
  return async (dispatch) => {
    const { data, status } = await CreateContent.updateHistoryHashtag({
      old_name: tag,
      new_name: newTag,
    });
    if (status === OK) {
      const { data: historyData } = data;
      const _newTagArray = historyData
        .filter(
          (_elt, index) =>
            historyData.findIndex((item) => item.tag === _elt.tag) === index
        )
        .map((_item) => {
          return _item.tag ? _item.tag : null;
        });
      dispatch({
        type: ACTION_GET_HISTORY_QUESTION,
        payload: historyData.reverse() || [],
      });
      dispatch({
        type: ACTION_GET_TAG,
        payload: _newTagArray || [],
      });
      toast.success('Cập nhật thành công !');
    } else {
      toast.error('Có lỗi xảy ra . Vui lòng thử lại !');
    }
  };
};

export const ACTION_CREATE_CONTENT_SCHEDULE = 'ACTION_CREATE_CONTENT_SCHEDULE';
export const createContentToHomepage = (obj) => {
  return (dispatch) => {
    dispatch({
      type: ACTION_CREATE_CONTENT_SCHEDULE,
      payload: obj,
    });
  };
};
export const ACTION_UPDATE_STEP_1 = 'ACTION_UPDATE_STEP_1';
export const actionUpdateStep1 = (status) => {
  return (dispatch) => {
    dispatch({
      type: ACTION_UPDATE_STEP_1,
      payload: status,
    });
  };
};
export const ACTION_UPDATE_STEP_2 = 'ACTION_UPDATE_STEP_2';
export const actionUpdateStep2 = (status) => {
  return (dispatch) => {
    dispatch({
      type: ACTION_UPDATE_STEP_2,
      payload: {
        status: status
      }
    });
  };
};
// export const ACTION_SELECT_TAG = 'ACTION_SELECT_TAG'
// export const actionSect
export const ACTION_UPDATE_PROPS_CREATE_CONTENT =
  'ACTION_UPDATE_PROPS_CREATE_CONTENT';
export const updateProps = (properties) => {
  return (dispatch) => {
    dispatch({
      type: ACTION_UPDATE_PROPS_CREATE_CONTENT,
      payload: properties,
    });
  };
};
export const actionGetPlans = (setOriginalPlans) => {
  return async (dispatch) => {
    const res = await CreateContent.getPlans();
    setOriginalPlans && setOriginalPlans(res.data.data);
    if (res.status === OK) {
      const arr = uniqueObjInArray(res.data.data, 'hashtag').map(
        (_elt) => _elt.hashtag
      );
      const sugg_hash = [
        'Content bán hàng',
        'Content tăng tương tác',
        'Content mini game',
        'Content bắt trends',
        'Content chia sẻ chuyên môn',
      ];
      const dataArr = [...sugg_hash, ...arr];
      const unique = dataArr
        .map((e) => e)
        // store the keys of the unique objects
        .map((e, i, final) => final.indexOf(e) === i && i)
        // eliminate the dead keys & store unique objects
        .filter((e) => dataArr[e])
        .map((e) => dataArr[e]);
      dispatch(
        updateProps([
          {
            prop: KEY_PLANS,
            value: res.data.data,
          },
          {
            prop: KEY_HASH_TAG_PLANS,
            value: unique,
          },
        ])
      );
    }
  };
};

export const deletePostTextWithAdminSuggestion = (data) => {
  // Check if "labels" property exists and is an array
  if (data.labels && Array.isArray(data.labels)) {
    // Filter out objects that have "post_text" as "ADMIN_SUGGESTION"
    data.labels.forEach((label) => {
      label.contents = label.contents.filter(
        (content) => content.post_text !== 'ADMIN_SUGGESTION'
      );
      label.keywords = 'Viết content bán hàng';
    });
  }
  return data;
};
export const actionGetPlan = (id, setOriginalPlan) => {
  return async (dispatch) => {
    const res = await CreateContent.getPlan(id);
    if (res.status === OK) {
      setOriginalPlan && setOriginalPlan(res.data.data);
      dispatch(
        updateProps([
          {
            prop: KEY_PLAN_DATA,
            value: res.data.data,
          },
        ])
      );
      // // IF HASH SCRIPT => AUTO GET ONE SUGGESTION CONTENT
      // if (res.data.data) {
      //   res.data.data?.labels.forEach((_elt , index) => {
      //     if (_elt.contents[0].post_text === 'ADMIN_SUGGESTION' && _elt.contents.length === 1) {
      //       handleQuestionChatGPT(`${res.data.data?.labels[index].keyword} ${_elt.contents[0].note}` ,_elt?.id , )
      //     }
      //   })
      //  }
    }
  };
};
export const actionGetLabels = () => {
  return async (dispatch) => {
    const res = await CreateContent.getAllLabel();
    if (res.status === OK) {
      const resSuggest = await CreateContent.getSuggestionLabels(0);
      if (resSuggest.status === OK) {
        const newData = [...res.data.data, ...resSuggest.data.data];
        dispatch(
          updateProps([
            {
              prop: KEY_LABELS,
              value: newData,
            },
          ])
        );
      }
    }
  };
};

export const actionSelectLabel = (id) => {
  return async (dispatch) => {
    dispatch(
      updateProps([
        {
          prop: KEY_LABEL_SELECT,
          value: id,
        },
      ])
    );
  };
};
export const resetCreateContent = () => {
  return (dispatch, getState) => {
    const { editorState } = getState()['createPost'];
    dispatch(
      updateProps([
        {
          prop: KEY_ITEM_EDIT,
          value: {},
        },
        {
          prop: KEY_LABEL_SELECT,
          value: null,
        },
        {
          prop: 'imageSelect',
          value: [],
        },
        {
          prop: KEY_NOTE,
          value: '',
        },
        {
          prop: 'textContent',
          value: '',
        },
      ])
    );
    dispatch(
      actionUpdateEditorState(
        EditorState.push(editorState, ContentState.createFromText(''))
      )
    );
  };
};

export const writeContentHomeToCreateScreen = (content, url, type) => {
  return (dispatch) => {
    dispatch(createContentToHomepage({ status: true, type }));
    dispatch(toggleEditorText(content, true));
    dispatch(actionAddImage({ url: url }));
    toast.warning('Vui lòng chọn kế hoạch !');
  };
};
export const openScreenPlan = () => {
  return (dispatch) => {
    dispatch(actionUpdateStep1(true));
    dispatch(actionUpdateStep2(false));
    dispatch(actionTogglePopupSelectCate(false));
    dispatch(actionSelectLabel(null));
  };
};
export const openScreenLabel = () => {
  return (dispatch) => {
    dispatch(actionUpdateStep1(false));
    dispatch(actionUpdateStep2(true));
    dispatch(actionTogglePopupSelectCate(false));
    dispatch(actionSelectLabel(null));
  };
};
export const actionGetSuggChatGPT = (label_id, product_name) => {
  return async (dispatch, getState) => {
    const _requestPedding = getState()['createPost'].syncRequestPedding;
    const { [KEY_PLAN_DATA]: contentInPlan, [KEY_PLAN_SELECT]: planSelect } =
      getState()[REDUX_NAME_CREATE_POST];
    _requestPedding.map(async (question, index) => {
      if (question.status === 'REJECT') {
        dispatch(actionLoadingApp(true));
        const id = Math.floor(
          Math.random() * Math.floor(Math.random() * Date.now())
        );
        const newRequest = [..._requestPedding];
        newRequest[index].status = 'PENDDING';
        newRequest[index].id = id;
        dispatch(actionUpdateSyncRequestPedding(newRequest));
        await Client.post(`${API_QUESTION_CHAT_GPT}`, {
          question: question.title,
        })
          .then(async (response) => {
            const requestPedding = getState()['createPost'].syncRequestPedding;
            const requests = requestPedding.filter((_item) => _item.id !== id);
            const requestsFind = requestPedding.filter(
              (_item) => _item.id === id
            );
            await dispatch(actionUpdateSyncRequestPedding(requests));
            const answerRevert = response?.data?.data || '';
            /*const anwerRevert = (response.data.data + '').replace(
              /([^>\r\n]?)(\r\n|\n\r|\r|\n)/g,
              '$1' + '<br />' + '$2'
            );*/
            if (planSelect.id === requestsFind[0]?.planId) {
              const newData = { ...contentInPlan };
              const labelsFind = newData.labels.findIndex(
                (_elt) => _elt.id === label_id
              );
              newData.labels[labelsFind].contents.push({
                id: Math.floor(Math.random() * 1000),
                post_text: answerRevert,
                medias: [],
                type: 'image',
                saved: true,
                label_id,
              });
              dispatch(
                updateProps([
                  {
                    prop: KEY_PLAN_DATA,
                    value: newData,
                  },
                ])
              );
            } else {
              const requestPedding =
                getState()['createPost'].syncRequestPedding;
              const requests = requestPedding.filter(
                (_item) => _item.id !== id
              );
              dispatch(actionUpdateSyncRequestPedding(requests));
            }
          })
          .catch((error) => {
            const requestPedding = getState()['createPost'].syncRequestPedding;
            const requests = requestPedding.filter((_item) => _item.id !== id);
            dispatch(actionUpdateSyncRequestPedding(requests));
            toast.error('Có lỗi xảy ra . Vui lòng thử lại !');
          });
      }
    });
  };
};

export const backEditorScreen = () => {
  return (dispatch) => {
    dispatch(actionUpdateStep1(false));
    dispatch(actionUpdateStep2(false));
  };
};
export const resetImagesSelect = () => {
  return (dispatch) => {
    dispatch(
      updateProps([
        {
          prop: KEY_IMAGE_SELECT,
          value: [],
        },
      ])
    );
  };
};
export const AddElement = (element) => {
  return (dispatch, getState) => {
    // const id = uniqueId()
    const { [KEY_ELEMENTS_IMAGES]: elements } = getState()['createPost'];
    const _elements = [...elements];
    _elements.unshift(element);
    dispatch(
      updateProps([
        {
          prop: KEY_ELEMENTS_IMAGES,
          value: _elements,
        },
      ])
    );
  };
};
export const DeleteElement = (id) => {
  return (dispatch, getState) => {
    const { [KEY_ELEMENTS_IMAGES]: elements } = getState()['createPost'];
    const _elements = [...elements];
    const newElement = _elements.filter((_elt) => _elt.customId !== id);
    dispatch(
      updateProps([
        {
          prop: KEY_ELEMENTS_IMAGES,
          value: newElement,
        },
      ])
    );
  };
};
export const ResetCanvasLayer = () => (dispatch) => {
  dispatch(
    updateProps([
      {
        prop: KEY_ELEMENTS_IMAGES,
        value: [],
      },
    ])
  );
};
export const UpdateCanvasLayer = (layer) => (dispatch) => {
  dispatch(
    updateProps([
      {
        prop: KEY_ELEMENTS_IMAGES,
        value: layer,
      },
    ])
  );
};

export const defaultThreadsPrompt =
  'Hãy rút ngắn bài viết sau không vượt quá 500 kí tự (bao gồm cả khoảng trắng), yêu cầu vẫn giữ được những nội dung chính của bài viết gốc, gọn gàng, không dài dòng:';

export const actionOptimizeThreads = (text, existItem = null) => {
  return async (dispatch, getState) => {
    let currentItem = null;
    let newItem = null; // khai báo ngoài để catch dùng được

    if (!existItem) {
      const currentThreadsChatGptData =
        getState()['createPost'].threadsChatGptData;

      newItem = {
        id: Math.floor(Math.random() * Math.floor(Math.random() * Date.now())),
        title: `${defaultThreadsPrompt} ${text}`,
        status: 'PENDING',
      };

      const newThreadsChatGptData = [...currentThreadsChatGptData, newItem];
      dispatch(
        updateProps([
          { prop: 'threadsChatGptData', value: newThreadsChatGptData },
        ])
      );

      currentItem = newItem;
    } else {
      currentItem = existItem;
    }

    try {
      const response = await Client.post(`${API_QUESTION_CHAT_GPT}`, {
        question: currentItem.title,
      });

      const newThreadsChatGptData =
        getState()['createPost'].threadsChatGptData;

      const newThreadsChatGptDataAfter = newThreadsChatGptData.map((item) => {
        if (item.id === currentItem.id) {
          return {
            ...item,
            status: 'DONE',
            answer: response?.data?.data || '',
          };
        }
        return item;
      });

      dispatch(
        updateProps([
          { prop: 'threadsChatGptData', value: newThreadsChatGptDataAfter },
        ])
      );
    } catch (error) {
      const newThreadsChatGptData =
        getState()['createPost'].threadsChatGptData;

      const newThreadsChatGptDataAfter = newThreadsChatGptData.filter(
        (item) => item.id !== newItem?.id // dùng ?. để tránh lỗi khi newItem null
      );

      dispatch(
        updateProps([
          { prop: 'threadsChatGptData', value: newThreadsChatGptDataAfter },
        ])
      );

      toast.error('Có lỗi xảy ra. Vui lòng thử lại!');
    }
  };
};


export const updateThreadsChatGptData = (data) => {
  return (dispatch) => {
    dispatch(updateProps([{ prop: 'threadsChatGptData', value: data }]));
    // call api if has status = 'PENDDING'
    data.forEach((item) => {
      if (item.status === 'PENDING') {
        dispatch(actionOptimizeThreads(item.title, item));
      }
    });
  };
};

export const updateIsSavedThreadsChatGptData = (id) => {
  return (dispatch, getState) => {
    const threadsChatGptData = getState()['createPost'].threadsChatGptData;
    const newThreadsChatGptData = threadsChatGptData.map((item) => {
      if (item.id === id) {
        return { ...item, isSaved: true };
      }
      return item;
    });
    dispatch(updateProps([{ prop: 'threadsChatGptData', value: newThreadsChatGptData }]))
  };
};

