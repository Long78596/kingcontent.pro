import React, { useState, useEffect } from 'react';
import { ImSearch } from 'react-icons/im';
import { MdClose } from 'react-icons/md';
import { useSelector } from 'react-redux';

function InputKeyWords(props) {
  const { keywordsToSearch, getAllPost, disabled, onSearch } = props;
  const [valueKeywords, setValueKeywords] = useState('');

  const keywords = useSelector(
    (state) => state.searchAndFilterContent.keywords
  );

  const handleChange = (evt) => {
    setValueKeywords(evt.target.value);
    keywordsToSearch(evt.target.value);
  };

  const onKeyDown = (evt) => {
    if (evt.key === 'Enter') {
      onSearch && onSearch();
    }
  };

  const handleEmpty = () => {
    setValueKeywords('');
    keywordsToSearch('');
    getAllPost && getAllPost();
  };

  useEffect(() => {
    if (keywords !== '') {
      setValueKeywords(keywords);
      keywordsToSearch(keywords);
    }
  }, [keywords]);

  return (
    <div className="py-1 px-2 border border-gray-300 shadow-sm rounded-md flex items-center flex-row xl:col-span-2 md:col-span-1 w-11/12">
      <ImSearch className="h-6 w-6 text-blue-400" />
      <input
        className="border-0 outline-none rounded-md p-1 mx-1 w-full"
        type="text"
        placeholder="Nhập nội dung fanpage cần tìm ..."
        onChange={handleChange}
        onKeyDown={onKeyDown}
        value={valueKeywords}
      />
      <MdClose
        className="h-6 w-6 text-red-400 cursor-pointer"
        aria-hidden="true"
        onClick={handleEmpty}
      />
    </div>
  );
}

export default React.memo(InputKeyWords);
