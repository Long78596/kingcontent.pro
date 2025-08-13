import React, { useCallback } from 'react';
import ModalOverlay from './ModalOverlay';
import Body from './Body';
import Footer from './Footer';
import Header from './Header';
import Image from './Image';
import { useDispatch } from 'react-redux';
import { setContentDetailToShow } from '../../../store/actions/Contents/contentActions';
import {
  actionUpdateStep1,
  createContentToHomepage,
  resetCreateContent,
} from '../../../store/actions/createContent';
import { actionPushContentToCreateContentScreen } from '../../../store/actions/homepage';
import {
  useHistory,
  useParams,
} from 'react-router-dom/cjs/react-router-dom.min';
import { actionGetAllContent } from '../../../store/actions/contentUserLiked';
import { isArrayEmpty, OK } from '../../../configs';
import { toast } from 'react-toastify';
import { confirmAlert } from 'react-confirm-alert';
import { useState } from 'react';
import Client from '../../../Client';
import {
  setCurrentDateTime,
  setIsShowFinalStep,
  setSelectedScheduleContent,
  setShowSourceIdeasPopup,
} from '../../../store/actions/Schedules';
import SpecialFollowPopupNotsave from '../../../pages/fanpagesList/Popup';
import { setScript } from '../../../store/actions/TextToVideo';

const CategoriesContentItem = (props) => {
  const [isShowPopup, setIsShowPopup] = useState(false);
  const params = useParams();
  const {
    cateId,
    content,
    page,
    setIsOpenPopupTag,
    setContentSelect,
    setIsMorePost,
  } = props;

  const {
    post_text: postText = '',
    post_type: contentType = '',
    likes = 0,
    comments = 0,
    shares = 0,
    ff_posts_id: contentId,
    post_id,
    feed_id: fpFeedId,
    post_timestamp,
    timestamp = 0,
    user_screenname: fanpageName,
    page_name = '',
    videos,
    hashtag,
    page_id,
    page_avatar = '',
    media_type,
    media_url = '',
    wishlist = 0,
    source_type = '',
    page_picture = '',
    cat_id = 0,
  } = content;
  let medias = page === 'ads' ? content.images : content.medias || [];
  if (!Array.isArray(medias)) medias = medias.slice(0, -1).split(';');
  if (medias && isArrayEmpty(medias) && videos && !isArrayEmpty(videos))
    medias = content.videos.map((_elt) => _elt.thumb);
  const dispatch = useDispatch();
  const history = useHistory();
  const handleAction = async (action, item) => {
    setContentSelect(content);
    switch (action) {
      // XEM CHI TIỂT
      case 'VIEW_DETAIL_CONTENT':
        setContentDetailToShow && dispatch(setContentDetailToShow(content));
        break;
      // XEM THÊM BÀI VIẾT
      case 'VIEW_MORE_CONTENT':
        setIsMorePost(true);
        const page = {
          ...content,
          category: {
            cate_id: params.id,
          },
        };
        setIsShowPopup(page);
        break;
      // THÍCH BÀI VIẾT
      case 'SAVE_LIKED_CONTENT':
        setIsOpenPopupTag(true);
        break;
      //SOẠN THẢO
      case 'CREATE_CONTENT':
        if (media_url || (videos && !isArrayEmpty(videos))) {
          confirmAlert({
            title: 'Thông báo',
            message: 'Vui lòng chọn một hình thức soạn thảo ?',
            buttons: [
              {
                label: 'Chỉ lấy văn bản',
                onClick: async () => {
                  dispatch(actionUpdateStep1(true));
                  dispatch(resetCreateContent());
                  dispatch(
                    actionPushContentToCreateContentScreen(
                      postText,
                      content.medias,
                      'text',
                      wishlist === 1 || false
                    )
                  );
                  history.push('/tao-content');
                },
              },
              {
                label: 'Lấy văn bản & video',
                onClick: async () => {
                  toast.info('Đang tải video, vui lòng chờ trong chốc lát...');
                  let mediass = [];
                  if (media_url) {
                    const res = await Client.get(
                      `/get-video-link/${media_url}`
                    );
                    if (res.status === OK) {
                      mediass = [
                        {
                          type: 'video',
                          url: res.data.data,
                        },
                      ];
                      // hide toast
                      toast.dismiss();
                    }
                  } else {
                    mediass = videos.map((_elt) => {
                      return {
                        type: 'video',
                        url: _elt.video,
                      };
                    });
                  }
                  dispatch(actionUpdateStep1(true));
                  dispatch(resetCreateContent());
                  dispatch(createContentToHomepage({ status: true }));
                  dispatch(
                    actionPushContentToCreateContentScreen(
                      postText,
                      mediass,
                      'video',
                      wishlist === 1 || false
                    )
                  );
                  history.push('/tao-content');
                },
              },
              {
                label: 'Huỷ',
                onClick: () => {},
              },
            ],
            overlayClassName: 'large-confirmation',
          });
          return;
        }
        //reset content => replace content
        dispatch(createContentToHomepage({ status: true }));
        dispatch(actionUpdateStep1(true));
        dispatch(resetCreateContent());
        dispatch(
          actionPushContentToCreateContentScreen(
            postText,
            medias,
            media_type || 'text',
            wishlist === 1 || false
          )
        );
        history.push('/tao-content');
        break;
      // BỎ THÍCH
      case 'DISLIKE':
        confirmAlert({
          title: 'Thông báo',
          message: 'Bạn có muốn bỏ thích content này?',
          buttons: [
            {
              label: 'Có',
              onClick: async () => {
                const res = await Client.delete(
                  `/liked-data/${content?.contentId}`
                );
                if (res.status === OK) {
                  dispatch(actionGetAllContent());
                  toast.success('Thao tác thành công !');
                }
              },
            },
            {
              label: 'Không',
              onClick: () => {},
            },
          ],
        });
        break;
      //LÊN LỊCH
      case 'SCHEDULE_CONTENT':
        const { source_type = '' } = content;
        let source = 'system';
        if (source_type) {
          source = source_type;
        }
        dispatch(
          setSelectedScheduleContent({
            ...content,
            source_type: source,
            cat_id: cateId || cat_id,
          })
        );
        dispatch(setCurrentDateTime());
        dispatch(setIsShowFinalStep(true));
        dispatch(setShowSourceIdeasPopup(false));
        history.push('/lich-dang-bai');
        break;
      case 'EDIT_TAG':
        setIsOpenPopupTag(true);
        break;
      case 'SET_SCRIPT_VIDEO_AI':
        dispatch(setScript((content.post_text ?? "").replace(/<br\s?\/?>/g, "\n")));
        history.push("/text-to-video");
        break;
      default:
        break;
    }
  };

  let mb = 'mb-5';
  switch (page) {
    case 'contentLikedPage':
    case 'specialFollowPage':
      mb = 'mb-7';
      break;
  }
  return (
    <div
      className={`list-none align-top ${mb} w-full rounded-lg`}
      key={contentId}
    >
      <div
        className="bg-white rounded-t-lg  group relative contentItem"
        style={{ minHeight: '500px' }}
      >
        <Header
          fanpageName={page === 'ads' ? page_name : fanpageName}
          createdDate={page === 'ads' ? timestamp : post_timestamp}
          fb_id={page === 'ads' ? page_id : fpFeedId}
          page={page}
          page_avatar={page === 'ads' ? page_picture : page_avatar}
          source_type={source_type}
        />
        <Body content={postText} />
        <Image
          medias={medias}
          contentType={
            (videos && !isArrayEmpty(videos)) || media_type === 'video'
              ? 'video'
              : ''
          }
        />
        <ModalOverlay
          handleAction={handleAction}
          page={page}
          post_id={post_id}
        />
      </div>
      {page !== 'ads' && (
        <Footer
          likes={likes}
          comments={comments}
          shares={shares}
          page={page}
          post_id={post_id}
          hashtag={hashtag}
          handleAction={handleAction}
        />
      )}
      {isShowPopup && (
        <SpecialFollowPopupNotsave
          setIsShowPopup={setIsShowPopup}
          fanpage={isShowPopup}
          setIsMorePost={setIsMorePost}
        />
      )}
    </div>
  );
};

export default CategoriesContentItem;
