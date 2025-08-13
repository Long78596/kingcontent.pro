import { IS_LOADING_APP } from "../../store/actions/loading";

const initialState = {
    isLoading : false
}

const loadingReducers = (state = initialState, action) => {
  switch (action.type) {
  case IS_LOADING_APP:
    return { ...state , isLoading : action.payload };

  default:
    return state
  }
};
export default loadingReducers
