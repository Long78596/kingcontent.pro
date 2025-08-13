import * as types from '../../store/types/index';

const searchAndFilterInitialState = {
  fanpageID: '',
  typeOfContent: '',
  numsLike: '',
  numsComment: '',
  numsShare: '',
  numsWord: '',
  freqLike: '',
  freqComment: '',
  freqShare: '',
  freqSave: '',
  freqTime: '',  
  fromDate: '',
  toDate: '',
  keywords: '',
  options: 'content'  
}

const searchAndFilterReducer = (state = searchAndFilterInitialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case types.SET_VALUE_FBID_TO_SEARCH:     
      // console.log({payload});      
      return {...state, fanpageID: payload }
    
    case types.SET_VALUE_TYPE_OF_CONTENT_TO_SEARCH:
      // console.log({payload});      
      return {...state, typeOfContent: payload }
      
    case types.SET_VALUE_NUMS_LIKE_TO_FILTER:
      // console.log({payload});      
      return {...state, numsLike: payload }
      
    case types.SET_VALUE_NUMS_COMMENT_TO_FILTER:
      // console.log({payload});      
      return {...state, numsComment: payload }
      
    case types.SET_VALUE_NUMS_SHARE_TO_FILTER:
      // console.log({payload});      
      return {...state, numsShare: payload }
      
    case types.SET_VALUE_NUMS_WORD_TO_FILTER:
      // console.log({payload});      
      return {...state, numsWord: payload }
      
    case types.SET_VALUE_FREQ_LIKE_TO_FILTER:
      // console.log({payload});      
      return {...state, freqLike: payload }
      
    case types.SET_VALUE_FREQ_COMMENT_TO_FILTER:
      // console.log({payload});      
      return {...state, freqComment: payload }
      
    case types.SET_VALUE_FREQ_SHARE_TO_FILTER:
      // console.log({payload});      
      return {...state, freqShare: payload }
      
    case types.SET_VALUE_FREQ_SAVE_TO_FILTER:
      // console.log({payload});      
      return {...state, freqSave: payload }
      
    case types.SET_VALUE_FREQ_TIME_TO_FILTER:
      // console.log({payload});      
      return {...state, freqTime: payload }   
    
      case types.SET_VALUE_FROM_DATE_TO_SEARCH:
      // console.log(payload);      
      return {...state, fromDate: payload}   
      
      case types.SET_VALUE_TO_DATE_TO_SEARCH:
      // console.log(payload);      
      return {...state, toDate: payload}   
      
      case types.SET_VALUE_KEYWORDS_TO_SEARCH:
      // console.log(payload);      
      return {...state, keywords: payload}   
      
      case types.SET_VALUE_OPTIONS_TO_SEARCH:
      // console.log(payload);      
      return {...state, options: payload}   
      
    default:
      return state
  }
}

export default searchAndFilterReducer;