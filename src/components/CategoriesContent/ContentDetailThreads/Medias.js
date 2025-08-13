import React, { useState } from 'react';
import { FiSkipBack, FiSkipForward } from 'react-icons/fi';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { isArrayEmpty } from '../../../configs';
import ReactPlayer from 'react-player';
import styled from 'styled-components';
const ImageStyled = styled.img`
height : 60vh
`;

function Medias(props) {
  const { medias, urlVideo } = props;
  const [currentIndexImage, setCurrentIndexImage] = useState(0);

  const handleSlideImage = (direction) => {
    const totalImages = medias.length;
    let newIndex = currentIndexImage;
    if (direction === 'next') newIndex++;
    if (direction === 'back') newIndex--;
    if (newIndex === totalImages) newIndex = 0;
    if (newIndex < 0) newIndex = totalImages - 1;
    setCurrentIndexImage(newIndex);
  };

  // const urlVideo = 'http://techslides.com/demos/sample-videos/small.mp4';

  const RenderMedias = () => {
    // if (CheckTypesUrlInput(medias[0]) === 'video') {
    if (urlVideo) {
      return (
        <div className="w-full">
          <ReactPlayer
            className="react-player rounded-md w-full h-full"
            height={'600px'}
            width={'100%'}
            controls={true}
            url={urlVideo}
            playing={true}
          />
        </div>
      );
      // } else if (CheckTypesUrlInput(medias[0]) === 'image') {
    } else {
      return (
        <div className="w-full h-full block relative py-2 pl-2 ">
          <ImageStyled
            className="object-contain h-full rounded-md mx-auto"
            src={
              (medias && !isArrayEmpty(medias) && `https://v3.api.kingcontent.pro/api/v1/user/media/bypass-cors?url=${encodeURIComponent(
                medias[currentIndexImage]
            )}&type=image`) ||
              ''
            }
            alt=""
          />
          {medias.length > 1 && (
            <>
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
            </>
          )}
        </div>
      );
    }
  };

  // const CheckTypesUrlInput = (url) => {
  //   let result = '';
  //   if (typeof url === 'string') {
  //     if (url.match(/\.(jpg|jpeg|gif|png|bmp|tiff)/) !== null) {
  //       result = 'image';
  //     }
  //     if (
  //       url.match(/\.(mp4|mpeg|wmv|avi|flv|swf|webm|3gp|ogv)/) !== null ||
  //       url.match(
  //         /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/
  //       )
  //     ) {
  //       result = 'video';
  //     }
  //   }
  //   return result;
  // };

  return (
    <div className="h-full w-full block p-4 rounded-md ">{RenderMedias()}</div>
  );
}

export default Medias;
