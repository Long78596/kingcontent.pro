import React, { useCallback } from 'react';
import { numberWithCommas, randomColor } from '../../../../utils/utilityFunc';
import { useDispatch } from 'react-redux';
import * as SCHEDULES from '../../../../store/actions/Schedules';

function SuggestItem(props) {
  const { suggestItem } = props;
  const dispatch = useDispatch();

  const handleClick = useCallback(() => {
    dispatch(SCHEDULES.setCurrentSuggestionSubject(suggestItem));
    dispatch(SCHEDULES.setShowSuggestionsPopup(true));
    dispatch(SCHEDULES.setShowSelectSuggestsPopup(false));
  }, [suggestItem]);

  return (
    <div
      onClick={handleClick}
      className="suggestItem group block py-2 px-3 m-1 bg-white shadow-md rounded-md text-gray-700 hover:text-gray-900 hover:bg-indigo-100 transition-all duration-200 ease-linear overflow-hidden select-none cursor-pointer"
    >
      <div className="inline-flex items-center">
        <div
          className="block w-20 h-20 min-w-20 rounded-full opacity-70 group-hover:opacity-100 transition-all duration-200 ease-linear mr-2"
          style={{ backgroundColor: `${randomColor()}` }}
        ></div>
        <div className="flex flex-col">
          <span className="font-bold  text-sm ">{`# ${
            suggestItem?.name || ''
          }`}</span>
          <span className="font-semibold italic  text-sm ">
            {numberWithCommas(suggestItem?.total || 0)}
          </span>
        </div>
      </div>
    </div>
  );
}

export default React.memo(SuggestItem);
