import React from 'react';
import SearchBox from '../../DouyinCpn/SearchBox';
import Manage from '../../DouyinCpn/Manage';

const Douyin = (props) => {
  const { isAuto = false, handleAddToWaitingList = () => {} } = props;

  return (
    <>
      {/* <h2 className='text-center text-red-500 uppercase font-bold text-base py-32'>Chức năng tạm bảo trì để nâng cấp vì quá tải người dùng! Rất mong nhận được sự kiên nhẫn của quý khách!</h2> */}
      <SearchBox isSchedule={true} />
      <Manage
        isSchedule={true}
        isAuto={isAuto}
        handleAddToWaitingList={handleAddToWaitingList}
      />
    </>
  );
};

export default Douyin;
