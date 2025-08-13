import Client from '../Client';
import {
  API_CHANGE_PASSWORD,
  API_CHECK_MULTIPLE_CONTENTS,
  API_CREATE_MULTIPLE_COMMENTS,
  API_CREATE_MULTIPLE_CONTENTS,
  API_CREATE_SCHEDULE_CONTENT,
  API_CREATE_SINGLE_COMMENT,
  API_FB_RESOURCE,
  API_GET_FACEBOOK_DESTINATIONS,
  API_GET_SCHEDULES,
  API_REMOVE_SINGLE_COMMENT,
  API_SYSTEM_MESSAGE,
  API_GET_SINGLE_TIKTOK_VIDEO,
  API_REMOVE_SCHEDULE_CONTENT,
  API_FANPAGES,
} from '../configs';

export const userServices = {
  getFacebookDestinations() {
    return Client.get(API_GET_FACEBOOK_DESTINATIONS);
  },
  getSchedules(withOutContents = 0) {
    return Client.get(
      API_GET_SCHEDULES + `?without_contents=${withOutContents}`
    );
  },
  getScheduleContents(scheduleId) {
    return Client.get(`${API_GET_SCHEDULES}/${scheduleId}`);
  },
  createScheduleContent(payload) {
    return Client.post(API_CREATE_SCHEDULE_CONTENT, payload);
  },
  removeScheduleContent(id) {
    return Client.delete(API_REMOVE_SCHEDULE_CONTENT + '/' + id);
  },
  checkMultipleContents(payload) {
    return Client.post(API_CHECK_MULTIPLE_CONTENTS, payload);
  },
  addMultipleContents(payload) {
    return Client.post(API_CREATE_MULTIPLE_CONTENTS, payload);
  },
  addMultipleComments(payload) {
    return Client.post(API_CREATE_MULTIPLE_COMMENTS, payload);
  },
  addSingleComment(payload) {
    return Client.post(API_CREATE_SINGLE_COMMENT, payload);
  },
  removeSingleComment(id) {
    return Client.delete(API_REMOVE_SINGLE_COMMENT + '/' + id);
  },
  getMessage() {
    return Client.get(API_SYSTEM_MESSAGE);
  },
  getFpAndGr() {
    return Client.get(API_FB_RESOURCE);
  },
  changePassword(data) {
    return Client.post(API_CHANGE_PASSWORD, data);
  },
  updateMessageSystem(data) {
    return Client.put(API_SYSTEM_MESSAGE, data);
  },
  getSingleTikTokVideo(type, video) {
    return Client.get(
      API_GET_SINGLE_TIKTOK_VIDEO + `?type=${type}&video=${video}`
    );
  },
  getSingleScheduleContent(id) {
    return Client.get(API_GET_SCHEDULES + '/source-content/' + id);
  },
  putFanpageToQueue(data) {
    return Client.post(API_FANPAGES + '/queue-fanpage', data);
  },
  removeScheduleContents(ids) {
    return Client.post(`${API_GET_SCHEDULES}/remove-contents`, { ids: ids });
  },
  updateScheduleContentStatus(ids = [], scheduleId, status) {
    return Client.post(`${API_GET_SCHEDULES}/update-status`, {
      ids: ids,
      schedule_id: scheduleId,
      status: status,
    });
  },
  removeSchedule(id) {
    return Client.delete(`${API_GET_SCHEDULES}/${id}`);
  },
  getScheduledContents() {
    return Client.get(`${API_GET_SCHEDULES}/scheduled-contents`);
  },
  removeSchedules(ids) {
    return Client.post(`${API_GET_SCHEDULES}/remove-multiples`, { ids: ids });
  },
};
