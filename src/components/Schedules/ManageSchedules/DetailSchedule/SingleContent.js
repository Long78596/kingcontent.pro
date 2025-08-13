import React, { useEffect, useState } from 'react';
import { formatDate } from '../../../../helpers/date';
import { Link } from '@mui/material';
import { FaEye, FaFacebook } from 'react-icons/fa';
import { ImFacebook } from 'react-icons/im';
import { getScheduleSourceLink } from '../../../../helpers';
import pauseIcon from '../../../../assets/images/icon/schedules/pause.png';
import playIcon from '../../../../assets/images/icon/schedules/play.png';
import binIcon from '../../../../assets/images/icon/schedules/bin.png';
import { FiPlayCircle } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { MANAGE_GET_SCHEDULE_CONTENTS_SUCCESS } from '../../../../store/types/schedules';
import { confirmAlert } from 'react-confirm-alert';
import {
  removeScheduleContents,
  updateScheduleContentsStatus,
} from '../../../../store/actions/Schedules';
import logoTikTok from '../../../../assets/images/icon/main-menu/menu-icon-tiktok.png';
import douyinLogo from '../../../../assets/images/icon/main-menu/douyin.png';
import InstagramLogo from '../../../../assets/images/icon/main-menu/menu-icon-instagram.png';
import ThreadsLogo from '../../../../assets/images/threads-thumbnail.png';
import FacebookIcon from '../../../../assets/images/icon/facebook.png';

const SingleContent = (props) => {
  const { content, index, listSelected, setListSelected } = props;
  const {
    thumbnail = '',
    replaced_post_text = '',
    feed_name = '',
    date_publish = '',
    media_type = '',
    publish_url = '',
    status = 0,
    destination_id = '',
    destination_name = '',
    content_id = '',
    source_type = '',
    source_content = '',
    created = '',
    id,
    error_count = 0,
    reason = '',
    type = 'fanpage',
  } = content;
  const { manageScheduleContents = null } = useSelector(
    (state) => state.schedules
  );
  const dispatch = useDispatch();

  const [isChecked, setIsChecked] = useState(false);
  const [sourceLogo, setSourceLogo] = useState('');
  const [sourceName, setSourceName] = useState('');
  const [isFb, setIsFb] = useState(false);
  const [destinationUrl = '', setDestinationUrl] = useState('');

  useEffect(() => {
    switch (type) {
      case 'threads':
        setDestinationUrl(`https://threads.net/@${destination_id}`);
        break;

      case 'tiktok':
        setDestinationUrl(`https://tiktok.com/@${destination_id}`);
        break;

      default:
        setDestinationUrl(`https://facebook.com/${destination_id}`);
        break;
    }
  }, [destination_id, type]);

  useEffect(() => {
    if (source_type) {
      switch (source_type) {
        case 'tiktok':
          setSourceLogo(logoTikTok);
          setSourceName('TikTok');
          setIsFb(false);
          break;

        case 'douyin':
          setSourceLogo(douyinLogo);
          setSourceName('Douyin');
          setIsFb(false);
          break;

        case 'threads':
          setSourceLogo(ThreadsLogo);
          setSourceName('Threads');
          setIsFb(false);
          break;

        case 'instagram':
          setSourceLogo(InstagramLogo);
          setSourceName('Instagram');
          setIsFb(false);
          break;

        case 'user':
          setSourceLogo('');
          setSourceName('Tự soạn');
          setIsFb(false);
          break;

        case 'chatgpt':
          setSourceLogo('');
          setSourceName('ChatGPT');
          setIsFb(false);
          break;

        default:
          setSourceLogo(FacebookIcon);
          setSourceName('Khác');
          setIsFb(true);
          break;
      }
    }
  }, [source_type]);

  useEffect(() => {
    if (listSelected) {
      const isExist = listSelected.find((item) => item.id === id);
      setIsChecked(isExist ? true : false);
    }
  }, [listSelected]);

  const onCheck = (e) => {
    if (e.target.checked) {
      setListSelected([...listSelected, content]);
    } else {
      const newList = listSelected.filter((item) => item.id !== id);
      setListSelected(newList);
    }
  };

  const handlePause = () => {
    confirmAlert({
      title: 'Tạm dừng đăng bài',
      message: 'Bạn có chắc chắn muốn tạm dừng bài viết?',
      buttons: [
        {
          label: 'Đồng ý',
          onClick: () => {
            dispatch(updateScheduleContentsStatus(0, [id], 3));
            // update status of these contents from reducer
            const newContents = manageScheduleContents.map((content) => {
              if (id === content.id) {
                return {
                  ...content,
                  status: 3,
                };
              }
              return content;
            });
            dispatch({
              type: MANAGE_GET_SCHEDULE_CONTENTS_SUCCESS,
              payload: newContents,
            });
          },
        },
        {
          label: 'Hủy',
          onClick: () => {},
        },
      ],
    });
  };

  const handlePlay = () => {
    confirmAlert({
      title: 'Tiếp tục đăng bài',
      message: 'Bạn có chắc chắn muốn tiếp tục đăng bài viết?',
      buttons: [
        {
          label: 'Đồng ý',
          onClick: () => {
            dispatch(updateScheduleContentsStatus(0, [id], 2));
            // update status of these contents from reducer
            const newContents = manageScheduleContents.map((content) => {
              if (id === content.id) {
                return {
                  ...content,
                  status: 2,
                };
              }
              return content;
            });
            dispatch({
              type: MANAGE_GET_SCHEDULE_CONTENTS_SUCCESS,
              payload: newContents,
            });
          },
        },
        {
          label: 'Hủy',
          onClick: () => {},
        },
      ],
    });
  };

  const handleDelete = () => {
    confirmAlert({
      title: 'Xóa bài đăng',
      message:
        'Bạn có chắc chắn muốn xóa bài viết? Dữ liệu đã xóa không thể khôi phục.',
      buttons: [
        {
          label: 'Đồng ý',
          onClick: () => {
            dispatch(removeScheduleContents([id]));
            // remove these contents from reducer
            const newContents = manageScheduleContents.filter(
              (content) => content.id !== id
            );
            dispatch({
              type: MANAGE_GET_SCHEDULE_CONTENTS_SUCCESS,
              payload: newContents,
            });
          },
        },
        {
          label: 'Hủy',
          onClick: () => {},
        },
      ],
    });
  };

  const renderStatus = (status, publish_url = '', error_count, reason) => {
    switch (status) {
      case 1:
      case 5:
        return (
          <div className="flex gap-2 items-center justify-center">
            <Link
              href={publish_url}
              target="_blank"
              className="text-base no-underline w-40"
            >
              <span className="bg-greenSuccess p-2 my-0.5 w-40 inline-block rounded-md font-medium text-white">
                Thành công
              </span>
            </Link>
          </div>
        );

      case 2:
        return error_count > 2 ? (
          <span
            className="bg-red-500 p-2 my-0.5 w-40 inline-block rounded-md font-medium text-white"
            title={reason}
          >
            Đã có lỗi
          </span>
        ) : (
          <span className="bg-yellow-500 p-2 my-0.5 w-40 inline-block rounded-md font-medium text-white">
            Đang chờ đăng
          </span>
        );

      case 3:
        return (
          <span className="bg-red-500 p-2 my-0.5 w-40 inline-block rounded-md font-medium text-white">
            Đang tạm dừng
          </span>
        );

      default:
        return <></>;
    }
  };

  return (
    <div
      key={index}
      className="single-content w-full flex flex-nowrap my-2 p-2 items-center gap-2 border-b border-dashed border-gray-500 text-center"
    >
      <div className="">
        <input
          type="checkbox"
          className="w-5 h-5"
          title="Chọn bài viết"
          checked={isChecked}
          onChange={onCheck}
        />
      </div>
      <div className="w-3/12 text-left overflow-hidden">
        <div className="flex gap-2 items-center">
          <div
            className="relative w-16 h-16 rounded-md bg-cover bg-no-repeat bg-center"
            style={{
              backgroundImage: `url(${
                thumbnail ? thumbnail : source_content?.medias[0]
              })`,
            }}
          >
            {media_type === 'video' && (
              <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center z-10">
                <div className="w-6 h-6 bg-gray-400 rounded-full opacity-50">
                  <FiPlayCircle className="w-full h-full text-white" />
                </div>
              </div>
            )}
            {media_type === '' &&
              source_content &&
              source_content.media_type === 'video' && (
                <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center z-10">
                  <div className="w-6 h-6 bg-gray-400 rounded-full opacity-50">
                    <FiPlayCircle className="w-full h-full text-white" />
                  </div>
                </div>
              )}
          </div>
          <div className="w-2/3">
            <p className="text-sm line-clamp-3">
              {replaced_post_text || source_content?.post_text}
            </p>
            <p>Ngày tạo: {formatDate(created)}</p>
          </div>
        </div>
      </div>
      <div className="w-2/12">
        <p>{formatDate(date_publish, 'HH:mm DD/MM/YYYY')}</p>
      </div>
      <div className="w-2/12">
        {renderStatus(status, publish_url, error_count, reason)}
      </div>
      <div className="w-2/12">
        <a href={destinationUrl} target="_blank" className="">
          <p>
            {type === 'threads'
              ? 'Threads'
              : type === 'tiktok'
              ? 'TikTok'
              : destination_name}
          </p>
          <p>({destination_id})</p>
        </a>
      </div>
      <div className="w-1/12 flex items-center justify-center">
        {content.source_type === 'user' ? (
          <FaEye size={20} className="text-gray-600 cursor-not-allowed" />
        ) : (
          <a
            href={getScheduleSourceLink(content)}
            target="_blank"
            className="inline-block text-blue-500"
          >
            <FaEye size={20} />
          </a>
        )}
      </div>
      <div className="w-1/12 flex items-center gap-2 justify-center flex-col">
        {sourceLogo ? (
          isFb ? (
            <FaFacebook size={20} className="rounded-full w-6 h-6" />
          ) : (
            <img
              src={sourceLogo}
              alt="source"
              className="w-6 h-6"
              title={sourceName}
            />
          )
        ) : null}
        <span>{sourceName}</span>
      </div>

      <div className="w-1/12 flex items-center gap-2 justify-end pr-5">
        {status === 2 && (
          <img
            src={pauseIcon}
            alt="pause"
            className="w-6 h-6 cursor-pointer"
            title="Tạm dừng bài viết"
            onClick={handlePause}
          />
        )}
        {status === 3 && (
          <img
            src={playIcon}
            alt="play"
            className="w-6 h-6 cursor-pointer"
            title="Tiếp tục đăng bài"
            onClick={handlePlay}
          />
        )}
        <img
          src={binIcon}
          alt="delete"
          className="w-6 h-6 cursor-pointer"
          title="Xoá bài viết"
          onClick={handleDelete}
        />
      </div>
    </div>
  );
};

export default SingleContent;
