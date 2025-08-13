import { memo, useCallback, useState } from 'react';
import {
  DownloadIcon,
  SaveIcon,
  PlusCircleIcon,
  RefreshIcon,
} from '@heroicons/react/outline';
import { useSelector } from 'react-redux';

const Actions = (props) => {
  const {
    setIsShowTypes,
    setIsShowSingleType,
    setIsShowModalTime,
    setIsShowModalMessage,
    setMessageType,
    handleClickDownload,
    handleClickSave,
    setMessageData,
  } = props;
  const [isShowOptions, setIsShowOptions] = useState(false);

  const { currentFeedback = 0 } = useSelector((state) => state.editor);

  const handleClickAdd = useCallback(() => {
    setIsShowOptions((v) => !v);
  }, []);

  const handleClickChangeType = useCallback(() => {
    setIsShowTypes(true);
    setIsShowSingleType(false);
  }, []);

  const handleClickNewMessage = useCallback((type) => {
    setIsShowModalMessage(true);
    setMessageType(type);
    setIsShowOptions(false);
    setMessageData(null);
  }, []);

  const handleClickNewTime = useCallback(() => {
    setIsShowModalTime(true);
    setIsShowOptions(false);
  }, []);

  return (
    <div className="actions w-full mb-3">
      <div className="flex items-center justify-center">
        <button
          className="inline-flex items-center justify-center mx-auto border-none outline-none p-4 w-1/2 cursor-pointer bg-createContent-blueClr text-createContent-whiteClr text-center font-semibold text-base rounded-md active:bg-blue-500 mr-5"
          onClick={(e) => handleClickDownload()}
        >
          <DownloadIcon className="w-6 h-6 mr-1" />
          <span>Tải ảnh về máy</span>
        </button>
        <button
          className="inline-flex items-center justify-center mx-auto border-none outline-none p-4 w-1/2 cursor-pointer bg-createContent-blueClr text-createContent-whiteClr text-center font-semibold text-base rounded-md active:bg-blue-500"
          onClick={(e) => handleClickSave()}
        >
          <SaveIcon className="w-6 h-6 mr-1" />
          <span>{currentFeedback ? 'Cập nhật' : 'Lưu lại'}</span>
        </button>
      </div>
      <div className="flex mt-3">
        <div className="relative mx-auto w-1/2 mr-5">
          {isShowOptions && (
            <div className="addOptions absolute bg-white rounded-lg py-2 top-12 left-0 right-0 mx-auto shadow-lg w-64 text-center z-20">
              <li
                className="block w-full p-2 cursor-pointer hover:bg-gray-200"
                onClick={() => handleClickNewMessage('send')}
              >
                Tin nhắn đi
              </li>
              <li
                className="block w-full p-2 cursor-pointer hover:bg-gray-200"
                onClick={() => handleClickNewMessage('receive')}
              >
                Tin nhắn đến
              </li>
              <li
                className="w-full p-2 cursor-pointer hover:bg-gray-200 hidden"
                onClick={() => handleClickNewTime()}
              >
                Mốc thời gian
              </li>
            </div>
          )}
          <button
            className="inline-flex items-center justify-center border-none outline-none p-4 cursor-pointer bg-red-500 text-createContent-whiteClr text-center font-semibold text-base rounded-md active:bg-blue-500 w-full"
            onClick={() => {
              handleClickAdd();
            }}
          >
            <PlusCircleIcon className="w-6 h-6 mr-1" />
            <span>Thêm</span>
          </button>
        </div>
        <button
          className="inline-flex items-center justify-center mx-auto border-none outline-none p-4 w-1/2 cursor-pointer bg-createContent-blueClr text-createContent-whiteClr text-center font-semibold text-base rounded-md active:bg-blue-500"
          onClick={() => {
            handleClickChangeType();
          }}
        >
          <RefreshIcon className="w-6 h-6 mr-1" />
          <span>Đổi giao diện</span>
        </button>
      </div>
    </div>
  );
};
export default memo(Actions);
