import React from 'react';
import Select from 'react-select';

const ByItemsSelect = (props) => {
  const { onCategoriesSelected, childCategories, selectedCatId = 0 } = props;

  const options = childCategories.map((v) => {
    return {
      label: v.cate_name,
      value: v.cate_id,
    };
  });

  return (
    <div className="w-4/6">
      <Select
        options={options}
        onChange={(selected) => onCategoriesSelected(selected)}
        placeholder="Chọn danh mục"
        defaultValue={options.find((v) => v.value === selectedCatId)}
      />
    </div>
  );
};

export default ByItemsSelect;
