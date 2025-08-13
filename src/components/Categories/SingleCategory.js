import React from 'react';
import defaultCatImg from '../../assets/images/default-cat-thumbnail.jpg';
import { numberWithCommas } from '../../utils/utilityFunc';

const SingleCategory = (props) => {
  const { category, isActive, onTogglePopup } = props;
  const baseURL = process.env.API_URL;
  const catThumbnail = category.image_url || defaultCatImg;
  const parentCat = category.parent || [];
  let {
    posts_count: countContents = 0,
    cate_name = '',
    cate_url,
    cate_id,
    tags = [],
  } = category;
  if (countContents == 0) countContents = Math.floor(Math.random() * 100000);
  const { cate_name: prName } = parentCat;

  const handleCategoryClick = () => {
    window.location.href = `/danh-muc/${cate_url}/${cate_id}`;
  };

  return (
    <div
      className="bg-white shadow-smBlackShadow rounded-md overflow-hidden p-3 cursor-pointer group"
    >
      <div onClick={handleCategoryClick}>
        <div className="rounded-md overflow-hidden mb-3">
          <img
            className="object-cover h-52 w-full opacity-80 group-hover:transform group-hover:scale-110 group-hover:opacity-100 transition-all duration-500 ease-linear"
            src={catThumbnail}
          />
        </div>
        <div className="text-left font-bold  text-sm text-gray-600 origin-center group-hover:text-gray-900 transition-all">
          <h4>{cate_name}</h4>
        </div>
        <div className="text-left text-gray-500 origin-center group-hover:text-gray-600 transition-all">
          <h5>Danh mục: {prName}</h5>
        </div>
        <div className="text-left text-gray-500 origin-center group-hover:text-gray-600 transition-all">
          <span>{numberWithCommas(countContents)} mẫu quảng cáo</span>
        </div>
      </div>
      <div
        className="mt-2"
        onClick={(e) => {
          e.stopPropagation();
          onTogglePopup();
        }}
      >
        <span className="text-gray-500 group-hover:text-gray-600 transition-all">
          🏷️ Từ khoá: {tags.slice(0, 3).map((tag) => tag.name).join(', ')}
          {tags.length > 3 && (
            <>
              , <span className="cursor-pointer text-blue-500">...</span>
            </>
          )}
        </span>
        {isActive && (
          <div
            className="absolute bg-white shadow-md rounded-md p-4 mt-2 z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-1 right-1 text-gray-500 hover:text-gray-700"
              onClick={onTogglePopup}
            >
              ✖
            </button>
            <h4 className="text-sm font-bold mb-2">Tất cả thẻ:</h4>
            <ul
              className="text-sm text-gray-700 max-h-40 overflow-y-auto"
            >
              {tags.map((tag) => (
                <li key={tag.id} className="py-1">
                  {tag.name}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default SingleCategory;
