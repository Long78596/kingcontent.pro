import React, { useCallback, useEffect, useState } from 'react';
import { FiPlayCircle } from 'react-icons/fi';
import { FaSpinner } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { MdOutlineClear } from 'react-icons/md';
import { setSelectedScheduleContent } from '../../../store/actions/Schedules';
import ReactPlayer from 'react-player';
import { convertInstagramLink, getNoImage } from '../../../helpers';
import Client from '../../../Client';

const isNumericRegex = (str) => {
  // return /^\d+$/.test(str);
  if (typeof str != 'string') return false; // we only process strings!
  return !isNaN(str) && !isNaN(parseFloat(str));
};

function Image(props) {
  const {
    medias = [],
    contentType = '',
    isPreview = false,
    handleActionShowPopup = () => {},
    loadingVideo = false,
    isShowDelete = false,
    mediaUrl = '',
  } = props;
  const [downloadedMediaUrl, setDownloadedMediaUrl] = useState(mediaUrl);

  const getVideoLink = async (mediaUrl) => {
    const res = await Client.get(`/get-video-link/${mediaUrl}`);
    setDownloadedMediaUrl(res?.data?.data || '');
  };

  useEffect(() => {
    if (mediaUrl) {
      const isNumber = isNumericRegex(mediaUrl.slice(0, -1));
      if (isNumber) {
        getVideoLink(mediaUrl);
      } else {
        setDownloadedMediaUrl(mediaUrl);
      }
    }
  }, [mediaUrl]);

  const numberImageResidual = medias?.length - 5;
  const { selectedScheduleContent } = useSelector((state) => state.schedules);
  const dispatch = useDispatch();
  const deleteImage = (url) => {
    const initialImages = [...selectedScheduleContent?.medias];
    let images = initialImages.filter((_elt) => _elt !== url);
    dispatch(
      setSelectedScheduleContent({
        ...selectedScheduleContent,
        medias: images,
        images: images,
      })
    );
  };

  const renderMedias = () => {
    if (medias && medias.length > 0) {
      let moreMedias = 0;
      let countMedias = medias.length;
      if (countMedias > 5) {
        countMedias = 5;
        moreMedias = medias.length - 5;
      }
      let thumbnail = medias[0];
      thumbnail =
        thumbnail && thumbnail.includes('instagram')
          ? convertInstagramLink(thumbnail)
          : thumbnail;

      const renderMore = () => {
        if (moreMedias > 0) {
          return (
            <div className="absolute inset-0 ">
              <span className="h-full flex items-center justify-center text-3xl text-gray-300 font-semibold">
                + {moreMedias}
              </span>
            </div>
          );
        }
      };
      const ImageElm = ({ ObjFit = 'h-full', url, height }) => {
        return (
          <img
            className={`w-full h-full cursor-pointer ${ObjFit}`}
            src={
              url && url.includes('instagram') ? convertInstagramLink(url) : url
            }
            height={height}
            alt=""
            onError={(e) => (e.currentTarget.src = getNoImage())}
          />
        );
      };

      switch (countMedias) {
        case 1:
          return (
            <div
              className="h-hashtag-popup bg-center bg-cover bg-no-repeat"
              style={{
                backgroundImage: `url(${
                  thumbnail && thumbnail.includes('instagram')
                    ? convertInstagramLink(thumbnail)
                    : thumbnail
                })`,
              }}
            ></div>
          );

        case 2:
          return (
            <div className="w-full h-hashtag-popup flex gap-1 justify-between overflow-hidden">
              <div className={`w-1/2 h-full relative`}>
                <ImageElm ObjFit="object-cover" url={medias[0]} />
                {isShowDelete && (
                  <MdOutlineClear
                    onClick={() => deleteImage(medias[0])}
                    color="#fff"
                    className="h-5 w-5 absolute top-0 right-0 p-1 bg-red-500 rounded-full"
                  />
                )}
              </div>

              <div className={`w-1/2 h-full relative`}>
                <ImageElm ObjFit="object-cover" url={medias[1]} />
                {isShowDelete && (
                  <MdOutlineClear
                    onClick={() => deleteImage(medias[1])}
                    color="#fff"
                    className="h-5 w-5 absolute top-0 right-0 p-1 bg-red-500 rounded-full"
                  />
                )}
              </div>
            </div>
          );

        case 3:
          return (
            <div className="w-full h-hashtag-popup flex flex-col justify-between">
              <div className="p-0.5 w-full h-2/3 block relative">
                <ImageElm ObjFit="object-cover" url={medias[0]} />
                {isShowDelete && (
                  <MdOutlineClear
                    onClick={() => deleteImage(medias[0])}
                    color="#fff"
                    className="h-5 w-5 absolute top-0 right-0 p-1 bg-red-500 rounded-full"
                  />
                )}
              </div>
              <div className="w-full  flex justify-between  h-1/3">
                <div className="p-0.5 w-full block relative">
                  <ImageElm ObjFit="object-cover" url={medias[1]} />{' '}
                  {isShowDelete && (
                    <MdOutlineClear
                      onClick={() => deleteImage(medias[1])}
                      color="#fff"
                      className="h-5 w-5 absolute top-0 right-0 p-1 bg-red-500 rounded-full"
                    />
                  )}
                </div>
                <div className="p-0.5 w-full block relative">
                  <ImageElm ObjFit="object-cover" url={medias[2]} />{' '}
                  {isShowDelete && (
                    <MdOutlineClear
                      onClick={() => deleteImage(medias[2])}
                      color="#fff"
                      className="h-5 w-5 absolute top-0 right-0 p-1 bg-red-500 rounded-full"
                    />
                  )}
                </div>
              </div>
            </div>
          );
        case 4:
          let restMedias;
          const getRestMedias = ([_, ...rest]) => (restMedias = rest);
          getRestMedias(medias);

          return (
            <div className="w-full h-hashtag-popup flex flex-col justify-between">
              <div className="p-0.5 w-full h-2/3 block relative">
                <ImageElm ObjFit="object-cover" url={medias[0]} />
                {isShowDelete && (
                  <MdOutlineClear
                    onClick={() => deleteImage(medias[0])}
                    color="#fff"
                    className="h-5 w-5 absolute top-0 right-0 p-1 bg-red-500 rounded-full"
                  />
                )}
              </div>
              <div className="w-full  flex justify-between  h-1/3 ">
                {restMedias.map((media, index) => (
                  <div key={index} className="p-0.5 w-full block relative">
                    <ImageElm ObjFit="object-cover" url={media} />
                    {isShowDelete && (
                      <MdOutlineClear
                        onClick={() => deleteImage(medias[index])}
                        color="#fff"
                        className="h-5 w-5 absolute top-0 right-0 p-1 bg-red-500 rounded-full"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          );

        case 5:
          return (
            <div className="w-full  h-hashtag-popup flex flex-row justify-between">
              <div className="w-full flex flex-col justify-between overflow-hidden">
                <div className="p-0.5 w-full h-full block relative">
                  <ImageElm
                    ObjFit="object-cover"
                    url={medias[0]}
                    style={{ height: '100%' }}
                  />
                  {isShowDelete && (
                    <MdOutlineClear
                      onClick={() => deleteImage(medias[0])}
                      color="#fff"
                      className="h-5 w-5 absolute top-0 right-0 p-1 bg-red-500 rounded-full"
                    />
                  )}
                </div>
                <div className="p-0.5 w-full h-full block relative">
                  <ImageElm
                    ObjFit="object-cover"
                    url={medias[1]}
                    style={{ height: '100%' }}
                  />
                  {isShowDelete && (
                    <MdOutlineClear
                      onClick={() => deleteImage(medias[1])}
                      color="#fff"
                      className="h-5 w-5 absolute top-0 right-0 p-1 bg-red-500 rounded-full"
                    />
                  )}
                </div>
              </div>
              <div className="w-full flex flex-col justify-between overflow-hidden">
                <div
                  className="p-0.5 w-full block relative"
                  style={{ height: '33.33333333333333%' }}
                >
                  <ImageElm ObjFit="object-cover" url={medias[2]} />
                  {isShowDelete && (
                    <MdOutlineClear
                      onClick={() => deleteImage(medias[2])}
                      color="#fff"
                      className="h-5 w-5 absolute top-0 right-0 p-1 bg-red-500 rounded-full"
                    />
                  )}
                </div>
                <div
                  className="p-0.5 w-full block relative"
                  style={{ height: '33.33333333333333%' }}
                >
                  <ImageElm ObjFit="object-cover" url={medias[3]} />
                  {isShowDelete && (
                    <MdOutlineClear
                      onClick={() => deleteImage(medias[3])}
                      color="#fff"
                      className="h-5 w-5 absolute top-0 right-0 p-1 bg-red-500 rounded-full"
                    />
                  )}
                </div>
                <div
                  className="p-0.5 w-full block relative last-image"
                  style={{ height: '33.33333333333333%' }}
                >
                  <ImageElm ObjFit="object-cover" url={medias[4]} />
                  {isShowDelete && (
                    <MdOutlineClear
                      onClick={() => deleteImage(medias[4])}
                      color="#fff"
                      className="h-5 w-5 absolute top-0 right-0 p-1 bg-red-500 rounded-full"
                    />
                  )}
                  {renderMore()}
                  {medias.length > 5 ? (
                    <div className="absolute top-0 bg-gray-400 h-full w-full opacity-80 flex justify-center items-center">
                      <span className="text-4xl text-white">
                        +{numberImageResidual}
                      </span>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          );

        default:
          return;
      }
    }
  };

  const renderIconPlay = useCallback(() => {
    if (contentType && contentType.toLowerCase() === 'video') {
      return (
        <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center z-10">
          <div className="w-20 h-20 bg-gray-400 rounded-full opacity-50">
            <FiPlayCircle className="w-full h-full text-white" />
          </div>
        </div>
      );
    }
  }, [contentType]);

  const renderLoading = () => {
    return (
      <div className="w-full h-full flex items-center justify-center absolute top-0 left-0 bg-gray-100 bg-opacity-95 z-20">
        <FaSpinner className="animate-spin text-4xl text-gray-500" />
      </div>
    );
  };

  return (
    <div
      className="mt-8 w-full block relative cursor-pointer"
      onClick={() => handleActionShowPopup()}
    >
      {downloadedMediaUrl ? (
        <ReactPlayer
          className="react-player preview rounded-md w-full h-full"
          height={'600px'}
          width={'100%'}
          controls={true}
          url={downloadedMediaUrl}
          playing={true}
          muted={true}
        />
      ) : (
        <>
          {renderMedias()}
          {renderIconPlay()}
          {loadingVideo && renderLoading()}
        </>
      )}
    </div>
  );
}

export default React.memo(Image);
