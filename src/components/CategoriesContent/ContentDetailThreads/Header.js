import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { FaWindowClose } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import logo from '../../../assets/images/logo.jpg';
import { getFanpageAvatar } from '../../../helpers';

function Header(props) {
  const { user } = useSelector((state) => state.userReducer);

  const {
    fanpageId,
    fanpageName,
    created,
    writed,
    handelWritePost,
    closePopup,
    page_avatar = '',
    post_permalink = '',
    isCreatedContent = false,
  } = props;

  const [avatar, setAvatar] = useState('');
  const [destination, setDestination] = useState('');

  useEffect(() => {
    if (isCreatedContent) {
      setAvatar(
        `${
          user.facebook_id
            ? `https://graph.facebook.com/${user.facebook_id}/picture?width=1000&height=1000`
            : logo
        }`
      );
      setDestination(user.fb_name || `${user.first_name} ${user?.last_name}`);
    } else {
      setDestination(fanpageName);
      if (page_avatar) {
        setAvatar(page_avatar);
      } else {
        setAvatar(getFanpageAvatar(fanpageId));
      }
    }
  }, [page_avatar, fanpageId, isCreatedContent, user, logo, fanpageName]);

  return (
    <div className="p-3 flex items-start justify-between ">
      <div className="w-14 h-14">
        <img
          className="w-14 h-14 object-cover rounded-full"
          src={`https://v3.api.kingcontent.pro/api/v1/user/media/bypass-cors?url=${encodeURIComponent(
            avatar
          )}&type=image`}
          alt=""
        />
      </div>
      <div className="mx-3 flex flex-grow items-start flex-col">
        <h3 className=" text-sm text-blue-700 font-semibold">{destination}</h3>
        <div className="w-full border-b border-gray-200 flex-grow"></div>
        <span className="m-1 px-1 text-gray-700 font-medium bg-blue-50">
          {created ? moment.unix(created).format('DD/MM/YYYY') : 'Vừa xong'}
        </span>
      </div>
    </div>
  );
}

export default Header;
