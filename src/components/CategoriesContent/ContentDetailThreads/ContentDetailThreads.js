import { Dialog } from 'primereact/dialog';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Client from '../../../Client';
import { breakWord } from '../../../helpers';
import { _dashed_border } from '../../../pages/createPost/utility';
import { setContentDetailToShow } from '../../../store/actions/Contents/contentActions';
import {
  actionUpdateStep1,
  resetCreateContent,
} from '../../../store/actions/createContent';
import { actionPushContentToCreateContentScreen } from '../../../store/actions/homepage';
import Footer from './Footer';
import Header from './Header';
import Medias from './Medias';
import { getPathVideo } from '../../../utils/utilityFunc';

function ContentDetailThreads(props) {
  const dispatch = useDispatch();
  const history = useHistory();
  const [urlCalled, setUrlCalled] = useState('');
  const { contentDetailToShow } = useSelector((state) => state.contents);
  const {
    text: postText = '',
    post_type: contentType = '',
    likes = 0,
    comments = 0,
    shares = 0,
    ff_posts_id: contentId,
    feed_id: fpFeedId,
    post_timestamp,
    user_link,
    user_name: fanpageName,
    post_permalink,
    image_url,
    media_url: urlVideo,
    media_type,
    words,
    images,
    videos,
    writed,
    user_picture: page_avatar,
    isCreatedContent = false,
    wishlist = 0,
    ad_id = '',
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
      if (urlVideo && media_type === 'video') {
        getPathVideo(urlVideo).then((_url) => setUrlCalled(_url));
      }
    }
  }, []);

  return (
    <Dialog
      header={fanpageName}
      visible={contentDetailToShow ? true : false}
      style={{
        width: media_type === 'no_media' || !media_type ? '40vw' : '80vw',
        height: 'fit-content',
      }}
      onHide={() => {
        if (!contentDetailToShow) return;
        closePopup();
      }}
    >
      <>
        {media_type === 'no_media' || !media_type ? (
          <div className="h-full w-full p-4">
            <p
              className=" text-sm overflow-auto max-h-98"
              dangerouslySetInnerHTML={{
                __html: breakWord(postText),
              }}
            ></p>
            <div className={`${_dashed_border} mb-4`}></div>
            <Footer likes={likes} comments={comments} shares={shares} />
          </div>
        ) : (
          <div className="w-full h-full flex flex-row justify-between">
            <Medias medias={images} urlVideo={videos[0]?.source} />

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
              />
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
        )}
      </>
    </Dialog>
  );
}

export default ContentDetailThreads;
