import React from 'react';
import { useDispatch } from 'react-redux';
import { VscCalendar } from 'react-icons/vsc';
import { setShowScheduleCommentsPopup } from '../../../../store/actions/Schedules';

const ScheduleComments = (props) => {
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(setShowScheduleCommentsPopup(true));
  };

  return (
    <div
      onClick={handleClick}
      className="group cursor-pointer inline-block px-2 py-2 ml-0.5 rounded-t-md font-bold select-none uppercase border bg-blue-500 text-white hover:bg-white hover:text-blue-500 border-blue-500 "
    >
      <div className="flex items-center gap-2">
        <VscCalendar className="h-6 w-6" />
        <span>Lên lịch comment</span>
      </div>
    </div>
  );
};

export default React.memo(ScheduleComments);
