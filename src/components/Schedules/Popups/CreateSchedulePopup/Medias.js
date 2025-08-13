import React, { useEffect, useRef } from 'react';
import ScrollBar from 'react-perfect-scrollbar';
import { MdClose } from "react-icons/md";

function Medias(props) {
  const { images, videoUrl, handleRemoveImage, handleRemoveVideo } = props;
  const mediasPane = useRef(null);

  useEffect(() => {
    const updateStyleMediasPane = () => {
      if (images.length > 0 || videoUrl !== '') {
        mediasPane.current.style.maxHeight = `${mediasPane.current.scrollHeight}px`;
      }else {
        mediasPane.current.style.maxHeight = null
      }
    }
    updateStyleMediasPane()
    window.addEventListener('resize', updateStyleMediasPane);

    return () => {
      window.removeEventListener('resize', updateStyleMediasPane);
    }
  },[images, videoUrl, mediasPane])

  return (
    <ScrollBar >
      <div className="flex flex-nowrap my-2 transition-all duration-300 ease-linear transform origin-top max-h-0" ref={mediasPane}>          
        {
          (videoUrl !== "") && 
            (
              <div className="relative w-40 h-28 m-1">
                <video
                  className="w-full h-full object-cover rounded-md"
                  src={videoUrl}
                  controls            
                  autoPlay
                />
                <MdClose 
                  onClick={handleRemoveVideo}
                  className="absolute top-1 right-1 w-7 h-7 rounded-full bg-gray-300 text-gray-400 p-1 hover:text-gray-800 hover:bg-gray-400 transition-all duration-200 ease-linear cursor-pointer" />         
              </div>
            )
        }
        {
          (images.length > 0) && images.map((image, index) => (
            <div key={index} 
              className="relative w-28 h-28 min-w-28 block overflow-hidden rounded-sm m-1">
              <img className="w-full h-full object-cover" src={image} alt="" />
              <MdClose 
                onClick={()=>handleRemoveImage(image)}
                className="absolute top-1 right-1 w-7 h-7 rounded-full bg-gray-300 text-gray-400 p-1 hover:text-gray-800 hover:bg-gray-400 transition-all duration-200 ease-linear cursor-pointer" />         
            </div>
          ))         
        }        
      </div>
    </ScrollBar >
  );
}

export default React.memo(Medias);