import React from 'react';
import { Helmet } from 'react-helmet';

const topFanPages = () => {
  return (
    <>
      <Helmet>
        <title>Bảng xếp hạng</title>
      </Helmet>
      <iframe
        src="https://toiuufacebook.com/bang-xep-hang-top-30-fanpage-trieu-views-su-dung-kingcontent-pro-hieu-qua/"
        title="Bảng xếp hạng"
        width="100%"
        className="w-full h-screen"
      />
    </>
  );
};

export default topFanPages;
