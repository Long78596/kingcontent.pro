import React, { useEffect } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { capitalizeFirstLetter, _LIMIT_DEFAULT } from '../../configs';
import {
  actionChangeStatus,
  actionGetAllFanpage,
  actionIsLoading,
  actionSaveCategory,
  actionSearchFanpage,
  actionSearchFanpagesByCategories,
  actionSearchFanpagesByName,
} from '../../store/actions/Fanpages';
import {
  AMOUNT_SORT,
  ASCENDING,
  ASCENDING_LIKE,
  DECREASE,
  FANPAGE_SORT,
  NEW_TO_OLD,
  SAVED_SORT,
} from './utility';
import { FiRefreshCw } from 'react-icons/fi';
import styled from 'styled-components';
const customStyles = {
  control: (base) => ({
    ...base,
    height: 56,
    minHeight: 56,
  }),
};
const SelectStyled = styled(Select)`
  [type='text']:focus,
  [type='email']:focus,
  [type='url']:focus,
  [type='password']:focus,
  [type='number']:focus,
  [type='date']:focus,
  [type='datetime-local']:focus,
  [type='month']:focus,
  [type='search']:focus,
  [type='tel']:focus,
  [type='time']:focus,
  [type='week']:focus,
  [multiple]:focus,
  textarea:focus,
  select:focus {
    outline-offset: 0px !important;
    --tw-ring-offset-width: 0px;
    --tw-ring-color: none !important;
  }
`;
const Filter = ({
  dataDefault,
  data,
  categorySelect,
  setCategorySelect,
  fanpageByTime,
  setFanpageByTime,
  amountSelect,
  setAmountSelect,
  saveSelect,
  setSaveSelect,
  inputValue,
  setInputValue,
}) => {
  const { isCategory, isFilter, isPage } = useSelector(
    (state) => state.fanpages
  );
  const { childCategories } = useSelector((state) => state.categories);
  const dispatch = useDispatch();
  const showAll = () => {
    switch (isFilter) {
      case 'BYCATEANDNAME':
      case 'BYCATE':
        dispatch(actionSearchFanpagesByCategories(categorySelect.value));
        break;

      default:
        dispatch(actionGetAllFanpage());
        break;
    }
  };
  const filterProductInCategories = (e) => {
    setCategorySelect(e);
    const old_id = e.value;
    setFanpageByTime(FANPAGE_SORT[0]);
    setAmountSelect(AMOUNT_SORT[0]);
    setSaveSelect(SAVED_SORT[0]);
    if (old_id === 'DEFAULT') {
      dispatch(actionChangeStatus(''));
      dispatch(actionGetAllFanpage(isPage === 1 ? 0 : isPage * _LIMIT_DEFAULT));
      return;
    } else {
      dispatch(actionIsLoading(true));
      dispatch(actionChangeStatus('BYCATE'));
      dispatch(actionSaveCategory(old_id));
      dispatch(actionSearchFanpagesByCategories(old_id));
      setInputValue('');
      return;
    }
  };
  const handleFilterByTime = (e) => {
    setFanpageByTime(e);
    if (e.value === 'DEFAULT') {
      if (isFilter === 'BYCATEANDNAME') {
        dispatch(actionSearchFanpagesByCategories(categorySelect.value));
      } else if (isFilter === 'BYCATE') {
        dispatch(actionSearchFanpagesByCategories(categorySelect.value));
      } else {
        dispatch(
          actionGetAllFanpage(isPage === 1 ? 0 : isPage * _LIMIT_DEFAULT)
        );
      }
    }
    const value = e.value;
    const result = data.sort((a, b) => {
      if (a.time > b.time && value === NEW_TO_OLD) {
        return 1;
      } else {
        return -1;
      }
    });
    dispatch(actionSearchFanpage(result));
  };
  const handleFilterByContent = (e) => {
    setAmountSelect(e);
    const value = e.value;
    if (value === 'DEFAULT') {
      if (isFilter === 'BYCATEANDNAME') {
        dispatch(actionSearchFanpagesByCategories(categorySelect.value));
      } else if (isFilter === 'BYCATE') {
        dispatch(actionSearchFanpagesByCategories(categorySelect.value));
      } else {
        dispatch(
          actionGetAllFanpage(isPage === 1 ? 0 : isPage * _LIMIT_DEFAULT)
        );
      }
    }
    data.sort((a, b) => {
      if (value === ASCENDING) {
        return a.posts_count - b.posts_count;
      } else {
        return b.posts_count - a.posts_count;
      }
    });
  };
  const handleFilterBySave = (e) => {
    setSaveSelect(e);
    if (e.value === 'DEFAULT') {
      if (isFilter === 'BYCATEANDNAME') {
        dispatch(actionSearchFanpagesByCategories(categorySelect.value));
      } else if (isFilter === 'BYCATE') {
        dispatch(actionSearchFanpagesByCategories(categorySelect.value));
      } else {
        dispatch(
          actionGetAllFanpage(isPage === 1 ? 0 : isPage * _LIMIT_DEFAULT)
        );
      }
    }
    const result = data.sort((a, b) => {
      if (e.value === ASCENDING_LIKE) {
        return a.like - b.like;
      } else {
        return b.like - a.like;
      }
    });
  };
  const handleFilterByName = (e) => {
    e.preventDefault();
    dispatch(actionIsLoading(true));
    dispatch(
      actionChangeStatus(isFilter === 'BYCATE' ? 'BYCATEANDNAME' : 'BYNAME')
    );
    dispatch(
      actionSearchFanpagesByName(
        capitalizeFirstLetter(inputValue),
        isCategory,
        isFilter === 'BYCATE' ? 'BYCATEANDNAME' : 'BYNAME',
        0
      )
    );
  };
  const onClear = (e) => {
    e.preventDefault();
    setInputValue('');
    showAll();
  };
  const resetFilter = () => {
    setInputValue('');
    setCategorySelect(childCategories[0]);
    setFanpageByTime(FANPAGE_SORT[0]);
    setAmountSelect(AMOUNT_SORT[0]);
    setSaveSelect(SAVED_SORT[0]);
    dispatch(actionGetAllFanpage());
    dispatch(actionChangeStatus(''));
  };
  useEffect(() => {}, [categorySelect]);

  return (
    <>
      {isFilter !== '' ? (
        <div className="flex justify-end">
          <button
            onClick={resetFilter}
            className="mt-3 bg-blue-500 h-9
          rounded-md text-white hover:bg-red-500 w-48 flex justify-center items-center gap-2"
          >
            <FiRefreshCw size={20} />
            <span>Xoá bộ lọc</span>
          </button>
        </div>
      ) : null}

      <div className="grid grid-cols-5 gap-4 mb-6 mt-3 justify-between">
        <SelectStyled
          options={childCategories}
          className="w-full h-14 focus:ring-0 focus:ring-offset-0"
          styles={customStyles}
          onChange={(original) => filterProductInCategories(original)}
          placeholder="Lọc danh mục ..."
          value={categorySelect}
        />
        <SelectStyled
          options={FANPAGE_SORT}
          className="w-full h-14 focus:ring-0 focus:ring-offset-0"
          styles={customStyles}
          onChange={(original) => handleFilterByTime(original)}
          placeholder="Sắp xếp fanpage"
          value={fanpageByTime}
        />
        <SelectStyled
          options={AMOUNT_SORT}
          className="w-full h-14 focus:ring-0 focus:ring-offset-0"
          styles={customStyles}
          onChange={(original) => handleFilterByContent(original)}
          placeholder="Sắp xếp content mới nhất"
          value={amountSelect}
        />
        <SelectStyled
          options={SAVED_SORT}
          className="w-full h-14 focus:ring-0 focus:ring-offset-0"
          styles={customStyles}
          onChange={(original) => handleFilterBySave(original)}
          placeholder="Được lưu nhiều, ít"
          value={saveSelect}
        />
        <div className="flex">
          <input
            type="text"
            value={inputValue}
            placeholder="Nhập nội dung tìm kiếm ..."
            className="w-full rounded-l-md h-14 p-2 outline-none border-gray-300"
            onChange={(e) => {
              setInputValue(e.target.value);
            }}
          />
          {inputValue !== '' ? (
            <button
              className="w-16 h-14 text-red-600 flex justify-center items-center rounded-lg absolute right-16"
              type="button"
              onClick={onClear}
            >
              <FaTimes size={20} />
            </button>
          ) : null}
          <button
            className="w-28 text-center bg-blue-500 text-white rounded-r-md flex justify-center items-center outline-none ml-auto"
            onClick={handleFilterByName}
          >
            <FaSearch />
          </button>
        </div>
      </div>
    </>
  );
};

export default Filter;
