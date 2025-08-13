import React from 'react';
import { useDispatch } from 'react-redux';
import { VscSettingsGear } from 'react-icons/vsc';
import { changeStateShowManageSchedule } from '../../../../store/actions/Schedules';

const ManageScheduleTab = (props) => {
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(changeStateShowManageSchedule(true));
  };

  return (
    <div
      onClick={handleClick}
      className="group cursor-pointer inline-block px-2 py-2 ml-0.5 rounded-t-md font-bold select-none uppercase border text-white hover:bg-white hover:text-green-600 border-green-600"
      style={{ backgroundColor: '#30ac56' }}
    >
      <div className="flex items-center gap-2">
        <VscSettingsGear className="h-6 w-6" />
        <span>Quản lý</span>
      </div>
    </div>
  );
};

export default ManageScheduleTab;
