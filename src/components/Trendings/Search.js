import React, { useEffect, useRef, useState } from 'react';
import { ImSearch } from 'react-icons/im';
import { MdClose } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { setKeywordsSearchTrendings } from '../../store/actions/Contents/trendingActions';

function Search(props) {  
  const { resetPageHandleSearch , setTotalPages } = props;
  const [ valueKeywords, setValueKeywords ] = useState('');

  const keywords = useSelector(state => state.trendings.keywords);  
  const inputRef = useRef();
  const dispatch = useDispatch();

  const handleChange = (evt) => setValueKeywords(evt.target.value);
  
  useEffect(() => {setValueKeywords(keywords)},[keywords]);

  const onSearch = () => {
    dispatch(setKeywordsSearchTrendings(valueKeywords));    
    resetPageHandleSearch();
  }
  
  const handleEmpty = () => { 
    setValueKeywords('');      
    dispatch(setKeywordsSearchTrendings(''))
    inputRef.current.focus();  
  }

  return (
    <div className="main my-2 px-2 py-1 bg-white flex items-center justify-between sm:flex-row flex-col">
      <div className="py-1 px-2 m-1 border border-gray-300 shadow-sm rounded-md flex items-center flex-row flex-grow w-full">
        <ImSearch className="h-6 w-6 text-gray-400" />
        <input
          ref={inputRef}
          className="border-0 outline-none rounded-md p-1 mx-1 w-full"
          type="text"
          placeholder="Nhập từ khoá tìm kiếm..."
          onChange={handleChange}
          value={valueKeywords}
        />
        <MdClose className="h-6 w-6 text-red-400 cursor-pointer" aria-hidden="true" onClick={handleEmpty} />
      </div>
      <div 
        onClick={onSearch}
        className="group py-2 px-4 m-1 rounded-md border bg-gray-400 hover:bg-red-400 transition-all duration-200 ease-linear cursor-pointer sm:w-24 w-full flex items-center justify-center ">
        <ImSearch className="h-6 w-6 text-gray-200 group-hover:text-gray-50 " />
      </div>
    </div>
  );
}

export default React.memo(Search);

