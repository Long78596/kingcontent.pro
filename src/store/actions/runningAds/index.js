import { toast } from 'react-toastify';
import { OK } from '../../../configs';
import { runningAdsService } from '../../../services/runningAds';
import { getObjectTemplateCard } from './ultility';

export const ACTION_SEARCH_ADS = 'ACTION_SEARCH_ADS';
export const ACTION_EMPTY_ARR_SEARCH = 'ACTION_EMPTY_ARR_SEARCH';
export const ACTION_UPDATE_KEYWORD = 'ACTION_UPDATE_KEYWORD';

export const actionSearchADS = (
  inputValue,
  setLoading,
  collectionToken = '',
  forwardCursor = ''
) => {
  return async (dispatch) => {
    setLoading(true);
    const res = await runningAdsService.searchAds(
      inputValue,
      collectionToken,
      forwardCursor
    );
    if (res.status === OK && res?.data?.data?.decodeResults) {
      const { decodeResults = null, first_page = false } = res?.data?.data;
      if (!decodeResults) {
        dispatch({
          type: ACTION_EMPTY_ARR_SEARCH,
          payload: [],
        });
        // toast.error('Có lỗi xảy ra , vui lòng thử lại !');
        setLoading(false);
        return;
      } else {
        const _decodeResults = { ...decodeResults };
        _decodeResults.results = _decodeResults.results.map((_item) => {
          return getObjectTemplateCard(_item);
        });
        dispatch({
          type: ACTION_SEARCH_ADS,
          payload: { ..._decodeResults, first_page, keyword: inputValue },
        });
        setLoading(false);
      }
    } else {
      dispatch({
        type: ACTION_EMPTY_ARR_SEARCH,
        payload: [],
      });
      // toast.error('Có lỗi xảy ra , vui lòng thử lại !');
      setLoading(false);
    }
  };
};

export const actionUpdateKeyword = (keyword) => {
  return (dispatch) => {
    dispatch({
      type: ACTION_UPDATE_KEYWORD,
      payload: keyword,
    });
  };
};

export const actionEmptyArrSearch = () => {
  return (dispatch) => {
    dispatch({
      type: ACTION_EMPTY_ARR_SEARCH,
      payload: [],
    });
  };
};
