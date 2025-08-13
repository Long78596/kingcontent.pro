import { toast } from 'react-toastify';
import client from '../../../Client';
import * as types from '../../types/homepage';
import axios from 'axios';
import { display } from '@mui/system';
import {
  createContentToHomepage,
  toggleEditorText,
  updateProps,
} from '../createContent';
import {
  UrlImageToBase64,
  convertUrlsToBase64,
} from '../../../pages/createPost/utility';
import { KEY_HASH_VIDEO_OR_IMAGE } from '../../../reducers/createContent';
import { OK } from '../../../configs';

export const ACTION_GET_CHOSEN_CATEGORIES = 'ACTION_GET_CHOSEN_CATEGORIES';

export const getChosenCategories = () => async (dispatch) => {
  try {
    const response = await client.get(`/chosen-categories`);
    if (response.status === OK) {
      const { data } = response.data;
      dispatch({
        type: ACTION_GET_CHOSEN_CATEGORIES,
        payload: data,
      });
    }
  } catch (err) {
    console.log('error:', err);
  }
};

export const saveChosenCategories = (data) => async (dispatch) => {
  try {
    const response = await client.post(`/chosen-categories`, data);
    if (response.status === OK) {
      const { data } = response.data;
      dispatch({
        type: ACTION_GET_CHOSEN_CATEGORIES,
        payload: data,
      });
    }
    toast.success('Theo dõi chủ đề thành công !');
  } catch (err) {
    console.log('error:', err);
  }
};

export const deleteChosenCategories = (id) => async (dispatch) => {
  try {
    const response = await client.delete(`/chosen-categories/${id}`);
    if (response.status === OK) {
      const { data } = response.data;
      dispatch({
        type: ACTION_GET_CHOSEN_CATEGORIES,
        payload: data,
      });
      toast.success('Xóa chủ đề thành công !');
    }
  } catch (err) {
    console.log('error:', err);
  }
};

export const getPopularTags = () => async (dispatch) => {
  try {
    const limit = 3;
    const order = `search_count:DESC`;
    const query = `_limit=${limit}&_sort=${order}`;
    const response = await client.get(`/tags?${query}`);
    if (response) {
      const { data } = response;
      dispatch({
        type: types.GET_POPULAR_TAGS,
        payload: data,
      });
    }
  } catch (err) {
    console.log('error:', err);
  }
};

export const getTagsByKeyword =
  (keyword = '') =>
  async (dispatch) => {
    try {
      if (keyword) {
        const response = await client.get(
          `/contents/search?keyword=${keyword}`
        );
        if (response) {
          const { data } = response?.data;
          dispatch({
            type: types.GET_TAGS_BY_KEYWORD,
            payload: data,
          });
        }
      }
    } catch (err) {
      console.log('error:', err);
    }
  };
export const getGoogleSubjectsByKeyword =
  (keyword = '') =>
  async (dispatch) => {
    try {
      if (keyword) {
        const response = await client.get(
          `/google/index.php?q=${keyword}&action=find_google_suggestions_by_keyword&page=1`,
          { baseURL: `http://api.kingcontent.pro` }
        );
        if (response) {
          const { data } = response;
        }
      }
    } catch (err) {
      console.log('error:', err);
    }
  };

export const getFanpagesByKeyword =
  (keyword = '') =>
  async (dispatch) => {
    try {
      if (keyword) {
        const limit = 10;
        const order = `id:DESC`;
        const condition = `keyword=${keyword}`;
        const query = `${condition}&_limit=${limit}&_sort=${order}`;
        const response = await client.get(`/fanpages?${query}`);
        if (response) {
          const { data } = response?.data?.data;
          dispatch({
            type: types.GET_FANPAGES_BY_KEYWORD,
            payload: data,
          });
        }
      }
    } catch (err) {
      console.log('error:', err);
    }
  };

export const getSpecialFanpages =
  (page = 1, isAll = false) =>
  async (dispatch) => {
    try {
      let query = '';
      if (!isAll) {
        query = `?page=${page}&_limit=6&_start=0`;
      }
      const response = await client.get(`/saved-fanpages`);
      if (response) {
        const { data } = response.data;
        dispatch({
          type: types.GET_SPECIAL_FANPAGES,
          payload: data,
        });
      }
    } catch (err) {
      console.log('error:', err);
    }
  };

export const getSpecialContents =
  (page = 1) =>
  async (dispatch) => {
    try {
      const response = await client.get(`/special-contents?page=${page}`);
      if (response.status === OK) {
        const { data, total = 0 } = response.data.data;
        const newData = data
          .filter(
            (_elt) => _elt.medias && _elt.medias.length > 0 && _elt.post_text
          )
          .map((_content, index) => {
            const newText =
              _content?.post_text?.replace(
                /([^>\r\n]?)(\r\n|\n\r|\r|\n)/g,
                '$1' + '<br />' + '$2'
              ) || '';
            return {
              ..._content,
              post_text: newText,
            };
          });
        dispatch({
          type: types.GET_SPECIAL_CONTENTS,
          payload: newData,
        });
      } else {
        dispatch({
          type: types.GET_SPECIAL_CONTENTS,
          payload: [],
        });
      }
    } catch (err) {
      console.log('error:', err);
    }
  };

export const setSelectedCategoyIds = (ids) => async (dispatch) => {
  try {
    dispatch({
      type: types.SET_SELECTED_CATEGORY_IDS,
      payload: ids,
    });
  } catch (error) {
    console.log('error:', error);
  }
};

const _API_HOT_TREND =
  '/hot-trend-contents?&_limit=12&_start=0&_where[content_contains]=';
export const ACTION_GET_TRENDDING = 'ACTION_GET_TRENDDING_HOME_PAGE';
export const getTrenddingData = () => async (dispatch) => {
  try {
    const response = await client.get(`${_API_HOT_TREND}`);
    if (response.status === OK) {
      const { data, total = 0 } = response.data.data;
      const newData = data.map((_elt) => {
        return {
          ..._elt,
          name: _elt.post_header,
          image: _elt.profile_picture,
          content: _elt.post_text,
          title: _elt.post_header,
          event_date: _elt.updated,
          event_icon: _elt.profile_picture,
          description: _elt.post_text,
        };
      });
      dispatch({
        type: ACTION_GET_TRENDDING,
        payload: newData,
      });
    } else {
      dispatch({
        type: ACTION_GET_TRENDDING,
        payload: [],
      });
    }
  } catch (err) {
    console.log('error:', err);
  }
};
export const ACTION_GET_MY_TOPIC_HOMEPAGE = 'ACTION_GET_MY_TOPIC_HOMEPAGE';

export const actionGetMyTopic = (cateId) => async (dispatch) => {
  try {
    const response = await client.get(
      `/categories/${cateId}/contents?_limit=12&page=1`
    );
    if (response.status === OK) {
      const { data } = response.data.data;
      const newData = data
        ? data.map((_elt) => {
            return {
              ..._elt,
              name: _elt.post_header,
              image: `https://graph.facebook.com/${_elt?.feed_id}/picture?width=1000&height=1000`,
              title: _elt.post_header,
              event_date: _elt.updated,
              event_icon: `https://graph.facebook.com/${_elt?.feed_id}/picture?width=1000&height=1000`,
              description: _elt.post_text,
            };
          })
        : [];
      dispatch({
        type: ACTION_GET_MY_TOPIC_HOMEPAGE,
        payload: newData,
      });
      toast.success('Lấy dữ liệu thành công !');
    } else {
      dispatch({
        type: ACTION_GET_MY_TOPIC_HOMEPAGE,
        payload: [],
      });
    }
  } catch (err) {
    console.log('error:', err);
  }
};

export const ACTION_SELECY_CATE_HOME_PAGE = 'ACTION_SELECY_CATE_HOME_PAGE';
export const actionSelectMyTopic = (item) => {
  return (dispatch) => {
    dispatch({
      type: ACTION_SELECY_CATE_HOME_PAGE,
      payload: item,
    });
  };
};

export const actionPushContentToCreateContentScreen = (
  content,
  medias = [],
  type = 'image',
  isReels = false,
  isCreatedContent = false
) => {
  return async (dispatch) => {
    if (!isCreatedContent) {
      toast.info(
        'Hệ thống đang chuyển dữ liệu, vui lòng chờ trong giây lát !',
        {
          autoClose: false,
        }
      );
      dispatch(createContentToHomepage({ status: true }));
      if (type === 'video') {
        dispatch(toggleEditorText(content, true));
        dispatch(
          updateProps([
            {
              prop: 'imageSelect',
              value: medias,
            },
            {
              prop: 'isReels',
              value: isReels,
            },
            {
              prop: KEY_HASH_VIDEO_OR_IMAGE,
              value: 'video',
            },
          ])
        );
        toast.dismiss();
        toast.warning(
          'Đã chuyển dữ liệu xong, vui lòng chọn kế hoạch để tiếp tục soạn thảo !'
        );
      } else {
        convertUrlsToBase64(medias).then((arr) => {
          dispatch(toggleEditorText(content, true));
          dispatch(
            updateProps([
              {
                prop: 'imageSelect',
                value: arr,
              },
              {
                prop: 'isReels',
                value: isReels,
              },
              {
                prop: KEY_HASH_VIDEO_OR_IMAGE,
                value: 'image',
              },
            ])
          );
          toast.dismiss();
          toast.warning(
            'Đã chuyển dữ liệu xong, vui lòng chọn kế hoạch để tiếp tục soạn thảo !'
          );
        });
      }
    } else {
      dispatch(toggleEditorText(content, true));
      dispatch(
        updateProps([
          {
            prop: 'imageSelect',
            value: medias,
          },
          {
            prop: 'isReels',
            value: isReels,
          },
          {
            prop: KEY_HASH_VIDEO_OR_IMAGE,
            value: 'image',
          },
        ])
      );
    }
  };
};
export const breakWord = (_content) => {
  return _content.replace(
    /([^>\r\n]?)(\r\n|\n\r|\r|\n)/g,
    '$1' + '<br />' + '$2'
  );
};
