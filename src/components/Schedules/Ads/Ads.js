import { useDispatch, useSelector } from 'react-redux';
import SearchBox from '../../RunningAdsCpn/SearchBox';
import Card from '../../RunningAdsCpn/Card';
import DialogDetailPost from '../SingleContent/';
import React, { useCallback, useEffect, useState } from 'react';
import SingleContent from '../SingleContent';
import SingleAdsContent from '../SingleContent/SingleAdsContent';
import {
  setIsShowFinalStep,
  setSelectedScheduleContent,
  setShowSourceIdeasPopup,
} from '../../../store/actions/Schedules';
import LoadingApp from '../../LoadingApp';
import { actionSearchADS } from '../../../store/actions/runningAds';
import { setContentDetailToShow } from '../../../store/actions/Contents/contentActions';

const Ads = (props) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [collectionToken, setCollectionToken] = useState('');
  const [forwardCursor, setForwardCursor] = useState('');
  const [contents, setContents] = useState([]);

  const { searchADSData = null, keyword = '' } = useSelector(
    (state) => state.adsRunning
  );

  const handleActionShowPopup = (elt) => {
    const { images = [], videos = [], page_name = '', timestamp } = elt;
    let mediaType = 'image';
    let mediaUrl = '';
    let medias = [];
    if (videos.length > 0) {
      mediaType = 'video';
      mediaUrl = videos[0].video;
      medias.push(videos[0].thumb);
    } else {
      medias = images;
    }
    dispatch(
      setContentDetailToShow({
        ...elt,
        medias: medias,
        user_screenname: page_name,
        post_timestamp: timestamp,
        media_type: mediaType,
        media_url: mediaUrl,
      })
    );
  };

  useEffect(() => {
    if (searchADSData) {
      const {
        collection_token = '',
        forward_cursor = '',
        results = [],
      } = searchADSData;
      setContents(results);
      setCollectionToken(collection_token);
      setForwardCursor(forward_cursor);
    } else {
      setContents([]);
      setCollectionToken('');
      setForwardCursor('');
    }
  }, [searchADSData]);

  const handleLoadMore = useCallback(() => {
    dispatch(
      actionSearchADS(keyword, setIsLoading, collectionToken, forwardCursor)
    );
  }, [dispatch, collectionToken, forwardCursor, keyword]);

  const handleAddToSchedule = useCallback(
    (elt) => {
      dispatch(
        setSelectedScheduleContent({
          ...elt,
          source_type: 'ads',
        })
      );
      dispatch(setIsShowFinalStep(true));
      dispatch(setShowSourceIdeasPopup(false));
    },
    [dispatch]
  );

  return (
    <>
      <SearchBox setLoading={setIsLoading} />
      {contents.length === 0 && !isLoading ? (
        <div className="flex justify-center h-60 items-center">
          <span className="font-bold">
            Nhập từ khoá để có được kết quả chính xác
          </span>
        </div>
      ) : isLoading ? (
        <LoadingApp />
      ) : (
        <div>
          <div
            className={` grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2`}
          >
            {contents.map((_elt, index) => (
              <SingleAdsContent
                handleAddToSchedule={handleAddToSchedule}
                handleActionShowPopup={handleActionShowPopup}
                key={index}
                item={_elt}
              />
            ))}
          </div>
          <div className="flex justify-center">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => handleLoadMore()}
            >
              Xem thêm
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Ads;
