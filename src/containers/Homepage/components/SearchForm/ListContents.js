import { connect } from 'react-redux';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { Link } from 'react-router-dom';

const ListContents = (props) => {
  const { contents } = props;

  const renderContents = (contents) => {
    return (
      <>
        <h3 className="font-bold pb-4 uppercase hidden">Kết quả tìm kiếm</h3>
        <PerfectScrollbar className="listResults pr-4 font-bold pb-10">
          {contents.map((content, index) => {
            const { name, search_count, category } = content;
            const slug = '';
            const link = `/danh-muc/${category?.cate_url}/${category?.cate_id}?keyword=${name}`;
            return (
              <Link
                to={link}
                key={index}
                className="contentItem cursor-pointer p-2 mb-1 rounded-md flex hover:bg-gray-300 items-center"
              >
                <div className="tagName w-2/5">{name}</div>
                <div className="cateName w-2/5 px-2">
                  {category?.cate_name || ''}
                </div>
                <div className="text-right w-1/5">{search_count}</div>
              </Link>
            );
          })}
        </PerfectScrollbar>
      </>
    );
  };

  return <>{contents && contents.length > 0 && renderContents(contents)}</>;
};

export default ListContents;
