import moment from 'moment';
import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import defaultCatImg from '../../../assets/images/default-cat-thumbnail.jpg';
import { numberWithCommas } from '../../../utils/utilityFunc';
import { setSelectedEvent } from '../../../store/actions/Schedules';

const SingleEvent = (props) => {
  const { event } = props;
  const baseURL = process.env.API_URL;
  const { event_date = '' } = event;
  const dispatch = useDispatch();

  const [displayDate, setDisplayDate] = useState('');

  useEffect(() => {
    if (event_date) {
      const date = `${moment(event_date).format('DD-MM')}-${moment().format(
        'YYYY'
      )}`;
      setDisplayDate(date);
    } else {
      setDisplayDate('');
    }
  }, [event_date]);

  const handleClickEvent = (event) => {
    dispatch(setSelectedEvent(event));
  };

  return (
    <Link
      to={`#`}
      className="bg-white shadow-smBlackShadow rounded-md overflow-hidden p-3 cursor-pointer group"
      onClick={(e) => handleClickEvent(event)}
    >
      <div className="flex justify-center">
        <img
          className="rounded-full"
          style={{ width: '150px' }}
          src={event?.event_icon || defaultCatImg}
        />
      </div>
      <div className="text-center mb-5 mt-5 font-bold  text-sm text-gray-600 origin-center group-hover:text-gray-900 transition-all">
        <h4>{event?.title || ''}</h4>
      </div>
      <div className="text-center text-gray-500 origin-center group-hover:text-gray-600 transition-all">
        <span>{displayDate}</span>
      </div>
    </Link>
  );
};

export default SingleEvent;
