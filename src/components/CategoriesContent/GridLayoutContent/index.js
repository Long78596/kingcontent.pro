import { Masonry } from 'masonic';
import React, { useEffect, useState } from 'react';
  import CategoriesContentItem from '../CategoriesContentItem/Body.js';
// CategoriesContentItem
import './style.css';
import { useDispatch, useSelector } from 'react-redux';
import { saveLikedData, updateLikedData } from '../../../store/actions/user';
import PopupTag from '../CategoriesContentItem/hashtagPopup.js';
import { PATH_NAME_CONTENT_LIKED } from '../../../configs';
import { useLocation, useHistory } from 'react-router-dom';
import { actionGetAllContent } from '../../../store/actions/contentUserLiked';
import { isObjEmpty } from '../../../utils/utilityFunc';

function GridLayoutContent(props) {
  const {
    currentContents,
    page,
    cateId,
    setContentDetailToShow,
    reactiveGetLikedData,
    col = 3,
    mdCol = 2,
    smCol = 1,
    setIsMorePost,
  } = props;
  const [contentSelect, setContentSelect] = useState({});
  const history = useHistory();
  const location = useLocation();
  const { user } = useSelector((state) => state.userReducer);
  const [isOpenPopupTag, setIsOpenPopupTag] = useState(false);
  const dispatch = useDispatch();

  const handleLikePost = (tag) => {
    const savedData = {
      type: 'content',
      cate_id: cateId || null,
      source_type: contentSelect?.source_type || 'system',
      type_id: contentSelect?.post_id,
      hashtag: tag,
      fanpage: '',
    };
    dispatch(saveLikedData(savedData, history, togglePopupTag));
  };
  const togglePopupTag = () => {
    setIsOpenPopupTag(false);
  };
  const handleUpdateHashTag = (tag) => {
    dispatch(
      updateLikedData(
        contentSelect.id,
        { hashtag: tag, user_id: user.id },
        togglePopupTag,
        reactiveGetLikedData
      )
    );
  };
  useEffect(() => {
    dispatch(actionGetAllContent());
  }, []);

  return (
    <>
      <ul
        className={`gridLayout overflow-x-hidden rounded-lg ${
          page ? 'grid-column-gap-30' : ''
        } grid xl:grid-cols-${col} md:grid-cols-${mdCol} grid-cols-${smCol}`}
      >
        {currentContents &&
          currentContents.map((content, index) => (
            <CategoriesContentItem
              key={index}
              content={content}
              page={page}
              cateId={cateId}
              setContentDetailToShow={setContentDetailToShow}
              reactiveGetLikedData={reactiveGetLikedData}
              isOpenPopupTag={isOpenPopupTag}
              setIsOpenPopupTag={setIsOpenPopupTag}
              togglePopupTag={togglePopupTag}
              setContentSelect={setContentSelect}
              setIsMorePost={setIsMorePost}
            />
          ))}
      </ul>
      <PopupTag
        isOpen={isOpenPopupTag}
        toggle={togglePopupTag}
        onSubmitClick={
          location.pathname === PATH_NAME_CONTENT_LIKED
            ? handleUpdateHashTag
            : handleLikePost
        }
        hashtag={!isObjEmpty(contentSelect) ? contentSelect.hashtag : ''}
        setIsOpenPopupTag={setIsOpenPopupTag}
      />
    </>
  );
}

export default React.memo(GridLayoutContent);
