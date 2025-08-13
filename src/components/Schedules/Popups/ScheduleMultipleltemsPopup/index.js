import React, { useCallback, useEffect, useState } from 'react';
import { ImCross, ImFacebook } from 'react-icons/im';
import { useDispatch, useSelector } from 'react-redux';
import InfoLeft from '../ScheduleltemPopup/InfoLeft';
import InfoRight from '../ScheduleltemPopup/InfoRight';
import { setScheduleItemPopupToShowMultiple } from '../../../../store/actions/Schedules';
import PerfectScrollbar from 'react-perfect-scrollbar';
import DetailTiktok from '../../Tiktok/DetailTiktok';
import { actionSetCurrentContent } from '../../../../store/actions/instagram';
import { instagramService } from '../../../../services/instagram';
import { threadsService } from '../../../../services/threads';
import { convertInstagramLink } from '../../../../helpers';
import { setContentDetailToShow } from '../../../../store/actions/Contents/contentActions';
import DetailDouyin from '../../douyin/detailDouyin';
import ContentDetail from '../../../InstagramCpn/ContentDetail';
import { toast } from 'react-toastify';
import { OK } from '../../../../configs';
import { TextToVideoService } from '../../../../services/TextToVideo';

const ScheduleMultipleItemsPopup = (props) => {
  const { contents = null } = props;
  const [isActiveForm, setIsActiveForm] = useState(false);
  const [hasTikTok, setHasTikTok] = useState(false);
  const [open, setOpen] = useState(false);
  const [objSelect, setObjSelect] = useState({});
  const [douyinOpen, setDouyinOpen] = useState(false);
  const [douyinObj, setDouyinObj] = useState({});
  const { currentContent = null } = useSelector((state) => state.instagram);
  const { contentDetailToShow } = useSelector((state) => state.contents);

  const handleCloseDouyinPopup = () => {
    setDouyinOpen(!douyinOpen);
  };

  const { scheduleMultipleItemsToShow = null } = useSelector(
    (state) => state.schedules
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (scheduleMultipleItemsToShow !== null) setIsActiveForm(true);
    else setIsActiveForm(false);
  }, [scheduleMultipleItemsToShow]);

  useEffect(() => {
    if (contents && contents.length > 0) {
      const search = contents.find((elt) => elt.source_type === 'tiktok');
      if (search) {
        setHasTikTok(true);
      } else {
        setHasTikTok(false);
      }
    } else {
      setHasTikTok(false);
    }
  }, [contents]);

  const handleClosePopup = () => {
    setOpen(!open);
  };

  const getInstagramPostInfo = async (code, replaceText = '') => {
    toast.info('Đang lấy thông tin bài viết...');
    const res = await instagramService.getPostsInfo([code]);
    if (res.status === OK) {
      const postInfo = res?.data?.data[0];
      dispatch(actionSetCurrentContent({ ...postInfo, text: replaceText }));
    }
    toast.dismiss();
  };

  const getThreadPostInfo = async (contentId, replaceText = '') => {
    toast.info('Đang lấy thông tin bài viết...');
    const res = await threadsService.getPostDetail(contentId);
    if (res.status === OK) {
      const postInfo = res?.data?.data;
      dispatch(
        setContentDetailToShow({
          ...postInfo,
          text: replaceText,
          post_text: replaceText,
          user_screenname: postInfo?.user_name,
          page_avatar: convertInstagramLink(postInfo?.user_picture),
        })
      );
    }
    toast.dismiss();
  };
  const getVideoAI = async (contentId, replaceText = '') => {
    toast.info('Đang lấy thông tin bài viết...');
    const res = await TextToVideoService.getCompletedVideos(1, contentId);
    if (res.status === OK) {
      const videoInfo = res?.data?.data?.data[0];
      dispatch(
        setContentDetailToShow({
          post_text: replaceText,
          medias: [''],
          isCreatedContent: true,
          media_url: videoInfo.video_url,
          thumbnail: videoInfo.thumbnail_url,
          media_type: "video",
          user_screenname: "_",
          videogen_settings: videoInfo.setting,
        })
      );
    }
    toast.dismiss();
  };

  const handleActionShowPopup = (scheduleContent) => {
    const {
      content_id = '',
      source_type = '',
      source_content = null,
      status = 0,
    } = scheduleContent;
    if (status === 1 || status === 5) {
      window.open(scheduleContent?.publish_url, '_blank');
      return;
    }
    switch (source_type) {
      case 'tiktok':
        const elt = {
          post_id: content_id,
        };
        setObjSelect(elt);
        setOpen(true);
        break;

      case 'special':
      case 'trending':
      case 'trend':
      case 'system':
      case 'event':
        dispatch(setContentDetailToShow(source_content));
        // check if content is video
        /*if (source_content?.media_type === 'video') {
          // open link on new tab
          const link = `https://www.facebook.com/${content_id}`;
          window.open(link, '_blank');
        }*/
        break;

      case 'instagram':
        getInstagramPostInfo(content_id, scheduleContent?.replaced_post_text);
        break;

      case 'douyin':
        setDouyinObj({
          video_id: content_id,
          likes: 0,
          comments: 0,
          shares: 0,
        });
        setDouyinOpen(true);
        break;

      case 'threads':
        getThreadPostInfo(content_id, scheduleContent?.replaced_post_text);
        break;
      case 'video_ai':
        getVideoAI(content_id, scheduleContent?.replaced_post_text);
        break;

      default:
        break;
    }
  };

  const closeForm = useCallback(() => {
    dispatch(setScheduleItemPopupToShowMultiple(null));
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-9999">
      <div
        onClick={closeForm}
        className={`absolute inset-0 bg-black ${isActiveForm ? 'opacity-20' : 'opacity-0'
          } transition-all duration-300 ease-linear`}
      />
      <PerfectScrollbar
        className={`bg-white max-w-2xl w-full m-auto rounded-md outline-none border-0 shadow-md py-3 pl-3 pr-8 pt-8 transform origin-center max-h-schedule relative overflow-x-hidden ${isActiveForm ? 'scale-100' : 'scale-0'
          } transition-all duration-300 ease-linear`}
        style={{ height: 'auto' }}
      >
        <div
          className="absolute top-1 right-1 cursor-pointer p-2 border rounded-md border-red-500"
          onClick={closeForm}
        >
          <ImCross className="w-4 h-4 text-red-500" />
        </div>
        {contents &&
          contents.length > 0 &&
          contents.map((content, index) => {
            const { source_content = null } = content;
            return (
              <div
                key={index}
                className="flex flex-nowrap relative my-1 border rounded-md"
              >
                <InfoLeft
                  handleActionShowPopup={handleActionShowPopup}
                  images={source_content?.medias || []}
                  mediaType={source_content?.media_type || ''}
                  scheduleContent={content}
                  isMultiple={true}
                />
                <InfoRight scheduleContent={content} />
              </div>
            );
          })}
      </PerfectScrollbar>
      {hasTikTok && (
        <DetailTiktok
          open={open}
          setOpen={handleClosePopup}
          handleClosePopup={handleClosePopup}
          obj={objSelect}
        />
      )}
      {currentContent && <ContentDetail />}
      <DetailDouyin
        open={douyinOpen}
        setOpen={handleCloseDouyinPopup}
        handleClosePopup={handleCloseDouyinPopup}
        obj={douyinObj}
      />
    </div>
  );
};

export default ScheduleMultipleItemsPopup;
