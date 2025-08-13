import React from "react";
import { convertStatusToText, getStatusBadgeStyle } from "./helper";
// @ts-ignore
import RemoveIcon from "../../assets/images/icon/remove-icon.png";
// @ts-ignore
import HashtagIcon from "../../assets/images/icon/hashtag-icon.png";
// @ts-ignore
import DownloadIcon from "../../assets/images/icon/download-icon-round.png";

const SingleVideo = (props) => {
  const { video, getActions, handleEditHashtag, handleDeleteVideo } = props;
  const {
    id,
    video_url,
    process_status,
    rendered_url,
    created_at,
    description,
    hash_tag,
    thumbnail = '',
  } = video;

  return (
    <div className="bg-white shadow-md p-2 rounded-md relative group min-h-72 flex flex-col">
      <div className="w-full h-48 bg-gray-300 flex items-center justify-center rounded-md overflow-hidden">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={`Thumbnail for video ${id}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <video
            src={video_url}
            className="w-full h-full object-cover"
            muted
            controls={false}
          />
        )}
        <div
          className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
        >
          <ul className="actions flex flex-col gap-4">
            {getActions(rendered_url).map((action) => (
              action.condition && (
                <li key={action.id}>
                  <button
                    className="gap-2 p-2 flex items-center cursor-pointer text-base font-medium text-white bg-black bg-opacity-0 hover:bg-opacity-100 transition-all duration-200 ease-linear rounded-md"
                    onClick={() => action.onClick(video)}
                  >
                    {action.icon}
                    <span className="text-xs">{action.label}</span>
                  </button>
                </li>
              )
            ))}
          </ul>
        </div>
      </div>

      <div className="flex-1 gap-1 mt-2">
        <div className="w-full flex justify-between">
          <h3 className="font-bold text-sm line-clamp-3">#{id}</h3>
          <span className={`text-xs font-bold px-2 py-1 rounded ${getStatusBadgeStyle(!!rendered_url)}`}>
            {convertStatusToText(!!rendered_url)}
          </span>
        </div>
        <p 
          className="text-sm text-gray-700 line-clamp-1 hover:line-clamp-none transition-all duration-200" 
          title={description}
        >
          Mô tả: {description}
        </p>
        <p className="text-sm text-blue-500">Hash tag: {hash_tag}</p>
        <p className="text-xs italic text-gray-600">
          {new Date(created_at).toLocaleString()}
        </p>
      </div>

      <div className="absolute right-3 top-3 gap-1 flex items-center">
        {rendered_url && <button className="" 
          onClick={() => window.open(rendered_url, "_blank")}
          title="Tải video đã chỉnh sửa"
        >
          <img src={DownloadIcon} alt="Download" className="w-8 h-8" />
        </button>}
        <button
          className=""
          onClick={() => handleEditHashtag(video)}
          title="Chỉnh sửa hash tag"
        >
          <img src={HashtagIcon} alt="Hashtag" className="w-8 h-8" />
        </button>
        <button
          className=""
          onClick={() => handleDeleteVideo(id)}
          title="Xóa video"
        >
          <img src={RemoveIcon} alt="Remove" className="w-8 h-8" />
        </button>
      </div>
    </div>
  );
};

export default SingleVideo;