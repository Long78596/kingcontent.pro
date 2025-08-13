import { useCallback, useEffect, useState } from 'react';
import { confirmAlert } from 'react-confirm-alert';
import { FaMinusCircle, FaPlusCircle } from 'react-icons/fa';
import { ImSpinner } from 'react-icons/im';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {
  ACTION_RESET_VIDEO,
  actionAddChannel,
  actionChangeSearchType,
  actionGetDouyinVideosByChannel,
  actionRemoveChannel,
  actionUpdateCurrentVideoType,
} from '../../store/actions/douyin';
import { kFormatter } from '../../utils/utilityFunc';

const SingleChannel = ({ channel, isSearch = false, isSchedule = false }) => {
  const {
    id,
    display_name = '',
    feed_id = '',
    avatar,
    name = '',
    description = '',
    follower_count,
    likes,
    videos,
    sec_uid = '',
  } = channel;

  const [isNewChannel, setIsNewChannel] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [isUseAvatarLink, setIsUseAvatarLink] = useState(false);

  useEffect(() => {
    if (isSearch) {
      setIsUseAvatarLink(true);
    } else {
      // check if avatar is has link
      const isLink = avatar?.includes('https');
      setIsUseAvatarLink(isLink);
    }
  }, [avatar, isSearch]);

  const { followingChannels: channels = null } = useSelector(
    (state) => state.douyins
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (channels && channels.length > 0) {
      const index = channels.findIndex((item) => item.sec_uid == sec_uid);
      if (index > -1) {
        setIsNewChannel(false);
      }
    } else {
      setIsNewChannel(true);
    }
  }, [channels]);

  // function click to show channel videos
  const handleClickChannel = () => {
    dispatch({
      type: ACTION_RESET_VIDEO,
      payload: null,
    });
    dispatch(actionGetDouyinVideosByChannel(sec_uid));
    // set current video type
    dispatch(
      actionUpdateCurrentVideoType({
        type: 'channel',
        channel_id: sec_uid,
        name: `${display_name} (${name})`,
      })
    );
    dispatch(actionChangeSearchType('video'));
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
  }, [feed_id]);

  return (
    <div className="flex flex-col gap-2 p-2 mb-1 border-dashed border-b">
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
            src={isUseAvatarLink ? avatar : `data:image/png;base64,${avatar}`}
            title={name}
            alt=""
            className="w-14 h-14 rounded-full object-cover"
          />
          <div>
            <span className="font-bold text-ellipsis break-words">{name}</span>
            <p className="font-bold">{kFormatter(follower_count)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleChannel;
