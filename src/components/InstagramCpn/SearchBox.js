import React, { useState } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import {
  actionGetHashtagPosts,
  actionGetUsers,
  actionSetCurrentCollection,
  actionSetCurrentContentType,
  actionSetCurrentUser,
} from '../../store/actions/instagram';
import { Button } from 'reactstrap';
import { toast } from 'react-toastify';
import IconInstagram from '../../assets/images/instagram.png';
import { listDefaultHashTag } from './helpers';

const SearchBox = (props) => {
  const dispatch = useDispatch();
  const [inputValue, setInputValue] = useState('');

  const onChangeValue = (e) => {
    setInputValue(e.target.value);
  };

  const onSearch = (e) => {
    e.preventDefault();
    if (inputValue === '') {
      toast.error('Vui lòng nhập từ khóa tìm kiếm');
      return;
    }
    dispatch(actionSetCurrentCollection(null));
    dispatch(actionSetCurrentUser(null));
    if (inputValue.includes('#')) {
      dispatch(actionSetCurrentContentType('post'));
      const hashtag = inputValue.replace('#', '');
      dispatch(actionGetHashtagPosts(hashtag));
    } else {
      dispatch(actionGetUsers(inputValue));
    }
  };

  const onClear = (e) => {
    e.preventDefault();
    setInputValue('');
  };

  const onTrending = () => {
    setInputValue('');
    const randomIndex = Math.floor(Math.random() * listDefaultHashTag.length);
    const randomHashTag = listDefaultHashTag[randomIndex];
    dispatch(actionGetHashtagPosts(randomHashTag));
    dispatch(actionSetCurrentContentType('post'));
    dispatch(actionSetCurrentCollection(null));
  };

  return (
    <div>
      <form className="flex gap-3 pt-3 mb-3" onSubmit={onSearch}>
        {/* trending button */}
        <button
          className="w-2/12 bg-primary text-white flex justify-center items-center rounded-lg gap-3 hover:bg-primaryHover"
          type="button"
          onClick={() => onTrending()}
        >
          <img
            src={IconInstagram}
            alt="icon-instagram"
            className="w-7 text-white"
          />
          <span className="text-xs">Thịnh hành</span>
        </button>
        <div className="flex items-center w-full relative">
          <input
            className="w-full h-14 rounded-md border-gray-300 outline-none p-2 border"
            placeholder="Tìm kiếm tên người dùng hoặc hashtag"
            value={inputValue}
            onChange={onChangeValue}
          />
          {inputValue !== '' ? (
            <button
              className="w-14 h-14 text-red-600 flex justify-center items-center rounded-lg hover:bg-gray-200 absolute right-1"
              type="button"
              onClick={onClear}
            >
              <FaTimes size={20} />
            </button>
          ) : null}
        </div>

        <Button
          className="w-20 h-14 bg-primary text-white flex justify-center items-center rounded-lg hover:bg-primaryHover"
          onClick={(e) => onSearch(e)}
        >
          <FaSearch size={20} />
        </Button>
      </form>
    </div>
  );
};

export default SearchBox;
