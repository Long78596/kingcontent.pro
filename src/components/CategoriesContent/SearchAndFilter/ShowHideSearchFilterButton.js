import React from 'react';
import { IoIosOptions } from 'react-icons/io';

function ShowHideSearchFilterButton(props) {
  const { onClick } = props;
  return (
    <div className="flex items-center" onClick={onClick}>
      <label
        htmlFor="myCheck"
        className="bg-blue-200 text-gray-500 p-1 mr-2 rounded-md inline-block cursor-pointer hover:text-gray-100 hover:bg-blue-400 transition-all duration-300 ease-linear"
      >
        <IoIosOptions className="h-8 w-8" />
      </label>
    </div>
  );
}

export default ShowHideSearchFilterButton;
