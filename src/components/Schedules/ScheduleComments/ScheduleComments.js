import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// import SuccessContents from './SuccessContents';
import SuccessContents from '../../../components/Schedules/ScheduleComments/SuccessContents/SuccessContents';
import { default as NewComments } from '../../../components/Schedules/ScheduleComments/Comments/NewComments/NewComment';
// import other Comments component
import { default as ScheduledComments } from '../../../components/Schedules/Popups/ScheduleltemPopup/Comments/Comments';

import {
  commentGetScheduleContents,
  commentSetCurrentSchedule,
  setShowScheduleCommentsPopup,
} from '../../../store/actions/Schedules';
import { formatDate } from '../../../helpers/date';
import SearchBox from '../ManageSchedules/SearchBox';
import { FaAngleLeft } from 'react-icons/fa';
import { toast } from 'react-toastify';

const ScheduleComments = () => {
  const dispatch = useDispatch();
  const [isShowCommented, setIsShowCommented] = useState(false);
  const [listComments, setListComments] = useState([]);
  const { commentsCurrentSchedule = null, schedules = null } = useSelector(
    // @ts-ignore
    (state) => state.schedules
  );

  const [filteredSchedules, setFilteredSchedules] = useState(schedules);

  useEffect(() => {
    if (schedules) {
      setFilteredSchedules(schedules);
    }
  }, [schedules]);

  const handleClickGoBack = () => {
    dispatch(commentSetCurrentSchedule(null));
  };

  const handleClickBg = () => {
    dispatch(setShowScheduleCommentsPopup(false));
  };

  const onClickSchedule = (schedule) => {
    const { id, success_contents_count = 0 } = schedule;
    if (success_contents_count === 0 && false) {
      toast.info(
        'Lịch này chưa có bài viết nào đăng thành công trên Facebook. Vui lòng chọn lịch khác!'
      );
      return;
    }
    dispatch(commentSetCurrentSchedule(schedule));
    dispatch(commentGetScheduleContents(schedule.id));
  };

  return (
    <div className="scheduleCommentsContainer fixed left-0 top-0 z-9999 w-full h-screen">
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none max-h-screen">
        <div className="relative w-98% mx-auto">
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            {/*header*/}
            <div className=" px-5 py-4 border-b border-solid border-gray-300 rounded-t">
              {commentsCurrentSchedule ? (
                <div className="bg-gray-50 overflow-hidden py-3 border-l-4 border-green-500 px-2 w-full flex items-center gap-2">
                  <button
                    className="border-2 rounded-md p-2"
                    onClick={(e) => {
                      handleClickGoBack();
                    }}
                    title="Quay lại"
                  >
                    <FaAngleLeft fontSize={20} />
                  </button>
                  <p className="font-bold uppercase text-base">
                    Lên comment cho bài viết của lịch:{' '}
                    {commentsCurrentSchedule?.name}
                  </p>
                </div>
              ) : (
                <div className="bg-gray-50  text-sm overflow-hidden pt-3 pb-3 border-l-4 border-green-500 pl-2 w-full">
                  <p className="font-bold uppercase text-base">
                    Chọn lịch để comment
                  </p>
                </div>
              )}
            </div>
            {/*body*/}
            {!commentsCurrentSchedule && (
              <div className="w-full p-6">
                <SearchBox
                  schedules={schedules}
                  filteredSchedules={filteredSchedules}
                  setFilteredSchedules={setFilteredSchedules}
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
                    className="overflow-auto pr-2 transition-all ease-in-out"
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
                          success_contents_count = 0,
                        } = schedule;
                        return (
                          <div
                            key={index}
                            className="flex gap-4 border border-gray-200 rounded-lg p-4 h-26 hover:bg-gray-100 cursor-pointer justify-center"
                          >
                            {/* thumbnail on left */}
                            <div
                              className="h-32 w-1/3 bg-cover bg-no-repeat bg-center rounded-md"
                              style={{
                                backgroundImage: `url(${
                                  thumbnail ||
                                  'https://kingcontent.pro/wp-content/themes/kingcontent/assets/img/icon-calendar.png'
                                })`,
                              }}
                              onClick={() => onClickSchedule(schedule)}
                            ></div>
                            {/* schedule info */}
                            <div
                              className="w-2/3 gap-2 items-center"
                              onClick={() => onClickSchedule(schedule)}
                            >
                              <p className="font-bold">{name}</p>
                              <p>Ngày tạo: {formatDate(created)}</p>
                              <p>
                                Số bài đăng thành công:{' '}
                                <span className="font-bold">
                                  {success_contents_count}
                                </span>
                                /
                                <span className="font-bold">
                                  {contents_count}
                                </span>
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
            {commentsCurrentSchedule && (
              <div className="flex flex-auto gap-3 p-6">
                <div className="w-4/12 border-r">
                  <SuccessContents
                    setIsShowCommented={setIsShowCommented}
                    setListComments={setListComments}
                  />
                </div>
                <div className="w-8/12">
                  {isShowCommented ? (
                    <ScheduledComments
                      scheduleComments={listComments}
                      fromAuto={true}
                      setIsShowCommented={setIsShowCommented}
                      is_posted={true}
                    />
                  ) : (
                    <NewComments />
                  )}
                </div>
              </div>
            )}
            {/* footer */}
            <div className="mb-4 flex gap-4 px-6">
              <button
                className="border-2 border-gray-200 bg-gray-100 hover:bg-blue-50 py-3 px-4 text-gray-500 rounded-md"
                onClick={() => handleClickBg()}
              >
                Huỷ
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </div>
  );
};
export default ScheduleComments;
