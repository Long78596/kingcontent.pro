import { CloudUploadIcon, XIcon } from '@heroicons/react/outline';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import Scrollbar from 'react-scrollbars-custom';
import { setVideoContent, removeVideoContent } from '../../../store/actions/editor/createContentActions';

function GetVideo(props) {
  const { videoContent, setVideoContent, removeVideoContent } = props;

  const [video, setVideo] = useState();

  const handleFileVideo = (e) => {
    const file = e.target.files[0];
    const url = URL.createObjectURL(file);
    setVideoContent(url);
    setVideo(url);    
  } 

  const ViewVideoContent = () => {
    return videoContent && (
      <div className="inline-block w-56 h-40 m-3 overflow-hidden rounded-md border border-gray-300 relative">
        <video className="w-full h-full" controls src={videoContent} />
        <XIcon 
          className="bg-createContent-lightBlueClr rounded-full h-8 w-8 p-1 text-gray-100 transition-all cursor-pointer hover:text-createContent-blackClr absolute top-1 right-2"          
          onClick={() => removeVideoContent()}
        />        
      </div>
    )
  }

  return (
    <Scrollbar className="w-full h-full">
      <div className="h-full flex items-start justify-start flex-wrap">
        <div className="text-center font-medium px-3 py-1 text-gray-400 border hover:text-blue-500 hover:border-gray-300 transition-all w-56 h-40 m-3 overflow-hidden rounded-md flex items-center flex-col justify-center relative">
          <CloudUploadIcon className="h-10 w-10" />
          <span>Chọn video (lưu ý chỉ 1 video)</span>
          <input
            type="file"
            onChange={handleFileVideo}
            accept=".mov, .mp4"
            className="absolute top-0 left-0 h-full w-full opacity-0 cursor-pointer"
          />
        </div>
        {ViewVideoContent()}        
      </div>
    </Scrollbar>
  );
}

const mapStateToProps = (state) => {
  return {
    videoContent: state.createContent.videoContent,
  };
};
export default connect(mapStateToProps, { setVideoContent, removeVideoContent })(GetVideo);
