import { API_VIDEO_EDITOR } from "../configs";
import Client from '../Client';

export const VideoEditorService = {
  getVideos(page = 1, perPage = 12) {
    return Client.get(
      `${API_VIDEO_EDITOR}/videos?page=${page}&per_page=${perPage}&skip_uploaded=true`
    );
  },
  removeVideo(videoId) {
    return Client.delete(
      `${API_VIDEO_EDITOR}/medias/${videoId}?mediaType=video`
    );
  },
  updateVideo(videoId, data) {
    return Client.put(
      `${API_VIDEO_EDITOR}/update-video/${videoId}`,
      data
    );
  }
}
