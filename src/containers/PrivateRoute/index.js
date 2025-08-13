/**
 *
 * PrivateRoute
 * Higher Order Component that blocks navigation when the user is not logged in
 * and redirect the user to login page
 *
 * Wrap your protected routes to secure your container
 */

import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';
import auth from '../../utils/auth';

// import auth from '../../utils/auth';

const PrivateRoute = (props) => {
  const { component: Component, ...rest } = props;
  const { loggedIn = false } = useSelector((state) => state.userReducer);

  return (
    <Route
      {...rest}
      render={(props) =>
        loggedIn ? (
          auth.isHasPermission() ? (
            <Component {...props} />
          ) : (
            <Redirect
              to={{
                pathname: '/yeu-cau-kich-hoat',
                state: { from: props.location },
              }}
            />
          )
        ) : (
          <Redirect
            to={{
              pathname: '/chua-kich-hoat',
              state: { from: props.location },
            }}
          />
        )
      }
    />
  );
};

export default PrivateRoute;
