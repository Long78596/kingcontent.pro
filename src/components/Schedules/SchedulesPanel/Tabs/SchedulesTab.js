import React, { useCallback, useState, useEffect } from 'react';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import { VscCalendar } from 'react-icons/vsc';
import { setShowSchedulesPane } from '../../../../store/actions/Schedules/index';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { add, endOfWeek, startOfWeek, sub } from 'date-fns';
import * as SCHEDULES from '../../../../store/actions/Schedules/index';

const getMonday = (date) => {
  const currentDate = startOfWeek(date);
  const monday = add(new Date(currentDate), { days: 1 });
  return monday;
};

const getSunday = (date) => {
  const currentDate = endOfWeek(date);
  const sunday = add(new Date(currentDate), { days: 1 });
  return sunday;
};

const getWeek = (monday) => {
  let tempWeek = [];
  for (let i = 0; i < 7; i++) {
    const date = add(new Date(monday), { days: i });
    tempWeek.push(date);
  }
  return tempWeek;
};

const SchedulesTab = (props) => {
  const dispatch = useDispatch();
  const showSchedulesPane = useSelector(
    (state) => state.schedules.showSchedulesPane
  );
  const isChangeMonth = useSelector((state) => state.schedules.isChangeMonth);
  const valueFirstDayOfMonth = useSelector(
    (state) => state.schedules.valueFirstDayOfMonth
  );
  const [isActive, setIsActive] = useState(true);

  const [monday, setMonday] = useState(getMonday(new Date()));
  const [sunday, setSunday] = useState(getSunday(new Date()));

  useEffect(() => {
    let newMonday = new Date();
    let newSunday = new Date();
    if (!isChangeMonth) {
      newMonday = monday;
      newSunday = sunday;
    } else {
      newMonday = getMonday(valueFirstDayOfMonth);
      newSunday = getSunday(valueFirstDayOfMonth);
      setMonday(newMonday);
      setSunday(newSunday);
    }
    dispatch(SCHEDULES.setValueMonday(newMonday));
    dispatch(SCHEDULES.setValueSunday(newSunday));
    dispatch(SCHEDULES.setValueWeek(getWeek(newMonday)));
  }, [isChangeMonth, valueFirstDayOfMonth]);

  useEffect(() => {
    if (showSchedulesPane !== undefined) setIsActive(showSchedulesPane);
  }, [showSchedulesPane]);

  const handleClick = () => {
    dispatch(setShowSchedulesPane(true));
  };

  const handleWeek = (state) => {
    dispatch(SCHEDULES.setIsChangeWeek(true));
    dispatch(SCHEDULES.setIsChangeMonth(false));
    let newMonday = new Date();
    let newSunday = new Date();
    if (state === 'next') {
      newMonday = add(new Date(monday), { days: 7 });
      newSunday = add(new Date(sunday), { days: 7 });
    } else if (state === 'back') {
      newMonday = sub(new Date(monday), { days: 7 });
      newSunday = sub(new Date(sunday), { days: 7 });
    }
    setMonday(newMonday);
    setSunday(newSunday);
    dispatch(SCHEDULES.setValueMonday(newMonday));
    dispatch(SCHEDULES.setValueSunday(newSunday));
    dispatch(SCHEDULES.setValueMonth(newSunday.getMonth() + 1));
    dispatch(SCHEDULES.setValueYear(newSunday.getFullYear()));
    dispatch(SCHEDULES.setValueWeek(getWeek(newMonday)));
  };

  return (
    <div
      onClick={handleClick}
      className={`scheduleTabs group cursor-pointer inline-block py-2 rounded-t-md select-none ${
        isActive ? 'bg-white' : 'bg-gray-300 opacity-80'
      }`}
    >
      <div className="flex items-center justify-between  text-sm font-bold ">
        <div className="flex items-center mx-3">
          <VscCalendar className="h-6 w-6 ml-1" />
          <span className="ml-2">Kế hoạch đăng bài</span>
        </div>

        <div className="flex items-center mx-3">
          <span className="mx-1">{`${monday.getDate()}/${
            monday.getMonth() + 1
          } - ${sunday.getDate()}/${sunday.getMonth() + 1}`}</span>
          <div className="flex items-center mx-1">
            <FaAngleLeft
              onClick={() => handleWeek('back')}
              className="h-5 w-5 pr-0.5 bg-gray-400 text-gray-200 rounded-sm mx-0.5 hover:text-white hover:bg-gray-500 cursor-pointer transition-all duration-200 ease-linear"
            />
            <FaAngleRight
              onClick={() => handleWeek('next')}
              className="h-5 w-5 pl-0.5 bg-gray-400 text-gray-200 rounded-sm mx-0.5 hover:text-white hover:bg-gray-500 cursor-pointer transition-all duration-200 ease-linear"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchedulesTab;
