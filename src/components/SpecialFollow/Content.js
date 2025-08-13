import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { FaSortAmountDown, FaSortAmountUp } from 'react-icons/fa';
import FanpageRows from './FanpageRows/FanpageRows';
import { Tooltip } from 'primereact/tooltip';
import { FaTag } from 'react-icons/fa';
import { OverlayPanel } from 'primereact/overlaypanel';
import styled from 'styled-components';
import { BiRefresh } from 'react-icons/bi';
import { userServices } from '../../services/users';
import { OK } from '../../configs';
import { toast } from 'react-toastify';
const OverlayPanelStyled = styled(OverlayPanel)`
  button.p-overlaypanel-close.p-link {
    background-color: #2563eb;
    color: #fff;
  }
`;
function Content(props) {
  const {
    fanpages = [],
    setIsShowPopup,
    getFanpages,
    setFanpages,
    isLoading,
    labels,
    handleChageHashTag,
    initalFanpages,
  } = props;

  const [isSort, setIsSort] = useState(false);
  const [isAllInQueue, setIsAllInQueue] = useState(false);
  const tagFilter = useRef(null);
  const [filterParames, setFilterParames] = useState({
    time: null,
    id: null,
  });

  const sortByTime = () => {
    setIsSort(!isSort);
    if (isSort) {
      const sortedData = initalFanpages.sort((a, b) =>
        moment(a?.last_updated).diff(moment(b?.last_updated))
      );
      setFanpages(sortedData);
    } else {
      const sortedData2 = initalFanpages.sort((a, b) =>
        moment(b?.last_updated).diff(moment(a?.last_updated))
      );
      setFanpages(sortedData2);
    }
  };

  const sortByName = (id) => {
    setFilterParames({ ...filterParames, id: id });
    const newFilter = initalFanpages.filter(
      (_elt) => _elt?.special_hash_tag?.id === id
    );
    setFanpages(newFilter);
  };

  const sortTagByTime = (type) => {
    setFilterParames({ ...filterParames, time: type });
    if (type === 'new') {
      const sortedData = initalFanpages.sort((a, b) =>
        moment(a?.special_hash_tag?.updated_at).diff(
          moment(b?.special_hash_tag?.updated_at)
        )
      );
      setFanpages(sortedData);
    } else {
      const sortedData2 = initalFanpages.sort((a, b) =>
        moment(b?.special_hash_tag?.updated_at).diff(
          moment(a?.special_hash_tag?.updated_at)
        )
      );
      setFanpages(sortedData2);
    }
  };

  const clearFilter = () => {
    setFanpages(initalFanpages);
  };

  useEffect(() => {
    setIsSort(false);
  }, [fanpages]);

  useEffect(() => {
    if (fanpages.length > 0) {
      setIsAllInQueue(fanpages.every((fanpage) => fanpage.is_queue === true));
    } else {
      setIsAllInQueue(false);
    }
  }, [fanpages]);

  const onUpdateAllPages = async () => {
    if (isAllInQueue) {
      toast.info(
        'Tất cả trang đã được thêm vào hàng đợi, vui lòng đợi trong ít phút để hệ thống tiến hành cập nhật'
      );
      return;
    }
    const postData = {
      all: true,
    };
    const res = await userServices.putFanpageToQueue(postData);
    if (res.status === OK) {
      toast.success(
        'Vui lòng đợi trong ít phút để hệ thống cập nhật bài mới nhất của tất cả trang'
      );
      setFanpages(res?.data?.data || []);
    }
  };

  return (
    <div className="rounded-xl my-10 py-3 px-6 bg-white shadow-smBlackShadow">
      <div className="w-full flex p-2 items-center">
        <h2 className="w-1/2 text-base font-bold uppercase">
          Đang theo dõi đặc biệt
        </h2>
        <div className="w-1/2 text-right font-bold text-base">
          Đã thêm:{' '}
          <a href="#" className="text-blue-600 visited:text-purple-600">
            {initalFanpages.length}
          </a>{' '}
          trang
        </div>
        {isSort ? (
          <FaSortAmountDown
            color="#B4B4B8"
            size={23}
            onClick={sortByTime}
            className="ml-5 cursor-pointer custom-target-icon"
          />
        ) : (
          <FaSortAmountUp
            color="#B4B4B8"
            size={25}
            className="ml-5 cursor-pointer custom-target-icon"
            onClick={sortByTime}
          />
        )}
        <div onClick={(e) => tagFilter.current.toggle(e)}>
          <FaTag
            size={25}
            className="ml-5 cursor-pointer tag-target-icon"
            color="#B4B4B8"
          />
          <OverlayPanelStyled
            ref={tagFilter}
            showCloseIcon
            closeOnEscape
            dismissable={true}
          >
            <div style={{ width: '300px' }}>
              <span className="font-bold">Lọc theo thời gian</span>
              <div className="flex gap-2 mt-2 mb-2">
                <button
                  className={`w-1/2 p-2 border-2 border-blue-500 rounded-md hover:bg-blue-500 hover:text-white transition-all duration-300 ${
                    filterParames.time === 'new' && 'bg-blue-500 text-white'
                  }`}
                  onClick={() => sortTagByTime('new')}
                >
                  Mới nhất
                </button>
                <button
                  className={`w-1/2 p-2 border-2 border-blue-500 rounded-md hover:bg-blue-500 hover:text-white transition-all duration-300 ${
                    filterParames.time === 'old' && 'bg-blue-500 text-white'
                  }`}
                  onClick={() => sortTagByTime('old')}
                >
                  Cũ nhất
                </button>
              </div>
              <span className="font-bold">Lọc theo tên</span>
              <ul className="mt-2">
                {labels &&
                  labels.map((_elt, index) => (
                    <li
                      className={`cursor-pointer mb-2 border-b py-3 border-gray-300 hover:text-red-500 ${
                        filterParames.id === _elt.id && 'text-red-500'
                      }`}
                      key={index}
                      onClick={() => sortByName(_elt.id)}
                    >
                      {_elt.name}
                    </li>
                  ))}
              </ul>
              <button
                className="w-full p-2 border-2 bg-blue-500 text-white rounded-md hover:bg-red-500 hover:text-white transition-all duration-300"
                onClick={clearFilter}
              >
                Xoá bộ lọc
              </button>
            </div>
          </OverlayPanelStyled>
        </div>

        {/* <Tooltip target=".custom-target-icon" position="left">Sắp xếp theo thời gian</Tooltip>
          <Tooltip target=".tag-target-icon" position="left">Sắp xếp nhẵn</Tooltip> */}

        {/* new button to update all pages */}
        <button
          className="ml-5 bg-blue-500 text-white p-3 rounded-md hidden"
          style={{
            backgroundColor: '#1f883d',
            cursor: isLoading ? 'not-allowed' : 'pointer',
          }}
          title="Cập nhật content mới trên toàn bộ trang"
          onClick={onUpdateAllPages}
        >
          <BiRefresh size={20} />
        </button>
      </div>
      {isLoading && (
        <div className="flex justify-center items-center relative">
          <div className="animate-spin rounded-full h-24 w-24 border-b-2 border-t-2 border-gray-600"></div>
          <label className="absolute top-1/3 z-10">Loading ...</label>
        </div>
      )}
      <FanpageRows
        fanpages={fanpages}
        setIsShowPopup={setIsShowPopup}
        getFanpages={getFanpages}
        setFanpages={setFanpages}
        handleChageHashTag={handleChageHashTag}
        labels={labels}
      />
    </div>
  );
}

export default Content;
