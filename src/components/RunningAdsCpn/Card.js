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
import SingleContent from '../CategoriesContent/';

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
      {content.map((_elt, index) => (
        <div
          className="rounded-lg overflow-hidden border w-full lg:col-span-4 md:col-span-1 bg-white mx-3 md:mx-0 lg:mx-0 card-detail p-3 shadow-lg hover:ease-in-out hover:delay-300"
          key={index}
        >
          <SingleContent itemData={_elt} />
        </div>
      ))}
    </CardStyled>
  );
};

export default Card;
