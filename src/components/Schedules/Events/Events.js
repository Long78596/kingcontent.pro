import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Contents from './Contents';
import SingleCategory from './SingleEvent';

const Events = (props) => {
  const {
    isAuto = false,
    handleAddToWaitingList = () => {},
    isShowEditContentBtn,
  } = props;
  const dispatch = useDispatch();
  const { takeCareFBCategories = [] } = useSelector(
    (state) => state.categories
  );
  const { scheduleEvents, selectedEvent = null } = useSelector(
    (state) => state.schedules
  );

  return (
    <div>
      {selectedEvent ? (
        <Contents
          event={selectedEvent}
          handleAddToWaitingList={handleAddToWaitingList}
          isAuto={isAuto}
          isShowEditContentBtn={isShowEditContentBtn}
        />
      ) : (
        <div className="grid xl:grid-cols-6 gap-2 max-h-schedule overflow-auto pb-2 pt-3 px-3 lg:grid-cols-4 sm:grid-cols-2 md:grid-cols-3 grid-cols-1">
          {scheduleEvents.length > 0 &&
            scheduleEvents.map((event, i) => {
              return <SingleCategory key={i} event={event} />;
            })}
        </div>
      )}
    </div>
  );
};

export default Events;
