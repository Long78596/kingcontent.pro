import React from 'react';
import SearchBox from '../../Threads/SearchBox';
import Manage from '../../Threads/Manage';

const Threads = (props) => {
  const { isAuto = false, handleAddToWaitingList = () => {} } = props;

  return (
    <>
      <SearchBox isSchedule={true} />
      <Manage
        isSchedule={true}
        isAuto={isAuto}
        handleAddToWaitingList={handleAddToWaitingList}
      />
    </>
  );
};

export default Threads;
