import React, { useCallback, useEffect, useState } from 'react';
import Header from '../components/Trendings/Header';
import Search from '../components/Trendings/Search';
import GridLayoutContent from '../components/CategoriesContent/GridLayoutContent';
import { useDispatch, useSelector } from 'react-redux';
import ContentDetail from '../components/CategoriesContent/ContentDetail';
import Pagination from '../components/CategoriesContent/Pagination';
import {
  getTotalTrendingContents,
  getTrendingWithKeywords,
  getTrendingWithPagination,
} from '../store/actions/Contents/trendingActions';
import { RESET_TRENDING } from '../store/actions/createContent';
import { setContentDetailToShow } from '../store/actions/Contents/contentActions';

const pageLimit = 12;
const pageNeighbours = 1;

function Trendings(props) {
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const trendingContents = useSelector((state) => state.trendings.trendings);
  const totalTrendingContents = useSelector(
    (state) => state.trendings.totalTrendings
  );
  const keywords = useSelector((state) => state.trendings.keywords);
  const contentDetailToShow = useSelector(
    (state) => state.contents.contentDetailToShow
  );

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({
      type: RESET_TRENDING,
    });

    dispatch(
      getTrendingWithKeywords(
        pageLimit,
        currentPage,
        keywords.toLowerCase().trim(),
        setTotalPages
      )
    );
    // setLoading(false);
  }, [keywords]);

  useEffect(() => {
    dispatch(getTrendingWithPagination(currentPage, setLoading, keywords));
  }, [currentPage]);

  useEffect(() => {
    if (totalTrendingContents > 0) {
      setTotalPages(Math.ceil(totalTrendingContents / pageLimit));
    }
  }, [totalTrendingContents]);

  const resetPageHandleSearch = useCallback(() => setCurrentPage(1), []);

  const onPageChanged = (page) => {
    setLoading(true);
    setCurrentPage(page);
  };

  const renderContents = () => {
    if (trendingContents && trendingContents.length > 0) {
      return (
        <>
          <GridLayoutContent
            currentContents={trendingContents}
            page={'trenddingPage'}
            col={4}
            setContentDetailToShow={setContentDetailToShow}
          />
          <Pagination
            totalPages={totalPages}
            pageLimit={pageLimit}
            pageNeighbours={pageNeighbours}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            onPageChanged={onPageChanged}
          />
        </>
      );
    } else {
      return (
        <span className="text-xl text-center">Không tìm thấy kết quả</span>
      );
    }
  };

  if (contentDetailToShow) {
    return <ContentDetail />;
  }

  return (
    <div className="rounded-lg">
      <Header totalTrendingContents={totalTrendingContents} />
      <Search resetPageHandleSearch={resetPageHandleSearch} />
      {loading && (
        <div className="flex justify-center items-center relative">
          <div className="animate-spin rounded-full h-24 w-24 border-b-2 border-t-2 border-gray-600"></div>
          <label className="absolute top-1/3 z-10">Loading ...</label>
        </div>
      )}
      {!loading && renderContents()}
    </div>
  );
}
export default React.memo(Trendings);
