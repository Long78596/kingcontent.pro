import React, { memo } from 'react';
import {
  EyeIcon,
  SaveIcon,
  CalendarIcon,
  ShieldCheckIcon,
} from '@heroicons/react/outline';

const ActionButtons = (props) => {
  const {
    canSave = false,
    handleOnSaveContent = () => {},
    handleOnPreviewContent,
  } = props;

  return (
    <div className="actions w-full">
      <div className="grid grid-cols-2 gap-3 my-3">
        <div>
          <button
            className="inline-flex items-center justify-center mx-auto border-none outline-none py-2 px-5 w-full cursor-pointer bg-createContent-blueClr text-createContent-whiteClr text-center font-semibold text-base rounded-md active:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!canSave}
            onClick={() => handleOnPreviewContent()}
          >
            <EyeIcon className="w-6 h-6 mr-1" />
            <span>Xem trước</span>
          </button>
        </div>
        <div>
          <button
            className="inline-flex items-center justify-center mx-auto border-none outline-none py-2 px-5 w-full cursor-pointer bg-createContent-blueClr text-createContent-whiteClr text-center font-semibold text-base rounded-md active:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!canSave}
            onClick={() => handleOnSaveContent()}
          >
            <SaveIcon className="w-6 h-6 mr-1" />
            <span>Lưu</span>
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 my-3">
        <div>
          <button
            className="inline-flex items-center justify-center mx-auto border-none outline-none py-2 px-5 w-full cursor-pointer bg-createContent-blueClr text-createContent-whiteClr text-center font-semibold text-base rounded-md active:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!canSave}
            onClick={() => handleOnSaveContent()}
          >
            <CalendarIcon className="w-6 h-6 mr-1" />
            <span>Đăng bài</span>
          </button>
        </div>
        <div>
          <button
            className="inline-flex items-center justify-center mx-auto border-none outline-none py-2 px-5 w-full cursor-pointer bg-createContent-blueClr text-createContent-whiteClr text-center font-semibold text-base rounded-md active:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!canSave}
            onClick={() => handleOnSaveContent()}
          >
            <ShieldCheckIcon className="w-6 h-6 mr-1" />
            <span>VPCS</span>
          </button>
        </div>
      </div>
    </div>
  );
};
export default memo(ActionButtons);
