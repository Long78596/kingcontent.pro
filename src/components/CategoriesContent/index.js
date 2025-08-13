import React, { useCallback, useEffect, useRef, useState } from 'react';
// import './temp.css';
import Header from './Header';
import Pagination from './Pagination';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useLocation } from 'react-router-dom';
import SearchAndFilter from './SearchAndFilter';
import GridLayoutContent from './GridLayoutContent';
import ContentDetail from './ContentDetail';
import { LightBulbIcon } from '@heroicons/react/solid';
import * as FILTER from '../..//store/actions/Contents/searchAndFilterActions';
import * as CONTENTS from '../../store/actions/Contents/contentActions';
import Client from '../../Client';
import { GET_CONTENTS, SET_LOADING } from '../../store/types';
import { set } from 'lodash';
import { toast } from 'react-toastify';
import { faAddressBook } from '@fortawesome/free-solid-svg-icons';
import { OK } from '../../configs';

// import { getLikedData } from '../../store/actions/user';

const pageLimit = 16;
const pageNeighbours = 1;

function Contents(props) {
  const [currentPage, setCurrentPage] = useState(1);

  const { slug, id } = useParams();
  const location = useLocation();
  const [querySaved, setQuerySaved] = useState(null);
  const dispatch = useDispatch();
  const [isMorePost, setIsMorePost] = useState(false);
  const contents = useSelector((state) => state.contents);
  const filter = useSelector((state) => state.searchAndFilterContent);
  const contentDetailToShow = useSelector(
    (state) => state.contents.contentDetailToShow
  );
  const [firstLoad, setFirstLoad] = useState(true);
  const totalPages = useSelector((state) => state.contents.totalPagesInCate);
  const QUERY = useRef('');
  const [listFanpages, setListFanpages] = useState([]);

  const getFanpages = async (catId = 0) => {
    let url = '/fanpages?_limit=0';
    if (catId) {
      url += `&category=${catId}`;
    }
    const res = await Client.get(url);
    if (res.status === OK) {
      const fanpages = res?.data?.data?.data || [];
      if (fanpages.length > 0) {
        const newUniqueArr = fanpages.map((_elt) => {
          return {
            ..._elt,
            name: _elt.user_screenname,
            value: _elt.feed_id,
            icon: faAddressBook,
          };
        });
        setListFanpages(newUniqueArr);
      }
    }
  };

  useEffect(() => {
    if (id && location.search === '' && firstLoad) {
      dispatch(CONTENTS.getTotalFanpages(id));
      dispatch(CONTENTS.getContents(id, 1));
      getFanpages(id);
    }
  }, [id]);

  const getAllContents = () => {
    dispatch(CONTENTS.getCategoriesInfoBySlug(slug));
  };

  useEffect(() => {
    // getAllContents();
    // dispatch(getLikedData());
  }, []);

  useEffect(() => {
    if (location.search !== '') {
      const useQuery = () => new URLSearchParams(location.search);
      // eslint-disable-next-line react-hooks/rules-of-hooks
      let getParams = useQuery();
      const FbID = getParams.get('fb_id');
      let tempQueryFbID = '';
      let tempQueryKeyword = '';

      if (FbID && FbID !== '') {
        dispatch(FILTER.setValueFbIdToSearch(FbID));
        tempQueryFbID = `&_where[feed_id]=${FbID}`;
      }

      const keyword = getParams.get('keyword');
      const where = getParams.get('where');

      if (keyword && keyword !== '') {
        dispatch(FILTER.setValueKeywordsToSearch(keyword.trim()));
        if (where && where !== '') {
          dispatch(FILTER.setValueOptionsToSearch(where));
          tempQueryKeyword += `&_type=${where}`;
        } else {
          dispatch(FILTER.setValueOptionsToSearch('all'));
          tempQueryKeyword += `&_type=all`;
        }
        tempQueryKeyword += `&_where[keyword]=${keyword}`;
      }
      QUERY.current += tempQueryFbID + tempQueryKeyword;
      handleSearch(QUERY.current);
      getAllContents();
    } else {
      getAllContents();
    }
  }, [location.search]);

  const handleSearch = async (newQuery, page = 1) => {
    try {
      setQuerySaved(newQuery);
      const query = newQuery.replace('&', '?');
      const res = await Client.get(
        `/categories/${id}/contents${query}&_limit=12&page=${page}`
      );
      if (res.status === OK) {
        dispatch({ type: SET_LOADING, payload: false });
        const pl = { ...res.data.data, from_cate: true };
        dispatch({ type: GET_CONTENTS, payload: pl });
        toast.success('Lấy dữ liệu thành công !');
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra , vui lòng thử lại !');
    }
  };

  const handleSearchFunction = (cateId, page) => {
    // will get query condition here
    let query = '';
    dispatch(CONTENTS.getContents(cateId, page, query, true));
  };

  const onPageChanged = (page) => {
    setCurrentPage(page);
    if (querySaved) {
      handleSearch(querySaved, page);
    } else {
      handleSearchFunction(id, page);
    }
  };

  const renderContents = () => {
    if (contents.contents && contents.contents.length > 0) {
      return (
        <>
          <GridLayoutContent
            currentContents={contents.contents}
            cateId={id}
            page="categoryPage"
            setIsMorePost={setIsMorePost}
            col={4}
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
        <div className="flex items-center h-80 w-full justify-center">
          <span className="text-xl">Không tìm thấy kết quả</span>
        </div>
      );
    }
  };

  if (contentDetailToShow) {
    return <ContentDetail />;
  }

  return (
    <div className="rounded-lg">
      <Header />
      <div className="main">
        {!isMorePost && (
          <SearchAndFilter
            handleSearch={handleSearch}
            getAllPost={getAllContents}
            fanpageSelectList={listFanpages}
            setQuerySaved={setQuerySaved}
            cateId={id}
            handleSearchFunction={handleSearchFunction}
          />
        )}
        <div className="mt-4 mb-5 py-1 bg-blue-300 text-gray-800 text-center  text-sm uppercase font-bold drop-shadow-md flex items-center justify-center">
          <LightBulbIcon className="w-6 h-6 text-yellow-100 mr-1" />Ý tưởng của
          bạn hôm nay
        </div>
        {contents.loading && (
          <div className="flex justify-center items-center relative">
            <div className="animate-spin rounded-full h-24 w-24 border-b-2 border-t-2 border-gray-600"></div>
            <label className="absolute top-1/3 z-10">Loading ...</label>
          </div>
        )}
        <div className="contentContainer relative">
          {!contents.loading && renderContents()}
        </div>
      </div>
    </div>
  );
}

export default React.memo(Contents);
