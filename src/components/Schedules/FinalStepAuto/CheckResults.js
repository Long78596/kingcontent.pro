import React, { useEffect, useState } from 'react';
import { userServices } from '../../../services/users';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { destructMultipleContents } from '../helpers';
import { confirmAlert } from 'react-confirm-alert';
import {
  getScheduleContents,
  getScheduledContents,
  getSchedules,
  setIsShowFinalStepAuto,
  setScheduleWaitingList,
  setShowSourceIdeasAutoPopup,
} from '../../../store/actions/Schedules';

const CheckResults = (props) => {
  const {
    result,
    setIsShowCheckResults,
    selectedSchedule,
    scheduleName,
    selectedDestinations,
    setIsDisableSubmit,
  } = props;
  const [isDisableConfirm, setIsDisableConfirm] = useState(false);
  const [sourceType, setSourceType] = useState('');
  const dispatch = useDispatch();

  const {
    autoWaitingList,
    editingContents = [],
    valueMonday,
    valueSunday,
    currentSchedule = null,
  } = useSelector((state) => state.schedules);

  useEffect(() => {
    if (autoWaitingList) {
      const { source_type } = autoWaitingList;
      setSourceType(source_type);
    }
  }, [autoWaitingList]);

  const onConfirmSchedule = () => {
    setIsDisableConfirm(true);
    try {
      const postingData = destructMultipleContents(
        autoWaitingList,
        selectedSchedule,
        scheduleName,
        selectedDestinations,
        editingContents
      );
      userServices.addMultipleContents(postingData).then((res) => {
        const { success = false, message = '' } = res?.data;
        if (success === false) {
          toast.error(message);
          setIsDisableConfirm(false);
        } else {
          setIsDisableConfirm(false);
          toast.success(message);
          confirmAlert({
            title: 'Thành công',
            message: 'Đã lên lịch thành công, bạn có muốn lên lịch tiếp không?',
            buttons: [
              {
                label: 'Tiếp tục',
                onClick: () => {
                  dispatch(setIsShowFinalStepAuto(false));
                  dispatch(setShowSourceIdeasAutoPopup(true));
                  dispatch(setScheduleWaitingList(null));
                  setIsShowCheckResults(false);
                  setIsDisableSubmit(false);

                  // reload scheduled contents
                  if ((valueMonday && valueSunday) || currentSchedule) {
                    const fromDate = moment(valueMonday).format('YYYY-MM-DD');
                    const toDate = moment(valueSunday).format('YYYY-MM-DD');
                    dispatch(
                      getScheduleContents(
                        0,
                        '',
                        fromDate,
                        toDate,
                        currentSchedule
                      )
                    );
                  }
                  dispatch(getScheduledContents());
                  dispatch(getSchedules(1));
                },
              },
              {
                label: 'Về lịch tổng',
                onClick: () => {
                  window.location.reload();
                },
              },
            ],
          });
        }
      });
    } catch (error) {
      toast.error(error.message);
      setIsDisableConfirm(false);
    }
  };

  const onClickCancel = () => {
    setIsShowCheckResults(false);
    setIsDisableSubmit(false);
  };

  return (
    <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none max-h-screen">
      <div className="relative w-1/2 mx-auto min-h-full p-4">
        {isDisableConfirm && (
          <div className="absolute h-full w-full z-10 flex justify-center items-center bg-opacity-50 bg-gray-700">
            <div className="relative">
              <div className="animate-spin rounded-full h-24 w-24 border-b-2 border-t-2 border-gray-600"></div>
              <label className="absolute top-1/3 z-10 w-0 h-0 overflow-hidden">
                Loading ...
              </label>
            </div>
          </div>
        )}
        <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
          {/*header*/}
          <div className="flex items-start justify-between px-2 py-4 border-b border-solid border-gray-300 rounded-t">
            <div className="bg-gray-50  text-sm overflow-hidden pt-3 pb-3 flex1 justify-between border-l-4 border-green-500 pl-2 w-full">
              <p className="font-bold uppercase text-base">Kết quả kiểm tra</p>
            </div>
          </div>
          {/*body*/}
          <div className="relative p-6">
            <div className="w-full pb-4 mb-4 max-h-98 overflow-auto">
              {result.map((item, idx) => {
                const {
                  content = null,
                  date_publish = '',
                  total_destinations = 0,
                } = item;
                const { post_id = '', id = '', video_id = '' } = content;
                let contentId = post_id;
                switch (sourceType) {
                  case 'threads':
                    contentId = id;
                    break;
                  case 'douyin':
                    contentId = video_id;
                    break;

                  default:
                    contentId = post_id;
                    break;
                }
                return (
                  <div className="resultItem w-full p-2" key={idx}>
                    Bài <strong>{contentId}</strong> sẽ đăng lúc{' '}
                    <strong>
                      {moment(date_publish).format('DD-MM-YYYY HH:mm:ss')}
                    </strong>{' '}
                    đến <strong>{total_destinations}</strong> kênh đã chọn
                  </div>
                );
              })}
            </div>
          </div>
          {/* footer */}
          <div className="mx-4 mb-4 flex gap-4 sticky bottom-0 bg-white p-3">
            <button
              className="border-2 border-gray-200 bg-gray-100 hover:bg-blue-50 py-3 px-4 text-gray-500 rounded-md"
              onClick={() => onClickCancel()}
            >
              Huỷ
            </button>
            <button
              className="border-2 border-gray-200 bg-blue-800 hover:bg-blue-400 py-3 px-4 text-white rounded-md ml-auto"
              onClick={() => onConfirmSchedule()}
              disabled={isDisableConfirm}
            >
              Xác nhận lên lịch
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckResults;
