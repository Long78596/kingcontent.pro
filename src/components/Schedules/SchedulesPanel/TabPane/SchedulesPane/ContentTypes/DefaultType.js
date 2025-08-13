import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { GoPlus } from 'react-icons/go';
import moment from 'moment';
import { toast } from 'react-toastify';
import {
  setShowSourceIdeasPopup,
  updateSelectedDateTime,
} from '../../../../../../store/actions/Schedules';

function DefaultType(props) {
  const { hour, day } = props;
  const dispatch = useDispatch();

  const handleSelectSuggestsPopup = useCallback(() => {
    const selectedDate = `${moment(day).format('YYYY-MM-DD')} ${moment(
      hour
    ).format('HH:mm:ss')}`;
    const nextHour = moment(hour).add(1, 'hour');
    const time = new Date();
    if (moment(selectedDate) < time) {
      // Check if current time is between selected time and next hour
      if (moment(time).isBetween(selectedDate, nextHour)) {
        dispatch(setShowSourceIdeasPopup(true));
        // auto add 15 minutes to time and format to HH:mm:ss
        const newSelectedDate = `${moment(day).format('YYYY-MM-DD')} ${moment(
          time
        )
          .add(15, 'minutes')
          .format('HH:mm:ss')}`;
        dispatch(updateSelectedDateTime(newSelectedDate));
      } else {
        toast.error(
          `Bây giờ là ${moment(time).format(
            'HH:mm:ss DD-MM-YYYY'
          )}, vui lòng lên lịch đăng bài từ thời điểm này trở đi`
        );
      }
    } else {
      dispatch(setShowSourceIdeasPopup(true));
      dispatch(updateSelectedDateTime(selectedDate));
    }
  }, [dispatch, hour, day]);

  return (
    <li
      onClick={handleSelectSuggestsPopup}
      className="relative py-3 px-2 border cursor-pointer default-type"
    >
      <div className="relative flex flex-col items-center justify-between rounded-lg p-2">
        <div className="mt-1 w-24 h-24 rounded-full overflow-hidden ring-0 outline-none flex items-center">
          <GoPlus className="h-7 w-7 p-1 rounded-md m-auto border-2 border-gray-300 text-gray-300" />
        </div>
      </div>
    </li>
  );
}

export default React.memo(DefaultType);
