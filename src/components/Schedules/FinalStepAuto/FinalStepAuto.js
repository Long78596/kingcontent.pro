import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getFacebookDestinations,
  getThreadsInfo,
  getTikTokInfo,
  setIsShowFinalStepAuto,
  setScheduleWaitingList,
  setShowSourceIdeasAutoPopup,
} from '../../../store/actions/Schedules';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { confirmAlert } from 'react-confirm-alert';
import Destinations from './Destinations';
import { toast } from 'react-toastify';
import { userServices } from '../../../services/users';
import Settings from './Settings';
import ListSchedules from '../FinalStep/ListSchedules';
import CheckResults from './CheckResults';
// add custom css for this component
import './FinalStepAuto.css';
import { breakWord } from '../../../helpers';

const FinalStepAuto = (props) => {
  const [localSettings, setLocalSettings] = useState(null);

  const [selectedDestinations, setSelectedDestinations] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [scheduleName, setScheduleName] = useState('');
  const [isDisableSubmit, setIsDisableSubmit] = useState(false);
  const [isShowCheckResults, setIsShowCheckResults] = useState(false);
  const [scheduleResults, setScheduleResults] = useState(null);
  const [hasThreads, setHasThreads] = useState(false);

  const {
    listDestinations = null,
    isDestinationLoading = false,
    autoWaitingList,
  } = useSelector((state) => state.schedules);
  const dispatch = useDispatch();

  const reloadDestinations = () => {
    dispatch(getFacebookDestinations());
    dispatch(getThreadsInfo());
    dispatch(getTikTokInfo());
  };

  useEffect(() => {
    setHasThreads(selectedDestinations.some((item) => item.type === 'threads'));
  }, [selectedDestinations]);

  useEffect(() => {
    if (!listDestinations) {
      reloadDestinations();
    }
  }, [dispatch, listDestinations]);

  useEffect(() => {
    if (!localSettings) {
      setLocalSettings(autoWaitingList);
    }
  }, [autoWaitingList, localSettings]);

  const handleClickGoBack = () => {
    // check if localSettings is different from autoWaitingList
    if (localSettings !== autoWaitingList) {
      confirmAlert({
        title: 'Xác nhận',
        message: 'Bạn đã thay đổi cài đặt, bạn có muốn lưu không?',
        buttons: [
          {
            label: 'Lưu và quay lại',
            onClick: () => {
              dispatch(setScheduleWaitingList(localSettings));
              dispatch(setIsShowFinalStepAuto(false));
              dispatch(setShowSourceIdeasAutoPopup(true));
              // reset localSettings
              setLocalSettings(null);
            },
          },
          {
            label: 'Quay lại',
            onClick: () => {
              dispatch(setIsShowFinalStepAuto(false));
              dispatch(setShowSourceIdeasAutoPopup(true));
              // reset localSettings
              setLocalSettings(null);
            },
          },
          {
            label: 'Tiếp tục lên lịch',
            onClick: () => {},
          },
        ],
        overlayClassName: 'large-confirmation',
      });
    } else {
      dispatch(setIsShowFinalStepAuto(false));
      dispatch(setShowSourceIdeasAutoPopup(true));
      // reset localSettings
      setLocalSettings(null);
    }
  };

  const onClickDestination = (destinationId, type) => {
    const findIndex = selectedDestinations.findIndex(
      (item) => item.id === destinationId && item.type === type
    );
    if (findIndex > -1) {
      setSelectedDestinations(
        selectedDestinations.filter((item, index) => index !== findIndex)
      );
    } else {
      switch (type) {
        case 'fanpage':
          // check if there is a fanpage in selectedDestinations
          if (selectedDestinations.some((item) => item.type === 'fanpage')) {
            setSelectedDestinations(
              selectedDestinations.map((item) => {
                if (item.type === 'fanpage') {
                  return {
                    ...item,
                    id: destinationId,
                  };
                }
                return item;
              })
            );
          } else {
            setSelectedDestinations([
              ...selectedDestinations,
              { id: destinationId, type: type },
            ]);
          }
          break;

        default:
          setSelectedDestinations([
            ...selectedDestinations,
            { id: destinationId, type: type },
          ]);
          break;
      }
    }
  };

  const onCheckSchedule = () => {
    let isError = false;
    let message = '';
    if (!scheduleName && !selectedSchedule) {
      isError = true;
      message = 'Vui lòng chọn hoặc thêm lịch mới';
    } else {
      if (!selectedDestinations || selectedDestinations.length === 0) {
        isError = true;
        message = 'Vui lòng chọn một nơi để lên bài viết';
      }
    }
    const {
      contents = [],
      start_date = null,
      post_per_day = 0,
      source_type = '',
    } = localSettings || {};
    if (!start_date) {
      isError = true;
      message = 'Vui lòng kiểm tra lại ngày lên lịch';
    }
    if (post_per_day === 0) {
      isError = true;
      message = 'Vui lòng chọn số lượng bài đăng trong ngày';
    }
    if (isError) {
      toast.error(message, {
        autoClose: 5000,
        className: 'w-10/12',
      });
    } else {
      setIsDisableSubmit(true);
      try {
        const postingData = {
          ...localSettings,
          schedule_id: selectedSchedule,
          schedule_name: scheduleName,
          destinations: selectedDestinations,
        };
        userServices.checkMultipleContents(postingData).then((res) => {
          const { success = false, message = '', data = [] } = res?.data || {};
          if (success === false) {
            // toast.error(message);
            toast.error(
              <p
                className=" text-sm overflow-auto"
                dangerouslySetInnerHTML={{
                  __html: breakWord(message),
                }}
              ></p>,
              {
                autoClose: 20000,
              }
            );
            setIsDisableSubmit(false);
          } else {
            dispatch(setScheduleWaitingList(localSettings));
            // reset localSettings
            setLocalSettings(null);
            setScheduleResults(data);
            setIsShowCheckResults(true);
          }
        });
      } catch (error) {
        toast.error(error.message);
        setIsDisableSubmit(false);
      }
    }
  };

  const onChangedLocalSettings = (key, data) => {
    const newLocalSettings = {
      ...localSettings,
      [key]: data,
    };
    setLocalSettings(newLocalSettings);
  };

  return (
    <div className="finalStepContainer fixed left-0 top-0 z-9999 w-full h-screen">
      <div
        className={`justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none max-h-screen ${
          isShowCheckResults ? 'hidden' : ''
        }`}
      >
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
                  Lên lịch đăng bài tự động
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
                <Settings
                  localSettings={localSettings}
                  onChangedLocalSettings={onChangedLocalSettings}
                  hasThreads={hasThreads}
                />
              </div>
            </div>
            {/* footer */}
            <div className="mx-4 mb-4 flex gap-4 sticky bottom-0 bg-white p-3">
              <button
                className="border-2 border-gray-200 bg-gray-100 hover:bg-blue-50 py-3 px-4 text-gray-500 rounded-md"
                onClick={() => handleClickGoBack()}
              >
                Huỷ
              </button>
              <button
                className="border-2 border-gray-200 bg-gray-100 hover:bg-blue-50 py-3 px-4 text-gray-500 rounded-md"
                onClick={() => handleClickGoBack()}
              >
                Quay lại
              </button>
              <button
                className="border-2 border-gray-200 bg-blue-800 hover:bg-blue-400 py-3 px-4 text-white rounded-md"
                onClick={() => onCheckSchedule()}
                disabled={isDisableSubmit}
              >
                Kiểm tra kết quả
              </button>
            </div>
          </div>
        </div>
      </div>
      {isShowCheckResults && (
        <CheckResults
          result={scheduleResults}
          selectedSchedule={selectedSchedule}
          scheduleName={scheduleName}
          selectedDestinations={selectedDestinations}
          setIsShowCheckResults={setIsShowCheckResults}
          setIsDisableSubmit={setIsDisableSubmit}
        />
      )}
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </div>
  );
};

export default FinalStepAuto;
