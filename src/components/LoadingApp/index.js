import React from 'react';
// import loadingIcon from '../../assets/images/loading/loading.gif';
const LoadingApp = (props) => {
  // add classname attribute
  const { className = '' } = props;
  return (
    <div className={`flex justify-center ${className}`}>
      {/* <img src={loadingIcon} /> */}
    </div>
  );
};

export default LoadingApp;
