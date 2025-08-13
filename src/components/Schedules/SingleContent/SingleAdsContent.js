import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import addIcons from '../../../assets/images/icon/create-content/add.png';
import LoadingApp from '../../LoadingApp';
import CommentIcon from '../../../assets/images/icon/comment.png';
import LikeIcon from '../../../assets/images/icon/like.png';
import ShareIcon from '../../../assets/images/icon/share.png';
import styled from 'styled-components';
import { FiPlayCircle } from 'react-icons/fi';
const ContentStyled = styled.div`
  max-height: 100px;
`;

const SingleAdsContent = (props) => {
  const {
    item = [],
    handleActionShowPopup,
    handleClosePopup,
    handleAddToSchedule,
  } = props;

  const [thumbnail, setThumbnail] = useState('');
  const [video, setVideo] = useState('');
  // total images
  const [totalImages, setTotalImages] = useState(0);

  useEffect(() => {
    if (item) {
      const { images = [], videos = [] } = item;
      if (videos.length > 0) {
        const vd = videos[0];
        setVideo(vd?.video);
        setThumbnail(vd?.thumb);
      } else if (images.length > 0) {
        setThumbnail(images[0]);
        setTotalImages(images.length);
      }
    } else {
      setVideo('');
      setThumbnail('');
      setTotalImages(0);
    }
  }, [item]);

  return (
    <div
      className="mb-2 flex gap-2 hover:bg-gray-200 rounded-md transition-all p-5 cursor-pointer adContent"
      onClick={() => handleActionShowPopup(item)}
    >
      <div
        className="w-1/6 thumb rounded-md bg-no-repeat bg-center bg-cover relative h-28"
        style={{ backgroundImage: `url(${thumbnail})` }}
      >
        {video && (
          <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center">
            <div className="w-10 h-10 bg-gray-400 rounded-full opacity-50">
              <FiPlayCircle className="w-full h-full text-white" />
            </div>
          </div>
        )}
        {/* show + more images */}
        {!video && totalImages > 2 && (
          <div className="absolute top-1/2 left-1/2 bg-gray-600 opacity-70 rounded-full w-12 h-12 flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2">
            <span className="text-white font-medium text-base">
              + {totalImages - 1}
            </span>
          </div>
        )}
      </div>
      <div className="w-4/6">
        <h3 className="font-bold">{item?.page_name || ''}</h3>
        <ContentStyled className="overflow-hidden">
          <p
            className="truncate"
            dangerouslySetInnerHTML={{ __html: item?.post_text || '' }}
          ></p>
        </ContentStyled>
      </div>
      <div
        className="w-1/12 flex items-center justify-center"
        onClick={() => handleAddToSchedule(item)}
      >
        <img src={addIcons} className="w-8" />
      </div>
    </div>
  );
};

export default SingleAdsContent;
