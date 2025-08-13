import React from 'react';
import 'react-perfect-scrollbar/dist/css/styles.css';
import PerfectScrollbar from 'react-perfect-scrollbar';
import MenuItem from './MenuItem';
import { mainMenu } from './listMenu';
import auth from '../../utils/auth';

class SideMenu extends React.Component {
  render() {
    return (
      <aside
        className={`py-4 fixed left-2 w-16 bg-white rounded-md shadow-lg transform transition-all duration-200 ease-linear hover:w-64 overflow-hidden z-2000 ${
          auth.isNearlyExpired() ? 'top-28' : 'top-20'
        }`}
      >
        <div
          className="px-2 overflow-x-hidden overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 scrollbar-thumb-rounded-full scrollbar-track-rounded-full"
          style={{
            maxHeight: 'calc(100vh - 6.25rem)',
          }}
        >
          <ul className="overflow-x-hidden">
            {mainMenu.map((item, index) => {
              const {
                id = '',
                link = '',
                icon = '',
                name = '',
                blank = false,
              } = item;
              return (
                <MenuItem
                  key={index}
                  to={link}
                  id={id}
                  target={blank ? '_blank' : '_self'}
                >
                  <img
                    src={icon}
                    className={`text-center leading-8 block rounded-full text-base text-white ${
                      id === 'threads' ? 'h-9 w-9 ' : 'h-8 w-8 mr-2'
                    }`}
                    alt={name}
                    style={{ marginLeft: id === 'threads' ? '-3px' : 0 }}
                  />
                  <span
                    className={`${
                      id === 'tiktok' ? '' : id === 'threads' ? 'pl-3' : 'pl-2'
                    }  font-medium block`}
                  >
                    {name}
                  </span>
                </MenuItem>
              );
            })}
          </ul>
        </div>
      </aside>
    );
  }
}

export default SideMenu;
