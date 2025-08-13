import {
  ACTION_GET_ALL_CONTENTS,
  ACTION_GET_ALL_FANPAGES,
  ACTION_GET_HASH_TAG,
  ACTION_SEARCH_CONTENT,
} from '../../store/actions/contentUserLiked';

const initialState = {
  contents: [],
  fanpages: [],
  contentsSearch: [],
  hashTags : []
};

const ContentUserLikeReducers = (state = initialState, { type,payload }) => {
  switch (type) {
    case ACTION_GET_ALL_CONTENTS:
      return {
        ...state,
        contents: payload.data.contents,
      };
    case ACTION_GET_ALL_FANPAGES:
      return {
        ...state,
        fanpages: payload,
      };
    case ACTION_GET_HASH_TAG:
      return {
        ...state,
        hashTags: payload,
      };
    case ACTION_SEARCH_CONTENT:
      return {
        ...state,
        contentsSearch: payload,
      };
    default:
      return state;
  }
};
export default ContentUserLikeReducers;
