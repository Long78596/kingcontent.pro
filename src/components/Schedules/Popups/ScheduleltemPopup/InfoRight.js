import { Link } from '@mui/material';
import moment from 'moment';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { AiFillLike } from 'react-icons/ai';
import { FaCommentDots, FaEye, FaShare } from 'react-icons/fa';
import { ImFacebook } from 'react-icons/im';
import styled from 'styled-components';
import { kFormatter } from '../../../../utils/utilityFunc';
import Client from '../../../../Client';
import logoTikTok from '../../../../assets/images/icon/main-menu/menu-icon-tiktok.png';
import douyinLogo from '../../../../assets/images/icon/main-menu/douyin.png';
import InstagramLogo from '../../../../assets/images/icon/main-menu/menu-icon-instagram.png';
import ThreadsLogo from '../../../../assets/images/threads-thumbnail.png';
import threadsIcon from '../../../../assets/images/icon/threads-black-icon.png';
import FacebookIcon from '../../../../assets/images/icon/facebook.png';
import { getScheduleSourceLink } from '../../../../helpers';
import { OK } from '../../../../configs';

const TextStyle = styled.p`
  max-height: 70px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-size: 0.9rem !important;
`;

function InfoRight(props) {
  const { scheduleContent } = props;
  const {
    status,
    id,
    source_type = '',
    error_count = 0,
    reason = '',
    publish_url = '',
    destination_id = '',
    schedule = {},
    date_publish = '',
    replaced_post_text = '',
    source_content = {},
    type,
  } = scheduleContent;

  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState(0);
  const [shares, setShares] = useState(0);
  const [loading, setLoading] = useState(false);
  const [sourceLogo, setSourceLogo] = useState('');
  const [isFb, setIsFb] = useState(false);

  useEffect(() => {
    if (source_type) {
      switch (source_type) {
        case 'tiktok':
          setSourceLogo(logoTikTok);
          break;

        case 'douyin':
          setSourceLogo(douyinLogo);
          break;

        case 'threads':
          setSourceLogo(ThreadsLogo);
          break;

        case 'instagram':
          setSourceLogo(InstagramLogo);
          break;

        case 'user':
          setSourceLogo('');
          break;

        default:
          setSourceLogo('');
          setIsFb(true);
          break;
      }
    }
  }, [source_type]);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      await Client.get(`/schedules/content-realtime-data/${id}`).then((res) => {
        if (res.status === OK) {
          const { likes = 0, comments = 0, shares = 0 } = res?.data?.data;
          setLikes(likes);
          setComments(comments);
          setShares(shares);
        } else {
          setLikes(0);
          setComments(0);
          setShares(0);
        }
      });
      setLoading(false);
    }
    if ((status === 1 || status === 5) && type === 'fanpage') {
      fetchData();
    }
  }, [status]);

  const renderStatus = (status, publish_url = '', error_count, reason) => {
    switch (status) {
      case 1:
        return (
          <div className="flex gap-2 items-center">
            <span className="bg-greenSuccess px-2 my-0.5 max-w-max rounded-md font-medium text-white">
              Đăng thành công
            </span>
          </div>
        );
        break;

      case 2:
        return error_count > 2 ? (
          <span
            className="bg-red-500 px-2 my-0.5 max-w-max rounded-md font-medium cursor-pointer text-white"
            title={reason}
          >
            Đã có lỗi
          </span>
        ) : (
          <span className="bg-yellowLabel px-2 my-0.5 max-w-max rounded-md font-medium">
            Đang chờ đăng
          </span>
        );
        break;

      case 3:
        return (
          <span className="bg-red-500 px-2 my-0.5 max-w-max rounded-md font-medium">
            Đã huỷ
          </span>
        );
        break;

      case 5:
        return (
          <div className="flex gap-2 items-center">
            <span className="bg-greenSuccess px-2 my-0.5 max-w-max rounded-md font-medium">
              Đăng thành công dưới dạng video thường
            </span>
          </div>
        );
        break;

      case 6:
        return (
          <div className="flex gap-2 items-center">
            <span className="bg-editor-formular px-2 my-0.5 max-w-max rounded-md font-medium">
              Đang chờ duyệt từ Threads
            </span>
          </div>
        );

      default:
        return <></>;
        break;
    }
  };

  const handleClickSourceContent = () => {
    const destinationLink = getScheduleSourceLink(scheduleContent);
    if (destinationLink) {
      window.open(destinationLink, '_blank');
    }
  };

  return (
    <div className="flex flex-col p-2 mx-1 w-full relative">
      <div className=" text-sm font-bold mr-1 gap-2 items-center hidden">
        <span>Nơi đăng:</span>
        <Link
          href={`https://facebook.com/${destination_id}`}
          target="_blank"
          className="text-base"
        >
          {destination_id}
        </Link>
        <ImFacebook className="ml-auto w-7 h-7 p-1 right-4 top-4 rounded-full bg-editor-facebook text-white" />
      </div>
      {renderStatus(status, publish_url, error_count, reason)}
      <div className="scheduleName  text-sm flex gap-2 pt-1">
        <span>Lịch đăng:</span>
        <span className="italic">{schedule?.name}</span>
      </div>
      <span className="italic pt-1  text-sm">
        {`Ngày đăng: ${moment(date_publish).format('HH:mm:ss DD-MM-YYYY')}`}
      </span>
      <TextStyle
        className="mb-2 line-clamp-3"
        dangerouslySetInnerHTML={{
          __html: replaced_post_text || source_content?.post_text,
        }}
      ></TextStyle>
      {loading && (
        <p className="italic text-blue-500">
          Đang lấy dữ liệu thống kê, vui lòng chờ trong giây lát
        </p>
      )}
      {!loading && (status === 1 || status === 5) && (
        <div className="flex items-center mt-auto">
          <div className="flex items-center mr-5">
            <AiFillLike className="h-5 w-5 text-gray-500" />
            <span className="ml-1  text-sm text-gray-800 font-bold">
              {kFormatter(likes)}
            </span>
          </div>
          <div className="flex items-center mr-5">
            <FaCommentDots className="h-5 w-5 text-gray-500" />
            <span className="ml-1  text-sm text-gray-800 font-bold">
              {kFormatter(comments)}
            </span>
          </div>
          <div className="flex items-center mr-5">
            <FaShare className="h-5 w-5 text-gray-500" />
            <span className="ml-1  text-sm text-gray-800 font-bold">
              {kFormatter(shares)}
            </span>
          </div>
        </div>
      )}

      {/* check if status is 1 or 5 */}
      {status === 1 || status === 5 ? (
        <Link
          href={publish_url}
          target="_blank"
          className="absolute top-2 right-2 rounded-full cursor-pointer bg-no-repeat bg-cover bg-center"
        >
          {type === 'threads' ? (
            <img src={threadsIcon} alt="Threads" className="w-6 h-6" />
          ) : (
            <ImFacebook className="w-6 h-6 p-1 rounded-full bg-editor-facebook text-white" />
          )}
        </Link>
      ) : sourceLogo ? (
        <div
          className="absolute top-2 right-2 w-6 h-6 rounded-full cursor-pointer bg-no-repeat bg-cover bg-center"
          style={{
            backgroundImage: `url(${sourceLogo})`,
            backgroundColor: 'transparent',
          }}
          onClick={() => handleClickSourceContent()}
        ></div>
      ) : isFb ? (
        <ImFacebook className="absolute top-2 right-2 w-6 h-6 p-1 rounded-full bg-editor-facebook text-white cursor-pointer" />
      ) : null}
    </div>
  );
}

export default InfoRight;
