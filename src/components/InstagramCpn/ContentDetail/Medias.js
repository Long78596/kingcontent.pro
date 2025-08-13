import React, { useState, useEffect } from 'react';
import { FiSkipBack, FiSkipForward } from 'react-icons/fi';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { isArrayEmpty } from '../../../configs';
import ReactPlayer from 'react-player';
import styled from 'styled-components';
import { convertInstagramLink } from '../../../helpers';
const ImageStyled = styled.img`
  user-select: none; /* standard syntax */
  -webkit-user-select: none; /* webkit (safari, chrome) browsers */
  -moz-user-select: none; /* mozilla browsers */
  -khtml-user-select: none; /* webkit (konqueror) browsers */
  -ms-user-select: none; /* IE10+ */
`;

function Medias(props) {
  const { images = [], videos = [], isVideo = false } = props;
  const [currentIndexImage, setCurrentIndexImage] = useState(0);
  const [currentIndexVideo, setCurrentIndexVideo] = useState(0);

  const [convertMedias, setConvertMedias] = useState(images);

  useEffect(() => {
    if (videos.length > 0) {
      const thumb = convertInstagramLink(videos[0]?.thumbnail);
      setConvertMedias([thumb]);
    } else {
      const convertedMedias = images.map((media) => {
        return convertInstagramLink(media);
      });
      setConvertMedias(convertedMedias);
    }
  }, [images, videos]);

  const handleSlideImage = (direction) => {
    const totalImages = convertMedias.length;
    let newIndex = currentIndexImage;
    if (direction === 'next') newIndex++;
    if (direction === 'back') newIndex--;
    if (newIndex === totalImages) newIndex = 0;
    if (newIndex < 0) newIndex = totalImages - 1;
    setCurrentIndexImage(newIndex);
  };

  const handleSlideVideo = (direction) => {
    const totalVideos = videos.length;
    let newIndex = currentIndexVideo;
    if (direction === 'next') newIndex++;
    if (direction === 'back') newIndex--;
    if (newIndex === totalVideos) newIndex = 0;
    if (newIndex < 0) newIndex = totalVideos - 1;
    setCurrentIndexVideo(newIndex);
  };

  const RenderMedias = () => {
    if (isVideo) {
      return (
        <div className="w-full p-0.5 mt-10 relative">
          <ReactPlayer
            className="react-player rounded-md w-full"
            height={'600px'}
            width={'100%'}
            controls={true}
            url={videos[currentIndexVideo]?.source || videos[currentIndexVideo]}
            playing={true}
          />
          {videos.length > 1 && (
            <>
              <div className="absolute group left-0 top-1/2 w-10 h-24 bg-softBgOpacityClr hover:bg-darkBgOpacityClr cursor-pointer flex items-center transform -translate-y-1/2 transition-all duration-200 ease-linear">
                <IoIosArrowBack
                  onClick={() => handleSlideVideo('back')}
                  className="w-9 h-9 text-gray-300 group-hover:text-gray-100 transition-all duration-200 ease-linear"
                />
              </div>
              <div className="absolute group right-0 top-1/2 w-10 h-24 bg-softBgOpacityClr hover:bg-darkBgOpacityClr cursor-pointer flex items-center transform -translate-y-1/2 transition-all duration-200 ease-linear">
                <IoIosArrowForward
                  onClick={() => handleSlideVideo('next')}
                  className="w-9 h-9 text-gray-300 group-hover:text-gray-100 transition-all duration-200 ease-linear"
                />
              </div>
            </>
          )}
        </div>
      );
    } else {
      return (
        <div className="w-full h-full block relative py-2 pl-2 ">
          <div className="w-full rounded-md mx-auto bg-center bg-contain bg-no-repeat h-90"
            style={{ backgroundImage: `url(${(convertMedias &&
              !isArrayEmpty(convertMedias) &&
              convertMedias[currentIndexImage]) ||
            ''})` }}
          ></div>
          {convertMedias.length > 1 && (
            <>
              <div className="absolute group left-1 top-1/2 w-10 h-24 bg-softBgOpacityClr hover:bg-darkBgOpacityClr cursor-pointer flex items-center transform -translate-y-1/2 transition-all duration-200 ease-linear">
                <IoIosArrowBack
                  onClick={() => handleSlideImage('back')}
                  className="w-9 h-9 text-gray-300 group-hover:text-gray-100 transition-all duration-200 ease-linear"
                />
              </div>
              <div className="absolute group right-1 top-1/2 w-10 h-24 bg-softBgOpacityClr hover:bg-darkBgOpacityClr cursor-pointer flex items-center transform -translate-y-1/2 transition-all duration-200 ease-linear">
                <IoIosArrowForward
                  onClick={() => handleSlideImage('next')}
                  className="ml-1 w-9 h-9 text-gray-300 group-hover:text-gray-100 transition-all duration-200 ease-linear"
                />
              </div>
            </>
          )}
        </div>
      );
    }
  };

  return (
    <div className="h-full w-full block p-4 rounded-md ">{RenderMedias()}</div>
  );
}

export default Medias;
