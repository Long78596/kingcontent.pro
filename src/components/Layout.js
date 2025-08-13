import React, { useEffect, useState } from 'react';

import Header from './Header.js';
import SideMenu from './SideMenu';
import Page from './Page.js';
import Footer from './Footer.js';
import auth from '../utils/auth.js';
import './general.css';
import { useDispatch } from 'react-redux';
import { getUserInfo } from '../store/actions/user/index.js';

const Layout = (props) => {
  const dispatch = useDispatch();
  const [showContactDropdown, setShowContactDropdown] = useState(false);
  
  useEffect(() => {
    dispatch(getUserInfo());
  }, [auth]);

  const handleContactClick = () => {
    setShowContactDropdown(!showContactDropdown);
  };

  const handleMessengerClick = () => {
    window.open('https://m.me/kingcontentdream', '_blank');
    setShowContactDropdown(false);
  };

  const handleZaloClick = () => {
    window.open('https://zalo.me/0704499995', '_blank');
    setShowContactDropdown(false);
  };

  return (
    <>
      <div
        className={`text-xs pb-2 ${auth.isNearlyExpired() ? 'pt-28' : 'pt-20'}`}
      >
        <Header />
        <SideMenu />
        <Page>{props.children}</Page>
        <Footer />
      </div>
      
      {/* Contact Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        {/* Contact Dropdown */}
        {showContactDropdown && (
          <div className="absolute bottom-16 right-0 bg-white border border-gray-200 rounded-lg shadow-lg p-2 flex flex-col gap-2 animate-in fade-in-0 zoom-in-95 duration-200">
            {/* Messenger */}
            <button
              onClick={handleMessengerClick}
              className="flex items-center justify-center p-2 hover:bg-gray-100 rounded-md transition-all duration-200 transform hover:scale-105 active:scale-95"
              title="Messenger nè"
            >
              <div className="bg-blue-500 hover:bg-blue-600 rounded-full p-2 transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/25">
                <svg 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="white"
                  xmlns="http://www.w3.org/2000/svg"
                  className="transition-transform duration-200 hover:rotate-12"
                >
                  <path d="M12 2C6.5 2 2 6.14 2 11.25C2 14.13 3.42 16.7 5.65 18.35V22L9.12 20.37C10.06 20.59 11.02 20.71 12 20.71C17.5 20.71 22 16.57 22 11.46C22 6.14 17.5 2 12 2ZM13.03 14.41L10.92 12.2L6.96 14.41L11.5 9.59L13.61 11.8L17.57 9.59L13.03 14.41Z"/>
                </svg>
              </div>
            </button>

            {/* Phone */}
            <button
              onClick={handleZaloClick}
              className="flex items-center justify-center p-2 hover:bg-gray-100 rounded-md transition-all duration-200 transform hover:scale-105 active:scale-95"
              title="Có Zalo nha"
            >
              <div className="bg-green-500 hover:bg-green-600 rounded-full p-2 transition-all duration-200 hover:shadow-lg hover:shadow-green-500/25">
                <svg 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="white"
                  xmlns="http://www.w3.org/2000/svg"
                  className="transition-transform duration-200 hover:rotate-12"
                >
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                </svg>
              </div>
            </button>
          </div>
        )}

         {/* Main Contact Button */}
        <div 
          className="cursor-pointer hover:scale-110 active:scale-95 transition-all duration-300 transform hover:rotate-6"
          onClick={handleContactClick}
          title={showContactDropdown ? "Đóng" : "Liên hệ"}
        >
          <div 
            className="rounded-full p-3 shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-[#F86D70]/30"
            style={{ 
              backgroundColor: '#F86D70',
              boxShadow: showContactDropdown ? '0 0 20px rgba(248, 109, 112, 0.5)' : undefined
            }}
          >
            <div className="relative w-8 h-8 flex items-center justify-center">
              <svg 
                width="32" 
                height="32" 
                viewBox="0 0 24 24" 
                fill="white"
                xmlns="http://www.w3.org/2000/svg"
                className={`transition-all duration-300 ${showContactDropdown ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'} absolute top-0 left-0`}
              >
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
              </svg>
              <svg 
                width="32" 
                height="32" 
                viewBox="0 0 24 24" 
                fill="white"
                xmlns="http://www.w3.org/2000/svg"
                className={`transition-all duration-300 ${showContactDropdown ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-90 scale-0'} absolute top-0 left-0`}
              >
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Layout;
