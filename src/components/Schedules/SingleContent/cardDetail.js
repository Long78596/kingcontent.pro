import moment from 'moment';
import React, { useCallback, useState } from 'react';
import ReactPlayer from 'react-player';
import styled from 'styled-components';
import CommentIcon from '../../../assets/images/icon/comment.png';
import LikeIcon from '../../../assets/images/icon/like.png';
import ShareIcon from '../../../assets/images/icon/share.png';
import Client from '../../../Client';
import { breakWord } from '../../../helpers';
import { getPathVideo, kFormatter } from '../../../utils/utilityFunc';
import Image from '../../CategoriesContent/CategonesContentltem/Image';
export const CardStyled = styled.div`
  .divide-title {
    height: 1px;
  }
  .card-detail {
    position: relative;
  }
`;
const CardDetail = ({ _elt, isSchedule = false }) => {
  const [videoUrl, setVideoUrl] = useState('');
  const [loadingVideo, setLoadingVideo] = useState(false);

  const handleActionShowPopup = () => {
    const { media_type, media_url = '', videos = [] } = _elt;
    if (videos.length > 0) {
      setVideoUrl(videos[0].video);
      setLoadingVideo(false);
    } else if (media_type === 'video') {
      setLoadingVideo(true);
      getPathVideo(media_url).then((_url) => {
        setVideoUrl(_url);
        setLoadingVideo(false);
      });
    } else {
      setVideoUrl('');
      setLoadingVideo(false);
    }
  };

  return (
    <CardStyled className="detailContent">
      <div className="rounded-lg overflow-hidden w-full lg:col-span-4 md:col-span-1 bg-white mx-3 md:mx-0 lg:mx-0 card-detail border-0">
        {!isSchedule && (
          <div className="pr-3 pl-3 pt-3 ">
            <div className="flex items-center w-full">
              <div className="rounded-full h-8 w-8 bg-gray-500 flex items-center justify-center overflow-hidden">
                <img
                  src={_elt?.medias[0]}
                  alt="image fb"
                  className="rounded-md"
                />
              </div>
              <div className="flex flex-col w-full ml-1">
                <h3 className="font-bold ml-1">{_elt?.user_screenname}</h3>
                <span className="w-full divide-title bg-gray-200 mt-1 ml-1"></span>
                <span className="pt-1 ml-2 text-sm">
                  {moment(_elt?.post_timestamp).format('DD-MM-YYYY')}
                </span>
              </div>
            </div>
            <span className="px-2 hover:bg-gray-300 cursor-pointer rounded">
              <i className="fas fa-ellipsis-h pt-2 text-base" />
            </span>
          </div>
        )}

        <div className="flex gap-3">
          <div className="w-4/12">
            {videoUrl && (
              <div className="w-full p-0.5 mt-10">
                <ReactPlayer
                  className="react-player rounded-md w-full"
                  height={'600px'}
                  width={'100%'}
                  controls={true}
                  url={videoUrl}
                  playing={true}
                />
              </div>
            )}
            {!videoUrl && (
              <Image
                medias={_elt?.medias}
                contentType={_elt?.media_type}
                handleActionShowPopup={handleActionShowPopup}
                loadingVideo={loadingVideo}
              />
            )}
          </div>
          <div className="w-8/12">
            <p
              className=" text-sm overflow-auto max-h-98"
              dangerouslySetInnerHTML={{
                __html: breakWord(_elt?.post_text),
              }}
            ></p>
          </div>
        </div>
      </div>
      {!isSchedule && (
        <div className="flex justify-between p-3 items-center bg-gray-100 mt-2 rounded-md">
          <div className="gap-2 flex items-center">
            <img src={LikeIcon} alt="" className="w-6" />
            <span>{kFormatter(_elt?.likes)}</span>
          </div>
          <div className="gap-2 flex items-center">
            <img src={CommentIcon} alt="" className="w-6" />
            <span>{kFormatter(_elt?.comments)}</span>
          </div>
          <div className="gap-2 flex items-center">
            <img src={ShareIcon} alt="" className="w-6" />
            <span>{kFormatter(_elt?.shares)}</span>
          </div>
        </div>
      )}
    </CardStyled>
  );
};

export default CardDetail;
