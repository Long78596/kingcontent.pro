import React from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { IoIosOptions } from 'react-icons/io';

const TopSearch = (props) => {
  const { watch, register, setValue, onShowExtraFilters } = props;

  const onClear = () => {
    setValue('keyword', '');
  };

  return (
    <div className="flex gap-2 mb-3">
      <div className="inputContainer w-full relative">
        <input
          className="w-full h-14 rounded-md shadow-lg border-gray-100 border-2 outline-none p-2"
          placeholder="Nhập nội dung tìm kiếm"
          {...register('keyword')}
        />
        {watch('keyword') !== '' ? (
          <button
            className="w-14 h-14 text-red-600 flex justify-center items-center rounded-lg hover:bg-gray-200 absolute right-1 top-0"
            type="button"
            onClick={onClear}
          >
            <FaTimes size={20} />
          </button>
        ) : null}
      </div>
      <button
        className="w-14 h-14 bg-blue-600 text-white flex justify-center items-center rounded-lg hover:bg-blue-700"
        type="submit"
      >
        <FaSearch size={20} />
      </button>
      <button
        className="w-14 h-14 bg-gray-500 text-white flex justify-center items-center rounded-lg hover:bg-gray-600"
        type="button"
        onClick={(e) => onShowExtraFilters()}
      >
        <IoIosOptions size={20} color="white" />
      </button>
    </div>
  );
};

export default TopSearch;
