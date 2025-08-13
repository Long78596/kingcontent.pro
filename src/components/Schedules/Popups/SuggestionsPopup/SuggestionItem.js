import React, { useCallback } from 'react';
import { AiFillLike } from 'react-icons/ai';
import { FaCommentDots, FaShare } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { numberWithCommas } from '../../../../utils/utilityFunc';
import * as SCHEDULES from '../../../../store/actions/Schedules';
import { setContentDetailToShow } from '../../../../store/actions/Contents/contentActions';
import moment from 'moment';

function SuggestionItem(props) {
  const { content: itemContent } = props;
  const {
    content = '',
    medias = null,
    comments = 0,
    likes = 0,
    shares = 0,
    post_timestamp,
    fanpage = null,
  } = itemContent;
  const dispatch = useDispatch();
  const images = medias && !Array.isArray(medias) ? JSON.parse(medias) : medias;

  const handleCreateSchedulePopup = useCallback(() => {
    dispatch(SCHEDULES.setShowSuggestionsPopup(false));
    dispatch(SCHEDULES.setShowCreateSchedulePopup(true));
    dispatch(SCHEDULES.setSuggestionContent(itemContent));
    dispatch(SCHEDULES.setSuggestionsContent([]));
  }, [itemContent]);

  const handleShowContent = useCallback(() => {
    dispatch(setContentDetailToShow(itemContent));
  }, [itemContent]);

  return (
    <li className="bg-white p-2 flex items-center justify-between rounded-md mx-2 my-2 cursor-default">
      <div
        className="flex items-center mr-2 cursor-pointer w-full"
        onClick={handleShowContent}
      >
        <div className="h-20 w-20 min-w-20 rounded-md overflow-hidden mr-2">
          <img
            className="h-full w-full object-cover"
            src={images[0] || ''}
            alt=""
          />
        </div>
        <div>
          <div className="flex flex-nowrap">
            <h3 className="text-sm text-blue-700 font-bold">
              {fanpage?.name || ''}
            </h3>
          </div>
          <p
            className="line-clamp-2 whitespace-pre-wrap font-semibold  text-sm"
            dangerouslySetInnerHTML={{ __html: content }}
          ></p>
          <span className="font-semibold text-gray-600  text-sm bg-gray-300 px-1">
            {moment(post_timestamp).format('DD/MM/YYYY')}
          </span>
        </div>
      </div>

      <div className="flex flex-nowrap">
        <div className="inline-flex items-center mr-2">
          <div className="flex items-center mx-2">
            <AiFillLike className="h-4 w-4 text-gray-400" />
            <span className="ml-1 text-gray-800 font-medium">
              {numberWithCommas(likes)}
            </span>
          </div>
          <div className="flex items-center mx-2">
            <FaCommentDots className="h-4 w-4 text-gray-400" />
            <span className="ml-1 text-gray-800 font-medium">
              {numberWithCommas(comments)}
            </span>
          </div>
          <div className="flex items-center mx-2">
            <FaShare className="h-4 w-4 text-gray-400" />
            <span className="ml-1 text-gray-800 font-medium">
              {numberWithCommas(shares)}
            </span>
          </div>
        </div>

        <div className="inline-flex items-center">
          <button
            onClick={handleShowContent}
            className="block py-1 px-2 mx-1 font-bold rounded-md bg-gray-200 text-gray-700 hover:bg-red-400 hover:text-gray-50 transition-all duration-200 ease-linear"
          >
            Xem
          </button>
          <button
            onClick={handleCreateSchedulePopup}
            className="block py-1 px-2 mx-1 font-bold rounded-md bg-gray-200 text-gray-700 hover:bg-red-400 hover:text-gray-50 transition-all duration-200 ease-linear min-w-70px"
          >
            Lên lịch
          </button>
        </div>
      </div>
    </li>
  );
}

export default React.memo(SuggestionItem);
