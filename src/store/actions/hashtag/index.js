import * as hashtagTypes from '../../types/hashtag';
import client from '../../../Client';

export const setKeywordsSearchHashtags = (keywords) => (dispatch) => {
  dispatch({
    type: hashtagTypes.SET_KEYWORDS_SEARCH_HASHTAGS,
    payload: keywords,
  });
};

export const getHashtags =
  (params = {}, limit = 10) =>
  async (dispatch) => {
    try {
      await client
        .get(
          `/hashtags/?_limit=${limit}&${Object.keys(params)
            .map((q) => `${q}=${encodeURIComponent(params[q])}`)
            .join('&')}`
        )
        .then((result) => {
          dispatch({
            type: hashtagTypes.GET_HASHTAGS,
            payload: result.data.data,
          });
        })
        .catch((err) => console.log('Err get hashtags: ' + err));
    } catch (error) {
      console.log('Error get hashtags: ' + error);
    }
  };

export const createHashtag = async (params) => {
  try {
    const { data } = await client.post(`/hashtags`, params);
    return data;
  } catch (error) {
    console.log('Error get hashtags: ' + error);
  }
};
