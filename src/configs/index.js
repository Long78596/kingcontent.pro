export const API_USER_LIKED_CONTENT = 'liked-data';
export const API_HAGTAG = 'hagtah';
export const API_SEARCH_ADS_RUNNING = 'search-ads';
export const API_FANPAGES = 'fanpages';
export const API_CATEGORIES = 'categories';
export const API_GOOGLE_SUBJECTS = 'google-suggestion-subjects?_limit=-1';
export const API_FIND_BY_KEYWORD = 'contents';
export const API_EDIT_SUGGEST_KEYWORD = '/editor-subject-suggestions';
export const API_EDIT_SUGGEST_KEYWORD_GG = '/google-suggestion-subjects';
export const API_ACTION_GET_POST_BY_CONTENT_TRENDDING =
  'https://kingcontent.pro/wp-admin/admin-ajax.php?action=get_google_suggestion_detail&keyword';
export const API_GET_DESIGNS = '/designs';
export const API_GET_DESIGN_CATEGORIES = '/designs/categories';
export const API_GET_VPCS_KEYWORD = '/replace-keywords';
export const API_GET_WORD_IDEA = 'words-ideas';
export const API_USER_CONTENT = '/user-contents';
export const API_UPLOAD_IMAGE_VIDEO_FOR_USER = '/upload';
export const API_GET_GOOGLE_SUGGESTIONS = '/suggestions/google';
export const API_GET_GOOGLE_SUGGESTIONS_DETAIL = '/suggestions/google-detail';
export const API_GET_TIKTOK = '/tiktok';
export const API_GET_DOUYIN = '/douyin';
export const API_GET_THREADS = '/threads';
export const API_GET_INSTAGAM = '/instagram';
export const API_QUESTION_CHAT_GPT = '/chatgpt/get-results';
export const API_BANK_QUESTION = '/chatgpt/sg-categories';
export const API_HISTORY = '/chatgpt/histories';
export const API_GET_FACEBOOK_DESTINATIONS = '/fb-resources';
export const API_GET_SCHEDULES = '/schedules';
export const API_CREATE_CONTENT = '/created-contents';
export const API_AI_GENERATE_CONTENT = '/generated-contents';
export const API_SYSTEM_MESSAGE = '/system/message';
export const API_FB_RESOURCE = '/fb-resources';
export const API_CHANGE_PASSWORD = '/change-password';
export const API_PROMT = '/promt';
export const API_SPECIAL_HASHTAG = '/special-hash-tags';
// PLAN

export const API_CREATE_LABEL = '/labels';
export const API_SUGGESTION_LABELS = '/suggestion-labels';

export const API_CREATE_PLAN = '/plans';

export const API_CREATE_SCHEDULE_CONTENT = '/schedules/create-content';
export const API_REMOVE_SCHEDULE_CONTENT = '/schedules/remove-content';
export const API_CHECK_MULTIPLE_CONTENTS = '/schedules/check-multiple-contents';
export const API_CREATE_MULTIPLE_CONTENTS =
  '/schedules/create-multiple-contents';
export const API_CREATE_SINGLE_COMMENT = '/schedule-comments/create-single';
export const API_CREATE_MULTIPLE_COMMENTS =
  '/schedule-comments/create-multiple';
export const API_REMOVE_SINGLE_COMMENT = '/schedule-comments';
export const API_GET_SINGLE_TIKTOK_VIDEO = '/tiktok/video';
export const API_TEXT_TO_VIDEO = '/text-to-video';
export const API_VIDEO_EDITOR = '/video-editor';

export const _LIMIT_CURRENT_SMALL = 30;
export const _LIMIT_CURRENT_MEDIUM = 50;
export const _LIMIT_CURRENT_LARGE = 70;
export const COLLECTION_MAX_ITEMS_WARNING = 30;
export const deleteWhiteSpace = (string) => {
  return string.replaceAll(' ', '');
};
export const isArrayEmpty = (arr) => {
  return arr.length === 0 ? true : false;
};
export const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};
export const OK = 200;
export const BAD_REQUEST = 400;
export const _LIMIT_DEFAULT = 20;
export const EMPTY_DATA = 'Không có dữ liệu hiển thị';

export const uniqueObjInArray = (dataArr, propertyUnique) => {
  const unique = dataArr
    .map((e) => e[propertyUnique])
    // store the keys of the unique objects
    .map((e, i, final) => final.indexOf(e) === i && i)
    // eliminate the dead keys & store unique objects
    .filter((e) => dataArr[e])
    .map((e) => dataArr[e]);
  return unique.map((_elt) => {
    return {
      ..._elt,
      //   title: _elt[].replace(/[^\p{L}\p{N}\p{P}\p{Z}^$\n]|br/gu, ' '),
    };
  });
};

export const uniquePropertyObjectInArray = (
  dataArr,
  objectName,
  propertyUnique
) => {
  const unique = dataArr
    .map((e) => (e[objectName] ? e[objectName][propertyUnique] : null))
    // store the keys of the unique objects
    .map((e, i, final) => final.indexOf(e) === i && i)
    // eliminate the dead keys & store unique objects
    .filter((e) => dataArr[e])
    .map((e) => dataArr[e]);
  return unique.map((_elt) => {
    return {
      ..._elt,
      //   title: _elt[].replace(/[^\p{L}\p{N}\p{P}\p{Z}^$\n]|br/gu, ' '),
    };
  });
};
export const nFormatter = (num) => {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'G';
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return num;
};
export const PATH_NAME_CONTENT_LIKED = '/content-da-thich';
export const DEFAULT_TAKE_CARE_CAT = 257;
export const VIDEO_EDITOR_URL = process.env.VIDEO_EDITOR_URL ?? 'http://localhost:3000';