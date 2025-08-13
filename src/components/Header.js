import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import HomepageSearchBar from '../containers/Homepage/components/SearchForm/HomepageSearchBar';
import Suggestions from '../containers/Homepage/components/SearchForm/Suggestions';
// @ts-ignore
import LogoKc from '../assets/images/KC_logo_transparent.png';
import { Menu, Transition } from '@headlessui/react';
// import { ChevronDownIcon } from '@ChevronDownIcon/react/20/solid'
import { Fragment } from 'react';
import { ChevronDownIcon } from '@heroicons/react/outline';
// @ts-ignore
import logo from '../assets/images/logo.jpg';
import { useDispatch, useSelector } from 'react-redux';
import { logoutFunction } from '../store/actions/user';
import auth from '../utils/auth';
import moment from 'moment';

const Header = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [isSearch, setIsSearch] = useState(false);
  // @ts-ignore
  const { user } = useSelector((state) => state.userReducer);
  const dispatch = useDispatch();
  function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
  }
  const handleLogout = () => {
    dispatch(logoutFunction());
  };

  return (
    <header className="fixed left-2 right-2 top-0 z-9999">
      <div className="py-2 px-4 h-16 flex items-center bg-white shadow-zenius w-full">
        <div className="flex items-center w-60">
          <Link to="/" className="flex">
            <img
              className="h-10 mr-3 rounded-md"
              src={LogoKc}
              alt="Kingcontent"
            />
          </Link>
        </div>
        <div className="flex-1 ml-4">
          {location.pathname !== '/' && (
            <div className="relative">
              <HomepageSearchBar
                setLoading={setLoading}
                setIsSearch={setIsSearch}
                isHome={false}
              />
              <Suggestions
                loading={loading}
                isSearch={isSearch}
                setLoading={setLoading}
                isHome={false}
              />
            </div>
          )}
        </div>
        <div className="flex gap-3">
          <Link to="/tao-bai-viet">
            <button className="h-10 flex items-center px-4 rounded-lg bg-red-600 text-white transform shadow-sm hover:shadow-md hover:scale-105 transition-all duration-350">
              <i className="ri-edit-fill mr-2"></i>
              Tạo content
            </button>
          </Link>
          <button className="h-10 w-10 rounded-full bg-blue-50 text-base text-blue-500 hover:text-blue-700 hover:bg-blue-100 transition-all duration-350">
            <i className="ri-notification-2-line"></i>
          </button>
          {/* ==========================BUTTON===================== */}
          <Menu as="div" className="relative inline-block text-left mr-6">
            <div>
              <Menu.Button className="flex items-center w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                <img
                  src={`${
                    user?.facebook_id
                      ? `https://graph.facebook.com/${user?.facebook_id}/picture?width=1000&height=1000`
                      : logo
                  }`}
                  alt=""
                  className="rounded-full"
                  width={30}
                  height={30}
                />
                <span>{user?.name}</span>
                <ChevronDownIcon
                  className="-mr-1 h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </Menu.Button>
            </div>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="py-1">
                  <Menu.Item 
                  // @ts-ignore
                  className="hover:bg-blue-600 hover:text-white">
                    {({ active }) => (
                      <Link
                        to="/user-info"
                        className={classNames(
                          active
                            ? 'bg-gray-100 text-gray-900'
                            : 'text-gray-700',
                          'block px-4 py-2 cursor-pointer '
                        )}
                      >
                        Thông tin tài khoản
                      </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item
                    // @ts-ignore
                    onClick={handleLogout}
                    className="hover:bg-blue-600 hover:text-white"
                  >
                    {({ active }) => (
                      <div
                        className={classNames(
                          active
                            ? 'bg-gray-100 text-gray-900'
                            : 'text-gray-700',
                          'block px-4 py-2 cursor-pointer '
                        )}
                      >
                        Đăng xuất
                      </div>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
      {/* add message when user nearly expired */}
      {auth.isNearlyExpired() && (
        <div
          className="absolute left-0 w-full"
          style={{
            top: '4.0625rem',
          }}
        >
          <div className=" text-white text-base font-bold px-2 py-1 rounded text-center bg-red-600">
            KHẨN CẤP: Tài khoản của bạn sẽ hết hạn vào{' '}
            {
              // get expired date
              auth.getUserInfo().date_expired
                // @ts-ignore
                ? new moment.unix(auth.getUserInfo().date_expired).format(
                    'DD/MM/YYYY'
                  )
                : ''
            }
            . Vui lòng bấm{' '}
            <a
              href="https://m.me/kingcontent.pro"
              target="_blank"
              className="underline"
            >
              VÀO ĐÂY
            </a>{' '}
            để xây trang bán hàng triệu views, GIẢM GIÁ NGAY 30%
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
