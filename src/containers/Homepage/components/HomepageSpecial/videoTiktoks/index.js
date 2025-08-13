import React, { useEffect, useState } from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import VideoEmpty from './VideoEmpty';
import tiktokIcon from '../../../../../assets/images/tiktok_logo.png';

import moment from 'moment';
import { FiCalendar, FiClock, FiPlay } from 'react-icons/fi';
import { nFormatter } from '../../../../../configs';
import ModalShowVideo from './ModalShowVideo';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import {
  setCurrentDateTime,
  setIsShowFinalStep,
  setSelectedScheduleContent,
  setShowSourceIdeasPopup,
} from '../../../../../store/actions/Schedules';
import { useDispatch } from 'react-redux';

const VideoTiktoks = ({ searchVideos = null }) => {
  const [videos, setVideos] = useState([]);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [videoSelect, setVideoSelect] = useState('');
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
    if (searchVideos) {
      setVideos(searchVideos.videos);
    } else {
      setVideos([]);
    }
  }, [searchVideos]);

  const toggle = () => {
    setIsOpenModal(!isOpenModal);
  };
  const openModal = (video) => {
    setVideoSelect(video);
    setIsOpenModal(true);
  };
  const handleSetSchedule = (item) => {
    dispatch(
      setSelectedScheduleContent({
        ...item,
        source_type: 'tiktok',
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
  return (
    <div className="specialContents mt-4">
      <div className="sliderContents w-full">
        {videos.length === 0 ? (
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
              {videos.map((video, idx) => (
                <div
                  className="relative cursor-pointer rounded-3x h-full"
                  key={idx}
                  onClick={() => openModal(video.post_id)}
                >
                  <div
                    className="thumbnail bg-no-repeat bg-cover bg-center h-96 w-full rounded-lg"
                    style={{
                      backgroundImage: `url(${video?.thumbnail || tiktokIcon})`,
                    }}
                  ></div>
                  <div className="absolute w-full bottom-2 px-5">
                    <div className="flex justify-between">
                      <span className="bg-gray-400 p-2 rounded-xl text-white flex gap-1">
                        <FiPlay size={20} />{' '}
                        <span>{nFormatter(video.view)}</span>
                      </span>
                      <span className="bg-gray-400 p-2 rounded-xl text-white flex gap-1">
                        <FiClock size={20} />{' '}
                        {moment.utc(video.duration * 1000).format('mm:ss')}
                      </span>
                    </div>
                  </div>
                  <div className="actions absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 bg-black bg-opacity-25 p-2 rounded text-white whitespace-nowrap">
                    {/* play */}
                    <div
                      className="flex items-center gap-2 border-b border-dashed border-gray-300 p-2 rounded hover:bg-black"
                      onClick={() => openModal(video.post_id)}
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
                      onClick={() => handleSetSchedule(video)}
                    >
                      <FiCalendar
                        size={30}
                        color="#fff"
                        className="hover:scale-125 cursor-pointer"
                        title="Lên lịch"
                      />
                      <span>Lên lịch</span>
                    </div>
                  </div>
                </div>
              ))}
            </Carousel>
          </div>
        )}
        <ModalShowVideo isOpen={isOpenModal} toggle={toggle} id={videoSelect} />
      </div>
    </div>
  );
};

export default VideoTiktoks;
