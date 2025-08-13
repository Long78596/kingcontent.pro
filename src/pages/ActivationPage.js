import React, { Fragment, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet';

const messageLink = 'https://m.me/kingcontentdream';

const ActivationPage = () => {
  const {
    loggedIn = false,
    token = '',
    user = null,
  } = useSelector((state) => state.userReducer);

  const [isOpened, setIsOpened] = useState(false);

  useEffect(() => {
    if (!isOpened) {
      setIsOpened(true);
      // Open the link in a new tab when the component mounts
      const newTab = window.open(messageLink, '_blank');
      if (newTab) {
        newTab.focus();
      }
    }
  }, []);


  return (
    <div className="py-4">
      {user && (
        <Fragment>
          <h2
            className="text-center"
            style={{
              fontFamily: `"Roboto", Sans-serif`,
              fontSize: '22px',
              fontWeight: 600,
            }}
          >
            Cảm ơn{' '}
            <span style={{ color: '#EF2020' }}>
              {user?.full_name} ({user?.id} : {user?.name})
            </span>
            , SĐT:{' '}
            <span style={{ color: '#EF2020' }}>{user?.phone_number}</span> đã
            đăng ký thành công tài khoản Kingcontent
          </h2>
          <a
            href="https://kingcontent.pro/dang-xuat"
            className="block p-3 text-center text-base text-red-500 font-bold uppercase"
          >
            Đăng xuất
          </a>
        </Fragment>
      )}
      <iframe
        src="https://xaynhom.com/yeu-cau-kich-hoat"
        title="Yêu cầu kích hoạt"
        width="100%"
        className="w-full h-screen"
      />
    </div>
  );
};

export default ActivationPage;
