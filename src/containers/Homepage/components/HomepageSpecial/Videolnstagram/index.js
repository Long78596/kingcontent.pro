import React, { useEffect, useState } from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import VideoEmpty from './VideoEmpty';
import instagramIcon from '../../../../../assets/images/icon/main-menu/menu-icon-instagram.png';
import VideoGenIcon from '../../../../../assets/images/icon/main-menu/menu-icon-videogen.png';

import moment from 'moment';
import {
  FiCalendar,
  FiMessageCircle,
  FiPlay,
  FiThumbsUp,
} from 'react-icons/fi';
import {
  setCurrentDateTime,
  setIsShowFinalStep,
  setSelectedScheduleContent,
  setShowSourceIdeasPopup,
} from '../../../../../store/actions/Schedules';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom/cjs/react-router-dom';
import { kFormatter } from '../../../../../utils/utilityFunc';
import { convertInstagramLink } from '../../../../../helpers';
import ContentDetail from '../../../../../components/InstagramCpn/ContentDetail';
import { actionSetCurrentContent } from '../../../../../store/actions/instagram';

const VideoInstagram = ({ searchPosts = null }) => {
  const { currentContent = null } = useSelector((state) => state.instagram);
  const [posts, setPosts] = useState([]);
  const history = useHistory();
  const dispatch = useDispatch();

  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 5,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1280 },
      items: 4,
    },
    tablet: {
      breakpoint: { max: 1279, min: 464 },
      items: 1,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  useEffect(() => {
    if (searchPosts) {
      setPosts(searchPosts.items || []);
    } else {
      setPosts([]);
    }
  }, [searchPosts]);

  const handleSetSchedule = (item) => {
    dispatch(
      setSelectedScheduleContent({
        ...item,
        source_type: 'instagram',
        post_id: item?.id,
      })
    );
    // add next 7 minutes
    dispatch(
      setCurrentDateTime(
        moment().utc(true).add(7, 'minutes').format('YYYY-MM-DD HH:mm:ss')
      )
    );
    dispatch(setIsShowFinalStep(true));
    dispatch(setShowSourceIdeasPopup(false));
    history.push('/lich-dang-bai');
  };

  const onClickDetail = (post) => {
    dispatch(actionSetCurrentContent(post));
  };
  return (
    <div className="listInstagrams mt-4">
      <div className="sliderContents w-full">
        {posts.length === 0 ? (
          <div className="flex mt-10 gap-5">
            {[...Array(Number(4))].map((_elt, index) => (
              <VideoEmpty key={index} />
            ))}
          </div>
        ) : (
          <div className="gap-4">
            <Carousel
              infinite={true}
              responsive={responsive}
              autoPlay={true}
              autoPlaySpeed={5000}
              sliderClass="gap-3"
            >
              {posts.map((post, idx) => {
                const {
                  id = '',
                  code = '',
                  created = '',
                  text = '',
                  likes = 0,
                  comments = 0,
                  user_id = '',
                  user_display_name = '',
                  user_picture = '',
                  images = [],
                  videos = [],
                  video = null,
                  thumbnail = '',
                  is_reels = false,
                  media_type = 'image',
                } = post;
                return (
                  <div
                    className="relative cursor-pointer rounded-3x h-full"
                    key={idx}
                  >
                    <div
                      className="thumbnail bg-no-repeat bg-cover bg-center h-96 w-full rounded-lg"
                      style={{
                        backgroundImage: `url(${media_type === 'video'
                            ? convertInstagramLink(videos[0].thumbnail)
                            : images.length > 0
                              ? convertInstagramLink(images[0])
                              : instagramIcon
                          })`,
                      }}
                    ></div>
                    <div className="absolute w-full bottom-2 px-5">
                      <div className="flex justify-between">
                        <span className="bg-gray-400 p-2 rounded-xl text-white flex gap-1">
                          <FiThumbsUp size={20} />{' '}
                          <span>{kFormatter(likes)}</span>
                        </span>
                        <span className="bg-gray-400 p-2 rounded-xl text-white flex gap-1">
                          <FiMessageCircle size={20} /> {kFormatter(comments)}
                        </span>
                      </div>
                    </div>
                    <div className="actions absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 bg-black bg-opacity-25 p-2 rounded text-white whitespace-nowrap">
                      {/* play */}
                      <div
                        className="flex items-center gap-2 border-b border-dashed border-gray-300 p-2 rounded hover:bg-black"
                        onClick={() => onClickDetail(post)}
                      >
                        <FiPlay
                          size={30}
                          color="#fff"
                          className="hover:scale-125 cursor-pointer"
                          title="Nhấp để xem"
                        />
                        <span>Xem chi tiết</span>
                      </div>
                      {/* schedule */}
                      <div
                        className="flex mb-2 items-center gap-2 p-2 rounded hover:bg-black"
                        onClick={() => handleSetSchedule(post)}
                      >
                        <FiCalendar
                          size={30}
                          color="#fff"
                          className="hover:scale-125 cursor-pointer"
                          title="Lên lịch"
                        />
                        <span>Lên lịch</span>
                      </div>
                      {/* Tạo Video AI */}
                      <div
                        className="flex items-center gap-2 cursor-pointer hover:bg-black bg-opacity-60 p-2 rounded whitespace-nowrap"
                        onClick={() => {
                          // eslint-disable-next-line no-undef
                          dispatch(setScript((video.post_text ?? "").replace(/<br\s?\/?>/g, "\n")));
                          history.push('/text-to-video');
                        }}
                      >
                        <img src={VideoGenIcon} style={{ width: "32px" }}></img>
                        <span>Tạo Video AI</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </Carousel>
          </div>
        )}
      </div>
      {currentContent && <ContentDetail />}
    </div>
  );
};

export default VideoInstagram;
