import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { confirmAlert } from 'react-confirm-alert';
import Destinations from './Destinations';
import ListSchedules from './ListSchedules';
import { toast } from 'react-toastify';
import CustomizeContent from './CustomizeContent';
import AutoComments from './AutoComments';
import moment from 'moment';
import { destructScheduleContent } from '../../../../components/Schedules/helpers';
import { userServices } from '../../../../services/users';
import {
  getFacebookDestinations,
  getThreadsInfo,
  getTikTokInfo,
} from '../../../../store/actions/Schedules';
import {
  createPost,
  createPostAndSchedule,
} from '../../../../store/actions/createContent';
import { KEY_ITEM_EDIT } from '../../../../reducers/createContent';
import { FiX } from 'react-icons/fi';
const defaultCommentItem = {
  id: 1,
  message: '',
};

const ScheduleSettings = (props) => {
  const { setIsShowSchedule } = props;
  const {
    [KEY_ITEM_EDIT]: editItem,
    newCreatedContentId = 0,
    isReels: canBeReel = false,
    textContent = '',
    imageSelect = null,
  } = useSelector((state) => state.createPost);

  const [selectedDestinations, setSelectedDestinations] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [scheduleName, setScheduleName] = useState('');
  const [replaceContent, setReplaceContent] = useState('');
  const [isReels, setIsReels] = useState(canBeReel);
  const [isAddSource, setIsAddSource] = useState(false);
  const [isDisableSubmit, setIsDisableSubmit] = useState(false);
  const [isAutoComment, setIsAutoComment] = useState(false);
  const [listComments, setListComments] = useState([defaultCommentItem]);
  const [isRandomCharactersComment, setIsRandomCharactersComment] =
    useState(false);
  const [isRandomEmojisComment, setIsRandomEmojisComment] = useState(false);
  const [selectedDateTime, setSelectedDateTime] = useState(
    moment().add(7, 'minutes')
  );
  const [isRandomPresets, setIsRandomPresets] = useState(false);
  const [hasThreads, setHasThreads] = useState(false);
  const [isAllThreads, setIsAllThreads] = useState(false);
  const [hasMaxThreadsMessage, setHasMaxThreadsMessage] = useState(false);
  const [hasMaxThreadsMedias, setHasMaxThreadsMedias] = useState(false);

  const { listDestinations = null, isDestinationLoading = false } = useSelector(
    (state) => state.schedules
  );

  const dispatch = useDispatch();

  useEffect(() => {
    if (selectedDestinations.length > 0) {
      const hasThreads = selectedDestinations.find(
        (item) => item.type === 'threads'
      );
      setIsAllThreads(hasThreads && selectedDestinations.length === 1);
      setHasThreads(hasThreads ? true : false);
    } else {
      setHasThreads(false);
      setIsAllThreads(false);
    }
  }, [selectedDestinations]);

  useEffect(() => {
    if (replaceContent) {
      setHasMaxThreadsMessage(replaceContent.length > 500);
    } else {
      setHasMaxThreadsMessage(textContent.length > 500);
    }
  }, [replaceContent, textContent]);

  useEffect(() => {
    if (imageSelect) {
      setHasMaxThreadsMedias(imageSelect.length > 20);
    }
  }, [imageSelect]);

  useEffect(() => {
    if (!listDestinations) {
      reloadDestinations();
    }
  }, [dispatch, listDestinations]);

  const handleClickBg = useCallback(() => {
    confirmAlert({
      title: 'Xác nhận',
      message: 'Bạn có chắc chắn muốn huỷ lên lịch?',
      buttons: [
        {
          label: 'Xác nhận',
          onClick: () => {
            setIsShowSchedule(false);
          },
        },
        {
          label: 'Huỷ',
          onClick: () => {},
        },
      ],
    });
  }, []);

  const onClickDestination = (destinationId, type) => {
    const searchResult = selectedDestinations.filter(
      (item) => item.id === destinationId
    );
    if (searchResult.length) {
      setSelectedDestinations(
        selectedDestinations.filter((item) => item.id !== destinationId)
      );
    } else {
      setSelectedDestinations([
        ...selectedDestinations,
        { id: destinationId, type },
      ]);
    }
  };

  const reloadDestinations = () => {
    dispatch(getFacebookDestinations());
    dispatch(getThreadsInfo());
    dispatch(getTikTokInfo());
  };

  const onConfirmSchedule = useCallback(async () => {
    let isError = false;
    let message = '';
    if (!scheduleName && !selectedSchedule) {
      isError = true;
      message = 'Vui lòng chọn hoặc thêm lịch mới';
    } else {
      if (selectedDestinations.length === 0) {
        isError = true;
        message = 'Vui lòng chọn một nơi để lên bài viết';
      }
    }
    if (moment(selectedDateTime).isBefore(moment().add(5, 'minutes'))) {
      isError = true;
      message =
        'Thời gian đăng bài phải lớn hơn thời gian hiện tại ít nhất 5 phút';
    }
    if (isError) {
      toast.error(message);
    } else {
      toast.info('Đang lên lịch bài viết, vui lòng chờ trong giây lát...');
      setIsDisableSubmit(true);
      // prepare data for schedule
      let selectedScheduleContent = {
        id: 0,
        cat_id: 0,
        post_id: '',
        source_type: 'user',
      };
      if (editItem) {
        // update post_id by editting item
        selectedScheduleContent = {
          ...selectedScheduleContent,
          ...editItem,
          post_id: editItem.id,
          plan_id: editItem.plan_id || 0,
        };
      } else {
        // create new post_id
        selectedScheduleContent = {
          ...selectedScheduleContent,
          post_id: newCreatedContentId,
        };
      }

      const dataToDestruct = {
        selectedScheduleContent,
        selectedSchedule,
        scheduleName,
        selectedDestinations,
        selectedDateTime,
        replaceContent,
        isReels,
        isAddSource,
        isAutoComment,
        listComments,
        isRandomCharactersComment,
        isRandomEmojisComment,
        isRandomPresets,
      };
      const destructedData = destructScheduleContent(dataToDestruct);
      dispatch(createPostAndSchedule(destructedData));
      setIsDisableSubmit(false);
      toast.dismiss();
      setIsShowSchedule(false);
    }
  }, [
    scheduleName,
    selectedSchedule,
    selectedDestinations,
    selectedDateTime,
    replaceContent,
    isReels,
    isAddSource,
    isAutoComment,
    listComments,
    isRandomCharactersComment,
    isRandomEmojisComment,
    dispatch,
    editItem,
    newCreatedContentId,
  ]);

  return (
    <div className="finalStepContainer fixed left-0 top-0 z-9999 w-full h-screen">
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none max-h-screen">
        <div className="relative w-full mx-auto min-h-full p-4">
          {isDisableSubmit && (
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
                <p className="font-bold uppercase text-base">
                  Lên lịch đăng bài
                </p>
              </div>
            </div>
            {/*body*/}
            <div
              className="relative p-6 overflow-auto max-h-screen"
              style={{
                maxHeight: 'calc(100vh - 200px)',
              }}
            >
              <div className="w-full border-b pb-4 mb-4">
                <ListSchedules
                  selectedSchedule={selectedSchedule}
                  setSelectedSchedule={setSelectedSchedule}
                  scheduleName={scheduleName}
                  setScheduleName={setScheduleName}
                />
              </div>
              <div className="w-full border-b pb-4 mb-4">
                {isDestinationLoading && (
                  <div className="flex justify-center items-center relative">
                    <div className="animate-spin rounded-full h-24 w-24 border-b-2 border-t-2 border-gray-600"></div>
                    <label className="absolute top-1/3 z-10 w-0 h-0 overflow-hidden">
                      Loading ...
                    </label>
                  </div>
                )}

                {!isDestinationLoading && (
                  <Destinations
                    reloadDestinations={reloadDestinations}
                    selectedDestinations={selectedDestinations}
                    onClickDestination={onClickDestination}
                  />
                )}
              </div>
              <div className="w-full border-b pb-4 mb-4">
                <CustomizeContent
                  replaceContent={replaceContent}
                  setReplaceContent={setReplaceContent}
                  isReels={isReels}
                  setIsReels={setIsReels}
                  isAddSource={isAddSource}
                  setIsAddSource={setIsAddSource}
                  selectedDateTime={selectedDateTime}
                  setSelectedDateTime={setSelectedDateTime}
                  isRandomPresets={isRandomPresets}
                  setIsRandomPresets={setIsRandomPresets}
                />
              </div>
              <div className="w-full border-b pb-4 mb-4">
                <AutoComments
                  isAutoComment={isAutoComment}
                  setIsAutoComment={setIsAutoComment}
                  listComments={listComments}
                  setListComments={setListComments}
                  isRandomCharacters={isRandomCharactersComment}
                  setIsRandomCharacters={setIsRandomCharactersComment}
                  isRandomEmojis={isRandomEmojisComment}
                  setIsRandomEmojis={setIsRandomEmojisComment}
                  hasThreads={hasThreads}
                />
              </div>
            </div>

            {/* footer */}
            {hasThreads ? (
              <div className="w-full border-t p-4">
                {hasMaxThreadsMessage ? (
                  <p className="text-red-500 italic py-1 flex gap-2 font-bold items-center pl-2">
                    <FiX className="" />
                    <span>
                      Content Threads của bạn đang vượt quá 500 ký tự, hệ thống
                      sẽ tự động cắt bớt nội dung
                    </span>
                  </p>
                ) : null}
                {hasMaxThreadsMedias ? (
                  <p className="text-red-500 italic py-1 flex gap-2 font-bold items-center pl-2">
                    <FiX className="" />
                    <span>
                      Content Threads của bạn đang vượt quá 20 bức ảnh, hệ thống
                      sẽ tự động lấy 20 bức ảnh đầu tiên để đăng
                    </span>
                  </p>
                ) : null}
              </div>
            ) : null}
            <div className="mx-4 mb-4 flex gap-4 sticky bottom-0 bg-white p-3">
              <button
                className="border-2 border-gray-200 bg-gray-100 hover:bg-blue-50 py-3 px-4 text-gray-500 rounded-md"
                onClick={() => handleClickBg()}
              >
                Huỷ
              </button>
              <button
                className="border-2 border-gray-200 bg-blue-800 hover:bg-blue-400 py-3 px-4 text-white rounded-md"
                onClick={() => onConfirmSchedule()}
                disabled={isDisableSubmit}
              >
                Lên lịch
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </div>
  );
};

export default ScheduleSettings;
