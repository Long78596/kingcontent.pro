import moment from 'moment';
import React, { useState } from 'react';
import { confirmAlert } from 'react-confirm-alert';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import CommentIcon from '../../assets/images/icon/comment.png';
import LikeIcon from '../../assets/images/icon/like.png';
import ShareIcon from '../../assets/images/icon/share.png';
import CalendarIcon from '../../assets/images/option-icon/calendar.png';
import EditIcon from '../../assets/images/option-icon/edit.png';
import UnfollowIcon from '../../assets/images/option-icon/unfollow.png';
import ViewIcon from '../../assets/images/option-icon/view.png';
import PopupDetailContentPlan from '../../pages/createPost/components/planCpn/popupDetail';
import {
  setCurrentDateTime,
  setIsShowFinalStep,
  setSelectedScheduleContent,
  setShowSourceIdeasPopup,
} from '../../store/actions/Schedules';
import { actionPushContentToCreateContentScreen } from '../../store/actions/homepage';
import Client from '../../Client';
import { actionGetAllContent } from '../../store/actions/contentUserLiked';
import Image from '../CategoriesContent/CategonesContentltem/Image';
import { OK } from '../../configs';
export const CardStyled = styled.div`
  .divide-title {
    height: 1px;
  }
  .card-detail {
    position: relative;
  }
  .card-detail:hover .card-action {
    display: flex;
    justify-content: center;
    text-align: left;
    transition: 2s ease-in-out;
  }
  .card-action {
    display: none;
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0.97;
  }
`;

const Card = ({ contents, setIsOpen, setItem }) => {
  const [isOpen, setiIsOpen] = useState(false);
  const [itemView, setItemView] = useState({});
  const dispatch = useDispatch();
  const history = useHistory();

  const handleWriteContent = (item) => {
    history.push('/tao-content');
    const postText = item?.post_text || '';
    let medias = item?.medias || [];
    const mediaType = item?.media_type || 'text';
    if (mediaType === 'video') {
      if (item?.media_url) {
        medias = [
          {
            type: 'video',
            url: item?.media_url,
          },
        ];
      }
    }
    dispatch(
      actionPushContentToCreateContentScreen(
        postText,
        medias,
        mediaType,
        item?.wishlist === 1 ? true : false
      )
    );
  };

  const handelActionSchedule = (item) => {
    dispatch(
      setSelectedScheduleContent({
        ...item,
        source_type: 'system',
      })
    );
    dispatch(setCurrentDateTime());
    dispatch(setIsShowFinalStep(true));
    dispatch(setShowSourceIdeasPopup(false));
    history.push('/lich-dang-bai');
  };

  const handelDislike = (id) => {
    confirmAlert({
      title: 'Thông báo',
      message: 'Bạn có muốn bỏ thích content này?',
      buttons: [
        {
          label: 'Có',
          onClick: async () => {
            const res = await Client.delete(`/liked-data/${id}`);
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
  };
  return (
    <CardStyled className="grid gap-x-2 gap-y-4 grid-cols-3">
      {contents &&
        contents.length > 0 &&
        contents.map((_elt, index) => (
          <div
            key={index}
            className={`${
              _elt.medias.length === 0 ? 'hidden' : ''
            } rounded-lg border w-full
             bg-white mx-2 md:mx-0 lg:mx-0 card-detail p-3 shadow-lg hover:ease-in-out hover:delay-300`}
          >
            <div className="pr-3 pl-3 pt-3 ">
              <div className="flex items-center w-full">
                <div className="rounded-full h-8 w-8 bg-gray-500 flex items-center justify-center">
                  <img
                    src={`${`https://graph.facebook.com/${_elt?.feed_id}/picture?width=200&height=200`} `}
                    className="w-14 h-14 mt-2 float-left rounded-full"
                  />
                </div>
                <div className="flex flex-col w-full">
                  <span className="pt-1 ml-2 font-bold text-base">
                    {_elt?.user_screenname}
                  </span>
                  <span className="w-full divide-title bg-gray-200 mt-1 ml-1"></span>
                  <span className="pt-1 ml-2 text-sm">
                    {moment(_elt?.updated).format('DD-MM-YYYY')}
                  </span>
                </div>
              </div>
              <span className="px-2 hover:bg-gray-300 cursor-pointer rounded">
                <i className="fas fa-ellipsis-h pt-2 text-base" />
              </span>
            </div>
            <div>
              <div className="text-sm min-h-[20px]">{_elt?.content}</div>
            </div>
            <Image medias={_elt?.medias} contentType={_elt?.contentType} />
            <div className="flex justify-between p-3 items-center">
              <div className="gap-2 flex items-center">
                <img src={LikeIcon} alt="" className="w-6" />
                <span>{_elt?.likes}</span>
              </div>
              <div className="gap-2 flex items-center">
                <img src={CommentIcon} alt="" className="w-6" />
                <span>{_elt?.comments}</span>
              </div>
              <div className="gap-2 flex items-center">
                <img src={ShareIcon} alt="" className="w-6" />
                <span>{_elt?.shares}</span>
              </div>
              {/* <div>
                <button className="bg-indigo-500 rounded-lg shadow-md text-white p-1">
                  Hashtag
                </button>
              </div> */}
            </div>
            <div className="card-action bg-gray-300 w-full h-full transition-all">
              <div className="flex justify-center items-center flex-col">
                <div>
                  <div
                    className="flex gap-2 items-center text-base mb-3 cursor-pointer hover:text-red-500"
                    onClick={() => {
                      setItemView(_elt);
                      setiIsOpen(true);
                    }}
                  >
                    <span>
                      <img
                        src={ViewIcon}
                        alt=""
                        className="w-12 bg-white rounded-full"
                      />
                    </span>
                    <button className="">Xem chi tiết</button>
                  </div>
                  <div
                    className="flex gap-2 items-center text-base mb-3 cursor-pointer hover:text-red-500"
                    onClick={() => handleWriteContent(_elt)}
                  >
                    <img
                      src={EditIcon}
                      alt=""
                      className="w-12 bg-white rounded-full"
                    />

                    <button className="">Soạn thảo</button>
                  </div>
                  <div
                    className="flex gap-2 items-center text-base mb-3 cursor-pointer hover:text-red-500"
                    onClick={() => handelActionSchedule(_elt)}
                  >
                    <img
                      src={CalendarIcon}
                      alt=""
                      className="w-12 bg-white rounded-full"
                    />
                    <button className="">Lên lịch</button>
                  </div>
                  <div
                    className="flex gap-2 items-center text-base mb-3 cursor-pointer hover:text-red-500"
                    onClick={() => handelDislike(_elt?.contentId)}
                  >
                    <img
                      src={UnfollowIcon}
                      alt=""
                      className="w-12 bg-white rounded-full"
                    />
                    <button>Bỏ thích</button>
                  </div>
                  {/* <div
                    className="flex gap-2 items-center text-base  cursor-pointer hover:text-red-500"
                    onClick={handelDislike}
                  >
                    <img
                        src={EditIcon}
                        alt=""
                        className="w-12 bg-white rounded-full"
                      />
                    <button>Thay đổi Hashtag</button>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        ))}

      <PopupDetailContentPlan
        isOpen={isOpen}
        item={itemView}
        setIsOpenDetail={setiIsOpen}
        showTool={false}
      />
    </CardStyled>
  );
};

export default Card;
