import * as types from '../../types/schedules';
import { toast } from 'react-toastify';
import client from '../../../Client';
import { userServices } from '../../../services/users';
import { API_CREATE_PLAN, OK } from '../../../configs';
import moment from 'moment';
import { threadsService } from '../../../services/threads';
import { tiktokService } from '../../../services/tiktok';
const loadLimitPage = 10;

export const setShowSuggestionsPopup = (state) => (dispatch) => {
  dispatch({ type: types.SET_SHOW_SUGGESTIONS_POPUP, payload: state });
};

export const setShowSourceIdeasPopup = (state) => (dispatch) => {
  dispatch({
    type: types.CHANGE_STATE_SCHEDULE_SHOW_SOURCE_IDEAS,
    payload: state,
  });
};

export const setShowSourceIdeasAutoPopup = (state) => (dispatch) => {
  dispatch({
    type: types.CHANGE_STATE_SCHEDULE_SHOW_SOURCE_IDEAS_AUTO,
    payload: state,
  });
};

export const setShowScheduleCommentsPopup = (state) => (dispatch) => {
  dispatch({
    type: types.CHANGE_STATE_SHOW_SCHEDULE_COMMENTS_POPUP,
    payload: state,
  });
};

export const setCurrentDateTime =
  (state = null) =>
  (dispatch) => {
    if (!state) {
      const next10Minutes = moment()
        .utc(true)
        .add(10, 'minutes')
        .format('YYYY-MM-DD HH:mm:ss');
      state = next10Minutes;
    }
    dispatch({
      type: types.UPDATE_CURRENT_DATE_TIME,
      payload: state,
    });
  };

export const setShowScheduleItemPopup = (state) => (dispatch) => {
  dispatch({ type: types.SET_SHOW_SCHEDULE_ITEM_POPUP, payload: state });
};
export const setScheduleItemPopupToShow = (content) => (dispatch) => {
  dispatch({ type: types.SET_SCHEDULE_ITEM_POPUP_TO_SHOW, payload: content });
};
export const setScheduleItemPopupToShowMultiple = (contents) => (dispatch) => {
  dispatch({
    type: types.SET_SCHEDULE_ITEM_POPUP_TO_SHOW_MULTIPLE,
    payload: contents,
  });
};

export const setShowSchedulesPane = (state) => (dispatch) => {
  dispatch({ type: types.SET_SHOW_SCHEDULES_PANE, payload: state });
};

export const setShowCreateSchedulePopup = (state) => (dispatch) => {
  dispatch({ type: types.SET_SHOW_CREATE_SCHEDULE_POPUP, payload: state });
};

export const setShowSelectSuggestsPopup = (state) => (dispatch) => {
  dispatch({ type: types.SET_SHOW_SELECT_SUGGESTS_POPUP, payload: state });
};
export const setValueMonday = (value) => (dispatch) => {
  dispatch({ type: types.SET_VALUE_MONDAY, payload: value });
};
export const setValueSunday = (value) => (dispatch) => {
  dispatch({ type: types.SET_VALUE_SUNDAY, payload: value });
};
export const setValueMonth = (value) => (dispatch) => {
  dispatch({ type: types.SET_VALUE_MONTH, payload: value });
};
export const setValueYear = (value) => (dispatch) => {
  dispatch({ type: types.SET_VALUE_YEAR, payload: value });
};
export const setIsChangeWeek = (value) => (dispatch) => {
  dispatch({ type: types.SET_IS_CHANGE_WEEK, payload: value });
};
export const setIsChangeMonth = (value) => (dispatch) => {
  dispatch({ type: types.SET_IS_CHANGE_MONTH, payload: value });
};
export const setValueFirstDayOfMonth = (value) => (dispatch) => {
  dispatch({ type: types.SET_VALUE_FIRST_DAY_OF_MONTH, payload: value });
};
export const setValueWeek = (value) => (dispatch) => {
  dispatch({ type: types.SET_VALUE_WEEK, payload: value });
};
export const setSuggestionContent = (content) => (dispatch) => {
  dispatch({ type: types.SET_SUGGESTION_CONTENT, payload: content });
};
export const setSuggestionsContent = (content) => (dispatch) => {
  dispatch({ type: types.SET_SUGGESTIONS_CONTENT, payload: content });
};

export const setCurrentSuggestionSubject = (subject) => (dispatch) => {
  dispatch({ type: types.SET_CURRENT_SUGGESTIONS_SUBJECT, payload: subject });
};

export const changeStateSelectedCat = (value) => (dispatch) => {
  dispatch({ type: types.CHANGE_SCHEDULE_SELECTED_CATEGORY, payload: value });
};

export const changeStateCategoriesPopup = (value) => (dispatch) => {
  dispatch({
    type: types.CHANGE_STATE_SCHEDULE_SHOW_CATEGORIES,
    payload: value,
  });
};

// export const setValueSortBy = (value) => dispatch => {
//   dispatch({ type: types.SET_VALUE_SORT_BY, payload: value})
// }

export const getAllEvents = () => async (dispatch) => {
  try {
    const { data } = await client.get(`/suggestions/events`);
    dispatch({ type: types.GET_ALL_SCHEDULE_EVENTS, payload: data.data });
  } catch (error) {
    console.log('error', error);
  }
};

export const getUserContents = () => async (dispatch) => {
  try {
    dispatch({ type: types.GET_USER_CREATED_CONTENTS });
    const { data } = await client.get(`/created-contents`);
    dispatch({ type: types.GET_USER_CREATED_CONTENTS_SUCCESS, payload: data.data });
  } catch (error) {
    console.log('error', error);
  }
};

export const getUserPlans = () => async (dispatch) => {
  try {
    const { data } = await client.get(API_CREATE_PLAN);
    dispatch({ type: types.GET_USER_PLANS, payload: data.data });
  } catch (error) {
    console.log('error', error);
  }
};

export const getSuggestionSystemContents =
  (catId = 0, page = 1, query = '') =>
  async (dispatch) => {
    try {
      if (catId) {
        dispatch({
          type: types.SET_IS_LOADING_GET_SUGGESTIONS_CONTENT,
          payload: true,
        });
        let endpoint = `/categories/${catId}/contents?page=${page}`;
        if (query) {
          endpoint += `&${query}`;
        }
        await client
          .get(endpoint)
          .then((result) => {
            dispatch({
              type: types.SET_IS_LOADING_GET_SUGGESTIONS_CONTENT,
              payload: false,
            });
            const { data, current_page, last_page } = result.data.data;
            dispatch({
              type: types.GET_SUGGESTIONS_CONTENT,
              payload: {
                contents: data,
                page: current_page,
                totalPages: last_page,
              },
            });
          })
          .catch((err) => console.log('Err get Suggestions contents: ' + err));
      }
    } catch (error) {
      console.log('getSuggestionSystemContents Error: ', error);
    }
  };

export const getSuggestionTrendingContents =
  (page = 1, query = '') =>
  async (dispatch) => {
    try {
      const apiEndpoint = `/hot-trend-contents`;
      dispatch({
        type: types.SET_IS_LOADING_GET_SUGGESTIONS_CONTENT,
        payload: true,
      });
      const start = page > 1 ? (page - 1) * loadLimitPage : 0;
      await client
        .get(`${apiEndpoint}?_limit=${loadLimitPage}&_start=${start}&${query}`)
        .then((result) => {
          dispatch({
            type: types.SET_IS_LOADING_GET_SUGGESTIONS_CONTENT,
            payload: false,
          });
          dispatch({
            type: types.GET_SUGGESTIONS_CONTENT,
            payload: result.data.data,
          });
        })
        .catch((err) =>
          console.log('Err get Suggestions trending contents: ' + err)
        );
    } catch (error) {
      console.log('getSuggestionTrendingContents Error: ', error);
    }
  };

export const getEventContents =
  (event_id = 0, page = 1, query = '') =>
  async (dispatch) => {
    try {
      const apiEndpoint = `/event-contents`;
      let endpoint = `${apiEndpoint}?page=${page}`;
      if (event_id) endpoint += `&event_id=${event_id}`;
      if (query) endpoint += `&${query}`;
      dispatch({
        type: types.GET_EVENT_CONTENTS,
        payload: { contents: [], page: 1, totalPages: 1 },
      });
      await client
        .get(endpoint)
        .then((result) => {
          const { data, current_page, last_page } = result.data.data;
          const newData = data.map((_elt) => {
            return {
              ..._elt,
              medias: [_elt.image_url] || [
                'https://53.fs1.hubspotusercontent-na1.net/hub/53/hubfs/image8-2.jpg?width=595&height=400&name=image8-2.jpg',
              ],
            };
          });
          dispatch({
            type: types.GET_EVENT_CONTENTS,
            payload: {
              contents: newData,
              page: current_page,
              totalPages: last_page,
            },
          });
        })
        .catch((err) =>
          console.log('Err get Suggestions trending contents: ' + err)
        );
    } catch (error) {
      console.log('getSuggestionTrendingContents Error: ', error);
    }
  };

export const getScheduledContents = () => async (dispatch) => {
  try {
    dispatch({
      type: types.GET_SCHEDULED_CONTENTS,
    });
    const res = await userServices.getScheduledContents();
    dispatch({
      type: types.GET_SCHEDULED_CONTENTS_SUCCESS,
      payload: res?.data?.data,
    });
  } catch (error) {
    dispatch({
      type: types.GET_SCHEDULED_CONTENTS_SUCCESS,
      payload: [],
    });
  }
};

export const getScheduleContents =
  (limit = 0, date_publish = '', fromDate = '', toDate = '', scheduleId = 0) =>
  async (dispatch) => {
    let query = `_limit=${limit}`;
    if (date_publish) {
      query += `&date_publish=${date_publish}`;
    }
    if (fromDate) {
      query += `&from_date=${fromDate}`;
    }
    if (toDate) {
      query += `&to_date=${toDate}`;
    }
    if (scheduleId > 0) {
      query += `&schedule_id=${scheduleId}`;
    }
    try {
      toast.info('Đang lấy nội dung đã lên lịch, vui lòng chờ trong giây lát');
      await client
        .get(`/schedules/contents?${query}`)
        .then((result) => {
          dispatch({
            type: types.GET_SCHEDULE_CONTENTS,
            payload: result.data.data,
          });
          toast.dismiss();
        })
        .catch((err) => console.log('Err get Schedule contents: ' + err));
    } catch (error) {
      console.log('getScheduleContents Error: ', error);
    }
  };

export const updateSelectedDateTime = (selectedDate) => async (dispatch) => {
  try {
    dispatch({
      type: types.UPDATE_CURRENT_DATE_TIME,
      payload: selectedDate,
    });
  } catch (error) {
    dispatch({
      type: types.UPDATE_CURRENT_DATE_TIME,
      payload: null,
    });
  }
};

export const setIsShowFinalStep = (isShow) => async (dispatch) => {
  try {
    dispatch({
      type: types.SET_IS_SHOW_FINAL_STEP,
      payload: isShow,
    });
  } catch (error) {
    dispatch({
      type: types.SET_IS_SHOW_FINAL_STEP,
      payload: false,
    });
  }
};

export const setIsShowFinalStepAuto = (isShow) => async (dispatch) => {
  try {
    dispatch({
      type: types.SET_IS_SHOW_FINAL_STEP_AUTO,
      payload: isShow,
    });
  } catch (error) {
    dispatch({
      type: types.SET_IS_SHOW_FINAL_STEP_AUTO,
      payload: false,
    });
  }
};

export const setSelectedScheduleContent = (content) => async (dispatch) => {
  try {
    dispatch({
      type: types.SET_SELECTED_CONTENT_TO_SCHEDULE,
      payload: content,
    });
  } catch (error) {
    dispatch({
      type: types.SET_SELECTED_CONTENT_TO_SCHEDULE,
      payload: null,
    });
  }
};

export const GET_SCHEDULE_HOME_PAGE = 'GET_SCHEDULE_HOME_PAGE';
export const GET_SCHEDULE_HOME_PAGE_SUCCESS = 'GET_SCHEDULE_HOME_PAGE_SUCCESS';

export const getScheduleContentsHomepage =
  (limit = 0, date_publish) =>
  async (dispatch) => {
    dispatch({
      type: GET_SCHEDULE_HOME_PAGE,
      payload: null,
    });
    try {
      await client
        .get(
          `/schedules/contents?_limit=${limit}&${
            date_publish && `date_publish=${date_publish}`
          }`
        )
        .then((result) => {
          dispatch({
            type: GET_SCHEDULE_HOME_PAGE_SUCCESS,
            payload: result?.data?.data || [],
          });
        })
        .catch((err) => console.log('Err get Schedule contents: ' + err));
    } catch (error) {
      console.log('getScheduleContents Error: ', error);
    }
  };

export const getFacebookDestinations = () => async (dispatch) => {
  try {
    dispatch({
      type: types.GET_FACEBOOK_DESTINATIONS,
    });
    const res = await userServices.getFacebookDestinations();
    dispatch({
      type: types.GET_FACEBOOK_DESTINATIONS_SUCCESS,
      payload: res?.data?.data,
    });
  } catch (error) {
    dispatch({
      type: types.GET_FACEBOOK_DESTINATIONS_FAILED,
    });
  }
};

export const getThreadsInfo = () => async (dispatch) => {
  try {
    dispatch({
      type: types.GET_THREADS_INFO,
    });
    const res = await threadsService.getMyInfo();
    dispatch({
      type: types.GET_THREADS_INFO_SUCCESS,
      payload: res?.data?.data,
    });
  } catch (error) {
    dispatch({
      type: types.GET_THREADS_INFO_FAILED,
    });
  }
};

// function get tiktok info
export const getTikTokInfo = () => async (dispatch) => {
  try {
    dispatch({
      type: types.GET_TIKTOK_INFO,
    });
    const res = await tiktokService.getTikTokUserInfo();
    dispatch({
      type: types.GET_TIKTOK_INFO_SUCCESS,
      payload: res?.data?.data,
    });
  } catch (error) {
    dispatch({
      type: types.GET_TIKTOK_INFO_FAILED,
    });
  }
};

export const getSchedules =
  (withOutContents = 0) =>
  async (dispatch) => {
    try {
      dispatch({
        type: types.GET_SCHEDULES,
      });
      const res = await userServices.getSchedules(withOutContents);
      dispatch({
        type: types.GET_SCHEDULES_SUCCESS,
        payload: res?.data?.data,
      });
    } catch (error) {
      dispatch({
        type: types.GET_SCHEDULES_FAILED,
      });
    }
  };

export const setScheduleWaitingList = (newList) => async (dispatch) => {
  dispatch({
    type: types.SET_SCHEDULE_WAITING_LIST,
    payload: newList,
  });
};

export const setScheduleCommentsWaitingList = (newList) => async (dispatch) => {
  dispatch({
    type: types.SET_SCHEDULE_COMMENTS_WAITING_LIST,
    payload: newList,
  });
};

export const setCurrentScheduleContent = (content) => async (dispatch) => {
  dispatch({
    type: types.SET_CURRENT_SCHEDULE_CONTENT,
    payload: content,
  });
};

export const setCurrentScheduleContentType = (type) => async (dispatch) => {
  dispatch({
    type: types.SET_CURRENT_SCHEDULE_CONTENT_TYPE,
    payload: type,
  });
};

export const setCurrentSchedule = (schedule) => async (dispatch) => {
  dispatch({
    type: types.SET_CURRENT_SCHEDULE,
    payload: schedule,
  });
};

//CHANGE_STATE_SHOW_MANAGE_SCHEDULE
export const changeStateShowManageSchedule = (state) => async (dispatch) => {
  dispatch({
    type: types.CHANGE_STATE_SHOW_MANAGE_SCHEDULE,
    payload: state,
  });
};

export const manageSetCurrentSchedule = (schedule) => async (dispatch) => {
  dispatch({
    type: types.MANAGE_SET_CURRENT_SCHEDULE,
    payload: schedule,
  });
};

export const manageGetScheduleContents = (scheduleId) => async (dispatch) => {
  try {
    dispatch({
      type: types.MANAGE_GET_SCHEDULE_CONTENTS,
    });
    const res = await userServices.getScheduleContents(scheduleId);
    dispatch({
      type: types.MANAGE_GET_SCHEDULE_CONTENTS_SUCCESS,
      payload: res?.data?.data?.contents || [],
    });
  } catch (error) {
    console.log('🚀 ~ manageGetScheduleContents ~ error:', error);
  }
};

export const removeScheduleContents = (ids) => async (dispatch) => {
  try {
    const res = await userServices.removeScheduleContents(ids);
    if (res.status === OK) {
      toast.success('Xóa nội dung thành công');
    } else {
      toast.error('Xóa nội dung thất bại');
    }
  } catch (error) {
    console.log('🚀 ~ removeScheduleContents ~ error:', error);
  }
};

export const updateScheduleContentsStatus =
  (schedule_id = 0, ids = [], status) =>
  async (dispatch) => {
    try {
      const res = await userServices.updateScheduleContentStatus(
        ids,
        schedule_id,
        status
      );
      if (res.status === OK) {
        toast.success('Cập nhật trạng thái thành công');
      } else {
        toast.error('Cập nhật trạng thái thất bại');
      }
    } catch (error) {
      console.log('🚀 ~ updateScheduleContentsStatus ~ error:', error);
    }
  };

export const removeSchedule = (id) => async (dispatch) => {
  try {
    const res = await userServices.removeSchedule(id);
    if (res.status === OK) {
      toast.success('Xóa lịch thành công');
    } else {
      toast.error('Xóa lịch thất bại');
    }
  } catch (error) {
    console.log('🚀 ~ removeSchedule ~ error:', error);
  }
};

export const removeSchedules = (ids) => async (dispatch) => {
  try {
    const res = await userServices.removeSchedules(ids);
    if (res.status === OK) {
      toast.success('Xóa lịch đã chọn thành công');
      // reload schedules
      dispatch(getSchedules(1));
    } else {
      toast.error(
        'Xóa lịch đã chọn thất bại, vui lòng liên hệ với chúng tôi để được hỗ trợ'
      );
    }
  } catch (error) {
    console.log('🚀 ~ removeSchedules ~ error:', error);
  }
};

export const commentSetCurrentSchedule = (schedule) => async (dispatch) => {
  dispatch({
    type: types.COMMENT_SET_CURRENT_SCHEDULE,
    payload: schedule,
  });
};

export const commentGetScheduleContents = (scheduleId) => async (dispatch) => {
  try {
    dispatch({
      type: types.COMMENT_GET_SCHEDULE_CONTENTS,
    });
    const res = await userServices.getScheduleContents(scheduleId);
    dispatch({
      type: types.COMMENT_GET_SCHEDULE_CONTENTS_SUCCESS,
      payload: res?.data?.data?.contents || [],
    });
  } catch (error) {}
};

export const setSelectedEvent = (event) => async (dispatch) => {
  dispatch({
    type: types.SET_SELECTED_EVENT,
    payload: event,
  });
};

export const setCurrentEditingContent = (content) => async (dispatch) => {
  dispatch({
    type: types.SET_CURRENT_EDITING_CONTENT,
    payload: content,
  });
};

export const resetEditingContents = () => async (dispatch) => {
  dispatch({
    type: types.RESET_EDITING_CONTENTS,
  });
};

export const updateEditingContent = (content) => async (dispatch) => {
  dispatch({
    type: types.UPDATE_EDITING_CONTENT,
    payload: content,
  });
};
