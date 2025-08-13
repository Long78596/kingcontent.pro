import React, { useEffect, useState } from 'react';
import { FaLayerGroup, FaTrash } from 'react-icons/fa';
import {
  KEY_EDITOR_IMAGE,
  KEY_INDEX_IMAGE_SELECT,
} from '../../../../reducers/createContent';
import { REDUX_NAME_CREATE_POST } from '../../../../utils/utilityFunc';
import { useSelector } from 'react-redux';
import { IoSaveSharp } from 'react-icons/io5';
import { isArrayEmpty } from '../../../../configs';
import { MdLibraryAdd } from 'react-icons/md';
import { IoMdArrowRoundBack } from 'react-icons/io';

const ToolBarTopRightButton = ({
  setLayerStatus,
  layerStatus,
  editor,
  removeObject,
  handleSaveEdit,
  resetCanvas,
  downloadImage,
  isSaveImage,
  setIsEditor,
  handleAddToEditor,
}) => {
  const {
    [KEY_EDITOR_IMAGE]: initalImage,
    [KEY_INDEX_IMAGE_SELECT]: indexImageSelect,
  } = useSelector((state) => state[REDUX_NAME_CREATE_POST]);

  return (
    <div className="flex items-center gap-3">
      {editor && editor.canvas.getActiveObject() && (
        <>
          <div
            className="bg-gray-500 p-2 gap-1 text-white rounded-md hover:bg-indigo-600 font-bold flex items-center hover:text-white"
            onClick={() => removeObject(5)}
            color="#2d1be4"
            tooltip="Remove"
          >
            <FaTrash size={20} />
            <span>Xoá</span>
          </div>
        </>
      )}
      {initalImage && window.location.pathnam !== '/chinh-sua-anh' && (
        <div>
          <button
            className="bg-gray-500 p-2 gap-2 text-white rounded-md hover:bg-indigo-600 font-bold flex items-center hover:text-white cursor-pointer"
            onClick={() => {
              setIsEditor(false);
              editor.deleteAll();
            }}
          >
            <IoMdArrowRoundBack size={20} />
            <span>Trở về trình soạn thảo</span>
          </button>
        </div>
      )}
      {editor && !isArrayEmpty(editor.canvas.getObjects()) && (
        <button
          className="bg-gray-500 p-2 text-white download-tool rounded-md hover:bg-indigo-600 font-bold flex items-center gap-2 hover:text-white"
          onClick={() => resetCanvas()}
          color="#2d1be4"
        >
          <MdLibraryAdd size={20} />
          <span>Tạo mới</span>
        </button>
      )}
      {indexImageSelect !== null ? (
        <button
          className="bg-gray-500 p-2 text-white download-tool rounded-md hover:bg-indigo-600 font-bold flex items-center gap-2 hover:text-white"
          onClick={() => handleSaveEdit()}
          color="#2d1be4"
          title="Lưu ảnh"
          disabled={isSaveImage}
        >
          <IoSaveSharp size={20} />
          <span>{isSaveImage ? 'Đang lưu ...' : 'Lưu hình ảnh'} </span>
        </button>
      ) : (
        <button
          className="bg-gray-500 p-2 text-white rounded-md hover:bg-indigo-600 font-bold flex items-center gap-2 hover:text-white"
          onClick={() => handleAddToEditor()}
          color="#2d1be4"
          title="Đưa vào trình soạn thảo"
        >
          <IoSaveSharp size={20} />
          <span>Lưu hình ảnh</span>
        </button>
      )}
      {!layerStatus && (
        <button
          className={`bg-gray-500 p-2 text-white download-tool rounded-md hover:bg-indigo-600 ${
            layerStatus && 'bg-indigo-600'
          } font-bold flex items-center gap-2 hover:text-white`}
          onClick={() => setLayerStatus(!layerStatus)}
          color="#2d1be4"
        >
          <FaLayerGroup size={20} />
          {/* <span>Thành phần</span> */}
        </button>
      )}
    </div>
  );
};

export default ToolBarTopRightButton;
