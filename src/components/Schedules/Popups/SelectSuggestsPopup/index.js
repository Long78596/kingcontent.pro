import React, { useCallback, useState, useEffect, useRef } from 'react';
import { MdClose } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import SuggestList from './SuggestList';
import * as SCHEDULES from '../../../../store/actions/Schedules/index';

function SelectSuggestsPopup(props) {
  const dispatch = useDispatch();
  const showSelectSuggestsPopup = useSelector(
    (state) => state.schedules.showSelectSuggestsPopup
  );
  const [isActiveForm, setIsActiveForm] = useState(false);

  const closeForm = useCallback(() => {
    dispatch(SCHEDULES.setShowSelectSuggestsPopup(false));
  }, []);

  useEffect(() => {
    if (showSelectSuggestsPopup !== undefined) {
      setIsActiveForm(showSelectSuggestsPopup);
    }
  }, [showSelectSuggestsPopup]);

  return (
    <div className="min-w-screen h-screen fixed inset-0 z-9999 flex items-center justify-center">
      <div
        onClick={closeForm}
        className={`absolute inset-0 bg-black ${
          isActiveForm ? 'opacity-20' : 'opacity-0'
        } transition-all duration-300 ease-linear`}
      />
      <div
        className={`w-full max-w-5xl relative m-auto rounded-lg shadow-lg bg-gray-200 p-4 mt-16 transform origin-center ${
          isActiveForm ? 'opacity-100' : 'opacity-0'
        } transition-all duration-300 ease-linear`}
      >
        <MdClose
          onClick={closeForm}
          className="absolute top-3 right-3 w-7 h-7 rounded-full bg-gray-300 text-gray-400 p-1 hover:text-gray-800 hover:bg-gray-400 transition-all duration-200 ease-linear cursor-pointer"
        />
        <span className="text-gray-800 text-base font-bold p-1">
          LỰA CHỌN GỢI Ý PHÙ HỢP Ý TƯỞNG CỦA BẠN
        </span>

        <SuggestList />
      </div>
    </div>
  );
}

export default React.memo(SelectSuggestsPopup);
