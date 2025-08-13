import Client from '../Client';
import { API_GET_TIKTOK } from '../configs';

export const tiktokService = {
  getTiktokVideos(inputValue, offset = 0, search_id = '') {
    // convert # to %23
    inputValue = inputValue.replace('#', '%23');
    return Client.get(
      `${API_GET_TIKTOK}?keyword=${inputValue}&offset=${offset}&search_id=${search_id}`
    );
  },
  getAllVideoTitktok() {
    return Client.get(`${API_GET_TIKTOK}`);
  },
  getVideoMediaURL(video_id) {
    return Client.get(`${API_GET_TIKTOK}/video/${video_id}/media`);
  },
  getTiktokCollections() {
    return Client.get(`${API_GET_TIKTOK}/collections`);
  },
  getTiktokCollectionDetail(collectionId, page = 1) {
    return Client.get(
      `${API_GET_TIKTOK}/collections/${collectionId}?page=${page}`
    );
  },
  getTiktokFollowingChannels() {
    return Client.get(`${API_GET_TIKTOK}/channels`);
  },
  getTiktokChannels({ offset = 0, search_id = '', keyword = '' }) {
    return Client.get(
      `${API_GET_TIKTOK}/search-channels?offset=${offset}&search_id=${search_id}&keyword=${keyword}`
    );
  },
  getTiktokVideosByChannel(
    channelId,
    offset = 0,
    sort_type = 'latest',
    search_id = ''
  ) {
    let endpoint = `${API_GET_TIKTOK}?channel_id=${channelId}`;
    if (offset) {
      endpoint += `&offset=${offset}`;
    }
    if (search_id) {
      endpoint += `&search_id=${search_id}`;
    }
    if (sort_type) {
      endpoint += `&sort_type=${sort_type}`;
    }
    return Client.get(endpoint);
  },
  getTikTokVideosByManualLinks(links) {
    return Client.post(`${API_GET_TIKTOK}/manual-links`, { links });
  },
  removeChannel(channelId) {
    return Client.delete(`${API_GET_TIKTOK}/channels/${channelId}`);
  },
  addChannel(channel) {
    return Client.post(`${API_GET_TIKTOK}/channels`, channel);
  },
  saveCollection(collection) {
    const { id } = collection;
    if (id) {
      return Client.put(`${API_GET_TIKTOK}/collections/${id}`, collection);
    }
    return Client.post(`${API_GET_TIKTOK}/collections`, collection);
  },
  removeCollection(collectionId) {
    return Client.delete(`${API_GET_TIKTOK}/collections/${collectionId}`);
  },
  saveVideoToCollection(collectionId, collectionName, videos) {
    return Client.post(`${API_GET_TIKTOK}/collections/videos`, {
      collection_id: collectionId,
      collection_name: collectionName,
      videos,
    });
  },
  removeVideoFromCollection(collectionId, videoId) {
    return Client.delete(
      `${API_GET_TIKTOK}/collections/${collectionId}/videos/${videoId}`
    );
  },
  getAllCollectionsVideos() {
    return Client.get(`${API_GET_TIKTOK}/collections/videos`);
  },
  getTikTokAccessToken(code) {
    return Client.post(`${API_GET_TIKTOK}/get-access-token`, {
      code,
    });
  },
  disconnectTikTok() {
    return Client.post(`${API_GET_TIKTOK}/disconnect`);
  },
  getTikTokUserInfo() {
    return Client.get(`${API_GET_TIKTOK}/user-info`);
  },
  getMyVideos() {
    return Client.get(`${API_GET_TIKTOK}/user-videos`);
  },
  getVideoScript(video_id) {
    return Client.get(`${API_GET_TIKTOK}/video/${video_id}/script`);
  },
};
