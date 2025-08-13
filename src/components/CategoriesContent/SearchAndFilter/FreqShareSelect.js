import React from 'react';
import {
  faLevelUpAlt,
  faLevelDownAlt,
  faRandom,
  faShareSquare,
} from '@fortawesome/free-solid-svg-icons';
import SelectCustom from '../SelectCustom';

const FreqShareList = [
  {
    name: 'Share Tăng dần',
    value: '1',
    icon: faLevelUpAlt,
  },
  {
    name: 'Share Giảm dần',
    value: '2',
    icon: faLevelDownAlt,
  },
  // {
  //   name: "Ngẫu nhiên",
  //   value: "3",
  //   icon: faRandom,
  // },
];

const initSelect = {
  name: 'Chọn tần suất share ...',
  value: '',
  icon: faShareSquare,
};

function FreqShareSelect(props) {
  const { freqShareToFilter, isDisabledFreqShare, setRelationShipFilter } =
    props;
  const handleSelected = (selected) => {
    setRelationShipFilter('SORT');
    freqShareToFilter(selected.value);
  };

  return (
    <div className="flex-grow">
      <SelectCustom
        initSelect={initSelect}
        listSelect={FreqShareList}
        handleSelected={handleSelected}
        isDisabled={isDisabledFreqShare}
      />
    </div>
  );
}

export default FreqShareSelect;
