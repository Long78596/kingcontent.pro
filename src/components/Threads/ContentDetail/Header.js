import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { FaWindowClose } from 'react-icons/fa';
import { convertInstagramLink } from '../../../helpers';
import { useSelector } from 'react-redux';
import threadsIcon from '../../../assets/images/icon/main-menu/threads.png';
function Header(props) {
  const {
    closePopup,
    userId,
    displayName,
    userPicture,
    created,
    postLink = '',
  } = props;

  return (
    <div className="p-3 flex items-start justify-between ">
      <div className="w-14 h-14">
        <img
          className="w-full h-full object-cover rounded-full"
          src={convertInstagramLink(userPicture)}
          alt={displayName}
        />
      </div>
      <div className="mx-3 flex flex-grow items-start flex-col">
        <h3 className=" text-sm text-blue-700 font-semibold">{displayName}</h3>
        <div className="w-full border-b border-gray-200 flex-grow"></div>
        <span className="m-1 px-1 text-gray-700 font-medium bg-blue-50">
          {created ? moment.unix(created).format('DD/MM/YYYY') : 'Vừa xong'}
        </span>
      </div>
      <div className="flex gap-2">
        <span
          className="rounded-md flex items-center p-0 m-0 cursor-pointer"
          onClick={closePopup}
        >
          <FaWindowClose
            style={{ width: '32px', height: '32px' }}
            color="red"
          />
        </span>
        <a href={postLink} target="_blank">
          <span className="rounded-md flex items-center p-0 m-0">
            <img src={threadsIcon} alt="" />
          </span>
        </a>
      </div>
    </div>
  );
}

export default Header;
