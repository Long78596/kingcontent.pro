import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import RunningAdsCpn from '../../components/RunningAdsCpn';
import TiktokCpn from '../../components/TiktokCpn';

const Tiktok = () => {
  const dispatch = useDispatch();

  return (
    <div>
      <TiktokCpn />
    </div>
  );
};

export default Tiktok;
