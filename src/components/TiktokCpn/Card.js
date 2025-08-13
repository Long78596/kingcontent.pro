import moment from 'moment';
import React, { useState } from 'react';
import {
  FaCalendar,
  FaComment,
  FaEye,
  FaPen,
  FaShare,
  FaThumbsDown,
  FaThumbsUp,
} from 'react-icons/fa';
import styled from 'styled-components';
import EditIcon from '../../assets/images/option-icon/edit.png';
import ViewIcon from '../../assets/images/option-icon/view.png';

import CalendarIcon from '../../assets/images/option-icon/calendar.png';
import UnfollowIcon from '../../assets/images/option-icon/unfollow.png';
import ShareIcon from '../../assets/images/icon/share.png';
import LikeIcon from '../../assets/images/icon/like.png';
import CommentIcon from '../../assets/images/icon/comment.png';
import Image from '../CategoriesContent/CategonesContentltem/Image';

export const CardStyled = styled.div`
  .divide-title {
    height: 1px;
  }
  .card-detail {
    position: relative;
  }
  .text-content {
    height: 80px;
    transition: 0.2s;
    overflow: hidden;
  }
  .card-detail:hover .text-content {
    height: 100%;
    transition: 4s;
  }
`;
const Card = ({ content }) => {
  return (
    <CardStyled className="grid grid-cols-12 px-18 gap-5">
      {content.map((_elt, index) => {
        const thumb =
          _elt?.videos.length !== 0
            ? _elt?.videos.map((_elt) => _elt.thumb)
            : null;
        return (
          <div
            key={index}
            className="rounded-lg overflow-hidden border w-full lg:col-span-4 md:col-span-1 bg-white mx-3 md:mx-0 lg:mx-0 card-detail p-3 shadow-lg hover:ease-in-out hover:delay-300"
          >
            <div className="pr-3 pl-3 pt-3 ">
              <div className="flex items-center w-full">
                <div className="rounded-full h-8 w-8 bg-gray-500 flex items-center justify-center overflow-hidden">
                  <img
                    src={_elt?.page_picture}
                    alt="profilepic"
                    className="rounded-md"
                  />
                </div>
                <div className="flex flex-col w-full">
                  <span className="pt-1 ml-2 text-sm">{_elt?.page_name}</span>
                  <span className="w-full divide-title bg-gray-200 mt-1 ml-1"></span>
                  <span className="pt-1 ml-2 text-sm">
                    {moment(_elt?.timestamp).format('DD-MM-YYYY')}
                  </span>
                </div>
              </div>
              <span className="px-2 hover:bg-gray-300 cursor-pointer rounded">
                <i className="fas fa-ellipsis-h pt-2 text-base" />
              </span>
            </div>
            <div>
              <p
                className={`text-content mb-2 text-sm`}
                dangerouslySetInnerHTML={{ __html: _elt?.post_text }}
              ></p>
            </div>
            <Image
              medias={_elt?.images.length === 0 ? thumb : _elt?.images}
              contentType={_elt?.images.length === 0 ? 'video' : ''}
            />
          </div>
        );
      })}
    </CardStyled>
  );
};

export default Card;
