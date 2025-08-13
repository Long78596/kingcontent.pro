import * as types from '../../store/types/index';

const PopupContentInitialState = {
  isShowPopupContentForm: true
}

const PopupContentReducer = (state = PopupContentInitialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case types.CHANGE_STATE_SHOW_POPUP_CONTENT:
      return { ...state, isShowPopupContentForm: payload };

    default:
      return state
  }
}

export default PopupContentReducer;