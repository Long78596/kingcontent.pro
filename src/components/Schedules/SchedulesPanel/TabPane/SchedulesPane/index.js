import React from 'react';
import UserContents from './UserContents';
import WeekPane from './WeekPane';

function SchedulesPane(props) {
  return (
    <div className="bg-white">
      <WeekPane />
      <UserContents />
    </div>
  );
}

export default React.memo(SchedulesPane);