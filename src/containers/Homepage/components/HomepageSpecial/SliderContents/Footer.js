import React from 'react';
import { AiOutlineLike } from 'react-icons/ai';
import { FaRegCommentDots, FaRegShareSquare } from 'react-icons/fa';
import { RiHeart3Line } from 'react-icons/ri';
import { kFormatter } from '../../../../../utils/utilityFunc'


function Footer(props) {
  const { likes, comments, shares , heart = true , className = 'justify-between' , height = 'h-5' , width = 'w-5' } = props;
  let FooterList = [
    { icon: AiOutlineLike, total: likes },
    { icon: FaRegCommentDots, total: comments },
    { icon: FaRegShareSquare, total: shares },
  ];   
  return (
    <div className={`px-3 flex items-center ${className} w-full`}>
      <div className="flex items-center justify-between w-full">
        {FooterList.map((item, index) => (
          <div className="flex items-center mr-2" key={index}>
            <item.icon id="content-like" className={`text-gray-400 ${height} ${width}`} />
            <label
              htmlFor="content-like"
              className="ml-1 text-xs text-gray-800 font-medium"
            >
              {kFormatter(item.total)}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Footer;
