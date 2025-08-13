import React, { useCallback, useEffect, useState } from 'react';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import * as SCHEDULES from '../../store/actions/Schedules/index';

function Header(props) {
  const [month, setMonth] = useState(() => {
    const today = new Date();
    return today.getMonth() + 1;
  });

  const [year, setYear] = useState(() => {
    const today = new Date();
    return today.getFullYear();
  });

  const dispatch = useDispatch();
  const { valueMonth, valueYear, isChangeWeek } = useSelector(
    (state) => state.schedules
  );

  useEffect(() => {
    dispatch(SCHEDULES.setValueMonth(month));
    dispatch(SCHEDULES.setValueYear(year));
  }, []);

  useEffect(() => {
    if (isChangeWeek) {
      if (valueMonth !== month) {
        setMonth(valueMonth);
      }
      if (valueYear !== year) {
        setYear(valueYear);
      }
    }
  }, [isChangeWeek, valueMonth, valueYear]);

  const handleMonth = useCallback(
    (state) => {
      dispatch(SCHEDULES.setIsChangeWeek(false));
      dispatch(SCHEDULES.setIsChangeMonth(true));
      let tempMonth = month,
        tempYear = year;
      if (state === 'next') {
        if (month < 12) tempMonth += 1;
        else {
          tempMonth = 1;
          tempYear += 1;
        }
      } else {
        if (month > 1) tempMonth -= 1;
        else {
          tempMonth = 12;
          tempYear -= 1;
        }
      }
      setMonth(tempMonth);

      const tempDate = new Date(tempYear, tempMonth - 1, 1);
      dispatch(SCHEDULES.setValueFirstDayOfMonth(tempDate));

      dispatch(SCHEDULES.setValueMonth(tempMonth));
      if (tempYear !== year) {
        setYear(tempYear);
        dispatch(SCHEDULES.setValueYear(tempYear));
      }
    },
    [month, year]
  );

  return (
    <div className="relative bg-white rounded-md text-center p-2 select-none">
      <div className="uppercase text-base font-bold text-gray-700">
        {`Kế hoạch đăng bài tháng ${
          month > 9 ? month : `0${month}`
        } năm ${year}`}
      </div>
      <div className="absolute top-0 right-5 h-full flex items-center">
        <FaAngleLeft
          onClick={() => handleMonth('back')}
          className="h-7 w-7 pr-0.5 bg-gray-400 text-gray-200 rounded-sm mr-1 hover:text-white hover:bg-gray-500 cursor-pointer transition-all duration-200 ease-linear"
        />
        <FaAngleRight
          onClick={() => handleMonth('next')}
          className="h-7 w-7 pl-0.5 bg-gray-400 text-gray-200 rounded-sm mr-1 hover:text-white hover:bg-gray-500 cursor-pointer transition-all duration-200 ease-linear"
        />
      </div>
    </div>
  );
}

export default React.memo(Header);
