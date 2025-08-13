import React from 'react';
import ContentType from './ContentTypes/ContentType';
import EventType from './ContentTypes/EventType';
import DefaultType from './ContentTypes/DefaultType';
import {
  FaCheck,
  FaQuestion,
  FaMinusCircle,
  FaPause,
  FaCheckCircle,
  FaExclamation,
} from 'react-icons/fa';
import { AiOutlineFieldTime } from 'react-icons/ai';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { FiPauseCircle } from 'react-icons/fi';

const stylesContentType = [
  { icon: FaCheckCircle, name: 'Thành công', bgColor: 'bg-greenSuccess' },
  { icon: AiOutlineFieldTime, name: 'Đang chờ', bgColor: 'text-gray-500' },
  { icon: FiPauseCircle, name: 'Đang tạm dừng', bgColor: 'text-red-500' },
  { icon: FaMinusCircle, name: 'Đã huỷ', bgColor: 'bg-redQuestion' },
  { icon: FaCheck, name: 'Thành công', bgColor: 'bg-greenSuccess' },
  { icon: FaExclamation, name: 'Đã có lỗi', bgColor: 'text-red-500' },
];

const findDayOfEvents = (day, eventList) => {
  let result = { find: 'false', index: 0 };
  eventList.forEach((event, i) => {
    const { event_date = '' } = event;
    const eventDate = new Date(event_date);
    if (moment(eventDate).format('MM/DD') === moment(day).format('MM/DD')) {
      result.find = true;
      result.index = i;
    }
  });
  return result;
};

const findDayOfUserContents = (day, contents, hour) => {
  let result = { find: false, index: 0, contents: [] };
  contents &&
    contents.length > 0 &&
    contents.forEach((content, i) => {
      const { date_publish = '' } = content;
      if (
        date_publish &&
        moment(date_publish).format('L') === moment(day).format('L') &&
        new Date(date_publish).getHours() === new Date(hour).getHours()
      ) {
        result.find = true;
        result.index = i;
        result.contents.push(content);
      }
    });
  return result;
};

const renderContent = (scheduleContents, hour, week, events) => {
  let isEvent = false;
  return week.map((day, i) => {
    const findContentResult = findDayOfUserContents(
      day,
      scheduleContents,
      hour
    );

    const findEventResult = findDayOfEvents(day, events);
    isEvent = findEventResult.find ?? false;
    const foundContents = findContentResult?.contents || [];

    if (findContentResult.find === true) {
      const isMultiple = foundContents.length > 1;
      const selectedContent = foundContents[0] || null;
      return (
        <ContentType
          hour={hour}
          day={day}
          contents={foundContents}
          isEvent={isEvent}
          key={i}
          isMultiple={isMultiple}
          styleContent={
            stylesContentType[
              selectedContent?.error_count > 2
                ? 5
                : parseInt(selectedContent.status) - 1
            ]
          }
        />
      );
    } else if (isEvent === true) {
      return (
        <EventType
          hour={hour}
          day={day}
          key={i}
          event={events[findEventResult.index] || null}
        />
      );
    } else return <DefaultType hour={hour} day={day} key={i} />;
  });
};

function UserContentRow(props) {
  const scheduleContents = useSelector(
    (state) => state.schedules.scheduleContents
  );
  const events = useSelector((state) => state.schedules.scheduleEvents);
  const week = useSelector((state) => state.schedules.valueWeek);
  const { hour } = props;
  return <>{renderContent(scheduleContents, hour, week, events)}</>;
}

export default React.memo(UserContentRow);
