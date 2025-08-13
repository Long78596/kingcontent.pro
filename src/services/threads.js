import Client from '../Client';
import { API_GET_THREADS } from '../configs';

export const threadsService = {
  getThreadsVideos(inputValue, offset = 0) {
    let newCursor = offset;
    if (offset !== 0) newCursor = offset.split(':');
    return Client.get(
      `${API_GET_THREADS}/search/posts?keyword=${encodeURIComponent(
        inputValue
      )}&cursor=${
        offset === 0 ? offset : `${newCursor[0]}:${Number(newCursor[1]) + 1}`
      }`
    );
  },
  getAllVideoTitktok() {
    return Client.get(`${API_GET_THREADS}`);
  },
  getThreadsCollections() {
    return Client.get(`${API_GET_THREADS}/collections`);
  },
  getThreadsCollectionDetail(collectionId, page = 1) {
    return Client.get(`${API_GET_THREADS}/collections/${collectionId}`);
  },
  getThreadsFollowingChannels() {
    return Client.get(`${API_GET_THREADS}/users`);
  },
  getThreadsChannels({ keyword = '' }) {
    return Client.get(`${API_GET_THREADS}/search/users?keyword=${keyword}`);
  },
  getThreadsVideosByChannel(channelId, offset = 0) {
    return Client.get(
      `${API_GET_THREADS}/user/posts?thread_user_id=${channelId}&cursor=${
        offset === 0 ? '' : offset
      }`
    );
  },
  removeChannel(channelId) {
    return Client.delete(`${API_GET_THREADS}/users/${channelId}`);
  },
  addChannel(channel) {
    return Client.post(`${API_GET_THREADS}/users`, channel);
  },
  saveCollection(collection) {
    const { id } = collection;
    if (id) {
      return Client.put(`${API_GET_THREADS}/collections/${id}`, collection);
    }
    return Client.post(`${API_GET_THREADS}/collections`, collection);
  },
  removeCollection(collectionId) {
    return Client.delete(`${API_GET_THREADS}/collections/${collectionId}`);
  },
  saveVideoToCollection(collectionId, collectionName, videos) {
    const newVideoArr = videos.map((elt) => {
      return {
        id: elt.id,
        code: elt.code,
        videos: elt.videos,
        images: elt.images,
      };
    });
    return Client.post(`${API_GET_THREADS}/collections/posts`, {
      collection_id: collectionId,
      collection_name: collectionName,
      posts: newVideoArr,
    });
  },
  removeVideoFromCollection(collectionId, postId) {
    return Client.delete(
      `/threads/collections/${collectionId}/posts/${postId} `
    );
  },
  getAllCollectionsVideos() {
    return Client.get(`${API_GET_THREADS}/collections/posts`);
  },
  getDetailVideo(id) {
    return Client.get(`${API_GET_THREADS}/video/${id}`);
  },
  getMyPosts(nextCursor = '') {
    const cursor = nextCursor ? `?cursor=${nextCursor}` : '';
    return Client.get(`${API_GET_THREADS}/me/posts${cursor}`);
  },
  checkSizeVideo(url) {
    return Client.post(`/media/check-size`, {
      url,
    });
  },
  getPostDetail(code) {
    return Client.get(`${API_GET_THREADS}/post?code=${code}`);
  },
  getMyInfo() {
    return Client.get(`${API_GET_THREADS}/my-info`);
  },
  getThreadsAccessToken(code) {
    return Client.post(`${API_GET_THREADS}/get-access-token`, {
      code,
    });
  },
  disconnectThreads() {
    return Client.post(`${API_GET_THREADS}/disconnect`);
  },
  getThreadComments(mediaId, cursor = '') {
    const newCursor = cursor ? `?cursor=${cursor}` : '';
    return Client.get(
      `${API_GET_THREADS}/replies?media_id=${mediaId}${newCursor}`
    );
  },
  postThreadsComment(mediaId, text) {
    return Client.post(`${API_GET_THREADS}/replies`, {
      media_id: mediaId,
      reply: text,
    });
  },
};
