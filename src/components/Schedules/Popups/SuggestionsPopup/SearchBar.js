import React, { useCallback, useState } from 'react';
import { BsGear } from 'react-icons/bs';

function SearchBar(props) {
  const { handleSortPanel, getQueryKeywords } = props;
  const [inputValue, setInputValue] = useState('');

  const handleChangeInput = (e) => {
    setInputValue(e.target.value);
  };

  const handleGetKeywords = useCallback(() => {
    getQueryKeywords(
      inputValue !== '' ? `&_where[content_contains]=${inputValue.trim()}` : ''
    );
  }, [inputValue]);

  return (
    <div className="flex items-center flex-row flex-nowrap my-1 mx-2">
      <div className="rounded-lg relative flex-grow flex flex-row flex-nowrap justify-between">
        <input
          className="px-2 w-full outline-none bg-transparent  text-sm flex-grow bg-white rounded-l-md"
          name="keyword"
          placeholder="Nhập từ khoá tìm kiếm..."
          value={inputValue}
          onChange={handleChangeInput}
        />
        <button
          onClick={handleGetKeywords}
          className=" w-10 h-10 bg-gray-400 text-gray-200 rounded-r-md hover:bg-primary hover:text-white transition-all duration-200 ease-linear"
        >
          <i className="ri-search-line  text-base font-bold"></i>
        </button>
      </div>

      <button
        className="w-10 h-10 bg-gray-400 text-gray-200 rounded-md hover:bg-primary hover:text-white transition-all duration-200 ease-linear flex items-center justify-center ml-3"
        onClick={handleSortPanel}
      >
        <BsGear className="text-white font-bold h-6 w-6 " />
      </button>
    </div>
  );
}

export default React.memo(SearchBar);
