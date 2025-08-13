import Client from '../Client';
import { API_GET_DOUYIN } from '../configs';

export const douyinService = {
  getDouyinVideos(
    inputValue = '',
    offset = 0,
    search_id = '',
    nexToken,
    lastIds = []
  ) {
    return Client.post(`${API_GET_DOUYIN}/search/videos`, {
      keyword: inputValue ? encodeURIComponent(inputValue) : '',
      offset: offset,
      token: nexToken,
      last_ids: lastIds,
    });
  },
  getAllVideoTitktok() {
    return Client.get(`${API_GET_DOUYIN}`);
  },
  getDouyinCollections() {
    return Client.get(`${API_GET_DOUYIN}/collections`);
  },
  getDouyinCollectionDetail(collectionId, page = 1) {
    return Client.get(
      `${API_GET_DOUYIN}/collections/${collectionId}?page=${page}`
    );
  },
  getDouyinFollowingChannels() {
    return Client.get(`${API_GET_DOUYIN}/channels`);
  },
  getDouyinChannels({ offset = 0, keyword = '', token = '' }) {
    return Client.get(`${API_GET_DOUYIN}/search/users`, {
      params: {
        keyword: encodeURIComponent(keyword),
        cursor: offset,
        token,
      },
    });
  },
  getDouyinVideosByChannel(channelId, cursor) {
    return Client.get(`${API_GET_DOUYIN}/channel/${channelId}`, {
      params: {
        cursor,
      },
    });
  },
  removeChannel(channelId) {
    return Client.delete(`${API_GET_DOUYIN}/channels/${channelId}`);
  },
  addChannel(channel) {
    const data = {
      sec_uid: channel?.['sec_uid'],
      name: channel?.['name'],
      description: channel?.['description'],
      avatar: channel?.['avatar'],
    };
    return Client.post(`${API_GET_DOUYIN}/channels`, channel);
  },
  saveCollection(collection) {
    const { id } = collection;
    if (id) {
      return Client.put(`${API_GET_DOUYIN}/collections/${id}`, collection);
    }
    return Client.post(`${API_GET_DOUYIN}/collections`, collection);
  },
  removeCollection(collectionId) {
    return Client.delete(`${API_GET_DOUYIN}/collections/${collectionId}`);
  },
  saveVideoToCollection(collectionId, collectionName, videos) {
    return Client.post(`${API_GET_DOUYIN}/collections/videos`, {
      collection_id: collectionId,
      collection_name: collectionName,
      videos,
    });
  },
  removeVideoFromCollection(collectionId, videoId) {
    return Client.delete(
      `${API_GET_DOUYIN}/collections/${collectionId}/videos/${videoId}`
    );
  },
  getAllCollectionsVideos() {
    return Client.get(`${API_GET_DOUYIN}/collections/videos`);
  },
  getAllCollectionsVideosDouyin() {
    return Client.get(`${API_GET_DOUYIN}/collections`);
  },
  getDetailVideo(id, isDownload = false) {
    return Client.get(`${API_GET_DOUYIN}/video/${id}`, {
      params: {
        download: isDownload ? 1 : 0,
      },
    });
  },
};
