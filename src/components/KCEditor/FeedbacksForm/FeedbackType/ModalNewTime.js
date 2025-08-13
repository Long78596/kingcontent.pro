import { useCallback, useState } from 'react';
import { ClockIcon, PlusCircleIcon, XIcon } from '@heroicons/react/outline';

const ModalNewTime = (props) => {
  const { setIsShowModalTime } = props;
  const [timeValue, setTimeValue] = useState('18:52, TH 3');

  const handleChangeInput = useCallback((value) => {
    setTimeValue(value);
  }, []);

  const handleClickSubmit = useCallback(() => {
    alert(`set data ${timeValue}`);
  }, [timeValue]);

  return (
    <div className="modalNewTime z-9999 absolute top-0 left-0 right-0 h-screen bg-createContent-modalOverLayClr pt-28">
      <div className="mx-auto my-0 w-5/6 max-h-80 bg-gray-200 rounded-md shadow-md">
        <div className="text-right py-2 h-8 relative">
          <XIcon
            className="w-6 h-6 cursor-pointer absolute right-2 top-2"
            onClick={() => setIsShowModalTime()}
          />
        </div>
        <div className="py-1 px-2 mx-auto my-0.5 flex-grow border border-gray-300 shadow-sm rounded-md flex items-center flex-row w-5/6 bg-white mb-3">
          <ClockIcon className="h-5 w-5" />
          <input
            className="border-0 outline-none rounded-md p-1 mx-1 w-full text-center"
            type="text"
            placeholder="Fanpage ID..."
            onChange={(e) => handleChangeInput(e.target.value)}
            value={timeValue}
          />
        </div>
        <div className="w-full py-3 outline-none border-t border-gray-400 text-center">
          <button
            className="p-3 bg-createContent-blueClr text-white border rounded w-5/6 cursor-pointer flex items-center justify-center m-auto"
            onClick={() => {
              handleClickSubmit();
            }}
          >
            <PlusCircleIcon className="w-5 h-5 mr-2" />
            <span>Thêm mốc thời gian</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalNewTime;
