import { useCallback, useEffect, useState } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { connect } from 'react-redux';
import CatListing from './CatListing';
import SearchBar from './SearchBar';

const ParentCategories = (props) => {
  const { parentCategories } = props;
  const [parentCats, setParentCats] = useState(parentCategories);
  const [keyword, setKeyword] = useState('');

  useEffect(() => {
    if (keyword) {
      const newParentCats = [...parentCategories].reduce((acc, cat) => {
        let { name } = cat;
        if (name.toLowerCase().includes(keyword)) acc.push(cat);
        return acc;
      }, []);
      setParentCats(newParentCats);
    } else {
      setParentCats(parentCategories);
    }
  }, [keyword, parentCategories]);

  const handleSearchCat = useCallback((evt) => {
    const kw = evt.target.value;
    setKeyword(kw);
  }, []);

  return (
    <>
      <SearchBar handleSearchCat={handleSearchCat} />
      <PerfectScrollbar className="p-1 max-h-70 100-don-details mt-2">
        <CatListing parentCategories={parentCats} />
      </PerfectScrollbar>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    parentCategories: state.categories.parentCategories,
  };
};
export default connect(mapStateToProps, null)(ParentCategories);
