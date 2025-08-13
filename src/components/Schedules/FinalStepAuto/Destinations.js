import { Fragment, useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import SingleDes from './SingleDes';
import Filtering from './Filtering';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';
import { useHistory } from 'react-router-dom/cjs/react-router-dom';

const Destinations = (props) => {
  const { onClickDestination, selectedDestinations, reloadDestinations } =
    props;

  const {
    listDestinations = null,
    isDestinationLoading = false,
    threadsInfo = null,
    tiktokInfo = null,
  } = useSelector((state) => state.schedules);

  const [fanpages, setFanpages] = useState([]);
  const [filteredFanpages, setFilteredFanpages] = useState([]);
  const [groups, setGroups] = useState([]);
  const [filteredGroups, setFilteredGroups] = useState([]);
  const [isShowFanpages, setIsShowFanpages] = useState(false);
  const [isShowGroups, setIsShowGroups] = useState(false);
  const [groupFanpagesByCategory, setGroupFanpagesByCategory] = useState([]);
  const history = useHistory();

  useEffect(() => {
    if (listDestinations) {
      const { fanpages = [], groups = [] } = listDestinations;
      setFanpages(fanpages);
      setFilteredFanpages(fanpages);
      setGroups(groups);
      setFilteredGroups(groups);
    } else {
      setFanpages([]);
      setGroups([]);
    }
  }, [listDestinations]);

  useEffect(() => {
    if (filteredFanpages) {
      const groupFanpages = filteredFanpages.reduce((acc, item) => {
        const category = item.category || 'Khác';
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(item);
        return acc;
      }, {});
      setGroupFanpagesByCategory(groupFanpages);
    }
  }, [filteredFanpages]);

  const onFilterDestinations = useCallback(
    (value, type) => {
      if (value) {
        switch (type) {
          case 'fanpage':
            const newFanpages = fanpages.filter(
              (item) =>
                item.name.toLowerCase().includes(value.toLowerCase()) ||
                item.id.toLowerCase().includes(value.toLowerCase()) ||
                item.category.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredFanpages(newFanpages);
            break;
          case 'group':
            const newGroups = groups.filter((item) =>
              item.name.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredGroups(newGroups);
            break;

          default:
            break;
        }
      } else {
        setFilteredFanpages(fanpages);
      }
    },
    [fanpages, groups]
  );

  const onClickShowFanpages = useCallback(() => {
    setIsShowFanpages((state) => !state);
  }, []);

  const onClickShowGroups = useCallback(() => {
    setIsShowGroups((state) => !state);
  }, []);

  const onClickGoToProfile = () => {
    const userProfileLink = '/user-info';
    history.push(userProfileLink);
  };

  return (
    <div className="destinationContainer">
      {listDestinations && listDestinations.length === 0 ? (
        <p className="text-red-500 text-center text-base uppercase">
          Đã có vấn đề xảy ra khi kết nối tới Facebook, vui lòng{' '}
          <span
            className="cursor-pointer underline font-bold italic"
            onClick={() => onClickGoToProfile()}
          >
            kiểm tra lại kết nối tại đây
          </span>
        </p>
      ) : (
        <Fragment>
          <p
            className="text-blue-700 mb-3 cursor-pointer ml-3"
            onClick={() => reloadDestinations()}
          >
            Làm mới danh sách
          </p>
          <div className="listFanpages m-2 overflow-hidden">
            <div
              className="title p-3 font-bold text-base uppercase mb-2 cursor-pointer border rounded-md flex items-center"
              onClick={() => onClickShowFanpages()}
            >
              <h4>CHỌN NƠI ĐĂNG BÀI</h4>
              {isShowFanpages ? (
                <FaAngleUp className="ml-auto" />
              ) : (
                <FaAngleDown className="ml-auto" />
              )}
            </div>
            <div
              className={`body transition-all duration-300 ease-in-out ${
                isShowFanpages ? 'h-auto' : 'h-0'
              }`}
            >
              {(threadsInfo || tiktokInfo) && (
                <div className="grid gap-3 grid-cols-2">
                  {threadsInfo && (
                    <div className="threadsInfo mb-3">
                      <h4 className=" text-sm font-bold uppercase p-3">
                        Threads
                      </h4>
                      <div className="w-full">
                        <SingleDes
                          destination={threadsInfo}
                          onClickDestination={onClickDestination}
                          selectedDestinations={selectedDestinations}
                          type="threads"
                        />
                      </div>
                    </div>
                  )}
                  {tiktokInfo && (
                    <div className="tiktokInfo mb-3">
                      <h4 className=" text-sm font-bold uppercase p-3">
                        TikTok
                      </h4>
                      <div className="w-full">
                        <SingleDes
                          destination={tiktokInfo}
                          onClickDestination={onClickDestination}
                          selectedDestinations={selectedDestinations}
                          type="tiktok"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
              <div className="listDestinations">
                <h4 className=" text-sm font-bold uppercase p-3">Facebook</h4>
                <div className="filterFanpages">
                  <Filtering
                    type="fanpage"
                    onFilterDestinations={onFilterDestinations}
                  />
                </div>
                <div className="max-h-screen overflow-auto gap-3 grid grid-cols-2 border rounded-md p-1">
                  {groupFanpagesByCategory &&
                    Object.keys(groupFanpagesByCategory).map(
                      (category, idx) => {
                        return (
                          <div key={idx} className="pb-1">
                            <h4 className=" text-sm font-bold uppercase p-3">
                              {category}
                            </h4>
                            <div
                              className={`grid gap-3 ${
                                groupFanpagesByCategory[category].length > 1
                                  ? 'grid-cols-2'
                                  : 'grid-cols-1'
                              }`}
                            >
                              {groupFanpagesByCategory[category].map(
                                (item, idx) => {
                                  return (
                                    <Fragment key={idx}>
                                      <SingleDes
                                        destination={item}
                                        onClickDestination={onClickDestination}
                                        selectedDestinations={
                                          selectedDestinations
                                        }
                                        type="fanpage"
                                      />
                                    </Fragment>
                                  );
                                }
                              )}
                            </div>
                          </div>
                        );
                      }
                    )}
                </div>
              </div>
            </div>
          </div>
        </Fragment>
      )}
    </div>
  );
};

export default Destinations;
