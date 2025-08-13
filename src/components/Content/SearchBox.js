import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { actionSearchContent } from '../../store/actions/contentUserLiked';
import { confirmAlert } from 'react-confirm-alert';
import Select from 'react-select';
import { toast } from 'react-toastify';
import { set } from 'lodash';

const SearchBox = (props) => {
  const { data, setSearchStatus } = props;
  const dispatch = useDispatch();
  const [inputValue, setInputValue] = useState('');
  const [selectedHashtag, setSelectedHashtag] = useState('');
  const [listHashTag, setListHashTag] = useState([]);
  const [allData, setAllData] = useState([]);

  useEffect(() => {
    if (data && data.length > 0) {
      setAllData(data);
      const newData = data.reduce((acc, current) => {
        const x = acc.find((item) => item.value === current.hashtag);
        if (!x) {
          return acc.concat([
            {
              value: current.hashtag,
              label: current.hashtag,
            },
          ]);
        } else {
          return acc;
        }
      }, []);
      // push default empty hashtag
      newData.unshift({ value: '', label: 'Tất cả' });
      setListHashTag(newData);
    }
  }, [data]);

  const onChangeValue = (e) => {
    setInputValue(e.target.value);
    if (e.target.value === '') {
      setSearchStatus(false);
    }
  };

  const onSearch = (e) => {
    e.preventDefault();
    if (inputValue || selectedHashtag) {
      let filterItem = data;
      if (inputValue) {
        filterItem = filterItem.filter((_elt) => {
          return (
            _elt?.post_text.toLowerCase().includes(inputValue) ||
            _elt?.post_header.toLowerCase().includes(inputValue)
          );
        });
      }
      if (selectedHashtag) {
        filterItem = filterItem.filter((_elt) => {
          return _elt.hashtag === selectedHashtag;
        });
      }
      if (filterItem.length !== 0) {
        setSearchStatus(true);
        dispatch(actionSearchContent(filterItem));
        toast.success('Tìm kiếm thành công !');
      } else {
        confirmAlert({
          title: 'Thông báo',
          message: 'Không tìm thấy kết quả , vui lòng tìm kiếm từ khoá khác !',
          buttons: [
            {
              label: 'OK',
              onClick: () => {},
            },
          ],
        });
      }
    } else {
      setSearchStatus(false);
    }
  };

  return (
    <form
      className="flex gap-2 pt-3 mb-5 items-center p-2 bg-white mt-2 rounded-lg"
      onSubmit={onSearch}
    >
      <input
        className="w-full rounded-md shadow-lg border-gray-300 border-[1px] outline-none p-3"
        placeholder="Nhập nội dung tìm kiếm"
        onChange={onChangeValue}
      />
      {/* show dropdown hashtag */}
      {listHashTag.length > 0 && false && (
        <Select
          className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-1/4 h-9 whitespace-nowrap likedHashTag"
          name="hashtag"
          onChange={(selected) => {
            setSelectedHashtag(selected.value);
          }}
          options={listHashTag}
          placeholder="Chọn hashtag"
        />
      )}
      <button
        className="w-14 p-3 bg-blue-600 shadow-lg text-white flex justify-center items-center rounded-lg hover:bg-blue-700"
        type="submit"
      >
        <FaSearch size={20} />
      </button>
    </form>
  );
};

export default SearchBox;
