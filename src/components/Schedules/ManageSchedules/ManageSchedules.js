import React, { useCallback, useEffect, useState } from 'react';
import { FiX } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';

import {
  changeStateShowManageSchedule,
  manageSetCurrentSchedule,
  removeSchedule,
  removeScheduleContents,
  updateScheduleContentsStatus,
} from '../../../store/actions/Schedules';
import { toast } from 'react-toastify';
import { formatDate } from '../../../helpers/date';
import pauseIcon from '../../../assets/images/icon/schedules/pause.png';
import playIcon from '../../../assets/images/icon/schedules/play.png';
import binIcon from '../../../assets/images/icon/schedules/bin.png';
import { confirmAlert } from 'react-confirm-alert';
import SearchBox from './SearchBox';
import DetailSchedule from './DetailSchedule/DetailSchedule';
import {
  GET_SCHEDULES,
  GET_SCHEDULES_SUCCESS,
} from '../../../store/types/schedules';

const ManageSchedules = (props) => {
  const { schedules = null, manageCurrentSchedule = null } = useSelector(
    (state) => state.schedules
  );

  const [filteredSchedules, setFilteredSchedules] = useState(schedules);
  const [selectedSchedules, setSelectedSchedules] = useState([]);

  useEffect(() => {
    if (schedules) {
      setFilteredSchedules(schedules);
    }
  }, [schedules]);

  const dispatch = useDispatch();

  const onClickRemoveSchedule = (schedule) => {
    confirmAlert({
      title: `THÔNG BÁO`,
      message: `Bạn có chắc chắn muốn xóa toàn bộ bài viết của lịch ${schedule?.name} không? Dữ liệu đã xóa không thể phục hồi`,
      buttons: [
        {
          label: 'Có',
          onClick: () => {
            dispatch(removeSchedule(schedule?.id));
            const newSchedules = schedules.filter(
              (item) => item.id !== schedule.id
            );
            dispatch({
              type: GET_SCHEDULES_SUCCESS,
              payload: newSchedules,
            });
          },
        },
        {
          label: 'Không',
          onClick: () => {},
        },
      ],
    });
  };

  const onClickPlaySchedule = (schedule) => {
    confirmAlert({
      title: `THÔNG BÁO`,
      message: `Bạn có chắc chắn muốn tiếp tục lên các bài viết đã dừng của lịch ${schedule?.name} không?`,
      buttons: [
        {
          label: 'Có',
          onClick: () => {
            dispatch(updateScheduleContentsStatus(schedule?.id, [], 2));
            const newSchedules = schedules.map((item) => {
              if (item.id === schedule.id) {
                const { contents_count = 0, success_contents_count = 0 } = item;
                return {
                  ...item,
                  paused_contents_count: 0,
                  pending_contents_count:
                    contents_count - success_contents_count,
                };
              }
              return item;
            });
            dispatch({
              type: GET_SCHEDULES_SUCCESS,
              payload: newSchedules,
            });
          },
        },
        {
          label: 'Không',
          onClick: () => {},
        },
      ],
    });
  };

  const onClickPauseSchedule = (schedule) => {
    confirmAlert({
      title: `THÔNG BÁO`,
      message: `Bạn có chắc chắn muốn tạm dừng toàn bộ bài viết đang chờ của lịch ${schedule?.name} không?`,
      buttons: [
        {
          label: 'Có',
          onClick: () => {
            dispatch(updateScheduleContentsStatus(schedule?.id, [], 3));
            const newSchedules = schedules.map((item) => {
              if (item.id === schedule.id) {
                const { contents_count = 0, success_contents_count = 0 } = item;
                return {
                  ...item,
                  pending_contents_count: 0,
                  paused_contents_count:
                    contents_count - success_contents_count,
                };
              }
              return item;
            });
            dispatch({
              type: GET_SCHEDULES_SUCCESS,
              payload: newSchedules,
            });
          },
        },
        {
          label: 'Không',
          onClick: () => {},
        },
      ],
    });
  };

  const onClickSchedule = (schedule) => {
    dispatch(manageSetCurrentSchedule(schedule));
  };

  const handleClickBg = () => {
    dispatch(changeStateShowManageSchedule(false));
  };

  const onCheckSchedule = (schedule) => {
    const index = selectedSchedules.findIndex(
      (item) => item.id === schedule.id
    );
    if (index === -1) {
      setSelectedSchedules([...selectedSchedules, schedule]);
    } else {
      setSelectedSchedules(
        selectedSchedules.filter((item) => item.id !== schedule.id)
      );
    }
  };

  return (
    <div className="ManageSchedulesContainer fixed left-0 top-0 z-9999 w-full h-screen">
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none max-h-screen">
        <div
          className="relative w-98% mx-auto"
          style={{ maxHeight: 'calc(100vh - 40px)' }}
        >
          {/*content*/}
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            {/*header*/}
            <div className="flex items-start justify-between px-2 py-4 border-b border-solid border-gray-300 rounded-t">
              <div className="bg-gray-50  text-sm overflow-hidden pt-3 pb-3 flex1 justify-between border-l-4 border-green-500 pl-2 w-full">
                {manageCurrentSchedule ? (
                  <p className="font-bold uppercase text-base">
                    Danh sách bài viết của lịch:{' '}
                    <span className="font-italic">
                      {manageCurrentSchedule?.name}
                    </span>
                  </p>
                ) : (
                  <p className="font-bold uppercase text-base">
                    Danh sách lịch đã lên
                  </p>
                )}
              </div>
            </div>
            {/*body*/}
            <div className="relative p-6">
              {!manageCurrentSchedule ? (
                // list schedules
                <div className="w-full">
                  <SearchBox
                    schedules={schedules}
                    filteredSchedules={filteredSchedules}
                    setFilteredSchedules={setFilteredSchedules}
                    selectedSchedules={selectedSchedules}
                    setSelectedSchedules={setSelectedSchedules}
                  />
                  {filteredSchedules?.length === 0 ? (
                    <div className="flex justify-center items-center h-32 border rounded-md w-full pr-2">
                      <p>
                        Không có lịch nào phù hợp với từ khoá hoặc chưa có lịch
                        nào được tạo
                      </p>
                    </div>
                  ) : (
                    <div
                      className="overflow-auto pr-2"
                      style={{ maxHeight: 'calc(100vh - 18rem)' }}
                    >
                      <div className="grid grid-cols-3 gap-2">
                        {filteredSchedules?.map((schedule, index) => {
                          const {
                            id,
                            name,
                            thumbnail,
                            created,
                            contents_count = 0,
                            paused_contents_count = 0,
                            pending_contents_count = 0,
                          } = schedule;
                          return (
                            <div
                              key={index}
                              className="flex gap-4 border border-gray-200 rounded-lg p-4 h-26 hover:bg-gray-100 cursor-pointer justify-center transition-all items-center"
                            >
                              {/* checkbox */}
                              <div className="w-1/12">
                                <input
                                  type="checkbox"
                                  className="cursor-pointer"
                                  onChange={(e) => onCheckSchedule(schedule)}
                                  checked={
                                    !!selectedSchedules.find(
                                      (item) => item.id === schedule.id
                                    )
                                  }
                                />
                              </div>
                              {/* thumbnail on left */}
                              <div
                                className="h-28 w-1/3 bg-cover bg-no-repeat bg-center rounded-md"
                                style={{
                                  backgroundImage: `url(${
                                    thumbnail ||
                                    'https://kingcontent.pro/wp-content/themes/kingcontent/assets/img/icon-calendar.png'
                                  })`,
                                }}
                                onClick={() => onClickSchedule(schedule)}
                              ></div>
                              {/* schedule info */}
                              <div className="w-2/3 flex gap-2 items-center">
                                <div
                                  className="w-2/3"
                                  onClick={() => onClickSchedule(schedule)}
                                >
                                  <p className="font-bold">{name}</p>
                                  <p>Ngày tạo: {formatDate(created)}</p>
                                  <p>
                                    Số lượng bài viết:{' '}
                                    <span className="font-bold">
                                      {contents_count}
                                    </span>
                                  </p>
                                </div>
                                <div className="w-1/3 actions flex items-center gap-1 justify-center">
                                  {paused_contents_count > 0 && (
                                    <img
                                      src={playIcon}
                                      alt="Tiếp tục lên các bài đã dừng"
                                      title="Tiếp tục lên các bài đã dừng"
                                      className="w-6 h-6 cursor-pointer"
                                      onClick={() =>
                                        onClickPlaySchedule(schedule)
                                      }
                                    />
                                  )}
                                  {pending_contents_count > 0 && (
                                    <img
                                      src={pauseIcon}
                                      alt="Tạm dừng toàn bộ bài viết"
                                      title="Tạm dừng toàn bộ bài viết"
                                      className="w-6 h-6 cursor-pointer"
                                      onClick={() =>
                                        onClickPauseSchedule(schedule)
                                      }
                                    />
                                  )}
                                  <img
                                    src={binIcon}
                                    alt="Xoá lịch"
                                    title="Xoá lịch"
                                    className="w-6 h-6 cursor-pointer"
                                    onClick={() =>
                                      onClickRemoveSchedule(schedule)
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <DetailSchedule />
              )}
            </div>
            {/* footer */}
            <div className="mb-4 flex gap-4 px-6">
              <button
                className="border-2 border-gray-200 bg-gray-100 hover:bg-blue-50 py-3 px-4 text-gray-500 rounded-md"
                onClick={() => handleClickBg()}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </div>
  );
};
export default ManageSchedules;
