import moment from 'moment';
import React, { useCallback } from 'react';
import { GoPlus } from 'react-icons/go';
import { HiStar } from 'react-icons/hi';
import { useDispatch, useSelector } from 'react-redux';
import defaultEventIcon from '../../../../../../assets/images/anh-cute-nhat.jpg';
import {
  setShowSourceIdeasPopup,
  updateSelectedDateTime,
  setCurrentScheduleContentType,
  setSelectedEvent,
} from '../../../../../../store/actions/Schedules';
import { toast } from 'react-toastify';
import { EVENT } from '../../../../../Schedules/Sourceldeas/utility';
import { searchEventByDate } from '../../../../../../utils/utilityFunc';

function EventType(props) {
  const { hour, day, event = null } = props;

  const { scheduleEvents, selectedEvent = null } = useSelector(
    (state) => state.schedules
  );
  const dispatch = useDispatch();

  const handleSelectSuggestsPopup = () => {
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
      dispatch(setCurrentScheduleContentType(EVENT));
      dispatch(setSelectedEvent(searchEventByDate(day, scheduleEvents)));
      dispatch(setShowSourceIdeasPopup(true));
      dispatch(updateSelectedDateTime(selectedDate));
    }
  };

  return (
    <li
      onClick={handleSelectSuggestsPopup}
      className="relative py-3 px-2 border cursor-pointer event-type"
    >
      <div className="relative flex flex-col items-center justify-between rounded-lg p-2">
        <div className="relative mt-1 w-24 h-24 rounded-full overflow-hidden ring-0 outline-none flex items-center">
          <img
            src={event?.event_icon}
            alt={event?.title || ''}
            className="w-full h-full object-cover"
          />
          <GoPlus className="absolute inset-0 bg-black h-8 w-8  rounded-md m-auto border-4 border-white text-white opacity-40 " />
        </div>
        <div className="mt-2 flex items-center">
          <span className="text-xs font-semibold rounded-md bg-yellowLabel p-1 text-center">
            {event?.title || ''}
          </span>
        </div>
      </div>
      <span className="absolute top-1 right-0">
        <HiStar className="h-6 w-6 text-gray-800" />
        <HiStar className="h-5 w-5 text-yellow-400 absolute left-0.5 top-0.5" />
      </span>
    </li>
  );
}

export default React.memo(EventType);
