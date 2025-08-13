import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  FaCalendarAlt,
  FaComment,
  FaEye,
  FaHeart,
  FaPencilAlt,
  FaPlayCircle,
} from 'react-icons/fa';
import { FiRefreshCcw, FiShare } from 'react-icons/fi';
import Select from 'react-select';
import { Link } from '@mui/material';
import { actionGetMyVideos } from '../../store/actions/tiktok';
import LoadingApp from '../LoadingApp';
import { getNoImage } from '../../helpers';
import { nFormatter } from '../../configs';
import { formatUnixDate } from '../../helpers/date';

const Me = (props) => {
  const { handleAction } = props;

  const {
    myVideos = null,
    isLoadingMyVideos = false,
    isNextLoadingMyVideos = false,
  } = useSelector((state) => state.tiktoks);

  const [filteredVideos, setFilteredVideos] = useState([]);
  const [search, setSearch] = useState('');
  const [mediaType, setMediaType] = useState('all');
  const [dateOrder, setDateOrder] = useState('');
  const [likesOrder, setLikesOrder] = useState('');

  const dispatch = useDispatch();

  useEffect(() => {
    if (!myVideos) {
      dispatch(actionGetMyVideos());
    }
  }, [dispatch]);

  const onClickDetail = (post) => {
    const { user_name, code } = post;
    const url = `https://threads.net/@${user_name}/post/${code}`;
    window.open(url, '_blank');
  };

  const getMorePosts = () => {
    if (myVideos?.has_more) {
      dispatch(actionGetMyVideos(myVideos?.cursor));
    }
  };

  const applyFilter = () => {
    if (myVideos) {
      const { videos = [] } = myVideos;
      let filteredVideos = [...videos];
      if (search) {
        filteredVideos = filteredVideos.filter(
          (video) =>
            video?.title?.toLowerCase().includes(search.toLowerCase()) ||
            video?.video_description
              ?.toLowerCase()
              .includes(search.toLowerCase())
        );
      }
      if (dateOrder) {
        filteredVideos = filteredVideos.sort((a, b) => {
          if (dateOrder === 'asc') {
            return a.created - b.created;
          } else {
            return b.created - a.created;
          }
        });
      }
      if (likesOrder) {
        filteredVideos = filteredVideos.sort((a, b) => {
          if (likesOrder === 'asc') {
            return a.likes - b.likes;
          } else {
            return b.likes - a.likes;
          }
        });
      }
      return filteredVideos;
    }
    return [];
  };

  useEffect(() => {
    const filteredVideos = applyFilter();
    setFilteredVideos(filteredVideos);
  }, [search, mediaType, dateOrder, likesOrder, myVideos]);

  return (
    <div>
      {isLoadingMyVideos ? (
        <LoadingApp />
      ) : (
        <div className="flex flex-col">
          {/* quick filter here */}
          <div className="quickFilter">
            <label className="mb-2 pl-1 font-bold">
              Lọc, sắp xếp nhanh bài viết
            </label>
            {/* search box */}
            <div className="flex flex-row gap-3 p-1">
              <input
                type="text"
                placeholder="Tìm kiếm nhanh nội dung"
                className="border border-gray-300 rounded-md p-2 w-1/4"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {/* date order */}
              <Select
                name="date_order"
                id="date_order"
                className="w-1/4"
                options={[
                  { value: '', label: 'Mặc định' },
                  { value: 'desc', label: 'Mới nhất' },
                  { value: 'asc', label: 'Cũ nhất' },
                ]}
                placeholder="Ngày đăng"
                onChange={(selected) => setDateOrder(selected.value)}
              />
              {/* likes order */}
              <Select
                name="likes_order"
                id="likes_order"
                className="w-1/4"
                options={[
                  { value: '', label: 'Mặc định' },
                  { value: 'desc', label: 'Nhiều nhất' },
                  { value: 'asc', label: 'Ít nhất' },
                ]}
                placeholder="Lượt thích"
                onChange={(selected) => setLikesOrder(selected.value)}
              />
            </div>
          </div>
          <div className="flex flex-row font-bold border-b-2 border-gray-200 p-2 gap-3">
            <div className="w-28 text-center">Loại bài viết</div>
            <div className="w-2/5 text-center">Nội dung</div>
            <div className="w-1/5 text-center">Ngày đăng</div>
            <div className="w-1/5 text-center">Hành động</div>
          </div>
          {myVideos ? (
            <div className="myVideos">
              {filteredVideos?.map((video) => {
                const {
                  id = '',
                  cover_image_url = '',
                  title = '',
                  video_description = '',
                  like_count = 0,
                  comment_count = 0,
                  share_count = 0,
                  create_time = 0,
                } = video;

                return (
                  <div
                    key={id}
                    className="flex flex-row border-b border-gray-200 cursor-pointer p-2 gap-3"
                  >
                    <div className="w-28 flex justify-center items-center relative">
                      <img
                        src={cover_image_url}
                        alt={title}
                        className="w-24 h-24 object-cover rounded-md"
                      />
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <FaPlayCircle size={24} />
                      </div>
                    </div>
                    <div className="w-2/5 flex flex-col">
                      <div className="line-clamp-3">{video_description}</div>
                      <div className="flex gap-4 mt-auto">
                        {/* like icon */}
                        <div className="flex items-center gap-2">
                          <FaHeart size={20} color="gray" />
                          <span>{nFormatter(like_count)}</span>
                        </div>
                        {/* comment icon */}
                        <div className="flex items-center gap-2">
                          <FaComment size={20} color="gray" />
                          <span>{nFormatter(comment_count)}</span>
                        </div>
                        {/* share icon */}
                        <div className="flex items-center gap-2">
                          <FiShare size={20} color="gray" />
                          <span>{nFormatter(share_count)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="w-1/5 text-center flex justify-center items-center">
                      {formatUnixDate(create_time)}
                    </div>
                    <div className="w-1/5 text-center flex gap-4 items-center justify-center">
                      <Link
                        href={`https://tiktok.com/@/video/${id}`}
                        target="_blank"
                        className="flex items-center gap-2"
                      >
                        <FaEye size={20} className="text-gray-500" />
                      </Link>
                      <button
                        className="flex items-center gap-2"
                        onClick={() => handleAction('CREATE_CONTENT', video)}
                      >
                        <FaPencilAlt size={20} className="text-gray-500" />
                      </button>
                      <button
                        className="flex items-center gap-2"
                        onClick={() => handleAction('SCHEDULE_CONTENT', video)}
                      >
                        <FaCalendarAlt size={20} className="text-gray-500" />
                      </button>
                    </div>
                  </div>
                );
              })}
              {myVideos?.has_more ? (
                <div className="flex justify-center p-3 mt-2">
                  {isNextLoadingMyVideos ? (
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
        </div>
      )}
    </div>
  );
};

export default Me;
