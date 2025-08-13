import React, { useState, useEffect } from 'react';
import InstagramIcon from '../../assets/images/icon/main-menu/menu-icon-instagram.png';
import { convertInstagramLink } from '../../helpers';
import { useDispatch, useSelector } from 'react-redux';
import {
  actionSetCurrentUser,
  actionSaveUser,
  actionRemoveUser,
  actionSetCurrentCollection,
} from '../../store/actions/instagram';
import { ImPlay, ImSpinner } from 'react-icons/im';
import { FaMinusCircle, FaPlusCircle } from 'react-icons/fa';

const SingleUser = (props) => {
  const { index = 0, user, isSchedule = false } = props;
  const {
    desc = '',
    id = '',
    page_name = '',
    picture = '',
    username = '',
    instagram_id = '',
  } = user;

  const { savedUsers = null } = useSelector((state) => state.instagram);

  const dispatch = useDispatch();

  const [isAdding, setIsAdding] = useState(false);
  const [isNewUser, setIsNewUser] = useState(true);
  const [savedId, setSavedId] = useState(null);

  const handleUserClick = () => {
    dispatch(actionSetCurrentCollection(null));
    dispatch(actionSetCurrentUser(user));
  };

  const handleFollowUser = async () => {
    setIsAdding(true);
    await dispatch(actionSaveUser(user));
    setIsAdding(false);
  };

  const handleUnfollowUser = async () => {
    setIsAdding(true);
    await dispatch(actionRemoveUser(savedId ? savedId : id));
    setIsAdding(false);
  };

  useEffect(() => {
    if (savedUsers) {
      const found = savedUsers.find((item) => item.username === username);
      if (found) {
        setIsNewUser(false);
        setSavedId(found.id);
      } else {
        setSavedId(null);
        setIsNewUser(true);
      }
    }
  }, [savedUsers, username]);

  return (
    <div
      key={!index ? index : id}
      className="flex flex-col gap-2 p-2 mb-1 border-dashed border-b"
    >
      <div className="flex items-center gap-2">
        {!isSchedule && (
          <div className="action">
            {isNewUser ? (
              <button
                className="btn btn-success btn-sm"
                onClick={() => handleFollowUser()}
              >
                {isAdding ? (
                  <ImSpinner className="animate-spin text-primary" size={32} />
                ) : (
                  <FaPlusCircle size={32} className="text-primary" />
                )}
              </button>
            ) : (
              <>
                {isAdding ? (
                  <button className="btn btn-danger btn-sm">
                    <ImSpinner
                      className="animate-spin text-primary"
                      size={32}
                    />
                  </button>
                ) : (
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleUnfollowUser()}
                  >
                    <FaMinusCircle size={32} color="red" />
                  </button>
                )}
              </>
            )}
          </div>
        )}
        <div
          className="userDetail flex gap-3 items-center cursor-pointer w-full"
          onClick={() => handleUserClick()}
        >
          <img
            crossOrigin="anonymous"
            src={convertInstagramLink(picture, true) || InstagramIcon}
            title={page_name}
            alt=""
            className="w-14 h-14 rounded-full object-cover"
          />
          <div>
            <h3 className="text-sm font-bold">{username}</h3>
            <p className="text-sm text-gray-500">{page_name}</p>
            <p className="font-bold">{desc}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleUser;
