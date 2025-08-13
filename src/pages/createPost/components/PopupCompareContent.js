import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setContentCompare } from '../../../store/actions/Contents/contentActions';
import { FaWindowClose } from 'react-icons/fa';
import { breakWord } from '../../../helpers';
import { FiXCircle } from 'react-icons/fi';
import { tiktokService } from '../../../services/tiktok';
import LoadingApp from '../../../components/LoadingApp';

function PopupCompareContent() {
  const dispatch = useDispatch();
  var { post_text, source_type, original_content, original_link, media_url, media_type } = useSelector((state) => state.contents.contentCompare);
  const closePopup = () => {
    dispatch(setContentCompare(null));
  };

  const renderVideo = (source) => {
    return (
      <div className="flex flex-col items-center">
        <video style={{ maxHeight: '60em' }} className='h-full p-5' src={source} preload="auto" autoPlay controls></video>
      </div>
    );
  }
  var headerLeft, headerRight, contentLeft, contentRight;
  if (source_type == "special") {
    headerLeft = "Nội dung tạo mới";
    headerRight = "Nội dung gốc";
    contentLeft = (
      <p className="text-base overflow-auto leading-loose"
        dangerouslySetInnerHTML={{
          __html: breakWord(post_text),
        }}>
      </p>);
    contentRight = (
      <p className="text-base overflow-auto leading-loose"
        dangerouslySetInnerHTML={{
          __html: breakWord(original_content),
        }}>
      </p>
    );
  }
  else if (source_type == "tiktok_renew_caption") {
    headerLeft = "Caption mới tạo với AI";
    headerRight = "Caption gốc.";
    contentLeft = (
      <>
        <p className="text-base overflow-auto leading-loose"
          dangerouslySetInnerHTML={{
            __html: breakWord(post_text),
          }}>
        </p>
        {renderVideo(media_url)}
      </>);
    contentRight = (
      <>
        <p className="text-base overflow-auto leading-loose"
          dangerouslySetInnerHTML={{
            __html: breakWord(original_content),
          }}>
        </p>
        {renderVideo(media_url)}
      </>
    );
  }
  else if (source_type == "tiktok_to_text") {
    headerLeft = "Nội dung văn bản";
    headerRight = "Nội dung gốc";
    contentLeft = (
      <>
        <p className="text-base overflow-auto leading-loose"
          dangerouslySetInnerHTML={{
            __html: breakWord(post_text),
          }}>
        </p>
        {media_type == 'video'
          ? renderVideo(media_url)
          : null}
      </>);
    contentRight = (
      <>
        <p className="text-base overflow-auto leading-loose"
          dangerouslySetInnerHTML={{
            __html: breakWord(original_content),
          }}>
        </p>
        {media_url != null
          ? renderVideo(media_url)
          : <LoadingApp />}

      </>
    );
  }

  return (
    <div className="bg-createContent-modalOverLayClr z-9999 fixed inset-0 flex items-center justify-center">
      <a className="absolute inset-0" onClick={() => closePopup()}></a>
      <div className="mx-20 px-2 mt-4 bg-white rounded-md relative justify-center overflow-auto" style={{ height: '80%' }}>
        <div className="w-full h-full relative flex flex-col p-6">
          {/* Nút đóng popup */}
          <span
            className="absolute top-4 right-4 rounded-md flex items-center cursor-pointer"
            onClick={closePopup}
          >
            <FaWindowClose style={{ width: '36px', height: '36px' }} color="red" />
          </span>

          {/* Nội dung chính */}
          <div className="flex flex-row h-full w-full gap-8">
            {/* Cột nội dung mới */}
            <div className="flex-1 border-r pl-6 min-w-0">
              <span className="uppercase font-bold text-lg block mb-4 text-center">{headerLeft}</span>
              {contentLeft}
            </div>

            {/* Cột nội dung gốc */}
            <div className="flex-1 pr-6 min-w-0">
              <span className="uppercase font-bold text-lg block mb-4 text-center">{headerRight}</span>
              {contentRight}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default PopupCompareContent;