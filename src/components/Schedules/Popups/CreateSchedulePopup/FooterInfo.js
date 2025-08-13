import React from 'react';
import { AiFillTag } from 'react-icons/ai';
import { BiTimeFive } from 'react-icons/bi';
import { ImLocation2 } from 'react-icons/im';

function FooterInfo(props) {
  return (
    <div className="bg-white p-1 rounded-md">
      <div className="flex items-center m-1">
        <BiTimeFive className="w-7 h-7 mr-2 text-gray-800 " />
        <span className="text-gray-800 font-bold  text-sm">
          19:00 - 21/9/2021
        </span>
      </div>
      <div className="flex items-center m-1">
        <AiFillTag className="w-7 h-7 mr-2 text-gray-800" />
        <span className="text-gray-800 font-bold  text-sm"># Tâm trạng</span>
      </div>
      <div className="flex items-center m-1">
        <ImLocation2 className="w-7 h-7 mr-2 text-gray-800" />
        <span className="text-gray-800 font-bold  text-sm">
          Nơi đăng: FanpageA + Fanpage B ...
        </span>
      </div>
    </div>
  );
}

export default FooterInfo;
