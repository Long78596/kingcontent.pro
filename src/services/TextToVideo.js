import Client from '../Client';
import { API_TEXT_TO_VIDEO } from '../configs';

export const TextToVideoService = {
  getVoices() {
    return Client.get(
      `${API_TEXT_TO_VIDEO}/voices`
    );
  },
  getLanguages() {
    return Client.get(
      `${API_TEXT_TO_VIDEO}/languages`
    );
  },
  getFonts() {
    return Client.get(
      `${API_TEXT_TO_VIDEO}/fonts`
    );
  },
  getMusics() {
    return Client.get(
      `${API_TEXT_TO_VIDEO}/musics`
    );
  },
  PromptToScript(prompt, style, wordCount, language) {
    return Client.post(
      `${API_TEXT_TO_VIDEO}/prompt-to-script`,
      {
        prompt: prompt,
        style: style,
        length: wordCount,
        language: language,
      }
    );
  },
  RequestGenerateVideo(formData, onUploadProgress) {
    return Client.post(
      `${API_TEXT_TO_VIDEO}/script-to-video`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 0,
        onUploadProgress: onUploadProgress,
      }
    );
  },
  getPendingVideos() {
    return Client.get(
      `${API_TEXT_TO_VIDEO}/pending`
    );

  },
  getCompletedVideos(page = 1, id = '') {
    return Client.get(
      `${API_TEXT_TO_VIDEO}/completed?page=${page}&id=${id}`,
    );
  },
  deleteVideos(id) {
    return Client.delete(
      `${API_TEXT_TO_VIDEO}/completed/${id}`
    );
  }
};
