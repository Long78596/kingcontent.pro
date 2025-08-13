import React, { useEffect, useState } from 'react';
import { FiFacebook } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import Header from '../../components/Trendings/Header';
import { _LIMIT_DEFAULT, OK } from '../../configs';
import {
  getChildCategories,
  getChildCategoriesSearch,
} from '../../store/actions/categories';
import { getTotalTrendingContents } from '../../store/actions/Contents/trendingActions';
import { actionGetAllFanpage } from '../../store/actions/Fanpages';
import Card from './Card';
import Filter from './filter';
import PaginatioFilter from './PaginatioFilter';
import Pagination from './Pagination';
import { AMOUNT_SORT, FANPAGE_SORT, SAVED_SORT } from './utility';
import SpecialFollowPopupNotsave from './Popup';
import SpecialFollowPopup from '../../components/SpecialFollow/Popup';
import Client from '../../Client';

const Fanpages = () => {
  const pageLimit = 12;
  const keywords = useSelector((state) => state.trendings.keywords);
  const [isShowPopup, setIsShowPopup] = useState(false);
  const [isShowPopupFanpageSaved, setIsShowPopupFanpageSaved] = useState(false);
  const [isShowSaved, setIsShowSaved] = useState(false);
  const [fanpageSaved, setFanpageSaved] = useState([]);
  const { childCategories } = useSelector((state) => state.categories);
  const [categorySelect, setCategorySelect] = useState(childCategories[0]);
  const [fanpageByTime, setFanpageByTime] = useState(FANPAGE_SORT[0]);
  const [amountSelect, setAmountSelect] = useState(AMOUNT_SORT[0]);
  const [saveSelect, setSaveSelect] = useState(SAVED_SORT[0]);
  const [totalPages, setTotalPages] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const { totalFanpages } = useSelector((state) => state.contents);
  const { availableFanpage, fanpageSearchData, isFilter, isLoading } =
    useSelector((state) => state.fanpages);
  const totalTrendingContents = useSelector(
    (state) => state.trendings.totalTrendings
  );
  const numberRandomLength = Math.floor(Math.random() * 5);
  const suggestArr = [];
  for (let i = 0; i < numberRandomLength; i++) {
    const fanpagesRecommend = Math.floor(
      Math.random() * availableFanpage.length
    );
    suggestArr.push(availableFanpage[fanpagesRecommend]);
  }
  const dispatch = useDispatch();

  useEffect(() => {
    const resFanpage = Client.get(`/saved-fanpages`).then((res) => {
      if (res.status === OK) {
        setFanpageSaved(res?.data?.data || []);
      }
    });
  }, []);

  useEffect(() => {
    const totalPages = Math.ceil(totalFanpages / _LIMIT_DEFAULT);
    setTotalPages(totalPages);
    dispatch(actionGetAllFanpage(1, 20));
    dispatch(getChildCategoriesSearch());
  }, [totalFanpages]);
  return (
    <div className="fanpagesListing">
      <Header
        totalTrendingContents={totalTrendingContents}
        title="Danh sách Fanpage"
        icon={<FiFacebook className="h-7 w-7 text-gray-50 font-semibold" />}
      />
      <Filter
        fanpagesRecommend={suggestArr}
        dataDefault={fanpageSearchData}
        data={fanpageSearchData}
        categorySelect={categorySelect}
        setCategorySelect={setCategorySelect}
        fanpageByTime={fanpageByTime}
        setFanpageByTime={setFanpageByTime}
        amountSelect={amountSelect}
        setAmountSelect={setAmountSelect}
        saveSelect={saveSelect}
        setSaveSelect={setSaveSelect}
        inputValue={inputValue}
        setInputValue={setInputValue}
      />
      <div className="flex justify-end mb-3 gap-3" role="group">
        <button
          type="button"
          className={`${
            !isShowSaved ? 'bg-blue-600 text-white font-bold' : 'text-gray-900'
          } px-4 py-2 font-medium  bg-white border border-gray-200 rounded-s-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700  dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white rounded-md`}
          onClick={() => setIsShowSaved(false)}
        >
          Tất cả
        </button>
        <button
          type="button"
          className={`${
            isShowSaved ? 'bg-blue-600 text-white font-bold' : 'text-gray-900'
          } px-4 py-2 font-medium  bg-white border border-gray-200 rounded-s-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700  dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white rounded-md`}
          onClick={() => setIsShowSaved(true)}
        >
          Đã lưu
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center">
          <p className="text-sm font-bold">Đang tải ...</p>
        </div>
      ) : (
        <div>
          {fanpageSearchData.length === 0 ? (
            <div className="flex items-center h-80 w-full justify-center">
              <div className="text-base">Không tìm thấy kết quả</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-5 mb-5 md:grid-cols-2 gap-8">
              <Card
                pages={isShowSaved ? fanpageSaved : fanpageSearchData}
                isShowSaved={isShowSaved}
                setIsShowPopup={setIsShowPopup}
                setFanpageSaved={setFanpageSaved}
                fanpageSearchData={fanpageSearchData}
                setIsShowPopupFanpageSaved={setIsShowPopupFanpageSaved}
              />
            </div>
          )}
          <div>
            {!isShowSaved ? (
              fanpageSearchData.length === 0 || isFilter !== '' ? (
                <PaginatioFilter
                  setCategorySelect={setCategorySelect}
                  setFanpageByTime={setFanpageByTime}
                  setAmountSelect={setAmountSelect}
                  setSaveSelect={setSaveSelect}
                  categorySelect={categorySelect}
                  inputValue={inputValue}
                />
              ) : (
                <>
                  <Pagination
                    totalPages={totalPages}
                    setCategorySelect={setCategorySelect}
                    setFanpageByTime={setFanpageByTime}
                    setAmountSelect={setAmountSelect}
                    setSaveSelect={setSaveSelect}
                  />
                  <p className="text-center font-bold text-base mt-2 text-gray-400 pb-5">
                    Tổng số trang : {totalPages}
                  </p>
                </>
              )
            ) : null}
          </div>
        </div>
      )}

      {isShowPopup && (
        <SpecialFollowPopupNotsave
          setIsShowPopup={setIsShowPopup}
          fanpage={isShowPopup}
        />
      )}
      {isShowPopupFanpageSaved && (
        <SpecialFollowPopup
          setIsShowPopup={setIsShowPopupFanpageSaved}
          fanpage={isShowPopupFanpageSaved}
        />
      )}
    </div>
  );
};

export default Fanpages;
