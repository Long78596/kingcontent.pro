import React, { useState } from 'react';
import { FiVideo } from 'react-icons/fi';
import Header from '../Trendings/Header';
import Manage from './Manage';
import SearchBox from './SearchBox';

const DouyinCpn = (props) => {
  const [totalContents, setTotalContents] = useState(0);
  const [searchStatus, setSearchStatus] = useState(false);
  return (
    <div className="pb-10">
      <Header
        totalTrendingContents={totalContents}
        title="Quản lý Douyin"
        icon={<FiVideo className="h-7 w-7 text-gray-50 font-semibold" />}
      />
      <SearchBox setSearchStatus={setSearchStatus} isFromManagePage={true} />
      <Manage />
      {/* <h2 className='text-center text-red-500 uppercase font-bold text-base py-60'>Chức năng tạm bảo trì để nâng cấp vì quá tải người dùng! Rất mong nhận được sự kiên nhẫn của quý khách!</h2> */}
    </div>
  );
};

export default DouyinCpn;
