import React, { Fragment, useCallback, useEffect, useState } from 'react';
import Button from './Button';
import logoTikTok from '../../../../assets/images/icon/main-menu/menu-icon-tiktok.png';
import { userServices } from '../../../../services/users';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { FiPlayCircle } from 'react-icons/fi';
import ReactPlayer from 'react-player';
import { convertInstagramLink, getNoImage } from '../../../../helpers';

const ImageElm = (props) => {
  const { ObjFit, url } = props;
  return (
    <img
      className={`w-full h-full ${ObjFit} rounded-t-md border border-gray-300`}
      src={url}
      alt=""
      onError={(e) => (e.currentTarget.src = getNoImage())}
    />
  );
};

function InfoLeft(props) {
  const {
    images = [],
    scheduleContent = {},
    mediaType = '',
    handleActionShowPopup = () => {},
    isMultiple = false,
  } = props;

  const {
    source_type = '',
    content_id = '',
    status = 0,
    id = 0,
    source_content = null,
    thumbnail: scheduleThumbnail = '',
    media_type = '',
  } = scheduleContent;

  const [thumbnail, setThumbnail] = useState('');
  const [isLoadingThumbnail, setIsLoadingThumbnail] = useState(false);
  const [currentIndexImage, setCurrentIndexImage] = useState(0);
  const [isVideo, setIsVideo] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');

  useEffect(() => {
    if (scheduleThumbnail) {
      setThumbnail(scheduleThumbnail);
    } else {
      setThumbnail(images[0]);
    }
  }, [scheduleThumbnail, images]);

  const handleSlideImage = (direction) => {
    const totalImages = images.length;
    let newIndex = currentIndexImage;
    if (direction === 'next') newIndex++;
    if (direction === 'back') newIndex--;
    if (newIndex === totalImages) newIndex = 0;
    if (newIndex < 0) newIndex = totalImages - 1;
    setCurrentIndexImage(newIndex);
  };

  /*const getThumbnail = async (type, video) => {
    setIsLoadingThumbnail(true);
    await userServices
      .getSingleTikTokVideo(type, video)
      .then((res) => {
        setThumbnail(res?.data?.data?.thumbnail);
      })
      .catch((err) => {
        setThumbnail(logoTikTok);
      })
      .finally(() => {
        setIsLoadingThumbnail(false);
      });
  };*/

  useEffect(() => {
    if (media_type === 'video' || source_content?.media_type === 'video') {
      setIsVideo(true);
    } else {
      setIsVideo(false);
      // setThumbnail(images[currentIndexImage]);
      setIsLoadingThumbnail(false);
      if (source_type === 'user' || source_content?.media_url) {
        setVideoUrl(source_content?.media_url);
      } else {
        setVideoUrl('');
      }
    }
  }, [source_type, content_id, currentIndexImage, source_content]);

  const renderImage = () => {
    if (thumbnail) {
      return (
        <ImageElm
          ObjFit="object-cover"
          url={
            thumbnail.includes('instagram')
              ? convertInstagramLink(thumbnail)
              : thumbnail
          }
        />
      );
    } else {
      return <ImageElm ObjFit="object-cover" url={getNoImage()} />;
    }
  };

  return (
    <div className="outline-none border-0 p-2 mx-1 flex flex-col">
      <div
        className={`relative cursor-pointer w-52 ${
          isMultiple ? 'h-28' : 'h-52'
        }`}
        onClick={() => handleActionShowPopup(scheduleContent)}
      >
        {isVideo && videoUrl && false && (
          <ReactPlayer
            className="react-player preview rounded-md w-full h-full overflow-hidden rounded-t-md border border-gray-300"
            height={'100'}
            url={videoUrl || ''}
            playing={true}
            width={'100'}
            controls={true}
            muted={true}
          />
        )}

        {isLoadingThumbnail === false && renderImage()}
        {isLoadingThumbnail === true && (
          <div
            className={`w-52 flex items-center justify-center ${
              isMultiple ? 'h-28' : 'h-52'
            }`}
          >
            Đang tải ảnh...
          </div>
        )}
        {isVideo && (
          <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center">
            <div className="w-20 h-20 bg-gray-400 rounded-full opacity-50">
              <FiPlayCircle className="w-full h-full text-white" />
            </div>
          </div>
        )}
        {images && images.length > 1 && (
          <Fragment>
            <div className="absolute top-1/2 left-1/2 bg-gray-600 opacity-70 rounded-full w-12 h-12 flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2">
              <span className="text-white font-medium text-base">
                + {images?.length - 1}
              </span>
            </div>
            <div className="absolute group left-0 top-1/2 w-10 h-24 bg-softBgOpacityClr hover:bg-darkBgOpacityClr cursor-pointer flex items-center transform -translate-y-1/2 transition-all duration-200 ease-linear">
              <IoIosArrowBack
                onClick={() => handleSlideImage('back')}
                className="w-9 h-9 text-gray-300 group-hover:text-gray-100 transition-all duration-200 ease-linear"
              />
            </div>
            <div className="absolute group right-0 top-1/2 w-10 h-24 bg-softBgOpacityClr hover:bg-darkBgOpacityClr cursor-pointer flex items-center transform -translate-y-1/2 transition-all duration-200 ease-linear">
              <IoIosArrowForward
                onClick={() => handleSlideImage('next')}
                className="ml-1 w-9 h-9 text-gray-300 group-hover:text-gray-100 transition-all duration-200 ease-linear"
              />
            </div>
          </Fragment>
        )}
      </div>
      <Button
        isSuccess={status === 1 || status === 5}
        scheduleContent={scheduleContent}
      />
    </div>
  );
}

export default InfoLeft;
