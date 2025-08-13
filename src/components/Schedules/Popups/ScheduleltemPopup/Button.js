import React, { useState } from 'react';
import { FaRegEdit, FaSpinner, FaTrashAlt } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import {
  getScheduleContents,
  setCurrentScheduleContent,
  setIsShowFinalStep,
  setScheduleItemPopupToShow,
} from '../../../../store/actions/Schedules';
import { confirmAlert } from 'react-confirm-alert';
import { userServices } from '../../../../services/users';
import { OK } from '../../../../configs';

function Button(props) {
  const { isSuccess = false, scheduleContent = null } = props;
  const {
    valueMonday,
    valueSunday,
    currentSchedule = null,
  } = useSelector((state) => state.schedules);

  const [isDeleting, setIsDeleting] = useState(false);

  const dispatch = useDispatch();

  const handleEdit = () => {
    dispatch(setCurrentScheduleContent(scheduleContent));
    dispatch(setIsShowFinalStep(true));
  };

  const handleDelete = () => {
    confirmAlert({
      title: 'Xác nhận xoá',
      message: 'Bạn có chắc chắn muốn xoá bài viết đã lên lịch?',
      buttons: [
        {
          label: 'Có',
          onClick: () => {
            setIsDeleting(true);
            userServices
              .removeScheduleContent(scheduleContent.id)
              .then((res) => {
                if (res.status === OK) {
                  // eslint-disable-next-line no-undef
                  const fromDate = moment(valueMonday).format('YYYY-MM-DD');
                  // eslint-disable-next-line no-undef
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
                  setIsDeleting(false);
                  dispatch(setScheduleItemPopupToShow(null));
                }
              })
              .catch((err) => {
                setIsDeleting(false);
                dispatch(setScheduleItemPopupToShow(null));
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

  return (
    <div className="flex items-center w-full">
      <button
        className="group inline-flex flex-grow items-center justify-center bg-red-400 py-1 px-2 cursor-pointer transition-all duration-200 ease-linear rounded-b-md overflow-hidden"
        onClick={() => handleDelete()}
      >
        {isDeleting ? (
          <FaSpinner className="animate-spin w-5 h-5 text-gray-300 mr-1 group-hover:text-white transition-all duration-200 ease-linear" />
        ) : (
          <FaTrashAlt className="w-5 h-5 text-gray-300 mr-1 group-hover:text-white transition-all duration-200 ease-linear" />
        )}
        <span className="text-gray-700 font-semibold  text-sm mt-0.5 group-hover:text-black transition-all duration-200 ease-linear">
          Xoá
        </span>
      </button>
      {!isSuccess && (
        <button
          className="group inline-flex flex-grow items-center justify-center bg-greenEdit py-1 px-2 cursor-pointer transition-all duration-200 ease-linear"
          onClick={() => handleEdit()}
        >
          <FaRegEdit className="w-5 h-5 text-gray-300 mr-1 group-hover:text-white transition-all duration-200 ease-linear" />
          <span className="text-gray-700 font-semibold  text-sm mt-0.5 group-hover:text-black transition-all duration-200 ease-linear">
            Sửa
          </span>
        </button>
      )}
    </div>
  );
}

export default Button;
