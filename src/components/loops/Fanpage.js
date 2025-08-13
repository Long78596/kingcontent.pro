import React from 'react';
import { Link } from 'react-router-dom';

const Fanpage = (props) => {
  const { fanpage } = props;
  const baseURL = process.env.API_URL;
  const fpThumbnail = fanpage.avatar ? fanpage.avatar.url : '';

  return (
    <Link
      className="group bg-gray-50 shadow-zenius rounded-zenius overflow-hidden py-3 px-4 relative opacity-80 hover:opacity-100 hover:bg-white transition-all duration-200 ease-linear"
      to={`/danh-muc/${fanpage.category.slug}?fb_id=${fanpage.fb_id}`}
    >
      <span className="absolute top-4 right-4 bg-red-600 text-white px-1.5 font-bold rounded-md leading-6">
        +0
      </span>
      <div className="flex justify-center">
        <div className="h-28 w-28 rounded-full shadow-sm mb-3 p-1 border border-solid border-gray-100">
          <img
            className="h-full w-full rounded-full overflow-hidden"
            src={baseURL + fpThumbnail}
          />
        </div>
      </div>
      <div className="font-bold">
        <h5 className="truncate mb-3 text-center  text-sm text-gray-700">
          {fanpage.name}
        </h5>
        <div className="flex justify-center">
          <button className="mb-1  text-sm bg-gray-200 rounded-md leading-8 px-3 flex items-center font-medium hover:bg-red-600 hover:text-white transition-all">
            <i className="ri-heart-line mr-2"></i>Lưu
          </button>
        </div>
      </div>
      <div className="lineTop absolute top-2 right-1 left-1 border-t-2 border-gray-300 border-solid origin-left transform scale-x-0 scale-y-100 transition duration-300 ease-linear opacity-0 group-hover:opacity-100 group-hover:transform group-hover:scale-100"></div>
      <div className="lineLeft absolute left-2 top-1 bottom-1 border-l-2 border-gray-300 border-solid origin-top transform scale-x-100 scale-y-0 transition duration-300 ease-linear opacity-0 group-hover:opacity-100 group-hover:transform group-hover:scale-100 "></div>
      <div className="lineBottom absolute bottom-2 right-1 left-1 border-b-2 border-gray-300 border-solid origin-right transform scale-x-0 scale-y-100 transition duration-300 ease-linear opacity-0 group-hover:opacity-100 group-hover:transform group-hover:scale-100"></div>
      <div className="lineRight absolute right-2 top-1 bottom-1 border-r-2 border-gray-300 border-solid origin-bottom transform scale-x-100 scale-y-0 transition duration-300 ease-linear opacity-0 group-hover:opacity-100 group-hover:transform group-hover:scale-100 "></div>
    </Link>
  );
};

export default Fanpage;
