import React, { useState } from 'react';
import { BiSkipNext, BiSkipPrevious } from 'react-icons/bi';
import { useDispatch, useSelector } from 'react-redux';
import { capitalizeFirstLetter, _LIMIT_DEFAULT } from '../../configs';
import {
  actionChangeStatus,
  actionGetAllFanpage,
  actionSavePageSelect,
  actionSearchFanpagesByCategories,
  actionSearchFanpagesByName,
} from '../../store/actions/Fanpages';
import { AMOUNT_SORT, FANPAGE_SORT, SAVED_SORT } from './utility';
const PaginatioFilter = ({
  setCategorySelect,
  setFanpageByTime,
  setAmountSelect,
  setSaveSelect,
  categorySelect,
  inputValue,
}) => {
  const { childCategories } = useSelector((state) => state.categories);
  const { isCategory, fanpageSearchData, isFilter, isPage } = useSelector(
    (state) => state.fanpages
  );
  const [pageSelect, setPageSelect] = useState(1);
  const dispatch = useDispatch();
  const handlePageClick = (pageSelect, type) => {
    setFanpageByTime(FANPAGE_SORT[0]);
    setAmountSelect(AMOUNT_SORT[0]);
    setSaveSelect(SAVED_SORT[0]);
    if (type === 'next') {
      const page = pageSelect + 1;
      setPageSelect(page);
      dispatch(actionSavePageSelect(page));
      if (isFilter === 'BYCATEANDNAME') {
        dispatch(
          actionSearchFanpagesByName(
            capitalizeFirstLetter(inputValue),
            isCategory,
            'BYCATEANDNAME',
            isPage === 1 ? 0 : isPage * _LIMIT_DEFAULT
          )
        );
      } else if (isFilter === 'BYNAME') {
        dispatch(
          actionSearchFanpagesByName(
            capitalizeFirstLetter(inputValue),
            isCategory,
            'BYNAME',
            isPage === 1 ? 0 : isPage * _LIMIT_DEFAULT
          )
        );
      } else {
        dispatch(
          actionSearchFanpagesByCategories(isCategory, page * _LIMIT_DEFAULT)
        );
      }
    } else if (type === 'prev') {
      const page = pageSelect - 1;
      dispatch(actionSavePageSelect(page));
      setPageSelect(page);
      if (isFilter === 'BYCATEANDNAME') {
        dispatch(
          actionSearchFanpagesByName(
            capitalizeFirstLetter(inputValue),
            isCategory,
            'BYCATEANDNAME',
            isPage * _LIMIT_DEFAULT
          )
        );
      } else if (isFilter === 'BYNAME') {
        dispatch(
          actionSearchFanpagesByName(
            capitalizeFirstLetter(inputValue),
            isCategory,
            'BYNAME',
            isPage * _LIMIT_DEFAULT
          )
        );
      } else {
        dispatch(
          actionSearchFanpagesByCategories(isCategory, page * _LIMIT_DEFAULT)
        );
      }
    }
  };
  return (
    <div className="PaginatioFilter">
      {fanpageSearchData.length === 0 ? null : (
        <div className="flex justify-center gap-5 mt-5 pb-5">
          <button
            className={`bg-blue-500 rounded-md p-3 text-white hover:bg-red-500`}
            onClick={() => handlePageClick(pageSelect, 'prev')}
            disabled={pageSelect === 1}
          >
            <BiSkipPrevious size={25} />
          </button>
          <button
            className={`bg-blue-500 rounded-md p-3 text-white hover:bg-red-500`}
            onClick={() => handlePageClick(pageSelect, 'next')}
            disabled={fanpageSearchData.length === 0}
          >
            <BiSkipNext size={25} />
          </button>
        </div>
      )}
    </div>
  );
};

export default PaginatioFilter;
