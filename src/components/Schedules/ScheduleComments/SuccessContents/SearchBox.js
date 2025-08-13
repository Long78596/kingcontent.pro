import React, { useEffect, useState } from 'react';
import { FaTimes } from "react-icons/fa";
import { filter } from "lodash";

const SearchBox = (props) => {
  const {contents, setFilteredContents} = props;
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if(contents){
      let filtered = contents;
      if(inputValue === '') {
        filtered = contents;
      }else {
        filtered = filter(contents, (item) => {
          const {source_content = null, replaced_post_text = ''} = item;
          if(source_content){
            return source_content?.post_text?.toLowerCase().includes(inputValue.toLowerCase());
          }else{
            return replaced_post_text.toLowerCase().includes(inputValue.toLowerCase());
          }
        });
      }

      if(filtered) setFilteredContents([...filtered]);
    }
  }, [contents, inputValue]);

  const onChangeInput = (e) => {
    setInputValue(e.target.value);
  }

  const onClear = () => {
    setInputValue('');
  }

  return (
    <div className={`SearchBoxContainer flex items-center relative w-full mb-2 gap-2`}>
      <div className="searchInput w-full relative">
        <input
          className="w-full h-10 rounded-md border-gray-300 outline-none p-2 border"
          placeholder="Nhập từ khoá để tìm kiếm nhanh"
          value={inputValue}
          onChange={(e) => onChangeInput(e)}
        />
        {inputValue !== '' ? (
          <button
            className="w-8 h-8 text-red-600 flex justify-center items-center rounded-lg hover:bg-gray-200 absolute right-1 top-1"
            type="button"
            onClick={onClear}
          >
            <FaTimes size={20} />
          </button>
        ) : null}
      </div>
    </div>
  );
}

export default SearchBox;