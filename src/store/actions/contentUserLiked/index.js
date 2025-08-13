import { ContentService } from '../../../services/content';
import Client from '../../../Client';
import {
  OK,
  uniqueObjInArray,
  uniquePropertyObjectInArray,
} from '../../../configs';

export const ACTION_GET_ALL_CONTENTS = 'ACTION_GET_ALL_CONTENTS';
export const ACTION_GET_ALL_FANPAGES = 'ACTION_GET_ALL_FANPAGES';
export const ACTION_SEARCH_CONTENT = 'ACTION_SEARCH_CONTENT';
export const ACTION_GET_HASH_TAG = 'ACTION_GET_HASH_TAG';

export const actionGetAllContent = () => {
  return async (dispatch) => {
    const res = await ContentService.getAllContent();
    if (res.status === OK) {
      const newData = res.data.data.contents.map((_content, index) => {
        const { content = null } = _content;
        if (!content) return _content;
        const newText =
          _content?.content?.post_text?.replace(
            /([^>\r\n]?)(\r\n|\n\r|\r|\n)/g,
            '$1' + '<br />' + '$2'
          ) || '';
        return {
          ..._content,
          content: {
            ..._content.content,
            post_text: newText,
          },
        };
      });
      const newHagtag = uniqueObjInArray(newData, 'hashtag');
      const newFanpage = uniquePropertyObjectInArray(
        newData,
        'content',
        'user_screenname'
      );
      dispatch({
        type: ACTION_GET_ALL_CONTENTS,
        payload: { ...res.data, contents: newData } || [],
      });
      dispatch({
        type: ACTION_GET_ALL_FANPAGES,
        payload: newFanpage || [],
      });
      dispatch({
        type: ACTION_GET_HASH_TAG,
        payload: newHagtag || [],
      });
    }
  };
};

export const actionSearchContent = (data) => {
  return async (dispatch) => {
    dispatch({
      type: ACTION_SEARCH_CONTENT,
      payload: data || [],
    });
  };
};
export const API_LIKED_CONTENT = '/liked-data';
export const likedContent = (data) => {
  return async (dispatch) => {
    const res = await Client.post(API_LIKED_CONTENT, data);
    if (res.status === OK) {
    }
  };
};
