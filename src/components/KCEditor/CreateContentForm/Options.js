import { EmojiHappyIcon, LocationMarkerIcon, PhotographIcon, VideoCameraIcon } from '@heroicons/react/outline';
import React, { useCallback } from 'react';
import { connect } from 'react-redux';
import GetMedia from './GetMedia';
import { changeStateGetMediaForm, changeStateGetImages, changeStateGetVideo, changeStateGetEmoji } from '../../../store/actions/editor/createContentActions';
import ActionButtons from './ActionButtons';

function Options(props) {
  const { 
    isShowGetMediaForm, 
    isGetImages, 
    isGetVideo, 
    isGetEmoji, 
    changeStateGetMediaForm, 
    changeStateGetImages, 
    changeStateGetVideo, 
    changeStateGetEmoji, 
    canSave,
    handleOnSaveContent,
    addContentToEditor,
    handleOnPreviewContent
  } = props;

  const ShowGetMediaForm = useCallback(()=> {
    return isShowGetMediaForm && (<GetMedia addContentToEditor={addContentToEditor}/>)
  },[isShowGetMediaForm])

  const ChangeStateGetMedia = (stateMedia, stateImages, stateVideo, stateEmoji) => {
    changeStateGetMediaForm(stateMedia);
    changeStateGetImages(stateImages);
    changeStateGetVideo(stateVideo);
    changeStateGetEmoji(stateEmoji);
  }

  return (
    <div className="w-full py-0 px-5 my-0 mx-auto mb-5">
      <div className="w-full my-0 mx-auto block">
        <div className="w-full mx-auto flex items-center justify-between border border-solid border-gray-300 rounded-md p-3">
          <label>Thêm vào bài viết</label>
          <div className="flex items-center justify-start">
            <PhotographIcon className="h-8 w-8 transition-all cursor-pointer hover:opacity-60 text-createContent-greenClr" onClick={()=>ChangeStateGetMedia(true, !isGetImages, false, false)}/>
            <VideoCameraIcon className="h-8 w-8 transition-all cursor-pointer hover:opacity-60 text-createContent-purpleClr ml-1.5" onClick={()=>ChangeStateGetMedia(true, false, !isGetVideo, false)}/>
            <EmojiHappyIcon className="h-8 w-8 transition-all cursor-pointer hover:opacity-60 text-createContent-orangeClr ml-1.5" onClick={()=>ChangeStateGetMedia(true, false, false, !isGetEmoji)}/>
            <LocationMarkerIcon className="h-8 w-8 transition-all cursor-pointer hover:opacity-60 text-createContent-redClr ml-1.5" />
          </div>
        </div>
        <ActionButtons
          canSave={canSave}
          handleOnSaveContent={handleOnSaveContent}
          handleOnPreviewContent={handleOnPreviewContent}
        />
      </div>

      {ShowGetMediaForm()}
    </div>
  );
}
const mapStateToProps = (state) => {
  return {
    isShowGetMediaForm: state.createContent.isShowGetMediaForm,
    isGetImages: state.createContent.isGetImages,
    isGetVideo: state.createContent.isGetVideo,
    isGetEmoji: state.createContent.isGetEmoji,
  }
}
export default connect(mapStateToProps,{changeStateGetMediaForm, changeStateGetImages, changeStateGetVideo, changeStateGetEmoji})(Options);
