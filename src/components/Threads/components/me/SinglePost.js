import React, { Fragment } from "react";
import { FaCalendarAlt, FaComment, FaComments, FaEye, FaHeart, FaPencilAlt, FaPlayCircle } from "react-icons/fa";
import { getNoImage } from "../../../../helpers";
import { nFormatter } from "../../../../configs";
import { FiRefreshCcw } from "react-icons/fi";
import { formatUnixDate } from "../../../../helpers/date";
import { Link } from "@mui/material";

const SinglePost = (props) => {
  const { 
    post,
    handleAction,
    setIsShowComments,
    setCurrentPost,
  } = props;
  const {
    code = '',
    comments = 0,
    likes = 0,
    reposts = 0,
    text = '',
    user_name = '',
    images = [],
    videos = [],
    created = 0,
  } = post;

  const onClickShowComments = () => {
    setCurrentPost(post);
    setIsShowComments(true);
  }

  return (
    <div
      className="flex flex-row border-b border-gray-200 cursor-pointer p-2 gap-3"
    >
      <div className="w-28 flex justify-center items-center relative">
        {post.media_type === 'image' ? (
          <img
            src={images[0]}
            alt={text}
            className="w-24 h-24 object-cover rounded-md"
          />
        ) : post.media_type === 'video' ? (
          <Fragment>
            <video
              src={videos[0]?.source}
              alt={text}
              className="w-24 h-24 object-cover"
            />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <FaPlayCircle size={24} />
            </div>
          </Fragment>
        ) : (
          <img
            src={getNoImage()}
            alt=""
            className="w-24 h-24 object-cover rounded-md"
          />
        )}
      </div>

      <div className="w-2/5 flex flex-col">
        <div className="line-clamp-3">{text}</div>
        <div className="flex gap-4 mt-auto">
          {/* like icon */}
          <div className="flex items-center gap-2">
            <FaHeart size={20} color="gray" />
            <span>{nFormatter(likes)}</span>
          </div>
          {/* comment icon */}
          <div className="flex items-center gap-2">
            <FaComment size={20} color="gray" />
            <span>{nFormatter(comments)}</span>
          </div>
          {/* share icon */}
          <div className="flex items-center gap-2">
            <FiRefreshCcw size={20} color="gray" />
            <span>{nFormatter(reposts)}</span>
          </div>
        </div>
      </div>

      <div className="w-1/5 text-center flex justify-center items-center">
        {formatUnixDate(created)}
      </div>
      
      <div className="w-1/5 text-center flex gap-4 items-center justify-center">
        <Link
          href={`https://threads.net/@${user_name}/post/${code}`}
          target="_blank"
          className="flex items-center gap-2"
        >
          <FaEye size={20} className="text-gray-500" />
        </Link>
        <a
          href="#"
          className="flex items-center gap-2"
          onClick={() => handleAction('CREATE_CONTENT', post)}
        >
          <FaPencilAlt size={20} className="text-gray-500" />
        </a>
        <a
          href="#"
          className="flex items-center gap-2"
          onClick={() => handleAction('SCHEDULE_CONTENT', post)}
        >
          <FaCalendarAlt size={20} className="text-gray-500" />
        </a>
        {/* new action to show all comments */}
        <a
          href="#"
          className="flex items-center gap-2"
          onClick={onClickShowComments}
        >
          <FaComments size={20} className="text-gray-500" />
        </a>
      </div>
    </div>
  );
}

export default SinglePost;