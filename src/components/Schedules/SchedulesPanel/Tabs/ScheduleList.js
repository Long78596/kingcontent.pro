import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getSchedules,
  setCurrentSchedule,
} from '../../../../store/actions/Schedules';
import Select from 'react-select';

const ScheduleList = (props) => {
  const { schedules = null } = useSelector((state) => state.schedules);
  const [listSchedules, setListSchedules] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState(null);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!schedules) {
      dispatch(getSchedules(1));
    } else {
      const listOptions = [];
      schedules.map((item, idx) => {
        listOptions.push({ label: item?.name, value: item?.id });
      });
      // push default empty schedule
      listOptions.unshift({ label: 'Tất cả', value: '-1' });
      setSelectedSchedule(listOptions[0]);
      setListSchedules(listOptions);
    }
  }, [dispatch, schedules]);

  const onChange = (selected) => {
    setSelectedSchedule(selected);
    dispatch(setCurrentSchedule(selected.value));
  };
  return (
    <div className="flex items-center ml-auto gap-3 w-1/5 whitespace-nowrap">
      <label className="">Chọn lịch</label>
      <Select
        className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block min-w-28 h-9 whitespace-nowrap listScheduled w-full ml-auto"
        onChange={(selected) => {
          onChange(selected);
        }}
        options={listSchedules}
        placeholder="Chọn để lọc bài viết"
        defaultValue={selectedSchedule}
        value={selectedSchedule}
      />
    </div>
  );
};

export default ScheduleList;
