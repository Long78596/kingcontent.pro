import React from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
const Size = ({ onChangeSizeCanvas }) => {
  const sizes = [
    {
      name: 'Profile Picture',
      width: 180,
      height: 180,
    },
    {
      name: 'Cover Photo (Desktop)',
      width: 820,
      height: 312,
    },
    {
      name: 'Cover Photo (Mobile)',
      width: 640,
      height: 360,
    },
    {
      name: 'Shared Image',
      width: 1200,
      height: 630,
    },
    {
      name: 'Shared Link Image',
      width: 1200,
      height: 627,
    },
    {
      name: 'Highlight Image',
      width: 1200,
      height: 717,
    },
    {
      name: 'Group Cover Photo',
      width: 1640,
      height: 859,
    },
    {
      name: 'Facebook Ad Image',
      width: 1200,
      height: 628,
    },
    {
      name: 'Facebook Story Image',
      width: 1080,
      height: 1920,
    },
  ];

  return (
    <div className="text-black">
      <div className="flex items-center justify-between gap-2 mb-3">
        <input
          type="number"
          onChange={(e) => onChangeSizeCanvas(e.target.value)}
          className="border border-blue-500 w-2/3 rounded-lg transition-all ease-in-out duration-150"
          placeholder="Chiều rộng..."
        />
        <span className="font-bold text-white">X</span>
        <input
          type="number"
          onChange={(e) => onChangeSizeCanvas(null, e.target.value)}
          className="border border-blue-500 w-2/3 rounded-lg transition-all ease-in-out duration-150"
          placeholder="Chiều cao .."
        />
      </div>
      <PerfectScrollbar
        className="w-full grid-cols-2 grid gap-2"
        style={{ height: '70vh' }}
      >
        {sizes.map((data, index) => (
          <div
            key={index}
            className="mb-2 text-center cursor-pointer hover:bg-gray-900 rounded-md duration-200 ease-in-out"
            onClick={() => onChangeSizeCanvas(data.width, data.height)}
          >
            <div className="flex justify-center relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="106.667"
                height="106.667"
                version="1"
                fill="#fff"
                viewBox="0 0 80 80"
              >
                <path
                  d="M42 658c-17-17-17-499 0-516s699-17 716 0 17 499 0 516-699 17-716 0zm703-258V155H55l-3 235c-1 129 0 240 3 247 3 11 76 13 347 11l343-3V400z"
                  transform="matrix(.1 0 0 -.1 0 80)"
                ></path>
                <path
                  d="M90 600c0-5 5-10 10-10 6 0 10 5 10 10 0 6-4 10-10 10-5 0-10-4-10-10zM130 600c0-5 5-10 10-10 6 0 10 5 10 10 0 6-4 10-10 10-5 0-10-4-10-10zM170 600c0-5 5-10 10-10 6 0 10 5 10 10 0 6-4 10-10 10-5 0-10-4-10-10zM210 600c0-5 5-10 10-10 6 0 10 5 10 10 0 6-4 10-10 10-5 0-10-4-10-10zM570 600c0-5 5-10 10-10 6 0 10 5 10 10 0 6-4 10-10 10-5 0-10-4-10-10zM610 600c0-5 5-10 10-10 6 0 10 5 10 10 0 6-4 10-10 10-5 0-10-4-10-10zM650 600c0-5 5-10 10-10 6 0 10 5 10 10 0 6-4 10-10 10-5 0-10-4-10-10zM690 600c0-5 5-10 10-10 6 0 10 5 10 10 0 6-4 10-10 10-5 0-10-4-10-10zM90 560c0-5 5-10 10-10 6 0 10 5 10 10 0 6-4 10-10 10-5 0-10-4-10-10zM690 560c0-5 5-10 10-10 6 0 10 5 10 10 0 6-4 10-10 10-5 0-10-4-10-10zM90 520c0-5 5-10 10-10 6 0 10 5 10 10 0 6-4 10-10 10-5 0-10-4-10-10zM690 520c0-5 5-10 10-10 6 0 10 5 10 10 0 6-4 10-10 10-5 0-10-4-10-10zM90 480c0-5 5-10 10-10 6 0 10 5 10 10 0 6-4 10-10 10-5 0-10-4-10-10zM690 480c0-5 5-10 10-10 6 0 10 5 10 10 0 6-4 10-10 10-5 0-10-4-10-10zM90 320c0-5 5-10 10-10 6 0 10 5 10 10 0 6-4 10-10 10-5 0-10-4-10-10zM690 320c0-5 5-10 10-10 6 0 10 5 10 10 0 6-4 10-10 10-5 0-10-4-10-10zM90 280c0-5 5-10 10-10 6 0 10 5 10 10 0 6-4 10-10 10-5 0-10-4-10-10zM690 280c0-5 5-10 10-10 6 0 10 5 10 10 0 6-4 10-10 10-5 0-10-4-10-10zM90 240c0-5 5-10 10-10 6 0 10 5 10 10 0 6-4 10-10 10-5 0-10-4-10-10zM690 240c0-5 5-10 10-10 6 0 10 5 10 10 0 6-4 10-10 10-5 0-10-4-10-10zM90 200c0-5 5-10 10-10 6 0 10 5 10 10 0 6-4 10-10 10-5 0-10-4-10-10zM130 200c0-5 5-10 10-10 6 0 10 5 10 10 0 6-4 10-10 10-5 0-10-4-10-10zM170 200c0-5 5-10 10-10 6 0 10 5 10 10 0 6-4 10-10 10-5 0-10-4-10-10zM210 200c0-5 5-10 10-10 6 0 10 5 10 10 0 6-4 10-10 10-5 0-10-4-10-10zM570 200c0-5 5-10 10-10 6 0 10 5 10 10 0 6-4 10-10 10-5 0-10-4-10-10zM610 200c0-5 5-10 10-10 6 0 10 5 10 10 0 6-4 10-10 10-5 0-10-4-10-10zM650 200c0-5 5-10 10-10 6 0 10 5 10 10 0 6-4 10-10 10-5 0-10-4-10-10zM690 200c0-5 5-10 10-10 6 0 10 5 10 10 0 6-4 10-10 10-5 0-10-4-10-10z"
                  transform="matrix(.1 0 0 -.1 0 80)"
                ></path>
              </svg>
              <span className='absolute top-1/3 mt-2 left-1/5 font-bold text-md text-white'>{data.width}X{data.height}</span>
            </div>
            <span className="font-bold text-center text-white">
              {data.name}
            </span>
          </div>
        ))}
      </PerfectScrollbar>
    </div>
  );
};

export default Size;
