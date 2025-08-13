import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Medias from './Medias';
import Header from './Header';
import Footer from './Footer';
import { useHistory } from 'react-router-dom';
import { _dashed_border } from '../../../pages/createPost/utility';
import { breakWord } from '../../../helpers';
import { actionSetCurrentContent } from '../../../store/actions/instagram';

function ContentDetail(props) {
  const dispatch = useDispatch();
  const history = useHistory();
  const [isTextOnly, setIsTextOnly] = useState(false);
  const [isVideo, setIsVideo] = useState(false);

  const { currentContent = {} } = useSelector((state) => state.instagram);
  const {
    id = '',
    code = '',
    created = '',
    likes = 0,
    comments = 0,
    user_id = '',
    user_display_name = '',
    user_picture = '',
    is_reels = false,
    loaded = false,
    video = '',
    thumbnail = '',
    images = [],
    videos = [],
    text = '',
  } = currentContent;

  useEffect(() => {
    const isTextOnly = !video && !thumbnail && !images.length && !videos.length;
    setIsTextOnly(isTextOnly);
  }, [video, thumbnail, images, videos]);

  useEffect(() => {
    if (video || videos.length) {
      setIsVideo(true);
    } else {
      setIsVideo(false);
    }
  }, [video, videos]);

  const closePopup = () => {
    dispatch(actionSetCurrentContent(null));
  };

  const handelWritePost = () => {
    history.push('/tao-content');
    closePopup();
  };

  return (
    <>
      {isTextOnly ? (
        <div className="bg-createContent-modalOverLayClr z-9999 fixed inset-0">
          <div className="flex justify-center w-full h-screen items-center">
            <div className="mx-20 px-2 bg-white rounded-md relative">
              <div className="w-full h-full flex flex-row justify-between">
                <div className="h-full w-full max-w-xl p-4">
                  <p
                    className=" text-sm overflow-auto max-h-98"
                    dangerouslySetInnerHTML={{
                      __html: breakWord(text),
                    }}
                  ></p>
                  <div className={`${_dashed_border} mb-4`}></div>
                  <div className="mt-2 flex justify-end">
                    <button
                      className=" bg-primary p-5 rounded-md text-white font-bold mr-2 hover:bg-gray-700 duration-300"
                      onClick={handelWritePost}
                    >
                      Viết bài
                    </button>

                    <button
                      className="bottom-5 bg-red-500 p-5 rounded-md text-white font-bold hover:bg-gray-700 duration-300 mt-3"
                      onClick={() => closePopup()}
                    >
                      Đóng
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-createContent-modalOverLayClr z-9999 fixed inset-0">
          <a className="absolute inset-0" onClick={() => closePopup()}></a>
          <div className="mx-20 px-2 mt-4 bg-white rounded-md relative">
            <div className="w-full h-full flex flex-row justify-between">
              <Medias
                images={thumbnail ? [thumbnail] : images}
                videos={video ? [video] : videos}
                isVideo={isVideo}
              />

              <div className="h-full w-full max-w-xl p-4 overflow-auto">
                <Header
                  handelWritePost={handelWritePost}
                  closePopup={closePopup}
                  displayName={user_display_name}
                  userId={user_id}
                  userPicture={user_picture}
                  created={created}
                  postLink={`https://www.instagram.com/p/${code}`}
                />
                <p
                  className=" text-sm overflow-auto leading-loose max-h-98"
                  dangerouslySetInnerHTML={{
                    __html: breakWord(text),
                  }}
                ></p>
                <Footer likes={likes} comments={comments} />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ContentDetail;
