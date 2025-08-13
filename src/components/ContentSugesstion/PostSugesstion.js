import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import addIcons from '../../assets/images/icon/create-content/add.png';
import LoadingApp from '../LoadingApp';
// import DialogDetailPost from './dialogPostDetail';
import CommentIcon from '../../assets/images/icon/comment.png';
import LikeIcon from '../../assets/images/icon/like.png';
import ShareIcon from '../../assets/images/icon/share.png';
import NoImageIcon from '../../assets/images/pictures.png';
import styled from 'styled-components';
import {
  actionChangeSelectedIndexsSpecial,
  actionGetSpecialContents,
  actionGetTrendingContent,
  toggleEditorText,
  updateProps,
} from '../../store/actions/createContent';
import { confirmAlert } from 'react-confirm-alert';

import { FiPlayCircle } from 'react-icons/fi';
import { kFormatter } from '../../utils/utilityFunc';
import { KEY_HASH_VIDEO_OR_IMAGE } from '../../reducers/createContent';
import { toast } from 'react-toastify';
import Client from '../../Client';
import { setContentDetailToShow } from '../../store/actions/Contents/contentActions';
import { OK } from '../../configs';
import { convertUrlsToBase64 } from '../../pages/createPost/utility';
import { FaCheck } from 'react-icons/fa';

const ContentStyled = styled.div`
  max-height: 100px;
`;
const PostSugesstion = (props) => {
  const { contents = [], isTrend = false, isSpecial = false, currentQuery = '', multiSelect = false, additionalButton = null } = props;
  const { isLoading } = useSelector((state) => state.isLoadingApp);
  const { page = 1, isLoadingTrends = false } = useSelector(
    (state) => state.trendings
  );

  const { totalPages: totalPagesSpecial, currentPage: currentPageSpecial, selectedIndexs: selectedIndexsSpecial } =
    useSelector((state) => state.specialContents);

  const dispatch = useDispatch();

  const handleActionShowPopup = (elt) => {
    dispatch(setContentDetailToShow(elt));
  };

  const handleGetMoreContents = () => {
    if (isTrend) {
      dispatch(actionGetTrendingContent(page + 1, currentQuery));
    }
    if (isSpecial) {
      dispatch(actionGetSpecialContents(currentPageSpecial + 1, currentQuery));
    }
  };

  const handleSelectContent = (content) => {
    const {
      medias = [],
      post_text = '',
      media_type = 'image',
      videos = [],
      media_url = '',
    } = content;
    confirmAlert({
      title: 'Xác nhận',
      message: 'Bạn muốn đưa những nội dung nào từ bài viết này ?',
      buttons: [
        {
          label: 'Chỉ chọn nội dung',
          color: 'green',
          onClick: () => {
            dispatch(toggleEditorText(post_text, true));
          },
        },
        {
          label:
            media_type === 'video'
              ? 'Chọn cả nội dung và video'
              : 'Chọn cả nội dung và ảnh',
          color: 'blue',
          onClick: async () => {
            dispatch(toggleEditorText(post_text, true));
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
              convertUrlsToBase64(medias).then((arr) => {
                dispatch(
                  updateProps([
                    {
                      prop: 'imageSelect',
                      value: arr,
                    },
                  ])
                );
              });
            }
          },
        },
        {
          label: 'Huỷ',
          onClick: () => { },
        },
      ],
      overlayClassName: 'large-confirmation',
    });
  };

  const handleMultiSelectContent = (index, isSelected) => {
    dispatch(actionChangeSelectedIndexsSpecial(index, isSelected));
  };

  return (
    <div className="p-2 specialContents">
      {multiSelect == false ? <></> :
        <div className="flex items-center justify-end space-x-5 pr-8">
          <span className="font-bold text-lg text-gray-700">{selectedIndexsSpecial.length == 0 ? "Chọn tất cả " : "Đang chọn : " + selectedIndexsSpecial.length}</span>
          <input defaultChecked={false} onChange={(e) => handleMultiSelectContent(-1, e.target.checked)} type="checkbox" className="w-6 h-6 focus:ring-blue-500 rounded"></input>
        </div>
      }
      <div className="p-2 overflow-y-scroll overflow-x-hidden max-h-screen trendingContents">
        {contents.length === 0 /*&& !isLoading*/ ? (
          <div className="flex justify-center">
            <span className="font-bold">Không có dữ liệu hiển thị</span>
          </div>
        ) /*: isLoading ? (
          <LoadingApp />
        )*/ : (
          <>
            {contents.map((_elt, index) => {
              const {
                medias = [],
                media_type = 'image',
                post_text = '',
                post_header = '',
                likes = 0,
                comments = 0,
                shares = 0,
              } = _elt;
              const thumbnail = medias[0] || NoImageIcon;
              return (
                <div
                  className="mb-2 flex gap-2 rounded-sm hover:bg-gray-200 transition-all p-5 cursor-pointer border-gray-500 border-b border-dashed"
                  key={index}
                >
                  <div
                    className="w-1/6 relative h-28 bg-no-repeat bg-cover bg-center rounded-md"
                    onClick={() => handleActionShowPopup(_elt)}
                    style={{
                      backgroundImage: `url("${thumbnail}")`,
                    }}
                  >
                    {media_type === 'video' && (
                      <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center z-10">
                        <div className="w-20 h-20 bg-gray-400 rounded-full opacity-50">
                          <FiPlayCircle className="w-full h-full text-white" />
                        </div>
                      </div>
                    )}
                  </div>
                  <div
                    className="w-4/6"
                    onClick={() => handleActionShowPopup(_elt)}
                  >
                    <h3 className="font-bold">{post_header}</h3>
                    <ContentStyled className="max-w-full overflow-hidden">
                      <p
                        className="truncate"
                        dangerouslySetInnerHTML={{ __html: post_text }}
                      ></p>
                    </ContentStyled>

                    <div className="flex justify-between p-3 items-center mt-2 rounded-md">
                      <div className="gap-2 flex items-center">
                        <img src={LikeIcon} alt="" className="w-4" />
                        <span>{kFormatter(likes)}</span>
                      </div>
                      <div className="gap-2 flex items-center">
                        <img src={CommentIcon} alt="" className="w-4" />
                        <span>{kFormatter(comments)}</span>
                      </div>
                      <div className="gap-2 flex items-center">
                        <img src={ShareIcon} alt="" className="w-4" />
                        <span>{kFormatter(shares)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="w-1/6 flex items-center justify-center">
                    {multiSelect == false ?
                      <img
                        src={addIcons}
                        className="w-6"
                        onClick={() => handleSelectContent(_elt)}
                      />
                      :
                      <input checked={selectedIndexsSpecial.includes(index)} onChange={(e) => handleMultiSelectContent(index, e.target.checked)} type="checkbox" className="w-6 h-6 focus:ring-blue-500 rounded"></input>
                    }
                  </div>
                </div>
              );
            })}
            {/* show loading icon when get more contents */}
            {isLoadingTrends && (
              <div className="flex justify-center">
                <LoadingApp />
              </div>
            )}
            {/* get more contents button */}
            <div className="flex justify-center w-full mt-2">
              <button
                className={`bg-blue-500 text-white px-4 py-2 rounded-md w-1/2 m-3 ${totalPagesSpecial === currentPageSpecial && isSpecial ? 'hidden' : ''}`}
                onClick={() => handleGetMoreContents()}
              >
                Xem thêm
              </button>
              {additionalButton}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PostSugesstion;
