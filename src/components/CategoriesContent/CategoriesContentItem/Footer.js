import React, { useState, useEffect, useRef } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import { AiOutlineLike } from 'react-icons/ai';
import { FaRegCommentDots, FaRegShareSquare } from 'react-icons/fa';
import { RiHeart3Line } from 'react-icons/ri';
import { AiFillHeart } from 'react-icons/ai';
import HashtagsSearch from '../../ContentLiked/HashtagsSearch';
import styled from 'styled-components';
import { kFormatter } from '../../../utils/utilityFunc';
const TextStyle = styled.p`
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-size: 1rem !important;
`;
function Footer(props) {
  const dispatch = useDispatch();

  const { likes, comments, shares, page, hashtag, handleAction } = props;
  let FooterList = [
    { icon: AiOutlineLike, total: likes },
    { icon: FaRegCommentDots, total: comments },
    { icon: FaRegShareSquare, total: shares },
  ];
  let row = (
    <div className="flex items-center  ">
      <RiHeart3Line className="w-12 h-12 " />
      <span className="w-full h-full inset-0 text-center align-middle text-base font-medium">
        1
      </span>
    </div>
  );
  const ref = useRef(null);
  const [isShowHashtag, setIsShowHashtag] = useState(false);

  useEffect(() => {
    if (page === 'contentLikedPage' || page === 'specialFollowPage') {
      const handleClickOutside = (event) => {
        if (ref.current && !ref.current.contains(event.target)) {
          setIsShowHashtag(false);
        }
      };
      document.addEventListener('click', handleClickOutside, true);
      return () => {
        document.removeEventListener('click', handleClickOutside, true);
      };
    }
  }, [page]);

  const onShowHashtag = () => {
    if (page === 'contentLikedPage' || page === 'specialFollowPage') {
      handleAction && handleAction('EDIT_TAG');
    }
  };


  return (
    <div className="mt-0.5 px-3 flex items-center justify-between rounded-b-lg bg-white shadow-sm">
      <div className="flex justify-between gap-5 items-center py-3">
        {FooterList.map((item, index) => (
          <div className="flex items-center gap-1" key={index}>
            <item.icon id="content-like" className="h-6 w-6 text-gray-400" />
            <label
              htmlFor="content-like"
              className="text-base text-gray-800 font-medium"
            >
              {kFormatter(item?.total || 0)}
            </label>
          </div>
        ))}
      </div>
      {row}
    </div>
  );
}

export default Footer;
