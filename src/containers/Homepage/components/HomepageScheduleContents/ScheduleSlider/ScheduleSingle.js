import moment from 'moment';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import DefaultContentThumb from '../../../../../assets/images/content-no-image.png';
import SuccessIcon from '../../../../../assets/images/icon/correct.png';
import WaitingIcon from '../../../../../assets/images/icon/time.png';
import noImageIcon from '../../../../../assets/images/no-image.png';
import addIcon from '../../../../../assets/images/icon/add-special.png';
import { setContentDetailToShow } from '../../../../../store/actions/Contents/contentActions';
import { createShortContent } from '../../../../../utils/utilityFunc';
import { useHistory } from 'react-router-dom';
import { FaPlayCircle } from 'react-icons/fa';
import DetailTiktok from '../../../../../components/Schedules/Tiktok/DetailTiktok';
import { toast } from 'react-toastify';
import { userServices } from '../../../../../services/users';
import { convertInstagramLink, convertVideoLink } from '../../../../../helpers';
import logoTikTok from '../../../../../assets/images/icon/main-menu/menu-icon-tiktok.png';
import douyinLogo from '../../../../../assets/images/icon/main-menu/douyin.png';
import InstagramLogo from '../../../../../assets/images/icon/main-menu/menu-icon-instagram.png';
import ThreadsLogo from '../../../../../assets/images/threads-thumbnail.png';
import ReactPlayer from 'react-player';

const TextStyled = styled.div`
  p {
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
`;
const SingleContent = (props) => {
  const { scheduleContent } = props;
  const {
    date_publish = '',
    destination_id = '',
    destination_name = '',
    status = 1,
    feed_name,
    replaced_post_text,
    empty = false,
    source_type = '',
    publish_url = '',
    thumbnail: scheduleThumbnail = '',
    source_content,
    type = 'fanpage',
  } = scheduleContent;

  const [content, setContent] = useState([]);
  const [shortContent, setShortContent] = useState('');
  const [medias, setMedias] = useState([]);
  const history = useHistory();
  const dispatch = useDispatch();
  const [thumbnail, setThumbnail] = useState(DefaultContentThumb);
  const [mediaType, setMediaType] = useState('image');
  const [postText, setPostText] = useState(replaced_post_text);
  const [isTiktok, setIsTiktok] = useState(false);
  const [tiktokDetail, setTiktokDetail] = useState(false);
  const [open, setOpen] = useState(false);
  const [sourceLogo, setSourceLogo] = useState('');
  const [videoLink, setVideoLink] = useState('');

  useEffect(() => {
    if (scheduleContent) {
      const {
        source_type,
        destination_id,
        source_content = [],
        replaced_post_text,
        media_type,
      } = scheduleContent;
      setContent(
        {
          ...source_content,
          feed_id: destination_id,
          page_avatar: `https://graph.facebook.com/${destination_id}/picture?type=large`,
        } || null
      );
      if (source_content) {
        if (source_content.medias) {
          setMedias(source_content?.medias || []);
        }
        if (source_content.media_type) {
          setMediaType(source_content?.media_type);
        }
        if (source_content.post_text) {
          setPostText(source_content?.post_text);
        }
      } else {
        setPostText(replaced_post_text);
        setMediaType(media_type);
      }
      setIsTiktok(source_type === 'tiktok');

      switch (source_type) {
        case 'tiktok':
          setSourceLogo(logoTikTok);
          break;

        case 'douyin':
          setSourceLogo(douyinLogo);
          break;

        case 'instagram':
          setSourceLogo(InstagramLogo);
          break;

        case 'threads':
          setSourceLogo(ThreadsLogo);
          break;

        case 'user':
          setSourceLogo('');
          if (source_content?.media_type === 'video') {
            setVideoLink(source_content?.media_url);
          }
          break;

        default:
          setSourceLogo('');
          break;
      }
    }
  }, [scheduleContent]);

  useEffect(() => {
    if (content) {
      const { content: postText } = content;
      setShortContent(createShortContent(postText, 50));
    }
  }, [content]);

  useEffect(() => {
    if (medias && medias.length > 0) {
      const thumb = medias[0] || '';
      setThumbnail(thumb || DefaultContentThumb);
    } else {
      if (
        scheduleContent?.source_type === 'user' &&
        (scheduleContent?.source_content?.preset ||
          scheduleContent?.source_content?.random_preset)
      ) {
        setThumbnail(
          scheduleContent?.source_content?.preset?.url ||
            scheduleContent?.source_content?.random_preset?.url
        );
      } else {
        setThumbnail(scheduleContent?.thumbnail || DefaultContentThumb);
      }
    }
  }, [medias, scheduleContent]);

  const renderStatus = (status) => {
    switch (status) {
      case 1:
        return (
          <div className="flex items-center gap-1 border-r-2 border-gray-200 pr-1">
            <img src={SuccessIcon} alt="thành công" className="w-5 h-5 mr-1" />
            <span className="font-bold">Thành công</span>
          </div>
        );
      case 2:
        return (
          <div className="flex items-center gap-1 border-r-2 border-gray-200 pr-1">
            <img src={WaitingIcon} alt="wating" className="w-5 h-5 mr-1" />
            <span className="font-bold">Đang chờ đăng</span>
          </div>
        );
      case 3:
        return (
          <div className="flex items-center gap-1 border-r-2 border-gray-200 pr-1">
            <img src={WaitingIcon} alt="wating" className="w-5 h-5 mr-1" />
            <span className="font-bold">Tạm dừng</span>
          </div>
        );
      case 4:
        return (
          <div className="flex items-center gap-1 border-r-2 border-gray-200 pr-1">
            <img src={WaitingIcon} alt="wating" className="w-5 h-5 mr-1" />
            <span className="font-bold">Đã huỷ</span>
          </div>
        );

      default:
        break;
    }
  };
  const redirectPage = () => {
    history.push('/lich-dang-bai');
  };

  const handleShowContentDetail = async () => {
    if (status === 1 || status === 5) {
      // open publish_url
      window.open(publish_url, '_blank');
      return;
    }
    switch (source_type) {
      case 'tiktok':
        setTiktokDetail({
          post_id: scheduleContent.content_id,
          feed_name: scheduleContent.feed_name,
        });
        setOpen(true);
        break;

      case 'instagram':
      case 'threads':
      case 'douyin':
        // load content from source
        toast.info('Đang tải nội dung, vui lòng chờ trong giây lát...');
        const res = await userServices.getSingleScheduleContent(
          scheduleContent.id
        );
        if (res && res.data) {
          const { data } = res.data;
          const {
            text = '',
            user_display_name = '',
            user_picture = '',
            feed_avatar = '',
            media_type = '',
            video = '',
          } = data;
          let newContent = {
            ...content,
            ...data,
            post_text: scheduleContent.replaced_post_text || text,
            user_screenname:
              scheduleContent.destination_name || user_display_name,
            feed_id: destination_id,
            page_avatar: user_picture.includes('instagram')
              ? convertInstagramLink(user_picture)
              : user_picture || feed_avatar,
            media_url:
              media_type === 'video' && content?.videos
                ? content?.videos[0].source
                : scheduleContent.source_type === 'douyin'
                ? convertVideoLink(video)
                : '',
          };
          dispatch(setContentDetailToShow(newContent));
        }
        break;

      default:
        dispatch(setContentDetailToShow(scheduleContent.source_content));
        break;
    }
  };

  const handleClosePopup = () => {
    setOpen(!open);
  };
  return (
    <>
      {empty ? (
        <div className="singleContent relative bg-white rounded-md w-full leading-10 p-4 flex h-24 cursor-pointer gap-4">
          <img src={noImageIcon} alt="" className="bg-gray-500" />
          <div className="w-full">
            <p className="font-bold text-gray-100 text-base ">
              Kingcontent.pro
            </p>
            <div className="border-b-2 border-dashed border-gray-100 w-full"></div>
            <TextStyled className="mb-2"></TextStyled>
          </div>
          <div className="absolute w-full ">
            <div className="flex mt-5 justify-center">
              <button
                title="Click để tạo lịch đăng bài mới"
                onClick={() => redirectPage()}
              >
                <img src={addIcon} width={40} height={40} alt="" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div
          className="singleContent bg-white rounded-md w-full p-4 flex cursor-pointer gap-4 relative border"
          onClick={() => handleShowContentDetail()}
        >
          {source_type === 'user' && videoLink ? (
            <div className="relative w-20 h-20 overflow-hidden rounded-lg">
              <ReactPlayer
                className="react-player preview w-full h-full"
                controls={false}
                url={videoLink}
                playing={false}
                muted={true}
              />
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center opacity-50">
                <FaPlayCircle className="text-white w-10 h-10" />
              </div>
            </div>
          ) : (
            <div
              className="bg-no-repeat bg-cover bg-center w-20 h-20 rounded-lg overflow-hidden relative"
              style={{ backgroundImage: `url(${thumbnail})` }}
            >
              {mediaType === 'video' && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center opacity-50">
                  <FaPlayCircle className="text-white w-10 h-10" />
                </div>
              )}
            </div>
          )}
          <div className="w-full">
            <p className="font-bold text-base">
              {destination_name || destination_id}{' '}
              {type === 'threads' ? '(Threads)' : ''}
            </p>
            <div className="border-b-2 border-dashed border-gray-100 w-full"></div>
            <TextStyled className="mb-2">
              <p>{postText}</p>
            </TextStyled>
            <div className="flex items-center gap-1">
              {renderStatus(status)}
              {moment(date_publish).format('HH:mm DD/MM/YYYY')}
            </div>
          </div>
          {sourceLogo && (
            <img
              src={sourceLogo}
              alt=""
              className="absolute top-3 right-3 w-6 h-6 rounded-full border border-gray-500 bg-white"
            />
          )}
          {isTiktok && (
            <DetailTiktok
              open={open}
              setOpen={handleClosePopup}
              handleClosePopup={handleClosePopup}
              obj={tiktokDetail}
            />
          )}
        </div>
      )}
    </>
  );
};

export default SingleContent;
