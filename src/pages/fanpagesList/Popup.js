import React, { useCallback, useEffect, useState } from 'react';
import { MdClose } from 'react-icons/md';
// import SearchAndFilter from '../CategoriesContent/SearchAndFilter';
import { useDispatch, useSelector } from 'react-redux';
import {
  getTotalTrendingContents,
  getTrendingWithKeywords,
} from '../../store/actions/Contents/trendingActions';
// import Pagination from '../CategoriesContent/Pagination';
// import GridLayoutContent from '../CategoriesContent/GridLayoutContent';
import PerfectScrollbar from 'react-perfect-scrollbar';
import ContentDetail from '../../components/CategoriesContent/ContentDetail';
import client from '../../Client';
import { toast } from 'react-toastify';
import GridLayoutContent from '../../components/CategoriesContent/GridLayoutContent';
import SearchAndFilter from '../../components/CategoriesContent/SearchAndFilter';
import Pagination from '../../components/CategoriesContent/Pagination';
import { OK } from '../../configs';

const pageLimit = 16;
const pageNeighbours = 1;

function SpecialFollowPopupNotsave(props) {
  const dispatch = useDispatch();

  const { fanpage, setIsShowPopup, setIsMorePost } = props;
  const [totalContent, setTotalContent] = useState(0);
  const [listPosts, setListPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saveQuery, setSaveQuery] = useState('');
  const closePopup = useCallback(() => {
    setIsShowPopup(false);
    setIsMorePost && setIsMorePost(false);
  }, []);
  const handleSearch = useCallback(async (newQuery, page = 1) => {
    setSaveQuery(newQuery);
    try {
      toast.warning('Đang tìm ...');
      const query = newQuery.replace('&', '?');
      const res = await client.get(
        `categories/${
          fanpage.category?.cate_id
        }/contents?_limit=20&page=${page}${newQuery ? newQuery : ''}`
      );
      if (res.status === OK) {
        setListPosts(res?.data?.data?.data || []);
        setTotalPages(res?.data?.data?.last_page || 0);
        setLoading(false);
        toast.success('Lấy kết quả thành công !');
      }
    } catch (error) {
      toast.error('Không tìm thấy kết quả !');
    }
  }, []);

  const onPageChanged = async (page) => {
    setLoading(true);
    setCurrentPage(page);
    const res = await client.get(
      `categories/${
        fanpage.category?.cate_id
      }/contents?_limit=20&page=${page}&feed_id=${fanpage.feed_id}${
        saveQuery ? saveQuery : ''
      }`
    );
    if (res.status === OK) {
      setListPosts(res?.data?.data?.data || []);
      setLoading(false);
    }
  };

  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const renderContents = () => {
    if (listPosts && listPosts.length > 0) {
      return (
        <>
          <GridLayoutContent currentContents={listPosts} page="system" />
          <Pagination
            totalPages={totalPages}
            pageLimit={pageLimit}
            pageNeighbours={pageNeighbours}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            onPageChanged={onPageChanged}
            loading={loading}
          />
        </>
      );
    } else {
      return <span className="text-xl">Không tìm thấy kết quả</span>;
    }
  };

  const contentDetailToShow = useSelector(
    (state) => state.contents.contentDetailToShow
  );

  const ShowContentDetail = useCallback(() => {
    if (contentDetailToShow) return <ContentDetail />;
  }, [contentDetailToShow]);

  const getAllPost = async () => {
    setLoading(true);
    const res = await client.get(
      `categories/${fanpage.category?.cate_id}/contents?_limit=20&page=1&feed_id=${fanpage.feed_id}`
    );
    if (res.status === OK) {
      setTotalPages(res?.data?.data?.last_page || 0);
      setListPosts(res?.data?.data?.data || []);
      setTotalContent(res?.data?.data?.total || 0);
      setLoading(false);
    }
  };
  useEffect(() => {
    getAllPost();
  }, []);

  return (
    <div className="min-w-screen h-screen fixed inset-0 z-9999 flex items-center justify-center">
      <div
        onClick={closePopup}
        className={`absolute inset-0 bg-black opacity-20 transition-all duration-300 ease-linear z-10`}
      />
      <div className="w-10/12 z-20 relative m-auto rounded-lg shadow-lg bg-gray-100 p-4 px-6 md:mt-5 mt-5 transform origin-center opacity-100 transition-all duration-300 ease-linear max-h-screen overflow-y-auto">
        <MdClose
          onClick={closePopup}
          fill="white"
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-red-400 text-gray-400 p-1 hover:text-gray-80 ease-linear cursor-pointerp-1 hover:text-gray-800 hover:bg-gray-400 transition-all duration-200 cursor-pointer"
        />
        <h2 className="text-base font-bold">{`${
          fanpage.user_screenname || 'page name here'
        } (${totalContent || 0} bài viết)`}</h2>
        <SearchAndFilter
          handleSearch={handleSearch}
          fanpage_id={fanpage.feed_id}
          getAllPost={getAllPost}
        />
        <PerfectScrollbar className="mt-7 text-nowrap max-h-schedule -z-1">
          {renderContents()}
        </PerfectScrollbar>
      </div>
      {ShowContentDetail()}
    </div>
  );
}

export default React.memo(SpecialFollowPopupNotsave);
