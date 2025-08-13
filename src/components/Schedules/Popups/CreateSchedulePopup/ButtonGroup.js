import React from 'react';
import { BsEyeFill } from 'react-icons/bs';
import { FaCalendarAlt } from 'react-icons/fa';
import { FiFileText } from 'react-icons/fi';

function ButtonGroup(props) {
  return (
    <div className="flex items-center justify-between mt-2">
      <button className="group text-black  text-sm font-semibold inline-flex items-center justify-center p-2 bg-gray-400 rounded-md w-full m-0.5 whitespace-nowrap opacity-80 hover:opacity-100 transition-all duration-200 ease-linear">
        <BsEyeFill className="text-white mr-2 w-6 h-6" />
        Xem trước
      </button>
      <button className="group text-black  text-sm font-semibold inline-flex items-center justify-center p-2 bg-yellowLabel rounded-md w-full m-0.5 whitespace-nowrap opacity-80 hover:opacity-100 transition-all duration-200 ease-linear">
        <FiFileText className="text-white mr-2 w-6 h-6" />
        Lưu
      </button>
      <button className="group text-black  text-sm font-semibold inline-flex items-center justify-center p-2 bg-greenSuccess rounded-md w-full m-0.5 whitespace-nowrap opacity-80 hover:opacity-100 transition-all duration-200 ease-linear">
        <FaCalendarAlt className="text-white mr-2 w-6 h-6" />
        Lên lịch
      </button>
    </div>
  );
}

export default ButtonGroup;
