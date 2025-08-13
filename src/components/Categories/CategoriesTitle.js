import { memo } from 'react';
import { FaSignal } from 'react-icons/fa';
import { GoEye } from 'react-icons/go';

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

const CategoriesTitle = (props) => {
  const { totalContents, totalFanpages } = props;

  return (
    <div className="categoriesTitle">
      <div className="px-3 py-2 bg-blue-200 rounded-t-md flex items-center justify-between cursor-default">
        <div className="ml-3 flex items-center">
          <GoEye className="h-5 w-5 text-blue-400 font-semibold" />
          <span className="ml-2 text-base text-gray-700 font-semibold filter drop-shadow-md ">
            Tất cả danh mục
          </span>
        </div>
      </div>
    </div>
  );
};

export default memo(CategoriesTitle);
