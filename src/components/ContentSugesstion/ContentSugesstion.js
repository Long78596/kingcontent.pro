import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BiSkipNext, BiSkipPrevious } from 'react-icons/bi';
import {
  actionGetPostByKeyword,
  actionResetState,
  toggleEditorText,
} from '../../store/actions/createContent';
import LoadingApp from '../LoadingApp';
import { actionLoadingApp } from '../../store/actions/loading';
const ContentSugestion = ({ api, query, typeSug, typePost }) => {
  const { posts } = useSelector((state) => state.createPost);
  const { isLoading } = useSelector((state) => state.isLoadingApp);
  const [startDocument, setStartDocument] = useState(5);
  const dispatch = useDispatch();
  const handlePageClick = (type) => {
    if (type === 'prev') {
      dispatch(actionResetState());
      const page = startDocument - 150;
      setStartDocument(page);
      dispatch(actionLoadingApp(true));
      dispatch(actionGetPostByKeyword(api, query, typeSug, page));
    } else if (type === 'next') {
      dispatch(actionResetState());
      const page = startDocument + 150;
      setStartDocument(page);
      dispatch(actionLoadingApp(true));
      dispatch(actionGetPostByKeyword(api, query, typeSug, page));
    }
  };
  return (
    <div className="flex flex-col overflow-y-scroll overflow-x-hidden max-h-80">
      <div className="flex-grow ">
        {posts.length === 0 && !isLoading ? (
          <div className="flex justify-center">
            <span className="font-bold">Không có dữ liệu hiển thị</span>
          </div>
        ) : posts.length === 0 && isLoading ? (
          <LoadingApp />
        ) : (
          <table className="relative w-full">
            <thead className="bg-white z-10">
              <tr className="bg-white z-10">
                <th className="sticky top-0 px-6 py-3 bg-white z-10">
                  Mẫu câu
                </th>
                <th className="sticky top-0 px-6 py-3 bg-white min-w-52">
                  Đã dùng
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <>
                {posts
                  .sort((a, b) => b.usedNumber - a.usedNumber)
                  .map((_elt, index) => (
                    <tr key={index} className="hover:bg-gray-200" onClick={() => dispatch(toggleEditorText(_elt?.title))}>
                      <td className="px-6 py-4 text-left cursor-pointer">
                        <p
                          dangerouslySetInnerHTML={{ __html: _elt.title }}
                          className=""
                        ></p>
                      </td>
                      <td className="px-6 py-4 text-center cursor-pointer min-w-8">
                        {_elt.usedNumber}
                      </td>
                    </tr>
                  ))}
              </>
            </tbody>
          </table>
        )}
        {
          typePost === 'idea' ? null :  <div className="flex justify-center gap-2 mt-5">
          {startDocument === 5 ? null : (
            <button
              className={`
          bg-blue-500
        rounded-md p-3 text-white hover:bg-red-500  min-w-12`}
              onClick={() => handlePageClick('prev')}
              disabled={startDocument === 5}
            >
              <BiSkipPrevious size={25} />
            </button>
          )}
          {posts.length === 0 ? null : (
            <button
              className={`
        bg-blue-500
      rounded-md p-3 text-white hover:bg-red-500`}
              onClick={() => handlePageClick('next')}
              disabled={posts.length === 0}
            >
              <BiSkipNext size={25} />
            </button>
          )}
        </div>
        }
       
      </div>
    </div>
  );
};

export default ContentSugestion;
