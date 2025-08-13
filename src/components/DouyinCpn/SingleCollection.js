import { FaMinusCircle, FaPencilAlt } from 'react-icons/fa';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import {
  actionGetDouyinVideosByCollection,
  actionRemoveCollection,
  actionUpdateCollectionModalOpen,
  actionUpdateCollectionModalType,
  actionUpdateCurrentCollection,
  actionUpdateCurrentVideoType,
} from '../../store/actions/douyin';
import { confirmAlert } from 'react-confirm-alert';
import { toast } from 'react-toastify';

const SingleCollection = ({ collection, isSchedule = false }) => {
  const {
    id,
    name = '',
    avatar = '',
    picture_url = '',
    videos_count = 0,
  } = collection;
  const dispatch = useDispatch();

  const handleClickEditCollection = () => {
    dispatch(actionUpdateCurrentCollection(collection));
    dispatch(actionUpdateCollectionModalOpen(true));
    dispatch(actionUpdateCollectionModalType('edit'));
  };

  const onClickRemoveCollection = (id) => {
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
  };

  const onClickShowCollection = async () => {
    if (videos_count === 0) {
      toast.info('Bạn chưa đưa video vào bộ sưu tập này');
      return;
    }
    await dispatch(actionGetDouyinVideosByCollection(id));
    // set current video type
    dispatch(
      actionUpdateCurrentVideoType({
        type: 'collection',
        name,
      })
    );
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
          src={
            picture_url.includes('https')
              ? picture_url
              : `data:image/png;base64,${picture_url}`
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
