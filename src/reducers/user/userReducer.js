import * as types from '../../store/types/user';
import auth from '../../utils/auth';

let user = auth.getUserInfo();
let jwtToken = auth.getToken();

const userInitialState = {
  loggedIn: user ? true : false,
  token: user ? jwtToken : '',
  user: user || null,
  likedContents: null,
  likedFanpages: null,
  isSaving: false,
  isCompleteInformation : {status : false , info : {}},
};

const userReducer = (state = userInitialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case types.LOGIN_SUCCESS:
      auth.setToken(payload.access_token || payload.data.access_token, payload?.rememberMe || false);
      auth.setUserInfo(payload.data, payload?.rememberMe || false);
      // set lastCheck
      auth.set(new Date().getTime(), 'lastCheck',  payload?.rememberMe || false);
      return {
        ...state,
        loggedIn: true,
        token: payload.access_token || payload.data.access_token,
        user: payload.data,
      };

    case types.LOGIN_FAILURE:
      return {};

    case types.LOGOUT:
      auth.clearAppStorage();
      return { ...state, loggedIn: false, token: '', user: {} };

    case types.SAVE_LIKED_DATA:
      return { ...state, isSaving: true };

    case types.SAVE_LIKED_DATA_SUCCESS:
      return { ...state, isSaving: false };

    case types.SET_LIKED_CONTENTS:
      return { ...state, likedContents: payload };

    case types.SET_LIKED_FANPAGES:
      return { ...state, likedFanpages: payload };
    case types.SET_COMPLETE_INFORMATION:
      return { ...state, isCompleteInformation: payload };

    default:
      return state;
  }
};

export default userReducer;
