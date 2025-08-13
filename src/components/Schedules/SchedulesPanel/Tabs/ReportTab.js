import React, { useCallback, useEffect, useRef, useState } from 'react';
import { GrPieChart } from 'react-icons/gr';
import {
  setShowSchedulesPane,
  setShowReportPane,
} from '../../../../store/actions/Schedules/index';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';

const ReportTab = (props) => {
  const dispatch = useDispatch();
  const showSchedulesPane = useSelector(
    (state) => state.schedules.showSchedulesPane
  );
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (showSchedulesPane !== undefined) setIsActive(!showSchedulesPane);
  }, [showSchedulesPane]);

  const handleClick = () => {
    dispatch(setShowSchedulesPane(false));
  };

  return (
    <div
      onClick={handleClick}
      className={`group cursor-pointer px-3 py-2 ml-0.5 rounded-t-md  text-sm font-bold select-none hidden ${
        isActive ? 'bg-white' : 'bg-gray-300 opacity-80'
      }`}
    >
      <div className="flex items-center">
        <GrPieChart className="h-6 w-6" />
        <span className="ml-2">Báo cáo</span>
      </div>
    </div>
  );
};

export default React.memo(ReportTab);
