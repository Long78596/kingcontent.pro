import React, { useState } from 'react';
import { FiVideo } from 'react-icons/fi';
import Header from '../Trendings/Header';
import Manage from './Manage';
import SearchBox from './SearchBox';

const ThreadsCpn = (props) => {
  const [totalContents, setTotalContents] = useState(0);
  const [searchStatus, setSearchStatus] = useState(false);
  return (
    <div className="pb-10">
      <Header
        totalTrendingContents={totalContents}
        title="Quản lý Threads"
        icon={<FiVideo className="h-7 w-7 text-gray-50 font-semibold" />}
      />
      <SearchBox setSearchStatus={setSearchStatus} isFromManagePage={true} />
      <Manage />
    </div>
  );
};

export default ThreadsCpn;
