import { toast } from 'react-toastify';
import { OK } from '../../../configs';
import { instagramService } from '../../../services/instagram';
export const INSTAGRAM_GET_USERS = 'INSTAGRAM_GET_USERS';
export const INSTAGRAM_GET_USERS_SUCCESS = 'INSTAGRAM_GET_USERS_SUCCESS';
export const INSTAGRAM_GET_USER_POSTS = 'INSTAGRAM_GET_USER_POSTS';
export const INSTAGRAM_GET_USER_POSTS_SUCCESS =
  'INSTAGRAM_GET_USER_POSTS_SUCCESS';
export const INSTAGRAM_GET_USER_REELS = 'INSTAGRAM_GET_USER_REELS';
export const INSTAGRAM_GET_USER_REELS_SUCCESS =
  'INSTAGRAM_GET_USER_REELS_SUCCESS';
export const INSTAGRAM_GET_REEL_DETAIL = 'INSTAGRAM_GET_REEL_DETAIL';
export const INSTAGRAM_GET_REEL_DETAIL_SUCCESS =
  'INSTAGRAM_GET_REEL_DETAIL_SUCCESS';
export const INSTAGRAM_SET_CURRENT_USER = 'INSTAGRAM_SET_CURRENT_USER';
export const INSTAGRAM_SET_CURRENT_CONTENT = 'INSTAGRAM_SET_CURRENT_CONTENT';
export const INSTAGRAM_SET_CURRENT_KEYWORD = 'INSTAGRAM_SET_CURRENT_KEYWORD';
export const INSTAGRAM_GET_USER_SAVED = 'INSTAGRAM_GET_USER_SAVED';
export const INSTAGRAM_GET_USER_SAVED_SUCCESS =
  'INSTAGRAM_GET_USER_SAVED_SUCCESS';
export const INSTAGRAM_GET_COLLECTIONS = 'INSTAGRAM_GET_COLLECTIONS';
export const INSTAGRAM_GET_COLLECTIONS_SUCCESS =
  'INSTAGRAM_GET_COLLECTIONS_SUCCESS';
export const INSTAGRAM_GET_COLLECTION_DETAIL =
  'INSTAGRAM_GET_COLLECTION_DETAIL';
export const INSTAGRAM_GET_COLLECTION_DETAIL_SUCCESS =
  'INSTAGRAM_GET_COLLECTION_DETAIL_SUCCESS';
export const INSTAGRAM_GET_COLLECTION_POSTS = 'INSTAGRAM_GET_COLLECTION_POSTS';
export const INSTAGRAM_GET_COLLECTION_POSTS_SUCCESS =
  'INSTAGRAM_GET_COLLECTION_POSTS_SUCCESS';
export const INSTAGRAM_SET_CURRENT_COLLECTION =
  'INSTAGRAM_SET_CURRENT_COLLECTION';
export const INSTAGRAM_UPDATE_CHOSEN_POSTS = 'INSTAGRAM_UPDATE_CHOSEN_POSTS';
export const INSTAGRAM_SET_CURRENT_CONTENT_TYPE =
  'INSTAGRAM_SET_CURRENT_CONTENT_TYPE';
export const INSTAGRAM_SET_COLLECTION_TYPE = 'INSTAGRAM_SET_COLLECTION_TYPE';
export const INSTAGRAM_SET_COLLECTION_MODAL_OPEN =
  'INSTAGRAM_SET_COLLECTION_MODAL_OPEN';
export const INSTAGRAM_SET_COLLECTION_SAVE_LOADING =
  'INSTAGRAM_SET_COLLECTION_SAVE_LOADING';
export const INSTAGRAM_SET_ORDER_TYPE = 'INSTAGRAM_SET_ORDER_TYPE';
export const INSTAGRAM_SET_ORDER_DIR = 'INSTAGRAM_SET_ORDER_DIR';
export const INSTAGRAM_SET_SCHEDULE_FILTER = 'INSTAGRAM_SET_SCHEDULE_FILTER';
export const INSTAGRAM_GET_HASHTAG_POSTS = 'INSTAGRAM_GET_HASHTAG_POSTS';
export const INSTAGRAM_GET_HASHTAG_POSTS_SUCCESS =
  'INSTAGRAM_GET_HASHTAG_POSTS_SUCCESS';

export const actionGetUsers = (inputValue) => {
  return async (dispatch) => {
    dispatch({ type: INSTAGRAM_GET_USERS });
    try {
      const response = await instagramService.searchUsers(inputValue);
      if (response.status === OK) {
        dispatch({
          type: INSTAGRAM_GET_USERS_SUCCESS,
          payload: response?.data?.data,
        });
      } else {
        toast.error(
          'Vui lòng liên hệ với nhân viên để chúng tôi hỗ trợ bạn tốt hơn!'
        );
        dispatch({
          type: INSTAGRAM_GET_USERS_SUCCESS,
          payload: [],
        });
      }
    } catch (error) {
      toast.error(
        'Vui lòng liên hệ với nhân viên để chúng tôi hỗ trợ bạn tốt hơn!'
      );
      dispatch({
        type: INSTAGRAM_GET_USERS_SUCCESS,
        payload: [],
      });
    }
  };
};

export const actionGetHashtagPosts = (
  hashtag,
  next_page = false,
  nextCursor = ''
) => {
  return async (dispatch) => {
    dispatch({
      type: INSTAGRAM_GET_HASHTAG_POSTS,
      payload: { hashtag, next_page },
    });
    try {
      const response = await instagramService.searchHashtagPosts(
        hashtag,
        nextCursor
      );
      if (response.status === OK) {
        const {
          data: payloadData,
          has_next = false,
          next_cursor = '',
        } = response?.data || {};
        // add post_id to each post
        const items = payloadData.map((item) => {
          return {
            ...item,
            post_id: item?.id,
          };
        });

        dispatch({
          type: INSTAGRAM_GET_HASHTAG_POSTS_SUCCESS,
          payload: {
            data: {
              hashtag: hashtag,
              items: items,
            },
            next_page,
            has_next,
            next_cursor,
          },
        });

        // auto filter items by is_reels is true
        const reelsItems = items.filter((item) => item?.is_reels);
        if (reelsItems.length > 0) {
          dispatch({
            type: INSTAGRAM_GET_USER_REELS_SUCCESS,
            payload: {
              reels_items: reelsItems,
              reels_next_cursor: nextCursor,
              reels_has_next: has_next,
            },
          });
        } else {
          dispatch({
            type: INSTAGRAM_GET_USER_REELS_SUCCESS,
            payload: {},
          });
        }
      } else {
        toast.error(
          'Vui lòng liên hệ với nhân viên để chúng tôi hỗ trợ bạn tốt hơn!'
        );
        dispatch({
          type: INSTAGRAM_GET_HASHTAG_POSTS_SUCCESS,
          payload: [],
        });
      }
    } catch (error) {
      toast.error(
        'Vui lòng liên hệ với nhân viên để chúng tôi hỗ trợ bạn tốt hơn!'
      );
      dispatch({
        type: INSTAGRAM_GET_HASHTAG_POSTS_SUCCESS,
        payload: [],
      });
    }
  };
};

export const actionGetUserPosts = (userName, cursor = '') => {
  return async (dispatch) => {
    dispatch({
      type: INSTAGRAM_GET_USER_POSTS,
      payload: {
        isNext: cursor !== '',
      },
    });
    try {
      const response = await instagramService.getUserPosts(userName, cursor);
      const { data, message = '' } = response?.data;
      let postData = data;
      if (cursor !== '') {
        postData = { ...postData, next_page: true };
      }
      if (response.status === OK) {
        dispatch({
          type: INSTAGRAM_GET_USER_POSTS_SUCCESS,
          payload: postData,
        });
      } else {
        toast.error(message);
        dispatch({
          type: INSTAGRAM_GET_USER_POSTS_SUCCESS,
          payload: null,
        });
      }
    } catch (error) {
      toast.error(
        'Vui lòng liên hệ với nhân viên để chúng tôi hỗ trợ bạn tốt hơn!'
      );
      dispatch({
        type: INSTAGRAM_GET_USER_POSTS_SUCCESS,
        payload: null,
      });
    }
  };
};

export const actionGetUserReels = (userId, cursor = '') => {
  return async (dispatch) => {
    dispatch({
      type: INSTAGRAM_GET_USER_REELS,
      payload: {
        reelsIsNext: cursor !== '',
      },
    });
    try {
      const response = await instagramService.getUserReels(userId, cursor);
      const { data, message = '' } = response?.data;
      let postingData = data;
      if (cursor !== '') {
        postingData = {
          ...postingData,
          reels_next_page: true,
          reels_items: postingData.items,
          reels_has_next: postingData.has_next,
          reels_next_cursor: postingData.next_cursor,
        };
      }
      if (response.status === OK) {
        dispatch({
          type: INSTAGRAM_GET_USER_REELS_SUCCESS,
          payload: postingData,
        });
      } else {
        toast.error(message);
        dispatch({
          type: INSTAGRAM_GET_USER_REELS_SUCCESS,
          payload: [],
        });
      }
    } catch (error) {
      toast.error(
        'Vui lòng liên hệ với nhân viên để chúng tôi hỗ trợ bạn tốt hơn!'
      );
      dispatch({
        type: INSTAGRAM_GET_USER_REELS_SUCCESS,
        payload: [],
      });
    }
  };
};

export const actionGetReelDetail = (reelId, code) => {
  return async (dispatch) => {
    dispatch({ type: INSTAGRAM_GET_REEL_DETAIL });
    try {
      const response = await instagramService.getReelDetail(reelId, code);
      if (response.status === OK) {
        dispatch({
          type: INSTAGRAM_GET_REEL_DETAIL_SUCCESS,
          payload: response.data,
        });
      } else {
        toast.error(
          'Vui lòng liên hệ với nhân viên để chúng tôi hỗ trợ bạn tốt hơn!'
        );
        dispatch({
          type: INSTAGRAM_GET_REEL_DETAIL_SUCCESS,
          payload: [],
        });
      }
    } catch (error) {
      toast.error(
        'Vui lòng liên hệ với nhân viên để chúng tôi hỗ trợ bạn tốt hơn!'
      );
      dispatch({
        type: INSTAGRAM_GET_REEL_DETAIL_SUCCESS,
        payload: [],
      });
    }
  };
};

export const actionGetUserSaved = (userId, cursor = '') => {
  return async (dispatch) => {
    dispatch({ type: INSTAGRAM_GET_USER_SAVED });
    try {
      const response = await instagramService.getInstagramSavedUsers(
        userId,
        cursor
      );
      const { data, message = '' } = response?.data;
      const payload = data;
      if (cursor !== '') {
        payload = { ...payload, next_page: true };
      }
      if (response.status === OK) {
        dispatch({
          type: INSTAGRAM_GET_USER_SAVED_SUCCESS,
          payload: payload,
        });
      } else {
        toast.error(message);
        dispatch({
          type: INSTAGRAM_GET_USER_SAVED_SUCCESS,
          payload: [],
        });
      }
    } catch (error) {
      toast.error(
        'Vui lòng liên hệ với nhân viên để chúng tôi hỗ trợ bạn tốt hơn!'
      );
      dispatch({
        type: INSTAGRAM_GET_USER_SAVED_SUCCESS,
        payload: [],
      });
    }
  };
};

export const actionGetCollections = (userId = 0, cursor = '') => {
  return async (dispatch) => {
    dispatch({ type: INSTAGRAM_GET_COLLECTIONS });
    try {
      const response = await instagramService.getInstagramCollections(
        userId,
        cursor
      );
      const { data, message = '' } = response?.data;
      const payload = data;
      if (cursor !== '') {
        payload = { ...payload, next_page: true };
      }
      if (response.status === OK) {
        dispatch({
          type: INSTAGRAM_GET_COLLECTIONS_SUCCESS,
          payload: payload,
        });
      } else {
        toast.error(message);
        dispatch({
          type: INSTAGRAM_GET_COLLECTIONS_SUCCESS,
          payload: [],
        });
      }
    } catch (error) {
      toast.error(
        'Vui lòng liên hệ với nhân viên để chúng tôi hỗ trợ bạn tốt hơn!'
      );
      dispatch({
        type: INSTAGRAM_GET_COLLECTIONS_SUCCESS,
        payload: [],
      });
    }
  };
};

export const actionSaveUser = (user) => {
  return async (dispatch) => {
    try {
      const response = await instagramService.saveUser(user);
      if (response.status === OK) {
        toast.dismiss();
        toast.success('Đã lưu người dùng thành công');
        dispatch({
          type: INSTAGRAM_GET_USER_SAVED_SUCCESS,
          payload: response?.data?.data,
        });
      } else {
        toast.error(
          'Vui lòng liên hệ với nhân viên để chúng tôi hỗ trợ bạn tốt hơn!'
        );
        dispatch({
          type: INSTAGRAM_GET_USER_SAVED_SUCCESS,
          payload: [],
        });
      }
    } catch (error) {
      toast.error(
        'Vui lòng liên hệ với nhân viên để chúng tôi hỗ trợ bạn tốt hơn!'
      );
      dispatch({
        type: INSTAGRAM_GET_USER_SAVED_SUCCESS,
        payload: [],
      });
    }
  };
};

export const actionRemoveUser = (userId) => {
  return async (dispatch) => {
    try {
      const response = await instagramService.removeUser(userId);
      if (response.status === OK) {
        toast.success('Đã xóa người dùng thành công');
        dispatch({
          type: INSTAGRAM_GET_USER_SAVED_SUCCESS,
          payload: response?.data?.data,
        });
      } else {
        toast.error(
          'Vui lòng liên hệ với nhân viên để chúng tôi hỗ trợ bạn tốt hơn!'
        );

        dispatch({
          type: INSTAGRAM_GET_USER_SAVED_SUCCESS,
          payload: [],
        });
      }
    } catch (error) {
      toast.error(
        'Vui lòng liên hệ với nhân viên để chúng tôi hỗ trợ bạn tốt hơn!'
      );
      dispatch({
        type: INSTAGRAM_GET_USER_SAVED_SUCCESS,
        payload: [],
      });
    }
  };
};

export const actionSaveCollection = (collectionId) => {
  return async (dispatch) => {
    dispatch({ type: INSTAGRAM_SET_COLLECTION_SAVE_LOADING, payload: true });
    try {
      const response = await instagramService.saveCollection(collectionId);
      if (response.status === OK) {
        toast.success('Đã lưu bộ sưu tập thành công');
        dispatch({
          type: INSTAGRAM_GET_COLLECTIONS_SUCCESS,
          payload: response?.data?.data,
        });
        dispatch({
          type: INSTAGRAM_SET_COLLECTION_SAVE_LOADING,
          payload: false,
        });
      } else {
        dispatch({
          type: INSTAGRAM_SET_COLLECTION_SAVE_LOADING,
          payload: false,
        });
        toast.error(
          'Vui lòng liên hệ với nhân viên để chúng tôi hỗ trợ bạn tốt hơn!'
        );
      }
    } catch (error) {
      dispatch({ type: INSTAGRAM_SET_COLLECTION_SAVE_LOADING, payload: false });
      toast.error(
        'Vui lòng liên hệ với nhân viên để chúng tôi hỗ trợ bạn tốt hơn!'
      );
    }
  };
};

export const actionRemoveCollection = (collectionId) => {
  return async (dispatch) => {
    dispatch({ type: INSTAGRAM_SET_COLLECTION_SAVE_LOADING, payload: true });
    try {
      const response = await instagramService.removeCollection(collectionId);
      if (response.status === OK) {
        toast.success('Đã xóa bộ sưu tập thành công');
        dispatch({
          type: INSTAGRAM_GET_COLLECTIONS_SUCCESS,
          payload: response?.data?.data,
        });
        dispatch({
          type: INSTAGRAM_SET_COLLECTION_SAVE_LOADING,
          payload: false,
        });
      } else {
        toast.error(
          'Vui lòng liên hệ với nhân viên để chúng tôi hỗ trợ bạn tốt hơn!'
        );
        dispatch({
          type: INSTAGRAM_SET_COLLECTION_SAVE_LOADING,
          payload: false,
        });
      }
    } catch (error) {
      toast.error(
        'Vui lòng liên hệ với nhân viên để chúng tôi hỗ trợ bạn tốt hơn!'
      );
      dispatch({ type: INSTAGRAM_SET_COLLECTION_SAVE_LOADING, payload: false });
    }
  };
};

export const actionUpdateCollection = (id, collection) => {
  return async (dispatch) => {
    dispatch({ type: INSTAGRAM_SET_COLLECTION_SAVE_LOADING, payload: true });
    try {
      const response = await instagramService.updateCollection(id, collection);
      if (response.status === OK) {
        toast.success('Đã cập nhật bộ sưu tập thành công');
        dispatch({
          type: INSTAGRAM_GET_COLLECTIONS_SUCCESS,
          payload: response?.data?.data,
        });
        dispatch({
          type: INSTAGRAM_SET_COLLECTION_SAVE_LOADING,
          payload: false,
        });
      } else {
        toast.error(
          'Vui lòng liên hệ với nhân viên để chúng tôi hỗ trợ bạn tốt hơn!'
        );
        dispatch({
          type: INSTAGRAM_SET_COLLECTION_SAVE_LOADING,
          payload: false,
        });
      }
    } catch (error) {
      toast.error(
        'Vui lòng liên hệ với nhân viên để chúng tôi hỗ trợ bạn tốt hơn!'
      );
      dispatch({ type: INSTAGRAM_SET_COLLECTION_SAVE_LOADING, payload: false });
    }
  };
};

export const actionSavePostsToCollection = (
  collectionId = 0,
  collection_name = '',
  posts = [],
  onClose = () => {}
) => {
  return async (dispatch) => {
    dispatch({ type: INSTAGRAM_SET_COLLECTION_SAVE_LOADING, payload: true });
    try {
      const response = await instagramService.savePostsToCollection(
        collectionId,
        collection_name,
        posts
      );
      if (response.status === OK) {
        await dispatch(actionGetCollections());
        await dispatch(actionGetCollectionPosts());
        await dispatch({
          type: INSTAGRAM_SET_COLLECTION_SAVE_LOADING,
          payload: false,
        });
        toast.success('Đã lưu bài viết vào bộ sưu tập thành công');
        onClose();
      } else {
        dispatch({
          type: INSTAGRAM_SET_COLLECTION_SAVE_LOADING,
          payload: false,
        });
        toast.error(
          'Vui lòng liên hệ với nhân viên để chúng tôi hỗ trợ bạn tốt hơn!'
        );
      }
    } catch (error) {
      dispatch({ type: INSTAGRAM_SET_COLLECTION_SAVE_LOADING, payload: false });
      toast.error(
        'Vui lòng liên hệ với nhân viên để chúng tôi hỗ trợ bạn tốt hơn!'
      );
    }
  };
};

export const actionRemovePostsFromCollection = (collectionId, postId) => {
  return async (dispatch) => {
    try {
      const response = await instagramService.removePostsFromCollection(
        collectionId,
        postId
      );
      if (response.status === OK) {
        toast.success('Đã xóa bài viết khỏi bộ sưu tập thành công');
      } else {
        toast.error(
          'Vui lòng liên hệ với nhân viên để chúng tôi hỗ trợ bạn tốt hơn!'
        );
      }
    } catch (error) {
      toast.error(
        'Vui lòng liên hệ với nhân viên để chúng tôi hỗ trợ bạn tốt hơn!'
      );
    }
  };
};

export const actionGetCollectionDetail = (collectionId) => {
  return async (dispatch) => {
    dispatch({ type: INSTAGRAM_GET_COLLECTION_DETAIL, payload: collectionId });
    try {
      const response = await instagramService.getCollectionDetail(collectionId);
      if (response.status === OK) {
        dispatch({
          type: INSTAGRAM_GET_COLLECTION_DETAIL_SUCCESS,
          payload: response?.data?.data,
        });
      } else {
        toast.error(
          'Vui lòng liên hệ với nhân viên để chúng tôi hỗ trợ bạn tốt hơn!'
        );
        dispatch({
          type: INSTAGRAM_GET_COLLECTION_DETAIL_SUCCESS,
          payload: [],
        });
      }
    } catch (error) {
      toast.error(
        'Vui lòng liên hệ với nhân viên để chúng tôi hỗ trợ bạn tốt hơn!'
      );
      dispatch({
        type: INSTAGRAM_GET_COLLECTION_DETAIL_SUCCESS,
        payload: [],
      });
    }
  };
};

export const actionGetCollectionPosts = () => {
  return async (dispatch) => {
    dispatch({ type: INSTAGRAM_GET_COLLECTION_POSTS });
    try {
      const response = await instagramService.getCollectionPosts();
      if (response.status === OK) {
        dispatch({
          type: INSTAGRAM_GET_COLLECTION_POSTS_SUCCESS,
          payload: response?.data?.data,
        });
      } else {
        toast.error(
          'Vui lòng liên hệ với nhân viên để chúng tôi hỗ trợ bạn tốt hơn!'
        );
        dispatch({
          type: INSTAGRAM_GET_COLLECTION_POSTS_SUCCESS,
          payload: [],
        });
      }
    } catch (error) {
      toast.error(
        'Vui lòng liên hệ với nhân viên để chúng tôi hỗ trợ bạn tốt hơn!'
      );
      dispatch({
        type: INSTAGRAM_GET_COLLECTION_POSTS_SUCCESS,
        payload: [],
      });
    }
  };
};

export const actionSetCurrentUser = (user) => async (dispatch) => {
  dispatch({
    type: INSTAGRAM_SET_CURRENT_USER,
    payload: user,
  });
};

export const actionSetCurrentContent = (content) => async (dispatch) => {
  dispatch({
    type: INSTAGRAM_SET_CURRENT_CONTENT,
    payload: content,
  });
};

export const actionSetCurrentKeyword = (keyword) => async (dispatch) => {
  dispatch({
    type: INSTAGRAM_SET_CURRENT_KEYWORD,
    payload: keyword,
  });
};

export const actionSetCurrentCollection = (collection) => async (dispatch) => {
  dispatch({
    type: INSTAGRAM_SET_CURRENT_COLLECTION,
    payload: collection,
  });
};

export const actionUpdateChosenPosts = (posts) => async (dispatch) => {
  dispatch({
    type: INSTAGRAM_UPDATE_CHOSEN_POSTS,
    payload: posts,
  });
};

export const actionSetCurrentContentType = (type) => async (dispatch) => {
  dispatch({
    type: INSTAGRAM_SET_CURRENT_CONTENT_TYPE,
    payload: type,
  });
};

export const actionSetCollectionModalOpen = (isOpen) => async (dispatch) => {
  dispatch({
    type: INSTAGRAM_SET_COLLECTION_MODAL_OPEN,
    payload: isOpen,
  });
};

export const actionSetCollectionType = (type) => async (dispatch) => {
  dispatch({
    type: INSTAGRAM_SET_COLLECTION_TYPE,
    payload: type,
  });
};

export const actionSetOrderType = (type) => async (dispatch) => {
  dispatch({
    type: INSTAGRAM_SET_ORDER_TYPE,
    payload: type,
  });
};

export const actionSetOrderDir = (dir) => async (dispatch) => {
  dispatch({
    type: INSTAGRAM_SET_ORDER_DIR,
    payload: dir,
  });
};

export const actionSetScheduleFilter = (filter) => async (dispatch) => {
  dispatch({
    type: INSTAGRAM_SET_SCHEDULE_FILTER,
    payload: filter,
  });
};
