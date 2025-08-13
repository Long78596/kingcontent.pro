import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { AiFillFacebook } from 'react-icons/ai';
import { FaWindowClose } from 'react-icons/fa';
import { getFanpageAvatar } from '../../../helpers';
import { useSelector } from 'react-redux';
import logo from '../../../assets/images/logo.jpg';

function Header(props) {
  const { user } = useSelector((state) => state.userReducer);

  const {
    fanpageId,
    fanpageName,
    createdAt,
    writed,
    handelWritePost,
    closePopup,
    page_avatar = '',
    post_permalink = '',
    isCreatedContent = false,
    source_type = '',
  } = props;

  const [avatar, setAvatar] = useState('');
  const [destination, setDestination] = useState('');

  useEffect(() => {
    if (isCreatedContent) {
      setAvatar(
        `${
          user?.facebook_id
            ? `https://graph.facebook.com/${user?.facebook_id}/picture?width=1000&height=1000`
            : logo
        }`
      );
      setDestination(user?.fb_name || `${user?.first_name} ${user?.last_name}`);
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
          className="w-full h-full object-cover rounded-full"
          src={avatar}
          alt=""
        />
      </div>
      <div className="mx-3 flex flex-grow items-start flex-col">
        <h3 className=" text-sm text-blue-700 font-semibold">{destination}</h3>
        <div className="w-full border-b border-gray-200 flex-grow"></div>
        <span className="m-1 px-1 text-xs text-gray-700 font-medium bg-blue-50">
          {source_type === 'trend' || source_type === 'special'
            ? moment.unix(createdAt).format('DD/MM/YYYY')
            : 'Content tham khảo'}
        </span>
      </div>
      <div className="flex gap-2">
        {writed && (
          <span
            className="rounded-md flex items-center p-0 m-0 cursor-pointer"
            onClick={handelWritePost}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              version="1"
              viewBox="0 0 512 512"
            >
              <path
                d="M925 4923c-368-79-655-370-730-738-14-72-15-241-13-1660l3-1580 23-74c103-334 339-568 668-663l79-23h3210l79 23c331 96 572 337 668 668l23 79v3210l-23 79c-95 329-329 565-663 668l-74 23-1590 2c-1383 1-1599 0-1660-14zm3159-273c301-44 527-272 566-572 13-97 13-2939 0-3036-20-153-89-291-198-394-107-100-223-157-368-178-94-13-2954-13-3048 0-298 43-523 268-566 566-14 99-14 2947 1 3050 6 43 22 107 35 143 83 219 289 387 516 420 89 12 2974 13 3062 1z"
                transform="matrix(.1 0 0 -.1 0 512)"
              ></path>
              <path
                d="M2925 3926c-84-20-141-46-210-99-33-25-333-319-667-654-474-474-611-618-627-653-10-25-38-157-61-294-39-226-42-253-31-302 25-110 123-204 229-220 68-10 527 68 590 100 62 32 1306 1278 1347 1349 91 159 92 378 2 527-93 156-245 247-427 256-52 2-108-2-145-10zm181-281c105-31 168-115 168-225 0-87-20-123-136-237l-93-93-168 168-168 168 104 101c84 82 114 105 153 117 63 19 80 19 140 1zm-426-590l164-164-364-368c-200-202-384-389-409-415l-46-48-205-40c-112-22-205-38-207-37-1 2 13 95 32 207l34 204 413 413c227 227 415 413 418 413s79-74 170-165zM1423 1441c-87-54-83-199 6-246 26-13 123-15 786-15 845 0 792-4 834 70 36 64 24 126-34 180l-27 25-766 3c-747 2-768 2-799-17zM3432 1440c-90-55-95-163-11-235 32-26 33-26 165-23 131 3 133 3 163 32 56 54 64 134 20 190-37 47-68 56-191 56-95 0-118-3-146-20z"
                transform="matrix(.1 0 0 -.1 0 512)"
              ></path>
            </svg>
          </span>
        )}

        <span
          className="rounded-md flex items-center p-0 m-0 cursor-pointer"
          onClick={closePopup}
        >
          <FaWindowClose
            style={{ width: '32px', height: '32px' }}
            color="red"
          />
        </span>
        <a href={post_permalink} target="_blank">
          <span className="rounded-md flex items-center p-0 m-0">
            <AiFillFacebook
              style={{ width: '36px', height: '36px' }}
              className="text-editor-facebook"
            />
          </span>
        </a>
      </div>
    </div>
  );
}

export default Header;
