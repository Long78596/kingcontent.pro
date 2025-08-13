import React, { useCallback, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { AiFillFileWord, AiFillLike } from 'react-icons/ai';
import { FaCommentDots, FaShareSquare } from 'react-icons/fa';
import { ImArrowDown, ImArrowUp } from 'react-icons/im';
import { MdStyle } from 'react-icons/md';
import { RiTimeFill } from 'react-icons/ri';
import { useDispatch } from 'react-redux';
// import { setValueSortBy } from '@/store/actions/Schedules';

const componentsSort = [
  { icon: AiFillLike, title: 'Tần suất like', name: 'likes' },
  { icon: FaCommentDots, title: 'Tần suất comment', name: 'comments' },
  { icon: FaShareSquare, title: 'Tần suất share', name: 'shares' },
  { icon: RiTimeFill, title: 'Thời gian', name: 'post_timestamp' },
];

function FilterAndSort(props) {
  const { isActive, getQuerySortBy, getQueryFbId, getQueryKindOfContent } =
    props;
  const [valueAscending, setValueAscending] = useState('');
  const [valueDescending, setValueDescending] = useState('');
  const [valueFbId, setValueFbId] = useState('');
  const [valueKindOfContent, setValueKindOfContent] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {
    const updateFilterPaneMaxHeight = () => {
      const rootElm = ReactDOM.findDOMNode(document.body);
      const thisComponent = rootElm.querySelector('.sortFilter');
      if (isActive) {
        thisComponent.style.maxHeight = `${thisComponent.scrollHeight}px`;
      } else {
        thisComponent.style.maxHeight = null;
      }
    };
    updateFilterPaneMaxHeight();
    window.addEventListener('resize', updateFilterPaneMaxHeight);

    return () => {
      window.removeEventListener('resize', updateFilterPaneMaxHeight);
    };
  }, [isActive]);

  const handleValueAscending = useCallback(
    (name) => {
      if (valueAscending !== name) {
        setValueAscending(name);
        setValueDescending('');
        // dispatch(setValueSortBy({name: name, value: 'ASC'}))
        getQuerySortBy(`&_sort=${name}:ASC`);
      } else {
        setValueAscending('');
        getQuerySortBy('');
        // dispatch(setValueSortBy(null))
      }
    },
    [valueAscending]
  );

  const handleValueDescending = useCallback(
    (name) => {
      if (valueDescending !== name) {
        setValueDescending(name);
        setValueAscending('');
        // dispatch(setValueSortBy({name: name, value: 'DESC'}));
        getQuerySortBy(`&_sort=${name}:DESC`);
      } else {
        setValueDescending('');
        getQuerySortBy('');
        // dispatch(setValueSortBy(null));
      }
    },
    [valueDescending]
  );

  const onChangeInputFbId = (e) => {
    setValueFbId(e.target.value);
  };

  const handleQueryFbId = useCallback(() => {
    getQueryFbId(
      valueFbId !== ''
        ? `&_where[fanpage.fb_id_contains]=${valueFbId.trim()}`
        : ''
    );
  }, [valueFbId]);

  const onChangeDropSelect = (e) => {
    setValueKindOfContent(e.target.value);
  };

  useEffect(() => {
    getQueryKindOfContent(
      valueKindOfContent !== ''
        ? `&content_type_contains=${valueKindOfContent}`
        : ''
    );
  }, [valueKindOfContent]);

  return (
    <div
      className={`sortFilter mx-2 my-2 grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-2 origin-top max-h-0 ${
        !isActive ? 'overflow-hidden' : ''
      } transition-all duration-200 ease-linear`}
    >
      <div className="inline-flex items-center bg-white rounded-sm overflow-hidden select-none opacity-75 hover:opacity-100 transition-all duration-200 ease-linear">
        <AiFillFileWord className="w-10 h-10 min-w-10 p-2 text-white bg-editor-facebook opacity-60 mr-2" />
        <input
          value={valueFbId}
          onChange={onChangeInputFbId}
          type="text"
          className=" text-sm h-8 text-black font-semibold border-0 outline-none w-full mr-1"
          placeholder="Nhập fanpage Id"
        />
        <button
          onClick={handleQueryFbId}
          className=" w-10 h-10 bg-gray-400 text-gray-200 rounded-r-sm hover:bg-primary hover:text-white transition-all duration-200 ease-linear"
        >
          <i className="ri-search-line  text-base font-bold"></i>
        </button>
      </div>
      <div className="inline-flex items-center bg-white rounded-sm overflow-hidden select-none opacity-75 hover:opacity-100 transition-all duration-200 ease-linear">
        <MdStyle className="w-10 h-10 min-w-10 p-2 text-white bg-editor-facebook opacity-60 mr-2" />
        <select
          onChange={onChangeDropSelect}
          className=" text-sm h-9 text-black font-semibold border-0 outline-none w-full mr-1"
        >
          <option value="">Chọn loại content:</option>
          <option value="image">Hình ảnh</option>
          <option value="video">Video</option>
          <option value="feedback">Feedback</option>
          <option value="sale">Bán hàng</option>
          <option value="nonsale">Phi bán hàng</option>
          <option value="promotion">Promotion</option>
        </select>
      </div>
      {componentsSort.map((item, index) => (
        <div
          key={index}
          className="inline-flex items-center justify-between bg-white rounded-sm overflow-hidden select-none opacity-75 hover:opacity-100 transition-all duration-200 ease-linear"
        >
          <div className="flex items-center">
            <item.icon className="w-10 h-10 min-w-10 p-2 text-white bg-editor-facebook opacity-60 mr-2" />
            <span className=" text-sm text-gray-900 font-semibold">
              {item.title}
            </span>
          </div>
          <div className="flex items-center">
            <ImArrowUp
              onClick={() => handleValueAscending(item.name)}
              className={`w-7 h-7 mx-0.5 ${
                valueAscending === item.name
                  ? 'text-editor-facebook'
                  : 'text-gray-500'
              } hover:text-editor-facebook opacity-80 transition-all duration-200 ease-linear cursor-pointer`}
            />
            <ImArrowDown
              onClick={() => handleValueDescending(item.name)}
              className={`w-7 h-7 mx-0.5 ${
                valueDescending === item.name
                  ? 'text-editor-facebook'
                  : 'text-gray-500'
              } hover:text-editor-facebook opacity-80 transition-all duration-200 ease-linear cursor-pointer`}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default React.memo(FilterAndSort);
