import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  actionGetAllFanpage,
  actionSavePageSelect,
} from '../../store/actions/Fanpages';
import {
  BiSkipNext,
  BiSkipPrevious,
  BiLastPage,
  BiFirstPage,
} from 'react-icons/bi';
import { AMOUNT_SORT, FANPAGE_SORT, SAVED_SORT } from './utility';
import { _LIMIT_DEFAULT } from '../../configs';

const Pagination = ({
  totalPages,
  setFanpageByTime,
  setAmountSelect,
  setSaveSelect,
}) => {
  const [pageSelect, setPageSelect] = useState(1);
  const [pageInput, setPageInput] = useState(1);
  const dispatch = useDispatch();

  const savePage = (page) => {
    dispatch(actionSavePageSelect(page));
  };
  const handlePageClick = (page, type) => {
    setFanpageByTime(FANPAGE_SORT[0]);
    setAmountSelect(AMOUNT_SORT[0]);
    setSaveSelect(SAVED_SORT[0]);
    if (type === 'next') {
      const page = pageSelect + 1;
      setPageSelect(page);
      dispatch(actionGetAllFanpage(page * _LIMIT_DEFAULT));
      savePage(page);
    } else if (type === 'prev') {
      const page = pageSelect - 1;
      setPageSelect(page);
      dispatch(actionGetAllFanpage(page * _LIMIT_DEFAULT));
      savePage(page);
    } else if (type === 'first') {
      setPageSelect(1);
      savePage(1);
      dispatch(actionGetAllFanpage(1 * _LIMIT_DEFAULT));
    } else if (type === 'last') {
      setPageSelect(totalPages);
      dispatch(actionGetAllFanpage(totalPages - 2 * _LIMIT_DEFAULT));
      savePage(totalPages);
    } else {
      setPageSelect(page);
      savePage(page);
      const count =
        page === totalPages
          ? totalPages - 2 * _LIMIT_DEFAULT
          : _LIMIT_DEFAULT * Number(page);
      dispatch(actionGetAllFanpage(count));
    }
  };
  const gotoPages = () => {
    setFanpageByTime(FANPAGE_SORT[0]);
    setAmountSelect(AMOUNT_SORT[0]);
    setSaveSelect(SAVED_SORT[0]);
    if (pageInput <= 0) {
      setPageInput(1);
      return;
    } else if (pageInput > totalPages) {
      setPageInput(totalPages);
      return;
    }
    setPageSelect(Number(pageInput));
    dispatch(
      actionGetAllFanpage(
        pageInput === totalPages
          ? totalPages - 2 * _LIMIT_DEFAULT
          : pageInput * _LIMIT_DEFAULT
      )
    );
  };
  return (
    <div className="flex justify-center gap-3 mt-5 pb-2">
      {pageSelect === 1 ? null : (
        <>
          <button
            className={`
          bg-blue-500
        rounded-md p-3 text-white hover:bg-red-500`}
            onClick={() => handlePageClick(pageSelect, 'first')}
            disabled={pageSelect === 1}
          >
            <BiFirstPage size={25} />
          </button>
          <button
            className={`
          bg-blue-500
        rounded-md p-3 text-white hover:bg-red-500`}
            onClick={() => handlePageClick(pageSelect, 'prev')}
            disabled={pageSelect === 1}
          >
            <BiSkipPrevious size={25} />
          </button>
          <button
            className={`
           bg-blue-500
         rounded-md p-3 text-white hover:bg-red-500  min-w-12`}
            onClick={() => handlePageClick(pageSelect - 1)}
          >
            {pageSelect === 1 ? null : pageSelect - 1}
          </button>
        </>
      )}

      <button
        className={`
          bg-red-500
        rounded-md p-3 text-white hover:bg-red-500  min-w-12`}
      >
        {pageSelect}
      </button>
      {pageSelect === totalPages ? null : (
        <>
          <button
            className={`
          bg-blue-500
        rounded-md p-3 text-white hover:bg-red-500  min-w-12`}
            onClick={() => handlePageClick(pageSelect + 1)}
            disabled={pageSelect === totalPages}
          >
            {pageSelect + 1}
          </button>
          <button
            className={`
          bg-blue-500
        rounded-md p-3 text-white hover:bg-red-500`}
            onClick={() => handlePageClick(pageSelect, 'next')}
            disabled={pageSelect === totalPages}
          >
            <BiSkipNext size={25} />
          </button>
          <button
            className={`
          bg-blue-500
        rounded-md p-3 text-white hover:bg-red-500`}
            onClick={() => handlePageClick(pageSelect, 'last')}
            disabled={pageSelect === totalPages}
          >
            <BiLastPage size={25} />
          </button>
        </>
      )}
      <input
        type="number"
        placeholder="Đi đến trang"
        max={totalPages}
        min={1}
        value={pageInput}
        className="w-36 rounded-lg"
        onChange={(e) => {
          setPageInput(e.target.value);
        }}
      />
      <button
        onClick={gotoPages}
        className="bg-blue-500 hover:bg-blue-700 w-28 rounded-lg text-white"
      >
        Đi đến trang
      </button>
    </div>
  );
};

export default Pagination;
