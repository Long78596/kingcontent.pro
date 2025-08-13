import { useCallback, useState } from 'react';
import { AiOutlineLike } from 'react-icons/ai';
import {
  FaEye,
  FaPenAlt,
  FaRegCommentDots,
  FaRegShareSquare,
} from 'react-icons/fa';
import { kFormatter } from '../../../../../utils/utilityFunc';
import { setContentDetailToShow } from '../../../../../store/actions/Contents/contentActions';
import { useDispatch } from 'react-redux';
import { breakWord } from '../../../../../helpers';
import {
  toggleEditorText,
  updateProps,
} from '../../../../../store/actions/createContent';
import { confirmAlert } from 'react-confirm-alert';
import { FiPlayCircle } from 'react-icons/fi';
import Client from '../../../../../Client';
import { toast } from 'react-toastify';
import { KEY_HASH_VIDEO_OR_IMAGE } from '../../../../../reducers/createContent';
import { OK } from '../../../../../configs';

const Content = (props) => {
  const { content, isIdea = false } = props;
  const {
    post_text: postText = '',
    media_type = '',
    likes = 0,
    comments = 0,
    shares = 0,
    ff_posts_id: contentId = '',
    feed_id: fpFeedId = '',
    user_screenname: fanpageName = '',
    thumbnail = '',
    medias = [],
    videos = [],
    media_url = '',
  } = content;

  const dispatch = useDispatch();

  const handleOnShowDetail = useCallback(() => {
    setContentDetailToShow && dispatch(setContentDetailToShow(content));
  }, [dispatch, content]);

  const handleSelectContent = () => {
    confirmAlert({
      title: 'Xác nhận',
      message: 'Bạn muốn đưa những nội dung nào từ bài viết này ?',
      buttons: [
        {
          label: 'Chỉ chọn nội dung',
          color: 'green',
          onClick: () => {
            dispatch(toggleEditorText(postText, true));
          },
        },
        {
          label:
            media_type === 'video'
              ? 'Chọn cả nội dung và video'
              : 'Chọn cả nội dung và hình ảnh',
          color: 'blue',
          onClick: async () => {
            dispatch(toggleEditorText(postText, true));
            dispatch(
              updateProps([
                {
                  prop: KEY_HASH_VIDEO_OR_IMAGE,
                  value: media_type,
                },
              ])
            );
            // get video url
            if (media_type === 'video') {
              toast.info('Đang tải video, vui lòng chờ trong chốc lát...');
              let mediass = [];
              if (media_url) {
                const res = await Client.get(`/get-video-link/${media_url}`);
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
                // hide toast
                toast.dismiss();
              }
              dispatch(
                updateProps([
                  {
                    prop: 'imageSelect',
                    value: mediass,
                  },
                ])
              );
            } else {
              dispatch(
                updateProps([
                  {
                    prop: 'imageSelect',
                    value: medias,
                  },
                ])
              );
            }
          },
        },
        {
          label: 'Huỷ',
          onClick: () => {},
        },
      ],
      overlayClassName: 'large-confirmation',
    });
  };

  return (
    <div className="w-full group relative">
      <div className="flex gap-3 border rounded p-2 mb-3 items-center">
        <div
          className="w-1/4 bg-no-repeat bg-cover rounded-lg h-52 relative"
          style={{
            backgroundImage: `url(${thumbnail})`,
          }}
        >
          {media_type === 'video' ? (
            <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center z-10">
              <div className="w-20 h-20 bg-gray-400 rounded-full opacity-50">
                <FiPlayCircle className="w-full h-full text-white" />
              </div>
            </div>
          ) : (
            ' '
          )}
          {medias.length > 1 && (
            <div className="absolute inset-0">
              <span className="h-full flex items-center justify-center text-3xl text-white font-semibold">
                + {medias.length - 1}
              </span>
            </div>
          )}
        </div>
        <div className="w-3/4">
          <h4 className="font-bold text-base">{fanpageName}</h4>
          <p
            className="text-gray-500 overflow-ellipsis max-h-24 overflow-hidden my-2 "
            dangerouslySetInnerHTML={{
              __html: breakWord(postText),
            }}
          ></p>
          <div className="flex justify-between">
            <div className="flex items-center gap-2">
              <AiOutlineLike size={24} />
              <span>{kFormatter(likes)}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaRegCommentDots size={24} />
              <span>{kFormatter(comments)}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaRegShareSquare size={24} />
              <span>{kFormatter(shares)}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="rounded absolute overflow-hidden bg-createContent-modalOverLayClr left-0 top-0 right-0 h-0 group-hover:h-full transition-height duration-300 ease-linear z-20">
        <div className="h-full w-full flex items-center">
          <ul className=" max-w-350 mx-auto">
            <li
              className="p-2 m-2 flex items-center cursor-pointer font-medium text-black transition-all duration-200 ease-linear rounded-md hover:text-red-500 hover:bg-darkBgOpacityClr"
              onClick={() => handleOnShowDetail()}
            >
              <FaEye className="w-10 h-10 px-2 py-1 bg-gray-50 border border-black rounded-md " />
              <a className="ml-4 no-underline text-base font-medium text-gray-50 transition-all duration-200 ease-linear">
                Xem chi tiết
              </a>
            </li>
            {isIdea && (
              <li
                className="p-2 m-2 flex items-center cursor-pointer font-medium text-black transition-all duration-200 ease-linear hover:text-red-500 hover:bg-darkBgOpacityClr"
                onClick={() => handleSelectContent(content)}
              >
                <FaPenAlt className="w-10 h-10 px-2 py-1 bg-gray-50 border border-black rounded-md " />
                <a className="ml-4 no-underline text-base font-medium text-gray-50 transition-all duration-200 ease-linear">
                  Đưa vào trình soạn thảo
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Content;
