import moment from 'moment';
import * as types from '../../store/types/schedules';
import { DEFAULT } from '../../components/Schedules/Sourceldeas/utility';


const SchedulesReducerInitialState = {
  showSuggestionsPopup: false,
  showScheduleItemPopup: false,
  scheduleItemPopupToShow: null,
  scheduleMultipleItemsToShow: null,
  showSchedulesPane: true,
  showCreateSchedulePopup: false,
  // showCreateSchedulePopup: true,
  showSelectSuggestsPopup: false,
  valueMonday: null,
  valueSunday: null,
  currentSchedule: null,
  valueWeek: [],
  valueFirstDayOfMonth: new Date(),
  valueMonth: 0,
  valueYear: 0,
  isChangeMonth: false,
  isChangeWeek: false,
  scheduleEvents: [],
  selectedEvent: null,
  isLoadingUserContents: true,
  userContents: [],
  userPlans: [],
  suggestionsContent: [],
  suggestionsTotalPages: 1,
  suggestionsCurrentPage: 1,
  suggestionContent: [],
  isLoadingSuggestionsContent: true,
  sortBy: null,
  scheduleContents: [],
  showChooseCategories: true,
  selectedCat: null,
  currentSuggestionsSubject: null,
  showSourceIdeas: false,
  showSourceIdeasAuto: false,
  showScheduleComments: false,
  specialContents: [],
  selectedDateTime: null,
  eventContents: [],
  eventTotalPages: 1,
  selectedScheduleContent: null,
  isShowFinalStep: false,
  isShowFinalStepAuto: false,
  isDestinationLoading: false,
  listDestinations: null,
  isSchedulesLoading: false,
  schedules: null,
  currentEditingContent: null,
  autoWaitingList: {
    source_type: 'system',
    contents: [],
    is_reels: 0,
    start_date: moment(new Date()).format('YYYY-MM-DD'),
    end_date: moment(new Date()).format('YYYY-MM-DD'),
    start_time: moment(new Date()).format('HH:mm'),
    time_space: 120,
    search_replace: [],
    is_random_emojies: true,
    is_random_characters: true,
    remove_all_hashtags: false,
    is_remove_contents: false,
    is_add_source: true,
    is_random_characters_comment: false,
    is_random_emojies_comment: false,
    before_content: '',
    after_content: '',
    comments: [],
    is_auto_comment: 0,
  },
  scheduleCommentsWaitingList: {
    content_ids: [],
    comments: [
      {
        id: 1,
        message: '',
        is_random_characters: true,
        is_random_emojis: true,
      },
    ],
    begin_date: new Date(),
    start_time: new Date(),
    multiple_timespace: 0,
  },
  currentScheduleContentType: DEFAULT,
  isShowManageSchedules: false,
  manageCurrentSchedule: null,
  manageScheduleContents: null,
  manageIsLoadingContents: false,

  commentsCurrentSchedule: null,
  commentsScheduleContents: null,
  commentsIsLoadingContents: false,

  scheduledContents: null,

  editingContents: [],
  currentChangeContent: null,
  threadsInfo: null,
  tiktokInfo: null,
};

const SchedulesReducer = (state = SchedulesReducerInitialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case types.CHANGE_STATE_SCHEDULE_SHOW_SOURCE_IDEAS:
      return { ...state, showSourceIdeas: payload };

    case types.CHANGE_STATE_SCHEDULE_SHOW_SOURCE_IDEAS_AUTO:
      return { ...state, showSourceIdeasAuto: payload };

    case types.CHANGE_STATE_SHOW_SCHEDULE_COMMENTS_POPUP:
      return { ...state, showScheduleComments: payload };

    case types.SET_SHOW_SUGGESTIONS_POPUP:
      return { ...state, showSuggestionsPopup: payload };

    case types.SET_SHOW_SCHEDULE_ITEM_POPUP:
      return { ...state, showScheduleItemPopup: payload };

    case types.SET_SCHEDULE_ITEM_POPUP_TO_SHOW:
      return { ...state, scheduleItemPopupToShow: payload };

    case types.SET_SCHEDULE_ITEM_POPUP_TO_SHOW_MULTIPLE:
      return { ...state, scheduleMultipleItemsToShow: payload };

    case types.SET_SHOW_SCHEDULES_PANE:
      return { ...state, showSchedulesPane: payload };

    case types.SET_SHOW_CREATE_SCHEDULE_POPUP:
      return { ...state, showCreateSchedulePopup: payload };

    case types.SET_SHOW_SELECT_SUGGESTS_POPUP:
      return { ...state, showSelectSuggestsPopup: payload };

    case types.SET_VALUE_MONDAY:
      return { ...state, valueMonday: payload };

    case types.SET_VALUE_SUNDAY:
      return { ...state, valueSunday: payload };

    case types.SET_VALUE_WEEK:
      return { ...state, valueWeek: payload };

    case types.SET_VALUE_FIRST_DAY_OF_MONTH:
      return { ...state, valueFirstDayOfMonth: payload };

    case types.SET_VALUE_MONTH:
      return { ...state, valueMonth: payload };

    case types.SET_VALUE_YEAR:
      return { ...state, valueYear: payload };

    case types.SET_IS_CHANGE_WEEK:
      return { ...state, isChangeWeek: payload };

    case types.SET_IS_CHANGE_MONTH:
      return { ...state, isChangeMonth: payload };

    case types.GET_ALL_SCHEDULE_EVENTS:
      return { ...state, scheduleEvents: payload };

    case types.SET_SELECTED_EVENT:
      return { ...state, selectedEvent: payload };

    case types.GET_USER_CREATED_CONTENTS:
      return { ...state, userContents: [], isLoadingUserContents: true };

    case types.GET_USER_CREATED_CONTENTS_SUCCESS:
      return { ...state, userContents: payload, isLoadingUserContents: false };

    case types.GET_USER_PLANS:
      return { ...state, userPlans: payload };

    case types.SET_IS_LOADING_GET_SUGGESTIONS_CONTENT:
      return { ...state, isLoadingSuggestionsContent: payload };

    case types.GET_SUGGESTIONS_CONTENT:
      const { page = 1 } = payload;
      if (page === 1) {
        return {
          ...state,
          suggestionsContent: payload.contents,
          suggestionsTotalPages: payload.totalPages,
          suggestionsCurrentPage: page,
        };
      } else {
        return {
          ...state,
          suggestionsContent: [
            ...state.suggestionsContent,
            ...payload.contents,
          ],
          suggestionsTotalPages: payload.totalPages,
          suggestionsCurrentPage: page,
        };
      }

    case types.GET_EVENT_CONTENTS:
      if (payload.page === 1) {
        return {
          ...state,
          eventContents: payload.contents,
          eventTotalPages: payload.totalPages,
        };
      } else {
        return {
          ...state,
          eventContents: [...state.eventContents, ...payload.contents],
          eventTotalPages: payload.totalPages,
        };
      }

    case types.SET_SUGGESTIONS_CONTENT:
      return { ...state, suggestionsContent: payload };

    case types.SET_SUGGESTION_CONTENT:
      return { ...state, suggestionContent: payload };

    case types.GET_SCHEDULE_CONTENTS:
      return { ...state, scheduleContents: payload };

    case types.CHANGE_STATE_SCHEDULE_SHOW_CATEGORIES:
      return { ...state, showChooseCategories: payload };

    case types.CHANGE_SCHEDULE_SELECTED_CATEGORY:
      return { ...state, selectedCat: payload };

    case types.SET_CURRENT_SUGGESTIONS_SUBJECT:
      return { ...state, currentSuggestionsSubject: payload };

    case types.UPDATE_CURRENT_DATE_TIME:
      return { ...state, selectedDateTime: payload };

    case types.SET_SELECTED_CONTENT_TO_SCHEDULE:
      return { ...state, selectedScheduleContent: payload };

    case types.SET_IS_SHOW_FINAL_STEP:
      return { ...state, isShowFinalStep: payload };

    case types.SET_IS_SHOW_FINAL_STEP_AUTO:
      return { ...state, isShowFinalStepAuto: payload };

    case types.GET_FACEBOOK_DESTINATIONS:
      return { ...state, isDestinationLoading: true };

    case types.GET_FACEBOOK_DESTINATIONS_SUCCESS:
      return {
        ...state,
        isDestinationLoading: false,
        listDestinations: payload,
      };

    case types.GET_FACEBOOK_DESTINATIONS_FAILED:
      return { ...state, isDestinationLoading: false, listDestinations: null };

    case types.GET_SCHEDULES:
      return { ...state, isSchedulesLoading: true };

    case types.GET_SCHEDULES_SUCCESS:
      return {
        ...state,
        isSchedulesLoading: false,
        schedules: payload,
      };

    case types.GET_SCHEDULES_FAILED:
      return { ...state, isSchedulesLoading: false, schedules: null };

    case types.SET_SCHEDULE_WAITING_LIST:
      if (payload === null) {
        return {
          ...state,
          autoWaitingList: SchedulesReducerInitialState.autoWaitingList,
        };
      }
      return { ...state, autoWaitingList: payload };

    case types.SET_SCHEDULE_COMMENTS_WAITING_LIST:
      return { ...state, scheduleCommentsWaitingList: payload };

    case types.SET_CURRENT_SCHEDULE_CONTENT:
      return { ...state, currentEditingContent: payload };

    case types.SET_CURRENT_SCHEDULE_CONTENT_TYPE:
      return { ...state, currentScheduleContentType: payload };

    case types.SET_CURRENT_SCHEDULE:
      return { ...state, currentSchedule: payload };

    case types.MANAGE_SET_CURRENT_SCHEDULE:
      return { ...state, manageCurrentSchedule: payload };

    case types.CHANGE_STATE_SHOW_MANAGE_SCHEDULE:
      return { ...state, isShowManageSchedules: payload };

    case types.MANAGE_GET_SCHEDULE_CONTENTS:
      return {
        ...state,
        manageIsLoadingContents: true,
        manageScheduleContents: null,
      };

    case types.MANAGE_GET_SCHEDULE_CONTENTS_SUCCESS:
      return {
        ...state,
        manageIsLoadingContents: false,
        manageScheduleContents: payload,
      };

    case types.COMMENT_SET_CURRENT_SCHEDULE:
      return { ...state, commentsCurrentSchedule: payload };

    case types.COMMENT_GET_SCHEDULE_CONTENTS:
      return {
        ...state,
        commentsIsLoadingContents: true,
        commentsScheduleContents: null,
      };

    case types.COMMENT_GET_SCHEDULE_CONTENTS_SUCCESS:
      return {
        ...state,
        commentsIsLoadingContents: false,
        commentsScheduleContents: payload,
      };

    case types.GET_SCHEDULED_CONTENTS:
      return { ...state, scheduledContents: [] };

    case types.GET_SCHEDULED_CONTENTS_SUCCESS:
      return { ...state, scheduledContents: payload };

    case types.UPDATE_EDITING_CONTENT: {
      const { id, text, source_type } = payload;
      const editingContents = state.editingContents;

      if (editingContents.length === 0) {
        return { ...state, editingContents: [{ id, text, source_type }] };
      }

      const findContent = editingContents.find(
        (content) => content.id === id && content.source_type === source_type
      );

      if (findContent) {
        const newEditingContents = editingContents.map((content) => {
          if (content.id === id && content.source_type === source_type) {
            return { ...content, text };
          }
          return content;
        });
        return { ...state, editingContents: newEditingContents };
      } else {
        return {
          ...state,
          editingContents: [...editingContents, { id, text, source_type }],
        };
      }
    }

    case types.RESET_EDITING_CONTENTS:
      return { ...state, editingContents: [] };

    case types.SET_CURRENT_EDITING_CONTENT:
      return { ...state, currentChangeContent: payload };

    case types.GET_THREADS_INFO:
    case types.GET_THREADS_INFO_FAILED:
      return { ...state, threadsInfo: null };

    case types.GET_THREADS_INFO_SUCCESS:
      return { ...state, threadsInfo: payload };

    case types.GET_TIKTOK_INFO:
    case types.GET_TIKTOK_INFO_FAILED:
      return { ...state, tiktokInfo: null };

    case types.GET_TIKTOK_INFO_SUCCESS:
      return { ...state, tiktokInfo: payload };

    default:
      return state;
  }
};
export default SchedulesReducer;
