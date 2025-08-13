import React, { useEffect, useState } from 'react';
import UserContentRow from './UserContentRow';
import { set, addMinutes, addHours } from 'date-fns';
import ScrollBar from 'react-perfect-scrollbar';
import {
  getAllEvents,
  getScheduleContents,
  getScheduledContents,
  getUserContents,
  getUserPlans,
} from '../../../../../store/actions/Schedules';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';

const d = new Date();
let startOfDate = set(new Date(d), { hours: 0, minutes: 0, seconds: 0 });
const stepHour = 1;

const renderUserContent = () => {
  let temp = [];
  let nextHour = startOfDate;
  for (let i = 0; i <= 23; i++) {
    const hour =
      nextHour.getHours() < 10
        ? '0' + nextHour.getHours()
        : nextHour.getHours();
    const time = `${hour}:00 - ${hour}:59`;
    const html = (
      <ul key={i} className="grid grid-cols-schedule scrollBar overflow-hidden">
        <li className="w-20 flex items-center justify-end whitespace-nowrap mr-2 font-medium text-xs">
          {time}
        </li>
        <UserContentRow hour={nextHour} />
      </ul>
    );
    temp.push(html);
    nextHour = addHours(new Date(nextHour), stepHour);
  }
  return temp;
};

const UserContents = (props) => {
  const dispatch = useDispatch();

  const {
    valueMonday,
    valueSunday,
    currentSchedule = null,
  } = useSelector((state) => state.schedules);

  useEffect(() => {
    dispatch(getUserContents());
    dispatch(getUserPlans());
    dispatch(getAllEvents());
    dispatch(getScheduledContents());
  }, []);

  useEffect(() => {
    if ((valueMonday && valueSunday) || currentSchedule) {
      const fromDate = moment(valueMonday).format('YYYY-MM-DD');
      const toDate = moment(valueSunday).format('YYYY-MM-DD');
      dispatch(getScheduleContents(0, '', fromDate, toDate, currentSchedule));
    }
  }, [valueMonday, valueSunday, currentSchedule]);
  return <div>{renderUserContent()}</div>;
};

export default UserContents;
