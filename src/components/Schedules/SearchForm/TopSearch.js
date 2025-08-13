import Select from 'react-select';
import React, { useEffect, useState } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { Label } from 'reactstrap';
import { videoTypeOptions } from '../../DouyinCpn/constants';

const TopSearch = (props) => {
  const {
    watch,
    register,
    setValue,
    onSearch,
    hashtag = 0,
    contents = null,
    isCreated = false,
  } = props;
  const [listHashtag, setListHashtag] = useState([]);

  useEffect(() => {
    if (hashtag && contents && contents.length > 0) {
      const list = contents.reduce((acc, item, idx) => {
        const { hashtag = '' } = item;
        if (hashtag) {
          // check exist hashtag
          const isExist = acc.find((elt) => elt.value === hashtag);
          if (!isExist) {
            acc.push({ value: hashtag, label: hashtag });
          }
        }
        return acc;
      }, []);
      // push default empty hashtag
      list.unshift({ value: '', label: 'Tất cả' });
      setListHashtag(list);
    }
  }, [contents, hashtag]);

  const onClear = () => {
    setValue('keyword', '');
    onSearch('', false);
  };

  return (
    <div className="flex gap-2 mb-3 items-center relative z-20">
      <div className="inputContainer w-full relative">
        <input
          className="w-full h-10 rounded-md shadow-lg border-gray-100 border-2 outline-none p-2"
          placeholder="Nhập nội dung tìm kiếm"
          required={false}
          {...register('keyword')}
        />
        {watch('keyword') !== '' ? (
          <button
            className="w-10 h-10 text-red-600 flex justify-center items-center rounded-lg hover:bg-gray-200 absolute right-1 top-0"
            type="button"
            onClick={onClear}
          >
            <FaTimes size={20} />
          </button>
        ) : null}
      </div>
      {/* show dropdown hashtag */}
      {hashtag && listHashtag.length > 0 ? (
        <div className="relative w-1/4 whitespace-nowrap">
          <Select
            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block"
            name="hashtag"
            onChange={(selected) => {
              setValue('hashtag', selected.value);
            }}
            options={listHashtag}
            placeholder="Chọn hashtag"
          />
        </div>
      ) : null}
      {isCreated && (
        <Select
          className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block min-w-editor"
          options={videoTypeOptions}
          name="videoType"
          onChange={(selected) => {
            setValue('videoType', selected.value);
          }}
          placeholder="Chọn loại video"
        />
      )}
      <button
        className="w-14 h-10 bg-blue-600 text-white flex justify-center items-center rounded-lg hover:bg-blue-700"
        type="submit"
      >
        <FaSearch size={20} />
      </button>
    </div>
  );
};

export default TopSearch;
