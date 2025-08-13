import React, { useState } from 'react';

const Download = ({ downloadImage, canvasToJson }) => {
  const LOCAL = 'LOCAL';
  const FILE = 'FILE';
  const [type, setType] = useState(LOCAL);
  const changeType = (type) => {
    setType(type);
  };
  const clickDownload = () => {
    switch (type) {
      case LOCAL:
        downloadImage();
        break;
      case FILE:
        canvasToJson();
        break;

      default:
        break;
    }
  };
  return (
    <div>
      <>
        <div className="flex items-center mb-4 gap-2">
          <input
            id="disabled-radio-1"
            type="radio"
            checked={type === LOCAL}
            name="disabled-radio"
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            onClick={() => changeType(LOCAL)}
          />
          <label
            htmlFor="disabled-radio-1"
            className="ms-2 font-medium text-white dark:text-gray-500"
          >
            Tải về máy
          </label>
        </div>
        <div className="flex items-center gap-2">
          <input
            checked={type === FILE}
            id="disabled-radio-2"
            type="radio"
            defaultValue=""
            name="disabled-radio"
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            onClick={() => changeType(FILE)}
          />
          <label
            htmlFor="disabled-radio-2"
            className="ms-2 font-medium text-white dark:text-gray-500"
          >
            Tải mẫu (Định dạng JSON)
          </label>
        </div>
      </>

      <button
        className="bg-blue-500 mt-5 hover:bg-red-500 rounded-md p-3 mt-2 w-full text-white font-bold"
        onClick={() => clickDownload()}
      >
        Tải xuống
      </button>
    </div>
  );
};

export default Download;
