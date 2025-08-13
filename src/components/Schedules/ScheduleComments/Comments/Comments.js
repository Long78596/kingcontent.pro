import React, { useCallback, useState } from 'react';
import NewComments from './NewComments';
import Settings from './Settings';
import { useDispatch, useSelector } from 'react-redux';
import { setScheduleCommentsWaitingList } from '../../../../store/actions/Schedules';
import { toast } from 'react-toastify';
import { userServices } from '../../../../services/users';
import moment from 'moment';

const Comments = () => {
  const { scheduleCommentsWaitingList } = useSelector(
    // @ts-ignore
    (state) => state.schedules
  );
  const dispatch = useDispatch();
  const [isDisableSubmit, setIsDisableSubmit] = useState(false);

  const onConfirmSchedule = useCallback(() => {
    const {
      content_ids = [],
      comments = [],
      begin_date = '',
      start_time = '',
      multiple_timespace = 0,
    } = scheduleCommentsWaitingList;

    let isError = false;
    let message = '';
    if (content_ids.length === 0) {
      isError = true;
      message = 'Vui lòng chọn ít nhất 1 bài viết';
    } else {
      if (comments.length === 0) {
        isError = true;
        message = 'Vui lòng thêm nội dung bình luận';
      } else {
        if (!begin_date || !start_time || !multiple_timespace) {
          isError = true;
          message = 'Vui lòng nhập đầy đủ thông tin thời gian';
        }
      }
    }
    if (isError) {
      toast.error(message, { autoClose: 10000 });
    } else {
      setIsDisableSubmit(true);
      try {
        const postingData = {
          ...scheduleCommentsWaitingList,
          begin_date: moment(begin_date).format('YYYY-MM-DD'),
          start_time: moment(start_time).format('HH:mm'),
        };
        userServices.addMultipleComments(postingData).then((res) => {
          const { success = false, message = '', data = [] } = res?.data;
          if (success === false) {
            toast.error(<div dangerouslySetInnerHTML={{ __html: message }} />, { autoClose: 10000 });
            setIsDisableSubmit(false);
          } else {
            toast.success(<div dangerouslySetInnerHTML={{ __html: message }} />);
            dispatch(setScheduleCommentsWaitingList({
              begin_date: new Date(),
              start_time: new Date(),
              multiple_timespace: null,
            }));
            setIsDisableSubmit(false);
          }
        });
      } catch (error) {
        toast.error(error.message, { autoClose: 10000 });
        setIsDisableSubmit(false);
      }
    }
  }, [scheduleCommentsWaitingList]);

  return (
    <div className="commentsContainer">
      <NewComments />
      <Settings />
      <div className="mt-4">
        <button
          className="border-2 border-gray-200 bg-blue-800 hover:bg-blue-400 py-3 px-4 text-white rounded-md uppercase"
          onClick={() => onConfirmSchedule()}
          disabled={isDisableSubmit}
        >
          Lên lịch
        </button>
      </div>
    </div>
  );
};
export default Comments;
