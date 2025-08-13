import React, { useCallback, useEffect, useState } from 'react';
import { MdClose } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import FilterAndSort from './FilterAndSort';
import Header from './Header';
import SearchBar from './SearchBar';
import SuggestionsList from './SuggestionsList';
import * as SCHEDULES from '../../../../store/actions/Schedules';

function SuggestionsPopup(props) {
  const [showSortPanel, setShowSortPanel] = useState(false);
  const [isActiveForm, setIsActiveForm] = useState(false);
  const [loadMore, setLoadMore] = useState(1);
  const [querySortBy, setQuerySortBy] = useState('');
  const [queryKeywords, setQueryKeywords] = useState('');
  const [queryFbId, setQueryFbId] = useState('');
  const [queryKindOfContent, setQueryKindOfContent] = useState('');

  const showSuggestionsPopup = useSelector(
    (state) => state.schedules.showSuggestionsPopup
  );
  // const sortBy = useSelector(state => state.schedules.sortBy);
  const currentSuggestionsSubject = useSelector(
    (state) => state.schedules.currentSuggestionsSubject
  );
  const selectedCat = useSelector((state) => state.schedules.selectedCat);

  const dispatch = useDispatch();

  const handleSortPanel = useCallback(() => {
    setShowSortPanel(!showSortPanel);
  }, [showSortPanel]);

  useEffect(() => {
    // load contents depend on what choosen on prev step
    if (currentSuggestionsSubject) {
      const {
        id = 0,
        keywords = [],
        name = '',
        total = 0,
        type = '',
        parent_id = 0,
      } = currentSuggestionsSubject;
      switch (type) {
        case 'system':
          if (parent_id) {
            // get data from take care FB
            dispatch(
              SCHEDULES.getSuggestionSystemContents(
                parent_id,
                id,
                loadMore,
                querySortBy + queryKeywords + queryFbId + queryKindOfContent
              )
            );
          } else {
            // get data from choosen categories on popup
          }
          break;

        case 'trending':
        case 'trend':
          // get data from trending
          dispatch(
            SCHEDULES.getSuggestionTrendingContents(
              loadMore,
              querySortBy + queryKeywords + queryFbId + queryKindOfContent
            )
          );
          break;

        case 'special':
          // get data from trending
          break;

        case 'saved':
          // get data from trending
          break;

        case 'sale':
        case 'minigame':
        case 'feedback':
          // get data from choosen category in system with keywords
          let query = '';
          if (keywords && keywords.length > 0) {
            keywords.map((kw, idx) => {
              query += `&content_contains[]=${kw}`;
            });
          }
          dispatch(
            SCHEDULES.getSuggestionSystemContents(
              selectedCat?.old_id,
              0,
              loadMore,
              query
            )
          );

          break;

        default:
          break;
      }
    }
  }, [currentSuggestionsSubject, loadMore]);

  useEffect(() => {
    if (showSuggestionsPopup !== undefined) {
      setIsActiveForm(showSuggestionsPopup);
    }
  }, [showSuggestionsPopup]);

  const handleLoadMore = () => {
    setLoadMore((prevState) => prevState + 1);
  };

  const closeForm = useCallback(() => {
    dispatch(SCHEDULES.setShowSuggestionsPopup(false));
    dispatch(SCHEDULES.setSuggestionsContent([]));
  }, []);

  const getQuerySortBy = useCallback((query) => {
    setQuerySortBy(query);
    dispatch(SCHEDULES.setSuggestionsContent([]));
  }, []);

  const getQueryKeywords = useCallback((query) => {
    setQueryKeywords(query);
    dispatch(SCHEDULES.setSuggestionsContent([]));
  }, []);

  const getQueryFbId = useCallback((query) => {
    setQueryFbId(query);
    dispatch(SCHEDULES.setSuggestionsContent([]));
  }, []);

  const getQueryKindOfContent = useCallback((query) => {
    setQueryKindOfContent(query);
    dispatch(SCHEDULES.setSuggestionsContent([]));
  }, []);

  return (
    <div className="min-w-screen h-screen fixed inset-0 z-9999 flex items-center justify-center">
      <div
        onClick={closeForm}
        className={`absolute inset-0 bg-black ${
          isActiveForm ? 'opacity-20' : 'opacity-0'
        } transition-all duration-300 ease-linear`}
      />
      <div
        className={`w-full max-w-6xl z-10 relative m-auto rounded-lg shadow-lg bg-gray-200 p-2 md:mt-16 mt-12 transform origin-center ${
          isActiveForm ? 'opacity-100' : 'opacity-0'
        } transition-all duration-300 ease-linear`}
      >
        <MdClose
          onClick={closeForm}
          className="absolute top-2 right-3 w-7 h-7 rounded-full bg-gray-300 text-gray-400 p-1 hover:text-gray-800 hover:bg-gray-400 transition-all duration-200 ease-linear cursor-pointer"
        />
        <Header />
        <SearchBar
          handleSortPanel={handleSortPanel}
          getQueryKeywords={getQueryKeywords}
        />
        <FilterAndSort
          isActive={showSortPanel}
          getQuerySortBy={getQuerySortBy}
          getQueryFbId={getQueryFbId}
          getQueryKindOfContent={getQueryKindOfContent}
        />
        <SuggestionsList loadMore={handleLoadMore} />
      </div>
    </div>
  );
}

export default React.memo(SuggestionsPopup);
