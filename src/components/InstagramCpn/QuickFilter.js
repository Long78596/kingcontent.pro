import React from 'react';
import { Label } from 'reactstrap';
import Select from 'react-select';
import { useDispatch } from 'react-redux';
import {
  actionSetOrderDir,
  actionSetOrderType,
  actionSetScheduleFilter,
} from '../../store/actions/instagram';
import { sortDirs, sortTypes } from './helpers';
import { ScheduleList } from '../Schedules/FilterForm/constant';
import { scheduleOptions } from '../Threads/constants';

const QuickFilter = (props) => {
  const { type = 'post', isSchedule = false } = props;

  const dispatch = useDispatch();

  const onChangeSortType = (value) => {
    dispatch(actionSetOrderType(value));
  };

  const onChangeSortDir = (value) => {
    dispatch(actionSetOrderDir(value));
  };

  const onChangeScheduleFilter = (value) => {
    dispatch(actionSetScheduleFilter(value));
  };

  return (
    <div className="quickFilter flex items-center">
      <div className="px-5 flex items-center gap-3">
        <Label>Sắp xếp</Label>
        <Select
          className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block"
          options={sortTypes}
          defaultValue={sortTypes[0]}
          onChange={(e) => onChangeSortType(e.value)}
        />
      </div>
      <div className="px-5 flex items-center gap-3">
        <Label>Thứ tự</Label>
        <Select
          className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block"
          options={sortDirs}
          defaultValue={sortDirs[0]}
          onChange={(e) => onChangeSortDir(e.value)}
        />
      </div>
      {isSchedule && (
        <div className="px-5 flex items-center gap-3">
          <Label>Lọc trùng lịch</Label>
          <Select
            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block"
            options={scheduleOptions}
            defaultValue={scheduleOptions[0]}
            onChange={(e) => onChangeScheduleFilter(e.value)}
          />
        </div>
      )}
    </div>
  );
};

export default QuickFilter;
