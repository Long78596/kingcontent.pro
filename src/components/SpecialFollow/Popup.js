import React, { useEffect, useState } from 'react';
import { MdClose } from 'react-icons/md';
import SearchAndFilter from '../CategoriesContent/SearchAndFilter';
import { useDispatch, useSelector } from 'react-redux';
import Pagination from '../CategoriesContent/Pagination';
import GridLayoutContent from '../CategoriesContent/GridLayoutContent';
import PerfectScrollbar from 'react-perfect-scrollbar';
import ContentDetail from '../CategoriesContent/ContentDetail';
import client from '../../Client';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom/cjs/react-router-dom';
import { OK } from '../../configs';

const pageLimit = 12;
const pageNeighbours = 1;

function SpecialFollowPopup(props) {
  const dispatch = useDispatch();
  const { contentDetailToShow } = useSelector((state) => state.contents);

  const { fanpage, setIsShowPopup } = props;
  const [listPosts, setListPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentQuery, setCurrentQuery] = useState('');
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const history = useHistory();
  const closePopup = () => {
    setIsShowPopup(false);
    // remove param feed_id in url
    history.push('/theo-doi-dac-biet');
  };

  const handleSearch = async (newQuery) => {
    try {
      const query = newQuery.replace('&', '?');
      setCurrentQuery(query);
      const res = await client.get(`/special-contents${query}`);
      if (res.status === OK) {
        setListPosts(res.data.data.data);
        setTotalPages(res.data.data.last_page || 1);
        setCurrentPage(1);
        setLoading(false);
        toast.success('Lấy kết quả thành công !');
      }
    } catch (error) {
      toast.error('Không tìm thấy kết quả !');
    }
  };

  const onPageChanged = async (page) => {
    setLoading(true);
    setCurrentPage(page);
    const res = await client.get(
      currentQuery
        ? `/special-contents${currentQuery}&page=${page}`
        : `/special-contents?page=${page}`
    );
    if (res.status === OK) {
      setListPosts(res.data.data.data);
      setLoading(false);
    }
  };

  const renderContents = () => {
    if (listPosts && listPosts.length > 0) {
      return (
        <>
          <GridLayoutContent
            currentContents={listPosts}
            page="specialFollowPage"
          />
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
      return (
        <div className="text-center flex items-center justify-center h-60 bg-white rounded-md">
          <span className="text-base text-red-500 font-bold">
            Vui lòng chờ trong ít phút để hệ thống cập nhật dữ liệu mới nhất
          </span>
        </div>
      );
    }
  };

  const getAllPost = async () => {
    setLoading(true);
    const query = `?feed_id=${fanpage.fanpage_id}`;
    const res = await client.get(`/special-contents${query}`);
    setCurrentQuery(query);
    if (res.status === OK) {
      setListPosts(res.data.data.data);
      setTotalPages(res.data.data.last_page || 1);
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
        className={`absolute inset-0 bg-black opacity-20 transition-all duration-300 ease-linear`}
      />
      <div
        className={`w-11/12 z-10 relative m-auto rounded-lg shadow-lg bg-gray-100 py-4 px-6 transform origin-center opacity-100 transition-all duration-300 ease-linear overflow-auto`}
        style={{ maxHeight: 'calc(100vh - 2.5rem)' }}
      >
        <MdClose
          onClick={closePopup}
          fill="white"
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-red-400 text-gray-400 p-1 hover:text-gray-80 ease-linear cursor-pointerp-1 hover:text-gray-800 hover:bg-gray-400 transition-all duration-200 cursor-pointer"
        />
        <h2 className="text-base font-bold">{`${
          fanpage.page_name || 'page name here'
        } (${fanpage.total || 0} bài viết)`}</h2>
        <SearchAndFilter
          handleSearch={handleSearch}
          fanpage_id={fanpage.fanpage_id}
          getAllPost={getAllPost}
        />
        <PerfectScrollbar className="mt-7 text-nowrap -z-1">
          {renderContents()}
        </PerfectScrollbar>
      </div>
      {contentDetailToShow && <ContentDetail />}
    </div>
  );
}

export default React.memo(SpecialFollowPopup);
