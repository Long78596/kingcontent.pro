import { CloudUploadIcon, XIcon } from '@heroicons/react/outline';
import React, { useState } from 'react';
import ReactImageUploading from 'react-images-uploading';
import { connect } from 'react-redux';
import Scrollbar from 'react-scrollbars-custom';
import { setImagesContent } from '../../../store/actions/editor/createContentActions';

function GetImages(props) {
  const { imagesContent, setImagesContent } = props;
  const [images, setImages] = useState([]);
  const maxNumber = 69;

  const onChange = (imageList, addUpdateIndex) => {
    setImagesContent(imageList);
    setImages(imageList);
  };
  return (
    <Scrollbar className="w-full h-full">
      <ReactImageUploading
        multiple
        value={images}
        onChange={onChange}
        maxNumber={maxNumber}
        dataURLKey="data_url"
      >
        {({
          imageList,
          onImageUpload,
          onImageRemoveAll,
          onImageRemove,
          isDragging,
          dragProps,
        }) => (
          <ul className="h-full flex items-start justify-start flex-wrap">
            <button
              style={isDragging ? { color: 'red' } : null}
              onClick={onImageUpload}
              {...dragProps}
              className="font-medium px-3 py-1 text-gray-400 border hover:text-blue-500 hover:border-gray-300 transition-all w-56 h-40 m-3 overflow-hidden rounded-md flex items-center flex-col justify-center"
            >
              <CloudUploadIcon className="h-10 w-10" />
              Chọn hình ảnh hoặc kéo thả vào đây
            </button>

            {imageList.map((image, index) => (
              <li
                key={index}
                className="inline-block w-56 h-40 m-3 overflow-hidden rounded-md relative"
              >
                <img
                  src={image.data_url}
                  alt={image.file.name}
                  className="w-full h-full object-cover"
                />
                <XIcon
                  className="bg-createContent-lightBlueClr rounded-full h-8 w-8 p-1 text-gray-100 transition-all cursor-pointer hover:text-createContent-blackClr absolute top-1 right-2"
                  onClick={() => onImageRemove(index)}
                />
              </li>
            ))}
          </ul>
        )}
      </ReactImageUploading>
    </Scrollbar>
  );
}

const mapStateToProps = (state) => {
  return {
    imagesContent: state.createContent.imagesContent,
  };
};
export default connect(mapStateToProps, { setImagesContent })(GetImages);
