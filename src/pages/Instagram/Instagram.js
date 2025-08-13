import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import InstagramCpn from '../../components/InstagramCpn';

const Instagram = () => {
  const dispatch = useDispatch();

  return (
    <div>
      <InstagramCpn />
    </div>
  );
};

export default Instagram;
