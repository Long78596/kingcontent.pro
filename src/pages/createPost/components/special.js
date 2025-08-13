import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PostSugesstion from '../../../components/ContentSugesstion/PostSugesstion';
import { actionGetSpecialContents } from '../../../store/actions/createContent';
import { handleSelectSort } from '../../../helpers';
import FreqLikeSelect from '../../../components/CategoriesContent/SearchAndFilter/FreqLikeSelect';
import FreqCommentSelect from '../../../components/CategoriesContent/SearchAndFilter/FreqCommentSelect';
import FreqShareSelect from '../../../components/CategoriesContent/SearchAndFilter/FreqShareSelect';
import FreqTimeSelect from '../../../components/CategoriesContent/SearchAndFilter/FreqTimeSelect';
import KindOfContentSelect from '../../../components/CategoriesContent/SearchAndFilter/KindOfContentSelect';
import { ImSearch } from 'react-icons/im';
import SelectCustom from '../../../components/CategoriesContent/SelectCustom';
import client from '../../../Client';
import { faAddressBook } from '@fortawesome/free-solid-svg-icons';
import { SpecialService } from '../../../services/special';
import { initHashtagSelect } from '../../../components/Schedules/FilterForm/constant';
import { OK } from '../../../configs';

const initSelectFanpage = {
  name: 'Chọn fanpage ...',
  value: '',
  icon: faAddressBook,
};

const Special = ({ isMultiSelect = false, allowedContentTypes = null, additionalButton = null}) => {
  const [keyword, setKeyword] = useState('');
  const [sortByLikes, setSortByLikes] = useState('');
  const [sortByComments, setSortByComments] = useState('');
  const [sortByShares, setSortByShares] = useState('');
  const [sortByTime, setSortByTime] = useState('');
  const [contentType, setContentType] = useState('');
  const [fanpageList, setFanpageList] = useState([]);
  const [seletedFanpage, setSeletedFanpage] = useState('');
  const [selectedHashtag, setSelectedHashtag] = useState('');
  let defaultContentType = '';
  if (allowedContentTypes)
    defaultContentType = allowedContentTypes[0];
  const [currentQuery, setCurrentQuery] = useState('&media_type=' + defaultContentType);
  const [hashtagList, setHashtagList] = useState([]);

  const getAllHashtag = async () => {
    const res = await SpecialService.getAllTag();
    if (res.status === OK) {
      const hashtags = res?.data?.data?.map((elt) => {
        return {
          name: elt.name,
          value: elt.id,
        };
      });
      setHashtagList([initHashtagSelect, ...hashtags]);
    }
  };

  const getFanpages = async () => {
    const { data } = await client.get(`/saved-fanpages`);
    const fanpages = data?.data?.map((elt) => {
      const { name = '' } = elt?.special_hash_tag || {};
      return {
        name: name
          ? `${elt?.page_name || elt?.fanpage_id} - ${name}`
          : `${elt?.page_name || elt?.fanpage_id} (Chưa có nhãn)`,
        value: elt.fanpage_id,
      };
    });
    setFanpageList([initSelectFanpage, ...fanpages]);
  };

  const { contents = [] } = useSelector((state) => state.specialContents);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(actionGetSpecialContents(1, currentQuery));
    getFanpages();
    getAllHashtag();
  }, []);

  const onSearch = () => {
    // prepare query
    let query = '';
    if (contentType)
      query += `&media_type=${contentType}`;
    else
      query += `&media_type=${defaultContentType}`;
    if (seletedFanpage?.value) {
      query += `&feed_id=${seletedFanpage.value}`;
    }
    if (keyword) {
      query += `&keyword=${keyword}`;
    }
    if (sortByLikes) {
      query += handleSelectSort(sortByLikes, 'likes', 0);
    }
    if (sortByComments) {
      query += handleSelectSort(sortByComments, 'comments', 1);
    }
    if (sortByShares) {
      query += handleSelectSort(sortByShares, 'shares', 2);
    }
    if (sortByTime) {
      query += handleSelectSort(sortByTime, 'post_timestamp', 3);
    }
    if (selectedHashtag?.value) {
      query += `&hashtag=${selectedHashtag?.value}`;
    }
    setCurrentQuery(query);
    dispatch(actionGetSpecialContents(1, query));
  };

  return (
    <div className="p-2 specialContents">
      {/* filtering */}
      <form className="filtering p-3" onSubmit={onSearch}>
        <div
          className="filter whitespace-nowrap flex items-center gap-2 mb-3"
          htmlFor="sort"
        >
          <input
            type="text"
            id="search"
            placeholder="Tìm kiếm theo nội dung, fanpage...."
            className="border border-gray-300 rounded-md p-2 w-full"
            onChange={(e) => setKeyword(e.target.value)}
          />
          {/* button search */}
          <div
            onClick={() => onSearch()}
            className="group p-2 rounded-md border bg-gray-400 hover:bg-red-400 transition-all duration-200 ease-linear cursor-pointer flex items-center justify-center"
          >
            <ImSearch className="h-6 w-6 text-gray-200 group-hover:text-gray-50 " />
          </div>
        </div>
        <div className="mt-1 mb-3 grid grid-cols-3 gap-3">
          <div className="flex-grow">
            <SelectCustom
              initSelect={initSelectFanpage}
              listSelect={fanpageList}
              handleSelected={(value) => setSeletedFanpage(value)}
            />
          </div>
          {/* hashtag select */}
          <div className="flex-grow">
            <SelectCustom
              initSelect={initHashtagSelect}
              listSelect={hashtagList}
              name="hashtag"
              handleSelected={(value) => setSelectedHashtag(value)}
            />
          </div>
          <KindOfContentSelect kindOfContentToSearch={setContentType} validOptionValues={allowedContentTypes} />
        </div>
        <div className="mb-3">
          <label
            className=" text-sm font-semibold text-gray-800 filter drop-shadow-md"
            htmlFor="sort"
          >
            Sắp xếp dữ liệu:
          </label>
          <div className="mt-1 mb-3 grid grid-cols-2 gap-3" id="sort">
            <FreqLikeSelect
              isDisabledFreqLike={false}
              setRelationShipFilter={() => { }}
              freqLikeToFilter={setSortByLikes}
            />
            <FreqCommentSelect
              isDisabledFreqComment={false}
              freqCommentToFilter={setSortByComments}
              setRelationShipFilter={() => { }}
            />
            <FreqShareSelect
              isDisabledFreqShare={false}
              freqShareToFilter={setSortByShares}
              setRelationShipFilter={() => { }}
            />
            <FreqTimeSelect
              isDisabledFreqTime={false}
              freqTimeToFilter={setSortByTime}
              setRelationShipFilter={() => { }}
            />
          </div>
        </div>
      </form>
      <PostSugesstion
        contents={contents}
        isSpecial={true}
        currentQuery={currentQuery}
        multiSelect={isMultiSelect}
        additionalButton={additionalButton}
      />
    </div>
  );
};

export default Special;
