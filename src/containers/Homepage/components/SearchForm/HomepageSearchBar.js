import { connect, useDispatch } from 'react-redux';
import { useEffect, useCallback, useState } from 'react';
import {
  getFanpagesByKeyword,
  getTagsByKeyword,
  getGoogleSubjectsByKeyword,
} from '../../../../store/actions/homepage';

const HomepageSearchBar = (props) => {
  const { setLoading, setIsSearch, isHome = true } = props;
  const [keyword, setKeyword] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {
    const timeOutId = setTimeout(() => {
      setIsSearch(true);
      handleOnSearch();
    }, 1000);
    return () => clearTimeout(timeOutId);
  }, [keyword]);

  const handleOnSearch = useCallback(async () => {
    if (keyword) {
      setLoading(true);
      await dispatch(getTagsByKeyword(keyword));
      // hide get fanpages
      // await dispatch(getFanpagesByKeyword(keyword));
      setLoading(false);
    } else {
      setIsSearch(false);
    }
  }, [keyword]);

  return (
    <div className="homepageSearchBar">
      {isHome && (
        <div className="flex-1 text-center">
          <div className="px-6 w-auto rounded-lg bg-white relative m-auto">
            <input
              className="py-3 w-full outline-none bg-transparent"
              name="keyword"
              placeholder="Tìm kiếm chủ đề..."
              value={keyword}
              onChange={(evt) => setKeyword(evt.target.value)}
            />
            <button
              className="absolute top-0 right-0 w-11 h-11 rounded-r-md"
              onClick={handleOnSearch}
            >
              <i className="ri-search-line font-bold"></i>
            </button>
          </div>
        </div>
      )}

      {!isHome && (
        <div className="h-10 px-6 py-2 w-2/3 rounded-lg bg-blue-50 relative">
          <input
            className="h-6 w-full outline-none bg-transparent"
            name="keyword"
            placeholder="Tìm kiếm chủ đề..."
            value={keyword}
            onChange={(evt) => setKeyword(evt.target.value)}
          />
          <button
            className="absolute top-2 right-4 w-6 h-6"
            onClick={handleOnSearch}
          >
            <i className="ri-search-line"></i>
          </button>
        </div>
      )}
    </div>
  );
};

export default HomepageSearchBar;
