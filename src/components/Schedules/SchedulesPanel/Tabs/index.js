import React from 'react';
import ReportTab from './ReportTab';
import SchedulesTab from './SchedulesTab';
import ScheduleAuto from './ScheduleAuto';
import ScheduleComments from './ScheduleComments';
import ScheduleList from './ScheduleList';
import ManageScheduleTab from './ManageScheduleTab';

function Tabs() {
  return (
    <div className="tabs flex items-center text-gray-700 z-2000 relative">
      <SchedulesTab />
      <ReportTab />
      <ScheduleAuto />
      <ScheduleComments />
      <ManageScheduleTab />
      <ScheduleList />
    </div>
  );
}

export default Tabs;
