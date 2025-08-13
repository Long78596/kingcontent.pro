import moment from 'moment';
import React, { useCallback, useState } from 'react';
import { FaPlusCircle } from 'react-icons/fa';
import {
  FiCheck,
  FiCheckCircle,
  FiClock,
  FiEdit,
  FiEye,
  FiLoader,
  FiPauseCircle,
  FiSave,
  FiTrash,
  FiX,
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import { Checkbox, DatePicker, Input } from 'rsuite';
import { userServices } from '../../../../../services/users';
import { confirmAlert } from 'react-confirm-alert';
import { getScheduleContents } from '../../../../../store/actions/Schedules';
import { useDispatch, useSelector } from 'react-redux';

const defaultCommentItem = {
  id: 0,
  message: '',
  date_publish: new Date(),
  is_random_characters: true,
  is_random_emojis: true,
  editable: true,
  content_id: 0,
};

const Comments = (props) => {
  const {
    scheduleComments = [],
    autoComments = [],
    fromAuto = false,
    setIsShowCommented = () => {},
    content_id = 0,
    is_posted = false,
    publish_url = '',
    type = '',
  } = props;
  const [listComments, setListComments] = useState(autoComments);
  const [listScheduleComments, setListScheduleComments] =
    useState(scheduleComments);
  const {
    valueMonday,
    valueSunday,
    currentSchedule = null,
    // @ts-ignore
  } = useSelector((state) => state.schedules);

  const [isSavingIndex, setIsSavingIndex] = useState(-1);

  const dispatch = useDispatch();

  const onAddComment = () => {
    const commentItem = {
      ...defaultCommentItem,
      content_id,
    };
    setListScheduleComments([...listScheduleComments, commentItem]);
  };

  const onSaveComment = useCallback(async (index, comment) => {
    const {
      id = 0,
      message = '',
      date_publish = null,
      is_random_characters = false,
      is_random_emojis = false,
      editable = false,
      content_id = 0,
    } = comment;
    if (message === '') {
      toast.error('Vui lòng nhập nội dung comment');
      return;
    }
    if (date_publish === null) {
      toast.error('Vui lòng chọn ngày đăng');
      return;
    }
    // convert date_publish to string
    const datePublishString = moment(date_publish).format('YYYY-MM-DD HH:mm');
    const dataToSave = {
      ...comment,
      date_publish: datePublishString,
    };
    setIsSavingIndex(index);
    await userServices
      .addSingleComment(dataToSave)
      // @ts-ignore
      .then(
        // @ts-ignore
        (res) => {
          const { success = false, message = '', data = {} } = res?.data;
          if (success === false) {
            toast.error(message);
          } else {
            // find current comment in list
            const currComment = listScheduleComments.find(
              (item, idx) => idx === index
            );
            if (currComment) {
              currComment.id = data.id;
              currComment.editable = false;
              // update current comment to list comments
              const newListComments = [...listScheduleComments];
              newListComments[index] = currComment;
              setListScheduleComments(newListComments);
            }
            toast.success('Lưu comment thành công');
          }
        },
        [index, listScheduleComments]
      )
      .finally(() => {
        setIsSavingIndex(-1);
      });
  }, []);

  const onRemoveComment = useCallback((index, id) => {
    confirmAlert({
      title: 'Thông báo',
      message: 'Bạn có chắc chắc muốn xoá comment này không ?',
      buttons: [
        {
          label: 'Chắc chắn',
          onClick: async () => {
            if (id === 0) {
              // remove comment in list
              const newListComments = [...listScheduleComments];
              newListComments.splice(index, 1);
              setListScheduleComments(newListComments);
            } else {
              // remove comment in db
              userServices
                .removeSingleComment(id)
                .then(
                  // @ts-ignore
                  async (res) => {
                    const { success = false, message = '' } = res?.data;
                    if (success === false) {
                      toast.error(message);
                    } else {
                      // remove comment in list
                      const newListComments = [...listScheduleComments];
                      newListComments.splice(index, 1);
                      setListScheduleComments(newListComments);
                      const fromDate = moment(valueMonday).format('YYYY-MM-DD');
                      const toDate = moment(valueSunday).format('YYYY-MM-DD');
                      dispatch(getScheduleContents(0, '', fromDate, toDate, currentSchedule));
                      dispatch(getScheduleContents());
                      toast.success('Xoá comment thành công');
                    }
                  },
                  [index, listScheduleComments, dispatch]
                )
                .finally(() => {
                  setIsSavingIndex(-1);
                });
            }
          },
        },
        {
          label: 'Xem lại',
          onClick: () => {},
        },
      ],
    });
  }, []);

  const renderStatus = (status) => {
    switch (status) {
      case 1:
        return (
          <p title='Thành công' className='text-center'>
            <FiCheckCircle size={20} color="green" className="inline-block" />
          </p>
        )
      case 2:
        return (
          <p title='Đang chờ' className='text-center'>
            <FiClock size={20} color="orange" className="inline-block" />
          </p>
        )
      case 3:
        return (
          <p title='Đã huỷ' className='text-center'>
            <FiPauseCircle size={20} color="red" className="inline-block" />
          </p>
        )
      default:
        return '-';
    }
  };

  const renderResult = (id, commentType = '', commentUrl = '') => {
    const localType = commentType || type;
    const localUrl = commentUrl || publish_url;
    if (id) {
      switch (localType) {
        case 'fanpage':
          return (
            <a
              href={`https://fb.com/${id}`}
              target="_blank"
              className="text-blue-500 text-center block"
            >
              <FiEye size={20} className="inline-block" />
            </a>
          );
        case 'tiktok':
          return (
            <a
              href={`https://tiktok.com/@${id}`}
              target="_blank"
              className="text-blue-500 text-center block"
            >
              <FiEye size={20} className="inline-block" />
            </a>
          );

        case 'threads':
          return (
            <a
              href={localUrl}
              target="_blank"
              className="text-blue-500 text-center block"
            >
              <FiEye size={20} className="inline-block" />
            </a>
          );
        default:
          return '-';
      }
    }
  };

  const renderActions = (index, fromAuto, published_id) => {
    if (fromAuto) {
      return null;
    }
    if (published_id) {
      return (
        <div className="w-2/12 flex gap-2 justify-center items-center">-</div>
      );
    }
    return (
      <div className="w-2/12 flex gap-2 justify-center items-center">
        <FiEdit
          size={25}
          color="green"
          title={'Chỉnh sửa Comment'}
          className="cursor-pointer"
          onClick={() => {
            const newListComments = [...listScheduleComments];
            newListComments[index].editable = true;
            setListScheduleComments(newListComments);
          }}
        />
        <FiTrash
          size={25}
          color="red"
          title={'Xoá Comment'}
          className="cursor-pointer"
          onClick={() =>
            onRemoveComment(index, listScheduleComments[index]?.id)
          }
        />
      </div>
    );
  };

  return (
    <div className="flex gap-2">
      {!fromAuto && (
        <div className="w-1/4 border rounded-md p-3">
          <h4 className="font-bold mb-2">
            Loại tự động lên sau khi bài viết lên thành công
          </h4>
          {listComments && listComments.length > 0 && (
            <div className="flex gap-3 p-2 text-center font-bold uppercase border-b items-center">
              Nội dung
            </div>
          )}
          {listComments &&
            listComments.map((item, index) => {
              return (
                <div className="p-2 border border-t-0" key={index}>
                  {item}
                </div>
              );
            })}
          {listComments && listComments.length === 0 && (
            <p>Bạn chưa lên lịch comment tự động sau khi đăng bài</p>
          )}
        </div>
      )}
      <div className={`${fromAuto ? 'w-full' : 'w-3/4'} border rounded-md p-3`}>
        <h4 className="font-bold mb-2">
          {fromAuto
            ? 'Danh sách comment đã lên lịch'
            : 'Loại lên lịch theo ngày'}
        </h4>
        {listScheduleComments && listScheduleComments.length > 0 && (
          <div className="flex gap-3 p-2 text-center font-bold uppercase border-b items-center">
            <div className="w-4/12">Comment</div>
            <div className="w-2/12">Ngày đăng</div>
            <div className="w-1/12">Thêm ký tự</div>
            <div className="w-1/12">Thêm Icon</div>
            <div className="w-1/12">Trạng thái</div>
            <div className="w-1/12">Kết quả</div>
            {!fromAuto && <div className="w-2/12">Thao tác</div>}
          </div>
        )}
        {is_posted === false && (
          <p className="font-bold text-red-500">
            Bài viết chưa được đăng thành công hoặc chưa tới giờ đăng bài, vui
            lòng quay lại sau.
          </p>
        )}
        {is_posted === true &&
          listScheduleComments?.length > 0 &&
          listScheduleComments.map((item, index) => {
            const {
              editable = false,
              message = '',
              date_publish = null,
              is_random_characters = false,
              is_random_emojis = false,
              status = 0,
              published_id = '',
              id = 0,
              type: commentType = '',
              content_url: commentUrl = '',
            } = item;
            return (
              <div className="p-2 border border-t-0" key={index}>
                {editable && (
                  <div className="flex gap-3 items-center">
                    <div className="w-4/12 text-left">
                      <Input
                        value={message}
                        onChange={(value) => {
                          const newListComments = [...listScheduleComments];
                          newListComments[index].message = value;
                          setListScheduleComments(newListComments);
                        }}
                        placeholder={`Nội dung comment ...\nCó thể chọn ngẫu nhiên comment theo cấu trúc A | B | C`}
                        componentClass={'textarea'}
                        className="w-full rounded-md"
                      />
                    </div>
                    <div className="w-2/12">
                      <DatePicker
                        format="DD-MM-YYYY HH:mm:ss"
                        ranges={[]}
                        className="w-full"
                        defaultValue={moment(date_publish).toDate()}
                        onChange={(value) => {
                          const newListComments = [...listScheduleComments];
                          newListComments[index].date_publish = value;
                          setListScheduleComments(newListComments);
                        }}
                      />
                    </div>
                    <div className="w-1/12 justify-center flex">
                      <Checkbox
                        name="isRandomCharacters"
                        value={1}
                        defaultChecked={
                          is_random_characters === 1 ||
                          is_random_characters === true
                        }
                        className="text-center"
                        inline={true}
                        onChange={(value, checked) => {
                          const newListComments = [...listScheduleComments];
                          newListComments[index].is_random_characters = checked;
                          setListScheduleComments(newListComments);
                        }}
                      />
                    </div>
                    <div className="w-1/12 justify-center flex">
                      <Checkbox
                        name="isRandomEmojis"
                        value={1}
                        defaultChecked={
                          is_random_emojis === 1 || is_random_emojis === true
                        }
                        className="text-center"
                        inline={true}
                        onChange={(value, checked) => {
                          const newListComments = [...listScheduleComments];
                          newListComments[index].is_random_emojis = checked;
                          setListScheduleComments(newListComments);
                        }}
                      />
                    </div>
                    <div className="w-1/12">-</div>
                    <div className="w-1/12">-</div>
                    <div className="w-2/12 flex gap-2 justify-center items-center">
                      {/* change save icon to loading */}
                      {isSavingIndex === index ? (
                        <FiLoader size={25} color="green" />
                      ) : (
                        <FiSave
                          size={25}
                          color="green"
                          title={'Lưu Comment'}
                          className="cursor-pointer"
                          onClick={() => onSaveComment(index, item)}
                        />
                      )}
                      <FiX
                        size={25}
                        color="red"
                        title={'Huỷ Comment'}
                        className="cursor-pointer"
                        onClick={() => {
                          const newListComments = [...listScheduleComments];
                          newListComments[index].editable = false;
                          setListScheduleComments(newListComments);
                        }}
                      />
                    </div>
                  </div>
                )}
                {!editable && (
                  <div className="flex gap-3 items-center">
                    <div className="w-4/12 text-left">{message}</div>
                    <div className="w-2/12">
                      {moment(date_publish).format('HH:mm:ss DD-MM-YYYY')}
                    </div>
                    <div className="w-1/12 flex justify-center">
                      {is_random_characters ? (
                        <FiCheck color="green" size={25} />
                      ) : (
                        <FiX color="red" size={25} />
                      )}
                    </div>
                    <div className="w-1/12 flex justify-center">
                      {is_random_emojis ? (
                        <FiCheck color="green" size={25} />
                      ) : (
                        <FiX color="red" size={25} />
                      )}
                    </div>
                    <div className="w-1/12">{renderStatus(status)}</div>
                    <div className="w-1/12">{renderResult(published_id, commentType, commentUrl)}</div>
                    {renderActions(index, fromAuto, published_id)}
                  </div>
                )}
              </div>
            );
          })}
        {is_posted === true &&
          listScheduleComments &&
          listScheduleComments.length === 0 && (
            <p>Bạn chưa lên lịch comment, bấm nút bên dưới để thêm mới</p>
          )}
        {fromAuto ? (
          <button
            className="border-2 border-gray-200 bg-gray-100 hover:bg-blue-50 py-3 px-4 text-gray-500 rounded-md mt-4"
            onClick={() => setIsShowCommented(false)}
          >
            Quay lại
          </button>
        ) : is_posted === true ? (
          <button className="mt-4" onClick={() => onAddComment()}>
            <FaPlusCircle size={40} className="text-primary" />
          </button>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default Comments;
