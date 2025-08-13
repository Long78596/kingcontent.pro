import RightContent from './components/RightContent';
import SearchForm from './components/SearchForm';

import { useEffect } from 'react';
import 'react-multi-carousel/lib/styles.css'; // requires a loader
import { connect, useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getTrenddingData } from '../../store/actions/homepage';
import { actionGetTiktokVideosAll } from '../../store/actions/tiktok';
import ScheduleSlider from './components/HomepageScheduleContents/ScheduleSlider';
import SliderContents from './components/HomepageSpecial/SliderContents';
import SliderFanpages from './components/HomepageSpecial/SliderFanpages';
import VideoTiktoks from './components/HomepageSpecial/videoTiktoks';
import VideoDouYin from './components/HomepageSpecial/videoDouyin';

import ContentDetail from '../../components/CategoriesContent/ContentDetail/ContentDetail';
import { setContentDetailToShow } from '../../store/actions/Contents/contentActions';
import { actionGetDouyinVideos } from '../../store/actions/douyin';
// import VideoInstagram from './components/HomepageSpecial/VideoInstagram';
 import VideoInstagram from './components/HomepageSpecial/Videolnstagram/index.js';
import { actionGetHashtagPosts } from '../../store/actions/instagram';

const Homepage = (props) => {
  const dispatch = useDispatch();
  const { searchVideos = null } = useSelector((state) => state.tiktoks);
  const { searchVideos: searchVideosDouYin = null } = useSelector(
    (state) => state.douyins
  );
  const { posts = null } = useSelector((state) => state.instagram);

  const { contentDetailToShow } = useSelector((state) => state.contents);

  useEffect(() => {
    dispatch(setContentDetailToShow(null));
    if (searchVideos && searchVideos.videos.length === 0) {
      dispatch(actionGetTiktokVideosAll());
    }
    dispatch(getTrenddingData());
  }, []);

  useEffect(() => {
    if (
      !searchVideosDouYin ||
      (searchVideosDouYin &&
        searchVideosDouYin.videos &&
        searchVideosDouYin.videos.length === 0)
    ) {
      dispatch(actionGetDouyinVideos('trend'));
    }
  }, []);

  useEffect(() => {
    if (!posts || (posts && posts.length === 0)) {
      dispatch(actionGetHashtagPosts('trend'));
    }
  }, [posts]);

  return (
    <>
      <div className="homepageContainer w-full px-2">
        <div className="mb-3">
          <SearchForm />
        </div>
        <div className="flex gap-5 sm:flex-wrap lg:flex-nowrap sm:w-full">
          <div className="sm:w-full md:w-8/12 lg:w-8/12">
            <div className="homeScheduleContents rounded-lg shadow-md p-5 bg-white mb-5">
              <div className="flex items-center justify-between py-2 px-5">
                <h2 className="font-bold uppercase text-base">
                  Lịch đăng bài hôm nay
                </h2>
                <span className="text-blue-500 underline font-bold">
                  {' '}
                  <Link to="/lich-dang-bai" className="italic ml-auto mr-5">
                    Lên lịch đăng bài
                  </Link>
                </span>
              </div>
              <ScheduleSlider />
            </div>
            {/* FANPAGE  */}
            <div className="homeSpecialFanpages rounded-lg shadow-md p-5 bg-white mb-5">
              <div className="flex items-center justify-between py-2 px-5">
                <h2 className="font-bold uppercase text-base">
                  Đang theo dõi đặc biệt
                </h2>
                <span className="text-blue-500 underline font-bold">
                  {' '}
                  <Link to="/theo-doi-dac-biet" className="italic ml-auto mr-5">
                    Xem tất cả
                  </Link>
                </span>
              </div>
              <SliderFanpages />
              <SliderContents />
            </div>

            <div className="trendingTikTok rounded-lg shadow-md p-5 mt-5 bg-white mb-5">
              <div className="flex items-center justify-between py-2 px-5">
                <h2 className="font-bold uppercase text-base">
                  Video Tiktok đang thịnh hành
                </h2>
                <span className="text-blue-500 underline font-bold">
                  <Link to="/quan-ly-tiktok" className="italic ml-auto mr-5">
                    Xem tất cả
                  </Link>
                </span>
              </div>
              <VideoTiktoks searchVideos={searchVideos} />
            </div>

            {/* Trending Douyin */}
            <div className="trendingDouyin rounded-lg shadow-md p-5 mt-5 bg-white mb-5">
              <div className="flex items-center justify-between py-2 px-5">
                <h2 className="font-bold uppercase text-base">
                  Video Douyin đang thịnh hành
                </h2>
                <span className="text-blue-500 underline font-bold">
                  <Link to="/quan-ly-douyin" className="italic ml-auto mr-5">
                    Xem tất cả
                  </Link>
                </span>
              </div>
              <VideoDouYin searchVideos={searchVideosDouYin} />
            </div>

            {/* Trending Instagram */}
            <div className="trendingInstagram rounded-lg shadow-md p-5 mt-5 bg-white mb-5">
              <div className="flex items-center justify-between py-2 px-5">
                <h2 className="font-bold uppercase text-base">
                  Bài viết Instagram đang thịnh hành
                </h2>
                <span className="text-blue-500 underline font-bold">
                  <Link to="/quan-ly-instagram" className="italic ml-auto mr-5">
                    Xem tất cả
                  </Link>
                </span>
              </div>
              <VideoInstagram searchPosts={posts} />
            </div>
          </div>
          <div className="sm:w-full md:w-4/12 lg:4/12">
            <RightContent />
          </div>
        </div>
      </div>
      {contentDetailToShow && <ContentDetail />}
    </>
  );
};

export default Homepage;
