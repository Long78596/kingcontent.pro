import { connect, useDispatch, useSelector } from 'react-redux';
import { logoutFunction } from '../store/actions/user';
import { useHistory } from 'react-router';
import { useEffect } from 'react';

const Logout = (props) => {
  const loggedIn = useSelector((state) => state.userReducer.loggedIn);
  const history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(logoutFunction());
    history.push('/dang-nhap');
  }, []);

  return '';
};

export default Logout;
