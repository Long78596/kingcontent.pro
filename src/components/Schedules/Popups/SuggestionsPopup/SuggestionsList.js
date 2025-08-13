import React, { Fragment, useEffect, useRef, useState } from 'react';
import ScrollBar from 'react-perfect-scrollbar';
import SuggestionItem from './SuggestionItem';
import { useDispatch, useSelector } from 'react-redux';

function SuggestionsList(props) {
  const { loadMore } = props;
  const suggestionsContent = useSelector(
    (state) => state.schedules.suggestionsContent
  );

  return (
    <div className="pb-2">
      <ul className="">
        {suggestionsContent && suggestionsContent.length > 0 && (
          <Fragment>
            <ScrollBar className="max-h-70">
              {suggestionsContent.map((content, i) => (
                <SuggestionItem key={i} content={content} />
              ))}
            </ScrollBar>
            <div
              onClick={loadMore}
              className="mt-2 text-base font-semibold text-center cursor-pointer text-gray-500 hover:text-red-500 transition-all duration-200 ease-linear"
            >
              Xem thêm
            </div>
          </Fragment>
        )}
        {!suggestionsContent ||
          (suggestionsContent.length === 0 && (
            <h5 className="text-center text-base text-red-500">
              Chúng tôi sẽ cập nhật sớm nhất có thể, vui lòng chọn chủ đề gợi ý
              khác
            </h5>
          ))}
      </ul>
    </div>
  );
}

export default React.memo(SuggestionsList);
