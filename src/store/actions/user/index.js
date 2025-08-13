import * as types from '../../types/user';
import client from '../../../Client';
import auth from '../../../utils/auth';
import { API_USER_LIKED_CONTENT, OK } from '../../../configs';
import { toast } from 'react-toastify';
import { confirmAlert } from 'react-confirm-alert';
import { actionGetAllContent } from '../contentUserLiked';

export const loginFunction =
  ({ identifier, password, rememberMe = false }) =>
  async (dispatch) => {
    try {
      dispatch({
        type: types.SET_COMPLETE_INFORMATION,
        payload: { status: false, info: {} },
      });
      const response = await client.post(`/login`, {
        email: identifier,
        password,
      });
      if (response) {
        const { data } = response;
        dispatch({
          type: types.LOGIN_SUCCESS,
          payload: { ...data, rememberMe: rememberMe },
        });
      } else {
        dispatch({
          type: types.LOGIN_FAILURE,
          payload: response,
        });
        toast.error('Đăng nhập không thành công');
      }
    } catch (err) {
      toast.error('Đăng nhập không thành công');
    }
  };

export const loginFBFunction = (request) => async (dispatch, history) => {
  try {
    const response = await client.post(`/fb-login`, request);
    if (response.status === OK && response) {
      if (response.data.access_token === null) {
        dispatch({
          type: types.SET_COMPLETE_INFORMATION,
          payload: { status: true, info: response.data.data },
        });
      } else {
        dispatch({
          type: types.LOGIN_SUCCESS,
          payload: response.data,
        });
        toast.success('Đăng nhập thành công !');
      }
    } else {
      dispatch({
        type: types.LOGIN_FAILURE,
        payload: response,
      });
    }
  } catch (err) {
    console.log('error:', err);
  }
};

export const logoutFunction =
  (noMessage = false) =>
  async (dispatch) => {
    try {
      auth.clearAppStorage();
      !noMessage && toast.success('Đăng xuất thành công !');
      dispatch({ type: types.LOGOUT });
    } catch (err) {
      console.log('error:', err);
    }
  };

export const registerFunction = (data, setTypeForm, type, reset) => {
  return async (dispatch) => {
    try {
      const response = await client.post('/register', data);
      if (response.status === OK) {
        setTypeForm(type);
        toast.success('Đăng kí thành công !');
        reset && reset();
      }
    } catch (error) {
      // Handle API call error
      if (error.response) {
        // The request was made, but the server responded with a status code outside of the 2xx range
        if (error.response.status === 422) {
          // Handle 422 status code (validation errors)
          toast.error(error.response.data.message);
        } else {
        }
      } else if (error.request) {
        // The request was made, but no response was received
      } else {
        // Something happened in setting up the request that triggered an Error
      }
    }
  };
};

export const getUserInfo = () => async (dispatch) => {
  try {
    const response = await client.get('/me');
    if (response.status === OK) {
      dispatch({
        type: types.LOGIN_SUCCESS,
        payload: response.data,
      });
    } else {
      dispatch(logoutFunction(true));
    }
  } catch (err) {
    console.log('error:', err);
  }
};

export const saveLikedData =
  (postData = {}, history, togglePopupTag) =>
  async (dispatch) => {
    try {
      dispatch({
        type: types.SAVE_LIKED_DATA,
      });
      await client
        .post(API_USER_LIKED_CONTENT, postData)
        .then((result) => {
          if (result.status === OK) {
            const { contents = [], fanpages = [] } = result.data.data;
            dispatch(actionGetAllContent());
            dispatch({
              type: types.SET_LIKED_CONTENTS,
              payload: contents,
            });
            dispatch({
              type: types.SET_LIKED_FANPAGES,
              payload: fanpages,
            });
            togglePopupTag && togglePopupTag();
            confirmAlert({
              title: 'Xác nhận',
              message: 'Đã chuyển content vào mục yêu thích thành công !',
              buttons: [
                {
                  label: 'Chuyển tới mục yêu thích',
                  onClick: () => {
                    if (history) {
                      history.push('/content-da-thich');
                    }
                  },
                },
                {
                  label: 'Ok',
                  onClick: () => {},
                },
              ],
            });
          }
        })
        .catch((err) => console.log('Err get totalFanpage: ' + err));
      dispatch({
        type: types.SAVE_LIKED_DATA_SUCCESS,
      });
    } catch (error) {
      console.log('Error get totalFanpage: ' + error);
    }
  };
export const updateLikedData =
  (id, postData = {}, togglePopupTag, setDeps) =>
  async (dispatch) => {
    try {
      dispatch({
        type: types.SAVE_LIKED_DATA,
      });
      await client
        .put(`${API_USER_LIKED_CONTENT}/${id}`, postData)
        .then(() => {
          setDeps && setDeps();
          togglePopupTag();
          toast.success('Cập nhật thành công !');
        })
        .catch((err) => console.log('Err get totalFanpage: ' + err));
      dispatch({
        type: types.SAVE_LIKED_DATA_SUCCESS,
      });
    } catch (error) {
      console.log('Error get totalFanpage: ' + error);
    }
  };

export const removeLikedData = (typeId) => async (dispatch) => {
  try {
    dispatch({
      type: types.SAVE_LIKED_DATA,
    });
    const endpoint = API_USER_LIKED_CONTENT;
    await client
      .delete(`${endpoint}/${typeId}`)
      .then((result) => {
        if (result.status === OK) {
          const { contents = [], fanpages = [] } = result.data.data;
          dispatch({
            type: types.SET_LIKED_CONTENTS,
            payload: contents,
          });
          dispatch({
            type: types.SET_LIKED_FANPAGES,
            payload: fanpages,
          });
        }
      })
      .catch((err) => console.log('Err get totalFanpage: ' + err));
    dispatch({
      type: types.SAVE_LIKED_DATA_SUCCESS,
    });
  } catch (error) {
    console.log('Error get totalFanpage: ' + error);
  }
};

export const getLikedData = () => async (dispatch) => {
  try {
    await client
      .get(API_USER_LIKED_CONTENT)
      .then((result) => {
        if (result.status === OK) {
          const { contents = [], fanpages = [] } = result.data.data;
          dispatch({
            type: types.SET_LIKED_CONTENTS,
            payload: contents,
          });
          dispatch({
            type: types.SET_LIKED_FANPAGES,
            payload: fanpages,
          });
        } else {
          dispatch({
            type: types.SET_LIKED_CONTENTS,
            payload: [],
          });
          dispatch({
            type: types.SET_LIKED_FANPAGES,
            payload: [],
          });
        }
      })
      .catch((err) => {
        dispatch({
          type: types.SET_LIKED_CONTENTS,
          payload: [],
        });
        dispatch({
          type: types.SET_LIKED_FANPAGES,
          payload: [],
        });
        console.log('Err get totalFanpage: ' + err);
      });
  } catch (error) {
    dispatch({
      type: types.SET_LIKED_CONTENTS,
      payload: [],
    });
    dispatch({
      type: types.SET_LIKED_FANPAGES,
      payload: [],
    });
    console.log('Error get totalFanpage: ' + error);
  }
};
