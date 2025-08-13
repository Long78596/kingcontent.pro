import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import SchedulesPane from './SchedulesPane';
import ReportPane from './ReportPane';

function TabPane(props) {
  const showSchedulesPane = useSelector(state => state.schedules.showSchedulesPane);
  const [schedulesPane, setSchedulesPane] = useState(true);  

  useEffect(() => {
    if (showSchedulesPane!==undefined) setSchedulesPane(showSchedulesPane)    
  },[showSchedulesPane])  
    
  const renderPane = useCallback(() => {
    if (schedulesPane) {return <SchedulesPane />}
    else {return <ReportPane />}    
  },[schedulesPane]);

  return (
    <>
      {renderPane()}
    </>
  );
}

export default React.memo(TabPane);