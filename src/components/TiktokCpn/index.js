import React, { useCallback, useEffect, useState } from 'react';
import { FiVideo } from 'react-icons/fi';
import Header from '../Trendings/Header';
import SearchBox from './SearchBox';
import client from '../../Client';
import Manage from './Manage';

const TiktokCpn = (props) => {
  const [totalContents, setTotalContents] = useState(0);
  const [searchStatus, setSearchStatus] = useState(false);

  return (
    <div className="pb-10">
      <Header
        totalTrendingContents={totalContents}
        title="Quản lý Tiktok"
        icon={<FiVideo className="h-7 w-7 text-gray-50 font-semibold" />}
      />
      <SearchBox setSearchStatus={setSearchStatus} isFromManagePage={true} />
      <Manage />
    </div>
  );
};

export default TiktokCpn;
