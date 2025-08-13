import React, { useEffect, useRef } from 'react';
import { FaSignal } from 'react-icons/fa';
import { FiTrendingUp } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { getTotalFanpages } from '../../store/actions/Contents/contentActions';
import { getTotalTrendingContents } from '../../store/actions/Contents/trendingActions';

const numberWithCommas = (x) =>
  x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

function Header(props) {
  const pageLimit = 12;
  const keywords = useSelector((state) => state.trendings.keywords);
  const totalTrendingContents = useSelector(
    (state) => state.trendings.totalTrendings
  );
  const { totalFanpages } = useSelector((state) => state.contents);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(
      getTotalTrendingContents(pageLimit, 1, keywords.toLowerCase().trim())
    );
    dispatch(getTotalFanpages());
  }, []);
  const {
    title = 'Đang thịnh hành',
    icon = <FiTrendingUp className="h-7 w-7 text-gray-50 font-semibold" />,
  } = props;
  return (
    <div className="px-3 py-2 bg-primary rounded-t-lg flex items-center sm:justify-between justify-start flex-wrap cursor-default">
      <div className="ml-3 flex items-center">
        {icon}

        <span className="ml-3 text-base text-gray-50 font-semibold filter drop-shadow-md sm:normal-case uppercase">
          {title}
        </span>
      </div>
      <div className="mr-3 flex items-center justify-between flex-wrap">
        <div className="flex items-center px-4 ">
          <FaSignal className="sm:h-9 sm:w-9 h-5 w-5 text-gray-50 transform rotateX-90" />
          <div className="ml-2 flex sm:items-start items-center sm:flex-col flex-row text-gray-50">
            <h2 className="mr-2 sm:text-base text-base font-semibold filter drop-shadow-md">
              {numberWithCommas(totalTrendingContents)}
            </h2>
            <span className="font-medium">Mẫu Contents</span>
          </div>
        </div>
        <div className="flex items-center px-4 ">
          <FaSignal className="sm:h-9 sm:w-9 h-5 w-5 text-gray-50 transform rotateX-90" />
          <div className="ml-2 flex sm:items-start items-center sm:flex-col flex-row text-gray-50">
            <h2 className="mr-2 sm:text-base text-base font-semibold filter drop-shadow-md">
              {numberWithCommas(totalFanpages)}
            </h2>
            <span className="font-medium">Pages</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default React.memo(Header);
