import React from 'react';
import Select from 'react-select';

function ItemSelect(props) {
  const { params, setParams } = props;

  const options = [{ label: `05 bài mới nhất`, value: 5 }];
  Array.from(Array(11).keys()).map((v, k) => {
    const value = k == 10 ? 500 : (v + 1) * 10;
    options.push({
      label: `${value} bài mới nhất`,
      value,
    });
  });

  const style = {
    control: (base) => ({
      ...base,
      'input:focus': {
        boxShadow: 'none',
      },
    }),
  };

  return (
    <div className="flex-grow">
      <Select
        options={options}
        defaultValue={options.filter((o) => o.value == params.quantity)}
        styles={style}
        onChange={(selected) =>
          setParams({ ...params, quantity: selected.value })
        }
        placeholder=""
        components={{
          DropdownIndicator: () => null,
          IndicatorSeparator: () => null,
        }}
      />
    </div>
  );
}

export default ItemSelect;
