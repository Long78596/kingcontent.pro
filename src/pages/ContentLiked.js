import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { connect, useDispatch, useSelector } from 'react-redux';
import Summary from '../components/Interactions/Summary';
import ContentDetail from '../components/CategoriesContent/ContentDetail';
import RightContent from '../components/ContentLiked/RightContent';

import GridLayoutContent from '../components/CategoriesContent/GridLayoutContent';
import Pagination from '../components/CategoriesContent/Pagination';
import {
  getTotalContents,
  getTotalFanpages,
} from '../store/actions/Contents/contentActions';
import {
  getTotalTrendingContents,
  getTrendingWithKeywords,
  setKeywordsSearchTrendings,
} from '../store/actions/Contents/trendingActions';
import { getHashtags } from '../store/actions/hashtag';

const pageLimit = 12;
const pageNeighbours = 1;

const ContentLikedPage = (props) => {
  const dispatch = useDispatch();

  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const { trendingContents, totalTrendings, totalTrendingContents, keywords } = useSelector(
    (state) => state.trendings.trendings
  );
  const { contentDetailToShow, totalContents, totalFanpages } = useSelector(
    (state) => state.contents
  );

  useEffect(() => {
    // dispatch(getHashtags());
    dispatch(getTotalFanpages());
    dispatch(getTotalContents());
  }, []);

  useEffect(() => {
    dispatch(
      getTrendingWithKeywords(
        pageLimit,
        currentPage,
        keywords.toLowerCase().trim()
      )
    );
    setLoading(false);
  }, [keywords, currentPage]);

  useEffect(() => {
    dispatch(
      getTotalTrendingContents(pageLimit, 1, keywords.toLowerCase().trim())
    );
  }, [keywords]);

  useEffect(() => {
    if (totalTrendingContents > 0) {
      setTotalPages(Math.ceil(totalTrendingContents / pageLimit));
    }
  }, [totalTrendingContents]);

  if (contentDetailToShow) {
    return <ContentDetail />;
  }

  const onPageChanged = (page) => {
    setLoading(true);
    setCurrentPage(page);
  };

  const onSearch = (value) => {
    dispatch(setKeywordsSearchTrendings(value));
    setCurrentPage(1);
  };

  const renderContents = () => {
    if (trendingContents && trendingContents.length > 0) {
      return (
        <>
          <GridLayoutContent
            currentContents={trendingContents}
            page="contentLikedPage"
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
      return <span className="text-xl">Không tìm thấy kết quả</span>;
    }
  };

  return (
    <>
      <Helmet>
        <title>Content đã thích</title>
      </Helmet>
      <div className="pb-10">
        <Summary
          totalContents={totalContents}
          totalFanpages={totalFanpages}
          page="contentLikedPage"
          onSearch={onSearch}
        />
        <div className="w-7.4/10 mt-5 float-left">
          {!loading && renderContents()}
        </div>
        <RightContent />
      </div>
    </>
  );
};

export default ContentLikedPage;
