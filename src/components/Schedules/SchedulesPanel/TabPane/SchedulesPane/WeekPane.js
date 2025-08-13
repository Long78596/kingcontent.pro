import React, { useEffect, useState } from 'react';
import { convertWeekdayToString } from '../../../../../utils/utilityFunc';
import moment from 'moment';
import { useSelector } from 'react-redux';
import auth from '../../../../../utils/auth';

function WeekPane(props) {
  const totalPerDay = auth.getMaxContentsByRole();
  const [contentsByDate, setContentsByDate] = useState([]);
  const { valueWeek = [], scheduleContents } = useSelector(
    (state) => state.schedules
  );

  useEffect(() => {
    if (scheduleContents && scheduleContents.length > 0) {
      let temp = [];
      valueWeek.forEach((date) => {
        const key = moment(date).format('YYYY-MM-DD');
        let contents = scheduleContents.filter((content) => {
          return moment(content.date_publish).format('YYYY-MM-DD') === key;
        });
        temp.push({ key, contents });
      });
      setContentsByDate(temp);
    }
  }, [scheduleContents]);

  const countContentsByDate = (dateKey) => {
    const contents = contentsByDate.find((item) => item.key === dateKey);
    return contents ? contents.contents.length : 0;
  };

  return (
    <div className="weekday grid grid-cols-schedule pt-2 mr-3 sticky top-16 bg-white z-50 shadow-sm">
      <div className="w-20 mr-2" />
      {valueWeek &&
        valueWeek.length > 0 &&
        valueWeek.map((date, i) => {
          const dateDisplay = moment(date).format('DD - MM');
          const dateKey = moment(date).format('YYYY-MM-DD');
          return (
            <div className="flex flex-col items-center py-1" key={dateKey}>
              <div className="flex gap-2 justify-center items-center">
                <span className="uppercase font-bold  text-sm text-gray-800">
                  {convertWeekdayToString(date)}
                </span>
                <span className="text-gray-600 font-medium">{dateDisplay}</span>
              </div>
              <div className="flex items-center justify-center">
                <span className="text-gray-600 font-bold">
                  Còn {totalPerDay - countContentsByDate(dateKey)}/{totalPerDay}
                </span>
              </div>
            </div>
          );
        })}
    </div>
  );
}

export default React.memo(WeekPane);
