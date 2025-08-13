import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getScheduleContents,
  getScheduleContentsHomepage,
} from '../../../../../store/actions/Schedules';
import ScheduleSingle from './ScheduleSingle';
import moment from 'moment';

const responsive = {
  desktop: {
    breakpoint: { max: 4000, min: 1280 },
    items: 2,
  },
  tablet: {
    breakpoint: { max: 1280, min: 0 },
    items: 1,
  },
};
const ScheduleSlider = (props) => {
  const dispatch = useDispatch();
  const { loadingScheduleContents = false, schedules } = useSelector(
    (state) => state.homepage
  );

  const lengthItemNotEmpty = (schedules && schedules.length) || 0;
  const lengthItemEmpty = 6 - Number(lengthItemNotEmpty);
  const arrEmpty =
    lengthItemEmpty > 0
      ? [...Array(Number(lengthItemEmpty))].map((x, i) => {
          return {
            empty: true,
          };
        })
      : [];

  useEffect(() => {
    dispatch(
      getScheduleContentsHomepage(6, moment().utc(true).format('YYYY-MM-DD'))
    );
  }, [dispatch]);

  return (
    <div className="specialContents">
      <div className="sliderContents w-full">
        {loadingScheduleContents ? (
          <div className="w-full h-96 flex justify-center items-center">
            Đang lấy dữ liệu...
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {[...schedules, ...arrEmpty].map((item, idx) => {
              return <ScheduleSingle scheduleContent={item} key={idx} />;
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ScheduleSlider;
