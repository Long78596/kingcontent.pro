import React, { useCallback } from 'react';
import { ImArrowLeft } from 'react-icons/im';
import * as SCHEDULES from '../../../../store/actions/Schedules';
import { connect, useDispatch } from 'react-redux';
import { numberWithCommas } from '../../../../utils/utilityFunc';

function Header(props) {
  const { currentSuggestionsSubject = null } = props;
  const dispatch = useDispatch();

  const handleBack = useCallback(() => {
    dispatch(SCHEDULES.setShowSuggestionsPopup(false));
    dispatch(SCHEDULES.setShowSelectSuggestsPopup(true));
    dispatch(SCHEDULES.setSuggestionsContent([]));
  }, []);

  return (
    <div className="flex items-center">
      <ImArrowLeft
        onClick={handleBack}
        className="w-7 h-7 mx-3 text-gray-600 hover:text-blue-400 cursor-pointer"
      />
      <div className="text-sm font-bold py-1 my-1 mx-2 select-none">
        <span className="mr-2">Thư viện ý tưởng:</span>
        <span className="mr-2"># {currentSuggestionsSubject?.name || ''}</span>
        <span className="italic">
          {numberWithCommas(currentSuggestionsSubject?.total || 0)}
        </span>
      </div>
    </div>
  );
}
const mapStateToProps = (state) => {
  return {
    currentSuggestionsSubject: state.schedules.currentSuggestionsSubject,
  };
};

export default connect(mapStateToProps, null)(Header);
