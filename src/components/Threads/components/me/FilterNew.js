import React from 'react';
import Select from 'react-select';

const Filter = (props) => {
  const { search, setSearch, setMediaType, setDateOrder, setLikesOrder } = props;
  
  return (
    <div className="quickFilter">
      <label className="mb-2 pl-1 font-bold">
        Lọc, sắp xếp nhanh bài viết
      </label>
      {/* search box */}
      <div className="flex flex-row gap-3 p-1">
        <input
          type="text"
          placeholder="Tìm kiếm nhanh nội dung"
          className="border border-gray-300 rounded-md p-2 w-1/4"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {/* media type */}
        <Select
          name="media_type"
          id="media_type"
          className="w-1/4"
          options={[
            { value: 'all', label: 'Tất cả' },
            { value: 'image', label: 'Hình ảnh' },
            { value: 'video', label: 'Video' },
            { value: 'no_media', label: 'Chữ' },
          ]}
          placeholder="Loại bài viết"
          onChange={(selected) => setMediaType(selected.value)}
        />
        {/* date order */}
        <Select
          name="date_order"
          id="date_order"
          className="w-1/4"
          options={[
            { value: '', label: 'Mặc định' },
            { value: 'desc', label: 'Mới nhất' },
            { value: 'asc', label: 'Cũ nhất' },
          ]}
          placeholder="Ngày đăng"
          onChange={(selected) => setDateOrder(selected.value)}
        />
        {/* likes order */}
        <Select
          name="likes_order"
          id="likes_order"
          className="w-1/4"
          options={[
            { value: '', label: 'Mặc định' },
            { value: 'desc', label: 'Nhiều nhất' },
            { value: 'asc', label: 'Ít nhất' },
          ]}
          placeholder="Lượt thích"
          onChange={(selected) => setLikesOrder(selected.value)}
        />
      </div>
    </div>
  )
}

export default Filter;