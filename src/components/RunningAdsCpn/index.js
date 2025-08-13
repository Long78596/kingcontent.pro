import { useEffect, useState } from 'react';
import { FiVideo } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import {
  getTotalContents,
  setContentDetailToShow,
} from '../../store/actions/Contents/contentActions';
import ContentDetail from '../CategoriesContent/ContentDetail';
import Header from '../Trendings/Header';
import SearchBox from './SearchBox';
import GridLayoutContent from '../CategoriesContent/GridLayoutContent';
import { actionSearchADS } from '../../store/actions/runningAds';

const RunningAdsCpn = (props) => {
  const { contentDetailToShow, totalContents } = useSelector(
    (state) => state.contents
  );

  const { searchADSData } = useSelector((state) => state.adsRunning);
  const { keyword, forward_cursor, collection_token } = searchADSData;
  const dispatch = useDispatch();
  const [searchStatus, setSearchStatus] = useState(false);
  const [loading, setLoading] = useState(false);
  const [nextLoading, setNextLoading] = useState(false);

  useEffect(() => {
    dispatch(getTotalContents());
  }, []);

  const onLoadMore = () => {
    dispatch(
      actionSearchADS(keyword, setNextLoading, collection_token, forward_cursor)
    );
  };

  return (
    <div className="pb-10">
      <Header
        totalTrendingContents={totalContents}
        title="Đang chạy ads"
        icon={<FiVideo className="h-7 w-7 text-gray-50 font-semibold" />}
      />
      <SearchBox setSearchStatus={setSearchStatus} setLoading={setLoading} />
      {loading ? (
        <div className="flex justify-center items-center relative">
          <div className="animate-spin rounded-full h-24 w-24 border-b-2 border-t-2 border-gray-600"></div>
          <label className="absolute top-1/3 z-10">Đang lấy dữ liệu ...</label>
        </div>
      ) : (
        <div>
          {searchStatus || searchADSData.length !== 0 ? (
            <div>
              {/* <Card content={searchADSData?.results} /> */}
              <GridLayoutContent
                currentContents={searchADSData?.results}
                page={'ads'}
                col={4}
                setContentDetailToShow={setContentDetailToShow}
              />
              {nextLoading && (
                <div className="flex justify-center items-center relative">
                  <div className="animate-spin rounded-full h-24 w-24 border-b-2 border-t-2 border-gray-600"></div>
                  <label className="absolute top-1/3 z-10">
                    Đang lấy thêm dữ liệu ...
                  </label>
                </div>
              )}

              {forward_cursor && (
                <div className="flex justify-center mt-5">
                  <button
                    onClick={onLoadMore}
                    className="bg-blue-600 text-white px-5 py-2 rounded-lg w-1/2"
                  >
                    Xem thêm
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex justify-center h-schedule-contents">
              <h3 className="text-xl">Không tìm thấy kết quả</h3>
            </div>
          )}
        </div>
      )}
      {contentDetailToShow && <ContentDetail />}
    </div>
  );
};

export default RunningAdsCpn;
