import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setContentDetailToShow } from '../../../store/actions/Contents/contentActions';
import Medias from './Medias';
import Header from './Header';
import Footer from './Footer';
import { isArrayEmpty } from '../../../configs';
import {
  actionUpdateStep1,
  resetCreateContent,
} from '../../../store/actions/createContent';
import { actionPushContentToCreateContentScreen } from '../../../store/actions/homepage';
import { useHistory } from 'react-router-dom';
import { _dashed_border } from '../../../pages/createPost/utility';
import { breakWord } from '../../../helpers';
import { getPathVideo } from '../../../utils/utilityFunc';
import { toast } from 'react-toastify';

function ContentDetail() {
  const dispatch = useDispatch();
  const history = useHistory();
  const [urlCalled, setUrlCalled] = useState('');
  const { contentDetailToShow } = useSelector((state) => state.contents);
  const {
    post_text: postText = '',
    post_type: contentType = '',
    likes = 0,
    comments = 0,
    shares = 0,
    ff_posts_id: contentId,
    feed_id: fpFeedId,
    post_timestamp,
    user_screenname: fanpageName,
    post_permalink,
    media_url: urlVideo,
    media_type,
    images,
    videos,
    writed,
    page_avatar = '',
    isCreatedContent = false,
    wishlist = 0,
    ad_id = '',
    source_type = '',
    preset = null,
    is_active_preset = false,
    random_preset = null,
    videogen_settings = null,
  } = contentDetailToShow;

  let medias = [];
  let mediasData = [];
  if (!Array.isArray(mediasData)) {
    medias = mediasData.slice(0, -1).split(';');
  }
  const closePopup = () => {
    dispatch(setContentDetailToShow(null));
  };

  const handelWritePost = () => {
    // reset
    dispatch(resetCreateContent());
    // dispatch value
    dispatch(actionUpdateStep1(true));
    dispatch(resetCreateContent());
    dispatch(
      actionPushContentToCreateContentScreen(
        postText,
        images,
        media_type,
        wishlist === 1
      )
    );
    history.push('/tao-content');
    closePopup();
  };

  useEffect(() => {
    if (isCreatedContent === true) {
      setUrlCalled(urlVideo);
    } else {
      if (urlVideo && media_type === 'video' && urlVideo.includes('|')) {
        toast.info('Đang tải video...');
        getPathVideo(urlVideo).then((_url) => {
          setUrlCalled(_url);
          toast.dismiss();
        });
      } else {
        setUrlCalled(urlVideo);
      }
    }
  }, []);

  return (
    <>
      {(!images && !videos) ||
        ((images?.length === 0 || images[0] === '') && videos?.length === 0) ? (
        <div className="bg-createContent-modalOverLayClr z-9999 fixed inset-0">
          <div className="flex justify-center w-full h-screen items-center">
            <div className="mx-20 px-2 bg-white rounded-md relative w-1/2">
              <div className="w-full h-full flex flex-row justify-between">
                <div className="h-full w-full p-4">
                  {is_active_preset && (preset || random_preset) ? (
                    <div
                      className="flex text-base font-bold text-black h-96 w-full justify-center items-center bg-cover bg-center"
                      style={{
                        backgroundImage: `url(${preset?.url || random_preset?.url
                          })`,
                      }}
                    >
                      <p
                        className=" text-sm overflow-auto max-h-98"
                        dangerouslySetInnerHTML={{
                          __html: breakWord(postText),
                        }}
                      ></p>
                    </div>
                  ) : (
                    <p
                      className=" text-sm overflow-auto max-h-98"
                      dangerouslySetInnerHTML={{
                        __html: breakWord(postText),
                      }}
                    ></p>
                  )}
                  <div className={`${_dashed_border} mb-4`}></div>
                  <div className="mt-2 flex justify-end">
                    {writed && (
                      <button
                        className=" bg-primary p-5 rounded-md text-white font-bold mr-2 hover:bg-gray-700 duration-300"
                        onClick={handelWritePost}
                      >
                        Viết bài
                      </button>
                    )}

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
                medias={images}
                urlVideo={
                  videos && !isArrayEmpty(videos)
                    ? videos[0]?.video || videos[0]?.source
                    : media_type === 'video'
                      ? urlCalled
                      : null
                }
              />

              <div className="h-full w-full max-w-xl p-4 overflow-auto">
                <Header
                  fanpageId={fpFeedId}
                  fanpageName={fanpageName}
                  createdAt={post_timestamp}
                  writed={writed}
                  handelWritePost={handelWritePost}
                  closePopup={closePopup}
                  post_permalink={post_permalink}
                  page_avatar={page_avatar}
                  isCreatedContent={isCreatedContent}
                  source_type={source_type}
                />
                {videogen_settings && (
                  <div className="flex flex-col mb-4 bg-gray-100 p-4 rounded-md shadow-md">
                    <div className="text-sm font-bold text-gray-700 mb-2">
                      Cấu hình Video AI
                    </div>
                    <div className="text-sm text-gray-600 gap-1">
                      <p>
                        <strong>Tiêu đề: </strong>{videogen_settings.title}
                      </p>
                      <p>
                        <strong>Chủ đề: </strong>{videogen_settings.prompt || "Tự soạn"}{". "}
                        {videogen_settings.style && <strong>Phong cách: </strong>}{videogen_settings.style && (videogen_settings.style + ". ")}
                      </p>
                      <p>
                        <strong>Định dạng video: </strong>
                        {videogen_settings.clip_source === 1
                          ? "Ảnh tạo bởi AI"
                          : "Thư viện istock"}{". "}
                        <strong>{videogen_settings.caption_visible === 1 ? "Có" : "Không"} </strong>{"hiển thị phụ đề."}
                      </p>
                    </div>
                  </div>
                )}
                <p
                  className=" text-sm overflow-auto leading-loose max-h-98"
                  dangerouslySetInnerHTML={{
                    __html: breakWord(postText),
                  }}
                ></p>
                {ad_id === '' && (
                  <Footer likes={likes} comments={comments} shares={shares} />
                )}
                {/* <div className="mt-2 flex justify-end">
                  {writed && (
                    <button
                      className=" bg-primary p-5 rounded-md text-white font-bold mr-2 hover:bg-gray-700 duration-300"
                      onClick={handelWritePost}
                    >
                      Viết bài
                    </button>
                  )}
                  <button
                    className="bottom-5 bg-red-500 p-5 rounded-md text-white font-bold hover:bg-gray-700 duration-300"
                    onClick={() => closePopup()}
                  >
                    Đóng
                  </button>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ContentDetail;
