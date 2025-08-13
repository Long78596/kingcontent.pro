import React, { useCallback } from 'react';
import { Helmet } from 'react-helmet';
import SchedulesContents from '../components/Schedules';
import './styleSchedules.css';

function Schedules(props) {
  return (
    <>
      <Helmet>
        <title>Kế hoạch đăng bài</title>
      </Helmet>
      <SchedulesContents />
    </>
  );
}

export default React.memo(Schedules);
