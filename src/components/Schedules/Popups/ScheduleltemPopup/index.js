import React, { useCallback, useEffect, useState } from 'react';
import { ImCross, ImFacebook } from 'react-icons/im';
import { useDispatch, useSelector } from 'react-redux';
import InfoLeft from './InfoLeft';
import InfoRight from './InfoRight';
import Comments from './Comments/Comments';
import { VscCommentDiscussion, VscNote } from 'react-icons/vsc';
import { setScheduleItemPopupToShow } from '../../../../store/actions/Schedules';
import DetailTiktok from '../../Tiktok/DetailTiktok';
import { actionSetCurrentContent } from '../../../../store/actions/instagram';
import ContentDetail from '../../../InstagramCpn/ContentDetail';
import { instagramService } from '../../../../services/instagram';
import { toast } from 'react-toastify';
import { OK } from '../../../../configs';
import DetailDouyin from '../../douyin/detailDouyin';
import ContentDetailThreads from '../../../CategoriesContent/ContentDetailThreads/ContentDetailThreads';
import { threadsService } from '../../../../services/threads';
import { setContentDetailToShow } from '../../../../store/actions/Contents/contentActions';
import { convertInstagramLink } from '../../../../helpers';

const ScheduleItemPopup = (props) => {
  const { scheduleContent = null } = props;
  const { source_content = null } = scheduleContent;

  const [isActiveForm, setIsActiveForm] = useState(false);
  const [isShowContent, setIsShowContent] = useState(true);
  const [isShowComments, setIsShowComments] = useState(false);
  const [hasTikTok, setHasTikTok] = useState(false);
  const [open, setOpen] = useState(false);
  const [objSelect, setObjSelect] = useState({});
  const [douyinOpen, setDouyinOpen] = useState(false);
  const [douyinObj, setDouyinObj] = useState({});
  const { currentContent = null } = useSelector((state) => state.instagram);
  const { contentDetailToShow } = useSelector((state) => state.contents);

  const { showScheduleItemPopup = false, scheduleItemPopupToShow = null } =
    useSelector((state) => state.schedules);

  const dispatch = useDispatch();

  useEffect(() => {
    if (scheduleItemPopupToShow !== null) setIsActiveForm(true);
    else setIsActiveForm(false);
  }, [scheduleItemPopupToShow]);

  const handleCloseDouyinPopup = () => {
    setDouyinOpen(!douyinOpen);
  };

  const closeForm = useCallback(() => {
    dispatch(setScheduleItemPopupToShow(null));
  }, []);

  const onClickTab = useCallback(
    (tab) => {
      if (tab === 'content') {
        setIsShowContent(true);
        setIsShowComments(false);
      } else {
        setIsShowContent(false);
        setIsShowComments(true);
      }
    },
    [isShowContent, isShowComments]
  );

  useEffect(() => {
    if (isShowContent && scheduleItemPopupToShow) {
      const { source_type = '' } = scheduleItemPopupToShow;
      if (source_type === 'tiktok') {
        setHasTikTok(true);
      } else {
        setHasTikTok(false);
      }
    } else {
      setHasTikTok(false);
    }
  }, [isShowContent, scheduleItemPopupToShow]);

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

  const handleActionShowPopup = (scheduleContent) => {
    const { content_id = '', source_type = '', status = 0 } = scheduleContent;
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

      case 'user':
        if (source_content?.media_type === 'video') {
          // open link on new tab
          const link = source_content?.media_url;
          window.open(link, '_blank');
        }
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

      default:
        break;
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-9999">
      <div
        onClick={closeForm}
        className={`absolute inset-0 bg-black ${
          isActiveForm ? 'opacity-20' : 'opacity-0'
        } transition-all duration-300 ease-linear`}
      />
      <div
        className={`w-full bg-white ${
          isShowContent ? 'max-w-2xl' : 'max-w-9/10'
        } m-auto rounded-md outline-none border-0 shadow-md flex flex-wrap py-3 pl-3 pr-4 transform origin-center justify-center relative ${
          isActiveForm ? 'scale-100' : 'scale-0'
        } transition-all duration-300 ease-linear`}
      >
        <div
          className="absolute top-2 right-2 cursor-pointer p-2 border rounded-md border-red-500"
          onClick={closeForm}
        >
          <ImCross className="w-4 h-4 text-red-500" />
        </div>
        <div className="tabs flex flex-nowrap w-full border-b border-solid border-gray-300 ml-3 pb-1">
          <div
            onClick={() => onClickTab('content')}
            className={`group cursor-pointer inline-block px-3 py-2 ml-0.5 rounded-t-md font-bold select-none text-base uppercase border hover:bg-blue-500 hover:text-white ${
              isShowContent
                ? 'bg-blue-500 text-white'
                : 'bg-white text-blue-500'
            } border-gray-300`}
          >
            <div className="flex items-center gap-2">
              <VscNote className="h-6 w-6" />
              <span className="ml-2">Bài viết</span>
            </div>
          </div>
          <div
            onClick={() => onClickTab('comments')}
            className={`group cursor-pointer inline-block px-3 py-2 ml-0.5 rounded-t-md font-bold select-none text-base uppercase border hover:bg-blue-500 hover:text-white ${
              isShowComments
                ? 'bg-blue-500 text-white'
                : 'bg-white text-blue-500'
            } border-gray-300`}
          >
            <div className="flex items-center gap-2">
              <VscCommentDiscussion className="h-6 w-6" />
              <span className="ml-2">Comments</span>
            </div>
          </div>
        </div>
        {isShowContent && (
          <div className="flex flex-nowrap justify-between w-full">
            <InfoLeft
              images={source_content?.medias || []}
              mediaType={source_content?.media_type || ''}
              scheduleContent={scheduleContent}
              handleActionShowPopup={handleActionShowPopup}
            />
            <InfoRight scheduleContent={scheduleContent} />
          </div>
        )}

        {isShowComments && (
          <div className="commentsContainer w-full p-3">
            <Comments
              scheduleComments={scheduleContent?.schedule_comments || []}
              autoComments={scheduleContent?.comments || []}
              content_id={scheduleContent?.id}
              is_posted={
                scheduleContent?.status === 1 || scheduleContent?.status === 5
              }
              publish_url={scheduleContent?.publish_url}
              type={scheduleContent?.type}
            />
          </div>
        )}
      </div>
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

export default ScheduleItemPopup;
