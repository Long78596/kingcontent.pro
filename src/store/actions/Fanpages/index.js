import moment from 'moment';
import { OK } from '../../../configs';
import { fanpageService } from '../../../services/fanpages';
import client from '../../../Client';
export const ACTION_GET_ALL_FANPAGE = 'ACTION_GET_ALL_FANPAGE';
export const ACTION_SEARCH_FANPAGE = 'ACTION_SEARCH_FANPAGE';
export const ACTION_CHANGE_STATUS_SEARCH = 'ACTION_CHANGE_STATUS_SEARCH';
export const ACTION_IS_LOADING = 'ACTION_IS_LOADING';
export const ACTION_SAVE_CATEGORY = 'ACTION_SAVE_CATEGORY';
export const ACTION_SAVE_PAGE = 'ACTION_SAVE_PAGE';

export const actionGetAllFanpage = (page, limit, setFanpageSaved) => {
  return async (dispatch) => {
    const res = await fanpageService.getAllFanpage(page, limit);
    if (res.status === OK) {
      dispatch({
        type: ACTION_GET_ALL_FANPAGE,
        payload: res.data.data.data || [],
      });
    }
  };
};

export const actionSearchFanpage = (data) => {
  return (dispatch) => {
    dispatch({
      type: ACTION_SEARCH_FANPAGE,
      payload: data,
    });
  };
};
export const actionSearchFanpagesByCategories = (cateId, start) => {
  return async (dispatch) => {
    const res = await fanpageService.searchFanpagesByCategories(
      'category',
      cateId,
      start,
      'posts_count',
      'desc'
    );
    if (res.status === OK) {
      dispatch(actionIsLoading(false));
      let newData = [];
      const resData = res.data.data.data || [];
      if (resData.length > 0) {
        newData = resData.map((_elt) => {
          return {
            ..._elt,
            time: new Date(_elt?.createdAt),
          };
        });
      }
      dispatch({
        type: ACTION_SEARCH_FANPAGE,
        payload: newData,
      });
    }
  };
};
export const actionChangeStatus = (status) => {
  return (dispatch) => {
    dispatch({
      type: ACTION_CHANGE_STATUS_SEARCH,
      payload: status,
    });
  };
};
export const actionIsLoading = (status) => {
  return (dispatch) => {
    dispatch({
      type: ACTION_IS_LOADING,
      payload: status,
    });
  };
};

export const actionSearchFanpagesByName = (name, category, isFilter, start) => {
  return async (dispatch) => {
    const res = await fanpageService.searchFanpagesByName(
      name,
      category,
      isFilter,
      start
    );
    if (res.status === OK) {
      dispatch(actionIsLoading(false));
      const newData = res?.data?.data?.data || [];
      dispatch({
        type: ACTION_SEARCH_FANPAGE,
        payload: newData,
      });
    }
  };
};
export const actionSaveCategory = (page) => {
  return (dispatch) => {
    dispatch({
      type: ACTION_SAVE_CATEGORY,
      payload: page,
    });
  };
};
export const actionSavePageSelect = (page) => {
  return (dispatch) => {
    dispatch({
      type: ACTION_SAVE_PAGE,
      payload: page,
    });
  };
};
