import React, { useEffect, useState } from "react";
import pauseIcon from '../../../../assets/images/icon/schedules/pause.png';
import playIcon from '../../../../assets/images/icon/schedules/play.png';
import binIcon from '../../../../assets/images/icon/schedules/bin.png';
import { confirmAlert } from "react-confirm-alert";
import { useDispatch } from "react-redux";
import { removeScheduleContents, updateScheduleContentsStatus } from "../../../../store/actions/Schedules";
import { MANAGE_GET_SCHEDULE_CONTENTS_SUCCESS } from "../../../../store/types/schedules";

const ScheduleActions = (props) => {
  const {listSelected = [], contents = []} = props;
  const [hasPause, setHasPause] = useState(false);
  const [hasWaiting, setHasWaiting] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    // check if listSelected has pause or waiting
    if(listSelected && listSelected.length > 0){
      let hasPause = listSelected.find(item => item.status === 3);
      let hasWaiting = listSelected.find(item => item.status === 2);
      setHasPause(hasPause);
      setHasWaiting(hasWaiting);
    }else{
      setHasPause(false);
      setHasWaiting(false);
    }
  }, [listSelected]);

  const handlePause = () => {
    confirmAlert({
      title: 'Tạm dừng đăng bài',
      message: 'Bạn có chắc chắn muốn tạm dừng tất cả các bài đã chọn? Lưu ý: chúng tôi sẽ chỉ tạm dừng các bài đã chọn và đang ở trạng thái chờ lên bài.',
      buttons: [
        {
          label: 'Đồng ý',
          onClick: () => {
            const ids = listSelected.map(item => item.id);
            dispatch(updateScheduleContentsStatus(0, ids, 3));
            // update status of these contents from reducer
            const newContents = contents.map(content => {
              if (ids.includes(content.id)) {
                return {
                  ...content,
                  status: content.status === 2 ? 3 : content.status,
                }
              }
              return content;
            });
            dispatch({
              type: MANAGE_GET_SCHEDULE_CONTENTS_SUCCESS,
              payload: newContents,
            });
          }
        },
        {
          label: 'Hủy',
          onClick: () => {}
        }
      ]
    });
  }

  const handlePlay = () => {
    confirmAlert({
      title: 'Tiếp tục đăng bài',
      message: 'Bạn có chắc chắn muốn tiếp tục đăng tất cả các bài đã chọn? Lưu ý: chúng tôi sẽ chỉ đăng bài đã chọn và đang ở trạng thái tạm dừng.',
      buttons: [
        {
          label: 'Đồng ý',
          onClick: () => {
            const ids = listSelected.map(item => item.id);
            dispatch(updateScheduleContentsStatus(0, ids, 2));
            // update status of these contents from reducer
            const newContents = contents.map(content => {
              if (ids.includes(content.id)) {
                return {
                  ...content,
                  status: content.status === 3 ? 2 : content.status,
                }
              }
              return content;
            });
            dispatch({
              type: MANAGE_GET_SCHEDULE_CONTENTS_SUCCESS,
              payload: newContents,
            });
          }
        },
        {
          label: 'Hủy',
          onClick: () => {}
        }
      ]
    });
  }

  const handleDelete = () => {
    confirmAlert({
      title: 'Xóa bài đăng',
      message: 'Bạn có chắc chắn muốn xóa tất cả các bài đã chọn? Dữ liệu đã xóa không thể khôi phục.',
      buttons: [
        {
          label: 'Đồng ý',
          onClick: () => {
            const ids = listSelected.map(item => item.id);
            dispatch(removeScheduleContents(ids));
            // remove these contents from reducer
            const newContents = contents.filter(content => !ids.includes(content.id));
            dispatch({
              type: MANAGE_GET_SCHEDULE_CONTENTS_SUCCESS,
              payload: newContents,
            });
          }
        },
        {
          label: 'Hủy',
          onClick: () => {}
        }
      ]
    });
  }

  return (
    <div className="flex gap-2 items-center">
      {/* total selected */}
      <p>Bạn đã chọn <span className="font-bold">{listSelected.length}</span> / <span className="font-bold">{contents.length}</span></p>
      {/* actions */}
      {hasPause && <img className="w-6 h-6 cursor-pointer" src={playIcon} alt="play" title="Tiếp tục đăng bài" onClick={handlePlay} />}
      {hasWaiting && <img className="w-6 h-6 cursor-pointer" src={pauseIcon} alt="pause" title="Tạm dừng đăng bài" onClick={handlePause} />}
      <img className="w-6 h-6 cursor-pointer" src={binIcon} alt="delete" title="Xóa các bài đã chọn" onClick={handleDelete} />
    </div>
  );
};

export default ScheduleActions;