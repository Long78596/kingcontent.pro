import { memo, useState } from 'react';
import CountUp from 'react-countup';
import CalendarIcon from '../../assets/images/interactions/calendar.png';
import ContentIcon from '../../assets/images/interactions/content.png';
import FacebookIcon from '../../assets/images/interactions/facebook.png';
import UserIcon from '../../assets/images/interactions/user.png';
import { ImSearch } from 'react-icons/im';

const Summary = (props) => {
  const {
    totalContents = Math.floor(Math.random() * 100000),
    totalFanpages = Math.floor(Math.random() * 100000),
    totalUsers = Math.floor(Math.random() * 100000),
    totalCalendars = Math.floor(Math.random() * 100000),
    totalContentsLiked = Math.floor(Math.random() * 100000),
    totalHashtag = Math.floor(Math.random() * 100000),
    onSearch,
    page,
  } = props;
  const [valueKeywords, setValueKeywords] = useState('');

  let searchContent = <></>;
  if (page === 'contentLikedPage') {
  
    const handleChange = (evt) => setValueKeywords(evt.target.value);

    searchContent = (
      <>
        <div className="w-7.4/10 float-left flex">
          <div className="w-11/12 mr-2">
            <input
              onChange={handleChange}
              value={valueKeywords}
              className="border outline-none rounded-md p-3 w-full"
              placeholder="Tìm kiếm"
            />
          </div>
          <div className="w-1/12 ml-1">
            <div className="group p-2.5 rounded-md border bg-blue-600 hover:bg-blue-400 transition-all duration-200 ease-linear cursor-pointer flex items-center justify-center ">
              <ImSearch
                onClick={() => onSearch(valueKeywords)}
                className="h-6 w-6 text-gray-200"
              />
            </div>
          </div>
        </div>
        <div className="w-2.4/10 float-right">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white shadow-smBlackShadow rounded-md overflow-hidden cursor-pointer group text-center py-1">
              <CountUp
                start={0}
                end={totalContentsLiked}
                duration={2}
                separator="."
                decimal="."
                className="text-red-500 text-base block leading-4 font-bold"
              />
              <span className="text-base leading-4">Content đã thích</span>
            </div>
            <div className="bg-white shadow-smBlackShadow rounded-md overflow-hidden cursor-pointer group text-center py-1">
              <CountUp
                start={0}
                end={totalHashtag}
                duration={2}
                separator="."
                decimal="."
                className="text-green-700 text-base block leading-4 font-bold"
              />
              <span className="text-base leading-4">Hashtag</span>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="categoriesSummary grid grid-cols-4 gap-2 mb-5">
        <div className="totalContents bg-white shadow-smBlackShadow rounded-xl overflow-hidden p-3 cursor-pointer group">
          <div className="pt-6 pb-10 flex">
            <div className="w-3/4 pl-3">
              <CountUp
                start={0}
                end={totalContents}
                duration={2}
                separator="."
                decimal="."
                className="text-red-500 text-5xl mb-1"
              />
              <div className="text-base">Mẫu quảng cáo</div>
            </div>
            <div className="w-1/4 relative">
              <img src={ContentIcon} className="w-14 absolute inset-0 m-auto" />
            </div>
          </div>
        </div>
        <div className="totalContents bg-white shadow-smBlackShadow rounded-xl overflow-hidden p-3 cursor-pointer group">
          <div className="pt-6 pb-10 flex">
            <div className="w-3/4 pl-3">
              <CountUp
                start={0}
                end={totalFanpages}
                duration={2}
                separator="."
                decimal="."
                className="text-green-700 text-5xl mb-1"
              />
              <div className="text-base">Fanpages</div>
            </div>
            <div className="w-1/4 relative">
              <img
                src={FacebookIcon}
                className="w-14 absolute inset-0 m-auto"
              />
            </div>
          </div>
        </div>
        <div className="totalContents bg-white shadow-smBlackShadow rounded-xl overflow-hidden p-3 cursor-pointer group">
          <div className="pt-6 pb-10 flex">
            <div className="w-3/4 pl-3">
              <CountUp
                start={0}
                end={totalUsers}
                duration={2}
                separator="."
                decimal="."
                className="text-editor-formular text-5xl mb-1"
              />
              <div className="text-base">Nhà sáng tạo</div>
            </div>
            <div className="w-1/4 relative">
              <img src={UserIcon} className="w-14 absolute inset-0 m-auto" />
            </div>
          </div>
        </div>
        <div className="totalContents bg-white shadow-smBlackShadow rounded-xl overflow-hidden p-3 cursor-pointer group">
          <div className="pt-6 pb-10 flex">
            <div className="w-3/4 pl-3">
              <CountUp
                start={0}
                end={totalCalendars}
                duration={2}
                separator="."
                decimal="."
                className="text-blue-500 text-5xl mb-1"
              />
              <div className="text-base">Lịch đã đăng</div>
            </div>
            <div className="w-1/4 relative">
              <img
                src={CalendarIcon}
                className="w-14 absolute inset-0 m-auto"
              />
            </div>
          </div>
        </div>
      </div>
      {searchContent}
    </>
  );
};

export default memo(Summary);
