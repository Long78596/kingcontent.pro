import React from 'react';
import { useDispatch } from 'react-redux';
import DouyinCpn from '../../components/DouyinCpn';

const Douyin = () => {
  const dispatch = useDispatch();

  return (
    <div>
      <DouyinCpn />
    </div>
  );
};

export default Douyin;
