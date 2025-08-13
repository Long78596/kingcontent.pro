import { isArray } from 'lodash';
import Client from '../Client';
import { API_GET_INSTAGAM } from '../configs';

export const instagramService = {
  searchUsers(inputValue) {
    return Client.get(`${API_GET_INSTAGAM}/search?keyword=${inputValue}`);
  },
  searchHashtagPosts(inputValue, nextCursor = '') {
    let endpoint = `${API_GET_INSTAGAM}/hashtag?tagname=${inputValue}`;
    if (nextCursor) {
      endpoint += `&cursor=${nextCursor}`;
    }
    return Client.get(endpoint);
  },
  getUserPosts(username, cursor) {
    return Client.get(
      `${API_GET_INSTAGAM}/feed?username=${username}&cursor=${cursor}`
    );
  },
  getUserReels(userId, cursor) {
    return Client.get(
      `${API_GET_INSTAGAM}/reels?user_id=${userId}&cursor=${cursor}`
    );
  },
  getReelDetail(reelId, code = '') {
    return Client.get(`${API_GET_INSTAGAM}/reel?id=${reelId}&code=${code}`);
  },
  getInstagramCollections() {
    return Client.get(`${API_GET_INSTAGAM}/collections`);
  },
  getInstagramCollectionDetail(collectionId, page = 1) {
    return Client.get(
      `${API_GET_INSTAGAM}/collections/${collectionId}?page=${page}`
    );
  },
  getCollectionPosts() {
    return Client.get(`${API_GET_INSTAGAM}/collections/posts`);
  },
  saveCollection(collectionData) {
    const { id } = collectionData;
    if (id) {
      return Client.put(
        `${API_GET_INSTAGAM}/collections/${id}`,
        collectionData
      );
    }
    return Client.post(`${API_GET_INSTAGAM}/collections`, collectionData);
  },
  updateCollection(collectionId, collectionData) {
    // collectionData = { name: 'test'}
    return Client.put(
      `${API_GET_INSTAGAM}/collections/${collectionId}`,
      collectionData
    );
  },
  removeCollection(collectionId) {
    return Client.delete(`${API_GET_INSTAGAM}/collections/${collectionId}`);
  },
  savePostsToCollection(collectionId, collection_name, postData) {
    return Client.post(`${API_GET_INSTAGAM}/collections/posts`, {
      collection_id: collectionId,
      collection_name,
      posts: postData,
    });
  },
  removePostsFromCollection(collectionId, postId) {
    return Client.delete(
      `${API_GET_INSTAGAM}/collections/${collectionId}/posts/${postId}`
    );
  },
  getCollectionDetail(collectionId) {
    return Client.get(`${API_GET_INSTAGAM}/collections/${collectionId}`);
  },
  getInstagramSavedUsers() {
    return Client.get(`${API_GET_INSTAGAM}/users`);
  },
  saveUser(userData) {
    // userData = { username: 1, picture: 'test', page_name: 'test'}
    return Client.post(`${API_GET_INSTAGAM}/users`, userData);
  },
  removeUser(userId) {
    return Client.delete(`${API_GET_INSTAGAM}/users/${userId}`);
  },
  getPostsInfo(postIds = []) {
    const ids = isArray(postIds)
      ? postIds.map((id) => `ids[]=${id}`).join('&')
      : `ids[]=${postIds}`;
    return Client.get(`${API_GET_INSTAGAM}/list?${ids}`);
  },
};
