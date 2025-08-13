import { TYPE_GO_CONTENT } from '../../../../../utils/utilityFunc';
import Footer from '../../HomepageSpecial/SliderContents/Footer';
import { getFanpageAvatar } from '../../../../../helpers';
import { FiEye } from 'react-icons/fi';
import { FaPencilAlt } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import {
  actionUpdateStep1,
  resetCreateContent,
} from '../../../../../store/actions/createContent';
import { actionPushContentToCreateContentScreen } from '../../../../../store/actions/homepage';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
const TextStyled = styled.div`
  p {
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
`;

const SingleSubject = (props) => {
  const {
    subject,
    showFooter = false,
    className = 'rounded-full',
    width = 'w-4',
    height = 'h-4',
    likes = 0,
    comment = 0,
    shares = 0,
    openPopup,
    type = TYPE_GO_CONTENT,
    idx = 0,
  } = props;
  const { name, content, feed_id, profile_picture, medias = [], media_type = 'image', wishlist = 0 } = subject;
  const dispatch = useDispatch();
  const history = useHistory();

  const handelWritePost = () => {
    // reset
    dispatch(resetCreateContent());
    dispatch(actionUpdateStep1(true));
    // dispatch value
    dispatch(
      actionPushContentToCreateContentScreen(
        content,
        medias,
        media_type,
        wishlist === 1
      )
    );
    history.push('/tao-content');
  };

  return (
    <div
      className={`singleSubject relative flex items-center border-b border-gray-300 border-dotted hover:bg-gray-200 rounded-md cursor-pointer p-2 group ${
        idx % 2 === 0 ? '' : ''
      }`}
    >
      <div className="thumbnail">
        <img
          src={profile_picture ? profile_picture : getFanpageAvatar(feed_id)}
          alt={name}
          className={`${className} w-12 h-12`}
        />
      </div>
      <div className="detail p-2 w-5/6">
        <p className="font-bold mb-1">{name}</p>
        <TextStyled>
          <p className="italic text-gray-600 mb-2">{content}</p>
        </TextStyled>
        {showFooter && (
          <Footer
            likes={likes}
            comments={comment}
            shares={shares}
            heart={false}
            className={'justify-start'}
            width={width}
            height={height}
          />
        )}
      </div>
      <div className="overlay absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 invisible rounded z-10 group-hover:visible"></div>
      <div className="actions absolute invisible rounded top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 py-3 px-5 gap-5 flex transition-all ease-in-out text-white z-20 whitespace-nowrap group-hover:visible">
        <div
          className="flex items-center gap-2 w-1/2 cursor-pointer hover:bg-black bg-opacity-60 py-1 px-2 rounded"
          onClick={() => openPopup(subject, type)}
        >
          <FiEye
            size={30}
            color="#fff"
            className="hover:scale-125 cursor-pointer"
            title="Xem chi tiết"
          />
          <span>Xem chi tiết</span>
        </div>
        <div
          className="flex items-center gap-2 w-1/2 cursor-pointer hover:bg-black bg-opacity-60 py-1 px-2 rounded"
          onClick={() => handelWritePost()}
        >
          <FaPencilAlt
            size={20}
            color="#fff"
            className="hover:scale-125 cursor-pointer"
            title="Soạn bài viết"
          />
          <span>Soạn bài viết</span>
        </div>
      </div>
    </div>
  );
};

export default SingleSubject;
