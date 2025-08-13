import React, { useState } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import {
  actionEmptyArrSearch,
  actionSearchADS,
  actionUpdateKeyword,
} from '../../store/actions/runningAds';
import { toast } from 'react-toastify';

const SearchBox = ({ setLoading = () => {}, customSearch = null }) => {
  const dispatch = useDispatch();
  const [inputValue, setInputValue] = useState('');
  const onChangeValue = (e) => {
    setInputValue(e.target.value);
  };
  const onSearch = async (e) => {
    e.preventDefault();
    if (inputValue === '') toast.error('Vui lòng nhập nội dung tìm kiếm');
    else {
      dispatch(actionUpdateKeyword(inputValue));
      if (customSearch) customSearch(inputValue);
      else dispatch(actionSearchADS(inputValue, setLoading));
    }
  };
  const onClear = (e) => {
    e.preventDefault();
    setInputValue('');
    dispatch(actionEmptyArrSearch());
  };
  return (
    <div>
      <form className="flex gap-2 pt-3 mb-3" onSubmit={onSearch}>
        <input
          className="w-full h-14 rounded-md shadow-lg border-gray-300 border outline-none p-2"
          placeholder="Nhập nội dung tìm kiếm"
          value={inputValue}
          onChange={onChangeValue}
        />
        {inputValue !== '' ? (
          <button
            className="w-14 h-14 text-red-600 flex justify-center items-center rounded-lg hover:bg-gray-200 absolute right-20"
            type="button"
            onClick={onClear}
          >
            <FaTimes size={20} />
          </button>
        ) : null}
        <button
          className="w-14 h-14 bg-blue-600 text-white flex justify-center items-center rounded-lg hover:bg-blue-700"
          type="submit"
        >
          <FaSearch size={20} />
        </button>
      </form>
    </div>
  );
};

export default SearchBox;
