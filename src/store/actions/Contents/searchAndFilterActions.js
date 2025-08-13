import * as types from '../../types';

export const setValueFbIdToSearch = (value) => dispatch => {
  dispatch({ type: types.SET_VALUE_FBID_TO_SEARCH, payload: value })
}

export const setValueTypeOfContentToSearch = (value) => dispatch => {
  dispatch({ type: types.SET_VALUE_TYPE_OF_CONTENT_TO_SEARCH, payload: value })
}

export const setValueNumsLikeToFilter = (value) => dispatch => {
  dispatch({ type: types.SET_VALUE_NUMS_LIKE_TO_FILTER, payload: value })
}
export const setValueNumsCommentToFilter = (value) => dispatch => {
  dispatch({ type: types.SET_VALUE_NUMS_COMMENT_TO_FILTER, payload: value })
}
export const setValueNumsShareToFilter = (value) => dispatch => {
  dispatch({ type: types.SET_VALUE_NUMS_SHARE_TO_FILTER, payload: value })
}
export const setValueNumsWordToFilter = (value) => dispatch => {
  dispatch({ type: types.SET_VALUE_NUMS_WORD_TO_FILTER, payload: value })
}
export const setValueFreqLikeToFilter = (value) => dispatch => {
  dispatch({ type: types.SET_VALUE_FREQ_LIKE_TO_FILTER, payload: value })
}
export const setValueFreqCommentToFilter = (value) => dispatch => {
  dispatch({ type: types.SET_VALUE_FREQ_COMMENT_TO_FILTER, payload: value })
}
export const setValueFreqShareToFilter = (value) => dispatch => {
  dispatch({ type: types.SET_VALUE_FREQ_SHARE_TO_FILTER, payload: value })
}
export const setValueFreqSaveToFilter = (value) => dispatch => {
  dispatch({ type: types.SET_VALUE_FREQ_SAVE_TO_FILTER, payload: value })
}
export const setValueFreqTimeToFilter = (value) => dispatch => {
  dispatch({ type: types.SET_VALUE_FREQ_TIME_TO_FILTER, payload: value })
}
export const setValueFromDateToSearch = (value) => dispatch => {
  dispatch({ type: types.SET_VALUE_FROM_DATE_TO_SEARCH, payload: value })
}
export const setValueToDateToSearch = (value) => dispatch => {
  dispatch({ type: types.SET_VALUE_TO_DATE_TO_SEARCH, payload: value })
}
export const setValueKeywordsToSearch = (value) => dispatch => {
  dispatch({ type: types.SET_VALUE_KEYWORDS_TO_SEARCH, payload: value })
}
export const setValueOptionsToSearch = (value) => dispatch => {
  dispatch({ type: types.SET_VALUE_OPTIONS_TO_SEARCH, payload: value })
}