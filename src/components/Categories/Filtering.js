import { memo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { getParentCategories } from '../../store/actions/categories';

const listDefaultOptions = [
  { value: 'all', label: 'Tất cả' },
  // { value: 'takeCare', label: 'Content nuôi dưỡng' },
  // { value: 'theRest', label: 'Content bán hàng' },
];

const Filtering = (props) => {
  const { keyword, onFilterCategories, cateType, setCateType } = props;
  const dispatch = useDispatch();

  const {
    childCategories,
    parentCategories,
  } = useSelector((state) => state.categories);

  const listOptions = [
    ...listDefaultOptions,
    ...parentCategories.map((category) => ({
      value: category.cate_id,
      label: category.cate_name,
    })),
  ];

  const defaultValue = listOptions.find((item) => item.value === cateType);

  useEffect(() => {
    dispatch(getParentCategories());
  }
  , [dispatch]);

  const onChangeCateType = (selected) => {
    setCateType(selected.value);
  };

  return (
    <div className="filterCategories w-full p-3 bg-white rounded-md mb-1 relative border-b items-center flex gap-2">
      <div className="quickSearch flex items-center w-full border rounded-sm border-gray-300">
        <input
          className="w-full outline-none bg-transparent p-2"
          name="keyword"
          placeholder="Tìm kiếm nhanh danh mục ..."
          value={keyword}
          autoComplete="off"
          onChange={(evt) => onFilterCategories(evt)}
        />
        <button className="right-4 w-6 h-6">
          <i className="ri-search-line"></i>
        </button>
      </div>
      <Select
        className="selectCategories w-1/3 ml-auto"
        options={listOptions}
        defaultValue={defaultValue}
        onChange={onChangeCateType}
      />
    </div>
  );
};

export default memo(Filtering);
