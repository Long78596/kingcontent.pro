import { FaMinusCircle, FaPencilAlt } from 'react-icons/fa';
import logoTikTok from '../../assets/images/icon/main-menu/menu-icon-tiktok.png';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import {
  actionGetTiktokVideosByCollection,
  actionRemoveCollection,
  actionUpdateCollectionModalOpen,
  actionUpdateCollectionModalType,
  actionUpdateCurrentCollection,
  actionUpdateCurrentVideoType,
} from '../../store/actions/tiktok';
import { confirmAlert } from 'react-confirm-alert';
import { toast } from 'react-toastify';

const SingleCollection = ({ collection, isSchedule = false }) => {
  const {
    id,
    name = '',
    avatar = '',
    avatar_url = '',
    videos_count = 0,
  } = collection;
  const dispatch = useDispatch();

  const handleClickEditCollection = useCallback(() => {
    dispatch(actionUpdateCurrentCollection(collection));
    dispatch(actionUpdateCollectionModalOpen(true));
    dispatch(actionUpdateCollectionModalType('edit'));
  }, [collection, dispatch]);

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
              await dispatch(actionRemoveCollection(id));
              toast.success('Xoá bộ sưu tập thành công !');
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

  const onClickShowCollection = useCallback(async () => {
    await dispatch(actionGetTiktokVideosByCollection(id));
    // set current video type
    dispatch(
      actionUpdateCurrentVideoType({
        type: 'collection',
        name,
      })
    );
  }, [dispatch, id, name]);

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
          src={
            avatar_url?.includes('https')
              ? avatar_url
              : `data:image/png;base64,${avatar_url}`
          }
          title={name}
          alt=""
          className="w-14 h-14 rounded-full object-cover"
        />
        <div className="info">
          <div className="name">
            <span>{name}</span>
            <br />
            <strong>{videos_count}</strong> video
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
