import * as types from '../../store/types/hashtag';

const hashtagsInitialState = {
  hashtags: [],
  keywords: '',
}

const HashtagsReducer = (state = hashtagsInitialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case types.GET_HASHTAGS:      
      return {...state, hashtags: payload}
    default:
      return state
  }
}

export default HashtagsReducer;