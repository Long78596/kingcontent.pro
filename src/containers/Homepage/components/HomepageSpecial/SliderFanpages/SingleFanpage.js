import { useHistory } from 'react-router-dom/cjs/react-router-dom';
import styled from 'styled-components';

const TextStyled = styled.div`
  span {
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
`;
const SingleFanpage = (props) => {
  const { fanpage = null } = props;
  const { fanpage: fanpageData = null } = fanpage;
  const history = useHistory();

  const onClickFanpage = () => {
    if (fanpageData) {
      history.push(`/theo-doi-dac-biet?feed_id=${fanpageData.feed_id}`);
    } else {
      history.push(`/theo-doi-dac-biet?feed_id=${fanpage.fanpage_id}`);
    }
  };

  return (
    <div
      className="singleFanpage flex items-center gap-2 bg-gray-100 rounded-3xl mb-1 mr-2 p-2 cursor-pointer"
      onClick={() => onClickFanpage()}
    >
      <div className="avatar">
        <div
          className="w-16 h-16 rounded-full border-white bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${
              (fanpageData && fanpageData.user_pic) || fanpage?.user_pic
            })`,
          }}
        ></div>
      </div>
      <div className="fpDetail my-1 pl-2 truncate">
        <p className="text-base">
          {(fanpageData && fanpageData.user_screenname) || fanpage.page_name}
        </p>
        <p className="italic">
          <span className="text-red-500 font-bold">
            {fanpageData?.total || fanpage?.total}
          </span>{' '}
          bài viết mới
        </p>
      </div>
    </div>
  );
};

export default SingleFanpage;
