import React from 'react';
import { Label } from 'reactstrap';
import Select from 'react-select';
import { FaTimes } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { filter } from 'lodash';
import { confirmAlert } from 'react-confirm-alert';
import { useDispatch } from 'react-redux';
import { removeSchedules } from '../../../store/actions/Schedules';

const orderOptions = [
  {
    label: 'Thời gian tạo',
    value: 'date',
  },
  {
    label: 'Tên',
    value: 'name',
  },
];

const orderTypeOptions = [
  {
    label: 'Giảm dần',
    value: 'desc',
  },
  {
    label: 'Tăng dần',
    value: 'asc',
  },
];
// create new component to quick search and quick sort by date and name schedules
const SearchBox = (props) => {
  const {
    schedules,
    filteredSchedules,
    setFilteredSchedules,
    selectedSchedules = [],
    setSelectedSchedules,
  } = props;
  const [order, setOrder] = useState(orderOptions[0]);
  const [orderType, setOrderType] = useState(orderTypeOptions[0]);
  const [inputValue, setInputValue] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {
    if (schedules) {
      let filtered = schedules;
      if (inputValue === '') {
        filtered = schedules;
      } else {
        filtered = filter(schedules, (item) => {
          return item.name.toLowerCase().includes(inputValue.toLowerCase());
        });
      }

      switch (order.value) {
        case 'date':
          filtered = filtered.sort((a, b) => {
            if (orderType.value === 'asc') {
              return new Date(a.created) - new Date(b.created);
            } else {
              return new Date(b.created) - new Date(a.created);
            }
          });
          break;

        case 'name':
          filtered = filtered.sort((a, b) => {
            if (orderType.value === 'asc') {
              return a.name.localeCompare(b.name);
            } else {
              return b.name.localeCompare(a.name);
            }
          });
          break;

        default:
          filtered = schedules;
          break;
      }

      if (filtered) setFilteredSchedules([...filtered]);
    }
  }, [inputValue, order, orderType]);

  const onChangeInput = (e) => {
    setInputValue(e.target.value);
  };

  const onClear = () => {
    setInputValue('');
  };

  const onRemoveSchedule = () => {
    if (selectedSchedules.length > 0) {
      const schedulesIds = selectedSchedules.map((item) => item.id);
      confirmAlert({
        title: 'Xác nhận',
        message:
          'Bạn có chắc chắn muốn xoá lịch đã chọn? Toàn bộ bài viết trong lịch cũng sẽ bị xoá! Hãy cân nhắc trước khi thực hiện!',
        buttons: [
          {
            label: 'Tôi chắc chắn',
            onClick: () => {
              dispatch(removeSchedules(schedulesIds));
              setSelectedSchedules([]);
            },
          },
          {
            label: 'Không',
            onClick: () => {},
          },
        ],
      });
    }
  };

  return (
    <div
      className={`SearchBoxContainer flex items-center relative w-full mb-2 gap-2 ${
        filteredSchedules && filteredSchedules.length > 6 ? 'pr-4' : 'pr-2'
      }`}
    >
      <div className="w-2/3 flex items-center gap-2">
        <div className="searchInput relative w-1/2">
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
        {filteredSchedules && filteredSchedules.length > 0 && (
          <div className="flex items-center gap-2 ml-auto">
            <Label>
              Đã chọn: {selectedSchedules.length} / {filteredSchedules.length}
            </Label>
            <button
              className="btn border border-gray-400 rounded-lg p-2"
              onClick={() => setSelectedSchedules([])}
              disabled={selectedSchedules.length === 0}
            >
              Bỏ chọn
            </button>
            {/* select all button */}
            <button
              className="btn border bg-green-600 text-white rounded-lg p-2"
              onClick={() => setSelectedSchedules(filteredSchedules)}
              disabled={selectedSchedules.length === filteredSchedules.length}
            >
              Chọn tất cả
            </button>
            <button
              className="btn bg-red-500 text-white rounded-lg p-2"
              onClick={onRemoveSchedule}
              disabled={selectedSchedules.length === 0}
            >
              Xoá lịch
            </button>
          </div>
        )}
      </div>
      <div className="filter flex w-1/3 gap-2 justify-end">
        <div className="flex flex-nowrap items-center gap-2">
          <Label>Sắp xếp</Label>
          <Select
            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block"
            options={orderOptions}
            onChange={(e) => setOrder(e)}
            defaultValue={order}
          />
        </div>
        <div className="flex flex-nowrap items-center gap-2">
          <Label>Thứ tự</Label>
          <Select
            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block"
            options={orderTypeOptions}
            onChange={(e) => setOrderType(e)}
            defaultValue={orderType}
          />
        </div>
      </div>
    </div>
  );
};

export default SearchBox;
