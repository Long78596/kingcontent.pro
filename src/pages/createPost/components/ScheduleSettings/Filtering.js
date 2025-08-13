import React, { memo } from 'react';

const Filtering = (props) => {
  const { type, onFilterDestinations } = props;

  return (
    <div className="filterCategories w-full p-2 bg-white rounded-md mb-3 border flex">
      <input
        className="h-6 w-full outline-none bg-transparent"
        placeholder={`Tìm kiếm nhanh ${type} ...`}
        autoComplete="off"
        onChange={(evt) => onFilterDestinations(evt.target.value, type)}
      />
      <button className="ml-auto w-6 h-6">
        <i className="ri-search-line"></i>
      </button>
    </div>
  );
};

export default memo(Filtering);
