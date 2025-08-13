import React, { useEffect, useState, memo } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import { ImSearch, ImPlus } from 'react-icons/im';
import { colors } from './settings';
import { getHashtags, createHashtag } from '../../store/actions/hashtag';

const HashtagsSearch = (props) => {
  const dispatch = useDispatch();
  const { isShowHashtag, hideTitle } = props;

  const [keyword, setKeyword] = useState([]);
  const onChange = (value) => {
    setKeyword(value);
  };

  const hashtags = useSelector((state) => state.hashtags.hashtags);

  const getDataHashtag = (value) => {
    dispatch(
      getHashtags({
        '_where[0][name_contains]': value !== undefined ? value : keyword,
      })
    );
  };

  const onSearchHashTags = () => {
    getDataHashtag();
  };

  useEffect(() => {
    setKeyword('');
    getDataHashtag();
  }, [isShowHashtag]);

  const onCreateHashTags = async () => {
    const checkDuplicate = [...hashtags].filter(
      (h) => h.name == keyword
    ).length;
    if (checkDuplicate) {
      alert('Hashtag already exists !!!');
    } else {
      alert(`Has successfully created ${keyword}`);
      // await createHashtag({
      //   data: {
      //     name: keyword,
      //   },
      // });
      setKeyword('');
      getDataHashtag('');
    }
  };

  const hashTagRows = [];
  hashtags.map((h, k) => {
    hashTagRows.push(
      <div className="pt-3 flex" key={h._id}>
        <div className={'w-5/6 font-bold ' + colors[k]}>{h.name}</div>
        <div className="w-1/6 text-right">{h.list_ids.length}</div>
      </div>
    );
  });

  return (
    <>
      {hideTitle ? (
        ''
      ) : (
        <div className="title w-full">
          <h2 className="text-base font-bold">Hashtag</h2>
        </div>
      )}
      <div className="max-h-top-contents overflow-auto">
        <div className="pt-3 flex">
          <div className="w-3/4 mr-2">
            <input
              className="border outline-none rounded-md p-2 w-full"
              placeholder="Tìm kiếm"
              value={keyword}
              onChange={(e) => onChange(e.target.value)}
            />
          </div>
          <div className="w-1/4 flex">
            <div
              onClick={() => onSearchHashTags()}
              className="group p-2 w-1/2 rounded-md border bg-blue-600 hover:bg-blue-400 transition-all duration-200 ease-linear cursor-pointer flex items-center justify-center "
            >
              <ImSearch className="h-5 w-5 text-gray-200" />
            </div>
            <div
              onClick={() => onCreateHashTags()}
              className="group p-2 w-1/2 rounded-md border bg-blue-600 hover:bg-blue-400 transition-all duration-200 ease-linear cursor-pointer flex items-center justify-center "
            >
              <ImPlus className="h-5 w-5 text-gray-200" />
            </div>
          </div>
        </div>
        {hashTagRows}
      </div>
    </>
  );
};

export default connect()(HashtagsSearch);
