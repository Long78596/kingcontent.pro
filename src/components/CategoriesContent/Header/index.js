import React from 'react';
import { FaSignal } from 'react-icons/fa';
import { GoEye } from 'react-icons/go';
import { useSelector } from 'react-redux';

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

function Header(props) {
  const categoriesName = useSelector((state) => state.contents.categoriesName);
  const totalContents = useSelector((state) => state.contents.totalContents);
  const totalFanpages = useSelector((state) => state.contents.totalFanpages);

  return (
    <div className="px-3 py-2 bg-blue-200 rounded-t-lg flex items-center justify-between cursor-default">
      <div className="ml-3 flex items-center">
        <GoEye className="h-5 w-5 text-blue-400 font-semibold" />
        <span className="ml-2 text-base text-gray-700 font-semibold filter drop-shadow-md ">
          {categoriesName ?? 'Not found data'}
        </span>
      </div>
      <div className="mr-3 flex items-center justify-between">
        <div className="flex items-center px-4 ">
          <FaSignal className="h-9 w-9 text-blue-400 transform rotateX-90" />
          <div className="ml-1 flex items-start flex-col text-gray-600">
            <h2 className="text-base font-semibold filter drop-shadow-md">
              {totalContents ? numberWithCommas(totalContents) : 0}
            </h2>
            <span className="font-medium">Contents</span>
          </div>
        </div>
        <div className="flex items-center px-4 ">
          <FaSignal className="h-9 w-9 text-blue-400 transform rotateX-90" />
          <div className="ml-1 flex items-start flex-col text-gray-600">
            <h2 className="text-base font-semibold filter drop-shadow-md">
              {totalFanpages ? numberWithCommas(totalFanpages) : 0}
            </h2>
            <span className="font-medium">Pages</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default React.memo(Header);
