import { combineReducers } from 'redux';
import searchAndFilterReducer from './Contents/searchAndFilterReducer';
import contentsReducer from './Contents/contentReducer';
import createContentReducer from './editor/createContentReducer';
import editorReducer from './editor/editorReducer';
import PopupContentReducer from './PopupContent/popupContentReducer';
import userReducer from './user/userReducer';
import trendingReducer from './Contents/trendingReducer';
import specialReducer from './Contents/specialReducer';
import homepageReducer from './homepage/homepageReducer';
import SchedulesReducer from './Schedules';
import CategoriesReducer from './Categories';
import HashtagsReducer from './Hashtags';
import ContentUserLikeReducers from './contentUserLike';
import runningAdsReducers from './runningAds';
import tiktokReducers from './tiktok';
import fanpagesReducers from './Fanpages';
import createPostReducers from './createContent';
import loadingReducers from './loadingApp';
import instagramReducers from './instagram';
import douyinReducers from './douyin';
import threadsReducers from './threads/index';
import textToVideo from './textToVideo';
import videoEditorReducer from './videoEditor';

const rootReducer = combineReducers({
  editor: editorReducer,
  createContent: createContentReducer,
  popupContent: PopupContentReducer,
  contents: contentsReducer,
  searchAndFilterContent: searchAndFilterReducer,
  userReducer: userReducer,
  trendings: trendingReducer,
  specialContents: specialReducer,
  homepage: homepageReducer,
  schedules: SchedulesReducer,
  categories: CategoriesReducer,
  hashtags: HashtagsReducer,
  contentUserLike: ContentUserLikeReducers,
  adsRunning: runningAdsReducers,
  tiktoks: tiktokReducers,
  douyins: douyinReducers,
  fanpages: fanpagesReducers,
  createPost: createPostReducers,
  isLoadingApp: loadingReducers,
  instagram: instagramReducers,
  threads: threadsReducers,
  textToVideo: textToVideo,
  videoEditor: videoEditorReducer,
});

export default rootReducer;
