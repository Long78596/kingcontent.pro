import React from 'react';
import { AiOutlineLike } from 'react-icons/ai';
import { FaRegCommentDots, FaRegShareSquare } from 'react-icons/fa';
import { RiHeart3Line } from 'react-icons/ri';
import { kFormatter } from '../../../utils/utilityFunc';

function Footer(props) {
  const { likes, comments, shares } = props;
  let FooterList = [
    { icon: AiOutlineLike, total: likes },
    { icon: FaRegCommentDots, total: comments },
    { icon: FaRegShareSquare, total: shares },
  ];
  return (
    <div className="mt-5 px-5 flex items-center justify-between rounded-b-md border-t border-gray-300 bg-white shadow-sm">
      {FooterList.map((item, index) => (
        <div className="flex items-center mr-5" key={index}>
          <item.icon id="content-like" className="h-6 w-6 text-gray-400" />
          <label
            htmlFor="content-like"
            className="ml-1 text-base text-gray-800 font-medium"
          >
            {kFormatter(item.total)}
          </label>
        </div>
      ))}
      {/* <div className="flex items-center cursor-pointer ">
        <RiHeart3Line className="w-12 h-12 " />
        <span className="w-full h-full inset-0 text-center align-middle text-base font-medium">
          1
        </span>
      </div> */}
    </div>
  );
}

export default Footer;
