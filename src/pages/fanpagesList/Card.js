import React from 'react';
import { confirmAlert } from 'react-confirm-alert';
import { FaHeart } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Client from '../../Client';
import { useDispatch } from 'react-redux';
import { ACTION_SEARCH_FANPAGE } from '../../store/actions/Fanpages';
import defaultAvatar from '../../assets/images/default_fb_avatar.jpg';
import { OK } from '../../configs';

const Card = (props) => {
  const {
    pages,
    isShowSaved,
    setIsShowPopup,
    setFanpageSaved,
    fanpageSearchData,
    setIsShowPopupFanpageSaved,
  } = props;
  const dispatch = useDispatch();
  const handleSaveFanpage = (link) => {
    confirmAlert({
      title: 'Thông báo',
      message: (
        <span className="warning-content">
          Bạn có muốn đưa trang này vào mục theo dõi đặc biệt để tự động lấy về
          những bài viết mới nhất không ?
        </span>
      ),
      buttons: [
        {
          label: 'Xác nhận',
          onClick: async () => {
            toast.warning('Đang lưu ...');
            const postingData = {
              fanpage: link,
              from_system: true,
              limit: 500,
            };
            const res = await Client.post(`/fanpages/import`, postingData);
            if (res.status === OK) {
              const resFanpage = await Client.get(`/saved-fanpages`);
              if (resFanpage.status === OK) {
                const newArray = pages.map((_fan) => {
                  return {
                    ..._fan,
                    isSaved: _fan.feed_id === link ? true : _fan.isSaved,
                  };
                });
                setFanpageSaved(res.data.data);
                setFanpageSaved(resFanpage.data.data);
                dispatch({
                  type: ACTION_SEARCH_FANPAGE,
                  payload: newArray || [],
                });
                toast.success('Lưu fanpage thành công !');
              }
            }
          },
        },
        {
          label: 'Huỷ',
          onClick: () => {},
        },
      ],
    });
  };
  const handleDisFanpage = (link, page_name) => {
    confirmAlert({
      title: 'Thông báo',
      message: (
        <span className="warning-content">
          Bạn có muốn bỏ thích trang này không ?
        </span>
      ),
      buttons: [
        {
          label: 'Xác nhận',
          onClick: async () => {
            const res = await Client.delete(`/fanpages/${link}`);
            if (res.status === OK) {
              const resFanpage = await Client.get(`/saved-fanpages`);
              if (resFanpage.status === OK) {
                const newArray = fanpageSearchData.map((_fan) => {
                  return {
                    ..._fan,
                    isSaved:
                      _fan.user_screenname === page_name ? false : _fan.isSaved,
                  };
                });
                setFanpageSaved(resFanpage.data.data);
                dispatch({
                  type: ACTION_SEARCH_FANPAGE,
                  payload: newArray || [],
                });
                toast.success('Thao tác thành công !');
              }
            }
          },
        },
        {
          label: 'Huỷ',
          onClick: () => {},
        },
      ],
    });
  };
  return (
    <>
      {pages.map((_elt, index) => {
        return (
          <div
            className="singleFanpage shadow-lg bg-white rounded-lg min-h-full hover:bg-gray-200 transform duration-300 cursor-pointer text-center py-3"
            key={index}
          >
            <div
              className="bg-cover bg-center bg-no-repeat rounded-full inline-block text-center"
              onClick={() =>
                isShowSaved
                  ? setIsShowPopupFanpageSaved(_elt)
                  : setIsShowPopup(_elt)
              }
              style={{
                backgroundImage: `url(${_elt.user_pic}), url(${defaultAvatar})`,
                width: '200px',
                height: '200px',
              }}
              title={_elt.user_screenname}
            ></div>
            <div className="flex justify-between p-4 items-center text-left">
              <div className="w-8/12">
                <a href={_elt?.user_link} target="_blank" key={index}>
                  <p className="text-md font-bold truncate hover:text-clip hover:break-normal hover:underline">
                    {isShowSaved ? _elt.page_name : _elt.user_screenname}
                  </p>
                </a>
                <p className="font-bold text-red-600">
                  {isShowSaved ? _elt.total : _elt?.posts_count} content
                </p>
              </div>
              {!isShowSaved ? (
                <div className="w-4/12 flex justify-end">
                  <button
                    className={`p-1 h-10 rounded-md text-white  flex items-center justify-center gap-2`}
                    disabled={_elt.isSaved}
                    onClick={() => handleSaveFanpage(_elt?.feed_id)}
                  >
                    {!_elt.isSaved ? (
                      <FaHeart color="#cbcfd4" size="30" />
                    ) : (
                      <FaHeart color="#f9595f" size="30" />
                    )}
                    {/* <span>{_elt.isSaved  ? 'Đã lưu' : 'Lưu'} </span> */}
                  </button>
                </div>
              ) : (
                <div className="w-4/12 flex justify-end">
                  <button
                    className={`p-1 h-10 rounded-md text-white flex items-center justify-center gap-2`}
                    disabled={_elt.isSaved}
                    onClick={() =>
                      handleDisFanpage(_elt?.fanpage_id, _elt.page_name)
                    }
                  >
                    <FaHeart color="#f9595f" size="30" />
                    {/* <span>Bỏ lưu</span> */}
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </>
  );
};

export default Card;
