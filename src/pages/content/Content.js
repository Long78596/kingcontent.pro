import { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useDispatch } from 'react-redux';
import ContentComponent from '../../components/Content';
const Content = () => {
  return (
    <>
      <Helmet>
        <title>Content đã thích</title>
      </Helmet>
      <ContentComponent />
    </>
  );
};

export default Content;
