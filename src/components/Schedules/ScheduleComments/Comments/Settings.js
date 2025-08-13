import React, { useCallback, useEffect, useState } from 'react';
import { Label } from 'reactstrap';
import { DatePicker } from 'rsuite';
import { CalendarLocaleVn } from '../../../../helpers/date';
import Select from 'react-select';
import { useDispatch, useSelector } from 'react-redux';
import { setScheduleCommentsWaitingList } from '../../../../store/actions/Schedules';

// generate time options from 5 minutes to 2 hours
const generateTimeOptions = () => {
  const timeOptions = [];
  for (let index = 5; index <= 120; index += 5) {
    timeOptions.push({
      label: `${
        index >= 60
          ? `${Math.floor(index / 60)} giờ ${
              index % 60 === 0 ? '' : (index % 60) + ' phút'
            }`
          : `${index} phút`
      }`,
      value: index,
    });
  }
  return timeOptions;
};
const postPerDayOptions = generateTimeOptions();

const Settings = () => {
  const { scheduleCommentsWaitingList } = useSelector(
    // @ts-ignore
    (state) => state.schedules
  );
  const dispatch = useDispatch();

  // State local cho các trường form
  const [beginDate, setBeginDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [multipleTimeSpace, setMultipleTimeSpace] = useState(null);

  // Reset form nếu scheduleCommentsWaitingList rỗng
  useEffect(() => {
    const isEmpty =
      !scheduleCommentsWaitingList ||
      (typeof scheduleCommentsWaitingList === 'object' &&
        Object.keys(scheduleCommentsWaitingList).length === 0);
    if (isEmpty) {
      setBeginDate(new Date());
      setStartTime(new Date());
      setMultipleTimeSpace(null);
    } else {
      setBeginDate(
        scheduleCommentsWaitingList.begin_date
          ? new Date(scheduleCommentsWaitingList.begin_date)
          : new Date()
      );
      setStartTime(
        scheduleCommentsWaitingList.start_time
          ? new Date(scheduleCommentsWaitingList.start_time)
          : new Date()
      );
      setMultipleTimeSpace(
        scheduleCommentsWaitingList.multiple_timespace || null
      );
    }
  }, [scheduleCommentsWaitingList]);

  const onChangeSettings = useCallback(
    (type, value) => {
      switch (type) {
        case 'beginDate':
          setBeginDate(value);
          dispatch(
            setScheduleCommentsWaitingList({
              ...scheduleCommentsWaitingList,
              begin_date: value,
            })
          );
          break;

        case 'startTime':
          setStartTime(value);
          dispatch(
            setScheduleCommentsWaitingList({
              ...scheduleCommentsWaitingList,
              start_time: value,
            })
          );
          break;
        case 'multipleTimeSpace':
          setMultipleTimeSpace(value);
          dispatch(
            setScheduleCommentsWaitingList({
              ...scheduleCommentsWaitingList,
              multiple_timespace: value,
            })
          );
          break;

        default:
          break;
      }
    },
    [scheduleCommentsWaitingList, dispatch]
  );

  return (
    <div className="settingsContainer mt-4 flex items-center gap-2">
      <div className="beginDate w-4/12 flex flex-wrap items-center gap-2">
        <Label htmlFor="beginDate" className="whitespace-nowrap w-full">
          Chọn ngày đăng:
        </Label>
        <DatePicker
          format="DD-MM-YYYY"
          defaultValue={new Date()}
          locale={CalendarLocaleVn}
          isoWeek={true}
          className="w-full"
          onChange={(value) => onChangeSettings('beginDate', value)}
          value={beginDate}
        />
      </div>
      <div className="startTime flex flex-wrap items-center gap-2">
        <Label htmlFor="startTime" className="whitespace-nowrap w-full">
          Chọn thời gian bắt đầu:
        </Label>
        <DatePicker
          format="HH:mm"
          ranges={[]}
          className="w-full"
          defaultValue={new Date()}
          onChange={(value) => onChangeSettings('startTime', value)}
          value={startTime}
        />
      </div>
      <div className="multipleTimeSpace flex flex-wrap items-center gap-2">
        <Label htmlFor="multipleTimeSpace" className="whitespace-nowrap w-full">
          Thời gian cách nhau:
        </Label>
        <Select
          className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full"
          onChange={(selected) =>
            onChangeSettings('multipleTimeSpace', selected ? selected.value : null)
          }
          value={
            multipleTimeSpace
              ? postPerDayOptions.find(option => option.value === multipleTimeSpace)
              : null
          }
          options={postPerDayOptions}
          placeholder="--- Chọn thời gian ---"
        />
      </div>
    </div>
  );
};

export default Settings;
