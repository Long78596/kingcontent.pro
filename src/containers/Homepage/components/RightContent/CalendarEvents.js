import moment from 'moment';
import { useCallback, useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import {
  getAllEvents,
  setCurrentDateTime,
  setCurrentScheduleContentType,
  setIsShowFinalStep,
  setSelectedEvent,
  setSelectedScheduleContent,
  setShowSourceIdeasPopup,
  updateSelectedDateTime,
} from '../../../../store/actions/Schedules';
import ModalEvent from './ModalEvent';
import { searchEventByDate, TYPE_GO_CHAT } from '../../../../utils/utilityFunc';
import { confirmAlert } from 'react-confirm-alert';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import ModalListEvent from './ModalListEvent';
import { ResourcesService } from '../../../../services/resources';
import { OK } from '../../../../configs';
import { EVENT } from '../../../../components/Schedules/Sourceldeas/utility';
const CalendarStyled = styled.div`
  .react-calendar {
    width: 100% !important;
    font-family: 'Quicksand', sans-serif;
    button {
      border-radius: 10px;
    }
    .react-calendar__tile,
    .react-calendar__month-view__days__day {
      font-size: 16px;
    }
    .react-calendar__month-view__days {
      width: 100%;
      display: inline-flex;
      flex-wrap: wrap;
      button {
        /* border : 2px solid #fff; */
        border: 5px solid #fff;
      }
    }
    .react-calendar__tile--active {
      /* height: 50px; */
    }
    .react-calendar__tile {
      /* margin-right: 1px; */
      line-height: 5px;
      transition: all 0.2s ease-in;
      font-weight: 400 !important;
      height: 10px !important;
      padding-top: 25px;
      padding-bottom: 25px;
      &:hover {
        background-color: #b0daff;
      }
    }
    .react-calendar__month-view__weekdays__weekday {
      color: #d21312;
      font-weight: 700;
    }
    span.react-calendar__navigation__label__labelText.react-calendar__navigation__label__labelText--from {
      font-family: 'Quicksand', sans-serif;
      font-size: 18px !important;
      font-weight: 600;
      text-transform: capitalize;
    }
    .highlight {
      color: #fff;
      border-radius: 20px;
    }
    .has-event {
      background-color: yellow;
    }

    .current-month {
      font-weight: bold;
    }
    button.react-calendar__tile.react-calendar__year-view__months__month.relative.highlight.rounded-full.bg-yellowLabel {
      /* margin-top: 10px; */
    }
  }
`;
const CalendarEvents = (props) => {
  const { scheduleEvents } = useSelector((state) => state.schedules);
  const [eventDates, setEventDates] = useState([]);
  const [isShowModal, setIsShowModal] = useState(false);
  const [isShowModalListEvent, setIsShowModalListEvent] = useState(false);
  const history = useHistory();
  const [currentEvent, setCurrentEvent] = useState(null);
  const { allEvents } = useSelector((state) => state.schedules);
  const [eventsSelected, setEventsSelected] = useState([]);
  const dispatch = useDispatch();
  useEffect(() => {
    if (!allEvents) {
      dispatch(getAllEvents());
    }
  }, [allEvents, dispatch]);

  useEffect(() => {
    if (scheduleEvents && scheduleEvents.length > 0) {
      const tempDate = scheduleEvents.reduce((acc, item) => {
        const { event_date } = item;
        const tempEventDate = moment(event_date).format('YYYY-MM-DD');
        acc.push(tempEventDate);
        return acc;
      }, []);
      setEventDates(tempDate);
    }
  }, [scheduleEvents]);

  const RenderTitle = (date, isHasEvent) => {
    return (
      <>
        {!isHasEvent ? (
          <div>
            Ngày <span className="font-bold text-red-600 w-full">{date}</span>{' '}
            chưa có sự kiện nào đặc biệt, bạn có muốn tiếp tục tạo lịch đăng bài
            vào ngày này không
          </div>
        ) : (
          <div>
            Có một sự kiện nhận được nhiều người quan tâm vào ngày{' '}
            <span className="font-bold text-red-600 w-full">{date}</span>, bạn
            có muốn đăng bài theo dòng sự kiện này không?
          </div>
        )}
      </>
    );
  };

  const hasEventInMonth = (date) => {
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return scheduleEvents.some((event) => {
      const event_date = new Date(event.event_date);
      const eventMonth = event_date.getMonth() + 1;
      const eventYear = event_date.getFullYear();
      return eventMonth == month && eventYear == year;
    });
  };
  const hasEventInYear = (date) => {
    const year = date.getFullYear();
    return scheduleEvents.some((event) => {
      const event_date = new Date(event.event_date);
      const eventYear = event_date.getFullYear();
      return eventYear == year;
    });
  };

  const onClickDay = useCallback(
    async (date) => {
      // check if date is in the past
      if (moment(date).isBefore(moment(), 'date')) {
        toast.error('Không thể chọn ngày để lên bài trong quá khứ');
        return;
      }

      const dateKey = moment(date).format('DD-MM-YYYY');
      const event = searchEventByDate(date, scheduleEvents);
      const isHasEvent = event ? true : false;
      confirmAlert({
        title: 'Thông báo',
        message: RenderTitle(dateKey, isHasEvent),
        buttons: [
          {
            label: 'Tiếp tục',
            onClick: async () => {
              // check if date is today
              let selectedDate = moment(date).format('YYYY-MM-DD 00:00');
              if (moment(date).isSame(moment(), 'date')) {
                // add 10 minutes to current time
                selectedDate = moment()
                  .add(10, 'minutes')
                  .format('YYYY-MM-DD HH:mm');
              }
              if (isHasEvent) {
                dispatch(setCurrentScheduleContentType(EVENT));
                dispatch(setSelectedEvent(event));
              }
              dispatch(updateSelectedDateTime(selectedDate));
              dispatch(setIsShowFinalStep(false));
              dispatch(setShowSourceIdeasPopup(true));
              history.push('/lich-dang-bai');
            },
          },
          {
            label: 'Huỷ',
            onClick: () => {},
          },
        ],
      });
    },
    [eventDates]
  );

  return (
    <div className="calendarEvents mt-3">
      <h4 className="uppercase font-bold text-base">Sự kiện tháng này</h4>
      <div className="calendar mt-3">
        {/* <h5 className="font-bold text-gray-600 text-base">{dateText}</h5> */}
        <div className="mt-3">
          <CalendarStyled>
            <Calendar
              className="border-0"
              value={new Date()}
              locale="vi-VN"
              next2Label={null}
              prev2Label={null}
              tileClassName={({ date, view }) => {
                if (view === 'year') {
                  return hasEventInMonth(date)
                    ? 'relative highlight rounded-full bg-yellowLabel text-white'
                    : '';
                }
                if (view === 'decade') {
                  return hasEventInYear(date)
                    ? 'relative highlight rounded-full bg-yellowLabel text-white'
                    : '';
                }
                if (view === 'month') {
                  if (
                    scheduleEvents.find(
                      (x) =>
                        moment(x.event_date).format('YYYY-MM-DD') ===
                        moment(date).format('YYYY-MM-DD')
                    )
                  ) {
                    return 'relative highlight rounded-full bg-yellowLabel text-white';
                  } else {
                    return 'relative';
                  }
                }
              }}
              onClickDay={(value, event) => onClickDay(value, event)}
            />
          </CalendarStyled>
        </div>
      </div>
      {isShowModal && (
        <ModalEvent
          event={currentEvent}
          setIsShowModal={setIsShowModal}
          isShowModal={isShowModal}
          type={TYPE_GO_CHAT}
        />
      )}
      {isShowModalListEvent && (
        <ModalListEvent
          setIsShowModal={setIsShowModalListEvent}
          isShowModal={isShowModalListEvent}
          events={eventsSelected}
        />
      )}
    </div>
  );
};

export default CalendarEvents;
