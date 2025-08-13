import React, { useCallback, useEffect, useRef, useState } from 'react';
import { MdClose } from 'react-icons/md';
import { ImArrowLeft, ImFilm, ImImage } from 'react-icons/im';
import { FaRegLaugh } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import * as SCHEDULES from '../../../../store/actions/Schedules/index';
import Medias from './Medias';
import FooterInfo from './FooterInfo';
import ButtonGroup from './ButtonGroup';

function CreateSchedulePopup(props) {
  const dispatch = useDispatch();
  const suggestionContent = useSelector(
    (state) => state.schedules.suggestionContent
  );
  const [images, setImages] = useState([]);
  const [video, setVideo] = useState('');
  const [inputContent, setInputContent] = useState('');

  const inputImages = useRef(null);
  const inputVideo = useRef(null);
  const {
    video_source,
    content_type,
    post_timestamp,
    fanpage,
    medias,
    content,
  } = suggestionContent;

  useEffect(() => {
    if (medias) {
      const arrayMedias = JSON.parse(medias);
      setImages(images.concat(arrayMedias));
    }
  }, [medias]);

  useEffect(() => {
    if (video_source) {
      setVideo(video_source);
    }
  }, [video_source]);

  useEffect(() => {
    setInputContent(content);
  }, [content]);

  const closeForm = useCallback(() => {
    dispatch(SCHEDULES.setShowCreateSchedulePopup(false));
  }, []);

  const handleBack = useCallback(() => {
    dispatch(SCHEDULES.setShowCreateSchedulePopup(false));
    dispatch(SCHEDULES.setShowSuggestionsPopup(true));
  }, []);

  const handleInputImages = () => {
    inputImages.current.click();
  };
  const handleInputVideo = () => {
    inputVideo.current.click();
  };

  const onChangeInputImages = async (e) => {
    let files = Array.from(e.target.files).map((file) => {
      let reader = new FileReader();
      return new Promise((resolve) => {
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
    });
    const result = await Promise.all(files);
    setImages((prev) => prev.concat(result));
  };

  const onChangeInputVideo = async (e) => {
    let file = e.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      let data = reader.result;
      setVideo(data);
    };
  };

  const handleRemoveImage = useCallback((image) => {
    setImages((prev) => prev.filter((item) => item !== image));
  }, []);

  const handleRemoveVideo = useCallback(() => {
    setVideo('');
  }, []);

  const onChangeInputContent = (e) => {
    setInputContent(e.target.value);
  };

  return (
    <div className="min-w-screen h-screen fixed inset-0 z-9999 flex items-center justify-center">
      <div
        onClick={closeForm}
        className="absolute inset-0 bg-black opacity-20"
      />
      <div className="w-full max-w-5xl relative m-auto rounded-lg shadow-lg bg-gray-200 p-3 md:mt-16 mt-12">
        <MdClose
          onClick={closeForm}
          className="absolute top-3 right-3 w-7 h-7 rounded-full bg-gray-300 text-gray-400 p-1 hover:text-gray-800 hover:bg-gray-400 transition-all duration-200 ease-linear cursor-pointer"
        />
        <div className="m-2 flex flex-col ">
          <div className="flex items-center mb-2">
            <ImArrowLeft
              onClick={handleBack}
              className="w-7 h-7 mr-3 text-gray-600 hover:text-blue-400"
            />
            <span className="text-gray-800 font-bold text-base p-1">
              SOẠN THẢO NỘI DUNG CẦN LÊN LỊCH
            </span>
          </div>

          {/* <div className="bg-white w-full max-h-52 h-52 border-0 outline-none p-2 ring-1 ring-blue-300 overflow-y-auto"
            contentEditable="true"
            placeholder="Hãy viết gì vào đây hoặc chuyển các ý tưởng bên cạnh để chỉnh sửa ..."
            dangerouslySetInnerHTML={{__html: inputContent }}
            onInput={onChangeInputContent}
          ></div>                    */}

          <textarea
            name=""
            id="emojionearea1"
            cols="30"
            rows="10"
            value={inputContent}
            onChange={onChangeInputContent}
          ></textarea>

          <div className="flex items-center justify-start mt-2">
            <ImImage
              onClick={handleInputImages}
              className="h-7 w-7 transition-all cursor-pointer hover:opacity-100 text-createContent-greenClr opacity-70 mr-3"
            />
            <input
              type="file"
              accept="image/*"
              ref={inputImages}
              multiple
              className="hidden"
              onChange={onChangeInputImages}
            />
            <ImFilm
              onClick={handleInputVideo}
              className="h-8 w-8 transition-all cursor-pointer hover:opacity-100 text-red-500 opacity-60 mr-3"
            />
            <input
              type="file"
              accept="video/*"
              ref={inputVideo}
              className="hidden"
              onChange={onChangeInputVideo}
            />
            <FaRegLaugh className="h-7 w-7 transition-all cursor-pointer hover:opacity-100 text-yellow-500 opacity-60 mr-3" />
          </div>

          <Medias
            images={images}
            videoUrl={video}
            handleRemoveImage={handleRemoveImage}
            handleRemoveVideo={handleRemoveVideo}
          />
          <FooterInfo />
          <ButtonGroup />
        </div>
      </div>
    </div>
  );
}

export default React.memo(CreateSchedulePopup);
