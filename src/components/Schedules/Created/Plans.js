import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SearchForm from '../SearchForm';
import SingleContent from '../SingleContent';
// import DialogDetailPost from '../SingleContent/dialogPostDetail';
import {
  setIsShowFinalStep,
  setScheduleWaitingList,
  setSelectedScheduleContent,
  setShowSourceIdeasPopup,
} from '../../../store/actions/Schedules';
import { lineGadientReg } from '../../../pages/createPost/utility';
import PerfectScrollbar from 'react-perfect-scrollbar';
import Created from './Created';
import { FiSearch } from 'react-icons/fi';

const Plans = (props) => {
  const { isAuto = false, handleAddToWaitingList } = props;
  const { isLoading } = useSelector((state) => state.isLoadingApp);
  const { autoWaitingList = [], userPlans = [] } = useSelector(
    (state) => state.schedules
  );
  const [isShowContents, setIsShowContents] = useState(false);
  const [userContents, setUserContents] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState({});
  const [inputValue, setInputValue] = useState('');
  const [listPlans, setListPlans] = useState([]);

  const onSelectPlan = (plan) => {
    const { contents = [] } = plan;
    // remove all contents has post_text is null or empty or ADMIN_SUGGESTION
    const filterContents = contents.filter(
      (elt) =>
        elt.post_text &&
        elt.post_text.length > 0 &&
        elt.post_text.trim().toLowerCase() !== 'admin_suggestion'
    );
    setUserContents(filterContents);
    setSelectedPlan(plan);
    setIsShowContents(true);
  };
  const goBack = () => {
    setIsShowContents(false);
    setUserContents([]);
    setSelectedPlan({});
  };

  const handleSearchPlan = (e) => {
    setInputValue(e.target.value);
  };

  useEffect(() => {
    setListPlans(userPlans);
  }, [userPlans]);

  useEffect(() => {
    if (inputValue) {
      const filterPlans = userPlans?.filter(
        (elt) =>
          elt?.name?.toLowerCase().includes(inputValue.toLowerCase()) ||
          elt?.hashtag?.toLowerCase().includes(inputValue.toLowerCase())
      );
      setListPlans(filterPlans);
    } else {
      setListPlans(userPlans);
    }
  }, [inputValue]);

  return (
    <div>
      {!isShowContents && (
        <div className="plans">
          <h3 className="uppercase font-bold text-center text-base mb-1">
            Danh sách kế hoạch của bạn
          </h3>
          <p className="italic text-center mb-2">
            Hãy chọn 1 kế hoạch bên dưới để xem bài viết
          </p>
          {/* TOP BAR  */}
          <div className="flex items-center">
            <div className="flex items-center gap-5">
              <div className="flex items-center cursor-text rounded-lg h-12  border-2 px-1 border-blue-300 bg-white text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                <input
                  type="text"
                  placeholder="Tìm theo tên hoặc hashtag#"
                  defaultValue={inputValue}
                  onChange={handleSearchPlan}
                  className="border-none bg-none rounded-lg w-96"
                  style={{ background: 'none' }}
                />
                <button disabled>
                  <FiSearch size={25} />
                </button>
              </div>
            </div>
          </div>
          {listPlans.length === 0 ? (
            <div className="flex justify-center">
              <span className="font-bold">
                Bạn chưa lập kế hoạch nào hoặc không tìm thấy kế hoạch nào
              </span>
            </div>
          ) : (
            <PerfectScrollbar
              className="grid gap-5 mt-2 grid-cols-4 "
              style={{ maxHeight: '90vh' }}
            >
              {listPlans.map((elt, index) => {
                const {
                  id,
                  name,
                  thumbnail,
                  hashtag,
                  createdDate,
                  color,
                  contents_count,
                } = elt;
                const isLinegadient = lineGadientReg.test(color);
                return (
                  <div key={index}>
                    {isLinegadient || thumbnail !== null ? (
                      <div
                        style={{
                          backgroundImage:
                            !isLinegadient && color === null
                              ? `linear-gradient(90deg, rgba(0, 0, 0, .6) 12%, RGBA(0, 0, 0, .6) 48%, rgba(0, 0, 0, .6) 69%, rgba(0, 0, 0, .6) 100%), url(${thumbnail})`
                              : color
                              ? color
                              : 'linear-gradient(90deg, rgba(0, 0, 0, .6) 12%, RGBA(0, 0, 0, .6) 48%, rgba(0, 0, 0, .6) 69%, rgba(0, 0, 0, .6) 100%)',
                          backgroundSize: 'cover',
                        }}
                        className="transform duration-500 border-4 w-full hover:border-indigo-500 hover:bg-blue-600 h-44  cursor-pointer p-4 relative rounded-lg shadow-md leading flex justify-center items-center"
                        onClick={() => onSelectPlan(elt)}
                      >
                        <span className="text-white rounded-lg p-3 font-bold text-xl uppercase duration-200 text-center hover:underline">
                          {name} ({contents_count})
                        </span>
                        {hashtag && (
                          <span className="absolute bottom-3 right-3 p-1 rounded-lg font-bold text-white">
                            #{hashtag}
                          </span>
                        )}
                      </div>
                    ) : (
                      <div
                        style={{
                          backgroundSize: 'cover',
                          background: `linear-gradient(90deg, rgba(0, 0, 0, .4) 90%, RGBA(0, 0, 0, .4) 90%, rgba(0, 0, 0, .4) 90%, rgba(0, 0, 0, .4) 100%),
                  ${color}`,
                        }}
                        className="transform duration-500 border-4 hover:border-indigo-500 hover:bg-blue-600 h-44  cursor-pointer p-4 relative rounded-lg shadow-md leading flex justify-center items-center"
                        onClick={() => onSelectPlan(elt)}
                      >
                        <span className="text-white rounded-lg p-3 font-bold text-xl uppercase duration-200 text-center hover:underline">
                          {name} ({contents_count})
                        </span>
                        {hashtag && (
                          <span className="absolute bottom-3 right-3 p-1 rounded-lg font-bold text-white">
                            #{hashtag}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </PerfectScrollbar>
          )}
        </div>
      )}
      {isShowContents && (
        <Created
          userContents={userContents}
          goBack={goBack}
          selectedPlan={selectedPlan}
          handleAddToWaitingList={handleAddToWaitingList}
          isAuto={isAuto}
        />
      )}
    </div>
  );
};

export default Plans;
