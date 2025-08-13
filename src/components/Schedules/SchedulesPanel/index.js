import React, { useState } from 'react';

import Tabs from './Tabs';
import TabPane from './TabPane';

function SchedulesPanel(props) {
  return (
    <div className="schedulesPanel flex-grow">
      <Tabs />
      <TabPane />
    </div>
  );
}

export default React.memo(SchedulesPanel);
