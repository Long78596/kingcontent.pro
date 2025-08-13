import { Fragment, useEffect, useState } from 'react';
import { connect, useSelector } from 'react-redux';
import Card from './Card';
import SearchBox from './SearchBox';
import PopupDetailContentPlan from '../../pages/createPost/components/planCpn/popupDetail';
import GridLayoutContent from '../CategoriesContent/GridLayoutContent';
import Pagination from '../CategoriesContent/Pagination';
const limit = 9;

const LeftContent = (props) => {
  const { searchStatus = false, setSearchStatus = () => {} } = props;
  const [isOpen, setIsOpen] = useState(false);
  const [item, setItem] = useState({});

  const {
    contents: likedContents = [],
    fanpages = [],
    contentsSearch = [],
  } = useSelector((state) => state.contentUserLike);
  const [contents, setContents] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);

  const paginateResult = (data, page) => {
    const start = (page - 1) * limit;
    const end = page * limit;
    const slicedData = data.slice(start, end);
    // destruct
    const newContents = slicedData.reduce((acc, item) => {
      const { content = null, type_id, hashtag, id } = item;
      if (content)
        acc.push({ ...content, contentId: type_id, hashtag: hashtag, id });
      return acc;
    }, []);
    return newContents;
  };

  useEffect(() => {
    if (likedContents && likedContents.length > 0) {
      // paginate
      setContents(paginateResult(likedContents, page));
    } else {
      setContents([]);
    }
  }, [likedContents, page]);

  useEffect(() => {
    if (searchStatus) {
      setTotalPage(Math.ceil(contentsSearch.length / limit));
    } else {
      setTotalPage(Math.ceil(likedContents.length / limit));
    }
  }, [likedContents, contentsSearch, searchStatus]);

  return (
    <>
      <SearchBox data={contents} setSearchStatus={setSearchStatus} />
      <div>
        {contents?.length > 0 ? (
          <Fragment>
            <GridLayoutContent
              currentContents={searchStatus ? contentsSearch : contents}
              page={'contentLikedPage'}
              reactiveGetLikedData={props.reactiveGetLikedData}
            />
            <Pagination
              pageNeighbours={1}
              onPageChanged={setPage}
              totalPages={totalPage}
              currentPage={page}
              setCurrentPage={setPage}
              loading={false}
            />
          </Fragment>
        ) : (
          <div className="flex justify-center items-center h-96 bg-white w-full rounded-md">
            <div className="text-center">
              <p className="text-base">Bạn chưa thích bài viết nào</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default LeftContent;
