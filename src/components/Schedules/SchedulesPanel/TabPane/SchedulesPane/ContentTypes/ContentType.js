import React, { useCallback, useEffect, useState } from 'react';
import { HiStar } from 'react-icons/hi';
import { useDispatch } from 'react-redux';
import * as SCHEDULES from '../../../../../../store/actions/Schedules';
import logoTikTok from '../../../../../../assets/images/icon/main-menu/menu-icon-tiktok.png';
import douyinLogo from '../../../../../../assets/images/icon/main-menu/douyin.png';
import InstagramLogo from '../../../../../../assets/images/icon/main-menu/menu-icon-instagram.png';
import ThreadsLogo from '../../../../../../assets/images/threads-thumbnail.png';
import moment from 'moment';
import { toast } from 'react-toastify';
import { FiPlayCircle } from 'react-icons/fi';
import ReactPlayer from 'react-player';
import { convertInstagramLink } from '../../../../../../helpers';
import { FaCheck, FaQuestion, FaMinusCircle } from 'react-icons/fa';
import { AiOutlineFieldTime } from 'react-icons/ai';

function ContentType(props) {
  const {
    styleContent,
    contents = [],
    isEvent,
    hour,
    isMultiple = false,
    day,
  } = props;
  const [thumbnail, setThumbnail] = useState([]);
  const [currentContent, setCurrentContent] = useState(null);
  const [isVideo, setIsVideo] = useState(false);
  const [isUserContent, setIsUserContent] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [sourceLogo, setSourceLogo] = useState('');
  const dispatch = useDispatch();
  const [statusMessage, setStatusMessage] = useState('');
  const [hasSuccess, setHasSuccess] = useState(false);
  const [hasPreset, setHasPreset] = useState(false);

  useEffect(() => {
    if (contents && contents.length > 0) {
      setCurrentContent(contents[0]);
      if (isMultiple) {
        // count all success statuses (status = 1 or 5)
        const successCount = contents.filter(
          (content) => content.status === 1 || content.status === 5
        ).length;
        if (successCount > 0) {
          setStatusMessage(`Thành công: ${successCount}/${contents.length}`);
          setHasSuccess(true);
        } else {
          setStatusMessage(`Đang chờ: ${contents.length}/${contents.length}`);
          setHasSuccess(false);
        }
      }
    }
  }, [contents]);

  useEffect(() => {
    if (currentContent) {
      const {
        source_content = null,
        source_type = 'system',
        thumbnail = '',
        media_type = '',
      } = currentContent;
      switch (source_type) {
        case 'tiktok':
          setIsVideo(true);
          setThumbnail(thumbnail);
          setSourceLogo(logoTikTok);
          break;

        case 'douyin':
          setIsVideo(true);
          setThumbnail(thumbnail);
          setSourceLogo(douyinLogo);
          break;

        case 'instagram':
          setIsVideo(media_type === 'video');
          setThumbnail(thumbnail);
          setSourceLogo(InstagramLogo);
          break;

        case 'threads':
          setIsVideo(media_type === 'video');
          setThumbnail(thumbnail);
          setSourceLogo(ThreadsLogo);
          break;

        default:
          setSourceLogo('');
          if (!source_content) return;
          const {
            medias = [],
            media_type: contentMediaType = '',
            media_url = '',
          } = source_content;
          if (medias && medias.length > 0) setThumbnail(medias[0]);
          else setThumbnail('');
          if (contentMediaType === 'video') setIsVideo(true);
          else setIsVideo(false);
          setVideoUrl(media_url);
          break;
      }
      setIsUserContent(source_type === 'user');
    } else {
      setThumbnail('');
    }
  }, [currentContent]);

  useEffect(() => {
    if (isUserContent && currentContent?.source_content?.is_active_preset) {
      setHasPreset(true);
    } else {
      setHasPreset(false);
    }
  }, [currentContent, isUserContent]);

  const handleScheduleItemPopup = useCallback(() => {
    if (isMultiple) {
      dispatch(SCHEDULES.setScheduleItemPopupToShowMultiple(contents));
    } else {
      dispatch(SCHEDULES.setScheduleItemPopupToShow(currentContent));
    }
  }, [currentContent, isMultiple, contents]);

  const handleSelectSuggestsPopup = useCallback(() => {
    const selectedDate = `${moment(day).format('YYYY-MM-DD')} ${moment(
      hour
    ).format('HH:mm:ss')}`;
    const nextHour = moment(hour).add(1, 'hour');
    const time = new Date();
    if (moment(selectedDate) < time) {
      // Check if current time is between selected time and next hour
      if (moment(time).isBetween(selectedDate, nextHour)) {
        dispatch(SCHEDULES.setShowSourceIdeasPopup(true));
        // auto add 15 minutes to time and format to HH:mm:ss
        const newSelectedDate = `${moment(day).format('YYYY-MM-DD')} ${moment(
          time
        )
          .add(15, 'minutes')
          .format('HH:mm:ss')}`;
        dispatch(SCHEDULES.updateSelectedDateTime(newSelectedDate));
      } else {
        toast.error(
          `Bây giờ là ${moment(time).format(
            'HH:mm:ss DD-MM-YYYY'
          )}, vui lòng lên lịch đăng bài từ thời điểm này trở đi`
        );
      }
    } else {
      dispatch(SCHEDULES.setShowSourceIdeasPopup(true));
      dispatch(SCHEDULES.updateSelectedDateTime(selectedDate));
    }
  }, [dispatch, hour, day]);

  return (
    <li className="cursor-pointer content-type border group relative py-3 px-2">
      <div
        className="flex flex-col items-center justify-between rounded-lg p-2 h-full"
        // style={{ backgroundColor: `${randomRgbaColor(0.6)}` }}
      >
        <div
          className={`mt-1 outline-none flex items-center relative overflow-hidden justify-center ${
            thumbnail
              ? 'w-24 h-24 rounded-full ring-0'
              : hasPreset
              ? 'bg-cover bg-center p-2 rounded-md'
              : 'w-full border rounded-md p-2'
          }`}
          style={{
            backgroundImage: `url(${currentContent?.source_content?.preset?.url || currentContent?.source_content?.random_preset?.url})`,
          }}
        >
          {isUserContent && isVideo ? (
            <ReactPlayer
              className="react-player preview rounded-full w-full h-full border border-gray-400 overflow-hidden"
              url={videoUrl || ''}
              playing={false}
              controls={false}
              muted={true}
              style={{ maxWidth: '100px', maxHeight: '100px' }}
            />
          ) : thumbnail ? (
            <img
              src={
                thumbnail && thumbnail.includes('instagram')
                  ? convertInstagramLink(thumbnail)
                  : thumbnail
              }
              alt=""
              className="w-full h-full object-cover rounded-full border border-gray-400"
            />
          ) : (
            <div
              className={`w-full line-clamp-3 ${
                hasPreset
                  ? 'text-white h-12 flex items-center justify-center'
                  : 'h-full'
              }`}
            >
              {currentContent?.replaced_post_text ||
                currentContent?.source_content?.post_text}
            </div>
          )}
          {isVideo && (
            <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center z-10">
              <div className="w-10 bg-gray-400 rounded-full opacity-50">
                <FiPlayCircle className="w-full h-full text-white" />
              </div>
            </div>
          )}
        </div>
        {isMultiple && hasSuccess && (
          <div className="mt-2 flex items-center gap-1">
            <FaCheck className="h-5 w-5 rounded-full text-white bg-greenSuccess" />
            <span className="text-xs font-bold whitespace-nowrap">
              {statusMessage}
            </span>
          </div>
        )}
        {isMultiple && !hasSuccess && (
          <div className="mt-2 flex items-center gap-1">
            <AiOutlineFieldTime className="h-5 w-5 rounded-full text-gray-500" />
            <span className="text-xs font-bold whitespace-nowrap">
              {statusMessage}
            </span>
          </div>
        )}
        {!isMultiple && (
          <div className="mt-2 flex items-center gap-1">
            <styleContent.icon
              className={`h-5 w-5 rounded-full text-white ${styleContent.bgColor}`}
            />
            <span className="text-xs font-bold whitespace-nowrap">
              {styleContent?.name || ''}
            </span>
          </div>
        )}
      </div>
      {isEvent === true && (
        <span className="absolute top-1 right-0">
          <HiStar className="h-6 w-6 text-gray-800" />
          <HiStar className="h-5 w-5 text-yellow-400 absolute left-0.5 top-0.5" />
        </span>
      )}

      <div className="rounded-t-md absolute overflow-hidden bg-createContent-modalOverLayClr left-0 top-0 right-0 h-0 group-hover:h-full transition-height duration-300 ease-linear z-20">
        <div className="h-full w-full flex items-center">
          <ul className=" max-w-350 mx-auto">
            <li
              onClick={() => handleScheduleItemPopup()}
              className="p-2 m-2 flex items-center cursor-pointer font-medium text-white hover:text-blue-500 transition-all duration-200 ease-linear rounded bg-blue-500 hover:bg-white"
            >
              <span>Xem bài viết</span>
            </li>
            <li
              onClick={() => handleSelectSuggestsPopup()}
              className="p-2 m-2 flex items-center cursor-pointer font-medium text-white hover:text-red-500 transition-all duration-200 ease-linear rounded bg-red-500 hover:bg-white"
            >
              <span>Thêm bài mới</span>
            </li>
          </ul>
        </div>
      </div>

      {/* show total contents on top right corner with rounded background */}
      {isMultiple && (
        <div className="absolute top-0 right-0 bg-red-500 rounded-full w-6 h-6 mt-1 mr-1 text-center">
          <span className="text-base font-bold text-white">
            {contents.length}
          </span>
        </div>
      )}
      {sourceLogo && (
        <img
          src={sourceLogo}
          alt=""
          className="absolute bottom-1 right-1 w-6 h-6 rounded-full border border-gray-500 bg-white"
        />
      )}
    </li>
  );
}

export default React.memo(ContentType);
