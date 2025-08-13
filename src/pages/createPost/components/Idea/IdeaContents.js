import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Contents from '../../../../components/KCEditor/FeedbacksForm/FeedbackContents/Contents/Content';
import ContentDetail from '../../../../components/CategoriesContent/ContentDetail';
import { getContents } from '../../../../store/actions/Contents/contentActions';
import KindOfContentSelect from '../../../../components/CategoriesContent/SearchAndFilter/KindOfContentSelect';
import FreqLikeSelect from '../../../../components/CategoriesContent/SearchAndFilter/FreqLikeSelect';
import FreqCommentSelect from '../../../../components/CategoriesContent/SearchAndFilter/FreqCommentSelect';
import FreqShareSelect from '../../../../components/CategoriesContent/SearchAndFilter/FreqShareSelect';
import FreqTimeSelect from '../../../../components/CategoriesContent/SearchAndFilter/FreqTimeSelect';
import { ImSearch } from 'react-icons/im';
import { handleSelectSort } from '../../../../helpers';

const IdeaContents = (props) => {
  const { setShowCats, setShowContents } = props;

  const [keyword, setKeyword] = useState('');
  const [sortByLikes, setSortByLikes] = useState('');
  const [sortByComments, setSortByComments] = useState('');
  const [sortByShares, setSortByShares] = useState('');
  const [sortByTime, setSortByTime] = useState('');
  const [contentType, setContentType] = useState('');

  const {
    contentDetailToShow,
    currentPage = 1,
    contents = [],
    totalPagesInCate = 1,
  } = useSelector((state) => state.contents);
  const { categorySelect } = useSelector((state) => state.createPost);
  const dispatch = useDispatch();

  useEffect(() => {
    if (categorySelect) {
      dispatch(getContents(categorySelect.cate_id, currentPage, ''));
    }
  }, [categorySelect]);

  const handleClickGoBack = () => {
    setShowCats(true);
    setShowContents(false);
    // reset filter
    setKeyword('');
    setSortByLikes('');
    setSortByComments('');
    setSortByShares('');
    setSortByTime('');
    setContentType('');
  };

  const handleClickGetMore = () => {
    onSearch(currentPage + 1);
  };

  const onSearch = (nextPage = 1) => {
    // prepare query
    let query = '';
    if (keyword) {
      query += `&keyword=${keyword}`;
    }
    if (contentType) {
      query += `&media_type=${contentType}`;
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
    dispatch(getContents(categorySelect.cate_id, nextPage, query));
  };

  return (
    <div className="w-full bg-white p-3 rounded-md">
      {/* filtering */}
      <form className="filtering" onSubmit={onSearch}>
        <div className="">
          <label
            className=" text-sm font-semibold text-gray-800 filter drop-shadow-md"
            htmlFor="sort"
          >
            Tìm kiếm:
          </label>
          <div className="flex flex-nowrap items-center px-2">
            <div className="pr-2 w-1/2">
              <input
                type="text"
                id="search"
                placeholder="Tìm kiếm theo nội dung, fanpage...."
                className="border border-gray-300 rounded-md py-1 px-2 w-full leading-7"
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>
            <KindOfContentSelect kindOfContentToSearch={setContentType} />
            {/* button search */}
            <div
              onClick={() => onSearch()}
              className="group p-2 rounded-md border bg-gray-400 hover:bg-red-400 transition-all duration-200 ease-linear cursor-pointer flex items-center justify-center"
            >
              <ImSearch className="h-6 w-6 text-gray-200 group-hover:text-gray-50 " />
            </div>
          </div>
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
              setRelationShipFilter={() => {}}
              freqLikeToFilter={setSortByLikes}
            />
            <FreqCommentSelect
              isDisabledFreqComment={false}
              freqCommentToFilter={setSortByComments}
              setRelationShipFilter={() => {}}
            />
            <FreqShareSelect
              isDisabledFreqShare={false}
              freqShareToFilter={setSortByShares}
              setRelationShipFilter={() => {}}
            />
            <FreqTimeSelect
              isDisabledFreqTime={false}
              freqTimeToFilter={setSortByTime}
              setRelationShipFilter={() => {}}
            />
          </div>
        </div>
      </form>
      <div className="contents">
        <Contents isIdea={true} />
      </div>
      {contentDetailToShow && <ContentDetail />}

      <div className="actions flex mt-2 px-3 gap-3">
        <button
          className="bg-gray-500 text-white rounded-md p-2 whitespace-nowrap hover:bg-gray-600"
          onClick={handleClickGoBack}
          disabled={contents.length === 0}
        >
          Quay lại
        </button>
        <button
          className={`bg-blue-500 text-white rounded-md p-2 whitespace-nowrap hover:bg-blue-600 ${
            currentPage === totalPagesInCate ? 'hidden' : ''
          }`}
          onClick={handleClickGetMore}
        >
          Xem thêm gợi ý
        </button>
      </div>
    </div>
  );
};

export default IdeaContents;
