import { FaMinusCircle, FaPencilAlt } from 'react-icons/fa';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { confirmAlert } from 'react-confirm-alert';
import { toast } from 'react-toastify';
import {
  actionGetCollectionDetail,
  actionRemoveCollection,
  actionSetCollectionModalOpen,
  actionSetCollectionType,
  actionSetCurrentCollection,
} from '../../store/actions/instagram';
import InstagramIcon from '../../assets/images/icon/main-menu/menu-icon-instagram.png';
import { convertInstagramLink } from '../../helpers';

const SingleCollection = ({ collection, isSchedule = false }) => {
  const {
    id,
    name = '',
    posts_count = 0,
    avatar: collAvatar = '',
  } = collection;
  const dispatch = useDispatch();

  const [avatar, setAvatar] = useState(InstagramIcon);

  useEffect(() => {
    if (collAvatar) {
      setAvatar(
        collAvatar?.includes('instagram')
          ? convertInstagramLink(collAvatar)
          : collAvatar
      );
    }
  }, [collAvatar]);

  const handleClickEditCollection = () => {
    dispatch(actionSetCurrentCollection(collection));
    dispatch(actionSetCollectionType('edit'));
    dispatch(actionSetCollectionModalOpen(true));
  };

  const onClickRemoveCollection = useCallback(
    (id) => {
      confirmAlert({
        title: 'Thông báo',
        message:
          'Khi xóa bộ sưu tập, các video đã lưu sẽ bị xoá theo. Bạn có chắc muốn thực hiện không?',
        buttons: [
          {
            label: 'Chắc chắn',
            onClick: async () => {
              dispatch(actionRemoveCollection(id));
            },
          },
          {
            label: 'Đổi ý',
            onClick: () => {},
          },
        ],
      });
    },
    [dispatch]
  );

  const onClickShowCollection = async () => {
    dispatch(actionSetCurrentCollection(collection));
    dispatch(actionGetCollectionDetail(id));
  };

  return (
    <div className="flex gap-3 p-2 mb-1 border-dashed border-b">
      {/* remove */}
      {!isSchedule && (
        <button
          className="btn btn-danger btn-sm btn-remove-channel"
          data-id={id}
          title="Xoá bộ sưu tập"
          onClick={() => onClickRemoveCollection(id)}
        >
          <FaMinusCircle size={32} color="red" />
        </button>
      )}
      <div
        className="collectionInfo flex items-center cursor-pointer gap-3 w-full"
        onClick={() => onClickShowCollection()}
      >
        <img
          src={avatar}
          alt=""
          title={name}
          className="w-14 h-14 rounded-full object-cover"
        />
        <div className="info">
          <div className="name">
            <span>{name}</span>
            <br />
            <strong>{posts_count}</strong> bài viết
          </div>
        </div>
      </div>
      {/* button edit */}
      {!isSchedule && (
        <button onClick={() => handleClickEditCollection()}>
          <FaPencilAlt size={16} />
        </button>
      )}
    </div>
  );
};

export default SingleCollection;
