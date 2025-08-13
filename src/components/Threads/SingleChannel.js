import { useCallback, useEffect, useState } from 'react';
import { confirmAlert } from 'react-confirm-alert';
import { FaMinusCircle, FaPlusCircle } from 'react-icons/fa';
import { ImSpinner } from 'react-icons/im';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {
  ACTION_FILTER_STATUS_VIDEOS_SUCCESS,
  actionAddChannel,
  actionChangeSearchType,
  actionGetThreadsVideosByChannel,
  actionRemoveChannel,
  actionUpdateCurrentVideoType,
} from '../../store/actions/threads';
import { kFormatter } from '../../utils/utilityFunc';
import { convertInstagramLink } from '../../helpers';

const SingleChannel = ({
  key = 0,
  channel,
  isSearch = false,
  isSchedule = false,
}) => {
  const {
    id,
    picture,
    username = '',
    page_name,
    follower_count,
    sec_uid = '',
    pk,
  } = channel;

  const [isNewChannel, setIsNewChannel] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [isUseAvatarLink, setIsUseAvatarLink] = useState(false);

  const {
    followingChannels: channels = null,
    isLoading = false,
    nextIsLoading = false,
  } = useSelector((state) => state.threads);

  const dispatch = useDispatch();

  useEffect(() => {
    if (channels && channels.length > 0) {
      const index = channels.findIndex((item) => item.pk == pk);
      if (index > -1) {
        setIsNewChannel(false);
      }
    } else {
      setIsNewChannel(true);
    }
  }, [channels]);

  // function click to show channel videos
  const handleClickChannel = () => {
    if (isLoading || nextIsLoading) {
      toast.info('Đang tải dữ liệu, vui lòng chờ trong giây lát');
      return;
    }
    dispatch(actionGetThreadsVideosByChannel(pk));
    // set current video type
    dispatch(
      actionUpdateCurrentVideoType({
        type: 'channel',
        channel_id: pk,
        name: `${username} (${page_name})`,
      })
    );
    dispatch(actionChangeSearchType('video'));
    dispatch({
      type: ACTION_FILTER_STATUS_VIDEOS_SUCCESS,
      payload: false,
    });
  };

  const handleFollowChannel = useCallback(async () => {
    setIsAdding(true);
    await dispatch(actionAddChannel(channel));
    setIsAdding(false);
    toast.success('Đã thêm kênh thành công');
  }, [channel]);

  const handleUnfollowChannel = useCallback(() => {
    confirmAlert({
      title: 'Xác nhận',
      message: 'Bạn có chắc chắn muốn hủy theo dõi kênh này không?',
      buttons: [
        {
          label: 'Chắc chắn',
          onClick: async () => {
            setIsAdding(true);
            await dispatch(actionRemoveChannel(id));
            setIsAdding(false);
            setIsNewChannel(true);
            toast.success('Đã hủy theo dõi kênh thành công');
          },
        },
        {
          label: 'Quay lại',
          onClick: () => {},
        },
      ],
    });
  }, [id]);

  return (
    <div
      key={!key ? key : id}
      className="flex flex-col gap-2 p-2 mb-1 border-dashed border-b"
    >
      <div className="flex items-center gap-2">
        {!isSchedule && (
          <div className="action">
            {isNewChannel ? (
              <button
                className="btn btn-success btn-sm"
                onClick={() => handleFollowChannel()}
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
                    onClick={() => handleUnfollowChannel()}
                  >
                    <FaMinusCircle size={32} color="red" />
                  </button>
                )}
              </>
            )}
          </div>
        )}
        <div
          className="channelDetail flex gap-3 items-center cursor-pointer w-full"
          onClick={handleClickChannel}
        >
          <img
            src={convertInstagramLink(picture)}
            alt={page_name}
            className="w-14 h-14 rounded-full object-cover"
          />
          <div>
            <h3 className="text-sm font-bold">{username}</h3>
            <p className="text-sm text-gray-500">{page_name}</p>
            <p className="font-bold">{kFormatter(follower_count)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleChannel;
