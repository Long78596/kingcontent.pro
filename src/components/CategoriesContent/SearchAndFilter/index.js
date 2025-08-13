import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { ImSearch } from 'react-icons/im';
import { useHistory, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { isArrayEmpty } from '../../../configs';
import SelectCustom from '../SelectCustom';
import ByCommentSelect from './ByCommentSelect';
import ByLikeSelect from './ByLikeSelect';
import ByShareSelect from './ByShareSelect';
import DatePickerToSearch from './DatePickerToSearch';
import FreqCommentSelect from './FreqCommentSelect';
import FreqLikeSelect from './FreqLikeSelect';
import FreqNumberKeywordSelect from './FreqNumberKeywordSelect';
import FreqShareSelect from './FreqShareSelect';
import FreqTimeSelect from './FreqTimeSelect';
// import InputFbIdToSearch from './InputFbIdToSearch';
 import InputFbIdToSearch from './InputKeyWords';
import InputKeyWords from './InputKeyWords';
import KindOfContentSelect from './KindOfContentSelect';
import ShowHideSearchFilterButton from './ShowHideSearchFilterButton';
import { faAddressBook } from '@fortawesome/free-solid-svg-icons';
import { handleSelectSort } from '../../../helpers';

function SearchAndFilter(props) {
  const {
    handleSearch,
    fanpage_id,
    getAllPost,
    fanpageSelectList,
    setQuerySaved,
    handleSearchFunction,
    cateId,
  } = props;
  const [valueFbId, setValueFbId] = useState('');
  const [valueTypeOfContent, setValueTypeOfContent] = useState('');
  const [valueNumsLike, setValueNumsLike] = useState('');
  const [valueNumsComment, setValueNumsComment] = useState('');
  const [valueNumsShare, setValueNumsShare] = useState('');
  const [valueFreqLike, setValueFreqLike] = useState('');
  const [valueFreqComment, setValueFreqComment] = useState('');
  const [valueFreqShare, setValueFreqShare] = useState('');
  const [valueFreqTime, setValueFreqTime] = useState('');
  const [valueKeywords, setValueKeywords] = useState('');
  const [freqKeywordFilter, setFreqKeywordFilter] = useState('');
  const kindOfContentToSearch = (value) => setValueTypeOfContent(value);
  const numsLikeToFilter = (value) => setValueNumsLike(value);
  const numsCommentToFilter = (value) => setValueNumsComment(value);
  const numsShareToFilter = (value) => setValueNumsShare(value);
  const freqLikeToFilter = (value) => setValueFreqLike(value);
  const freqCommentToFilter = (value) => setValueFreqComment(value);
  const freqShareToFilter = (value) => setValueFreqShare(value);
  const freqTimeToFilter = (value) => setValueFreqTime(value);
  const freqKeywordToFilter = (value) => setFreqKeywordFilter(value);

  // eslint-disable-next-line no-undef
  const fromDateSearch = (value) => setValueFromDate(value);
  // eslint-disable-next-line no-undef
  const toDateSearch = (value) => setValueToDate(value);
  const keywordsToSearch = (value) => setValueKeywords(value);
  const [relationShipFilter, setRelationShipFilter] = useState(null);

  const handleChangeFanpageId = (item) => {
    setValueFbId(item.feed_id);
  };
  const [isShowBtnSearch, setIsShowBtnSearch] = useState(true);
  const [isShowGroupFilters, setIsShowGroupFilters] = useState(false);
  const initSelectFanpage = {
    name: 'Chọn fanpage ...',
    value: '',
    icon: faAddressBook,
  };
  const btnSearch = useRef(null);

  const onSearch = () => {
    let query = '';
    let paramsFbID = '';
    let paramsKeyword = '';
    let paramsToPush = '';
    // if (!valueFbId) {
    //   toast.error('Vui lòng chọn fanpage !');
    //   return
    // }
    // setIsShowGroupFilters(true);
    if (valueFbId && valueFbId.trim() !== '') {
      paramsFbID = fanpage_id;
    }

    if (!isShowGroupFilters && !valueKeywords) {
      toast.error('Vui lòng nhập nội dung tìm kiếm !');
      return;
    }

    if (valueKeywords) {
      query += `&keyword=${valueKeywords}`;
    }
    if (paramsFbID !== '') {
      query += `&feed_id=${valueFbId}`;
    }
    valueTypeOfContent !== '' && (query += `&media_type=${valueTypeOfContent}`);
    valueNumsLike !== '' &&
      (query += handleSelectLikeCommentShare(
        valueNumsLike,
        'like',
        setRelationShipFilter
      ));
    valueNumsComment !== '' &&
      (query += handleSelectLikeCommentShare(
        valueNumsComment,
        'comment',
        setRelationShipFilter
      ));
    valueNumsShare !== '' &&
      (query += handleSelectLikeCommentShare(
        valueNumsShare,
        'share',
        setRelationShipFilter
      ));
    valueFreqLike !== '' &&
      (query += handleSelectSort(
        valueFreqLike,
        'likes',
        0,
        setRelationShipFilter
      ));
    valueFreqComment !== '' &&
      (query += handleSelectSort(
        valueFreqComment,
        'comments',
        1,
        setRelationShipFilter
      ));
    valueFreqShare !== '' &&
      (query += handleSelectSort(
        valueFreqShare,
        'shares',
        2,
        setRelationShipFilter
      ));
    valueFreqTime !== '' &&
      (query += handleSelectSort(
        valueFreqTime,
        'post_timestamp',
        4,
        setRelationShipFilter
      ));
    freqKeywordFilter !== '' &&
      (query += handleSelectNumberKeyword(freqKeywordFilter, 'words_count'));

    handleSearch(query);
  };

  const handleRefreshFillter = useMemo(() => {
    if (
      valueNumsLike === '' &&
      valueNumsComment === '' &&
      valueNumsShare === '' &&
      valueFreqLike === '' &&
      valueFreqComment === '' &&
      valueFreqShare === '' &&
      valueFreqTime === '' &&
      valueKeywords === '' &&
      freqKeywordFilter === ''
    ) {
      setRelationShipFilter(null);
    }
  }, [
    valueNumsLike,
    valueNumsComment,
    valueNumsShare,
    valueFreqLike,
    valueFreqComment,
    valueFreqShare,
    valueFreqTime,
    freqKeywordFilter,
  ]);
  const onClickShowHideSearchFilterButton = useCallback(() => {
    setIsShowBtnSearch(!isShowBtnSearch);
    setIsShowGroupFilters(!isShowGroupFilters);
    /*if (isShowGroupFilters && cateId) {
      handleSearchFunction && handleSearchFunction(cateId, 1);
      setQuerySaved && setQuerySaved(null);
    }*/
  }, [isShowBtnSearch, isShowGroupFilters]);

  useEffect(() => {
    if (isShowBtnSearch) btnSearch.current.style = 'display: block;';
    else btnSearch.current.style = 'display: none;';
  }, [isShowBtnSearch]);
  useEffect(() => {
    if (fanpage_id) {
      setValueFbId(fanpage_id);
    }
  }, [fanpage_id]);
  useEffect(() => {
    if (
      valueNumsLike === '' &&
      valueNumsComment === '' &&
      valueNumsShare === '' &&
      valueFreqLike === '' &&
      valueFreqComment === '' &&
      valueFreqShare === '' &&
      valueFreqTime === '' &&
      valueKeywords === '' &&
      freqKeywordFilter === ''
    )
      return;
    onSearch();
  }, [
    valueNumsLike,
    valueNumsComment,
    valueNumsShare,
    valueFreqLike,
    valueFreqComment,
    valueFreqShare,
    valueFreqTime,
    freqKeywordFilter,
  ]);

  return (
    <div className="my-3 px-2 py-3 rounded-lg bg-white shadow-sm searchAndFilter relative z-20">
      <div className="flex gap-3">
        <InputKeyWords
          keywordsToSearch={keywordsToSearch}
          getAllPost={getAllPost}
          onSearch={onSearch}
        />
        <div className="flex items-center gap-3">
          {/* <OptionsSearch optionsToSearch={optionsToSearch} /> */}
          <div
            ref={btnSearch}
            onClick={onSearch}
            className="group p-2 my-0.5 rounded-md border bg-gray-400 hover:bg-red-400 transition-all duration-200 ease-linear cursor-pointer flex items-center justify-center "
          >
            <ImSearch className="h-6 w-6 text-gray-200 group-hover:text-gray-50 " />
          </div>
          <ShowHideSearchFilterButton
            onClick={onClickShowHideSearchFilterButton}
          />
        </div>
      </div>
      {/* the input below use to show or hide panel when click ShowHideSearchFilterButton*/}
      <input type="checkbox" id="myCheck" className="hidden" />

      <div
        className={`groupFilter origin-top transform scale-x-100 scale-y-0 transition-all duration-300 ease-linear w-full h-full ${
          isShowGroupFilters ? 'inline' : 'hidden'
        }`}
      >
        {/* <div className="groupFilter origin-top transform scale-x-100 transition-all duration-300 ease-linear">  */}
        <div className="my-1 grid lg:grid-cols-2 grid-cols-2 ">
          <div className="my-0.5 flex items-center justify-between flex-wrap flex-grow ">
            {fanpageSelectList && !isArrayEmpty(fanpageSelectList) && (
              <div className="flex-grow my-0.5 hidden">
                <SelectCustom
                  initSelect={initSelectFanpage}
                  listSelect={fanpageSelectList}
                  handleSelected={handleChangeFanpageId}
                  selectedFanpageId={fanpage_id}
                />
              </div>
            )}

            <KindOfContentSelect
              kindOfContentToSearch={kindOfContentToSearch}
            />
          </div>
          <div className="my-0.5 flex items-center justify-between flex-wrap w-full">
            <DatePickerToSearch
              fromDateSearch={fromDateSearch}
              toDateSearch={toDateSearch}
            />
            <div className="flex gap-2">
              <div
                onClick={onSearch}
                className="group py-2 px-4 mx-2 my-0.5 rounded-md border bg-gray-400 hover:bg-red-400 transition-all duration-200 ease-linear cursor-pointer sm:w-20 w-full flex items-center justify-center "
              >
                <ImSearch className="h-6 w-6 text-gray-200 group-hover:text-gray-50 " />
              </div>
              {/* <div
                onClick={handleRefreshFillter}
                className="group py-2 px-4 mx-2 my-0.5 rounded-md border bg-red-600 hover:bg-red-700 transition-all duration-200 ease-linear cursor-pointer sm:w-20 w-full flex items-center justify-center "
              >
                <FiRefreshCcw size={25} color="#fff" />
              </div> */}
            </div>
          </div>
        </div>
        <>
          {/* FILTER */}
          <div>
            <label
              className="ml-3  text-sm font-semibold text-gray-800 filter drop-shadow-md"
              htmlFor="filter"
            >
              Lọc theo tương tác:
            </label>
            <div
              className="mt-1 mb-3 grid lg:grid-cols-3 grid-cols-1 gap-3 "
              id="filter"
            >
              <ByLikeSelect
                numsLikeToFilter={numsLikeToFilter}
                setRelationShipFilter={setRelationShipFilter}
                handleRefreshFillter={handleRefreshFillter}
              />
              <ByCommentSelect
                numsCommentToFilter={numsCommentToFilter}
                setRelationShipFilter={setRelationShipFilter}
                handleRefreshFillter={handleRefreshFillter}
              />
              <ByShareSelect
                numsShareToFilter={numsShareToFilter}
                setRelationShipFilter={setRelationShipFilter}
                handleRefreshFillter={handleRefreshFillter}
              />
            </div>
          </div>

          {/* SORT */}
          {/* {relationShipFilter !== 'FILTER' && (
        
        )} */}
          <>
            <div className="mb-3">
              <label
                className="ml-3  text-sm font-semibold text-gray-800 filter drop-shadow-md"
                htmlFor="sort"
              >
                Sắp xếp dữ liệu:
              </label>
              <div
                className="mt-1 mb-3 grid xl:grid-cols-3 lg:grid-cols-2 grid-cols-1 gap-3 "
                id="sort"
              >
                <FreqLikeSelect
                  freqLikeToFilter={freqLikeToFilter}
                  isDisabledFreqLike={false}
                  setRelationShipFilter={setRelationShipFilter}
                  handleRefreshFillter={handleRefreshFillter}
                />
                <FreqCommentSelect
                  freqCommentToFilter={freqCommentToFilter}
                  isDisabledFreqComment={false}
                  setRelationShipFilter={setRelationShipFilter}
                  handleRefreshFillter={handleRefreshFillter}
                />
                <FreqShareSelect
                  freqShareToFilter={freqShareToFilter}
                  isDisabledFreqShare={false}
                  setRelationShipFilter={setRelationShipFilter}
                  handleRefreshFillter={handleRefreshFillter}
                />
              </div>
            </div>
            <div className="mt-5">
              <div
                className="mt-1 mb-3 grid xl:grid-cols-2 lg:grid-cols-2 grid-cols-1 gap-3 "
                id="sort"
              >
                <FreqTimeSelect
                  freqTimeToFilter={freqTimeToFilter}
                  isDisabledFreqTime={false}
                  setRelationShipFilter={setRelationShipFilter}
                />
                <FreqNumberKeywordSelect
                  freqKeywordFilter={freqKeywordToFilter}
                  isDisabledFreqComment={false}
                  setRelationShipFilter={setRelationShipFilter}
                />
              </div>
            </div>
          </>
        </>
      </div>
    </div>
  );
}

export default React.memo(SearchAndFilter);

const handleSelectLikeCommentShare = (value, type) => {
  switch (value) {
    case '0-20':
      return `&${type}=${value}`;
    case '21-50':
      return `&${type}=${value}`;
    case '50-100':
      return `&${type}=${value}`;
    case '100-300':
      return `&${type}=${value}`;
    case '300-1000':
      return `&${type}=${value}`;
    case '1000-10000000':
      return `&${type}=${value}`;
    default:
      break;
  }
};

const handleSelectNumberKeyword = (value, type) => {
  switch (value) {
    case '0-20':
      return `&${type}=${value}`;
    case '20-50':
      return `&${type}=${value}`;
    case '50-100':
      return `&${type}=${value}`;
    case '100-200':
      return `&${type}=${value}`;
    case '200-1000000':
      return `&${type}=${value}`;
    default:
      break;
  }
};
