import React from 'react';
import { connect } from 'react-redux';
import GetEmoji from './GetEmoji';
import GetImages from './GetImages';
import GetVideo from './GetVideo';

function GetMedia(props) {
  const { isGetImages, isGetVideo, isGetEmoji, addContentToEditor} = props;
  return (
    <div className="w-full h-56 ml-5 mb-5 border border-solid border-gray-300 rounded overflow-hidden">
      {isGetImages && <GetImages />}
      {isGetVideo && <GetVideo />}
      {isGetEmoji && <GetEmoji addContentToEditor={addContentToEditor}/>}
    </div>
  );
}
const mapStateToProps = (state) => {
  return {
    isGetImages: state.createContent.isGetImages,
    isGetVideo: state.createContent.isGetVideo,
    isGetEmoji: state.createContent.isGetEmoji,
  }
}
export default connect(mapStateToProps,{})(GetMedia);