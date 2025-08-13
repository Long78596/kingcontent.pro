import React from 'react';
import moment from 'moment';
import { AiFillFacebook } from 'react-icons/ai';
import { FaCheckCircle } from 'react-icons/fa';
import { getFanpageAvatar } from '../../../helpers';
import { formatUnixDate } from '../../../helpers/date';

function Header(props) {
  const {
    fanpageName,
    createdDate,
    fb_id,
    page = '',
    page_avatar = '',
    source_type = '',
  } = props;

  return (
    <div className="p-3 flex items-start justify-between ">
      <div className="w-12 h-12">
        <img
          className="w-full h-full object-cover rounded-full"
          src={page_avatar ? page_avatar : getFanpageAvatar(fb_id)}
          alt=""
        />
      </div>
      <div className="mx-3 flex flex-grow items-start flex-col">
        {page === 'ads' ? (
          <div>
            <h3
              className="text-sm font-semibold truncate w-32"
              style={{ color: page === 'ads' ? '#1e85be' : 'inherit' }}
            >
              {fanpageName}
            </h3>
            <p className="sponsored flex items-center gap-2 text-xs">
              <FaCheckCircle color="green" />
              <span>Được tài trợ</span>
            </p>
          </div>
        ) : page === 'preview' ? (
          <h3 className="text-sm text-blue-700 font-semibold truncate w-36">
            Tên người dùng/Trang/Nhóm
          </h3>
        ) : (
          <h3 className="text-sm text-blue-700 font-semibold truncate w-36">
            {fanpageName}
          </h3>
        )}
        <div className="w-full border-b flex-grow"></div>
        {page === 'ads' ? (
          <span className="m-1 px-1 text-xs text-gray-700 font-medium bg-blue-50">
            Ngày bắt đầu chạy: {formatUnixDate(createdDate, 'DD/MM/YYYY')}
          </span>
        ) : page === 'preview' ? (
          <span className="m-1 px-1 text-xs text-gray-700 font-medium bg-blue-50">
            Vừa xong
          </span>
        ) : page === 'specialFollowPage' ? (
          <span className="m-1 px-1 text-xs text-gray-700 font-medium bg-blue-50">
            {formatUnixDate(createdDate, 'DD/MM/YYYY')}
          </span>
        ) : (
          <span className="m-1 px-1 text-xs text-gray-700 font-medium bg-blue-50">
            {source_type === 'trend' || source_type === 'special'
              ? formatUnixDate(createdDate, 'DD/MM/YYYY')
              : 'Content tham khảo'}
          </span>
        )}
      </div>
      <span className="rounded-md flex items-center p-0 m-0">
        <AiFillFacebook className="h-8 w-8 text-editor-facebook " />
      </span>
    </div>
  );
}

export default Header;
