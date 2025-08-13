import React, { useEffect, useState } from 'react';
import ScrollBar from 'react-perfect-scrollbar';
import SuggestItem from './SuggestItem';
import { defaultSuggestList, destructCategories } from '../../helpers';
import { connect } from 'react-redux';

function SuggestList(props) {
  const { takeCareFBCategories } = props;
  const [suggestList, setSuggestList] = useState(defaultSuggestList);

  useEffect(() => {
    if (takeCareFBCategories && takeCareFBCategories.length > 0) {
      const destructedCats = destructCategories(takeCareFBCategories);
      setSuggestList(defaultSuggestList.concat(destructedCats));
    }
  }, [takeCareFBCategories]);

  return (
    <div className="suggestList mt-2">
      <ScrollBar
        className="grid grid-cols-3 max-h-70"
        style={{ paddingBottom: '150px' }}
      >
        {suggestList.map((suggestItem, index) => {
          return <SuggestItem key={index} suggestItem={suggestItem} />;
        })}
      </ScrollBar>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    takeCareFBCategories: state.categories.takeCareFBCategories,
  };
};

export default connect(mapStateToProps, null)(SuggestList);
