import * as types from '../../types';
import client from '../../../Client';
import moment from 'moment';
import { OK } from '../../../configs';

export const setKeywordsSearchTrendings = (keywords) => (dispatch) => {
  dispatch({ type: types.SET_KEYWORDS_SEARCH_TRENDINGS, payload: keywords });
};

export const getTrendingWithKeywords =
  (pageLimit = 12, page = 1, keywords = '', setTotalPages) =>
  async (dispatch) => {
    const result = await client.get(
      `/hot-trend-contents?page=${page}&_limit=${pageLimit}${
        keywords ? `&keyword=${keywords}` : ''
      }`
    );
    if (result.status === OK) {
      dispatch({
        type: types.GET_TRENDING_WITH_KEYWORDS,
        payload: { contents: result.data.data.data, fromSchedule: false },
      });
      setTotalPages(result.data.data.last_page);
    }
  };
export const getTrendingWithPagination =
  (page = 1, setLoading, keywords) =>
  async (dispatch) => {
    let query = `page=${page}${keywords ? `&keyword=${keywords}` : ''}`;
    const result = await client.get(`/hot-trend-contents?${query}`);
    if (result.status === OK) {
      dispatch({
        type: types.GET_TRENDING_WITH_KEYWORDS,
        payload: { contents: result.data.data.data },
      });
      setLoading && setLoading();
    }
  };

export const getTotalTrendingContents =
  (pageLimit = 12, page = 1, keywords) =>
  async (dispatch) => {
    try {
      let start = page > 1 ? (page - 1) * pageLimit : 0;
      let query = `&_limit=${pageLimit}&_start=${start}`;
      query += `&_where[content_contains]=${keywords}`;
      const result = await client.get(`/categories/countContents?${query}`);
      if (result.status === OK) {
        dispatch({
          type: types.GET_TOTAL_TRENDING_CONTENTS,
          payload: result?.data?.data || 0,
        });
      }
    } catch (error) {
      console.log('Error: ' + error);
    }
  };
