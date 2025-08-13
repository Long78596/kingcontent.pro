import { useEffect, useState } from 'react';
import HomepageSearchBar from './HomepageSearchBar';
import Popular from './Popular';
import Suggestions from './Suggestions';
import { getPopularTags } from '../../../../store/actions/homepage';
import { connect, useDispatch, useSelector } from 'react-redux';

const SearchForm = (props) => {
  // const {contents, fanpages} = props
  const [loading, setLoading] = useState(false);
  const [isSearch, setIsSearch] = useState(false);
  const { polularTags } = useSelector((state) => state.homepage);
  const dispatch = useDispatch();

  useEffect(() => {
    // dispatch(getPopularTags());
  }, [dispatch]);

  return (
    <div className="searchForm relative">
      <HomepageSearchBar setLoading={setLoading} setIsSearch={setIsSearch} />
      <Suggestions
        loading={loading}
        isSearch={isSearch}
        setLoading={setLoading}
      />
      {/* <Popular /> */}
    </div>
  );
};

export default SearchForm;
