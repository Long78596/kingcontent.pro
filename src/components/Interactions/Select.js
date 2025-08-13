import React, { useEffect, useState } from 'react';
import Select from 'react-select';

const ByItemsSelect = (props) => {
  const { onCategoriesSelected, childCategories = null, selectedCategory = 0 } = props;
  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if(childCategories){
      const options = childCategories.map((v) => {
        return {
          label: v.cate_name,
          value: v.cate_id
        }
      });
      setOptions(options);
    }
  }, [childCategories]);

  useEffect(() => {
    if(selectedCategory){
      setSelected({
        label: selectedCategory.cate_name,
        value: selectedCategory.cate_id
      });
    }
  }, [selectedCategory]);

  const style = {
    control: base => ({
      ...base,
      border: '8px solid #1e88e5',
      ':hover': {
        border: '8px solid #1e88e5'
      },
      'input:focus': {
        'boxShadow': 'none'
      }
    })
  };

  return (    
    <div className="flex-grow">
      <Select options={options} styles={style} onChange={(selected)=>onCategoriesSelected(selected)} placeholder='Chọn danh mục' defaultValue={selected} value={selected} />
    </div>    
  );
}

export default ByItemsSelect;