import { formatDate } from '../../helpers/date';
import { get } from 'lodash';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { connect, useDispatch } from 'react-redux';
import CalendarIcon from '../../assets/images/icon/calendar.png';
import CommentIcon from '../../assets/images/icon/comment.png';
import VideoGenIcon from '../../assets/images/icon/main-menu/menu-icon-videogen.png';

import EditIcon from '../../assets/images/icon/edit.png';
import LikeIcon from '../../assets/images/icon/like.png';
import ShareIcon from '../../assets/images/icon/share.png';
import { toast } from 'react-toastify';
import { setContentDetailToShow } from '../../store/actions/Contents/contentActions';
import {
  actionUpdateStep1,
  resetCreateContent,
} from '../../store/actions/createContent';
import { actionPushContentToCreateContentScreen } from '../../store/actions/homepage';
import { useHistory } from 'react-router-dom';
import {
  setCurrentDateTime,
  setIsShowFinalStep,
  setSelectedScheduleContent,
  setShowSourceIdeasPopup,
} from '../../store/actions/Schedules';
import moment from 'moment';
import { FiPlayCircle } from 'react-icons/fi';
import { kFormatter } from '../../utils/utilityFunc';
import Client from '../../Client';
import { OK } from '../../configs';
import { setScript } from '../../store/actions/TextToVideo';

const LeftContent = (props) => {
  const { topLikeContents, topShareContents, topCommentContents } = props;
  const history = useHistory();
  const dispatch = useDispatch();

  const pushToScreenCreateContent = async (item) => {
    const { post_text, medias, media_type, media_url } = item;
    let mediass = medias;
    if (media_type === 'video' && media_url) {
      toast.info('Đang tải video, vui lòng chờ trong giây lát...');
      // remove last character of media_url if it is not a number
      let mediaUrl = media_url;
      const lastChar = mediaUrl[mediaUrl.length - 1];
      if (isNaN(lastChar)) {
        mediaUrl = mediaUrl.slice(0, -1);
      }
      const res = await Client.get(`/get-video-link/${mediaUrl}`);
      if (res.status === OK) {
        mediass = [
          {
            type: 'video',
            url: res.data.data,
          },
        ];
        toast.dismiss();
      }
    }
    dispatch(actionUpdateStep1(true));
    dispatch(resetCreateContent());
    dispatch(
      actionPushContentToCreateContentScreen(post_text, mediass, media_type)
    );
    history.push('/tao-content');
  };

  const handleSetSchedule = (item) => {
    dispatch(
      setSelectedScheduleContent({
        ...item,
        content_id: item?.post_id,
        source_type: 'system',
      })
    );
    dispatch(setCurrentDateTime());
    dispatch(setIsShowFinalStep(true));
    dispatch(setShowSourceIdeasPopup(false));
    history.push('/lich-dang-bai');
  };

  const handleShowContent = (content) => {
    dispatch(setContentDetailToShow({ ...content, writed: true }));
  };

  const data = [
    {
      title: 'Top 20 bài viết nhiều Like nhất 10 ngày qua',
      type: 'likes',
      icon: LikeIcon,
      items: topLikeContents,
      id: 1,
    },
    {
      title: 'Top 20 bài viết nhiều bình luận nhất 10 ngày qua',
      type: 'comments',
      icon: CommentIcon,
      items: topCommentContents,
      id: 2,
    },
    {
      title: 'Top 20 bài viết nhiều chia sẻ nhất 10 ngày qua',
      type: 'shares',
      icon: ShareIcon,
      items: topShareContents,
      id: 3,
    },
  ];

  let rows = [];
  data.map((v, key) => {
    const items = [];
    const maxLength = v.items.length;
    v.items.map((item, idx) => {
      const {
        medias = [],
        media_type = '',
        likes = 0,
        comments = 0,
        shares = 0,
        post_header = '',
        post_text = '',
      } = item;
      items.push(
        <div key={idx}>
          <div className="w-full flex py-2">
            <div
              className="w-1/2 p-3 cursor-pointer"
              onClick={() => handleShowContent(item)}
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-1/4 flex h-28 relative bg-no-repeat bg-cover bg-center"
                  style={{ backgroundImage: `url(${medias[0]})` }}
                >
                  {media_type === 'video' && (
                    <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center">
                      <div className="w-10 h-10 bg-gray-400 rounded-full opacity-50">
                        <FiPlayCircle className="w-full h-full text-white" />
                      </div>
                    </div>
                  )}

                  {medias && medias.length > 1 && (
                    <div className="absolute top-1/2 left-1/2 bg-gray-600 opacity-70 rounded-full w-12 h-12 flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2">
                      <span className="text-white font-medium text-base">
                        + {medias?.length - 1}
                      </span>
                    </div>
                  )}
                </div>
                <div className="truncate p-2 ml-auto w-3/4">
                  <span className="font-bold ">{post_header}</span>
                  <br />
                  <p
                    className="line-clamp-3 whitespace-pre-wrap"
                    dangerouslySetInnerHTML={{ __html: post_text }}
                  ></p>
                </div>
              </div>
            </div>
            <div className="w-1/2 p-3 flex items-center">
              <div className="w-1/4 pt-3">
                <span className="float-right pl-2 pt-0.5">
                  {kFormatter(
                    v.id === 1 ? likes : v.id === 2 ? comments : shares
                  )}
                </span>
                <img src={v.icon} className="w-5  float-right" />
              </div>
              <div className="w-1/4 pt-3 text-right">
                <span className="pt-0.5">
                  {formatDate(item.updated, 'DD t\\háng MM')}
                </span>
              </div>
              <div className="w-1/4 pt-3 text-right">
                <span className="pt-0.5 font-bold">
                  {get(item, 'category.name')}
                </span>
              </div>
              <div className="w-1/4 gap-2 flex mr-3">
                <img
                  onClick={() => pushToScreenCreateContent(item)}
                  src={EditIcon}
                  className="w-5 float-right cursor-pointer"
                />
                <img
                  onClick={() => handleSetSchedule(item)}
                  src={CalendarIcon}
                  className="w-5 float-right cursor-pointer"
                />
                <img
                  onClick={() => {
                    dispatch(setScript((item.post_text ?? "").replace(/<br\s?\/?>/g, "\n")));
                    history.push('/text-to-video');
                  }}
                  src={VideoGenIcon}
                  className="w-6 float-right cursor-pointer"
                />
              </div>
            </div>
          </div>
          {v.items.length > 0 && idx + 1 !== maxLength && (
            <div className="w-full h-1 border-t-2 border-gray-300 border-dashed"></div>
          )}
        </div>
      );
    });

    rows.push(
      <div
        className="mt-5 rounded-md p-3 bg-white shadow-smBlackShadow"
        key={v.id}
      >
        <div className="title w-full p-3">
          <h2 className="text-xl font-bold">{v.title}</h2>
        </div>
        <PerfectScrollbar className="text-nowrap max-h-top-contents">
          {items}
        </PerfectScrollbar>
        <br className="clear-both" />
      </div>
    );
  });

  return rows;
};

export default LeftContent;
