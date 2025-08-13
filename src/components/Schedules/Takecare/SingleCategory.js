import React, { useCallback } from 'react';
import { Link } from 'react-router-dom';
import defaultCatImg from '../../../assets/images/default-cat-thumbnail.jpg';
import { numberWithCommas } from '../../../utils/utilityFunc';

const SingleCategory = (props) => {
  const { category, setSelectedCat } = props;
  const baseURL = process.env.API_URL;
  const catThumbnail = category.image_url || defaultCatImg;
  const parentCat = category.parent || [];
  let {
    cate_id,
    posts_count: countContents = 0,
    cate_name = '',
    cate_url,
  } = category;
  if (countContents == 0) countContents = Math.floor(Math.random() * 100000);
  const { cate_name: prName } = parentCat;

  const handleClickCategory = useCallback(
    (category) => {
      setSelectedCat(category);
    },
    [setSelectedCat]
  );
  return (
    <Link
      to={`#`}
      className="bg-white shadow-smBlackShadow rounded-md overflow-hidden p-3 cursor-pointer group"
      onClick={(e) => handleClickCategory(category)}
    >
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
    </Link>
  );
};

export default SingleCategory;
