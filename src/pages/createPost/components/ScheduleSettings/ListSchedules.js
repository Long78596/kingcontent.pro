import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';
import Select from 'react-select';
import { Input, Label } from 'reactstrap';
import { getSchedules } from '../../../../store/actions/Schedules';

const style = {
  control: (base) => ({
    ...base,
    'input:focus': {
      boxShadow: 'none',
    },
  }),
};

const ListSchedules = (props) => {
  const {
    selectedSchedule,
    setSelectedSchedule,
    scheduleName,
    setScheduleName,
  } = props;

  const [isShowBody, setIsShowBody] = useState(true);
  const [scheduleOptions, setScheduleOptions] = useState([]);

  const { isSchedulesLoading = false, schedules = null } = useSelector(
    (state) => state.schedules
  );

  const dispatch = useDispatch();

  useEffect(() => {
    if (!schedules) {
      dispatch(getSchedules(1));
    } else {
      const listOptions = [
        {
          label: '--- Chọn hoặc thêm bên dưới để tạo mới ---',
          value: 0,
        },
      ];
      schedules.map((item, idx) => {
        listOptions.push({ label: item?.name, value: item?.id });
      });
      setScheduleOptions(listOptions);
    }
  }, [dispatch, schedules]);

  const onClickShowBody = useCallback(() => {
    setIsShowBody((state) => !state);
  }, []);

  const onChangeSchedule = useCallback((value) => {
    setSelectedSchedule(value);
  }, []);

  const onChangeScheduleName = useCallback((value) => {
    setScheduleName(value);
  }, []);

  return (
    <div
      className={`schedulesContainer m-2 ${
        isShowBody ? '' : 'overflow-hidden'
      }`}
    >
      <div
        className="title p-3 font-bold text-base uppercase mb-2 cursor-pointer border rounded-md flex items-center"
        onClick={() => onClickShowBody()}
      >
        <h4>Chọn lịch</h4>
        {isShowBody ? (
          <FaAngleUp className="ml-auto" />
        ) : (
          <FaAngleDown className="ml-auto" />
        )}
      </div>

      <div
        className={`body   duration-300 ease-in-out ${
          isShowBody ? 'h-auto p-3 border' : 'h-0'
        }`}
      >
        <Select
          className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full mb-3"
          onChange={(selected) => onChangeSchedule(selected.value)}
          options={scheduleOptions}
          placeholder="--- Chọn hoặc thêm bên dưới để tạo mới ---"
          value={scheduleOptions.find((obj) => obj.value === selectedSchedule)}
        />
        <div className="newSchedule">
          <Label className="p-2 mb-2 font-bold" htmlFor="schedule_name">
            Thêm lịch mới
          </Label>
          <Input
            name="schedule_name"
            id="schedule_name"
            placeholder="Tên lịch mới"
            className="w-full p-3 border rounded-md"
            onChange={(evt) => onChangeScheduleName(evt.target.value)}
            value={scheduleName}
          />
        </div>
      </div>
    </div>
  );
};
export default ListSchedules;
