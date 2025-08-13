import { useEffect, useState } from 'react';
import { FaPlus, FaSearch } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import {
  deleteWhiteSpace,
  isArrayEmpty,
  REG_REMOVE_WHITE_SPACE,
} from '../../configs';
import {
  REDUX_NAME_CONTENT_USER_LIKED,
  getFacebookIdFromUrl,
} from '../../utils/utilityFunc';
import { actionSearchContent } from '../../store/actions/contentUserLiked';
import { FiX } from 'react-icons/fi';
import { getFanpageAvatar } from '../../helpers';
const CardFanpageStyled = styled.div``;
const RightContent = ({ searchStatus, setSearchStatus }) => {
  const dispatch = useDispatch();
  const [feed_filter, setFeed_filter] = useState(null);
  const [searchHashTagStatus, setSearchHashTagStatus] = useState(false);
  const [contentsFilter, setContentsFilter] = useState([]);
  const { fanpages, hashTags } = useSelector(
    (state) => state[REDUX_NAME_CONTENT_USER_LIKED]
  );
  const [hashtagSelect, setHashtagSelect] = useState('');
  const { contents: likedContents = [] } = useSelector(
    (state) => state.contentUserLike
  );
  const [inputValue, setInputValue] = useState('');
  const [resultSearch, setResultSearch] = useState([]);
  const totalContent = likedContents.filter(
    (_elt) => _elt?.content?.medias?.length > 0
  );

  const onSeachHashtag = () => {
    setSearchHashTagStatus(true);
    const filterItem = hashTags.filter((_elt) => {
      return _elt?.hashtag
        .toLowerCase()
        .startsWith(deleteWhiteSpace(inputValue));
    });
    setResultSearch(filterItem);
  };
  const onSearchContentTag = (e, value) => {
    setHashtagSelect(value);
    e.preventDefault();
    const filterItem = contentsFilter.filter((_elt) => {
      return _elt?.hashtag?.includes(value);
    });
    if (filterItem.length !== 0) {
      setSearchStatus(true);
      dispatch(actionSearchContent(filterItem));
    } else {
      alert('Không tìm thấy kết quả , vui lòng tìm kiếm từ khoá khác !');
    }
  };
  const filterContentByPage = (item) => {
    setFeed_filter(item.content.feed_id);
    const newFilter = contentsFilter.filter(
      (_elt) => _elt.feed_id === item.content.feed_id
    );

    if (newFilter.length !== 0) {
      setSearchStatus(true);
      dispatch(actionSearchContent(newFilter));
    }
  };
  useEffect(() => {
    if (likedContents && likedContents.length > 0) {
      const newContents = likedContents.reduce((acc, item) => {
        const { content = null, type_id, hashtag, id } = item;
        if (content)
          acc.push({ ...content, contentId: type_id, hashtag: hashtag, id });
        return acc;
      }, []);
      setContentsFilter(newContents);
    } else {
      setContentsFilter([]);
    }
  }, [likedContents]);
  return (
    <>
      <div className="flex justify-between gap-3 mt-2">
        <div className="bg-white rounded-lg p-1 w-full shadow-lg text-center">
          <p className="text-red-600 text-3xl font-bold">
            {totalContent.length}
          </p>
          <p>Content đã thích</p>
        </div>
        <div className="bg-white rounded-lg p-1 w-full shadow-lg text-center">
          <p className="text-green-600 text-3xl font-bold">
            {hashTags?.length}
          </p>
          <p>Hashtag</p>
        </div>
      </div>
      {/* top fanpage  */}

      <CardFanpageStyled className="mt-5 rounded-md p-3 bg-white shadow-smBlackShadow">
        <h3 className="text-base font-bold mb-2">
          Fanpage chứa content đã thích
        </h3>
        {/* render data */}
        {!isArrayEmpty(fanpages) ? (
          <ul className=" max-h-98 overflow-y-scroll">
            {fanpages.map((_elt, index) => {
              const { content = null } = _elt;
              return (
                content && (
                  <div
                    className={`mt-5 mb-5 flex items-center justify-between cursor-pointer ${
                      feed_filter === content?.feed_id && 'bg-gray-200'
                    } rounded-md px-1`}
                    key={index}
                  >
                    <div
                      className="w-2/3 flex items-center"
                      onClick={() => filterContentByPage(_elt)}
                    >
                      <img
                        src={`${getFanpageAvatar(content?.feed_id)}`}
                        className="w-14 h-14 mt-2  rounded-full"
                      />
                      <span className="font-bold pl-3 inline-block align-middle ">
                        {content?.user_screenname}
                      </span>
                    </div>

                    {feed_filter === content?.feed_id && (
                      <FiX
                        color="red"
                        size={25}
                        onClick={() => {
                          setFeed_filter(null);
                          setSearchStatus(false);
                        }}
                      />
                    )}
                  </div>
                )
              );
            })}
          </ul>
        ) : (
          <div className="flex items-center h-80 w-full justify-center">
            <div className="font-bold text-red-600">Không tìm thấy kết quả</div>
          </div>
        )}
      </CardFanpageStyled>
      {/* hagtag  */}
      <div className="mt-5 rounded-md p-3 bg-white shadow-smBlackShadow">
        <h3 className="text-base font-bold mb-2">Hashtag</h3>
        <div className="flex gap-2 mb-2">
          <input
            className="w-full h-12 rounded-md shadow-sm outline-none border-2 p-2 border-gray-300"
            placeholder="Nhập nội dung tìm kiếm"
            onChange={(e) => {
              if (!e.target.value) {
                setSearchHashTagStatus(false);
              }
              setInputValue(e.target.value);
            }}
          />
          <button
            className="w-14 h-12 bg-blue-600 text-white flex justify-center items-center rounded-lg hover:bg-blue-700"
            onClick={onSeachHashtag}
          >
            <FaSearch size={20} />
          </button>
          {/* <button className="w-14 h-12 bg-blue-600 text-white flex justify-center items-center rounded-lg hover:bg-blue-700">
            <FaPlus size={20} />
          </button> */}
        </div>
        {searchHashTagStatus ? (
          <ul>
            {resultSearch.map((_elt, index) => (
              <li
                className="flex justify-between p-4 items-center hover:bg-gray-200 rounded-md cursor-pointer"
                key={_elt.id}
              >
                <span
                  className="text-yellow-500"
                  onClick={(e) => onSearchContentTag(e, _elt.hashtag)}
                >
                  #{_elt.hashtag}
                </span>
                {hashtagSelect === _elt.hashtag && (
                  <FiX
                    color="red"
                    size={25}
                    onClick={() => {
                      setHashtagSelect('');
                      setSearchStatus(false);
                    }}
                  />
                )}
              </li>
            ))}
          </ul>
        ) : (
          <ul>
            {hashTags.map((_elt, index) => (
              <li
                className="flex justify-between p-4 items-center hover:bg-gray-200 rounded-md cursor-pointer"
                key={_elt.id}
              >
                <span
                  className="text-yellow-500"
                  onClick={(e) => onSearchContentTag(e, _elt.hashtag)}
                >
                  #{_elt.hashtag}
                </span>
                {hashtagSelect === _elt.hashtag && (
                  <FiX
                    color="red"
                    size={25}
                    onClick={() => {
                      setHashtagSelect('');
                      setSearchStatus(false);
                    }}
                  />
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default RightContent;
