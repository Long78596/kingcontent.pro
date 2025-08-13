import axios from 'axios';
import Client from '../Client';
import {
  API_FIND_BY_KEYWORD,
  API_GET_DESIGN_CATEGORIES,
  API_GET_DESIGNS,
  API_GET_VPCS_KEYWORD,
  API_GET_WORD_IDEA,
  API_GOOGLE_SUBJECTS,
  API_UPLOAD_IMAGE_VIDEO_FOR_USER,
  _LIMIT_CURRENT_LARGE,
  API_GET_GOOGLE_SUGGESTIONS,
  API_QUESTION_CHAT_GPT,
  API_BANK_QUESTION,
  API_HISTORY,
  API_CREATE_LABEL,
  API_CREATE_PLAN,
  API_CREATE_CONTENT,
  API_SUGGESTION_LABELS,
  API_USER_LIKED_CONTENT,
  API_PROMT,
  API_AI_GENERATE_CONTENT,
} from '../configs';
import { updateHistory } from '../store/actions/createContent';

export const CreateContent = {
  getDataByKeyword(keyword, page = 1) {
    return Client.get(
      `${API_GET_GOOGLE_SUGGESTIONS}?q=${keyword}&page=${page}`
    );
  },
  getTrendContent(page = 1, query = '') {
    let endpoint = `/hot-trend-contents?page=${page}`;
    if (query) {
      endpoint += `${query}`;
    }
    return Client.get(endpoint);
  },
  getGoogleSubjects(key) {
    return Client.get(`${API_GOOGLE_SUBJECTS}&title=${key}`);
  },
  getPostByKeyWord(key) {
    return Client.get(`${API_FIND_BY_KEYWORD}?content_contains=${key}`);
  },
  getKeyWord(api, query, type) {
    return Client.get(`${api}?${query}=${type}`);
  },
  getChartTrendding(key, page = 1) {
    return axios.get(
      `https://kingcontent.pro/wp-admin/admin-ajax.php?action=get_google_trending_charts&keyword=${key}`
    );
  },
  getParentCategory() {
    return Client.get(`/categories/parents`);
  },
  getAllChildCategories() {
    return Client.get(`/categories/children`);
  },
  getChildCategories(id) {
    return Client.get(`/categories/${id}/children`);
  },
  getContentByParentIds(cateId) {
    return Client.get(
      `/categories/${cateId}/contents&_limit=${_LIMIT_CURRENT_LARGE}&_start=0`
    );
  },
  getDesigns(page, catId) {
    let endpoint = `${API_GET_DESIGNS}?page=${page}`;
    if (catId) {
      endpoint += `&cat_id=${catId}`;
    }
    return Client.get(endpoint);
  },
  getDesginCategories() {
    return Client.get(`${API_GET_DESIGN_CATEGORIES}`);
  },
  getVPCSKeyWord() {
    return Client.get(API_GET_VPCS_KEYWORD);
  },
  getWordIdea() {
    return Client.get(API_GET_WORD_IDEA);
  },
  createPost(content) {
    return Client.post(API_CREATE_CONTENT, content);
  },
  updatePost(id, content) {
    return Client.put(`${API_CREATE_CONTENT}/${id}`, content);
  },
  getSpecialTrack(page = 1, query = '') {
    let endpoint = `special-contents?page=${page}`;
    if (query) {
      endpoint += `&${query}`;
    }
    return Client.get(endpoint);
  },
  getSpecialContents(page = 1, query = '') {
    let endpoint = `special-contents?page=${page}`;
    if (query) {
      endpoint += `&${query}`;
    }
    return Client.get(endpoint);
  },
  uploadFile(file) {
    return Client.post(API_UPLOAD_IMAGE_VIDEO_FOR_USER, file);
  },
  questionChatGPT(question) {
    return Client.post(API_QUESTION_CHAT_GPT, question);
  },
  getBankQuestion() {
    return Client.get(API_BANK_QUESTION);
  },
  getListHistory() {
    return Client.get(API_HISTORY);
  },
  addHistory(data) {
    return Client.post(API_HISTORY, data);
  },
  deleteHistory(id) {
    return Client.delete(`${API_HISTORY}/${id}`);
  },
  updateHistory(id, data) {
    return Client.put(`${API_HISTORY}/${id}`, data);
  },
  removeHistoryHashtag(hashtag){
    return Client.delete(`${API_HISTORY}/hashtag?name=${hashtag}`);
  },
  updateHistoryHashtag(data){
    return Client.put(`${API_HISTORY}/hashtag`, data);
  },
  createPlan(data) {
    return Client.post(`${API_CREATE_PLAN}`, data);
  },
  updatePlan(id, data) {
    return Client.put(`${API_CREATE_PLAN}/${id}`, data);
  },
  // editPlan
  getPlans() {
    return Client.get(`${API_CREATE_PLAN}?with_contents=false`);
  },
  getPlan(id) {
    return Client.get(`${API_CREATE_PLAN}/${id}`);
  },
  updateLabelIdInContent(id, labelId) {
    return Client.put(`${API_CREATE_CONTENT}/${id}`, { label_id: labelId });
  },
  deleteContent(id, timeout = 0) {
    return Client.delete(`${API_CREATE_CONTENT}/${id}`);
  },
  deletePlan(id) {
    return Client.delete(`${API_CREATE_PLAN}/${id}`);
  },
  getAllLabel() {
    return Client.get(`${API_CREATE_LABEL}`);
  },
  getSuggestionLabels(column = 1) {
    return Client.get(`${API_SUGGESTION_LABELS}?column=${column}`);
  },
  createLabel(data) {
    return Client.post(`${API_CREATE_LABEL}`, data);
  },
  updateLabel(id, data) {
    return Client.put(`${API_CREATE_LABEL}/${id}`, data);
  },
  deleteLabel(id) {
    return Client.delete(`${API_CREATE_LABEL}/${id}`);
  },
  pinLabel(id, data) {
    return Client.put(`${API_CREATE_LABEL}/${id}`, data);
  },
  deleteHagTags(id) {
    return Client.delete(`/liked-data/${id}`);
  },
  editHagTags(id, data) {
    return Client.put(`${API_USER_LIKED_CONTENT}/${id}`, data);
  },
  getChatGPTcategories() {
    return Client.get(`${API_PROMT}/categories`);
  },
  getQuestionInCate(cateId) {
    return Client.get(`${API_PROMT}/questions?category_id=${cateId}`);
  },
  generateContents(planId, labelId, contents) {
    return Client.post(`${API_AI_GENERATE_CONTENT}`, {
      plan_id:planId,
      label_id:labelId,
      contents:contents
    });
  },
  generateAContent(ids) {
    return Client.post(`${API_AI_GENERATE_CONTENT}/request`, {
        ids:ids
    });
  },
};
