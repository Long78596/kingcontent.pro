import { useSelector } from 'react-redux';
import Content from './Content';

const Contents = (props) => {
  const { isIdea = false } = props;
  const {
    contents = [],
    loading = false,
    currentPage = 1,
  } = useSelector((state) => state.contents);

  return (
    <div className="feedbackContents overflow-auto" style={{ maxHeight: 900 }}>
      {/* show loading when currentPage = 1 */}
      {currentPage === 1 && loading && (
        <div className="flex justify-center items-center">
          <div className="loader">Đang lấy dữ liệu từ hệ thống...</div>
        </div>
      )}
      <div className="contents">
        {contents.length > 0 ? (
          contents?.map((content, index) => (
            <div key={index} className="content">
              <Content content={content} isIdea={isIdea} />
            </div>
          ))
        ) : (
          <div className="flex justify-center items-center h-60 w-full justify-center">
            <span className="text-xl">Không tìm thấy kết quả</span>
          </div>
        )}
        {/* show loading when get next page */}
        {currentPage > 1 && loading && (
          <div className="flex justify-center items-center">
            <div className="loader">Đang lấy dữ liệu từ hệ thống...</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Contents;
