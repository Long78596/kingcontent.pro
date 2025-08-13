import React, { useState } from 'react';
import { FiVideo } from 'react-icons/fi';
import Header from '../Trendings/Header';
import SearchBox from './SearchBox';
import Manage from './Manage';

const InstagramCpn = (props) => {
  const [totalContents, setTotalContents] = useState(0);

  return (
    <div className="pb-10">
      <Header
        totalTrendingContents={totalContents}
        title="Quản lý Instagram"
        icon={<FiVideo className="h-7 w-7 text-gray-50 font-semibold" />}
      />
      <SearchBox />
      <Manage />

      {/* <h2 className='text-center text-red-500 uppercase font-bold text-base py-60'>Chức năng tạm bảo trì để nâng cấp vì quá tải người dùng! Rất mong nhận được sự kiên nhẫn của quý khách!</h2> */}
    </div>
  );
};

export default InstagramCpn;
