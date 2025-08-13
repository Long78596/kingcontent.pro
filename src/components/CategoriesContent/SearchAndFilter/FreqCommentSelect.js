import React from 'react';
import {
  faLevelUpAlt,
  faLevelDownAlt,
  faRandom,
  faComment,
} from '@fortawesome/free-solid-svg-icons';
import SelectCustom from '../SelectCustom';

const FreqCommentList = [
  {
    name: 'Comment Tăng dần',
    value: '1',
    icon: faLevelUpAlt,
  },
  {
    name: 'Comment Giảm dần',
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
  name: 'Chọn tần suất comment ...',
  value: '',
  icon: faComment,
};

function FreqCommentSelect(props) {
  const { freqCommentToFilter, isDisabledFreqComment, setRelationShipFilter } =
    props;
  const handleSelected = (selected) => {
    setRelationShipFilter('SORT');
    freqCommentToFilter(selected.value);
  };

  return (
    <div className="flex-grow">
      <SelectCustom
        initSelect={initSelect}
        listSelect={FreqCommentList}
        handleSelected={handleSelected}
        isDisabled={isDisabledFreqComment}
      />
    </div>
  );
}

export default FreqCommentSelect;
