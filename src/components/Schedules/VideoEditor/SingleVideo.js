import React, { useEffect, useState } from "react";
import { FaCheckSquare, FaExclamation, FaPencilAlt, FaRegSquare } from "react-icons/fa";
import { FiPlay } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentEditingContent, setIsShowFinalStep, setSelectedScheduleContent, setShowSourceIdeasPopup } from "../../../store/actions/Schedules";
// @ts-ignore
import addIcons from '../../../assets/images/icon/create-content/add.png';

const SingleVideo = (props) => {
  const {
    video,
    isAuto = false,
    handleAddToWaitingList = ()=> {},
    onClickShowDetail = () => {},
  } = props;
  const {
    id,
    description,
    thumbnail,
    hash_tag,
  } = video;
  const [isSelected, setIsSelected] = useState(false);
  const [isScheduled, setIsScheduled] = useState(false);
  const [displayPostText, setDisplayPostText] = useState(description);
  const dispatch = useDispatch();
    const {
      autoWaitingList,
      editingContents = [],
      scheduledContents = [],
    // @ts-ignore
    } = useSelector((state) => state.schedules);
    
  useEffect(() => {
    if (autoWaitingList) {
      const { source_type, contents } = autoWaitingList;
      if (contents.length > 0) {
        const search = contents.find((elt) => elt.id === video.id && source_type === 'video_editor');
        if (search) {
          setIsSelected(true);
        } else {
          setIsSelected(false);
        }
      } else {
        setIsSelected(false);
      }
    } else {
      setIsSelected(false);
    }
  }, [video, autoWaitingList]);
  
  useEffect(() => {
    if (scheduledContents && scheduledContents.length > 0) {
      const search = scheduledContents.find((elt) => {
        return (
          elt?.content_id === video?.id && elt?.source_type === 'video_editor'
        );
      });
      if (search) {
        setIsScheduled(true);
      } else {
        setIsScheduled(false);
      }
    } else {
      setIsScheduled(false);
    }
  }, [video, scheduledContents]);
  
  useEffect(() => {
    if (editingContents && editingContents.length > 0 && isAuto) {
      const search = editingContents.find((elt) => elt?.id === id);
      if (search) {
        setDisplayPostText(search?.text);
      }
    }
  }, [editingContents, id, isAuto]);
  
  const handleEditContent = (item) => {
    const editingContent = {
      id: item.id,
      text: displayPostText,
      source_type: 'video_editor',
    };
    dispatch(setCurrentEditingContent(editingContent));
  };
  
  const handleAddToSchedule = (video) => {
    dispatch(
      setSelectedScheduleContent({
        ...video,
        post_id: video.id,
        content_id: video.id,
        post_text: video.description,
        media_url: video.rendered_url,
        media_type: 'video',
        source_type: 'video_editor',
      })
    );
    dispatch(setIsShowFinalStep(true));
    dispatch(setShowSourceIdeasPopup(false));
  };

  return (
      <div
        className={`mb-2 flex gap-2 hover:bg-gray-200 rounded-md transition-all cursor-pointer border p-2 relative items-center`}
      >
        {isAuto && (
          <div
            className="w-1/12 flex items-center text-center justify-center"
            onClick={() => handleAddToWaitingList('video_editor', video)}
          >
            {isSelected ? (
              <FaCheckSquare className="w-6 text-green-500 text-base" />
            ) : (
              <FaRegSquare className="w-6 text-gray-500 text-base" />
            )}
          </div>
        )}
  
        {/* add Pencil on top right */}
        {isAuto && (
          <div
            className="absolute top-2 right-2 text-gray-500 cursor-pointer"
            onClick={() => handleEditContent(video)}
          >
            <FaPencilAlt />
          </div>
        )}
  
        <div
          className="w-3/12 relative h-40 bg-no-repeat bg-cover bg-center rounded-lg"
          onClick={() => onClickShowDetail(video)}
          role="button"
        >
          {thumbnail ? (
            <>
              <div
                className="w-full h-full bg-no-repeat bg-cover bg-center rounded-lg"
                style={{ backgroundImage: `url("${thumbnail}")` }}
              />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform">
                <FiPlay
                  size={50}
                  color="#fff"
                  className="hover:scale-125 cursor-pointer"
                  title="Nhấp để xem"
                />
              </div>
            </>
          ) : video.rendered_url ? (
            <>
              <video
                className="w-full h-full object-cover rounded-lg"
                src={video.rendered_url}
                muted
                preload="metadata"
              />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform">
                <FiPlay
                  size={50}
                  color="#fff"
                  className="hover:scale-125 cursor-pointer"
                  title="Nhấp để xem"
                />
              </div>
            </>
          ) : (
            <div className="w-full h-full bg-gray-300 rounded-lg flex items-center justify-center">
              <span className="text-gray-500">Không có video</span>
            </div>
          )}
        </div>
        <div
          className="w-7/12 relative"
          onClick={() => onClickShowDetail(video)}
          role="button"
        >
          <h3>Hash tag: {hash_tag ? <span className="font-bold">{hash_tag}</span> : <span className="italic">Chưa thêm hash tag</span>}</h3>
          <div className="overflow-hidden max-h-28">
            {description ? 
              <p
                className="truncate"
                dangerouslySetInnerHTML={{ __html: isAuto ? displayPostText : description }}
              ></p> : 
              <p className="italic">Chưa thêm mô tả cho video</p>
            }
          </div>
          {/* <div className="w-full mt-2">
            <div className="flex justify-between">
              <span className="flex gap-1">
                <FiHeart size={20} /> <span>{nFormatter(video?.react)}</span>
              </span>
              <span className="flex gap-1">
                <FiUser size={20} /> <span>{nFormatter(video?.comment)}</span>
              </span>
              <span className="flex gap-1">
                <FiShare size={20} /> <span>{nFormatter(video?.share)}</span>
              </span>
            </div>
          </div>
          <div className="w-full mt-2 absolute bottom-2">
            <div className="flex justify-between">
              <span className="bg-darkBgOpacityClr py-1 px-2 rounded-md font-bold text-white flex gap-1">
                <FiPlay size={20} /> <span>{nFormatter(video?.view)}</span>
              </span>
              <span className="bg-darkBgOpacityClr py-1 px-2 rounded-md font-bold text-white flex gap-1">
                <FiClock size={20} />{' '}
                {moment.utc(video?.duration * 1000).format('mm:ss')}
              </span>
            </div>
          </div> */}
        </div>
        {!isAuto && (
          <div
            className="w-1/12 ml-auto flex items-center justify-center"
            onClick={() => handleAddToSchedule(video)}
          >
            <img src={addIcons} className="w-8" />
          </div>
        )}
        {isScheduled && (
          <span
            className="absolute bottom-1 right-1 text-red-500"
            title="Bài viết đã được lên lịch"
          >
            <FaExclamation />
          </span>
        )}
      </div>
  );
};

export default SingleVideo;