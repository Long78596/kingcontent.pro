import * as types from '../../types';
import client from '../../../Client';
import { isArrayEmpty, uniqueObjInArray } from '../../../configs';
import { faAddressBook } from '@fortawesome/free-solid-svg-icons';
import { formatDate } from '../../../helpers/date';

const pageLimit = 16;

export const setContentDetailToShow = (content) => {
  let contents = { ...content };
  if (content && content.medias) {
    contents['images'] = content.medias;
  }
  return (dispatch) => {
    dispatch({
      type: types.SET_CONTENT_DETAIL_TO_SHOW,
      payload: content ? contents : null,
    });
  };
};
export const setContentCompare = (content) => {
  return (dispatch) => {
    dispatch({
      type: types.SET_CONTENT_COMPARE,
      payload: content,
    });
  };
};

export const getCategoriesInfoBySlug = (slug) => async (dispatch) => {
  try {
    const result = await client.get(`/categories/searchBySlug?slug=${slug}`);
    dispatch({
      type: types.GET_CATEGORIES_INFO_BY_SLUG,
      payload: result.data.data,
    });
  } catch (error) {
    console.log('Error get category info: ' + error);
  }
};

export const getContents =
  (cateId = 252, page = 1, query = '', from_cate = false) =>
    async (dispatch) => {
      try {
        dispatch({ type: types.SET_LOADING, payload: true });
        const newQuery = Query(0, page, query);
        const endpoint = `categories/${cateId}/contents`;
        await client
          .get(`/${endpoint}?${newQuery}`)
          .then((result) => {
            const { data = [] } = result?.data || {};
            if (data.data && data.data.length > 0) {
              const newUniqueArr = uniqueObjInArray(data?.data, 'feed_id').map(
                (_elt) => {
                  return {
                    ..._elt,
                    name: _elt.post_header,
                    value: _elt.feed_id,
                    icon: faAddressBook,
                  };
                }
              );
              dispatch({ type: types.GET_UNIQUE_FANPAGE, payload: newUniqueArr });
            } else {
              dispatch({ type: types.GET_UNIQUE_FANPAGE, payload: [] });
            }
            dispatch({ type: types.SET_LOADING, payload: false });
            dispatch({
              type: types.GET_CONTENTS,
              payload: { ...data, from_cate },
            });
          })
          .catch((err) => console.log('Err get contents: ' + err));
      } catch (error) {
        console.log('Error get contents: ' + error);
      }
    };

export const getTopContents = async (type, catId, setData) => {
  try {
    // prepare condition
    const limit = 20;
    let url = `/categories/${catId}/contents`;
    const last10Days = new Date(new Date().setDate(new Date().getDate() - 10));
    const formatDays = formatDate(last10Days, 'YYYY-MM-DD');
    switch (type) {
      case 'likes':
        url += `?orders[0][sort]=likes&orders[0][dir]=desc&_limit=${limit}&from_date=${formatDays}`;
        break;

      case 'shares':
        url += `?orders[0][sort]=shares&orders[0][dir]=desc&_limit=${limit}&from_date=${formatDays}`;
        break;

      case 'comments':
        url += `?orders[0][sort]=comments&orders[0][dir]=desc&_limit=${limit}&from_date=${formatDays}`;
        break;
    }
    const { data } = await client.get(url);
    if (isArrayEmpty(data.data)) {
      setData(data.data);
      return;
    }
    setData(data.data.data);
  } catch (error) {
    console.log('Error get contents: ' + error);
  }
};

export const getFbCareContents = async (
  categoriesIds,
  page = 1,
  query = '',
  limit = 20
) => {
  try {
    const newQuery = Query(categoriesIds, page, query, limit);
    const { data } = await client.get(`/contents?${newQuery}`);
    return data;
  } catch (error) {
    console.log('Error get contents: ' + error);
  }
};

export const getTotalContents =
  (cateId = 0, page = 1, query = '') =>
    async (dispatch) => {
      try {
        /*const newQuery = Query(cateId, page, query);
        const endpoint = `categories/countContents`;
        await client
          .get(`/${endpoint}/?${newQuery}`)
          .then((result) =>
            dispatch({
              type: types.GET_TOTAL_CONTENTS,
              payload: result.data.data,
            })
          )
          .catch((err) => console.log('Err get totalContents: ' + err));*/
        const randomLargeNumber = Math.floor(Math.random() * 10000000);

        dispatch({
          type: types.GET_TOTAL_CONTENTS,
          payload: randomLargeNumber,
        });
      } catch (error) {
        console.log('Error get totalContents: ' + error);
      }
    };
export const getTotalFanpages =
  (categoriesId = 0) =>
    async (dispatch) => {
      try {
        let query = '/fanpages/count';
        if (categoriesId) query = `/categories/${categoriesId}/countFanpages`;
        await client
          .get(query)
          .then((result) =>
            dispatch({
              type: types.GET_TOTAL_FANPAGES,
              payload: result.data.data,
            })
          )
          .catch((err) => console.log('Err get totalFanpage: ' + err));
      } catch (error) {
        console.log('Error get totalFanpage: ' + error);
      }
    };

export const resetState = () => {
  return (dispatch) => {
    dispatch({ type: types.GET_CONTENTS, payload: [] });
    dispatch({ type: types.GET_TOTAL_CONTENTS, payload: 0 });
    dispatch({ type: types.GET_TOTAL_FANPAGES, payload: 0 });
  };
};

const Query = (cateId = 0, page, query, limit = 0) => {
  let newQuery = '';
  let curLimit = pageLimit;
  if (limit > 0) curLimit = limit;
  if (cateId) newQuery += `cateId=${cateId}&`;
  return `${newQuery}_limit=${curLimit}&page=${page}` + query;
};
