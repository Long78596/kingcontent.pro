import React, { Fragment, useEffect, useState } from 'react';
import LoadingApp from '../../LoadingApp';
import { useDispatch, useSelector } from 'react-redux';
import { actionGetMyPosts } from '../../../store/actions/threads';
import Filter from './me/FilterNew';
import SinglePost from './me/SinglePost';
import ListComments from './me/ListComments';

const Me = (props) => {
  const { handleAction } = props;

  const {
    myPosts = null,
    isLoadingMyPosts = false,
    isNextLoadingMyPosts = false,
  } = useSelector((state) => state.threads);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [search, setSearch] = useState('');
  const [mediaType, setMediaType] = useState('all');
  const [dateOrder, setDateOrder] = useState('');
  const [likesOrder, setLikesOrder] = useState('');
  const [isShowComments, setIsShowComments] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!myPosts) {
      dispatch(actionGetMyPosts());
    }
  }, [dispatch]);

  const getMorePosts = () => {
    if (myPosts?.has_next) {
      dispatch(actionGetMyPosts(myPosts?.next_cursor));
    }
  };

  const applyFilter = () => {
    if (myPosts) {
      const { posts = [] } = myPosts;
      let filteredPosts = posts;
      if (search) {
        filteredPosts = filteredPosts.filter((post) =>
          post.text.toLowerCase().includes(search.toLowerCase())
        );
      }
      if (mediaType !== 'all') {
        filteredPosts = filteredPosts.filter(
          (post) => post.media_type === mediaType
        );
      }
      if (dateOrder) {
        filteredPosts = filteredPosts.sort((a, b) => {
          if (dateOrder === 'asc') {
            return a.created - b.created;
          } else {
            return b.created - a.created;
          }
        });
      }
      if (likesOrder) {
        filteredPosts = filteredPosts.sort((a, b) => {
          if (likesOrder === 'asc') {
            return a.likes - b.likes;
          } else {
            return b.likes - a.likes;
          }
        });
      }
      return filteredPosts;
    }
    return [];
  };

  useEffect(() => {
    const filteredPosts = applyFilter();
    setFilteredPosts([...filteredPosts]);
  }, [search, mediaType, dateOrder, likesOrder, myPosts]);

  return (
    <div>
      {isLoadingMyPosts ? (
        <LoadingApp />
      ) : (
        <div className="flex flex-col">
          {/* quick filter here */}
          <Filter {...{ search, setSearch, setMediaType, setDateOrder, setLikesOrder }} />
          <div className="flex flex-row font-bold border-b-2 border-gray-200 p-2 gap-3">
            <div className="w-28 text-center">Loại bài viết</div>
            <div className="w-2/5 text-center">Nội dung</div>
            <div className="w-1/5 text-center">Ngày đăng</div>
            <div className="w-1/5 text-center">Hành động</div>
          </div>
          {myPosts ? (
            <div className="myPosts">
              {filteredPosts?.map((post) => (
                <Fragment key={post.id}>
                  <SinglePost {...{ post, handleAction, setIsShowComments, setCurrentPost }} />
                </Fragment>
              ))}
              {myPosts?.has_next ? (
                <div className="flex justify-center p-3 mt-2">
                  {isNextLoadingMyPosts ? (
                    <LoadingApp />
                  ) : (
                    <button
                      className="bg-primary text-white px-4 py-2 rounded-md w-1/2"
                      onClick={() => getMorePosts()}
                    >
                      Xem thêm
                    </button>
                  )}
                </div>
              ) : null}
            </div>
          ) : null}

          {isShowComments ? (
            <ListComments {...{ setIsShowComments, currentPost, setCurrentPost }} />
          ) : null}
        </div>
      )}
    </div>
  );
};

export default Me;
