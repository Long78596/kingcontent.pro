import { useCallback, useState } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import PopupDetailContentPlan from '../../../../../pages/createPost/components/planCpn/popupDetail';
import { _dashed_border } from '../../../../../pages/createPost/utility';
import { setContentDetailToShow } from '../../../../../store/actions/Contents/contentActions';
import Footer from './Footer';
import { FiCalendar, FiEye, FiPlayCircle } from 'react-icons/fi';
import { FaPencilAlt } from 'react-icons/fa';
import {
  actionUpdateStep1,
  createContentToHomepage,
  resetCreateContent,
} from '../../../../../store/actions/createContent';
import { actionPushContentToCreateContentScreen } from '../../../../../store/actions/homepage';
import {
  setCurrentDateTime,
  setIsShowFinalStep,
  setSelectedScheduleContent,
  setShowSourceIdeasPopup,
} from '../../../../../store/actions/Schedules';
import { useHistory } from 'react-router-dom/cjs/react-router-dom';
import moment from 'moment';
import { toast } from 'react-toastify';
import Client from '../../../../../Client';
import { OK } from '../../../../../configs';
import VideoGenIcon from '../../../../../assets/images/icon/main-menu/menu-icon-videogen.png';
import { setScript } from '../../../../../store/actions/TextToVideo';

const TextStyled = styled.div`
  span {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    /* width : ; */
  }
`;
const SingleContent = (props) => {
  const { content = {} } = props;
  const [isOpen, setiIsOpen] = useState(false);
  const {
    medias = [],
    post_text = '',
    id = 0,
    image_url = '',
    user_screenname = '',
    shares = 0,
    likes = 0,
    comments = 0,
    media_type = 'image',
    wishlist = 0,
    media_url = '',
    videos = [],
  } = content;
  const dispatch = useDispatch();
  const history = useHistory();
  const onClickContent = () => {
    dispatch(
      setContentDetailToShow({
        ...content,
        images: content.medias,
        writed: true,
      })
    );
  };

  const handelWritePost = async () => {
    if (media_type === 'video') {
      toast.info('Đang tải video, vui lòng chờ trong chốc lát...');
      let customMedias = [];
      if (media_url) {
        const res = await Client.get(`/get-video-link/${media_url}`);
        if (res.status === OK) {
          customMedias = [
            {
              type: 'video',
              url: res.data.data,
            },
          ];
          // hide toast
          toast.dismiss();
        }
      } else {
        customMedias = videos.map((_elt) => {
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
          post_text,
          customMedias,
          media_type,
          wishlist === 1 || false
        )
      );
      history.push('/tao-content');
    } else {
      dispatch(resetCreateContent());
      dispatch(actionUpdateStep1(true));
      dispatch(
        actionPushContentToCreateContentScreen(
          post_text,
          medias,
          media_type,
          wishlist === 1
        )
      );
      history.push('/tao-content');
    }
  };

  const handleSetSchedule = (item) => {
    dispatch(
      setSelectedScheduleContent({
        ...item,
        source_type: 'special',
      })
    );
    // add next 7 minutes
    dispatch(
      setCurrentDateTime(
        moment().utc(true).add(7, 'minutes').format('YYYY-MM-DD HH:mm:ss')
      )
    );
    dispatch(setIsShowFinalStep(true));
    dispatch(setShowSourceIdeasPopup(false));
    history.push('/lich-dang-bai');
  };

  return (
    <div
      className="singleContent relative bg-white rounded-3xl mb-1 mr-5 mt-3 cursor-pointer shadow-lg pb-4 group"
      title="Nhấp vào để xem chi tiết"
    >
      <div
        className="thumbnail w-full bg-no-repeat bg-center bg-cover rounded-t-lg mb-2 h-48 relative"
        style={{ backgroundImage: `url(${medias[0] || image_url})` }}
      >
        {/* play icon */}
        {media_type === 'video' && (
          <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center z-10">
            <div className="w-20 h-20 bg-gray-400 rounded-full opacity-50">
              <FiPlayCircle className="w-full h-full text-white" />
            </div>
          </div>
        )}
      </div>
      <div>
        <span className="font-bold text-base mt-4 px-3">{user_screenname}</span>
      </div>
      <TextStyled className="px-3">
        <span dangerouslySetInnerHTML={{ __html: post_text || '' }}></span>
      </TextStyled>

      <div className={_dashed_border}></div>
      <Footer
        className={'mt-2 justify-between'}
        likes={likes}
        comments={comments}
        shares={shares}
      />
      <PopupDetailContentPlan
        isOpen={isOpen}
        item={content}
        setIsOpenDetail={setiIsOpen}
        showTool={true}
      />

      <div className="overlay absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 invisible rounded z-10 group-hover:visible"></div>
      <div className="actions absolute invisible rounded top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 py-3 px-5 gap-2 flex transition-all ease-in-out text-white z-20 flex-wrap group-hover:visible">
        <div
          className="flex items-center gap-2 cursor-pointer hover:bg-black bg-opacity-60 p-2 rounded whitespace-nowrap"
          onClick={() => onClickContent()}
        >
          <FiEye
            size={30}
            color="#fff"
            className="hover:scale-125 cursor-pointer"
            title="Xem chi tiết"
          />
          <span>Xem chi tiết</span>
        </div>
        <div
          className="flex items-center gap-2 cursor-pointer hover:bg-black bg-opacity-60 px-2 py-3 rounded whitespace-nowrap"
          onClick={() => handelWritePost()}
        >
          <FaPencilAlt
            size={20}
            color="#fff"
            className="hover:scale-125 cursor-pointer"
            title="Soạn bài viết"
          />
          <span>Soạn bài viết</span>
        </div>
        {/* schedule */}
        <div
          className="flex items-center gap-2 cursor-pointer hover:bg-black bg-opacity-60 p-2 rounded whitespace-nowrap"
          onClick={() => handleSetSchedule(content)}
        >
          <FiCalendar
            size={30}
            color="#fff"
            className="hover:scale-125 cursor-pointer"
            title="Lên lịch"
          />
          <span>Lên lịch</span>
        </div>
        {/* Tạo Video AI */}
        <div
          className="flex items-center gap-2 cursor-pointer hover:bg-black bg-opacity-60 p-2 rounded whitespace-nowrap"
          onClick={() => {
            dispatch(setScript(content.post_text.replace(/<br\s?\/?>/g, "\n")));
            history.push('/text-to-video');
          }}
        >
          <img src={VideoGenIcon} style={{ width: "32px" }}></img>
          <span>Tạo Video AI</span>
        </div>
      </div>
    </div>
  );
};

export default SingleContent;
