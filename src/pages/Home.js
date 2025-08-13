import React from 'react';
import {Helmet} from "react-helmet";
import Homepage from '../containers/Homepage';

class Home extends React.Component {
	render() {
		return (
      <>
        <Helmet>
            <title>Target facebook &#8211; Content facebook &#8211; Mẫu quảng cáo &#8211; Thư viện mẫu Target facebook &amp; Mẫu Content facebook</title>
        </Helmet>
        <Homepage />
      </>
    );
  }
};

export default Home;
