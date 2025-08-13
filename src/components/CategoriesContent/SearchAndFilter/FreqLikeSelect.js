import React from 'react';
import {
  faLevelUpAlt,
  faLevelDownAlt,
  faRandom,
  faThumbsUp,
} from '@fortawesome/free-solid-svg-icons';
import SelectCustom from '../SelectCustom';

const FreqLikeList = [
  {
    name: 'Like Tăng dần',
    value: '1',
    icon: faLevelUpAlt,
  },
  {
    name: 'Like Giảm dần',
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
  name: 'Chọn tần suất like ...',
  value: '',
  icon: faThumbsUp,
};

function FreqLikeSelect(props) {
  const { freqLikeToFilter, isDisabledFreqLike, setRelationShipFilter } = props;
  const handleSelected = (selected) => {
    setRelationShipFilter('SORT');
    freqLikeToFilter(selected.value);
  };

  return (
    <div className="flex-grow">
      <SelectCustom
        initSelect={initSelect}
        listSelect={FreqLikeList}
        handleSelected={handleSelected}
        isDisabled={isDisabledFreqLike}
      />
    </div>
  );
}

export default FreqLikeSelect;
